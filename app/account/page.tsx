'use client';

import {Avatar} from '@/app/components/Avatar';
import {signOut, useSession} from 'next-auth/react';
import {redirect, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import {Product} from '../types/product';
import {LucideArrowLeft, LucideFileText, LucideLogOut, LucideUser, SimpleIconsGithub} from "@/utils/icons";
import {Button} from "@/app/components/Button";
import Image from "next/image";

interface UsageMetrics {
    monthlyReportCount: number;
    monthlyReportLimit: number;
    additionalReportsPurchased: number;
    totalAvailableReports: number;
    reportCount: number;
    usedPurchasedReports: number;
}

export default function AccountPage() {
    const {data: session, status} = useSession();
    const router = useRouter();

    const [currentUsage, setCurrentUsage] = useState<UsageMetrics>({
        monthlyReportCount: 0,
        monthlyReportLimit: 15,
        additionalReportsPurchased: 0,
        totalAvailableReports: 15,
        reportCount: 0,
        usedPurchasedReports: 0
    });

    const [products, setProducts] = useState<Product[]>([]);

    const handlePurchase = async () => {
        if (!session?.user?.email || !session?.user?.name) return;

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    user: {
                        id: session.user.email,
                        email: session.user.email,
                        name: session.user.name
                    },
                    product: products?.at(0)
                }),
            });

            if (!response.ok) throw new Error('Failed to create checkout session');

            const data = await response.json();
            if (data?.data?.attributes?.url) {
                window.location.href = data.data.attributes.url;
            }
        } catch (error) {
            console.error('Error creating checkout:', error);
        }
    };

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const response = await fetch('/api/user/settings');
                if (!response.ok) throw new Error('Failed to fetch user settings');
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

        if (session?.user) fetchUserSettings();
    }, [session]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) throw new Error('Failed to fetch products');
                const productsData = await response.json();
                setProducts(productsData || []);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            }
        };
        fetchProducts();
    }, []);

    if (status === 'loading') return <LoadingSpinner/>;
    if (status === 'unauthenticated') redirect('/auth/signin');

    const handleSignOut = () => signOut({callbackUrl: '/'});

    const monthlyUsagePct = Math.min(
        (Math.min(currentUsage.monthlyReportCount, currentUsage.monthlyReportLimit) / currentUsage.monthlyReportLimit) * 100,
        100
    );
    const creditsUsagePct = currentUsage.additionalReportsPurchased > 0
        ? (currentUsage.usedPurchasedReports / currentUsage.additionalReportsPurchased) * 100
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/report-generator')}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            <LucideArrowLeft className="w-4 h-4"/>
                            Back
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image
                            src="https://res.cloudinary.com/db2dcqpub/image/upload/v1738306393/zi1exolnzswosyutcksf.png"
                            alt="Devvoir Logo"
                            width={24}
                            height={24}
                            quality={90}
                        />
                        <span className="text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Devvoir
                        </span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <LucideLogOut className="w-4 h-4"/>
                        Sign out
                    </button>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
                <h1 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h1>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Profile</h2>
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={session?.user?.image}
                            alt={session?.user?.name || 'User'}
                            fallback={session?.user?.name || 'User'}
                            className="h-14 w-14 ring-2 ring-purple-200 ring-offset-2"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                    {session?.user?.name}
                                </h3>
                                <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                    Verified
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5 truncate">{session?.user?.email}</p>
                            {session?.user?.login && (
                                <a
                                    href={`https://github.com/${session.user.login}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mt-1 transition-colors"
                                >
                                    <SimpleIconsGithub className="w-3.5 h-3.5"/>
                                    @{session.user.login}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Connected Accounts */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Connected Accounts</h2>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-xs">
                                <SimpleIconsGithub className="w-5 h-5 text-gray-800"/>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">GitHub</span>
                                    <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                        Active
                                    </span>
                                </div>
                                {session?.user?.login && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                        <LucideUser className="w-3 h-3"/>
                                        {session.user.login}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage & Limits */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage & Limits</h2>
                        <Button text="Purchase credits" onClick={handlePurchase}/>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-5">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                <LucideFileText className="w-4 h-4 text-purple-600"/>
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-medium text-gray-900">Code Analysis Reports</span>
                                    <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Monthly</span>
                                </div>
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                    Free Plan
                                </span>
                            </div>
                        </div>

                        {/* Monthly usage bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Monthly Limit</span>
                                <span className="font-medium text-gray-900">
                                    {Math.min(currentUsage.monthlyReportCount, currentUsage.monthlyReportLimit)}
                                    <span className="text-gray-400 font-normal"> / {currentUsage.monthlyReportLimit}</span>
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                    style={{width: `${monthlyUsagePct}%`}}
                                />
                            </div>
                            <div className="text-xs text-gray-400 text-right">{Math.round(monthlyUsagePct)}% used</div>
                        </div>

                        {/* Additional credits */}
                        {currentUsage.additionalReportsPurchased > 0 && (
                            <div className="space-y-2 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Additional Credits</span>
                                        <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">Extra</span>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {currentUsage.usedPurchasedReports}
                                        <span className="text-gray-400 font-normal"> / {currentUsage.additionalReportsPurchased}</span>
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                        style={{width: `${creditsUsagePct}%`}}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                            <span>Total available: {currentUsage.totalAvailableReports}</span>
                            <span>Used: {currentUsage.monthlyReportCount + currentUsage.usedPurchasedReports}</span>
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Actions</h2>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <div className="text-sm font-medium text-gray-900">Sign Out</div>
                            <div className="text-xs text-gray-400 mt-0.5">Sign out from your account across all devices</div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LucideLogOut className="w-4 h-4"/>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
