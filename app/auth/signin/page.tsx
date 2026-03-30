"use client";
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import SignInButton from "./SignInButton";
import {LucideBot, LucideClock, LucideUsers} from "@/utils/icons";
import Image from "next/image";

export default function AuthPage() {
    const {status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/report-generator');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <LoadingSpinner/>;
    }

    if (status === 'authenticated') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(147,51,234,0.07),transparent)]"/>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:48px_48px]"/>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <Image
                        src="https://res.cloudinary.com/db2dcqpub/image/upload/v1738306393/zi1exolnzswosyutcksf.png"
                        alt="Devvoir Logo"
                        width={32}
                        height={32}
                        priority
                        quality={90}
                    />
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Devvoir
                    </span>
                    <span className="text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-0.5 rounded-full">
                        BETA
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/80 overflow-hidden">
                    {/* Top accent */}
                    <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-600"/>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Get Started with Devvoir
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Automate your daily dev updates in minutes
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="space-y-3 mb-8">
                            {[
                                {
                                    icon: <LucideClock className="w-4 h-4 text-purple-600"/>,
                                    color: "bg-purple-50",
                                    text: "Save 30+ minutes daily on manual reporting"
                                },
                                {
                                    icon: <LucideBot className="w-4 h-4 text-blue-600"/>,
                                    color: "bg-blue-50",
                                    text: "AI-powered commit & PR analysis"
                                },
                                {
                                    icon: <LucideUsers className="w-4 h-4 text-indigo-600"/>,
                                    color: "bg-indigo-50",
                                    text: "Used by 100+ developers"
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-sm text-gray-600">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Auth Button */}
                        <SignInButton/>

                        <p className="text-center text-xs text-gray-400 mt-3">
                            Takes less than 2 minutes to set up
                        </p>

                        {/* Divider + stats */}
                        <div className="mt-7 pt-7 border-t border-gray-100 flex justify-center gap-8">
                            {[
                                {value: "100+", label: "Active Users"},
                                {value: "40%", label: "Time Saved"},
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-purple-600 hover:text-purple-700 underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
