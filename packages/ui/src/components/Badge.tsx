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
    warning: 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
    info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    neutral: 'bg-[#292C2F] text-[#B8B8B3] border-[#51504A]'
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
