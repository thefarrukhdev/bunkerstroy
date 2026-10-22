import React, { useEffect, useCallback, useId } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  bodyClassName?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  title,
  subtitle,
  headerExtra,
  footer,
  children,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  bodyClassName
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    full: 'max-w-full'
  };

  const positionClasses = {
    right: 'justify-end border-l',
    left: 'justify-start border-r'
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const generatedTitleId = useId();
  const titleId = title ? `drawer-title-${generatedTitleId.replace(/:/g, '')}` : undefined;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex bg-slate-900/50 backdrop-blur-xs animate-in fade-in transition-all',
        position === 'right' ? 'justify-end' : 'justify-start'
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className={cn(
          'w-full h-full bg-bunker-surface-1 border-bunker-border-strong flex flex-col justify-between p-6 shadow-2xl overflow-y-auto text-bunker-text-primary transition-transform duration-300',
          sizeClasses[size],
          positionClasses[position],
          className
        )}
      >
        {/* Drawer Header */}
        {(title || showCloseButton || headerExtra) && (
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-bunker-border-subtle shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {headerExtra}
              <div className="min-w-0 flex-1">
                {title && (
                  typeof title === 'string' ? (
                    <h3 id={titleId} className="font-bold text-bunker-text-primary text-base truncate">
                      {title}
                    </h3>
                  ) : (
                    <div id={titleId}>{title}</div>
                  )
                )}
                {subtitle && (
                  typeof subtitle === 'string' ? (
                    <p className="text-xs text-bunker-text-secondary truncate mt-0.5">
                      {subtitle}
                    </p>
                  ) : (
                    <div>{subtitle}</div>
                  )
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="text-bunker-text-secondary hover:text-bunker-text-primary p-2 rounded-xl bg-bunker-surface-2 border border-bunker-border-subtle cursor-pointer transition-colors shrink-0 hover:bg-bunker-surface-hover"
                aria-label="Yopish"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Drawer Body */}
        <div className={cn('flex-1 overflow-y-auto py-3 space-y-4', bodyClassName)}>
          {children}
        </div>

        {/* Drawer Footer */}
        {footer && (
          <div className="pt-4 border-t border-bunker-border-subtle shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
