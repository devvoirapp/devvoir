// import React from 'react';
// import {Icon} from "@iconify/react";
//
// const QuotaWarning = ({used = 0, total = 20, resetDate}) => {
//     const percentage = Math.round((used / total) * 100);
//     const remaining = total - used;
//     const isHighUsage = percentage >= 80;
//
//     const formattedDate = new Date(resetDate).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//     });
//
//     return (
//         <div className="relative mx-auto mb-6">
//             <div
//                 className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-purple-100/50 shadow-lg overflow-hidden">
//                 <div
//                     className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-[length:200%_100%] animate-gradient"/>
//
//                 <div className="p-4 sm:p-5">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-purple-50 rounded-lg">
//                                 <Icon icon={"lucide:activity"} className="w-4 h-4 text-purple-600"/>
//                             </div>
//                             <div>
//                                 <div className="flex items-baseline gap-2">
//                                     <span
//                                         className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                                         {remaining}
//                                     </span>
//                                     <span className="text-sm text-gray-600">remaining reports</span>
//                                 </div>
//                                 <div className="text-sm text-gray-500 mt-1">
//                                     Resets on {formattedDate}
//                                 </div>
//                             </div>
//                         </div>
//
//                         {isHighUsage && (
//                             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-full">
//                                 <Icon icon={"lucide:triangle-alert"} className="w-3.5 h-3.5 text-red-500"/>
//                                 <span className="text-xs font-medium text-red-600">High Usage</span>
//                             </div>
//                         )}
//                     </div>
//
//                     <div className="mt-3">
//                         <div className="relative h-1.5 bg-purple-50 rounded-full overflow-hidden">
//                             <div
//                                 className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
//                                 style={{width: `${percentage}%`}}
//                             >
//                                 <div
//                                     className="absolute inset-0 bg-[radial-gradient(132px_132px_at_132px_-80px,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_100%)]"/>
//                             </div>
//                         </div>
//                         <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
//                             <span>{used} of {total} used</span>
//                             <span className="font-medium text-purple-600">{percentage}%</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default QuotaWarning;


"use-client";
import React from 'react';
import {Icon} from "@iconify/react";
import {useRouter} from "next/navigation";

const QuotaWarning = ({ used = 0, total = 20, resetDate }) => {
    const router = useRouter()
    const percentage = Math.round((used / total) * 100);
    const formattedDate = new Date(resetDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <div className="flex items-center gap-6 bg-white/95 backdrop-blur-xl border border-purple-100/50 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 min-w-fit">
                <div className="relative p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl blur-xl opacity-40" />
                    <Icon icon={'lucide:sparkles'} className="w-4 h-4 text-white relative z-10" />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                        <div className="flex items-baseline">
                            <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                {used}
                            </span>
                            <span className="mx-1 text-gray-400">/</span>
                            <span className="text-sm font-medium text-gray-500">{total}</span>
                        </div>
                        <span className="text-sm text-gray-500 ml-0.5">reports used</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">Resets {formattedDate}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative">
                <div className="h-2.5 bg-purple-50 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 relative"
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_1s_linear_infinite]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
                    </div>
                </div>
                <span className="absolute right-0 -bottom-5 text-xs font-medium text-purple-600">{percentage}% used</span>
            </div>

            <button onClick={() => router.push("/account")} className="min-w-fit relative group overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                <span className="relative">Upgrade Now</span>
            </button>
        </div>
    );
};

export default QuotaWarning;