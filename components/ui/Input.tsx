import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = ({ icon, fullWidth = false, className = '', ...props }: InputProps) => {
  const width = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`relative flex items-center ${width}`}>
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-body-text/60">
          {icon}
        </div>
      )}
      <input
        className={`
          flex w-full min-w-0 flex-1 rounded-btn border border-gray-200 bg-white/80 py-3 
          text-base text-header-text shadow-search transition-all 
          placeholder:text-body-text/60 
          focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none
          ${icon ? 'pl-11' : 'pl-4'} pr-4 ${className}
        `}
        {...props}
      />
    </div>
  );
};
