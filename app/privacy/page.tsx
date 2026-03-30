import Link from "next/link";
import Image from "next/image";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — Devvoir",
    description: "Learn how Devvoir collects, uses, and protects your personal data.",
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
    {id: "overview", label: "Overview"},
    {id: "data-collect", label: "Data We Collect"},
    {id: "how-use", label: "How We Use Your Data"},
    {id: "github", label: "GitHub Data Access"},
    {id: "third-parties", label: "Third-Party Services"},
    {id: "retention", label: "Data Retention"},
    {id: "security", label: "Security"},
    {id: "rights", label: "Your Rights"},
    {id: "cookies", label: "Cookies"},
    {id: "children", label: "Children's Privacy"},
    {id: "changes", label: "Changes to This Policy"},
    {id: "contact", label: "Contact Us"},
];

export default function PrivacyPage() {
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
                        href="/terms"
                        className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                    >
                        Terms of Service →
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
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-medium mb-4">
                                Legal
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                Privacy Policy
                            </h1>
                            <p className="text-sm text-gray-400">Effective date: {EFFECTIVE_DATE}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-10">
                            <Section id="overview" title="1. Overview">
                                <p>
                                    Devvoir (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your
                                    privacy. This Privacy Policy explains what information we collect, how we use it, and
                                    the choices you have when you use Devvoir, available at{" "}
                                    <a href={SITE_URL} className="text-purple-600 hover:underline">{SITE_URL}</a>.
                                </p>
                                <p>
                                    By using the Service, you agree to the collection and use of information in accordance
                                    with this policy. If you do not agree, please do not use the Service.
                                </p>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="font-medium text-blue-900 mb-1">The short version</p>
                                    <p className="text-blue-700">
                                        We only access the GitHub data needed to generate your reports. We don&apos;t sell
                                        your data. We don&apos;t store your source code. You can delete your account and
                                        all associated data at any time.
                                    </p>
                                </div>
                            </Section>

                            <Section id="data-collect" title="2. Data We Collect">
                                <p>We collect the following categories of information:</p>

                                <div className="space-y-4 mt-2">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">Account Information</p>
                                        <p>
                                            When you sign in via GitHub OAuth, we receive your GitHub username, display
                                            name, email address, and profile avatar URL. This is provided by GitHub as
                                            part of the OAuth authentication process.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">GitHub Repository Data</p>
                                        <p>
                                            To generate reports, we access — but do not permanently store — your commit
                                            messages, pull request titles, descriptions, and file change diffs (patches)
                                            from repositories you explicitly select. We access only what is necessary to
                                            produce the requested report.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">Generated Reports</p>
                                        <p>
                                            AI-generated report summaries are stored in our database, linked to your
                                            account and the associated pull request number. This allows you to view
                                            your report history and regenerate past reports.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">Usage & Quota Data</p>
                                        <p>
                                            We track the number of reports generated per month per account for the
                                            purposes of enforcing usage limits and calculating billing if you purchase
                                            additional credits.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">Log & Technical Data</p>
                                        <p>
                                            We may collect standard server logs including IP addresses, browser type,
                                            pages visited, and timestamps for security, debugging, and analytics purposes.
                                            This data is not sold or shared with third parties for advertising.
                                        </p>
                                    </div>
                                </div>
                            </Section>

                            <Section id="how-use" title="3. How We Use Your Data">
                                <p>We use the data we collect to:</p>
                                <ul className="list-disc list-inside space-y-1.5 pl-2">
                                    <li>Authenticate you and maintain your session.</li>
                                    <li>Fetch your GitHub activity and generate AI-powered reports on your behalf.</li>
                                    <li>Store report history so you can access and regenerate previous reports.</li>
                                    <li>Enforce usage quotas and manage purchased report credits.</li>
                                    <li>Send transactional emails related to your account (e.g., billing confirmations).</li>
                                    <li>Improve the quality and accuracy of the Service.</li>
                                    <li>Detect, prevent, and respond to fraud, abuse, and security incidents.</li>
                                    <li>Comply with applicable legal obligations.</li>
                                </ul>
                                <p>
                                    We do <strong>not</strong> use your data for advertising, sell it to third parties,
                                    or use it to train AI models without your explicit consent.
                                </p>
                            </Section>

                            <Section id="github" title="4. GitHub Data Access">
                                <p>
                                    Devvoir uses GitHub OAuth to authenticate you. We request the following GitHub
                                    permission scopes:
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 pl-2">
                                    <li>
                                        <strong>read:user</strong> — to access your public profile information (username,
                                        name, avatar).
                                    </li>
                                    <li>
                                        <strong>user:email</strong> — to access your verified email address for account
                                        identification.
                                    </li>
                                    <li>
                                        <strong>repo</strong> (read-only) — to list your repositories and read pull
                                        request data and file diffs for report generation.
                                    </li>
                                    <li>
                                        <strong>read:org</strong> — to list organisations you belong to, so you can
                                        generate reports for organisation repositories.
                                    </li>
                                </ul>
                                <p>
                                    We never write to, modify, delete, or create any content in your GitHub repositories.
                                    You can revoke Devvoir&apos;s access at any time from your{" "}
                                    <a
                                        href="https://github.com/settings/applications"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-600 hover:underline"
                                    >
                                        GitHub OAuth application settings
                                    </a>.
                                </p>
                            </Section>

                            <Section id="third-parties" title="5. Third-Party Services">
                                <p>
                                    We use the following third-party services that may process your data:
                                </p>
                                <div className="space-y-3 mt-2">
                                    {[
                                        {
                                            name: "GitHub (GitHub, Inc.)",
                                            desc: "OAuth authentication and repository data access. Governed by GitHub's Privacy Statement.",
                                        },
                                        {
                                            name: "Anthropic",
                                            desc: "AI model provider used to generate report summaries from your PR data. Data sent to Anthropic's API is subject to their usage policies. We do not send personally identifiable information to the AI model — only anonymised code change diffs and commit messages.",
                                        },
                                        {
                                            name: "Lemon Squeezy",
                                            desc: "Payment processor for credit purchases. Your payment details are handled entirely by Lemon Squeezy and are not stored on Devvoir servers.",
                                        },
                                        {
                                            name: "Vercel",
                                            desc: "Hosting and infrastructure provider. Vercel may collect standard server logs as part of hosting the Service.",
                                        },
                                        {
                                            name: "Cloudinary",
                                            desc: "Used to serve static assets such as the Devvoir logo.",
                                        },
                                    ].map((service) => (
                                        <div key={service.name} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="font-medium text-gray-900 mb-1">{service.name}</p>
                                            <p>{service.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <p>
                                    We are not responsible for the privacy practices of these third parties. We encourage
                                    you to review their privacy policies.
                                </p>
                            </Section>

                            <Section id="retention" title="6. Data Retention">
                                <p>
                                    We retain your account information and generated reports for as long as your account
                                    is active. If you delete your account, we will delete or anonymise your personal data
                                    within <strong>30 days</strong>, except where we are required to retain it for legal
                                    or compliance purposes (e.g., billing records).
                                </p>
                                <p>
                                    Server logs are retained for up to 90 days for security and debugging purposes, after
                                    which they are automatically deleted.
                                </p>
                                <p>
                                    Raw GitHub data (diffs, patches) fetched during report generation is processed
                                    in-memory and is <strong>not</strong> permanently stored in our database.
                                </p>
                            </Section>

                            <Section id="security" title="7. Security">
                                <p>
                                    We take reasonable technical and organisational measures to protect your data against
                                    unauthorised access, alteration, disclosure, or destruction. These measures include:
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 pl-2">
                                    <li>Encrypted data transmission using HTTPS/TLS.</li>
                                    <li>Secure storage of OAuth tokens with server-side encryption.</li>
                                    <li>Access controls limiting who within our team can access user data.</li>
                                    <li>Regular review of our security practices.</li>
                                </ul>
                                <p>
                                    However, no method of transmission over the internet or electronic storage is 100%
                                    secure. We cannot guarantee absolute security. If you discover a security vulnerability,
                                    please disclose it responsibly to{" "}
                                    <a href={`mailto:${COMPANY_EMAIL}`} className="text-purple-600 hover:underline">
                                        {COMPANY_EMAIL}
                                    </a>.
                                </p>
                            </Section>

                            <Section id="rights" title="8. Your Rights">
                                <p>
                                    Depending on your location, you may have the following rights regarding your personal
                                    data:
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 pl-2">
                                    <li>
                                        <strong>Access</strong> — request a copy of the personal data we hold about you.
                                    </li>
                                    <li>
                                        <strong>Correction</strong> — request that we correct inaccurate or incomplete data.
                                    </li>
                                    <li>
                                        <strong>Deletion</strong> — request that we delete your personal data (&quot;right to be
                                        forgotten&quot;).
                                    </li>
                                    <li>
                                        <strong>Portability</strong> — request your data in a structured, machine-readable
                                        format.
                                    </li>
                                    <li>
                                        <strong>Objection</strong> — object to the processing of your data in certain
                                        circumstances.
                                    </li>
                                    <li>
                                        <strong>Withdraw Consent</strong> — where processing is based on consent, withdraw
                                        it at any time without affecting prior processing.
                                    </li>
                                </ul>
                                <p>
                                    To exercise any of these rights, please contact us at{" "}
                                    <a href={`mailto:${COMPANY_EMAIL}`} className="text-purple-600 hover:underline">
                                        {COMPANY_EMAIL}
                                    </a>. We will respond within 30 days.
                                </p>
                            </Section>

                            <Section id="cookies" title="9. Cookies">
                                <p>
                                    Devvoir uses cookies and similar storage mechanisms for the following purposes:
                                </p>
                                <div className="space-y-3 mt-2">
                                    {[
                                        {
                                            name: "Session cookies",
                                            desc: "Used by NextAuth.js to maintain your authenticated session. These are strictly necessary for the Service to function and are deleted when you sign out.",
                                        },
                                        {
                                            name: "CSRF protection cookies",
                                            desc: "Used to prevent cross-site request forgery attacks. These are strictly necessary for security.",
                                        },
                                    ].map((cookie) => (
                                        <div key={cookie.name} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="font-medium text-gray-900 mb-1">{cookie.name}</p>
                                            <p>{cookie.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <p>
                                    We do not use advertising cookies or third-party tracking cookies. You can control
                                    cookies through your browser settings, but disabling essential cookies will prevent
                                    you from using the Service.
                                </p>
                            </Section>

                            <Section id="children" title="10. Children's Privacy">
                                <p>
                                    The Service is not directed at children under the age of 13 (or the applicable age of
                                    digital consent in your jurisdiction). We do not knowingly collect personal information
                                    from children. If you believe a child has provided us with personal data, please
                                    contact us immediately at{" "}
                                    <a href={`mailto:${COMPANY_EMAIL}`} className="text-purple-600 hover:underline">
                                        {COMPANY_EMAIL}
                                    </a>{" "}
                                    and we will take steps to delete that information.
                                </p>
                            </Section>

                            <Section id="changes" title="11. Changes to This Policy">
                                <p>
                                    We may update this Privacy Policy from time to time. We will notify you of significant
                                    changes by updating the effective date at the top of this page and, where appropriate,
                                    by sending an email to the address associated with your account.
                                </p>
                                <p>
                                    Your continued use of the Service after changes are posted constitutes your acceptance
                                    of the revised policy. We encourage you to review this page periodically.
                                </p>
                            </Section>

                            <Section id="contact" title="12. Contact Us">
                                <p>
                                    If you have any questions, concerns, or requests relating to this Privacy Policy or
                                    your personal data, please reach out to us:
                                </p>
                                <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm space-y-1">
                                    <p className="font-medium text-gray-900">Devvoir — Privacy Team</p>
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
                            <Link href="/terms" className="hover:text-purple-600 transition-colors">Terms of Service →</Link>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
