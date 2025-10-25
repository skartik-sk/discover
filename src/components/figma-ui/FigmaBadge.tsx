import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export interface FigmaBadgeProps {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * FigmaBadge - Matches exact Figma badge specifications
 * Extracted from: "our services" badge (13:2166), "view" badge (13:2428), "testimonials" badge
 */
export const FigmaBadge: React.FC<FigmaBadgeProps> = ({
  variant = 'primary',
  icon,
  children,
  className,
}) => {
  const baseStyles = 'inline-flex items-center gap-2 font-medium capitalize whitespace-nowrap';
  
  const variantStyles = {
    // Yellow badge with opacity background (our services, testimonials, etc.)
    // From style_5NYAUG: 18px font, opacity 0.08
    primary: 'h-[38px] px-[13px] bg-[#FFDF00]/[0.08] text-[#FFDF00] text-[18px] leading-[0.889] rounded-[50px]',
    
    // Small yellow badge (view, pill style)
    // From style_YNYQXL: 14px font
    secondary: 'h-[30px] px-[18px] bg-[#FFDF00] text-[#151515] text-[14px] leading-[1.429] rounded-[50px]',
    
    // Outline badge
    outline: 'h-[38px] px-[13px] border-2 border-[#FFDF00] text-[#FFDF00] text-[18px] leading-[0.889] rounded-[50px]',
  };
  
  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      {icon && <span className="flex-shrink-0 w-[18px] h-[18px]">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

/**
 * FigmaBadgeWithStar - Badge with star icon (common pattern in Figma)
 */
export const FigmaBadgeWithStar: React.FC<Omit<FigmaBadgeProps, 'icon'>> = (props) => {
  return <FigmaBadge {...props} icon={<Star className="w-[18px] h-[18px] fill-current" />} />;
};
