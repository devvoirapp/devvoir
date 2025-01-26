'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ErrorPage() {
    const { status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Authentication Error</h2>
                    <p className="text-gray-600">
                        There was an error during the authentication process. Please try again.
                    </p>
                </div>
                <div className="mt-6">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
