import React from 'react';
import {
  CheckCircle2,
  Truck,
  Navigation,
  PackageCheck
} from 'lucide-react';
import type { ConfirmedDispatch } from './types';

interface ActiveDispatchCardProps {
  dispatch: ConfirmedDispatch;
  onReset: () => void;
}

export const ActiveDispatchCard: React.FC<ActiveDispatchCardProps> = ({
  dispatch,
  onReset,
}) => {
  return (
    <div className="bg-white border-2 border-emerald-400 p-5 sm:p-6 rounded-2xl space-y-4 shadow-2xs text-slate-900 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Reys Tasdiqlandi</h3>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-md text-xs font-sans font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Biriktirildi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Dispetcherlik ID: <span className="text-[#D95D1E] font-bold">{dispatch.id}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 rounded-xl text-xs font-sans font-bold cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
        >
          Yangi Reys Hisoblash
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Haydovchi</span>
          <p className="text-sm font-bold text-slate-900">{dispatch.driverName}</p>
          <p className="text-[11px] text-[#D95D1E] font-bold font-mono">{dispatch.driverPhone}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Maxsus Texnika</span>
          <p className="text-sm font-bold text-slate-900 truncate">{dispatch.vehicleName}</p>
          <p className="text-[11px] text-slate-600 font-mono">{dispatch.plateNumber}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Masofa &amp; Vaqt</span>
          <p className="text-sm font-black text-slate-900 font-mono-numbers">{dispatch.distanceKm} km</p>
          <p className="text-[11px] text-slate-600">~{dispatch.estimatedHours} soat</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Jami Reys Narxi</span>
          <p className="text-sm font-black text-[#D95D1E] font-mono-numbers">{dispatch.totalCost.toLocaleString()} so‘m</p>
          <p className="text-[11px] text-emerald-700 font-semibold">Kafolatlangan reys</p>
        </div>
      </div>

      {/* 4-Step Route Tracker */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-sans text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>1. Qabul qilindi</span>
          </div>
          <div className="flex items-center gap-2 text-[#D95D1E] font-bold">
            <Truck className="w-4 h-4 text-[#D95D1E]" />
            <span>2. Yuklanmoqda</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Navigation className="w-4 h-4 text-slate-400" />
            <span>3. Yo‘lda</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <PackageCheck className="w-4 h-4 text-slate-400" />
            <span>4. Ob'ektda</span>
          </div>
        </div>
      </div>
    </div>
  );
};
