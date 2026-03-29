import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'silver' | 'primary' | 'info' | 'purple' | 'indigo';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: "bg-primary text-white",
    primary: "bg-primary text-white",
    success: "bg-emerald-500 text-white",
    warning: "bg-amber-500 text-white",
    error: "bg-rose-500 text-white",
    silver: "bg-silver-light text-black-rich",
    info: "bg-blue-500 text-white",
    purple: "bg-purple-500 text-white",
    indigo: "bg-indigo-500 text-white",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-urbanist font-[700] uppercase tracking-wider shadow-sm border border-black/5 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
