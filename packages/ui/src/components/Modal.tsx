import React, { useEffect, useCallback, useId } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  rivetAccents?: boolean;
  className?: string;
  bodyClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerExtra,
  footer,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  rivetAccents = false,
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
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const generatedTitleId = useId();
  const titleId = title ? `modal-title-${generatedTitleId.replace(/:/g, '')}` : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className={cn(
          'relative w-full bg-bunker-surface-1 border border-bunker-border-strong rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl overflow-y-auto max-h-[90vh] text-bunker-text-primary',
          sizeClasses[size],
          className
        )}
      >
        {/* Rivet Accents (Retained for test compatibility, hidden by CSS) */}
        {rivetAccents && (
          <>
            <div className="industrial-rivet absolute top-3 left-3" />
            <div className="industrial-rivet absolute top-3 right-3" />
            <div className="industrial-rivet absolute bottom-3 left-3" />
            <div className="industrial-rivet absolute bottom-3 right-3" />
          </>
        )}

        {/* Modal Header */}
        {(title || showCloseButton || headerExtra) && (
          <div className="flex items-start justify-between gap-4 border-b border-bunker-border-subtle pb-4">
            <div className="space-y-1 min-w-0 flex-1">
              {headerExtra && <div className="mb-2">{headerExtra}</div>}
              {title && (
                typeof title === 'string' ? (
                  <h2 id={titleId} className="text-lg sm:text-xl font-bold text-bunker-text-primary tracking-tight truncate">
                    {title}
                  </h2>
                ) : (
                  <div id={titleId}>{title}</div>
                )
              )}
              {subtitle && (
                typeof subtitle === 'string' ? (
                  <p className="text-xs text-bunker-text-secondary leading-relaxed">
                    {subtitle}
                  </p>
                ) : (
                  <div>{subtitle}</div>
                )
              )}
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

        {/* Modal Body */}
        <div className={cn('space-y-4', bodyClassName)}>{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="pt-4 border-t border-bunker-border-subtle flex flex-wrap items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
