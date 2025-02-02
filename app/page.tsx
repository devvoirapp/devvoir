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

// const PricingSection = () => {
//     const plans = [
//         {
//             name: "Basic",
//             tagline: "Everything developers need to streamline their daily standups",
//             description: "Perfect for developers who want to automate their standups and share progress effortlessly. Get started with core features to boost your daily productivity.",
//             price: "Free",
//             period: "during beta",
//             features: [
//                 "30 report generations per month",
//                 "7-day report history",
//                 "Auto-detect commits & PRs",
//                 "AI-powered summary generation",
//                 "Multiple export formats (MD, PDF, HTML)"
//             ],
//             buttonText: "Get Started",
//             popular: false,
//             gradient: "from-purple-600 to-blue-600"
//         }
//     ];

//     return (
//         <section className="py-24 relative overflow-hidden">
//             {/* Background decorative elements */}
//             <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-white to-blue-50" />
//             <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse" />
//             <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000" />

//             <div className="container mx-auto px-4 relative">
//                 <div className="text-center max-w-3xl mx-auto mb-16">
//                     <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-purple-100 rounded-full">
//                         <span className="text-sm font-medium bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                             Beta Access
//                         </span>
//                     </div>
//                     <h3 className="text-4xl font-bold mb-6 text-gray-900">
//                         Simple, Transparent Pricing
//                     </h3>
//                     <p className="text-xl text-gray-600">
//                         Free during our beta period. Get early access and help shape the future of developer standups.
//                     </p>
//                 </div>

//                 <div className="max-w-lg mx-auto">
//                     {plans.map((plan, idx) => (
//                         <div key={idx} className="relative group">
//                             <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl border border-purple-100 group-hover:-translate-y-1 backdrop-blur-xs bg-white/80">
//                                 {/* Beta badge */}
//                                 <div className="absolute top-0 right-0">
//                                     <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white text-sm font-medium px-4 py-1 rounded-bl-lg">
//                                         Beta
//                                     </div>
//                                 </div>

//                                 {/* Hover gradient effect */}
//                                 <div className="absolute inset-0 bg-linear-to-br from-purple-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                                 <div className="p-8 relative">
//                                     {/* Plan header */}
//                                     <div className="mb-8">
//                                         <h4 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h4>
//                                         <p className="text-gray-600 mb-4">{plan.description}</p>
//                                         <div className="flex items-baseline gap-2">
//                                             <span className="text-5xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                                                 {plan.price}
//                                             </span>
//                                             {plan.period && (
//                                                 <span className="text-gray-600">{plan.period}</span>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Features list */}
//                                     <ul className="space-y-4 mb-8">
//                                         {plan.features.map((feature, idx) => (
//                                             <li key={idx} className="flex items-center gap-3">
//                                                 <div className="relative">
//                                                     <Check className="w-5 h-5 text-green-500 shrink-0" />
//                                                     <div className="absolute inset-0 animate-ping opacity-20">
//                                                         <Check className="w-5 h-5 text-green-500 shrink-0" />
//                                                     </div>
//                                                 </div>
//                                                 <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
//                                                     {feature}
//                                                 </span>
//                                             </li>
//                                         ))}
//                                     </ul>

//                                     {/* Beta note */}
//                                     <div className="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
//                                         <p className="text-sm text-purple-700">
//                                             Join our beta program and help shape the future of developer standups. Get early access to new features and updates.
//                                         </p>
//                                     </div>

//                                     {/* CTA Button */}
//                                     <button className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group">
//                                         <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
//                                         <span className="relative z-10">{plan.buttonText}</span>
//                                     </button>
//                                 </div>

//                                 {/* Decorative bottom border */}
//                                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-blue-600" />
//                             </Card>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// interface FAQ {
//     question: string;
//     answer: string;
//     icon: React.ReactNode;
//     additionalInfo?: string[];
// }

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    bgGradient: string;
    features: string[];
}

// const FAQItem = ({ faq, isOpen, onClick }: { faq: FAQ; isOpen: boolean; onClick: () => void }) => (
//     <div
//         className={`group bg-white rounded-xl transition-all duration-300 border cursor-pointer
//       ${isOpen ? 'shadow-lg border-violet-200' : 'hover:shadow-md border-gray-100'}`}
//         onClick={onClick}
//     >
//         <div className="p-6">
//             <div className="flex items-start gap-4">
//                 <div className={`p-2 rounded-lg transition-all duration-300 ${isOpen ? 'bg-violet-50 scale-110' : 'bg-gray-50 group-hover:scale-110'
//                     }`}>
//                     {faq.icon}
//                 </div>
//                 <div className="flex-1">
//                     <div className="flex items-center justify-between mb-2">
//                         <h4 className={`text-lg font-semibold transition-colors duration-200 ${isOpen ? 'text-violet-600' : 'text-gray-900 group-hover:text-violet-600'
//                             }`}>
//                             {faq.question}
//                         </h4>
//                         <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'text-violet-500 rotate-180' : 'text-gray-400 group-hover:text-violet-500'
//                             }`} />
//                     </div>
//                     <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
//                         }`}>
//                         <div className="overflow-hidden">
//                             <p className="text-gray-600 leading-relaxed py-2">
//                                 {faq.answer}
//                             </p>
//                             {faq.additionalInfo && (
//                                 <div className="mt-4 pt-4 border-t border-gray-100">
//                                     <h5 className="text-sm font-semibold text-gray-900 mb-2">Additional Information:</h5>
//                                     <ul className="space-y-2">
//                                         {faq.additionalInfo.map((info, idx) => (
//                                             <li key={idx} className="flex items-center text-sm text-gray-600">
//                                                 <ArrowRight className="w-4 h-4 text-violet-400 mr-2 shrink-0" />
//                                                 {info}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// const FAQSection = () => {
//     const [openIndex, setOpenIndex] = useState<number | null>(null);

