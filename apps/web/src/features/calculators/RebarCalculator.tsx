import React, { useState, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import type { RebarResult } from './types';

const LINEAR_MASS_MAP: Record<number, number> = {
  8: 0.395,
  10: 0.617,
  12: 0.888,
  14: 1.21,
  16: 1.58,
  18: 2.0,
  20: 2.47,
  25: 3.85,
  32: 6.31
};

export const RebarCalculator: React.FC = () => {
  const [rebarDiameter, setRebarDiameter] = useState<number>(12);
  const [rebarLengthMeters, setRebarLengthMeters] = useState<number>(500);

  const results: RebarResult = useMemo(() => {
    const massPerMeter = LINEAR_MASS_MAP[rebarDiameter] || 0.888;
    const totalWeightKg = Math.round(massPerMeter * rebarLengthMeters * 10) / 10;
    const totalWeightTons = Math.round((totalWeightKg / 1000) * 1000) / 1000;
    const standardBars117m = Math.ceil(rebarLengthMeters / 11.7);
    const pricePerTon = 9400000;
    const estimatedCost = Math.round(totalWeightTons * pricePerTon);

    return {
      massPerMeter,
      totalWeightKg,
      totalWeightTons,
      standardBars117m,
      estimatedCost
    };
  }, [rebarDiameter, rebarLengthMeters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
      {/* Input controls (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm font-sans">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="font-bold text-sm text-slate-900 uppercase flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#D95D1E]" />
            Armatura Parametrlari
          </span>
          <span className="text-xs text-slate-500 font-medium">GOST 5781-82 / A500C</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-700 block font-medium">Armatura diametri (mm):</label>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
            {[8, 10, 12, 14, 16, 18, 20, 25, 32].map((diam) => (
              <button
                key={diam}
                type="button"
                onClick={() => setRebarDiameter(diam)}
                className={cn(
                  'py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                  rebarDiameter === diam
                    ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                )}
              >
                d{diam}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-700 block font-medium">Umumiy uzunlik (metr):</label>
          <input
            type="number"
            min="1"
            step="10"
            value={rebarLengthMeters}
            onChange={(e) => setRebarLengthMeters(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm font-mono-numbers focus:border-[#D95D1E] outline-none"
          />
        </div>
      </div>

      {/* Results Display (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Jami Og‘irlik:</span>
            <span className="text-xl sm:text-2xl font-black text-[#D95D1E]">
              {results.totalWeightTons} tonna ({results.totalWeightKg.toLocaleString()} kg)
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Zavod Ulgurji Narxi:</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono-numbers">
              {results.estimatedCost.toLocaleString()} so‘m
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">1 Metr Vazni</span>
            <p className="text-lg font-black text-slate-900 font-mono-numbers">
              {results.massPerMeter} kg/m
            </p>
            <p className="text-xs text-slate-500">Standart GOST</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">11.7m Xodalar Soni</span>
            <p className="text-lg font-black text-slate-900 font-mono-numbers">
              ~{results.standardBars117m} dona
            </p>
            <p className="text-xs text-slate-500">Standart uzunlik</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-emerald-600 uppercase font-bold">Yuk Tashish</span>
            <p className="text-lg font-black text-emerald-600 font-mono-numbers">
              {results.totalWeightTons <= 4 ? 'ISUZU Bortli' : 'Fura 20t'}
            </p>
            <p className="text-xs text-slate-500">Og‘irlikka mos</p>
          </div>
        </div>
      </div>
    </div>
  );
};
