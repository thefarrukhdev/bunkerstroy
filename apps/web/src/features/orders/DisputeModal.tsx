import React from 'react';
import { Modal, Button } from '@bunkerstroy/ui';
import type { DisputeModalState } from './types';

interface DisputeModalProps {
  state: DisputeModalState;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  onChangeReason: (val: string) => void;
  onChangeEvidence: (val: string) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  state,
  onClose,
  onSubmit,
  isLoading,
  onChangeReason,
  onChangeEvidence,
}) => {
  if (!state.isOpen) return null;

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={onClose}
      size="sm"
      title="Buyurtma Bo‘yicha Nizo Ochish"
      subtitle={`Buyurtma #${state.orderNumber} bo‘yicha e‘tiroz bildirish`}
    >
      <div className="space-y-3 font-sans text-xs">
        <div>
          <label htmlFor="dispute-reason-text" className="block text-slate-700 font-bold mb-1">
            E‘tiroz sababi * (sifat, yetishmovchilik, shikastlanish)
          </label>
          <textarea
            id="dispute-reason-text"
            name="reason"
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 text-xs font-sans focus:outline-none focus:border-[#D95D1E]"
            placeholder="Yuk shikastlangan holda yetib keldi yoki miqdori kam..."
            value={state.reason}
            onChange={(e) => onChangeReason(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="dispute-evidence-url" className="block text-slate-700 font-bold mb-1">
            Foto yoki video dalil havolasi (ixtiyoriy)
          </label>
          <input
            id="dispute-evidence-url"
            name="evidenceUrl"
            type="url"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 text-xs font-sans focus:outline-none focus:border-[#D95D1E]"
            placeholder="https://..."
            value={state.evidenceUrl}
            onChange={(e) => onChangeEvidence(e.target.value)}
          />
        </div>

        <div className="pt-2 flex gap-2">
          <Button
            variant="danger"
            size="md"
            className="flex-1"
            isLoading={isLoading}
            onClick={onSubmit}
          >
            Nizo Yuborish
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Bekor qilish
          </Button>
        </div>
      </div>
    </Modal>
  );
};
