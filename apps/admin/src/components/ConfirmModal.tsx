import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Tasdiqlash',
  cancelText = 'Bekor qilish',
  isDangerous = false,
  isLoading = false,
  children
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-theme-card border border-theme rounded-lg shadow-2xl p-6 z-10 text-theme-main animate-in fade-in zoom-in-95 duration-150 transition-colors">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {isDangerous && (
              <div className="p-2 rounded bg-theme-card-subtle border border-theme text-theme-main">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-theme-main font-mono uppercase tracking-wide">
                {title}
              </h3>
              {description && (
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-theme-subtle hover:text-theme-main rounded hover:bg-theme-card-subtle transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Body / Form Slot */}
        {children && <div className="my-4">{children}</div>}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-theme text-xs font-mono">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded border border-theme text-theme-muted hover:text-theme-main hover:border-theme-subtle bg-transparent transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded font-bold transition-all disabled:opacity-50 cursor-pointer dark:bg-white dark:text-black bg-black text-white hover:opacity-90 shadow-sm"
          >
            {isLoading ? 'Bajarilmoqda...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
