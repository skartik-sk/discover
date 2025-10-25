'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface FigmaTab {
  id: string;
  label: string;
}

export interface FigmaTabsProps {
  tabs: FigmaTab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

/**
 * FigmaTabs - Tab navigation matching Figma specifications
 * Extracted from: WordPress Resources tabs (38:866), Blog Posts tabs
 * Features: Yellow underline on active tab, 20px font, bold weight
 */
export const FigmaTabs: React.FC<FigmaTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };
  
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'px-3 py-3 text-[20px] font-bold capitalize leading-[1.5] transition-all duration-200',
              'border-b-2 hover:text-white',
              {
                'text-[#FFDF00] border-[#FFDF00]': isActive,
                'text-white border-transparent hover:border-white/20': !isActive,
              }
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

/**
 * FigmaTabsWithViewAll - Tabs with "view all" link on the right
 */
export interface FigmaTabsWithViewAllProps extends FigmaTabsProps {
  onViewAll?: () => void;
  viewAllText?: string;
}

export const FigmaTabsWithViewAll: React.FC<FigmaTabsWithViewAllProps> = ({
  tabs,
  defaultTab,
  onChange,
  onViewAll,
  viewAllText = 'view all',
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <FigmaTabs tabs={tabs} defaultTab={defaultTab} onChange={onChange} />
      
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="flex items-center gap-2 text-[20px] font-bold capitalize text-[#FFDF00] hover:text-[#FFE933] transition-colors duration-200"
        >
          <span>{viewAllText}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12H20M20 12L14 6M20 12L14 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
