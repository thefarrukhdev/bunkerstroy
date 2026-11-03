import React from 'react';
import {
  CheckCircle,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  ClipboardCheck,
  Building2
} from 'lucide-react';
import { Button } from '@bunkerstroy/ui';

interface OrderSuccessViewProps {
  orderNumber: string;
  securityPin: string;
  onFinishAndNavigate: () => void;
  onClose: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  orderNumber,
  securityPin,
  onFinishAndNavigate,
  onClose,
}) => {
  return (
    <div className="py-8 text-center space-y-6 font-sans">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-xs animate-in zoom-in-95 duration-200">
        <CheckCircle className="w-9 h-9" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
          Buyurtma Qabul Qilindi!
        </h3>
        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          Sizning buyurtmangiz to‘g‘ridan-to‘g‘ri ishlab chiqaruvchi zavod va diler omboriga yo‘naltirildi.
        </p>
      </div>

      {/* Order Number & Pin Badge */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto space-y-3 shadow-2xs">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-semibold">Buyurtma Raqami:</span>
          <span className="font-heading font-black text-slate-900 text-sm">
            #{orderNumber}
          </span>
        </div>

        {/* Security PIN Code Display */}
        <div className="space-y-1 pt-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center justify-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-[#D95D1E]" />
            <span>Xavfsiz Qabul PIN-Kodi:</span>
          </span>
          <div className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-widest py-2 bg-white rounded-xl border border-orange-200 shadow-2xs font-mono">
            {securityPin}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-normal text-left pt-1">
          <strong className="text-slate-700">Muhim:</strong> Ushbu 4 xonali PIN-kodni faqat tovarlar to‘liq yetib kelib, sifat va miqdori ko‘zdan kechirilgach haydovchi yoki dispetcherga ayting.
        </p>
      </div>

      {/* Escrow Status Notice */}
      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl max-w-sm mx-auto text-left flex items-start gap-2.5 text-xs text-emerald-900 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span className="leading-snug">
          Mablag‘ingiz 50/50 Escrow kafolati ostida muzlatildi. Faqat siz PIN-kodni tasdiqlaganingizdan so‘ng yakuniy hisob-kitob amalga oshiriladi.
        </span>
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-sm mx-auto">
        <Button
          variant="primary"
          size="md"
          className="w-full sm:flex-1"
          onClick={onFinishAndNavigate}
        >
          <ClipboardCheck className="w-4 h-4 mr-1.5" />
          <span>Buyurtmalarni Ko‘rish</span>
        </Button>

        <Button
          variant="secondary"
          size="md"
          className="w-full sm:flex-1"
          onClick={onClose}
        >
          <span>Xaridni Davom Ettirish</span>
        </Button>
      </div>
    </div>
  );
};
