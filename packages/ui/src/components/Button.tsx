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
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-wide transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] active:translate-y-0.5 cursor-pointer';

  const variantStyles = {
    primary:
      'bg-bunker-amber-500 hover:bg-bunker-amber-400 text-bunker-vault font-black focus:ring-bunker-amber-500 shadow-md shadow-bunker-amber-500/20 active:shadow-sm',
    secondary:
      'bg-bunker-surface-2 hover:bg-bunker-surface-hover text-bunker-text-primary border border-bunker-border-strong focus:ring-bunker-border-strong active:bg-bunker-surface-1',
    danger:
      'bg-bunker-status-red hover:bg-red-600 text-white focus:ring-bunker-status-red shadow-md shadow-red-600/20',
    outline:
      'border border-bunker-amber-500 text-bunker-amber-500 hover:bg-bunker-amber-500/10 focus:ring-bunker-amber-500',
    ghost:
      'text-bunker-text-secondary hover:text-bunker-text-primary hover:bg-bunker-surface-2'
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
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Kutilmoqda...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
