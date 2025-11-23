import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'defi' | 'nft' | 'dao' | 'ai';
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ variant = 'default', children, className = '' }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-tag px-2.5 h-5 text-xs font-semibold transition-colors';
  
  const variants = {
    default: 'bg-gray-100 text-body-text',
    defi: 'bg-accent-blue/15 text-accent-blue',
    nft: 'bg-accent-terracotta/15 text-accent-terracotta',
    dao: 'bg-accent-yellow/15 text-accent-yellow',
    ai: 'bg-purple-500/15 text-purple-600',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
