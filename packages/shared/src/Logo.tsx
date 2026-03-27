import React from 'react';

export const Logo: React.FC<{ 
  className?: string; 
  size?: number; 
  variant?: 'principal' | 'dark' | 'darkBg';
  showWordmark?: boolean;
  orientation?: 'horizontal' | 'vertical';
}> = ({ 
  className, 
  size = 40, 
  variant = 'principal',
  showWordmark = true,
  orientation = 'horizontal'
}) => {
  const isDark = variant === 'dark';
  const isVertical = orientation === 'vertical';
  const isDarkBg = variant === 'darkBg';
  const iconColor = isDark ? '#FFFFFF' : '#3DB87A';
  const textColor = (isDark || isDarkBg) ? '#FFFFFF' : '#1F1F1F';

  return (
    <div className={`flex ${isVertical ? 'flex-col' : 'items-center'} gap-4 ${className}`} style={{ minHeight: size }}>
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
          <svg 
            width={size * (isVertical ? 1.2 : 1)} 
            height={size * (isVertical ? 1.2 : 1)} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M 10,82 L 10,38 L 36,8 L 50,22 L 64,8 L 90,38 L 90,82 L 70,82 L 70,48 L 58,48 L 50,56 L 42,48 L 30,48 L 30,82 Z" 
              fill={iconColor} 
            />
          </svg>
      </div>
      {showWordmark && (
        <span 
          className={`font-urbanist font-[200] lowercase tracking-[6px] whitespace-nowrap ${isVertical ? 'text-center -mt-2' : ''}`}
          style={{ fontSize: size * 0.4, color: textColor }}
        >
          i mendly
        </span>
      )}
    </div>
  );
};
