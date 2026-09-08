import React from 'react';

export const TopInsignia: React.FC<{ 
  size?: number;
  showLabel?: boolean;
  className?: string;
}> = ({ size = 24, showLabel = true, className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/20"
        style={{ width: size, height: size }}
      >
        <svg 
          width={size * 0.6} 
          height={size * 0.6} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M 10,82 L 10,38 L 36,8 L 50,22 L 64,8 L 90,38 L 90,82 L 70,82 L 70,48 L 58,48 L 50,56 L 42,48 L 30,48 L 30,82 Z" 
            fill="white" 
          />
        </svg>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-full pointer-events-none" />
      </div>
      {showLabel && (
        <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em]">Top Provider</span>
      )}
    </div>
  );
};
