import React from 'react';
import type { SVGProps } from 'react';

export const LucideGitPullRequest = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
            <circle cx={18} cy={18} r={3}></circle>
            <circle cx={6} cy={6} r={3}></circle>
            <path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v12"></path>
        </g>
    </svg>
);

export const LucideMessageSquare = (props: SVGProps<SVGSVGElement>) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>);
}

export const LucideX = (props: SVGProps<SVGSVGElement>)=> {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6L6 18M6 6l12 12"></path></svg>);
}