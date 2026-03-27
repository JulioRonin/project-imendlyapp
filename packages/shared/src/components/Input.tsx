import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, dark, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full font-urbanist">
      {label && (
        <label className={`text-xs font-urbanist font-[500] px-1 tracking-tight ${dark ? 'text-white' : 'text-black-rich'}`}>
          {label}
        </label>
      )}
      <input 
        className={`
          w-full px-4 py-3 rounded-sm text-sm outline-none
          border-[0.5px] border-transparent transition-all duration-200
          ${dark ? 'bg-white/10 text-white placeholder:text-white/40 focus:border-white/30' : 'bg-silver-light text-black-rich placeholder:text-gray-soft focus:border-black-rich/10'}
          ${error ? 'border-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[10px] text-error font-medium px-1 uppercase tracking-tight">{error}</p>
      )}
    </div>
  );
};
