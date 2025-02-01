'use client';

import {Avatar} from '@/app/components/Avatar';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/app/components/ui/Card';
import {signOut, useSession} from 'next-auth/react';
import {redirect, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import {Product} from '../types/product';
import {
    LucideArrowLeft,
    LucideCrown,
    LucideFileText,
    LucideRefreshCw,
    LucideUser,
    SimpleIconsGithub
} from "@/utils/icons";

interface UsageMetrics {
    monthlyReportCount: number;
    monthlyReportLimit: number;
    additionalReportsPurchased: number;
    totalAvailableReports: number;
    reportCount: number;
    usedPurchasedReports: number;
}


export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [currentUsage, setCurrentUsage] = useState<UsageMetrics>({
        monthlyReportCount: 0,
        monthlyReportLimit: 20,
        additionalReportsPurchased: 0,
        totalAvailableReports: 20,
        reportCount: 0,
        usedPurchasedReports: 0
    });

    // State for PR changes toggle
    // const [showPRChanges, setShowPRChanges] = useState(false);

    // State for products
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Handle PR changes toggle
    // const handlePRChangesToggle = async (checked: boolean) => {
    //   setShowPRChanges(checked);
    //   try {
    //     const response = await fetch('/api/settings/pr-changes', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ enabled: checked }),
    //     });

    //     if (!response.ok) {
    //       throw new Error('Failed to update PR changes setting');
    //     }
    //   } catch (error) {
    //     console.error('Error updating PR changes setting:', error);
    //     // Revert the toggle if the API call fails
    //     setShowPRChanges(!checked);
    //   }
    // };

    // Handle product purchase
    const handlePurchase = async (product: Product) => {
        console.log(session?.user)
        if (!session?.user?.email || !session?.user?.name) {
            console.error('User session data missing');
            return;
        }

        // Get the correct variant ID based on the product
        const variantId = product.attributes.description.includes('25')
            ? process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_PLAN_VARIANT_ID
            : process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LITE_PLAN_VARIANT_ID;

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    variantId,
                    user: {
                        id: session.user.email, // Use email as the identifier
                        email: session.user.email,
                        name: session.user.name
                    },
                    product
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const data = await response.json();

            // Redirect to Lemon Squeezy checkout
            if (data?.data?.attributes?.url) {
                window.location.href = data.data.attributes.url;
            }
        } catch (error) {
            console.error('Error creating checkout:', error);
        }
    };

    // Fetch user settings and report counts
    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const response = await fetch('/api/user/settings');
                if (!response.ok) {
                    throw new Error('Failed to fetch user settings');
                }
                const data = await response.json();

                setCurrentUsage({
                    monthlyReportCount: data.monthlyReportCount || 0,
                    monthlyReportLimit: data.monthlyReportLimit || 20,
                    additionalReportsPurchased: data.additionalReportsPurchased || 0,
                    totalAvailableReports: data.totalAvailableReports || 20,
                    reportCount: data.reportCount || 0,
                    usedPurchasedReports: data.usedPurchasedReports || 0
                });
            } catch (error) {
                console.error('Error fetching user settings:', error);
            }
        };

        if (session?.user) {
            fetchUserSettings();
        }
    }, [session]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const productsData = await response.json();

                console.log('Fetched Products:', productsData);

                if (!productsData || productsData.length === 0) {
                    console.warn('No products found');
                }

                setProducts(productsData || []);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    if (status === 'loading') {
        return <LoadingSpinner />;
    }

    if (status === 'unauthenticated') {
        redirect('/auth/signin');
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Animated background elements */}
                <div className="absolute inset-0 -z-10">
                    <div
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                    <div
                        className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-150" />
                    <div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-300" />
                </div>

                <div className="w-full max-w-2xl mx-auto">
                    {/* Logo & Branding */}
                    <div className="mb-8">
                        <div className="grid grid-cols-3 items-center">
                            {/* Back Button */}
                            <div className="justify-self-start">
                                <button
                                    onClick={() => router.push('/report-generator')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:shadow-purple-500/20"
                                >
                                    <LucideArrowLeft className="w-4 h-4"/>
                                    Back
                                </button>
                            </div>

                            {/* Logo */}
                            {/*<div className="justify-self-center">*/}
                            {/*    <div className="inline-flex items-center justify-center gap-3">*/}
                            {/*        <div className="relative">*/}
                            {/*            <div*/}
                            {/*                className="absolute inset-0 bg-linear-to-br from-purple-600 to-blue-600 blur-lg opacity-20"></div>*/}
                            {/*            /!*<LucideGitCommitHorizontal*!/*/}
                            {/*            /!*    className="w-8 h-8 relative text-purple-600" />*!/*/}
                            {/*            <Image*/}
                            {/*                src={"https://res.cloudinary.com/db2dcqpub/image/upload/v1738306393/zi1exolnzswosyutcksf.png"}*/}
                            {/*                alt={"Devvoir Logo"}*/}
                            {/*                width={32}*/}
                            {/*                height={32}*/}
                            {/*                priority*/}
                            {/*                loading="eager"*/}
                            {/*                quality={90}*/}
                            {/*            />*/}
                            {/*        </div>*/}
                            {/*        <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent relative">*/}
                            {/*            Devvoir*/}
                            {/*            <div className="absolute -right-16 -top-1 transform rotate-12 group">*/}
                            {/*                <div className="relative">*/}
                            {/*                    <span*/}
                            {/*                        className="absolute inset-0 bg-purple-600 rounded-lg blur-xs group-hover:blur-md transition-all duration-300"></span>*/}
                            {/*                    <span*/}
                            {/*                        className="relative block px-2 py-1 text-xs font-bold text-white bg-linear-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">*/}
                            {/*                        BETA*/}
                            {/*                    </span>*/}
                            {/*                    <span*/}
                            {/*                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full animate-ping"></span>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </h1>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/* Sign Out Button */}
                            {/* <div className="justify-self-end">
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div> */}
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="relative">
                        {/* Card glow effect */}
                        <div
                            className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl blur-sm opacity-20 transition duration-1000"></div>

                        <Card className="relative bg-white/80 backdrop-blur-xs">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <CardTitle
                                            className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            Account Settings
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Profile Information */}
                                    <div className="bg-white rounded-xl p-6 shadow-xs space-y-5">
                                        <div
                                            className="flex items-center justify-between border-b border-gray-200 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-8 w-1 bg-linear-to-b from-purple-600 to-blue-600 rounded-full"></div>
                                                <h3 className="text-lg font-semibold text-gray-900">Profile
                                                    Information</h3>
                                            </div>
                                            {/* <button
                        onClick={() => router.push('/report-generator')}
                        className="relative overflow-hidden group flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        <GitCommit className="w-5 h-5" />
                        Report Generator
                      </button> */}
                                        </div>

                                        {/* Profile Content */}
                                        <div
                                            className="group bg-gray-50 hover:bg-white rounded-xl p-5 border border-gray-100 hover:border-purple-100 transition-all duration-300 hover:shadow-md">
                                            <div className="flex items-start space-x-6">
                                                <div className="relative group">
                                                    <div className="relative h-24 w-24">
                                                        <Avatar
                                                            src={session?.user?.image}
                                                            alt={session?.user?.name || 'User'}
                                                            fallback={session?.user?.name || 'User'}
                                                            className="h-24 w-24 ring-2 ring-purple-300 ring-offset-2 ring-offset-white"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <h4 className="text-xl font-semibold text-gray-900">{session?.user?.name}</h4>
                                                        <div className="mt-1 flex items-center gap-3">
                                                            <p className="text-sm text-gray-500">{session?.user?.email}</p>
                                                            <span
                                                                className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                Verified
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        {/* <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Icon icon={"lucide:calendar"} className="h-4 w-4"/>
                              <span>Joined {userSettings?.createdAt ? new Date(userSettings.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Loading...'}</span>
                            </div> */}
                                                        {session?.user?.login && (
                                                            <div
                                                                className="flex items-center gap-1.5 text-sm text-gray-500">
                                                                <SimpleIconsGithub className="h-4 w-4"/>
                                                                <a
                                                                    href={`https://github.com/${session.user.login}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="hover:text-purple-600 hover:underline"
                                                                >
                                                                    @{session.user.login}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connected Accounts */}
                                    <div className="bg-white rounded-xl p-8 shadow-xs space-y-6">
                                        {/* Header Section */}
                                        <div
                                            className="flex items-center justify-between border-b border-gray-100 pb-6">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="h-8 w-1 bg-linear-to-b from-purple-600 to-blue-600 rounded-full shadow-lg shadow-purple-200"></div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        Connected Accounts
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-0.5">Manage your integrations
                                                        and access</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {/* GitHub Integration */}
                                            <div className="group relative">
                                                <div
                                                    className="absolute inset-0 bg-linear-to-br from-purple-50/50 via-white to-blue-50/50 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>

                                                <div
                                                    className="relative bg-gray-50 group-hover:bg-white rounded-xl p-6 border border-gray-100 group-hover:border-purple-100 transition-all duration-300 group-hover:shadow-md">
                                                    <div
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        {/* Account Info */}
                                                        <div className="flex items-start gap-4">
                                                            <div className="shrink-0">
                                                                <div
                                                                    className="p-3 bg-purple-50 group-hover:bg-purple-100 rounded-xl shadow-xs transition-colors duration-300">
                                                                    <SimpleIconsGithub
                                                                        className="w-6 h-6 text-purple-600" />
                                                                </div>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-purple-900 transition-colors duration-300">
                                                                        GitHub Account
                                                                    </h4>
                                                                    <span
                                                                        className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                        Active
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className="flex items-center gap-2 text-sm text-gray-500">
                                                                    <LucideUser className="w-4 h-4"/>
                                                                    <span
                                                                        className="truncate">{session?.user?.login}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        {/* <div className="flex items-center gap-3">
                              <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <Icon icon="lucide:log-out" className="w-4 h-4" />
                                Disconnect
                              </button>
                            </div> */}
                                                    </div>

                                                    {/* <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Icon icon="lucide:shield" className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">Access Level</div>
                                <div className="text-sm text-gray-500">Repository Read</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                <Icon icon="lucide:check-circle" className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">Permissions</div>
                                <div className="text-sm text-gray-500">Commits, PRs</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-50 rounded-lg">
                                <Icon icon="lucide:refresh-cw" className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">Last Synced</div>
                                <div className="text-sm text-gray-500">Just now</div>
                              </div>
                            </div>
                          </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Usage & Limits */}
                                    <div className="bg-white rounded-xl p-8 shadow-xs space-y-6">
                                        {/* Header Section */}
                                        <div
                                            className="flex items-center justify-between border-b border-gray-100 pb-6">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="h-8 w-1 bg-linear-to-b from-purple-600 to-blue-600 rounded-full shadow-lg shadow-purple-200"></div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        Usage & Limits
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-0.5">Monitor your report
                                                        generations</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Code Analysis Reports Card */}
                                            <div className="group relative">
                                                {/* Subtle gradient background effect */}
                                                <div
                                                    className="absolute inset-0 bg-linear-to-br from-purple-50/50 via-white to-blue-50/50 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>

                                                <div
                                                    className="relative bg-gray-50 group-hover:bg-white rounded-xl p-6 border border-gray-100 group-hover:border-purple-100 transition-all duration-300 group-hover:shadow-md">
                                                    {/* Header */}
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                                            <div
                                                                className="p-3 bg-purple-50 group-hover:bg-purple-100 rounded-xl shadow-xs transition-colors duration-300">
                                                                <LucideFileText
                                                                    className="w-5 h-5 text-purple-600" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-base font-semibold text-gray-900 truncate group-hover:text-purple-900 transition-colors duration-300">
                                                                    Code Analysis Reports
                                                                </h4>
                                                                <p className="text-sm text-gray-500 mt-0.5 truncate">
                                                                    {currentUsage.additionalReportsPurchased
                                                                        ? `Monthly limit + ${currentUsage.additionalReportsPurchased} additional credits`
                                                                        : 'Monthly limit usage'
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span
                                                            className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-full whitespace-nowrap ml-3 shadow-xs">
                                                            Monthly Plan
                                                        </span>
                                                    </div>

                                                    {/* Usage Sections */}
                                                    <div className="space-y-6">
                                                        {/* Monthly Usage */}
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-gray-900">Monthly Limit</span>
                                                                    <div
                                                                        className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs">
                                                                        Free Plan
                                                                    </div>
                                                                </div>
                                                                <span className="text-sm font-medium text-purple-600">
                                                                    {Math.round((Math.min(currentUsage.monthlyReportCount, currentUsage.monthlyReportLimit) / currentUsage.monthlyReportLimit) * 100)}%
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="text-2xl font-bold text-gray-900">
                                                                    {Math.min(currentUsage.monthlyReportCount, currentUsage.monthlyReportLimit)}
                                                                    <span
                                                                        className="text-base font-medium text-gray-400 ml-1">
                                                                        / {currentUsage.monthlyReportLimit}
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            <div
                                                                className="relative w-full h-2.5 bg-purple-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="absolute top-0 left-0 h-full bg-linear-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${Math.min((Math.min(currentUsage.monthlyReportCount, currentUsage.monthlyReportLimit) / currentUsage.monthlyReportLimit) * 100, 100)}%`
                                                                    }}
                                                                >
                                                                    <div
                                                                        className="absolute inset-0 bg-linear-to-t from-black/[0.1] to-transparent"></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Additional Credits Usage */}
                                                        {currentUsage.additionalReportsPurchased > 0 && (
                                                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className="text-sm font-medium text-gray-900">Additional Credits</span>
                                                                        <div
                                                                            className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs">Extra
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-sm font-medium text-blue-600">
                                                                        {Math.round((currentUsage.usedPurchasedReports / currentUsage.additionalReportsPurchased) * 100)}
                                                                        %
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center justify-between mb-2">
                                                                    <p className="text-2xl font-bold text-gray-900">
                                                                        {currentUsage.usedPurchasedReports}
                                                                        <span
                                                                            className="text-base font-medium text-gray-400 ml-1">
                                                                            / {currentUsage.additionalReportsPurchased}
                                                                        </span>
                                                                    </p>
                                                                </div>

                                                                <div
                                                                    className="relative w-full h-2.5 bg-blue-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                                                        style={{
                                                                            width: `${(currentUsage.usedPurchasedReports / currentUsage.additionalReportsPurchased) * 100
                                                                                }%`
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className="absolute inset-0 bg-linear-to-t from-black/[0.1] to-transparent"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Usage Summary - Optional */}
                                                        <div className="pt-4 border-t border-gray-200">
                                                            <div
                                                                className="flex items-center justify-between text-sm text-gray-500">
                                                                <span>Total Reports Available: {currentUsage.totalAvailableReports}</span>
                                                                <span>Reports Used: {currentUsage.monthlyReportCount + currentUsage.usedPurchasedReports}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Display Settings */}
                                    {/* <div className="bg-white rounded-xl p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-linear-to-b from-purple-600 to-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-gray-900">Display Settings</h3>
                      </div>
                    </div>

                    <div className="group bg-gray-50 hover:bg-white rounded-xl p-5 border border-gray-100 hover:border-purple-100 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <label htmlFor="pr-changes" className="text-base font-medium text-gray-900">Show PR Changes</label>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-linear-to-r from-purple-500 to-blue-500 text-white">
                              Coming Soon
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Display file changes in pull request summaries</p>
                        </div>
                        <Switch
                          id="pr-changes"
                          checked={showPRChanges}
                          onCheckedChange={handlePRChangesToggle}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div> */}

                                    {/* Products Section */}
                                    <div className="mt-8">
                                        <Card className="relative overflow-hidden border border-gray-200">
                                            {/* Matching background with account page cards */}
                                            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs"></div>

                                            {/* Subtle decorative elements */}
                                            <div
                                                className="absolute -top-20 -left-20 w-96 h-96 bg-purple-100/20 rounded-full filter blur-3xl animate-pulse"></div>
                                            <div
                                                className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-100/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>

                                            <CardHeader className="relative z-10 text-center pb-12">
                                                {/* Refined header badge */}
                                                <div
                                                    className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 rounded-full mb-6 shadow-xs border border-purple-100">
                                                    <LucideRefreshCw className="w-5 h-5 text-purple-600"/>
                                                    <span
                                                        className="text-sm font-medium bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                                        Extend Your Limits
                                                    </span>
                                                </div>

                                                <CardTitle
                                                    className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                                                    Boost Your Report Generation
                                                </CardTitle>
                                                <p className="text-gray-600 text-base max-w-2xl mx-auto">
                                                    Elevate your workflow with additional report generation power.
                                                    Choose the perfect plan to match your reporting needs.
                                                </p>
                                            </CardHeader>

                                            <CardContent className="relative z-10 px-6 pb-12">
                                                {loadingProducts ? (
                                                    <div className="flex justify-center py-12">
                                                        <LoadingSpinner />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                                        {products
                                                            .filter(product =>
                                                                product.attributes.description.includes('25') || product.attributes.description.includes('10')
                                                            )
                                                            .map((product) => {
                                                                const is10Reports = product.attributes.description.includes('10');
                                                                const is25Reports = product.attributes.description.includes('25');

                                                                return (
                                                                    <div
                                                                        key={product.id}
                                                                        className="relative group h-full"
                                                                    >
                                                                        {/* Reduced glow on hover */}
                                                                        <div
                                                                            className={`absolute -inset-0.5 rounded-3xl blur-md opacity-0 transition duration-300 group-hover:opacity-50 ${is25Reports
                                                                                ? 'bg-linear-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40'
                                                                                : 'bg-linear-to-r from-gray-300/40 via-gray-400/40 to-gray-300/40'
                                                                                }`} />

                                                                        <div
                                                                            className="relative h-full p-8 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col">
                                                                            {/* Premium badge for 30 reports */}
                                                                            {is25Reports && (
                                                                                <div
                                                                                    className="absolute -top-4 right-16.5">
                                                                                    <div className="relative">
                                                                                        <div
                                                                                            className="absolute inset-0 rounded-full blur-xs bg-blue-500/20"></div>
                                                                                        <div
                                                                                            className="relative px-3 py-1.5 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm font-medium flex items-center gap-2">
                                                                                            <LucideCrown
                                                                                                className="w-4 h-4" />
                                                                                            Most Popular
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            <div className="flex flex-col h-full">
                                                                                {/* Title and Price */}
                                                                                <div className="text-center mb-8">
                                                                                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                                                                        {is10Reports ? 'Lite Pack' : 'Pro Pack'}
                                                                                    </h3>
                                                                                    <div
                                                                                        className="flex items-center justify-center gap-2">
                                                                                        <span
                                                                                            className="text-4xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                                                                            {product.attributes.price_formatted}
                                                                                        </span>
                                                                                        <span
                                                                                            className="text-gray-500 text-base mt-3">/pack</span>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Features list */}
                                                                                <div
                                                                                    className="space-y-4 grow mb-8">
                                                                                    <div
                                                                                        className="flex items-center gap-3">
                                                                                        <div
                                                                                            className={`w-6 h-6 rounded-full flex items-center justify-center ${is25Reports ? 'bg-blue-100' : 'bg-gray-100'
                                                                                                }`}>
                                                                                            <LucideFileText
                                                                                                className={`w-3.5 h-3.5 ${is25Reports ? 'text-blue-600' : 'text-gray-600'}`} />
                                                                                        </div>
                                                                                        <span className="text-gray-700">
                                                                                            {is10Reports ? '10 Generations' : '25 Generations'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div
                                                                                        className="flex items-center gap-3">
                                                                                        <div
                                                                                            className={`w-6 h-6 rounded-full flex items-center justify-center ${is25Reports ? 'bg-blue-100' : 'bg-gray-100'
                                                                                                }`}>
                                                                                            <LucideRefreshCw
                                                                                                className={`w-3.5 h-3.5 ${is25Reports ? 'text-blue-600' : 'text-gray-600'}`} />
                                                                                        </div>
                                                                                        <span className="text-gray-700">
                                                                                            Extends Monthly Limit
                                                                                        </span>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Description */}
                                                                                <p className="text-gray-600 text-center text-sm mb-8">
                                                                                    {is10Reports
                                                                                        ? 'Perfect for occasional report generation needs'
                                                                                        : 'Perfect for frequent report generation needs'}
                                                                                </p>

                                                                                {/* Button */}
                                                                                <button
                                                                                    onClick={() => handlePurchase(product)}
                                                                                    className={`w-full py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group ${is25Reports
                                                                                        ? 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xs hover:shadow-md'
                                                                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                                                                        }`}
                                                                                >
                                                                                    <span>Get {is10Reports ? '10' : '25'} Credits</span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                )}

                                                {/* Footer section */}
                                                {/* <div className="text-center mt-12">
                          <p className="text-sm text-gray-600">
                            Need a custom plan?
                            <button className="ml-1 text-purple-600 hover:text-purple-700 font-medium">
                              Contact our team
                            </button>
                          </p>
                        </div> */}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Account Actions */}
                                    <div className="bg-white rounded-xl p-6 shadow-xs space-y-5">
                                        <div
                                            className="flex items-center justify-between border-b border-gray-200 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-8 w-1 bg-linear-to-b from-purple-600 to-blue-600 rounded-full"></div>
                                                <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
                                            </div>
                                        </div>

                                        <div
                                            className="group bg-gray-50 hover:bg-white rounded-xl p-5 border border-gray-100 hover:border-purple-100 transition-all duration-300 hover:shadow-md">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h4 className="text-base font-medium text-gray-900">Sign Out</h4>
                                                    <p className="text-sm text-gray-500">Sign out from your account
                                                        across all devices</p>
                                                </div>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="relative overflow-hidden group flex items-center gap-2 px-6 py-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:shadow-purple-500/20"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3">
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
