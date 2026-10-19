import React from 'react';
import { cn } from '../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const variantStyles = {
    primary: 'bg-[#FFB800] hover:bg-[#FFA500] text-[#151719] focus:ring-[#FFB800] shadow-md shadow-[#FFB800]/20',
    secondary: 'bg-[#292C2F] hover:bg-[#34383C] text-[#F5F5F2] border border-[#51504A] focus:ring-[#777A7C]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md shadow-red-600/20',
    outline: 'border border-[#FFB800] text-[#FFB800] hover:bg-[#FFB800]/10 focus:ring-[#FFB800]',
    ghost: 'text-[#B8B8B3] hover:text-[#F5F5F2] hover:bg-[#222528]'
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5'
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Kutilmoqda...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
