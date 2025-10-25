import React from 'react';
import { cn } from '@/lib/utils';

export interface FigmaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

/**
 * FigmaInput - Input field matching Figma design system
 * Dark background with white text, yellow focus state
 */
export const FigmaInput = React.forwardRef<HTMLInputElement, FigmaInputProps>(
  ({ label, error, helperText, variant = 'default', className, ...props }, ref) => {
    const inputStyles = cn(
      'w-full px-4 py-3 rounded-[8px] font-medium transition-all duration-200',
      'text-white text-[16px] leading-[1.5]',
      'focus:outline-none focus:ring-2 focus:ring-[#FFDF00] focus:border-transparent',
      {
        'bg-[#1B1B1B] border-2 border-white/10 hover:border-white/20': variant === 'default',
        'bg-[#151515] border-2 border-transparent': variant === 'filled',
        'border-red-500 focus:ring-red-500': error,
      },
      className
    );
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-white text-[16px] font-bold mb-2 capitalize">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          className={inputStyles}
          {...props}
        />
        
        {error && (
          <p className="mt-2 text-[14px] text-red-500 font-medium">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-[14px] text-[#818181] font-medium">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FigmaInput.displayName = 'FigmaInput';

/**
 * FigmaTextarea - Textarea matching Figma design system
 */
export interface FigmaTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

export const FigmaTextarea = React.forwardRef<HTMLTextAreaElement, FigmaTextareaProps>(
  ({ label, error, helperText, variant = 'default', className, ...props }, ref) => {
    const textareaStyles = cn(
      'w-full px-4 py-3 rounded-[8px] font-medium transition-all duration-200',
      'text-white text-[16px] leading-[1.5]',
      'focus:outline-none focus:ring-2 focus:ring-[#FFDF00] focus:border-transparent',
      'resize-vertical min-h-[120px]',
      {
        'bg-[#1B1B1B] border-2 border-white/10 hover:border-white/20': variant === 'default',
        'bg-[#151515] border-2 border-transparent': variant === 'filled',
        'border-red-500 focus:ring-red-500': error,
      },
      className
    );
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-white text-[16px] font-bold mb-2 capitalize">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={textareaStyles}
          {...props}
        />
        
        {error && (
          <p className="mt-2 text-[14px] text-red-500 font-medium">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-[14px] text-[#818181] font-medium">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FigmaTextarea.displayName = 'FigmaTextarea';

/**
 * FigmaSelect - Select dropdown matching Figma design system
 */
export interface FigmaSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
  options: { value: string; label: string }[];
}

export const FigmaSelect = React.forwardRef<HTMLSelectElement, FigmaSelectProps>(
  ({ label, error, helperText, variant = 'default', options, className, ...props }, ref) => {
    const selectStyles = cn(
      'w-full px-4 py-3 rounded-[8px] font-medium transition-all duration-200',
      'text-white text-[16px] leading-[1.5]',
      'focus:outline-none focus:ring-2 focus:ring-[#FFDF00] focus:border-transparent',
      'appearance-none cursor-pointer',
      {
        'bg-[#1B1B1B] border-2 border-white/10 hover:border-white/20': variant === 'default',
        'bg-[#151515] border-2 border-transparent': variant === 'filled',
        'border-red-500 focus:ring-red-500': error,
      },
      className
    );
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-white text-[16px] font-bold mb-2 capitalize">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            className={selectStyles}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#1B1B1B]">
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {error && (
          <p className="mt-2 text-[14px] text-red-500 font-medium">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-[14px] text-[#818181] font-medium">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FigmaSelect.displayName = 'FigmaSelect';
