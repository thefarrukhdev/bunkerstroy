import React from 'react';
import { Globe, MapPin, Truck, Container } from 'lucide-react';
import type { GlobalPartner } from './types';

interface GlobalTransitCardProps {
  partner: GlobalPartner;
  onOpenGlobalInquiry: (partner: GlobalPartner) => void;
}

export const GlobalTransitCard: React.FC<GlobalTransitCardProps> = ({
  partner: gp,
  onOpenGlobalInquiry
}) => {
  return (
    <div className="group relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-white border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md text-slate-900 transition-all duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center font-bold text-sky-700 text-xs shrink-0 font-sans">
              {gp.countryCode.slice(0, 2)}
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-[#D95D1E] transition-colors leading-snug">
                {gp.name}
              </h4>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-sans mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#D95D1E]" />
                {gp.country} ({gp.countryCode})
              </span>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-md text-xs font-sans font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Faol Tranzit
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-sans text-xs">
          <span className="text-[10px] uppercase text-slate-500 font-bold block">Asosiy Yo‘nalish:</span>
          <span className="font-bold text-slate-900 block">{gp.category}</span>
        </div>

        <div className="space-y-1.5 font-sans text-xs">
          <span className="text-[10px] uppercase text-slate-500 font-bold block">Import Mahsulotlari:</span>
          <div className="flex flex-wrap gap-1.5">
            {gp.materials.map((m, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-md bg-orange-50 border border-orange-200/80 text-[#D95D1E] text-xs font-sans font-semibold">
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-sans pt-2 border-t border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Tranzit Vaqti:</span>
            <span className="font-bold text-slate-900 font-mono">{gp.transitTime}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Hajm Quvvati:</span>
            <span className="font-bold text-slate-900">{gp.capacity}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Yetkazish:</span>
            <span className="text-slate-600 truncate block">{gp.deliveryMethod}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Bojxona Stansiyasi:</span>
            <span className="text-slate-600 truncate block font-mono text-[11px]">{gp.customsStation}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenGlobalInquiry(gp)}
        className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs font-sans"
      >
        <Container className="w-3.5 h-3.5 text-amber-400" />
        <span>Import / Tranzit Narxini So‘rash</span>
      </button>
    </div>
  );
};
