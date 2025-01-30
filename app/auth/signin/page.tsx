"use client";
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import SignInButton from "./SignInButton";
import {LucideBot, LucideClock, LucideGitCommitHorizontal, LucideUsers} from "@/utils/icons";

export default function AuthPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/report-generator');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-150" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-300" />
      </div>

      <div className="w-full max-w-lg mx-auto space-y-12">
        {/* Logo & Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-blue-600 blur-lg opacity-20"></div>
              <LucideGitCommitHorizontal className="w-10 h-10 relative text-purple-600"/>
            </div>
            <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent relative">
              Devvoir
              <div className="absolute -right-16 -top-1 transform rotate-12">
                <div className="relative group">
                  <div
                      className="absolute inset-0 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg opacity-75 blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <span
                      className="relative block px-2 py-1 text-xs font-bold text-white bg-linear-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                    BETA
                  </span>
                </div>
              </div>
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative">
          {/* Card glow effect */}
          <div
              className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
            {/* Top Banner */}
            <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LucideBot className="w-5 h-5"/>
                  <span className="font-medium">Beta Access Available</span>
                </div>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Limited Time</span>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started with Devvoir</h2>
                <p className="text-gray-600">Automate your daily dev updates in minutes</p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                    <LucideClock className="w-4 h-4 text-purple-600"/>
                  </div>
                  <span>Save 30+ minutes daily on manual reporting</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <LucideBot className="w-4 h-4 text-blue-600"/>
                  </div>
                  <span>AI-powered commit & PR analysis</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                    <LucideUsers className="w-4 h-4 text-indigo-600"/>
                  </div>
                  <span>Used by 2,000+ developers</span>
                </div>
              </div>

              {/* Auth Button */}
              <div className="space-y-4">
                <SignInButton />
                <p className="text-center text-sm text-gray-500">
                  Takes less than 2 minutes to set up
                </p>
              </div>

              {/* Social Proof */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div
                        className="text-2xl font-bold bg-linear-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                      2,000+
                    </div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div
                        className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      40%
                    </div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          {/* <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/signin" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign in here
            </a>
          </p> */}
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}