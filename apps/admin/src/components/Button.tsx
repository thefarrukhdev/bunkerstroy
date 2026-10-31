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
        return 'bg-[#D95D1E] text-white hover:bg-[#B43B06] border border-[#C2410C] font-bold shadow-xs active:translate-y-[1px]';
      case 'secondary':
        return 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 font-bold';
      case 'danger':
        return 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-bold';
      case 'outline':
        return 'bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold';
      case 'ghost':
        return 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs gap-1.5 rounded-lg min-h-[36px] sm:min-h-0';
      case 'md':
        return 'px-4 py-2.5 sm:py-2 text-xs gap-2 rounded-xl min-h-[44px]';
      case 'lg':
        return 'px-5 py-3 sm:py-2.5 text-sm gap-2.5 rounded-xl min-h-[48px]';
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-mono transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-inherit" />
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
