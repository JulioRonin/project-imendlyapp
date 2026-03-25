import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'coral' | 'navy' | 'primary' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: "bg-primary-light text-primary",
    teal: "bg-brand-teal/10 text-brand-teal",
    coral: "bg-brand-coral/10 text-brand-coral",
    navy: "bg-brand-navy text-white",
    success: "bg-emerald-100 text-emerald-700",
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-tight ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
