import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import { Input } from '../../components/Input';
import { AlertTriangle, X } from 'lucide-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  onConfirmCancel: (reason: string) => void;
}

const REASONS = [
  { value: 'Mijoz iltimosiga ko‘ra bekor qilindi', label: 'Mijoz iltimosiga ko‘ra' },
  { value: 'Ombor zaxirasida tovar yetishmadi', label: 'Ombor zaxirasi yetarli emas' },
  { value: 'To‘lov muddati o‘tdi yoki to‘lov o‘tmadi', label: 'To‘lov o‘tmadi / muddati o‘tdi' },
  { value: 'Yetkazib berish manzili noto‘g‘ri ko‘rsatilgan', label: 'Manzil noto‘g‘ri ko‘rsatilgan' },
  { value: 'Boshqa texnik sabab', label: 'Boshqa sabab' }
];

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  onConfirmCancel
}) => {
  const [selectedReason, setSelectedReason] = useState(REASONS[0].value);
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const fullReason = customNotes.trim()
      ? `${selectedReason}: ${customNotes.trim()}`
      : selectedReason;
    onConfirmCancel(fullReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl p-6 z-10 text-[var(--color-text-primary)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 text-[var(--color-accent-red)]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              Buyurtmani Bekor Qilish ({orderNumber})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Diqqat! Ushbu amal buyurtmani bekor qiladi va audit jurnaliga qayd etiladi. Zaxiralar omborga qaytariladi.
        </p>

        <div className="space-y-3">
          <Select
            label="Bekor qilishning asosiy sababi *"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            options={REASONS}
          />

          <Input
            label="Qo‘shimcha izoh / tafsilot"
            placeholder="Mijoz bilan kelishuv yoki dispetcher qaydi..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--color-border-subtle)]">
          <Button variant="outline" size="md" onClick={onClose}>
            Orqaga
          </Button>
          <Button variant="danger" size="md" onClick={handleConfirm}>
            Bekor qilishni tasdiqlash
          </Button>
        </div>
      </div>
    </div>
  );
};
