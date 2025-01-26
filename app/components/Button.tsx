'use client';
import {ButtonHTMLAttributes} from "react";
import {Icon} from "@iconify/react";
import classNames from "classnames"; // Util for conditional classes

// Button styles extracted as constants
const BUTTON_BASE_CLASSES = "relative overflow-hidden group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:shadow-purple-500/20";
const BACKGROUND_EFFECT_CLASSES = "absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform ease-out duration-700";

// Utility to determine rotation class
const getIconRotationClass = (iconPosition: 'left' | 'right') =>
    iconPosition === 'left' ? 'group-hover:rotate-45' : 'group-hover:-rotate-45';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string; // Clearer name
    text: string;
    iconPosition?: 'left' | 'right';
}

export const Button = ({
                           icon,
                           text,
                           onClick,
                           iconPosition = 'left', // Default prop value
                       }: ButtonProps) => {
    // Content wrapper classes
    const contentWrapperClasses = classNames(
        "relative flex items-center gap-2",
        {"flex-row-reverse": iconPosition === 'right'} // Simplified flex condition
    );

    return (
        <button onClick={onClick} className={BUTTON_BASE_CLASSES}>
            <div className={BACKGROUND_EFFECT_CLASSES}/>
            <div className={contentWrapperClasses}>
                <Icon
                    icon={icon}
                    className={`w-5 h-5 transition-transform duration-300 ease-out ${getIconRotationClass(iconPosition)}`}
                />
                <span className="font-semibold text-sm">{text}</span>
            </div>
        </button>
    );
};