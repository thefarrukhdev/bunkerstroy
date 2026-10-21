import React from 'react';
import { cn } from '../utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'warning' | 'success' | 'danger' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  ...props
}) => {
  const variantStyles = {
    warning: 'bg-bunker-amber-500/15 text-bunker-amber-500 border-bunker-amber-500/40',
    success: 'bg-bunker-status-green/15 text-bunker-status-green border-bunker-status-green/30',
    danger: 'bg-bunker-status-red/15 text-bunker-status-red border-bunker-status-red/30',
    info: 'bg-bunker-status-cyan/15 text-bunker-status-cyan border-bunker-status-cyan/30',
    neutral: 'bg-bunker-surface-2 text-bunker-text-secondary border-bunker-border-strong'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide uppercase font-mono',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
