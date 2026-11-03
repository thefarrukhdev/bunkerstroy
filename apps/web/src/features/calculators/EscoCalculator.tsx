import React, { useState, useMemo } from 'react';
import { Leaf } from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import type { EscoResult } from './types';

export const EscoCalculator: React.FC = () => {
  const [heatedAreaM2, setHeatedAreaM2] = useState<number>(240);
  const [insulationThicknessMm, setInsulationThicknessMm] = useState<number>(100);

  const results: EscoResult = useMemo(() => {
    const baselineHeatingCost = heatedAreaM2 * 52000;
    const savingsPercent = insulationThicknessMm === 100 ? 46 : 36;
    const annualSavingsUzs = Math.round(baselineHeatingCost * (savingsPercent / 100));
    const co2Tons = Math.round(heatedAreaM2 * (savingsPercent / 100) * 0.045 * 10) / 10;
    const wallAreaEstimate = heatedAreaM2 * 1.35;
    const basaltVolumeM3 = Math.round(wallAreaEstimate * (insulationThicknessMm / 1000) * 10) / 10;
    const investmentCost = Math.round(basaltVolumeM3 * 1150000 + wallAreaEstimate * 65000);
    const paybackYears = Math.round((investmentCost / annualSavingsUzs) * 10) / 10;

    return {
      savingsPercent,
      annualSavingsUzs,
      co2Tons,
      basaltVolumeM3,
      investmentCost,
      paybackYears
    };
  }, [heatedAreaM2, insulationThicknessMm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
      {/* Input controls (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm font-sans">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="font-bold text-sm text-slate-900 uppercase flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-600" />
            ESCO Bino Parametrlari
          </span>
          <span className="text-xs text-emerald-600 font-bold">ShNQ 2.01.04-18</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-700 block font-medium">Isitiladigan maydon (m²):</label>
          <input
            type="number"
            min="20"
            step="10"
            value={heatedAreaM2}
            onChange={(e) => setHeatedAreaM2(Math.max(10, parseFloat(e.target.value) || 10))}
            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm font-mono-numbers focus:border-[#D95D1E] outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-700 block font-medium">Bazalt plita qalinligi:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setInsulationThicknessMm(50)}
              className={cn(
                'py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                insulationThicknessMm === 50
                  ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              )}
            >
              50 mm Bazalt (Standart)
            </button>
            <button
              type="button"
              onClick={() => setInsulationThicknessMm(100)}
              className={cn(
                'py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                insulationThicknessMm === 100
                  ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              )}
            >
              100 mm Bazalt (Energiya A+)
            </button>
          </div>
        </div>
      </div>

      {/* Results Display (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] text-emerald-600 uppercase font-bold block">Energiya Tejash Salohiyati:</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              -{results.savingsPercent}% Issiqlik Yo‘qotilishi
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Yillik Iqtisod (Gaz/Tok):</span>
            <span className="text-xl sm:text-2xl font-black text-[#D95D1E] font-mono-numbers">
              {results.annualSavingsUzs.toLocaleString()} so‘m / yil
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">Xarajat Qoplanishi</span>
            <p className="text-xl font-black text-slate-900 font-mono-numbers">
              ~{results.paybackYears} yil
            </p>
            <p className="text-xs text-slate-500">Tejamkorlik hisobiga</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-600 uppercase font-bold">CO₂ Kamayishi</span>
            <p className="text-xl font-black text-emerald-600 font-mono-numbers">
              {results.co2Tons} tonna/yil
            </p>
            <p className="text-xs text-slate-500">Ekologik sertifikat</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">Bazalt Hajmi</span>
            <p className="text-xl font-black text-slate-900 font-mono-numbers">
              {results.basaltVolumeM3} m³
            </p>
            <p className="text-xs text-slate-500">NG yong‘inga chidamli</p>
          </div>
        </div>
      </div>
    </div>
  );
};
