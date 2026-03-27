import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'silver';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: "bg-primary text-white",
    success: "bg-im-green text-white",
    warning: "bg-[#F59E0B] text-white",
    error: "bg-[#EF4444] text-white",
    silver: "bg-silver-light text-black-rich",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-urbanist font-[500] uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
