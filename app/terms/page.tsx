import Link from "next/link";
import Image from "next/image";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Terms of Service — Devvoir",
    description: "Read the Devvoir Terms of Service to understand the rules and guidelines for using our platform.",
};

const EFFECTIVE_DATE = "March 1, 2025";
const COMPANY_EMAIL = "hello@devvoir.com";
const SITE_URL = "https://devvoir.com";

function Section({id, title, children}: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">{children}</div>
        </section>
    );
}

const TOC = [
    {id: "acceptance", label: "Acceptance of Terms"},
    {id: "description", label: "Description of Service"},
    {id: "accounts", label: "Accounts & Registration"},
    {id: "use", label: "Acceptable Use"},
    {id: "ip", label: "Intellectual Property"},
    {id: "data", label: "Your Data"},
    {id: "payments", label: "Payments & Credits"},
    {id: "disclaimer", label: "Disclaimers"},
    {id: "liability", label: "Limitation of Liability"},
    {id: "termination", label: "Termination"},
    {id: "changes", label: "Changes to Terms"},
    {id: "contact", label: "Contact"},
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
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
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                    >
                        Privacy Policy →
                    </Link>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-[220px_1fr] gap-10">
                    {/* Sidebar TOC */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contents</p>
                            {TOC.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="block text-sm text-gray-500 hover:text-purple-600 py-1 transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="min-w-0">
                        {/* Header */}
                        <div className="mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-purple-700 text-xs font-medium mb-4">
                                Legal
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                Terms of Service
                            </h1>
                            <p className="text-sm text-gray-400">Effective date: {EFFECTIVE_DATE}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-10">
                            <Section id="acceptance" title="1. Acceptance of Terms">
                                <p>
                                    By accessing or using Devvoir (&quot;the Service&quot;), available at{" "}
                                    <a href={SITE_URL} className="text-purple-600 hover:underline">{SITE_URL}</a>, you agree
                                    to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to all of
                                    these Terms, do not access or use the Service.
                                </p>
                                <p>
                                    These Terms apply to all visitors, users, and others who access or use the Service. By
                                    creating an account or using any part of the Service, you represent that you are at least
                                    18 years of age and have the legal capacity to enter into a binding agreement.
                                </p>
                            </Section>

                            <Section id="description" title="2. Description of Service">
                                <p>
                                    Devvoir is an AI-powered developer productivity tool that connects to your GitHub account
                                    to automatically generate standup reports, pull request summaries, and daily development
                                    activity reports from your commits and pull requests.
                                </p>
                                <p>
                                    The Service is currently in beta. This means features may change, be added, or be removed
                                    without notice, and we make no guarantees about uptime, availability, or accuracy of
                                    generated reports during this period.
                                </p>
                                <p>
                                    Devvoir requests <strong>read-only</strong> access to your GitHub repositories. We do not
                                    write to, modify, or delete any content in your repositories.
                                </p>
                            </Section>

                            <Section id="accounts" title="3. Accounts & Registration">
                                <p>
                                    To use Devvoir, you must authenticate using a valid GitHub account via OAuth. You are
                                    responsible for maintaining the confidentiality of your account credentials and for all
                                    activities that occur under your account.
                                </p>
                                <p>
                                    You agree to notify us immediately at{" "}
                                    <a href={`mailto:${COMPANY_EMAIL}`} className="text-purple-600 hover:underline">{COMPANY_EMAIL}</a>{" "}
                                    if you suspect any unauthorised use of your account.
                                </p>
                                <p>
                                    We reserve the right to suspend or terminate accounts that violate these Terms, engage in
                                    fraudulent activity, or that have been inactive for an extended period.
                                </p>
                            </Section>

                            <Section id="use" title="4. Acceptable Use">
                                <p>You agree not to use the Service to:</p>
                                <ul className="list-disc list-inside space-y-1.5 pl-2">
                                    <li>Violate any applicable law or regulation.</li>
                                    <li>Circumvent or abuse rate limits, quotas, or access controls.</li>
                                    <li>Attempt to reverse engineer, decompile, or extract the underlying AI models or
                                        proprietary technology of the Service.</li>
                                    <li>Scrape, crawl, or otherwise extract data from the Service in an automated manner
                                        without our express written permission.</li>
                                    <li>Use the Service to generate content that is illegal, harmful, defamatory, or that
                                        infringes on the intellectual property rights of others.</li>
                                    <li>Impersonate any person or entity, or misrepresent your affiliation with any person
                                        or entity.</li>
                                    <li>Introduce malware, viruses, or any other harmful code into the Service.</li>
                                    <li>Interfere with or disrupt the integrity or performance of the Service or its
                                        infrastructure.</li>
                                </ul>
                                <p>
                                    We reserve the right to investigate and take appropriate action against anyone who, in
                                    our sole discretion, violates this provision.
                                </p>
                            </Section>

                            <Section id="ip" title="5. Intellectual Property">
                                <p>
                                    The Service, including all software, design, text, graphics, logos, and other content
                                    created by Devvoir, is owned by Devvoir and protected by applicable intellectual property
                                    laws. You may not copy, modify, distribute, or create derivative works without our
                                    express written permission.
                                </p>
                                <p>
                                    You retain ownership of all content you submit to the Service (including your code,
                                    commit messages, and pull request descriptions). By using the Service, you grant Devvoir
                                    a limited, non-exclusive, royalty-free licence to access and process your GitHub data
                                    solely for the purpose of providing the Service to you.
                                </p>
                                <p>
                                    The AI-generated reports produced by the Service are provided to you for your personal
                                    or professional use. Devvoir does not claim ownership of report content generated on
                                    your behalf.
                                </p>
                            </Section>

                            <Section id="data" title="6. Your Data">
                                <p>
                                    We access your GitHub data (commits, pull request titles, descriptions, and file change
                                    diffs) solely to generate reports on your behalf. We do not store your raw source code.
                                    Generated reports and metadata are stored to provide you with history and regeneration
                                    features.
                                </p>
                                <p>
                                    You can request deletion of your account and associated data at any time by contacting
                                    us at{" "}
                                    <a href={`mailto:${COMPANY_EMAIL}`} className="text-purple-600 hover:underline">{COMPANY_EMAIL}</a>.
                                    Data deletion requests will be processed within 30 days.
                                </p>
                                <p>
                                    Please refer to our{" "}
                                    <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>{" "}
                                    for full details on how we collect, use, and protect your data.
                                </p>
                            </Section>

                            <Section id="payments" title="7. Payments & Credits">
                                <p>
                                    Devvoir offers a free tier during the beta period with a monthly report generation limit.
                                    Additional report credits may be purchased through our payment processor, Lemon Squeezy.
                                    All purchases are subject to Lemon Squeezy&apos;s terms and conditions.
                                </p>
                                <p>
                                    <strong>All purchases are final and non-refundable</strong> unless required by applicable
                                    law. Purchased credits do not expire and carry over month to month. Credits are tied to
                                    your account and are non-transferable.
                                </p>
                                <p>
                                    We reserve the right to change our pricing at any time. Any price changes will be
                                    communicated in advance and will not affect previously purchased credits.
                                </p>
                            </Section>

                            <Section id="disclaimer" title="8. Disclaimers">
                                <p>
                                    THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT
                                    WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES
                                    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                                </p>
                                <p>
                                    We do not warrant that the Service will be uninterrupted, error-free, or that AI-generated
                                    reports will be accurate, complete, or suitable for any particular purpose. You are
                                    responsible for verifying the accuracy of any generated content before using it in
                                    professional or team settings.
                                </p>
                                <p>
                                    Devvoir is not affiliated with GitHub, Inc. GitHub is a registered trademark of
                                    GitHub, Inc.
                                </p>
                            </Section>

                            <Section id="liability" title="9. Limitation of Liability">
                                <p>
                                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DEVVOIR AND ITS TEAM MEMBERS SHALL
                                    NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                                    INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO
                                    USE THE SERVICE.
                                </p>
                                <p>
                                    IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE GREATER OF (A)
                                    THE AMOUNT YOU PAID TO DEVVOIR IN THE 12 MONTHS PRIOR TO THE CLAIM, OR (B) $50 USD.
                                </p>
                            </Section>

                            <Section id="termination" title="10. Termination">
                                <p>
                                    You may stop using the Service at any time by revoking Devvoir&apos;s access from your
                                    GitHub account settings and requesting account deletion.
                                </p>
                                <p>
                                    We may suspend or terminate your access to the Service immediately, without prior notice
                                    or liability, for any reason, including if you breach these Terms. Upon termination,
                                    your right to use the Service will cease immediately.
                                </p>
                                <p>
                                    Sections on Intellectual Property, Disclaimers, Limitation of Liability, and any other
                                    sections which by their nature should survive, will survive termination.
                                </p>
                            </Section>

                            <Section id="changes" title="11. Changes to Terms">
                                <p>
                                    We reserve the right to modify these Terms at any time. We will notify users of material
                                    changes by updating the effective date at the top of this page and, where appropriate,
                                    by sending an email notification.
                                </p>
                                <p>
                                    Your continued use of the Service after any changes constitutes your acceptance of the
                                    new Terms. If you do not agree to the updated Terms, you must stop using the Service.
                                </p>
                            </Section>

                            <Section id="contact" title="12. Contact">
                                <p>
                                    If you have any questions about these Terms, please contact us at:
                                </p>
                                <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm space-y-1">
                                    <p className="font-medium text-gray-900">Devvoir</p>
                                    <p>
                                        Email:{" "}
                                        <a href={`mailto:${COMPANY_EMAIL}`} className="text-purple-600 hover:underline">
                                            {COMPANY_EMAIL}
                                        </a>
                                    </p>
                                    <p>
                                        Website:{" "}
                                        <a href={SITE_URL} className="text-purple-600 hover:underline">
                                            {SITE_URL}
                                        </a>
                                    </p>
                                </div>
                            </Section>
                        </div>

                        {/* Footer nav */}
                        <div className="mt-8 flex items-center justify-between text-sm text-gray-400">
                            <Link href="/" className="hover:text-purple-600 transition-colors">← Back to Home</Link>
                            <Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy Policy →</Link>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
