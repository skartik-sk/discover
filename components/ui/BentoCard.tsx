import React from 'react';

interface BentoCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  size?: '1x1' | '2x1' | '2x2';
  image?: string;
  logo?: string;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  size = '1x1',
  image,
  logo,
  onClick
}) => {
  const sizeClasses = {
    '1x1': 'col-span-1 row-span-1',
    '2x1': 'col-span-1 md:col-span-2 row-span-1',
    '2x2': 'col-span-1 md:col-span-2 md:row-span-2',
  };

  const isLarge = size === '2x2';

  return (
    <div 
      className={`
        group relative flex flex-col overflow-hidden rounded-soft bg-card-bg 
        shadow-card transition-all duration-300 hover:shadow-card-hover 
        hover:-translate-y-1 cursor-pointer
        ${sizeClasses[size]} 
        ${className}
      `}
      onClick={onClick}
    >
      {/* Background Image */}
      {image && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ 
              backgroundImage: `url('${image}')`,
              filter: 'saturate(0.8) contrast(0.9)'
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </>
      )}

      {/* Content Container */}
      <div className={`relative flex flex-col z-10 ${isLarge ? 'mt-auto p-5' : 'mt-20 p-4'}`}>
        {/* Header with Logo and Title */}
        <div className="flex items-center gap-2">
          {logo && (
            <img 
              alt={`${title} Logo`}
              className={`rounded-full bg-gray-700 ${isLarge ? 'h-8 w-8 border-2 border-white/50' : 'h-8 w-8 border-2 border-white'}`}
              src={logo}
            />
          )}
          <h3 className={`font-bold ${image ? 'text-white' : 'text-header-text'} ${isLarge ? 'text-xl' : 'text-base'}`}>
            {title}
          </h3>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className={`mt-1.5 text-xs ${image ? 'text-gray-200 max-w-md' : 'text-body-text'}`}>
            {subtitle}
          </p>
        )}

        {/* Children (tags, upvotes, etc.) */}
        {children && (
          <div className={isLarge ? 'mt-2' : 'mt-3'}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
