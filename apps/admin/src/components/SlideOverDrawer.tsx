import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
}

export const SlideOverDrawer: React.FC<SlideOverDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  widthClass = 'max-w-md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div
          className={`w-screen ${widthClass} bg-theme-sidebar border-l border-theme shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out text-theme-main animate-in slide-in-from-right`}
        >
          {/* Drawer Header */}
          <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-theme bg-theme-header flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-bold font-mono text-theme-main uppercase tracking-wider truncate">
                {title}
              </h2>
              {subtitle && <p className="text-xs text-theme-muted font-mono mt-0.5 truncate">{subtitle}</p>}
            </div>

            <button
              onClick={onClose}
              aria-label="Yopish"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-theme-subtle hover:text-theme-main hover:bg-theme-card-subtle transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">{children}</div>

          {/* Drawer Footer (Optional) */}
          {footer && (
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-theme bg-theme-header flex items-center justify-end gap-2.5 sm:gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
