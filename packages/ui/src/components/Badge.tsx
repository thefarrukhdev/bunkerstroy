import React from 'react';
import { cn } from '../utils';

export type BadgeVariant = 'warning' | 'success' | 'danger' | 'info' | 'neutral' | 'default';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isMono?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  leftIcon,
  rightIcon,
  isMono = true,
  ...props
}) => {
  const normalizedVariant = variant === 'default' ? 'neutral' : variant;

  const variantStyles: Record<string, string> = {
    warning: 'bg-bunker-amber-500/10 text-bunker-amber-500 border-bunker-amber-500/25',
    success: 'bg-bunker-status-green/10 text-bunker-status-green border-bunker-status-green/25',
    danger: 'bg-bunker-status-red/10 text-bunker-status-red border-bunker-status-red/25',
    info: 'bg-bunker-status-cyan/10 text-bunker-status-cyan border-bunker-status-cyan/25',
    neutral: 'bg-bunker-surface-2 text-bunker-text-secondary border-bunker-border-strong'
  };

  const dotColorStyles: Record<string, string> = {
    warning: 'bg-bunker-amber-500',
    success: 'bg-bunker-status-green',
    danger: 'bg-bunker-status-red',
    info: 'bg-bunker-status-cyan',
    neutral: 'bg-bunker-text-muted'
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-[11px]',
    lg: 'px-3 py-1 text-xs'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-semibold border tracking-wide uppercase',
        isMono && 'font-mono',
        sizeStyles[size],
        variantStyles[normalizedVariant],
        className
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </span>
  );
};
