'use client';

import {marked} from 'marked';
import {signOut, useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import {FileChange} from '../api/ai/generate-summary/route';
import CodeDiff from '../components/CodeDiff';
import Dropdown from '../components/Dropdown';
import LoadingSpinner from '../components/LoadingSpinner';
import QuotaWarning from "@/app/components/QuotaWarning";
import {Icon} from "@iconify/react";
import {
    LucideArrowRight,
    LucideCheck,
    LucideGitBranch,
    LucideGitCommitHorizontal,
    LucideGitPullRequest,
    LucideLogOut,
    LucideRefreshCcw,
    LucideSparkles,
    LucideUsers
} from "@/utils/icons";
import {Button} from "@/app/components/Button";

type Repository = {
    name: string;
    description: string | null;
    private: boolean;
};

type PullRequest = {
    number: number;
    title: string;
    state: 'open' | 'closed';
    created_at: string;
    user: {
        login: string;
    };
};

type FileStatus = 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';

interface GitHubFile {
    sha: string;
    filename: string;
    status: FileStatus;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
    previous_filename?: string;
}

type PRChange = {
    prNumber: string;
    files: GitHubFile[];
    note?: string;
    title?: string;
    labels?: string[];
    state?: 'open' | 'closed';
    createdAt?: string;
    updatedAt?: string;
};

type DropdownOption = {
    label: string;
    value: string;
    description?: string;
    icon?: string;
    badge?: string;
    className?: string;
};

export interface Account {
    id: number;
    login: string;
    avatar_url: string;
    type: 'User' | 'Organization';
    name: string;
}

type Generation = {
    id: number;
    prNumber: number;
    summary: string;
    createdAt: string;
}

function ReportGenerator() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [repository, setRepository] = useState<string>('');
    const [selectedPR, setSelectedPR] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [repositories, setRepositories] = useState<DropdownOption[]>([]);
    const [fetchingRepos, setFetchingRepos] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [pullRequests, setPullRequests] = useState<DropdownOption[]>([]);
    const [isLoadingPRs, setIsLoadingPRs] = useState<boolean>(false);
    const [prChanges, setPrChanges] = useState<PRChange[]>([]);
    const [fileSearchTerm, setFileSearchTerm] = useState<string>('');
    const [approvedPRs, setApprovedPRs] = useState<Set<string>>(new Set());
    const [rejectedPRs, setRejectedPRs] = useState<Set<string>>(new Set());
    const [aiSummary, setAiSummary] = useState<string>('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
    const [prChangesEnabled, setPrChangesEnabled] = useState<boolean>(false);
    const [organizations, setOrganizations] = useState<DropdownOption[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<string>('');
    const [fetchingAccounts, setFetchingAccounts] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const [copyLoading, setCopyLoading] = useState<boolean>(false);
    const [copyError, setCopyError] = useState<string>('');
    const [monthlyQuota, setMonthlyQuota] = useState<{ used: number; totalAvailableReports: number, resetDate: Date | null, usedPurchasedReports: number }>({
        used: 0,
        totalAvailableReports: 20,
        resetDate: null,
        usedPurchasedReports: 0
    });
    const [showQuotaWarning, setShowQuotaWarning] = useState<boolean>(false);
    const [showRegenerateOptions, setShowRegenerateOptions] = useState<boolean>(false);
    const [regenerateLoading, setRegenerateLoading] = useState<boolean>(false);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [totalGenerations, setTotalGenerations] = useState<number>(generations.length);
    const [currentGeneration, setCurrentGeneration] = useState<number>(1);

    const reportRef = useRef<HTMLDivElement>(null);

    // Handle scrolling when generation status changes
    useEffect(() => {
        if (reportRef.current) {
            setTimeout(() => {
                if (isGeneratingSummary) {
                    reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (aiSummary && !generations.length) {
                    // Only scroll for new generations, not when switching between existing ones
                    reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Then after a small delay, scroll to the very bottom
                    setTimeout(() => {
                        window.scrollTo({
                            top: document.documentElement.scrollHeight,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }, 100);
        }
    }, [isGeneratingSummary, aiSummary, generations.length]);

    // Fetch repositories
    const fetchRepositories = async (owner: string): Promise<void> => {
        setFetchingRepos(true);
        setRepositories([]); // Clear existing repositories
        
        try {
            const response = await fetch('/api/github/repositories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: owner }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            const data = await response.json() as Repository[];
            
            const repoOptions: DropdownOption[] = data.map((repo) => ({
                label: repo.name,
                value: repo.name,
                description: repo.description || 'No description available',
                icon: repo.private ? "lucide:lock" : "lucide:globe-2",
                badge: repo.private ? 'Private' : 'Public'
            }));
            
            setRepositories(repoOptions);
        } catch (error) {
            console.error('Error fetching repositories:', error);
            setError('Failed to fetch repositories');
        } finally {
            setFetchingRepos(false);
        }
    };

    // Handle account selection
    const handleAccountSelect = async (value: string | string[]): Promise<void> => {
        if (typeof value === 'string') {
            setSelectedOrg(value);
            setRepository('');
            setSelectedPR('');
            setPrChanges([]);
            await fetchRepositories(value);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        // Check the cookie when component mounts
        const checkPRChangesEnabled = async () => {
            try {
                const response = await fetch('/api/settings/pr-changes');
                if (!response.ok) {
                    throw new Error('Failed to fetch settings');
                }
                await response.json();
                // setPrChangesEnabled(data.enabled !== false);
                setPrChangesEnabled(false);

            } catch (error) {
                console.error('Error fetching PR changes settings:', error);
                // Default to enabled if there's an error
                setPrChangesEnabled(true);
            }
        };
        checkPRChangesEnabled();
    }, []);

    useEffect(() => {
        const fetchOrganizations = async () => {
            setFetchingAccounts(true);
            try {
                const response = await fetch('/api/github/organizations');
                if (!response.ok) {
                    throw new Error('Failed to fetch organizations');
                }
                const data = await response.json();
                
                const orgOptions: DropdownOption[] = data.map((org: Account) => ({
                    label: org.login,
                    value: org.login,
                    description: `${org.type}${org.name ? ` - ${org.name}` : ''}`,
                    icon: org.type === 'Organization' ? "lucide:users" : "lucide:user"
                }));
                
                setOrganizations(orgOptions);
            } catch (error) {
                console.error('Error fetching organizations:', error);
                setError('Failed to fetch organizations');
            } finally {
                setFetchingAccounts(false);
            }
        };

        if (status === 'authenticated') {
            fetchOrganizations();
        }
    }, [status]);

    useEffect(() => {
        const fetchUserQuota = async () => {
            try {
                const response = await fetch('/api/user/settings');
                if (!response.ok) {
                    throw new Error('Failed to fetch user settings');
                }
                const data = await response.json();
                console.log('User quota data:', data); // Debug log
                setMonthlyQuota({
                    used: data.monthlyReportCount || 0,
                    resetDate: data.monthlyResetDate,
                    totalAvailableReports: data.totalAvailableReports,
                    usedPurchasedReports: data.usedPurchasedReports
                });
                const usagePercentage = ((data.monthlyReportCount || 0) / (data.totalAvailableReports || 20)) * 100;
                console.log('Usage percentage:', usagePercentage); // Debug log
                setShowQuotaWarning(usagePercentage >= 80);
            } catch (error) {
                console.error('Error fetching user quota:', error);
            }
        };
        fetchUserQuota();
    }, []);

    useEffect(() => {
        console.log('Monthly quota state:', monthlyQuota); // Debug log
        console.log('Show warning state:', showQuotaWarning); // Debug log
    }, [monthlyQuota, showQuotaWarning]);

    if (status === 'loading') {
        return <LoadingSpinner />;
    }

    if (!session?.user) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
    };

    const handleGenerations = async () => {
        try {
            if (!selectedPR) return null;

            const response = await fetch(`/api/generations?prNumber=${selectedPR}`);

            return await response.json();

        } catch (error) {
            console.log({error});
        }
    }

    const handleGenerateReport = async (): Promise<void> => {
        setLoading(true);
        try {
            if (selectedPR) {
                // Get PR changes
                const response = await fetch('/api/github/pr-changes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        owner: selectedOrg,
                        repo: repository,
                        prNumber: selectedPR,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch changes for PR #${selectedPR}`);
                }

                const files = await response.json();

                // Get PR details
                const prDetailsResponse = await fetch('/api/github/pulls', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        owner: selectedOrg,
                        repo: repository,
                    }),
                });

                if (!prDetailsResponse.ok) {
                    throw new Error('Failed to fetch PR details');
                }

                const pullRequests = await prDetailsResponse.json();
                const selectedPRDetails = pullRequests.find((pr) => pr.number.toString() === selectedPR);

                if (!selectedPRDetails) {
                    throw new Error('Selected PR details not found');
                }

                setPrChanges([{ 
                    prNumber: selectedPR, 
                    files,
                    note: files.length > 10 ? "Showing the 10 most important files based on changes and complexity" : "",
                    title: selectedPRDetails.title,
                    labels: selectedPRDetails.labels,
                    state: selectedPRDetails.state,
                    createdAt: selectedPRDetails.created_at,
                    updatedAt: selectedPRDetails.updated_at,
                }]);

                
                // Generate report
                await generateAISummary({
                    prChanges: {
                        prNumber: selectedPR,
                        files,
                        // title: selectedPRDetails.title,
                        // labels: selectedPRDetails.labels,
                        // state: selectedPRDetails.state,
                        // createdAt: selectedPRDetails.created_at,
                        // updatedAt: selectedPRDetails.updated_at,
                    }
                });
                
                const {generations} = await handleGenerations();

                setGenerations(generations.reverse());

                setTotalGenerations(generations.length);

                setCurrentGeneration(generations.length);

                const monthlyQuota = await fetch("/api/user/settings", {method: "GET"})
                const monthlyQuotaResponse = await monthlyQuota.json()

                setMonthlyQuota({
                    used: monthlyQuotaResponse.reportCount,
                    totalAvailableReports: monthlyQuotaResponse.totalAvailableReports,
                    resetDate: monthlyQuotaResponse.monthlyResetDate,
                    usedPurchasedReports: monthlyQuotaResponse.usedPurchasedReports
                })
            } else {
                setPrChanges([]);
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setError('Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch pull requests for the selected repository
    const fetchPullRequests = async ({ owner, repo }: { owner: string; repo: string }): Promise<void> => {
        setIsLoadingPRs(true);
        setPullRequests([]);
        setSelectedPR('');

        try {
            const response = await fetch('/api/github/pulls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ owner, repo }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pull requests');
            }

            const data = await response.json();
            const formattedPRs: DropdownOption[] = data.map((pr: PullRequest) => {
                const isOpen = pr.state === 'open';
                const statusEmoji = isOpen ? '🟢' : '🔴';
                const statusText = isOpen ? 'OPEN' : 'CLOSED';
                const formattedDate = new Date(pr.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                return {
                    value: pr.number.toString(),
                    label: `${statusEmoji} #${pr.number} ${pr.title}`,
                    description: `${statusText} • ${formattedDate} • ${pr.user.login}`,
                    icon: "lucide:git-pull-request",
                    className: isOpen ? 'text-green-700' : 'text-red-700'
                };
            });
            setPullRequests(formattedPRs);
        } catch (error) {
            console.error('Error fetching pull requests:', error);
        } finally {
            setIsLoadingPRs(false);
        }
    };

    // Update repository selection handler
    const handleRepositorySelect = async (value: string | string[]): Promise<void> => {
        if (typeof value === 'string') {
            setRepository(value);
            setSelectedPR('');
            setPrChanges([]);
            await fetchPullRequests({owner: selectedOrg, repo: value});
        }
    };

    // Function to generate AI summary
    const generateAISummary = async ({ prChanges }: { prChanges: { prNumber: string; files: FileChange[] } }): Promise<void> => {
        setIsGeneratingSummary(true);
        setError('');
        try {

            const visiblePRChange = prChanges.prNumber === selectedPR ? prChanges : null;

            if (!visiblePRChange) {
                throw new Error('Selected PR not found');
            }

            // Transform the data to match the API's expected format
            const formattedPRChange = {
                prNumber: parseInt(visiblePRChange.prNumber),
                files: visiblePRChange.files.map(file => ({
                    filename: file.filename,
                    status: file.status.toLowerCase() as 'added' | 'modified' | 'removed',
                    additions: file.additions,
                    deletions: file.deletions,
                    patch: file.patch
                })),
                // title: visiblePRChange.title,
                // labels: visiblePRChange.labels,
                // state: visiblePRChange.state,
                // createdAt: visiblePRChange.createdAt,
                // updatedAt: visiblePRChange.updatedAt,
            };

            const response = await fetch('/api/ai/generate-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prChanges: formattedPRChange }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 413) {
                    setError(data?.error || 'Changes are too large to analyze');
                } else {
                    throw new Error(data?.error || 'Failed to generate summary');
                }
                return;
            }

            if (!data?.summary) {
                setError('No summary was generated. Please try again with different parameters.');
                return;
            }

            setAiSummary(data.summary);
            // Fetch updated quota after successful generation
            // await fetchUserQuota();
        } catch (error) {
            // console.error('Error generating summary:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred while generating the summary. Please try again.');
            }
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const handleCopyReport = async () => {
        if (copyLoading) return;
        
        setCopyLoading(true);
        setCopyError('');
        
        try {
            const formattedText = aiSummary
                // Convert markdown headings
                .replace(/^### (.*$)/gm, '*$1*')
                .replace(/^## (.*$)/gm, '*$1*')
                .replace(/^# (.*$)/gm, '*$1*')
                // Convert markdown bold
                .replace(/\*\*(.*?)\*\*/g, '*$1*')
                // Convert markdown italic
                .replace(/_(.*?)_/g, '_$1_')
                // Convert markdown code blocks
                .replace(/```([\s\S]*?)```/g, '```$1```')
                .replace(/`([^`]+)`/g, '`$1`')
                // Convert markdown lists
                .replace(/^\s*[-*+]\s+/gm, '• ')
                .replace(/^\s*\d+\.\s+/gm, '$& ')
                // Clean up extra spaces and add proper spacing
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n\n');

            await navigator.clipboard.writeText(formattedText);
            setCopySuccess(true);
            
            // Reset success state after 2 seconds
            setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopyError('Failed to copy text to clipboard');
            
            // Reset error state after 3 seconds
            setTimeout(() => {
                setCopyError('');
            }, 3000);
        } finally {
            setCopyLoading(false);
        }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* {error && (
                        <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                            <button 
                                onClick={() => setError('')} 
                                className="absolute top-0 right-0 px-4 py-3"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-4 w-4 fill-current" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                                </svg>
                            </button>
                        </div>
                    )} */}
            <div className="flex items-center gap-2">
                <LucideGitCommitHorizontal className="w-8 h-8 text-purple-600"/>
              <div className="relative">
                  <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Devvoir
                  <div className="absolute -right-16 -top-1 transform rotate-12 group">
                    <div className="relative">
                        <span
                            className="absolute inset-0 bg-purple-600 rounded-lg blur-xs group-hover:blur-md transition-all duration-300"></span>
                        <span
                            className="relative block px-2 py-1 text-xs font-bold text-white bg-linear-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                        BETA
                      </span>
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full animate-ping"></span>
                    </div>
                  </div>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <Button Icon={LucideUsers} text={"Account"} onClick={() => router.push("/account")}/>
                <Button Icon={LucideLogOut} text={"Sign Out"} onClick={() => signOut({callbackUrl: "/"})}/>
            </div>
          </div>
        </header>

        {/* Quota Warning */}
          {showQuotaWarning && monthlyQuota.used > 0 && (
              <QuotaWarning used={monthlyQuota.used + monthlyQuota.usedPurchasedReports} total={monthlyQuota.totalAvailableReports} resetDate={monthlyQuota.resetDate}/>
          )}

          <main className={"container mx-auto px-4 pb-12 pt-8"}>
          <div className="max-w-3xl mx-auto space-y-8">
              <div
                  className="bg-white/80 backdrop-blur-xs rounded-2xl border border-gray-200/80 p-8 shadow-xl shadow-purple-500/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Selection Dropdown */}
                <Dropdown
                    Icon={LucideUsers}
                  label="Select Account"
                  options={organizations}
                  value={selectedOrg}
                  onChange={handleAccountSelect}
                  placeholder={
                    fetchingAccounts
                      ? "Loading accounts..."
                      : "Select an account or organization"
                  }
                  searchable
                  loading={fetchingAccounts}
                />

                {/* Repository Dropdown */}
                {
                  <div className="mt-6 animate-fadeIn">
                    <Dropdown
                        Icon={LucideGitBranch}
                      label="Repository"
                      options={repositories}
                      value={repository}
                      onChange={handleRepositorySelect}
                      placeholder={
                        fetchingRepos
                          ? "Loading repositories..."
                          : "Select repository"
                      }
                      searchable
                      loading={fetchingRepos}
                      disabled={!selectedOrg}
                    />
                  </div>
                }
                {/* Show other fields only when repository is selected */}
                {
                  <div className="space-y-6 animate-fadeIn">
                      {/*<div className={`relative flex rounded-lg px-5 py-4 shadow-md focus:outline-hidden border-2 border-gray-200 */}
                    {/*    bg-gray-50/50 cursor-not-allowed transition-all duration-300 mt-6`}*/}
                    {/*>*/}
                    {/*    <span className="absolute -top-2.5 right-3 inline-flex items-center text-[8px] font-bold tracking-wider uppercase*/}
                    {/*        bg-purple-600 text-white rounded-full px-2 py-0.5 shadow-sm">*/}
                    {/*        Coming Soon*/}
                    {/*    </span>*/}
                    {/*    <div className="flex w-full items-center justify-between">*/}
                    {/*        <div className="flex items-center">*/}
                    {/*            <div className="text-sm">*/}
                    {/*                <div className="flex items-center">*/}
                    {/*                    <span className="font-medium text-gray-600">Date Range</span>*/}
                    {/*                </div>*/}
                    {/*                <div className="text-gray-400">*/}
                    {/*                    Select time period for the report*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <div className="shrink-0 text-gray-300">*/}
                    {/*            <Clock className="h-6 w-6" />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                      {/*<div className="flex items-center bg-linear-to-r from-purple-50 to-blue-50 rounded-md px-3 py-2 -mt-2 mb-4 border border-purple-100">*/}
                      {/*    <InfoIcon className="h-4 w-4 text-purple-600 mr-2 shrink-0" />*/}
                    {/*    <span className="text-sm text-gray-700">*/}
                    {/*        All pull requests are currently included. Date filtering will be enabled soon.*/}
                    {/*    </span>*/}
                    {/*</div>*/}

                    <div
                        className={`relative flex rounded-lg px-5 py-4 shadow-md focus:outline-hidden border-2 border-gray-200 
                                        bg-gray-50/50 cursor-not-allowed transition-all duration-300 mt-6`}
                    >
                      <span
                        className="absolute -top-2.5 right-3 inline-flex items-center text-[8px] font-bold tracking-wider uppercase
                                            bg-purple-600 text-white rounded-full px-2 py-0.5 shadow-sm"
                      >
                        Coming Soon
                      </span>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-600">
                                Select Branches
                              </span>
                            </div>
                            <div className="text-gray-400">
                              Choose branches to include in the report
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-gray-300">
                            <LucideGitBranch className="h-6 w-6"/>
                        </div>
                      </div>
                    </div>

                    {/* Pull Requests Dropdown */}
                      <div>
                          <Dropdown
                              Icon={LucideGitPullRequest}
                              label="Pull Requests"
                              options={pullRequests}
                              value={selectedPR}
                              onChange={(value) => {
                                  console.log({value});
                                  if (typeof value === "string") {
                                      setSelectedPR(value);
                                  }
                              }}
                              placeholder={
                                  isLoadingPRs
                                      ? "Loading pull requests..."
                                      : "Select pull requests"
                              }
                              searchable
                              loading={isLoadingPRs}
                              disabled={!repository}
                              position="top"
                          />
                          <div className="flex items-center rounded-md py-2 mb-4 text-gray-700 text-xs">
                              Reports can be generated for pull requests with up to 10 file changes. For larger PRs,
                              only the first 10 files
                          </div>
                      </div>

                    {/* Generate Report Button */}
                    <button
                      onClick={handleGenerateReport}
                      disabled={
                        selectedPR.length === 0 ||
                        loading ||
                        aiSummary.length > 0
                      }
                      className={`
                                            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg 
                                            text-sm font-medium transition-all duration-300
                                            ${
                                              !loading &&
                                              selectedPR.length > 0 &&
                                              !aiSummary
                                                  ? "bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xs hover:shadow-lg hover:shadow-purple-500/20"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }
                                        `}
                    >
                      {loading ? (
                        <>
                            <LucideRefreshCcw className="w-4 h-4 animate-spin"/>
                          Generating...
                        </>
                      ) : aiSummary ? (
                        <>
                            <LucideCheck className="w-4 h-4"/>
                          Report Generated
                        </>
                      ) : (
                        <>
                            <LucideSparkles className="w-4 h-4"/>
                          Generate Report
                        </>
                      )}
                    </button>
                  </div>
                }
              </form>
                  <div className={'text-gray-600 text-sm text-center mt-3'}>Devvoir may make mistakes. Please verify
                      important details.
                  </div>
            </div>

            {/* PR Changes Cards */}
            {prChanges.length > 0 && prChangesEnabled && (
              <div className="mt-8 space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Pull Request Changes
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                        {prChanges.length} PRs
                      </span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            // Get the currently visible PRs
                            const visiblePRs = prChanges
                              .filter(({ files }) =>
                                files.some((file) =>
                                  file.filename
                                    .toLowerCase()
                                    .includes(fileSearchTerm.toLowerCase())
                                )
                              )
                              .map(({ prNumber }) => prNumber);

                            setRejectedPRs(new Set(visiblePRs));
                            setApprovedPRs((prev) => {
                              const newSet = new Set(prev);
                              visiblePRs.forEach((pr) => newSet.delete(pr));
                              return newSet;
                            });
                          }}
                          className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-colors"
                        >
                          Reject All
                        </button>
                        <button
                          onClick={() => {
                            // Get the currently visible PRs
                            const visiblePRs = prChanges
                              .filter(({ files }) =>
                                files.some((file) =>
                                  file.filename
                                    .toLowerCase()
                                    .includes(fileSearchTerm.toLowerCase())
                                )
                              )
                              .map(({ prNumber }) => prNumber);

                            setApprovedPRs(new Set(visiblePRs));
                            setRejectedPRs((prev) => {
                              const newSet = new Set(prev);
                              visiblePRs.forEach((pr) => newSet.delete(pr));
                              return newSet;
                            });

                            // Generate AI summary for approved PRs
                            // generateAISummary(visiblePRs);
                          }}
                          className="px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium transition-colors"
                        >
                          Approve All
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon={"lucide:search"} className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={fileSearchTerm}
                      onChange={(e) => setFileSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-black placeholder-gray-500 focus:outline-hidden focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {prChanges.map(({ prNumber, files, note }, index) => {
                    const pr = pullRequests.find((p) => p.value === prNumber);
                    const filteredFiles = files.filter((file) =>
                      file.filename
                        .toLowerCase()
                        .includes(fileSearchTerm.toLowerCase())
                    );
                    // Limit to first 10 files if there are more than 10 changes
                    const displayFiles =
                      filteredFiles.length > 10
                        ? filteredFiles.slice(0, 10)
                        : filteredFiles;
                    const totalAdditions = filteredFiles.reduce(
                      (sum: number, file: GitHubFile) => sum + file.additions,
                      0
                    );
                    const totalDeletions = filteredFiles.reduce(
                      (sum: number, file: GitHubFile) => sum + file.deletions,
                      0
                    );

                    if (filteredFiles.length === 0) return null;

                    return (
                      <div
                        key={index}
                        className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-purple-500/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
                      >
                        {/* PR Header */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                  <Icon icon={"lucide:git-pull-request"} className="w-5 h-5 text-purple-600"/>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {pr?.label || `PR #${prNumber}`}
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {files.length} file
                                  {files.length !== 1 ? "s" : ""} changed
                                  {filteredFiles.length > 10 &&
                                    " (showing first 10)"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span className="text-sm font-medium text-green-700">
                                  +{totalAdditions}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                <span className="text-sm font-medium text-red-700">
                                  -{totalDeletions}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Files List */}
                        <div className="divide-y divide-gray-100">
                          {displayFiles.map(
                            (file: GitHubFile, index: number) => (
                              <div
                                key={index}
                                className="p-6 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-1.5 rounded ${
                                        file.status === "added"
                                          ? "bg-green-100"
                                          : file.status === "removed"
                                          ? "bg-red-100"
                                          : file.status === "modified"
                                          ? "bg-yellow-100"
                                          : "bg-gray-100"
                                      }`}
                                    >
                                      {file.status === "added" ? (
                                        <svg
                                          className="w-4 h-4 text-green-700"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4v16m8-8H4"
                                          />
                                        </svg>
                                      ) : file.status === "removed" ? (
                                        <svg
                                          className="w-4 h-4 text-red-700"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="w-4 h-4 text-yellow-700"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                      {file.filename}
                                    </span>
                                  </div>
                                </div>
                                {file.patch && (
                                  <CodeDiff
                                    filename={file.filename}
                                    patch={file.patch}
                                  />
                                )}
                              </div>
                            )
                          )}
                        </div>

                        {(approvedPRs.has(prNumber) ||
                          rejectedPRs.has(prNumber)) && (
                          <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              {approvedPRs.has(prNumber) ? (
                                <>
                                    <Icon icon={"lucide:circle-check"} className="w-5 h-5 text-green-600"/>
                                  <span className="text-sm font-medium text-green-800">
                                    PR Approved
                                  </span>
                                </>
                              ) : (
                                <>
                                    <Icon icon={"lucide:circle-x"} className="w-5 h-5 text-red-600"/>
                                  <span className="text-sm font-medium text-red-800">
                                    PR Rejected
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        {note && (
                          <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <Icon icon={"lucide:info"} className="w-5 h-5 text-purple-600"/>
                              <span className="text-sm font-medium text-purple-800">
                                {note}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Summary Card */}
            {(aiSummary || isGeneratingSummary || error) && (
              <div ref={reportRef} className="mt-8 relative">
                {/* Decorative background elements */}
                  <div
                      className="absolute inset-0 bg-linear-to-br from-purple-50/50 via-transparent to-indigo-50/50 rounded-2xl"/>
                  <div
                      className="absolute -inset-0.5 bg-linear-to-r from-purple-500 to-indigo-500 rounded-2xl opacity-10 blur-xs group-hover:opacity-20 transition-opacity duration-500"/>

                  <div
                      className="bg-white/90 backdrop-blur-xs rounded-2xl overflow-hidden border border-gray-100/50 shadow-xl shadow-purple-100/30 relative z-0">
                      <div
                          className="bg-linear-to-br from-white via-white to-purple-50/30 px-8 py-6 border-b border-gray-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative z-0 group/icon">
                            <div
                                className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full opacity-75 blur-sm group-hover/icon:opacity-100 transition-all duration-300"/>
                            <div
                                className="relative z-0 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-indigo-600 ring-2 ring-purple-400/50">
                              <Icon icon={"lucide:brain"}
                                    className="w-5 h-5 text-white transform group-hover/icon:scale-110 transition-transform duration-300"/>
                          </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            AI Generated Report
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Generated on{" "}
                            {new Date(
                              generations[currentGeneration - 1]?.createdAt ||
                                new Date()
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Regenerate Button */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowRegenerateOptions(!showRegenerateOptions)
                            }
                            disabled={regenerateLoading}
                            className="relative overflow-hidden group flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:shadow-purple-500/20 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Regenerate report with different options"
                          >
                            {/* Background shine effect */}
                              <div
                                  className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform ease-out duration-700"/>

                            {/* Content wrapper */}
                            <div className="relative flex items-center gap-2">
                              {regenerateLoading ? (
                                <>
                                    <LucideRefreshCcw className="w-4 h-4 text-white animate-spin"/>
                                  <span className="text-sm font-medium">
                                    Regenerating...
                                  </span>
                                </>
                              ) : (
                                <>
                                    <LucideRefreshCcw
                                          className="w-4 h-4 text-white transform group-hover:rotate-180 transition-transform duration-500"/>
                                  <span className="text-sm font-medium">
                                    Regenerate
                                  </span>
                                </>
                              )}
                            </div>
                          </button>

                          {/* Regenerate Options Dropdown */}
                          {showRegenerateOptions && (
                              <div
                                  className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xs rounded-2xl shadow-2xl border border-purple-100/50 overflow-hidden z-50 animate-fadeIn">
                              {/* Header with gradient background */}
                              <div className="relative">
                                  <div className="absolute inset-0 bg-linear-to-r from-purple-600/5 to-blue-600/5"/>
                                <div className="px-6 py-4 relative">
                                    <h4 className="text-base font-semibold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Regenerate Options
                                  </h4>
                                </div>
                              </div>

                              {/* Options */}
                              <div className="p-3 space-y-2">
                                {/* Same Settings Option */}
                                <button
                                  onClick={async () => {
                                    setShowRegenerateOptions(false);
                                    setRegenerateLoading(true);
                                    try {
                                      await handleGenerateReport();
                                    } finally {
                                      setRegenerateLoading(false);
                                    }
                                  }}
                                  className="w-full group relative"
                                >
                                    <div
                                        className="absolute inset-0 bg-linear-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300"/>
                                  <div className="relative flex items-center gap-4 p-3">
                                    {/* Icon Container */}
                                      <div className="relative shrink-0">
                                          <div
                                              className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-xl opacity-10 group-hover:opacity-20 blur-xs transition-opacity duration-300"/>
                                          <div
                                              className="relative h-10 w-10 flex items-center justify-center bg-linear-to-r from-purple-50 to-blue-50 rounded-xl shadow-xs">
                                              <LucideRefreshCcw
                                                className="w-5 h-5 text-purple-600 group-hover:rotate-180 transition-transform duration-500"/>
                                      </div>
                                    </div>
                                    {/* Text Content */}
                                    <div className="flex flex-col items-start min-w-0">
                                      <span className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                                        Regenerate with same settings
                                      </span>
                                      <span className="text-xs text-gray-500 text-left">
                                        Generate a new report for the current PR
                                      </span>
                                    </div>
                                  </div>
                                </button>

                                {/* Different PR Option */}
                                <button
                                  onClick={() => {
                                    setShowRegenerateOptions(false);
                                    setAiSummary("");
                                    setSelectedPR("");
                                    setPrChanges([]);
                                  }}
                                  className="w-full group relative"
                                >
                                    <div
                                        className="absolute inset-0 bg-linear-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300"/>
                                  <div className="relative flex items-center gap-4 p-3">
                                    {/* Icon Container */}
                                      <div className="relative shrink-0">
                                          <div
                                              className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-xl opacity-10 group-hover:opacity-20 blur-xs transition-opacity duration-300"/>
                                          <div
                                              className="relative h-10 w-10 flex items-center justify-center bg-linear-to-r from-purple-50 to-blue-50 rounded-xl shadow-xs">
                                              <LucideGitPullRequest
                                                className="w-5 h-5 text-purple-600 transform group-hover:scale-110 transition-transform duration-300"/>
                                      </div>
                                    </div>
                                    {/* Text Content */}
                                    <div className="flex flex-col items-start min-w-0">
                                      <span className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                                        Select different PR
                                      </span>
                                      <span className="text-xs text-gray-500 text-left">
                                        Choose another pull request to analyze
                                      </span>
                                    </div>
                                  </div>
                                </button>

                                {/* Info Section */}
                                  <div
                                      className="relative mt-3 mx-3 p-4 bg-linear-to-r from-purple-50/50 to-blue-50/50 rounded-xl border border-purple-100/50">
                                  <div className="flex items-start gap-3">
                                      <div className="relative shrink-0">
                                          <div
                                              className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-full opacity-10 blur-[2px]"/>
                                      <div className="relative">
                                          <Icon icon={"lucide:info"} className="w-4 h-4 text-purple-600"/>
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs leading-relaxed text-gray-600">
                                        Note: Each regeneration uses one of your
                                        monthly generations.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Copy Button */}
                        <button
                          onClick={handleCopyReport}
                          disabled={copyLoading}
                          className="relative overflow-hidden flex items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 focus:outline-hidden"
                          title="Copy report to clipboard"
                          aria-label="Copy report to clipboard"
                        >
                          {copyLoading ? (
                            <LoadingSpinner />
                          ) : copySuccess ? (
                              <LucideCheck className="w-4 h-4 text-purple-500"/>
                          ) : (
                              <Icon icon={"lucide:copy"} className="w-4 h-4 text-gray-600"/>
                          )}
                        </button>
                        {copyError && (
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-max">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-red-500 rounded-lg opacity-20 blur-xs"/>
                                <div
                                    className="relative px-3 py-1.5 bg-red-50 text-red-800 text-xs font-medium rounded-lg shadow-xs border border-red-200/50 animate-fadeIn">
                                {copyError}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    {isGeneratingSummary ? (
                      <div className="px-8 py-12">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full blur-xl opacity-20" />
                            <div className="relative">
                              <LoadingSpinner fullScreen={false} />
                            </div>
                          </div>
                          <p className="text-gray-600 animate-pulse">
                            Generating your report...
                          </p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="px-8 py-6">
                        <div className="flex items-start gap-3 text-red-600">
                            <Icon icon={"lucide:circle-x"} className="w-5 h-5 mt-0.5"/>
                          <div>
                            <p className="font-medium">
                              Error Generating Report
                            </p>
                            <p className="text-sm text-red-500 mt-1">{error}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="divide-y divide-gray-100/50">
                          <div className="px-8 py-6 prose prose-purple max-w-none">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: marked(
                                  aiSummary ||
                                    generations[currentGeneration - 1].summary,
                                  { breaks: true }
                                ),
                              }}
                              className="prose prose-purple prose-headings:text-purple-900 prose-a:text-purple-600 hover:prose-a:text-purple-700
                                                                 prose-strong:text-purple-700 prose-code:text-purple-700 prose-pre:bg-purple-50
                                                                 prose-blockquote:border-l-purple-500 prose-blockquote:bg-purple-50/50
                                                                 prose-img:rounded-xl prose-hr:border-purple-200"
                            />
                          </div>
                        </div>
                        {totalGenerations > 1 && (
                          <div className="flex items-center justify-start gap-2 mt-4 px-8 pb-5">
                            <button
                              onClick={() => {
                                if (currentGeneration > 1) {
                                  setCurrentGeneration(currentGeneration - 1);
                                  setAiSummary(
                                    generations[currentGeneration - 2].summary
                                  );
                                  setTimeout(() => {
                                    window.scrollTo({
                                      top: document.documentElement
                                        .scrollHeight,
                                      behavior: "smooth",
                                    });
                                  }, 100);
                                }
                              }}
                              disabled={currentGeneration <= 1}
                              className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                <Icon icon={"lucide:arrow-left"} className="w-4 h-4"/>
                            </button>
                            <span className="text-black">
                              {currentGeneration} / {totalGenerations}
                            </span>
                            <button
                              onClick={() => {
                                if (currentGeneration < totalGenerations) {
                                  setCurrentGeneration(currentGeneration + 1);
                                  setAiSummary(
                                    generations[currentGeneration].summary
                                  );
                                  setTimeout(() => {
                                    window.scrollTo({
                                      top: document.documentElement
                                        .scrollHeight,
                                      behavior: "smooth",
                                    });
                                  }, 100);
                                }
                              }}
                              disabled={currentGeneration >= totalGenerations}
                              className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                <LucideArrowRight className="w-4 h-4"/>
                            </button>
                            <button
                              onClick={handleCopyReport}
                              disabled={copyLoading}
                              className="relative overflow-hidden flex items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 focus:outline-hidden"
                              title="Copy report to clipboard"
                              aria-label="Copy report to clipboard"
                            >
                              {copyLoading ? (
                                <LoadingSpinner />
                              ) : copySuccess ? (
                                  <LucideCheck className="w-4 h-4 text-purple-500"/>
                              ) : (
                                  <Icon icon={"lucide:copy"} className="w-4 h-4 text-gray-600"/>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
}

export default ReportGenerator;

<style jsx global>{`
    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .animate-gradient {
        animation: gradient 3s ease infinite;
    }
`}</style>