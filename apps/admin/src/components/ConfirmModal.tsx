import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '@bunkerstroy/ui';

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 w-full">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {description && (
          <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isDangerous && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
            <p>{description}</p>
          </div>
        )}
        {children}
      </div>
    </Modal>
  );
};
