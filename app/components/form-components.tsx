// components/form-components.tsx
'use client';  // Add this at the top

import React, {forwardRef, InputHTMLAttributes} from 'react';
import {Icon} from "@iconify/react";

// TextField Component
interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  as?: 'input' | 'textarea';
  rows?: number;
  label?: string;
  helperText?: string;
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error = false,
      startIcon,
      endIcon,
      fullWidth = false,
      disabled = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `text-field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : 'max-w-sm'}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm font-medium ${
              error ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3 text-gray-500">
              {startIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full
              px-3
              py-2
              bg-white
              border
              rounded-lg
              outline-hidden
              transition-colors
              duration-200
              ${startIcon ? 'pl-10' : ''}
              ${endIcon ? 'pr-10' : ''}
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
              }
              ${
                disabled
                  ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                  : 'hover:border-gray-400'
              }
              ${className}
            `}
            {...props}
          />
          
          {endIcon && (
            <div className="absolute right-3 text-gray-500">
              {endIcon}
            </div>
          )}
        </div>
        
        {helperText && (
          <p
            className={`text-sm ${
              error ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

// Checkbox Component
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  indeterminate?: boolean;
  labelPosition?: 'left' | 'right';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error = false,
      indeterminate = false,
      labelPosition = 'right',
      className = '',
      disabled = false,
      checked,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Handle the indeterminate state
    React.useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [ref, indeterminate]);

    const checkboxContent = (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          id={inputId}
          disabled={disabled}
          checked={checked}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`
            w-5 
            h-5 
            border 
            rounded 
            flex 
            items-center 
            justify-center
            transition-colors 
            duration-200
            ${
              error
                ? 'border-red-300 peer-focus:border-red-500 peer-focus:ring-2 peer-focus:ring-red-500/20'
                : 'border-gray-300 peer-focus:border-purple-500 peer-focus:ring-2 peer-focus:ring-purple-500/20'
            }
            ${
              checked
                ? error
                  ? 'bg-red-500 border-red-500'
                  : 'bg-purple-500 border-purple-500'
                : 'bg-white peer-hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {checked && !indeterminate && (
              <Icon icon={"lucide:check"} className="w-3.5 h-3.5 text-white" strokeWidth={3}/>
          )}
          {indeterminate && (
            <div className="w-2.5 h-0.5 bg-white rounded-full" />
          )}
        </div>
      </div>
    );

    return (
      <div className={`inline-flex flex-col gap-1.5 ${className}`}>
        <label
          htmlFor={inputId}
          className={`
            inline-flex 
            items-center 
            gap-2
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {labelPosition === 'left' && label && (
            <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              {label}
            </span>
          )}
          
          {checkboxContent}
          
          {labelPosition === 'right' && label && (
            <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              {label}
            </span>
          )}
        </label>

        {helperText && (
          <p
            className={`text-sm ${
              error ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