//     const faqs: FAQ[] = [
//         {
//             question: "What GitHub permissions do you require?",
//             answer: "We only request read access to your commits and pull requests. We never modify your repositories or make changes on your behalf.",
//             icon: <Shield className="w-5 h-5 text-emerald-500" />,
//             additionalInfo: [
//                 "Read-only access to repositories",
//                 "No write permissions required",
//                 "Can be revoked at any time",
//                 "Compliance with GitHub's security guidelines"
//             ]
//         },
//         {
//             question: "How does the AI generate reports?",
//             answer: "Our AI analyzes your commits and PR descriptions to understand the context of your work. It then generates a comprehensive summary that's perfect for standups.",
//             icon: <Brain className="w-5 h-5 text-violet-500" />,
//             additionalInfo: [
//                 "Natural language processing of commit messages",
//                 "Context-aware summaries",
//                 "Customizable output formats",
//                 "Privacy-first approach to data handling"
//             ]
//         },
//         {
//             question: "Can I customize the report format?",
//             answer: "During the beta, we're gathering feedback on report formats. You'll be able to influence how reports are structured and what information is included.",
//             icon: <Settings className="w-5 h-5 text-blue-500" />,
//             additionalInfo: [
//                 "Multiple template options",
//                 "Custom sections support",
//                 "Flexible data organization",
//                 "Export in various formats"
//             ]
//         },
//         {
//             question: "How can I share reports with my team?",
//             answer: "Reports can be exported as Markdown or plain text, making them easy to share in your team's preferred communication tool.",
//             icon: <Share2 className="w-5 h-5 text-indigo-500" />,
//             additionalInfo: [
//                 "One-click export to Markdown",
//                 "Integration with popular team tools",
//                 "Automated sharing options",
//                 "Collaborative feedback features"
//             ]
//         }
//     ];

//     return (
//         <section className="py-24 bg-linear-to-b from-white to-gray-50">
//             <div className="container mx-auto px-4">
//                 <div className="text-center max-w-3xl mx-auto mb-16">
//                     <div className="flex items-center justify-center mb-4">
//                         <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-2 rounded-full">
//                             <MessageCircleQuestion className="w-4 h-4" />
//                             FAQ
//                         </span>
//                     </div>
//                     <h3 className="text-4xl font-bold mb-6 bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
//                         Frequently Asked Questions
//                     </h3>
//                     <p className="text-xl text-gray-600">
//                         Everything you need to know about Devvoir and how it works
//                     </p>
//                 </div>

//                 <div className="max-w-3xl mx-auto">
//                     <div className="grid gap-4">
//                         {faqs.map((faq, idx) => (
//                             <FAQItem
//                                 key={idx}
//                                 faq={faq}
//                                 isOpen={openIndex === idx}
//                                 onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
//                             />
//                         ))}
//                     </div>
//                 </div>

//                 {/* Enhanced Call to Action */}
//                 <div className="mt-16 flex flex-col items-center justify-center">
//                     <div className="bg-violet-50 rounded-xl p-6 max-w-2xl w-full text-center">
//                         <h4 className="text-lg font-semibold text-violet-900 mb-2">
//                             Still have questions?
//                         </h4>
//                         <p className="text-violet-700 mb-4">
//                             Can&apos;t find the answer you&apos;re looking for? Our support team is here to help!
//                         </p>
//                         <a
//                             href="#"
//                             className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200"
//                         >
//                             Contact Support
//                             <ArrowRight className="w-4 h-4" />
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// const MetricCard = () => (
//     <div className="bg-white/50 backdrop-blur-xs rounded-lg p-4 flex items-center gap-3 border border-gray-100">
//         <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
//             <Icon className="w-5 h-5 text-violet-500" />
//         </div>
//         <div>
//             <div className="text-2xl font-bold text-gray-900">{value}</div>
//             <div className="text-sm text-gray-600">{label}</div>
//         </div>
//     </div>
// );

// const TestimonialCard = ({ testimonial, isActive, onClick }) => (
//     <div
//         className={`group relative cursor-pointer transition-all duration-500 ${isActive ? 'md:-translate-y-4' : 'hover:-translate-y-2'
//             }`}
//         onClick={onClick}
//     >
//         {/* Animated background decoration */}
//         <div className={`absolute inset-0 bg-linear-to-r rounded-2xl blur opacity-20 
//       ${isActive
//                 ? 'from-violet-200 to-indigo-200 scale-105'
//                 : 'from-gray-100 to-gray-50 group-hover:scale-95'
//             }`}
//         />

//         <div className={`relative bg-white/90 backdrop-blur-xs p-8 rounded-2xl transition-all duration-500
//       ${isActive
//                 ? 'shadow-xl border-violet-200'
//                 : 'shadow-xs border-gray-100 group-hover:shadow-lg'
//             } border`}
//         >
//             {/* Verified Badge */}
//             <div className="absolute -top-3 -right-3">
//                 <div className="bg-violet-50 text-violet-600 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
//                     <Verified className="w-4 h-4" />
//                     Verified
//                 </div>
//             </div>

