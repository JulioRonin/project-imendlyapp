import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-brand-night/70 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-night/40 font-bold">
            {icon}
          </div>
        )}
        <input 
          className={`
            w-full rounded-2xl border-none bg-slate-100/80 px-4 py-3.5 text-brand-night transition-all duration-200
            focus:bg-white focus:ring-2 focus:ring-primary/20 focus:shadow-lg outline-none
            ${icon ? 'pl-11' : ''}
            ${error ? 'ring-2 ring-red-400 bg-red-50' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500 ml-1 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};
