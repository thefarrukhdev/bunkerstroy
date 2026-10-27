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
        return 'bg-[#FFB800] text-[#071326] hover:bg-[#FFC928] border border-[#E5A600] font-black shadow-md shadow-[#FFB800]/20 active:translate-y-[1px]';
      case 'secondary':
        return 'bg-[#0F2547] border border-[#1E3A6D] text-white hover:border-[#FFB800] hover:text-[#FFB800] font-bold';
      case 'danger':
        return 'bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#F43F5E] hover:bg-[#F43F5E]/25 font-bold';
      case 'outline':
        return 'bg-transparent border border-[#1E3A6D] text-white hover:border-[#FFB800] hover:text-[#FFB800] font-bold';
      case 'ghost':
        return 'bg-transparent text-sky-200 hover:text-white hover:bg-[#0F2547] font-medium';
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
