import React from 'react';
import { Factory, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import type { FactoryPartner } from './types';

interface SupplierCardProps {
  factory: FactoryPartner;
  onOpenInquiry: (factory: FactoryPartner) => void;
  onNavigateToCatalog?: () => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  factory: f,
  onOpenInquiry,
  onNavigateToCatalog
}) => {
  return (
    <div className="group relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-5 bg-white border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md text-slate-900 transition-all duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-orange-50 text-[#D95D1E] border border-orange-200/80 px-2.5 py-0.5 rounded-md text-xs font-sans font-bold">
                {f.categoryLabel}
              </span>
              {f.contractStatus === 'STRATEGIC_PARTNER' && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md text-xs font-sans font-semibold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Strategik Hamkor
                </span>
              )}
            </div>
            <h3 className="text-lg font-heading font-black text-slate-900 mt-1">{f.name}</h3>
            <p className="text-xs font-semibold text-[#D95D1E] font-sans">{f.brandName}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
            <Factory className="w-5 h-5 text-[#D95D1E]" />
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-sans">{f.description}</p>

        {/* Data Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans pt-3 border-t border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">STIR (INN):</span>
            <span className="font-bold text-slate-900 font-mono">{f.inn}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Ishlab Chiqarish Quvvati:</span>
            <span className="font-bold text-slate-900">{f.annualCapacity}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Manzil:</span>
            <span className="text-slate-600 truncate block">{f.address}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">QQS To‘lovchi:</span>
            <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 12% QQS To‘liq Tasdiqlangan
            </span>
          </div>
        </div>

        {/* Certified Standards Badges */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 font-sans">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">
            Sertifikatlar &amp; Davlat Standartlari:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {f.standards.map((std, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold"
              >
                {std}
              </span>
            ))}
          </div>
        </div>

        {/* Main Products */}
        <div className="space-y-1.5 font-sans">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">
            Asosiy Tovarlar:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {f.mainProducts.map((p, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-orange-50 border border-orange-200/80 text-[#D95D1E] text-xs font-semibold"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
          <Phone className="w-3.5 h-3.5 text-[#D95D1E]" />
          <span>{f.phone}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {onNavigateToCatalog && (
            <button
              type="button"
              onClick={onNavigateToCatalog}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex-1 sm:flex-initial cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
            >
              <span>Katalogda Ko‘rish</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenInquiry(f)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex-1 sm:flex-initial cursor-pointer bg-[#D95D1E] hover:bg-[#B43B06] active:scale-98 text-white transition-all shadow-2xs"
          >
            <span>Shartnoma Tuzish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
