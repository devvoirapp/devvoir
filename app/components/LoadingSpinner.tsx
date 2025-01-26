import React from 'react';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = true }) => {
    const containerClasses = fullScreen 
        ? "flex items-center justify-center min-h-screen bg-white" 
        : "flex items-center justify-center p-4";

    return (
        <div className={containerClasses}>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
        </div>
    );
};

export default LoadingSpinner;
