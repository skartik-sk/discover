import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FigmaBadge } from './FigmaBadge';

export interface FigmaCardProps {
  variant?: 'service' | 'project' | 'resource' | 'blog';
  className?: string;
  children?: React.ReactNode;
}

/**
 * FigmaCard - Base card component matching Figma specifications
 * Shadow: 0px 8px 100px rgba(88, 112, 120, 0.1)
 * Border Radius: 24px
 */
export const FigmaCard: React.FC<FigmaCardProps> = ({
  variant = 'service',
  className,
  children,
}) => {
  const baseStyles = 'rounded-[24px] transition-all duration-200';
  
  const variantStyles = {
    // Service Card: 400x300px (13:2184)
    service: 'w-full max-w-[400px] h-[300px] p-10 hover:-translate-y-2',
    
    // Project Card: 400x476px (20:247)
    project: 'w-full max-w-[400px] h-[476px] overflow-hidden hover:-translate-y-2',
    
    // Resource/Blog Card: 295x318px (13:2425)
    resource: 'w-full max-w-[295px] shadow-[0px_8px_100px_rgba(88,112,120,0.1)] hover:-translate-y-2',
    
    // Blog Card (same as resource)
    blog: 'w-full max-w-[295px] shadow-[0px_8px_100px_rgba(88,112,120,0.1)] hover:-translate-y-2',
  };
  
  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      {children}
    </div>
  );
};

/**
 * FigmaServiceCard - Service card with icon (13:2184)
 */
export interface FigmaServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'yellow' | 'dark';
  className?: string;
}

export const FigmaServiceCard: React.FC<FigmaServiceCardProps> = ({
  icon,
  title,
  description,
  variant = 'dark',
  className,
}) => {
  const bgColor = variant === 'yellow' ? 'bg-[#FFDF00]' : 'bg-[#1B1B1B]';
  const textColor = variant === 'yellow' ? 'text-[#151515]' : 'text-white';
  const iconBg = variant === 'yellow' ? 'bg-[#151515]' : 'bg-white/10';
  const iconColor = variant === 'yellow' ? 'text-[#FFDF00]' : 'text-white';
  
  return (
    <FigmaCard variant="service" className={cn(bgColor, className)}>
      <div className="flex flex-col h-full">
        {/* Icon Circle - 72px diameter */}
        <div className={cn('w-[72px] h-[72px] rounded-full flex items-center justify-center', iconBg, iconColor)}>
          {icon}
        </div>
        
        {/* Content - Starts at 96px from top */}
        <div className="mt-6 flex-1">
          {/* Title - 24px font, 800 weight */}
          <h3 className={cn('text-[24px] font-extrabold leading-[1.25] capitalize mb-3', textColor)}>
            {title}
          </h3>
          
          {/* Description - 18px font, 500 weight */}
          <p className={cn('text-[18px] font-medium leading-[1.556]', textColor)}>
            {description}
          </p>
        </div>
      </div>
    </FigmaCard>
  );
};

/**
 * FigmaProjectCard - Project card with image and content (20:247)
 */
export interface FigmaProjectCardProps {
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
  className?: string;
}

export const FigmaProjectCard: React.FC<FigmaProjectCardProps> = ({
  image,
  title,
  subtitle,
  badge = 'view',
  className,
}) => {
  return (
    <FigmaCard variant="project" className={cn('bg-[#1B1B1B]', className)}>
      {/* Image - 400x299px */}
      <div className="relative w-full h-[299px] bg-gradient-to-br from-purple-500 to-blue-500">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content - White background */}
      <div className="bg-white p-6 relative">
        {/* Badge - Positioned absolutely at top */}
        <div className="absolute top-6 right-6">
          <FigmaBadge variant="secondary">{badge}</FigmaBadge>
        </div>
        
        {/* Title - 24px font, 800 weight */}
        <h3 className="text-[24px] font-extrabold leading-[1.25] capitalize text-[#151515] mb-2 pr-20">
          {title}
        </h3>
        
        {/* Subtitle - 20px font, uppercase, gray */}
        <p className="text-[20px] font-medium uppercase text-[#818181] leading-[1.5]">
          {subtitle}
        </p>
      </div>
    </FigmaCard>
  );
};

/**
 * FigmaResourceCard - Resource/Blog card (13:2425)
 */
export interface FigmaResourceCardProps {
  image: string;
  title: string;
  category: string;
  badge?: string;
  className?: string;
}

export const FigmaResourceCard: React.FC<FigmaResourceCardProps> = ({
  image,
  title,
  category,
  badge = 'view',
  className,
}) => {
  return (
    <FigmaCard variant="resource" className={cn('overflow-hidden', className)}>
      {/* Image - 295x241px */}
      <div className="relative w-full h-[241px] bg-[#FFDF00] rounded-t-[16px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content - 77px height */}
      <div className="bg-white p-4 rounded-b-[16px]">
        {/* Badge */}
        <div className="mb-2">
          <FigmaBadge variant="secondary">{badge}</FigmaBadge>
        </div>
        
        {/* Title - 16px font, 700 weight */}
        <h3 className="text-[16px] font-bold leading-[1.25] text-[#151515] mb-1">
          {title}
        </h3>
        
        {/* Category - 14px font, gray */}
        <p className="text-[14px] font-medium capitalize text-[#818181] leading-[1.429]">
          {category}
        </p>
      </div>
    </FigmaCard>
  );
};
