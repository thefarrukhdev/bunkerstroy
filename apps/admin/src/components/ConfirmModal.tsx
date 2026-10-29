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
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-theme-card border border-theme rounded-2xl shadow-2xl p-4 sm:p-6 z-10 text-theme-main animate-in fade-in zoom-in-95 duration-150 transition-colors flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {isDangerous && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-bold text-theme-main font-mono uppercase tracking-wide break-words">
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
            aria-label="Yopish"
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-theme-subtle hover:text-theme-main rounded-xl hover:bg-theme-card-subtle transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Body / Form Slot */}
        {children && <div className="my-3 flex-1">{children}</div>}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 mt-6 pt-4 border-t border-theme text-xs font-mono">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl border border-theme text-theme-muted hover:text-theme-main hover:border-theme-subtle bg-transparent transition-colors disabled:opacity-50 cursor-pointer text-center"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm text-center ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'dark:bg-white dark:text-black bg-black text-white hover:opacity-90'
            }`}
          >
            {isLoading ? 'Bajarilmoqda...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
