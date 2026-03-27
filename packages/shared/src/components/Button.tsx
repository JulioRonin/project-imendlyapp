import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-pill font-urbanist font-[600] tracking-tight transition-all duration-200 focus:outline-none disabled:opacity-30 disabled:pointer-events-none active:scale-[0.97]";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
    secondary: "bg-white text-black-rich border border-silver-light hover:bg-silver-light transition-colors",
    outline: "border-[0.5px] border-black-rich/10 text-black-rich hover:bg-silver-light bg-transparent",
    ghost: "text-gray-soft hover:text-black-rich bg-transparent hover:bg-silver-light/50",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
