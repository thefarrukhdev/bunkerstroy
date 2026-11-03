import React from 'react';
import { CreditCard } from 'lucide-react';
import { Modal, Button, Alert } from '@bunkerstroy/ui';
import type { PaymentModalState } from './types';

interface PaymentSimulationModalProps {
  state: PaymentModalState;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  errorMsg: string | null;
}

export const PaymentSimulationModal: React.FC<PaymentSimulationModalProps> = ({
  state,
  onClose,
  onConfirm,
  isLoading,
  errorMsg,
}) => {
  if (!state.isOpen || !state.order) return null;

  const payableAmount =
    state.order.status === 'ARRIVED' && state.order.paymentMode === 'SPLIT_50_50' && !state.order.isSecondPaid
      ? state.order.escrowSecondPart || Math.round(Number(state.order.totalAmount) / 2)
      : state.order.paymentMode === 'SPLIT_50_50'
      ? state.order.escrowFirstPart || Math.round(Number(state.order.totalAmount) / 2)
      : Number(state.order.totalAmount);

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={onClose}
      size="sm"
      title={`${state.provider} Orqali To‘lov`}
      subtitle={`Buyurtma #${state.order.orderNumber} uchun xavfsiz Escrow to‘lovi`}
    >
      <div className="space-y-4 font-sans text-xs">
        {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-center space-y-1">
          <span className="text-[11px] text-slate-500 uppercase font-bold block">
            To‘lanishi kerak bo‘lgan summa:
          </span>
          <span className="text-2xl font-heading font-black text-[#D95D1E] font-mono-numbers">
            {payableAmount.toLocaleString()} so‘m
          </span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600">
          <div className="flex justify-between">
            <span>To‘lov Provayderi:</span>
            <strong className="text-slate-900">{state.provider}</strong>
          </div>
          <div className="flex justify-between">
            <span>Xavfsizlik protokoli:</span>
            <strong className="text-emerald-700">50/50 Escrow Kliring</strong>
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            <CreditCard className="w-4 h-4 mr-1.5" />
            <span>To‘lovni Tasdiqlash</span>
          </Button>
          <Button variant="secondary" size="md" onClick={onClose}>
            Bekor qilish
          </Button>
        </div>
      </div>
    </Modal>
  );
};
