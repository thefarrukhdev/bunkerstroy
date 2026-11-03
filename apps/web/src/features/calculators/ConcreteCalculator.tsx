import React, { useState, useMemo } from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import type { ConcreteGrade, ConcreteResult } from './types';

const GRADE_RATIOS: Record<ConcreteGrade, { cementKg: number; sandTons: number; gravelTons: number; waterL: number; pricePerM3: number }> = {
  M150: { cementKg: 260, sandTons: 0.85, gravelTons: 1.25, waterL: 190, pricePerM3: 650000 },
  M200: { cementKg: 300, sandTons: 0.80, gravelTons: 1.20, waterL: 195, pricePerM3: 720000 },
  M250: { cementKg: 340, sandTons: 0.75, gravelTons: 1.18, waterL: 200, pricePerM3: 790000 },
  M300: { cementKg: 380, sandTons: 0.70, gravelTons: 1.15, waterL: 205, pricePerM3: 860000 },
  M350: { cementKg: 420, sandTons: 0.65, gravelTons: 1.10, waterL: 210, pricePerM3: 940000 }
};

export const ConcreteCalculator: React.FC = () => {
  const [concreteMode, setConcreteMode] = useState<'volume' | 'area'>('volume');
  const [concreteVolumeM3, setConcreteVolumeM3] = useState<number>(10);
  const [concreteAreaM2, setConcreteAreaM2] = useState<number>(50);
  const [concreteThicknessCm, setConcreteThicknessCm] = useState<number>(15);
  const [concreteGrade, setConcreteGrade] = useState<ConcreteGrade>('M250');

  const calculatedVolume = useMemo(() => {
    if (concreteMode === 'volume') return concreteVolumeM3;
    return Math.round((concreteAreaM2 * (concreteThicknessCm / 100)) * 100) / 100;
  }, [concreteMode, concreteVolumeM3, concreteAreaM2, concreteThicknessCm]);

  const results: ConcreteResult = useMemo(() => {
    const ratio = GRADE_RATIOS[concreteGrade];
    const totalCementKg = Math.round(ratio.cementKg * calculatedVolume);
    const cementBags50kg = Math.ceil(totalCementKg / 50);
    const cementTons = Math.round((totalCementKg / 1000) * 10) / 10;
    const sandTons = Math.round(ratio.sandTons * calculatedVolume * 10) / 10;
    const gravelTons = Math.round(ratio.gravelTons * calculatedVolume * 10) / 10;
    const waterLiters = Math.round(ratio.waterL * calculatedVolume);
    const estimatedCost = Math.round(ratio.pricePerM3 * calculatedVolume);

    return {
      volume: calculatedVolume,
      totalCementKg,
      cementBags50kg,
      cementTons,
      sandTons,
      gravelTons,
      waterLiters,
      estimatedCost
    };
  }, [calculatedVolume, concreteGrade]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
      {/* Input controls (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="font-bold text-sm text-slate-900 uppercase flex items-center gap-1.5 font-sans">
            <Building2 className="w-4 h-4 text-[#D95D1E]" />
            Beton Parametrlari
          </span>
          <span className="text-xs text-slate-500 font-medium">GOST 7473-2010</span>
        </div>

        {/* Mode switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 font-sans">
          <button
            type="button"
            onClick={() => setConcreteMode('volume')}
            className={cn(
              'py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px]',
              concreteMode === 'volume'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Hajm bo‘yicha (m³)
          </button>
          <button
            type="button"
            onClick={() => setConcreteMode('area')}
            className={cn(
              'py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px]',
              concreteMode === 'area'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Maydon &times; Qalinlik
          </button>
        </div>

        {/* Inputs */}
        {concreteMode === 'volume' ? (
          <div className="space-y-1 font-sans">
            <label className="text-xs text-slate-700 block font-medium">Jami beton hajmi (m³):</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={concreteVolumeM3}
              onChange={(e) => setConcreteVolumeM3(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm font-mono-numbers focus:border-[#D95D1E] outline-none"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 font-sans">
            <div className="space-y-1">
              <label className="text-xs text-slate-700 block font-medium">Maydon (m²):</label>
              <input
                type="number"
                min="1"
                value={concreteAreaM2}
                onChange={(e) => setConcreteAreaM2(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm font-mono-numbers focus:border-[#D95D1E] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-700 block font-medium">Qalinlik (sm):</label>
              <input
                type="number"
                min="1"
                max="100"
                value={concreteThicknessCm}
                onChange={(e) => setConcreteThicknessCm(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm font-mono-numbers focus:border-[#D95D1E] outline-none"
              />
            </div>
          </div>
        )}

        {/* Grade Selector */}
        <div className="space-y-1.5 font-sans">
          <label className="text-xs text-slate-700 block font-medium">Beton markasi (Sinf):</label>
          <div className="grid grid-cols-5 gap-1.5">
            {(['M150', 'M200', 'M250', 'M300', 'M350'] as const).map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setConcreteGrade(grade)}
                className={cn(
                  'py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                  concreteGrade === grade
                    ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                )}
              >
                {grade}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 block pt-0.5">
            {concreteGrade === 'M200' && 'Tasma fundament, pol styajkasi uchun'}
            {concreteGrade === 'M250' && 'Monolit fundament, zinalar, plitalar'}
            {concreteGrade === 'M300' && 'Monolit karkas, ustun va og‘ir yukbop konstruksiyalar'}
            {concreteGrade === 'M350' && 'Ko‘p qavatli binolar, gidro-inshootlar'}
            {concreteGrade === 'M150' && 'Yengil tayyorgarlik qatlami (podgotovka)'}
          </span>
        </div>
      </div>

      {/* Results Display (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-sans">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Hisoblangan Hajm:</span>
            <span className="text-xl sm:text-2xl font-black text-[#D95D1E]">
              {results.volume} m³ beton ({concreteGrade})
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Taxminiy Qiymat:</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono-numbers">
              {results.estimatedCost.toLocaleString()} so‘m
            </span>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">Portlendsement M500</span>
            <p className="text-base font-black text-slate-900 font-mono-numbers">
              {results.cementBags50kg} qop
            </p>
            <p className="text-[10px] text-slate-500">({results.cementTons} tonna)</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">Yuvilgan Qum</span>
            <p className="text-base font-black text-slate-900 font-mono-numbers">
              {results.sandTons} t
            </p>
            <p className="text-[10px] text-slate-500">Fraksiya 0-5mm</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">Sheben / Shag‘al</span>
            <p className="text-base font-black text-slate-900 font-mono-numbers">
              {results.gravelTons} t
            </p>
            <p className="text-[10px] text-slate-500">Fraksiya 5-20mm</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">Texnik Suv</span>
            <p className="text-base font-black text-slate-900 font-mono-numbers">
              {results.waterLiters} L
            </p>
            <p className="text-[10px] text-slate-500">Optimal nisbat</p>
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-emerald-800 font-medium">
              Ushbu materiallar to‘g‘ridan-to‘g‘ri BunkerStroy hamkor karer va sement zavodlaridan 50/50 Escrow bilan yetkazib beriladi.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
