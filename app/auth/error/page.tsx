'use client';

import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import LoadingSpinner from '../../components/LoadingSpinner';
import Image from "next/image";

export default function ErrorPage() {
    const {status} = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <LoadingSpinner/>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(239,68,68,0.05),transparent)]"/>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:48px_48px]"/>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <Image
                        src="https://res.cloudinary.com/db2dcqpub/image/upload/v1738306393/zi1exolnzswosyutcksf.png"
                        alt="Devvoir Logo"
                        width={28}
                        height={28}
                        quality={90}
                    />
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Devvoir
                    </span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/80 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500"/>

                    <div className="p-8 text-center">
                        {/* Error icon */}
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                            </svg>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Authentication Failed
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            There was an error during the authentication process. This can happen if you denied access or if there was a network issue. Please try again.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/auth/signin')}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full py-2.5 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
