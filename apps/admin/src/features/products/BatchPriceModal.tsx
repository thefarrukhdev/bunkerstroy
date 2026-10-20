import React, { useState } from 'react';
import { ProductItem } from '../../mocks/productsMock';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { X, TrendingUp, TrendingDown, DollarSign, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface BatchPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: ProductItem[];
  onApplyBatchUpdate: (updatedProducts: { id: string; newPrice: number }[]) => void;
}

type UpdateType = 'PERCENT_INCREASE' | 'PERCENT_DECREASE' | 'FIXED_INCREASE' | 'FIXED_DECREASE';

export const BatchPriceModal: React.FC<BatchPriceModalProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  onApplyBatchUpdate
}) => {
  const [updateType, setUpdateType] = useState<UpdateType>('PERCENT_INCREASE');
  const [value, setValue] = useState<number>(5);
  const [reason, setReason] = useState<string>('Zavod ulgurji narxining indeksatsiyasi');

  if (!isOpen) return null;

  // Calculate new prices for preview
  const previewItems = selectedProducts.map((prod) => {
    let newPrice = prod.price;
    if (updateType === 'PERCENT_INCREASE') {
      newPrice = Math.round(prod.price * (1 + value / 100));
    } else if (updateType === 'PERCENT_DECREASE') {
      newPrice = Math.round(prod.price * (1 - value / 100));
    } else if (updateType === 'FIXED_INCREASE') {
      newPrice = prod.price + value;
    } else if (updateType === 'FIXED_DECREASE') {
      newPrice = Math.max(0, prod.price - value);
    }
    const diff = newPrice - prod.price;
    return {
      id: prod.id,
      title: prod.title,
      oldPrice: prod.price,
      newPrice,
      diff,
      unitLabel: prod.unitLabel
    };
  });

  const handleApply = () => {
    const payload = previewItems.map((item) => ({
      id: item.id,
      newPrice: item.newPrice
    }));
    onApplyBatchUpdate(payload);
    onClose();
  };

  const updateTypeOptions = [
    { value: 'PERCENT_INCREASE', label: 'Foizda oshirish (+ %)' },
    { value: 'PERCENT_DECREASE', label: 'Foizda tushirish (- %)' },
    { value: 'FIXED_INCREASE', label: 'Aniq summada oshirish (+ so‘m)' },
    { value: 'FIXED_DECREASE', label: 'Aniq summada tushirish (- so‘m)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl p-6 z-10 text-[var(--color-text-primary)] space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Ommaviy Narx O‘zgartirish (Batch Price Update)
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {selectedProducts.length} ta tanlangan tovar narxini bir vaqtning o‘zida yangilash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="O‘zgartirish usuli"
            value={updateType}
            onChange={(e) => setUpdateType(e.target.value as UpdateType)}
            options={updateTypeOptions}
          />

          <Input
            label={updateType.startsWith('PERCENT') ? 'Foiz miqdori (%)' : 'Summa miqdori (so‘m)'}
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(Math.max(0, Number(e.target.value)))}
          />
        </div>

        <Input
          label="O‘zgartirish sababi (Audit jurnali uchun)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Masalan, Zavod narxi oshishi"
        />

        {/* Live Preview List */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[var(--color-text-secondary)] flex items-center justify-between">
            <span>Narxlar hisob-kitobi (Oldindan ko‘rish):</span>
            <span className="font-mono text-[var(--color-accent-blue)]">
              {previewItems.length} ta mahsulot
            </span>
          </div>

          <div className="max-h-52 overflow-y-auto rounded-xl border border-[var(--color-border-subtle)] divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-bg)] text-xs">
            {previewItems.map((item) => (
              <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[var(--color-text-primary)] truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
                    Hozirgi: {item.oldPrice.toLocaleString()} so‘m / {item.unitLabel}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[var(--color-text-muted)]">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <div className="text-right">
                    <div className="font-mono font-bold text-[var(--color-accent-blue)]">
                      {item.newPrice.toLocaleString()} so‘m
                    </div>
                    <div
                      className={`text-[10px] font-mono font-bold ${
                        item.diff > 0
                          ? 'text-[var(--color-accent-green)]'
                          : item.diff < 0
                          ? 'text-[var(--color-accent-red)]'
                          : 'text-[var(--color-text-muted)]'
                      }`}
                    >
                      {item.diff > 0 ? `+${item.diff.toLocaleString()}` : item.diff.toLocaleString()} so‘m
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <Button variant="outline" size="md" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleApply}
            disabled={selectedProducts.length === 0}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Yangi Narxlarni Saqlash ({selectedProducts.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
