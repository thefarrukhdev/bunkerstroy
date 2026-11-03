import React, { useState } from 'react';
import {
  Package,
  MapPin,
  CreditCard,
  QrCode,
  KeyRound,
  FileCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { Order } from '@bunkerstroy/types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onOpenPayment: (order: Order, provider: 'PAYME' | 'CLICK') => void;
  onOpenDispute: (order: Order) => void;
  onOpenB2bDocs: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order: o,
  onOpenPayment,
  onOpenDispute,
  onOpenB2bDocs,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPendingPayment = o.paymentStatus !== 'PAID' && o.status === 'PENDING_PAYMENT';
  const isArrivedWaitingSecondPayment = o.status === 'ARRIVED' && o.paymentMode === 'SPLIT_50_50' && !o.isSecondPaid;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 shadow-2xs space-y-4 text-slate-900 transition-colors font-sans">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 text-[#D95D1E] flex items-center justify-center font-black">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-slate-900 text-sm">
                #{o.orderNumber}
              </span>
              <OrderStatusBadge status={o.status} />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {new Date(o.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 50/50 Escrow indicator */}
        {o.paymentMode === 'SPLIT_50_50' && (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-md text-xs font-semibold inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            50/50 Escrow
          </span>
        )}
      </div>

      {/* 2. Key Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Yetkazish Manzili</span>
          <p className="font-semibold text-slate-900 flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#D95D1E] shrink-0 mt-0.5" />
            <span>
              {o.deliveryAddress?.street || o.deliveryAddress?.district || 'Toshkent shahri'}
            </span>
          </p>
          <p className="text-[11px] text-slate-500">
            {o.deliveryAddress?.region || 'O‘zbekiston'}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Jami Summa</span>
          <p className="font-black text-[#D95D1E] text-sm font-mono-numbers">
            {Number(o.totalAmount).toLocaleString()} so‘m
          </p>
          <p className="text-[11px] text-slate-500">
            {o.paymentMode === 'SPLIT_50_50' ? '50% avans / 50% qabulda' : '100% to‘lov'}
          </p>
        </div>

        {/* Security PIN code box */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-[#D95D1E]" />
            Qabul PIN-Kodi
          </span>
          <div className="text-lg font-heading font-black text-slate-900 tracking-wider font-mono">
            {o.securityPin || '****'}
          </div>
          <p className="text-[10px] text-slate-400">
            Faqat yukni tekshirib olgach bering
          </p>
        </div>
      </div>

      {/* 3. Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Payment actions if pending */}
          {isPendingPayment && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenPayment(o, 'PAYME')}
                className="bg-[#D95D1E] hover:bg-[#B43B06] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payme bilan To‘lash</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenPayment(o, 'CLICK')}
                className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Click</span>
              </button>
            </div>
          )}

          {isArrivedWaitingSecondPayment && (
            <button
              type="button"
              onClick={() => onOpenPayment(o, 'PAYME')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>2-qismni To‘lash (Escrow)</span>
            </button>
          )}

          {/* QR Receipt */}
          <a
            href={`/receipt/${o.orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5 text-[#D95D1E]" />
            <span>Elektron Chek</span>
          </a>

          {/* B2B Documents */}
          <button
            type="button"
            onClick={() => onOpenB2bDocs(o)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-[#D95D1E] hover:bg-orange-100 font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#D95D1E]" />
            <span>B2B Hujjatlar</span>
          </button>

          {/* Dispute */}
          <button
            type="button"
            onClick={() => onOpenDispute(o)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Nizo ochish</span>
          </button>
        </div>

        {/* Accordion toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-slate-600 hover:text-[#D95D1E] font-semibold cursor-pointer py-1 transition-colors"
        >
          <span>{isExpanded ? 'Tafsilotni yashirish' : 'Tovarlar ro‘yxati'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 4. Expandable Items Table */}
      {isExpanded && (
        <div className="mt-3 space-y-3 pt-3 border-t border-slate-100 text-xs font-sans">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 text-[11px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Mahsulot Nomi</th>
                  <th className="py-2.5 px-3 text-center">Miqdori &amp; Birligi</th>
                  <th className="py-2.5 px-3 text-right">Birlik Narxi</th>
                  <th className="py-2.5 px-3 text-right">Jami Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {o.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {item.productTitle}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-700">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono-numbers">
                      {Number(item.unitPrice).toLocaleString()} so‘m
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-[#D95D1E] font-mono-numbers">
                      {Number(item.totalPrice).toLocaleString()} so‘m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
