import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'white' | 'navy';
}

export const Card: React.FC<CardProps> = ({ children, className = '', variant = 'white' }) => {
  const baseStyles = "rounded-3xl p-6 transition-all duration-300";
  
  const variants = {
    white: "bg-white border border-slate-100 shadow-xl shadow-slate-200/50",
    glass: "bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl",
    navy: "bg-brand-navy text-white shadow-xl",
  };
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
