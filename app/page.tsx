"use client";
import {useRouter} from 'next/navigation';
import {Button} from "@/app/components/Button";
import {
    LucideArrowRight,
    LucideBot,
    LucideCheck,
    LucideClock,
    LucideFileStack,
    LucideFileText,
    LucideGitCommitHorizontal,
    LucideGitPullRequest,
    LucideShare2,
    LucideSparkles,
    LucideX,
    SimpleIconsGithub,
    SimpleIconsLinkedin,
    SimpleIconsTwitter
} from "@/utils/icons";
import Image from "next/image";

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    bgGradient: string;
    features: string[];
}

const LandingPage = () => {
    const router = useRouter();

    const features: Feature[] = [
        {
            icon: <SimpleIconsGithub className="w-6 h-6 text-white"/>,
            title: "Connect GitHub",
            description: "Seamlessly integrate your GitHub account to get started with Devvoir.",
            bgGradient: "from-purple-500 to-violet-600",
            features: [
                "Simple account integration",
                "Organization account support",
                "Secure OAuth authentication"
            ]
        },
        {
            icon: <LucideFileStack className="w-6 h-6 text-white"/>,
            title: "Select & Generate",
            description: "Choose your account, repositories, and PRs to generate detailed reports.",
            bgGradient: "from-blue-500 to-indigo-600",
            features: [
                "Choose your account",
                "Select specific repositories",
                "Pick relevant pull requests"
            ]
        },
        {
            icon: <LucideShare2 className="w-6 h-6 text-white"/>,
            title: "Share & Iterate",
            description: "Share your generated reports and regenerate them as needed.",
            bgGradient: "from-indigo-500 to-blue-600",
            features: [
                "One-click copying",
                "Easy report sharing",
                "Flexible regeneration options"
            ]
        }
    ];

    const painPoints = [
        "Spending 30+ minutes writing daily updates",
        "Forgetting important details of your work",
        "Manually tracking commits and PRs",
        "Struggling with unclear or incomplete updates"
    ];

    const solutions = [
        "Automatic report generation saves your time",
        "AI captures all your development activity",
        "Instant insights from your GitHub activity",
        "Clear, comprehensive daily summaries"
    ];

    return (
        <div className="min-h-screen overflow-x-hidden bg-white">
            {/* Navigation */}
            <nav className="fixed w-full z-50 top-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mt-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-2xl px-5 py-3 shadow-sm shadow-gray-100">
                        <div className="flex items-center gap-2.5">
                            <Image
                                src="https://res.cloudinary.com/db2dcqpub/image/upload/v1738306393/zi1exolnzswosyutcksf.png"
                                alt="Devvoir Logo"
                                width={28}
                                height={28}
                                priority
                                loading="eager"
                                quality={90}
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Devvoir
                            </span>
                            <span className="text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-0.5 rounded-full">
                                BETA
                            </span>
                        </div>
                        <Button
                            Icon={LucideSparkles}
                            text="Get Started"
                            onClick={() => router.push("/auth/signin")}
                            iconPosition="left"
                        />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-36 pb-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(147,51,234,0.12),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(59,130,246,0.08),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />

                <div className="relative container mx-auto px-4 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-purple-700 text-sm font-medium mb-8">
                                <LucideSparkles className="w-3.5 h-3.5" />
                                Smart Dev Reports in Seconds
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
                                Code to reports,{" "}
                                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    instantly writes itself
                                </span>
                            </h1>

                            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
                                Stop spending time writing standup reports. Devvoir transforms your GitHub activity into polished, professional updates in seconds.
                            </p>

                            <div className="flex items-center gap-4 flex-wrap">
                                <Button
                                    Icon={LucideArrowRight}
                                    text="Get Started Free"
                                    iconPosition="right"
                                    onClick={() => router.push("/auth/signin")}
                                />
                                <p className="text-sm text-gray-400">No credit card required</p>
                            </div>

                            {/* Social proof */}
                            <div className="flex items-center gap-6 mt-10 pt-10 border-t border-gray-100">
                                {[
                                    { value: "100+", label: "Developers" },
                                    { value: "30 min", label: "Saved daily" },
                                    { value: "95%", label: "Satisfaction" },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Terminal mockup */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl" />
                            <div className="relative bg-gray-950 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
                                {/* Terminal header */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/60 border-b border-gray-800">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    </div>
                                    <span className="text-gray-500 text-xs ml-2 font-mono">devvoir — daily-report</span>
                                </div>

                                {/* Terminal content */}
                                <div className="p-5 space-y-4 font-mono text-sm">
                                    <div className="space-y-1">
                                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">GitHub Activity Detected</div>
                                        <div className="flex items-start gap-2.5 bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                                            <LucideGitCommitHorizontal className="w-4 h-4 text-blue-400 mt-0.5 shrink-0"/>
                                            <div>
                                                <div className="text-blue-300 text-xs">feat: Implement real-time data sync</div>
                                                <div className="text-gray-600 text-xs mt-0.5">3 commits · feature/realtime</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2.5 bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                                            <LucideGitPullRequest className="w-4 h-4 text-purple-400 mt-0.5 shrink-0"/>
                                            <div>
                                                <div className="text-purple-300 text-xs">PR: Enhance caching mechanism</div>
                                                <div className="text-gray-600 text-xs mt-0.5">Reviewed 5 files · In review</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-800" />

                                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                                        <div className="flex items-center gap-2 mb-2.5">
                                            <LucideBot className="w-4 h-4 text-green-400"/>
                                            <span className="text-green-400 text-xs font-semibold">AI Summary Generated</span>
                                        </div>
                                        <p className="text-gray-300 text-xs leading-relaxed">
                                            &quot;Focused on performance today. Implemented real-time sync and enhanced caching. All tests passing with 40% improvement in response times.&quot;
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
                                        <span className="text-green-400 text-xs">Time saved today</span>
                                        <span className="text-green-300 text-sm font-bold font-mono">35 min</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Devvoir — Problem / Solution */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
                            Why Devvoir?
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                            Focus on{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                writing code
                            </span>
                            , not status updates
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Every developer knows the pain of daily standup preparation. Devvoir eliminates it entirely.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Pain Points */}
                        <div className="bg-white rounded-2xl border border-red-100 p-7 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-6">
                                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                                    <LucideClock className="w-4 h-4 text-red-500"/>
                                </div>
                                <h3 className="font-semibold text-gray-900">Without Devvoir</h3>
                            </div>
                            <div className="space-y-3.5">
                                {painPoints.map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center mt-0.5 shrink-0">
                                            <LucideX className="w-3 h-3 text-red-500"/>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Solutions */}
                        <div className="bg-white rounded-2xl border border-green-100 p-7 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-6">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                    <LucideBot className="w-4 h-4 text-green-600"/>
                                </div>
                                <h3 className="font-semibold text-gray-900">With Devvoir</h3>
                            </div>
                            <div className="space-y-3.5">
                                {solutions.map((solution, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center mt-0.5 shrink-0">
                                            <LucideCheck className="w-3 h-3 text-green-600"/>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{solution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-12 gap-2">
                        <Button
                            Icon={LucideArrowRight}
                            text="Try It Now — It's Free"
                            onClick={() => router.push("/auth/signin")}
                            iconPosition="right"
                        />
                        <p className="text-sm text-gray-400">No credit card required • Free during beta</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                            How It Works
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                            Three steps to{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                effortless reports
                            </span>
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Generate comprehensive daily reports from your GitHub activity with just a few clicks.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {features.map((feature, idx) => (
                            <div key={idx} className="group relative bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                {/* Step number */}
                                <div className="absolute top-5 right-5 text-xs font-bold text-gray-200 tabular-nums">
                                    0{idx + 1}
                                </div>

                                {/* Icon */}
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-5">{feature.description}</p>

                                <ul className="space-y-2">
                                    {feature.features.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                                            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center shrink-0`}>
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                {/* Bottom accent */}
                                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.bgGradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example Report Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                            See what a report{" "}
                            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                looks like
                            </span>
                        </h2>
                        <p className="text-gray-500 text-lg">Clean, structured, and ready to share with your team.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                        {/* Report header */}
                        <div className="px-8 py-6 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-gray-100">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">End of Day Report — John&apos;s Activity</h3>
                                    <div className="flex items-center mt-1.5 text-gray-500 text-sm gap-1.5">
                                        <LucideClock className="w-3.5 h-3.5"/>
                                        <span>Thursday, November 2, 2024</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 text-xs font-semibold text-violet-700 bg-violet-100 rounded-full">
                                    AI Generated
                                </span>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Pull Requests */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <LucideGitPullRequest className="w-4 h-4 text-violet-600"/>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Pull Requests</h4>
                                </div>
                                <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">Feature: User Authentication (#123)</div>
                                            <div className="mt-1 text-gray-500 text-sm">Implemented OAuth flow with GitHub, added secure session management</div>
                                        </div>
                                        <span className="px-2.5 py-1 text-xs font-medium text-violet-700 bg-violet-100 rounded-full shrink-0">
                                            In Review
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Commits */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <LucideGitCommitHorizontal className="w-4 h-4 text-indigo-600"/>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Commits</h4>
                                </div>
                                <div className="space-y-2.5">
                                    {[
                                        { title: "feat: Add user authentication flow", desc: "Set up OAuth routes and handlers" },
                                        { title: "fix: Update session handling", desc: "Fixed session timeout issues and added refresh token support" },
                                    ].map((commit, i) => (
                                        <div key={i} className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                            <div className="font-semibold text-gray-900 text-sm">{commit.title}</div>
                                            <div className="mt-1 text-gray-500 text-sm">{commit.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <LucideFileText className="w-4 h-4 text-gray-700"/>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Summary</h4>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Today&apos;s focus was on implementing the user authentication system. Completed the GitHub OAuth integration and improved session management. All tests are passing and the PR is ready for review.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(139,92,246,0.12),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:48px_48px]" />

                <div className="relative container mx-auto px-4 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-8">
                        <LucideSparkles className="w-3.5 h-3.5"/>
                        AI-Powered Reports
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Never write manual<br />
                        <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                            standups again
                        </span>
                    </h2>

                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        Let AI handle your daily development reports while you focus on what matters — writing great code.
                    </p>

                    <div className="flex flex-col items-center gap-3">
                        <Button
                            Icon={LucideArrowRight}
                            text="Start Automating Your Reports"
                            onClick={() => router.push("/auth/signin")}
                            iconPosition="right"
                        />
                        <span className="text-sm text-gray-600">Get started in minutes • No setup needed</span>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto">
                        {[
                            { value: "100+", label: "Active Users" },
                            { value: "30 min", label: "Saved Daily" },
                            { value: "95%", label: "Satisfaction" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 max-w-7xl py-10">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-2.5">
                            <Image
                                src="https://res.cloudinary.com/db2dcqpub/image/upload/v1738306393/zi1exolnzswosyutcksf.png"
                                alt="Devvoir Logo"
                                width={24}
                                height={24}
                                quality={90}
                            />
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Devvoir
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <a href="https://x.com/DevvoirAI" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                                <SimpleIconsTwitter className="w-5 h-5"/>
                            </a>
                            <a href="https://www.linkedin.com/company/devvoir" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                                <SimpleIconsLinkedin className="w-5 h-5"/>
                            </a>
                        </div>

                        <div className="flex items-center gap-5 text-sm text-gray-400">
                            <a href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</a>
                            <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
                        </div>

                        <p className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} Devvoir. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