//             {/* Rating Stars */}
//             <div className="flex items-center gap-1 mb-6">
//                 {[...Array(5)].map((_, i) => (
//                     <Star key={i} className={`w-4 h-4 ${isActive ? 'fill-violet-400 text-violet-400' : 'fill-amber-400 text-amber-400'
//                         }`} />
//                 ))}
//             </div>

//             {/* Quote */}
//             <div className="relative">
//                 <Quote className={`w-8 h-8 absolute -top-4 -left-2 transform -scale-x-100 transition-colors duration-500 ${isActive ? 'text-violet-200' : 'text-gray-200'
//                     }`} />
//                 <p className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10">
//                     {testimonial.quote}
//                 </p>
//             </div>

//             {/* Impact Stats */}
//             <div className="grid grid-cols-2 gap-3 mb-6">
//                 {testimonial.stats.map((stat, idx) => (
//                     <div key={idx} className={`text-center p-3 rounded-lg transition-colors duration-500 ${isActive ? 'bg-violet-50' : 'bg-gray-50'
//                         }`}>
//                     <div className={`font-bold text-lg transition-colors duration-500 ${isActive ? 'text-violet-600' : 'text-gray-900'
//                         }`}>
//                         {stat.value}
//                     </div>
//                     <div className="text-sm text-gray-600">{stat.label}</div>
//                 </div>
//                 ))}
//             </div>

