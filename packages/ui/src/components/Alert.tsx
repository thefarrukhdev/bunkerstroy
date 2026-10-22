import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '../utils';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  description,
  icon,
  onDismiss,
  children,
  ...props
}) => {
  const variantStyles = {
    info: 'bg-bunker-status-cyan/10 border-bunker-status-cyan/25 text-bunker-status-cyan',
    success: 'bg-bunker-status-green/10 border-bunker-status-green/25 text-bunker-status-green',
    warning: 'bg-bunker-amber-500/10 border-bunker-amber-500/25 text-bunker-amber-500',
    error: 'bg-bunker-status-red/10 border-bunker-status-red/25 text-bunker-status-red'
  };

  const defaultIcons = {
    info: <Info className="w-4 h-4 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
  };

  const renderedIcon = icon !== undefined ? icon : defaultIcons[variant];

  return (
    <div
      role="alert"
      className={cn(
        'p-3.5 rounded-xl border flex items-start gap-3 text-xs font-mono transition-all',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {renderedIcon && <div className="shrink-0">{renderedIcon}</div>}

      <div className="flex-1 min-w-0 space-y-0.5">
        {title && (
          <h5 className="font-bold tracking-tight text-current leading-snug">
            {title}
          </h5>
        )}
        {description && (
          <div className="text-[11px] opacity-90 leading-relaxed">
            {description}
          </div>
        )}
        {children && (
          <div className="text-[11px] opacity-90 leading-relaxed">
            {children}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Yopish"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
