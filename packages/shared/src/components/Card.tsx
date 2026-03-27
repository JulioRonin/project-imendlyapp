import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'silver' | 'floating' | 'dark' | 'glass' | 'navy' | 'none';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const baseStyles = "rounded-lg p-8 transition-all duration-300 font-urbanist";
  
  const variants = {
    default: "bg-white border-[0.5px] border-black/5 shadow-card",
    silver: "bg-off-white border-[0.5px] border-black/5",
    floating: "bg-white shadow-float",
    dark: "bg-black-rich text-white border-none shadow-float",
    glass: "backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl",
    navy: "bg-brand-night text-white border-none shadow-2xl",
    none: "",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