//             {/* Author Info */}
//             <div className="flex items-start gap-4 pt-6 border-t border-gray-100">
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg transition-all duration-500 ${isActive
//                     ? 'bg-linear-to-r from-violet-500 to-indigo-500'
//                     : 'bg-linear-to-r from-gray-700 to-gray-600'
//                     }`}>
//                     {testimonial.author[0]}
//                 </div>
//                 <div>
//                     <div className="font-semibold text-gray-900">{testimonial.author}</div>
//                     <div className="text-sm text-gray-600 mb-2">{testimonial.role}</div>
//                     <div className="flex items-center gap-2">
//                         <div className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-500 ${isActive
//                             ? 'bg-violet-50 text-violet-600'
//                             : 'bg-gray-100 text-gray-600'
//                             }`}>
//                             {testimonial.company}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// const TestimonialsSection = () => {
//     const [activeIndex, setActiveIndex] = useState(1);

//     const metrics = [
//         { icon: Users, label: "Active Users", value: "2,000+" },
//         { icon: Clock, label: "Time Saved", value: "40%" },
//         { icon: TrendingUp, label: "Productivity", value: "35%" }
//     ];

//     const testimonials = [
//         {
//             quote: "Devvoir has revolutionized our standup process. The AI-generated reports are incredibly accurate and have helped us save countless hours on documentation. The impact on our team's productivity has been remarkable!",
//             author: "Sarah Chen",
//             role: "Senior Developer",
//             company: "TechForward",
//             stats: [
//                 { value: "40%", label: "Time Saved" },
//                 { value: "95%", label: "Accuracy" }
//             ]
//         },
//         {
//             quote: "This tool has transformed how we track and report our daily progress. The automated summaries are detailed and well-structured, making our remote collaboration seamless. It's become indispensable for our team.",
//             author: "Mike Roberts",
//             role: "Full Stack Engineer",
//             company: "CloudScale",
//             stats: [
//                 { value: "2.5h", label: "Weekly Saved" },
//                 { value: "100%", label: "Adoption" }
//             ]
//         },
//         {
//             quote: "Perfect for distributed teams! The automated daily updates have significantly improved our communication. The AI's ability to distill complex work into clear, actionable reports is truly impressive.",
//             author: "Alex Kumar",
//             role: "Tech Lead",
//             company: "InnovateX",
//             stats: [
//                 { value: "30%", label: "Clarity" },
//                 { value: "50%", label: "Less Meetings" }
//             ]
//         }
//     ];

//     return (
//         <section className="py-24 bg-linear-to-b from-white via-gray-50 to-white overflow-hidden">
//             {/* Metrics Section */}
//             <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
//                 {metrics.map((metric, idx) => (
//                     <MetricCard key={idx} {...metric} />
//                 ))}
//             </div>

//             {/* Testimonials Header */}
//             <div className="text-center max-w-3xl mx-auto mb-16">
//                 <div className="flex items-center justify-center mb-4">
//                     <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-2 rounded-full">
//                         <MessageCircle className="w-4 h-4" />
//                         User Stories
//                     </span>
//                 </div>
//                 <h3 className="text-4xl font-bold mb-6 bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
//                     Loved by Developers
//                 </h3>
//                 <p className="text-xl text-gray-600">
//                     Join thousands of developers who've transformed their daily workflow
//                 </p>
//             </div>

//             {/* Testimonials Grid */}
//             <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto relative">
//                 {/* Background Decoration */}
//                 <div className="absolute inset-0 bg-linear-to-r from-violet-100/20 via-transparent to-indigo-100/20 blur-3xl" />

//                 {testimonials.map((testimonial, idx) => (
//                     <TestimonialCard
//                         key={idx}
//                         testimonial={testimonial}
//                         isActive={activeIndex === idx}
//                         onClick={() => setActiveIndex(idx)}
//                     />
//                 ))}
//             </div>

//             {/* CTA Section */}
//             <div className="mt-20 text-center">
//                 <div className="inline-flex flex-col items-center">
//                     <a
//                         href="#"
//                         className="group inline-flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-colors duration-200"
//                     >
//                         Start Automating Your Reports
//                         <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
//                     </a>
//                     <p className="mt-2 text-sm text-gray-600">
//                         Join 2,000+ developers using Devvoir
//                     </p>
//                 </div>
//             </div>
//         </section>
//     );
// };

// Custom Button Component
// interface ButtonProps {
//     children: React.ReactNode;
//     variant?: 'primary' | 'outline';
//     size?: 'default' | 'lg';
//     className?: string;
//     onClick?: () => void;
// }
//
// const Button = ({
//     children,
//     variant = 'primary',
//     size = 'default',
//     className = '',
//     ...props
// }: ButtonProps) => {
//     const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200";
//     const variants = {
//         primary: "bg-purple-600 hover:bg-purple-700 text-white",
//         outline: "border-2 border-gray-200 hover:border-gray-300 text-black hover:bg-gray-50",
//     };
//     const sizes = {
//         default: "px-4 py-2 text-sm",
//         lg: "px-6 py-3 text-base",
//     };
//
//     return (
//         <button
//             className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
//             {...props}
//         >
//             {children}
//         </button>
//     );
// };

// Custom Card Component
const Card = ({children, className = '', ...props}: { children: React.ReactNode, className?: string }) => {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

// const AboutSection = () => {
//     const values = [
//         {
//             icon: <Brain className="w-6 h-6 text-purple-500" />,
//             title: "AI-Powered Innovation",
//             description: "Leveraging cutting-edge AI to transform daily development workflows and enhance productivity."
//         },
//         {
//             icon: <Users className="w-6 h-6 text-blue-500" />,
//             title: "Developer-First",
//             description: "Built by developers for developers, focusing on what matters most: writing great code."
//         },
//         {
//             icon: <TrendingUp className="w-6 h-6 text-indigo-500" />,
//             title: "Continuous Improvement",
//             description: "Constantly evolving with the latest tech trends to provide the best development experience."
//         }
//     ];

//     return (
//         <section className="py-24 relative overflow-hidden">
//             <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-white to-blue-50" />
//             <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse" />
//             <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000" />

//             <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

//             <div className="container mx-auto px-4 relative">
//                 <div className="text-center max-w-3xl mx-auto mb-16">
//                     <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-purple-100 rounded-full">
//                         <span className="text-sm font-medium bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                             About Devvoir
//                         </span>
//                     </div>
//                     <h2 className="text-4xl font-bold mb-6 text-gray-900">
//                         Revolutionizing Developer
//                         <span className="block text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">
//                             Productivity
//                         </span>
//                     </h2>
//                     <p className="text-xl text-gray-600 mb-8">
//                         Devvoir is your AI-powered development companion, designed to streamline your workflow and enhance your daily standup experience.
//                     </p>

//                     <div className="relative max-w-2xl mx-auto mb-20 group">
//                         <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />

//                         <div className="relative p-8 bg-white/90 backdrop-blur-xs rounded-xl border border-gray-200/50 shadow-xl">
//                             <div className="flex flex-col items-center text-center space-y-6">
//                                 <div className="space-y-4">
//                                     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-blue-600 p-0.5 shadow-lg">
//                                         <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
//                                             <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">D</span>
//                                         </div>
//                                     </div>
//                                     <h3 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                                         Why &quot;Devvoir&quot;?
//                                     </h3>
//                                 </div>

//                                 <div className="flex flex-col items-center space-y-2">
//                                     <span className="text-lg font-medium text-gray-700">How to pronounce it</span>
//                                     <div className="flex items-center gap-3">
//                                         <span className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-50 to-blue-50 border border-purple-100 text-purple-700 font-mono text-lg tracking-wide shadow-xs">
//                                             /dev-vwär/
//                                         </span>
//                                         <button className="p-2 rounded-full hover:bg-purple-50 transition-colors group">
//                                             <MessageCircle className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* Meaning section */}
//                                 <div className="space-y-3">
//                                     <p className="text-lg text-gray-600 leading-relaxed">
//                                         Devvoir combines <span className="font-semibold text-purple-600">Dev</span> (for Developer) with 
//                                         <span className="font-semibold text-blue-600"> Devoir</span> (French for &quot;duty&quot; or &quot;task&quot;).
//                                     </p>
//                                     <p className="text-gray-600">
//                                         It represents our commitment to making developers&apos; daily duties more efficient and enjoyable.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>

//                 <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//                     {values.map((value, idx) => (
//                         <div key={idx} 
//                              className="group relative p-6 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//                             <div className="absolute inset-0 bg-linear-to-br from-purple-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

//                             <div className="relative">
//                                 <div className="w-12 h-12 rounded-lg bg-linear-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                                     {value.icon}
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
//                                 <p className="text-gray-600">{value.description}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

const LandingPage = () => {
    const router = useRouter();

    // const features = [
    //     {
    //         icon: <Github className="w-8 h-8 text-white" />,
    //         title: "Connect GitHub",
    //         description: "Link your GitHub account with one click",
    //         bgGradient: "from-purple-600 to-purple-700",
    //         features: ['Secure OAuth authentication', 'Access to your repos', 'Immediate setup']
    //     },
    //     {
    //         icon: <Bot className="w-8 h-8 text-white" />,
    //         title: "AI Analysis",
    //         description: "AI processes your daily activity",
    //         bgGradient: "from-blue-600 to-blue-700",
    //         features: ['Commit message analysis', 'PR description parsing', 'Code change summary']
    //     },
    //     {
    //         icon: <GitCommit className="w-8 h-8 text-white" />,
    //         title: "Daily Reports",
    //         description: "Get your standup report ready",
    //         bgGradient: "from-indigo-600 to-indigo-700",
    //         features: ['End-of-day summaries', 'Detailed work breakdown', 'Ready for standups']
    //     }
    // ];

    const features: Feature[] = [
        {
            icon: <SimpleIconsGithub className="w-8 h-8 text-white"/>,
            title: "Connect GitHub",
            description: "Seamlessly integrate your GitHub account to get started with Devvoir.",
            bgGradient: "from-purple-500 to-purple-600",
            features: [
                "Simple account integration",
                "Organization account support",
                "Secure OAuth authentication"
            ]
        },
        {
            icon: <LucideFileStack className="w-8 h-8 text-white"/>,
            title: "Select & Generate",
            description: "Choose your account, repositories, and PRs to generate detailed reports.",
            bgGradient: "from-blue-500 to-blue-600",
            features: [
                "Choose your account",
                "Select specific repositories",
                "Pick relevant pull requests"
            ]
        },
        {
            icon: <LucideShare2 className="w-8 h-8 text-white"/>,
            title: "Share & Iterate",
            description: "Share your generated reports and regenerate them as needed.",
            bgGradient: "from-indigo-500 to-indigo-600",
            features: [
                "One-click copying",
                "Easy report sharing",
                "Flexible regeneration options"
            ]
        }
    ];

    // const FeatureCard = ({ icon: Icon, title, description }) => (
    //     <div className="group relative p-6 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    //         {/* Gradient background effect */}
    //         <div className="absolute inset-0 bg-linear-to-br from-purple-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

    //         <div className="relative">
    //             {/* Icon wrapper */}
    //             <div className="w-12 h-12 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
    //                 <Icon className="w-6 h-6 text-white" />
    //             </div>

    //             {/* Content */}
    //             <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
    //             <p className="text-gray-600">{description}</p>
    //         </div>
    //     </div>
    // );

    const PainPoint = ({text}: { text: string }) => (
        <div className="flex items-start gap-3 mb-4">
            <div className="mt-1">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                    <LucideX className="w-3 h-3 text-red-500"/>
                </div>
            </div>
            <p className="text-gray-600">{text}</p>
        </div>
    );

    const Solution = ({text}: { text: string }) => (
        <div className="flex items-start gap-3 mb-4">
            <div className="mt-1">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <LucideCheck className={"w-3 h-3 text-green-500"}/>
                </div>
            </div>
            <p className="text-gray-600">{text}</p>
        </div>
    );

    // const WhyDevvoirSection = () => {
    //     const features = [
    //         {
    //             icon: Clock,
    //             title: "Save Valuable Time",
    //             description: "Spend more time coding and less time writing updates. Save 30+ minutes daily on manual reporting."
    //         },
    //         {
    //             icon: Brain,
    //             title: "AI-Powered Insights",
    //             description: "Our AI understands your work context, creating comprehensive summaries from your commits and PRs."
    //         },
    //         {
    //             icon: Shield,
    //             title: "Privacy First",
    //             description: "Read-only access to your repositories. Your code and data remain secure and private."
    //         }
    //     ];

    //     const benefits = [
    //         "Never forget what you worked on",
    //         "Professional, structured reports",
    //         "Instant standup updates",
    //         "Easy GitHub integration"
    //     ];

    //     return (
    //         <section className="py-24 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
    //             {/* Background decorative elements */}
    //             <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse" />
    //             <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000" />

    //             <div className="container mx-auto px-4">
    //                 {/* Section Header */}
    //                 <div className="text-center max-w-3xl mx-auto mb-16">
    //                     <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-purple-100 rounded-full">
    //                         <span className="text-sm font-medium bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
    //                             Why Choose Devvoir
    //                         </span>
    //                     </div>
    //                     <h2 className="text-4xl font-bold mb-6 text-gray-900">
    //                         The Smart Way to Track Your
    //                         <span className="block text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">
    //                             Development Journey
    //                         </span>
    //                     </h2>
    //                     <p className="text-xl text-gray-600">
    //                         Built for developers who want to focus on coding, not status reporting
    //                     </p>
    //                 </div>

    //                 {/* Features Grid */}
    //                 <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
    //                     {features.map((feature, idx) => (
    //                         <FeatureCard key={idx} {...feature} />
    //                     ))}
    //                 </div>

    //                 {/* Benefits List */}
    //                 <div className="max-w-2xl mx-auto">
    //                     <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-gray-200 p-8">
    //                         <h3 className="text-2xl font-bold text-gray-900 mb-6">
    //                             What You Get
    //                         </h3>
    //                         <div className="grid grid-cols-2 gap-4">
    //                             {benefits.map((benefit, idx) => (
    //                                 <div key={idx} className="flex items-center gap-3">
    //                                     <div className="relative">
    //                                         <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
    //                                         <div className="absolute inset-0 animate-ping opacity-20">
    //                                             <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
    //                                         </div>
    //                                     </div>
    //                                     <span className="text-gray-700">{benefit}</span>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* CTA */}
    //                 <div className="text-center mt-16">
    //                     <button className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 group">
    //                         <Sparkles className="w-5 h-5" />
    //                         <span>Try It Free</span>
    //                     </button>
    //                     <p className="mt-4 text-gray-600">
    //                         No credit card required • Free during beta
    //                     </p>
    //                 </div>
    //             </div>
    //         </section>
    //     );
    // };

    const WhyDevvoirSection = () => {
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
            <section className="py-24 relative overflow-hidden bg-linear-to-br from-gray-50 to-purple-50">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse"/>
                    <div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"/>
                </div>

                <div className="container mx-auto px-4 max-w-7xl relative">
                    <div className="text-center max-w-xl mx-auto mb-16">
                        <div
                            className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-purple-100 rounded-full">
                            <span
                                className="text-sm font-medium bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Why Devvoir?
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold mb-6 text-black">
                            Focus on <span
                            className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">Writing Code</span>,
                            <br/>Not Status Updates
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
                        {/* Left Side: Pain Points and Solutions */}
                        <div className="space-y-8">
                            {/* Pain Points */}
                            <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-red-600 mb-6 flex items-center gap-2">
                                    <LucideClock className="w-5 h-5"/>
                                    Time-Consuming Manual Updates
                                </h3>
                                {painPoints.map((point, idx) => (
                                    <PainPoint key={idx} text={point}/>
                                ))}
                            </div>

                            {/* Solutions */}
                            <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-green-600 mb-6 flex items-center gap-2">
                                    <LucideBot className={"w-5 h-5"}/>
                                    Automated AI Solutions
                                </h3>
                                {solutions.map((solution, idx) => (
                                    <Solution key={idx} text={solution}/>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Visual Demo */}
                        <div className="relative">
                            {/* Code window with before/after demonstration */}
                            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
                                {/* Window controls */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {/* Manual Update (Crossed Out) */}
                                        <div className="relative">
                                            <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-xs opacity-50">
                                                <div className="text-gray-400 mb-2 text-sm">Manual Update:</div>
                                                <p className="text-gray-500 font-mono text-sm">
                                                    Today I worked on... [typing indicator]
                                                </p>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div
                                                    className="bg-red-500/10 backdrop-blur-xs rounded-lg px-3 py-1 border border-red-500/20">
                                                    <span className="text-red-400 text-sm">Time Consuming</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Devvoir Generated (Active) */}
                                        <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-xs">
                                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                                                {/*<Bot className="w-4 h-4" />*/}
                                                <LucideBot className={"w-5 h-5"}/>
                                                <span
                                                    className="text-sm">Devvoir Generated:</span>
                                            </div>
                                            <div className="space-y-3 font-mono text-sm">
                                                <div className="text-green-300">
                                                    &quot;Implemented user authentication&quot;
                                                    <div className="text-gray-500 ml-4 text-xs">3 commits to
                                                        feature/auth
                                                    </div>
                                                </div>
                                                <div className="text-green-300">
                                                    &quot;Fixed API response caching&quot;
                                                    <div className="text-gray-500 ml-4 text-xs">2 commits to fix/cache
                                                    </div>
                                                </div>
                                                <div className="text-blue-300">
                                                    &quot;PR Review: Enhanced error handling&quot;
                                                    <div className="text-gray-500 ml-4 text-xs">Reviewed 5 files</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time Saved Indicator */}
                                    <div className="mt-6 bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                                        <div className="flex items-center justify-between text-green-400 text-sm">
                                            <span>Time Saved Today</span>
                                            <span className="font-mono">35 minutes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col items-center justify-center mt-8 text-center">
                                <Button Icon={LucideArrowRight} text={"Try It Now - It's Free"}
                                        onClick={() => router.push("/auth/signin")} iconPosition={"right"}/>
                                <p className="mt-3 text-sm text-gray-600">
                                    No credit card required • Free during beta
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    // const [activeLink, setActiveLink] = useState('features');

    // const navLinks = [
    //     { id: 'features', icon: Brain, label: 'Features' },
    //     { id: 'how-it-works', icon: Bot, label: 'How It Works' },
    //     { id: 'pricing', icon: Shield, label: 'Pricing' },
    //     { id: 'testimonials', icon: Users, label: 'Reviews' },
    //     { id: 'faq', icon: MessageCircle, label: 'FAQ' }
    // ];

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Header/Navigation */}
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
                <div className="container mx-auto px-4 max-w-7xl py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {/*<LucideGitCommitHorizontal className="w-8 h-8 text-purple-600"/>*/}
                        <Image
                            src={"https://res.cloudinary.com/db2dcqpub/image/upload/v1738306393/zi1exolnzswosyutcksf.png"}
                            alt={"Devvoir Logo"}
                            width={32}
                            height={32}
                            priority
                            loading="eager"
                            quality={90}
                        />
                        <div className="relative">
                            <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Devvoir
                                <div className="absolute -right-16 -top-1 transform rotate-12 group">
                                    <div className="relative">
                                        <span
                                            className="absolute inset-0 bg-purple-600 rounded-lg blur-xs group-hover:blur-md transition-all duration-300"></span>
                                        <span
                                            className="relative block px-2 py-1 text-xs font-bold text-white bg-linear-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                                            BETA
                                        </span>
                                        <span
                                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full animate-ping"></span>
                                    </div>
                                </div>
                            </h1>
                        </div>
                    </div>

                    {/* <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setActiveLink(id)}
                                className={`
                group relative px-4 py-2 rounded-lg transition-all duration-300
                ${activeLink === id ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}
              `}
                            >
                                <div className={`
                absolute inset-0 rounded-lg transition-all duration-300
                ${activeLink === id
                                        ? 'bg-purple-50'
                                        : 'bg-transparent group-hover:bg-purple-50/50'}
              `} />

                                <div className="relative flex items-center gap-2">
                                    <Icon className={`
                  w-4 h-4 transition-all duration-300
                  ${activeLink === id
                                            ? 'transform rotate-6 scale-110'
                                            : 'group-hover:transform group-hover:rotate-6 group-hover:scale-110'}
                `} />
                                    <span className="font-medium">{label}</span>
                                </div>

                                {activeLink === id && (
                                    <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-linear-to-r from-purple-600 to-blue-600">
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div> */}
                    <Button Icon={LucideSparkles} text={"Get Started"} onClick={() => router.push("/auth/signin")}
                            iconPosition={"left"}/>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-linear-to-br from-purple-50 via-white to-blue-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-800 font-medium text-sm mb-6">
                                ✨ Smart Dev Reports in Seconds
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                                Code to Reports,
                                <span
                                    className="block text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">
                                   Instantly Writes Itself
                                </span>
                            </h2>
                            <p className="text-xl text-gray-800 mb-8">
                                Stop spending time writing standup reports. Devvoir transforms your GitHub activity into
                                polished, professional updates in just a few clicks.
                            </p>
                            <Button Icon={LucideArrowRight} text={"Get Started"} iconPosition={"right"}
                                    onClick={() => router.push("/auth/signin")}/>
                        </div>

                        <div className="relative">
                            {/* Decorative blobs */}
                            <div
                                className="absolute -top-8 -left-8 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-pulse max-w-full"></div>
                            <div
                                className="absolute -bottom-8 -right-8 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000 max-w-full"></div>

                            {/* Code window */}
                            <div className="relative bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
                                {/* Window controls */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Code content */}
                                <div className="p-6 font-mono text-sm">
                                    <div className="space-y-4">
                                        <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-xs">
                                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                                                <LucideGitCommitHorizontal className="w-4 h-4"/>
                                                <span
                                                    className="text-sm">feat: Implement real-time data synchronization</span>
                                            </div>
                                            <p className="text-gray-300 text-sm">
                                                &quot;Added WebSocket integration for live updates, optimized payload
                                                structure for better performance&quot;
                                            </p>
                                        </div>

                                        <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-xs">
                                            <div className="flex items-center gap-2 text-purple-400 mb-2">
                                                <LucideGitPullRequest className="w-4 h-4"/>
                                                <span className="text-sm">PR: Enhance caching mechanism</span>
                                            </div>
                                            <p className="text-gray-300 text-sm">
                                                &quot;Implemented Redis caching layer, reduced API latency by 60%, added
                                                cache invalidation strategy&quot;
                                            </p>
                                        </div>

                                        <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-xs">
                                            <div className="flex items-center gap-2 text-green-400 mb-2">
                                                <LucideBot className={"w-5 h-5"}/>
                                                <span className="text-sm">Daily Summary</span>
                                            </div>
                                            <p className="text-gray-300 text-sm">
                                                &quot;Focused on performance optimizations today. Implemented real-time
                                                sync
                                                and enhanced caching. All tests passing with 40% improvement in response
                                                times.&quot;
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Devvoir */}
            <WhyDevvoirSection/>

            {/* About */}
            {/* <AboutSection /> */}

            {/* How It Works */}
            <section className="py-24 relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50"/>
                <div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse"/>
                <div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"/>

                <div className="container mx-auto px-4 max-w-7xl relative">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div
                            className="inline-flex items-center justify-center px-4 py-2 bg-purple-100 rounded-full mb-6">
            <span
                className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              How It Works
            </span>
                        </div>
                        <h3 className="text-4xl font-bold mb-6 text-gray-900">
                            Simple Steps to
                            <span
                                className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Generate Your Reports
            </span>
                        </h3>
                        <p className="text-xl text-gray-600">
                            Generate comprehensive daily reports from your GitHub activity with just a few clicks.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, idx) => (
                            <div key={idx} className="relative group">
                                <Card
                                    className="relative h-full overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 group-hover:-translate-y-1 backdrop-blur-sm bg-white/90">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

                                    <div className="p-8 relative">
                                        {/* Enhanced icon container */}
                                        <div
                                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                                            {feature.icon}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"/>
                                        </div>

                                        {/* Content with enhanced typography */}
                                        <h4 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                                        <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>

                                        {/* Enhanced feature list */}
                                        <ul className="space-y-4">
                                            {feature.features.map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                                    <div className="relative flex-shrink-0 w-5 h-5">
                                                        <div
                                                            className={`w-5 h-5 rounded-full bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center`}>
                                                            <div className="w-2 h-2 bg-white rounded-full"/>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className="group-hover:text-gray-900 transition-colors">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Enhanced gradient line */}
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.bgGradient}`}/>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* <PricingSection /> */}

            {/* Example Report Section */}
            <section className="py-16 bg-linear-to-b from-violet-50 to-white overflow-hidden">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-4xl font-bold text-center bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-8">
                            Example Daily Report
                        </h3>

                        <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-xs">
                            {/* Header */}
                            <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
                                <div>
                                    <h4 className="text-2xl font-bold text-gray-900">
                                        End of Day Report - John&apos;s Activity
                                    </h4>
                                    <div className="flex items-center mt-2 text-gray-600">
                                        <LucideClock className="w-4 h-4 mr-2"/>
                                        <span>Thursday, November 2, 2024</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Pull Requests Section */}
                                <div>
                                    <div className="flex items-center mb-4">
                                        <LucideGitPullRequest
                                              className="w-5 h-5 text-violet-600 mr-2"/>
                                        <h5 className="text-lg font-semibold text-gray-900">Pull Requests</h5>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="bg-violet-50 rounded-lg p-4 border border-violet-100">
                                            <div className="flex items-start">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">
                                                        Feature: User Authentication (#123)
                                                    </div>
                                                    <div className="mt-1 text-gray-600">
                                                        Implemented OAuth flow with GitHub, added secure session
                                                        management
                                                    </div>
                                                </div>
                                                <span
                                                    className="px-3 py-1 text-xs font-medium text-violet-700 bg-violet-100 rounded-full">
                                                    In Review
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Commits Section */}
                                <div>
                                    <div className="flex items-center mb-4">
                                        <LucideGitCommitHorizontal
                                              className="w-5 h-5 text-indigo-600 mr-2"/>
                                        <h5 className="text-lg font-semibold text-gray-900">Commits</h5>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                            <div className="font-semibold text-gray-900">
                                                feat: Add user authentication flow
                                            </div>
                                            <div className="mt-1 text-gray-600">
                                                Set up OAuth routes and handlers
                                            </div>
                                        </div>
                                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                            <div className="font-semibold text-gray-900">
                                                fix: Update session handling
                                            </div>
                                            <div className="mt-1 text-gray-600">
                                                Fixed session timeout issues and added refresh token support
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Section */}
                                <div>
                                    <div className="flex items-center mb-4">
                                        <LucideFileText className="w-5 h-5 text-gray-900 mr-2"/>
                                        <h5 className="text-lg font-semibold text-gray-900">Summary</h5>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-gray-700 leading-relaxed">
                                            Today&apos;s focus was on implementing the user authentication system.
                                            Completed
                                            the GitHub OAuth integration
                                            and improved session management. All tests are passing and the PR is ready
                                            for review.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* <FAQSection /> */}

            {/* <TestimonialsSection /> */}

            {/* CTA Section */}
            <section className="relative py-24 bg-gray-900 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Gradient overlays */}
                    <div
                        className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-linear-to-br from-violet-500/10 to-transparent blur-2xl"/>
                    <div
                        className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-linear-to-tl from-indigo-500/10 to-transparent blur-2xl"/>

                    {/* Animated shapes */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                        <div
                            className="absolute top-0 left-0 w-72 h-72 bg-violet-500/5 rounded-full mix-blend-overlay animate-pulse"
                            style={{animationDelay: '0s', animationDuration: '3s'}}/>
                        <div
                            className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full mix-blend-overlay animate-pulse"
                            style={{animationDelay: '1s', animationDuration: '4s'}}/>
                    </div>
                </div>

                <div className="relative container mx-auto px-4 max-w-7xl">
                    <div className="max-w-4xl mx-auto">
                        <div
                            className="relative backdrop-blur-xs bg-gray-800/20 rounded-2xl p-8 md:p-12 border border-gray-700">
                            {/* Decorative icon */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                <div
                                    className="inline-flex p-3 rounded-xl bg-violet-500/10 backdrop-blur-xs border border-violet-500/20">
                                    {/*<Bot className="w-6 h-6 text-violet-400" />*/}
                                    <LucideBot className={"w-6 h-6 text-violet-400"}/>
                                </div>
                            </div>

                            <div className="text-center space-y-8">
                                {/* Badge */}
                                <div className="flex justify-center">
                                    <div
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                                        <LucideSparkles className="w-4 h-4 text-violet-400"/>
                                        <span className="text-sm text-violet-200">AI-Powered Reports</span>
                                    </div>
                                </div>

                                {/* Main content */}
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-bold mb-4">
                                        <span
                                            className="bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                            Never Write Manual Standups Again
                                        </span>
                                    </h3>
                                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                        Let AI handle your daily development reports while you focus on what matters -
                                        writing code.
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <div className="flex flex-col items-center gap-4">
                                    <Button Icon={LucideArrowRight} text={"Start Automating Your Reports"}
                                            onClick={() => router.push("/auth/signin")} iconPosition={"right"}/>
                                    <span
                                        className="text-sm text-gray-500">Get started in minutes • No setup needed</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
                                {[
                                    {value: '100+', label: 'Active Users'},
                                    {value: '30 mins', label: 'Saved Daily'},
                                    {value: '95%', label: 'Satisfaction'}
                                ].map((stat, idx) => (
                                    <div key={idx} className="text-center">
                                        <div
                                            className="text-2xl font-bold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t">
                <div className="container mx-auto px-4 max-w-7xl py-12">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <Image
                            src={"https://res.cloudinary.com/db2dcqpub/image/upload/v1738306393/zi1exolnzswosyutcksf.png"}
                            alt={"Devvoir Logo"}
                            width={32}
                            height={32}
                            priority
                            loading="eager"
                            quality={90}
                        />
                        {/*<LucideGitCommitHorizontal className="w-8 h-8 text-purple-600"/>*/}
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
                                        <span
                                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full animate-ping"></span>
                                    </div>
                                </div>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-6 mb-4">
                        <a href="https://x.com/DevvoirAI" target="_blank" rel="noopener noreferrer">
                            <SimpleIconsTwitter
                                  className="w-6 h-6 text-blue-500 hover:text-blue-400 transition-colors"/>
                        </a>
                        <a href="https://www.linkedin.com/company/devvoir" target="_blank" rel="noopener noreferrer">
                            <SimpleIconsLinkedin
                                  className="w-6 h-6 text-blue-700 hover:text-blue-600 transition-colors"/>
                        </a>
                    </div>
                    <div className="text-center text-gray-800">
                        <p>&copy; {new Date().getFullYear()} Devvoir. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
