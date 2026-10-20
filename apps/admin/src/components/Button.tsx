import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'dark:bg-[#89B4FA] dark:text-[#11111B] bg-[#1E66F5] text-white hover:opacity-90 font-bold shadow-xs';
      case 'secondary':
        return 'bg-theme-card-subtle border border-theme text-theme-main hover:border-theme-subtle font-medium';
      case 'danger':
        return 'bg-[#F38BA8]/15 border border-[#F38BA8]/30 text-[#F38BA8] hover:bg-[#F38BA8]/25 font-bold';
      case 'outline':
        return 'bg-transparent border border-theme text-theme-main hover:border-theme-subtle font-medium';
      case 'ghost':
        return 'bg-transparent text-theme-muted hover:text-theme-main hover:bg-theme-card-subtle font-medium';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1 text-xs gap-1.5 rounded-lg';
      case 'md':
        return 'px-3.5 py-2 text-xs gap-2 rounded-xl';
      case 'lg':
        return 'px-5 py-2.5 text-sm gap-2.5 rounded-xl';
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-mono transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
