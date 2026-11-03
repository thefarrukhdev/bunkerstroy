import React from 'react';
import { cn } from '../utils';

export type BadgeVariant =
  | 'warning'
  | 'success'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'default'
  | 'brand'
  | 'purple'
  | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isMono?: boolean;
  uppercase?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  leftIcon,
  rightIcon,
  isMono = false,
  uppercase = false,
  ...props
}) => {
  const normalizedVariant =
    variant === 'default' ? 'neutral' : variant === 'error' ? 'danger' : variant;

  const variantStyles: Record<string, string> = {
    warning: 'bg-bunker-amber-500/10 text-bunker-amber-500 border-bunker-amber-500/25',
    success: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    danger: 'bg-bunker-status-red/10 text-bunker-status-red border-bunker-status-red/25',
    info: 'bg-bunker-status-cyan/10 text-bunker-status-cyan border-bunker-status-cyan/25',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
    brand: 'bg-[#D95D1E]/10 text-[#D95D1E] border-[#D95D1E]/30',
    purple: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/25'
  };

  const dotColorStyles: Record<string, string> = {
    warning: 'bg-bunker-amber-500',
    success: 'bg-emerald-600',
    danger: 'bg-bunker-status-red',
    info: 'bg-bunker-status-cyan',
    neutral: 'bg-slate-500',
    brand: 'bg-[#D95D1E]',
    purple: 'bg-indigo-500'
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-semibold border font-sans',
        uppercase && 'uppercase tracking-wide',
        isMono && 'font-mono',
        sizeStyles[size],
        variantStyles[normalizedVariant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColorStyles[normalizedVariant])}
          aria-hidden="true"
        />
      )}
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </span>
  );
};
