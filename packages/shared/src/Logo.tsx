import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({ className, size = 100 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 5 bands diag at -48° - simplification for now */}
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(48)">
          <stop offset="20%" stopColor="#060D16" />
          <stop offset="40%" stopColor="#0F3460" />
          <stop offset="60%" stopColor="#FF6B47" />
          <stop offset="80%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
      </defs>
      <path 
        d="M 10,82 L 10,38 L 36,8 L 50,22 L 64,8 L 90,38 L 90,82 L 70,82 L 70,48 L 58,48 L 50,56 L 42,48 L 30,48 L 30,82 Z" 
        fill="url(#logo-gradient)" 
      />
    </svg>
  );
};
