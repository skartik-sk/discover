import React from 'react';
import { cn } from '@/lib/utils';

export interface FigmaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

/**
 * FigmaButton - Matches exact Figma button specifications
 * Extracted from: Get Started button (13:2068), Contact button, All Projects button
 */
export const FigmaButton = React.forwardRef<HTMLButtonElement, FigmaButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-extrabold uppercase transition-all duration-200';
    
    const variantStyles = {
      // Primary yellow button (most common in Figma)
      primary: 'bg-[#FFDF00] text-[#151515] hover:bg-[#FFE933] active:bg-[#E6C900]',
      
      // Secondary dark button
      secondary: 'bg-[#151515] text-white hover:bg-[#1B1B1B] active:bg-[#0F0F0F] border-2 border-white',
      
      // Ghost button
      ghost: 'bg-transparent text-white hover:bg-white/10 active:bg-white/20',
      
      // Dark button (white text on dark bg)
      dark: 'bg-[#1B1B1B] text-white hover:bg-[#252525] active:bg-[#151515]',
    };
    
    const sizeStyles = {
      // From style_CBMI69: 16px font, 56px height
      sm: 'h-[40px] px-6 text-[14px] rounded-[8px]',
      
      // Standard button size from Figma
      md: 'h-[56px] px-8 text-[16px] rounded-[8px] leading-[1.24]',
      
      // Large button
      lg: 'h-[64px] px-10 text-[18px] rounded-[8px]',
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          'hover:-translate-y-1 active:translate-y-0',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FigmaButton.displayName = 'FigmaButton';
