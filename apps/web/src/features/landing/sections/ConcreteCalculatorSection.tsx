import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2, Layers, Sparkles } from 'lucide-react';
import { cn, Button } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../../services/mobileBridge';
import { ConcreteCalculationResult } from '../types';

interface ConcreteCalculatorSectionProps {
  onNavigateToCatalog: () => void;
}

export const ConcreteCalculatorSection: React.FC<ConcreteCalculatorSectionProps> = ({
  onNavigateToCatalog
}) => {
  const [calcLength, setCalcLength] = useState<number>(10);
  const [calcWidth, setCalcWidth] = useState<number>(8);
  const [calcHeight, setCalcHeight] = useState<number>(0.3);
  const [calcGrade, setCalcGrade] = useState<'M400' | 'M500'>('M400');

  const applyPreset = (len: number, wid: number, hgt: number, grade: 'M400' | 'M500') => {
    triggerHaptic('light');
    setCalcLength(len);
    setCalcWidth(wid);
    setCalcHeight(hgt);
    setCalcGrade(grade);
  };

  const calcResults: ConcreteCalculationResult = useMemo(() => {
    const volume = Math.max(0.1, Number((calcLength * calcWidth * calcHeight).toFixed(2)));
    const cementBagsPerM3 = calcGrade === 'M400' ? 7 : 8.5;
    const sandPerM3 = calcGrade === 'M400' ? 0.45 : 0.42;
    const gravelPerM3 = calcGrade === 'M400' ? 0.8 : 0.82;

    const totalCementBags = Math.ceil(volume * cementBagsPerM3);
    const totalCementTons = Number(((totalCementBags * 50) / 1000).toFixed(2));
    const totalSandM3 = Number((volume * sandPerM3).toFixed(1));
    const totalGravelM3 = Number((volume * gravelPerM3).toFixed(1));

    const bagPrice = calcGrade === 'M400' ? 58000 : 68000;
    const sandPricePerM3 = 120000;
    const gravelPricePerM3 = 145000;

    const approxTotalUzs =
      totalCementBags * bagPrice +
      totalSandM3 * sandPricePerM3 +
      totalGravelM3 * gravelPricePerM3;

    return {
      volume,
      totalCementBags,
      totalCementTons,
      totalSandM3,
      totalGravelM3,
      approxTotalUzs
    };
  }, [calcLength, calcWidth, calcHeight, calcGrade]);

  return (
    <section
      aria-labelledby="calculator-heading"
      className="rounded-3xl bg-gradient-to-br from-[#0F2547] via-[#0A1931] to-[#0F2547] border-2 border-[#38BDF8]/40 p-6 sm:p-10 shadow-2xl space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132C54] text-[#38BDF8] text-xs font-mono border border-[#38BDF8]/40 shadow-xs">
          <Calculator className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>USTALAR &amp; QURUVCHILAR UCHUN SMETA VOSITASI</span>
        </div>
        <h2 id="calculator-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
          Poydevor &amp; Beton Hajmini Darhol Hisoblang
        </h2>
        <p className="text-xs sm:text-sm text-sky-200/80 leading-relaxed">
          O‘lchamlarni kiriting — tizim bir zumda kerakli sement qoplari soni, qum, shag‘al va taxminiy xarajatni hisoblab beradi.
        </p>
      </div>

      {/* Presets Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
        <span className="text-slate-400 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FFB800]" /> Tezkor andozalar:
        </span>
        <button
          type="button"
          onClick={() => applyPreset(8, 6, 0.3, 'M400')}
          className="bg-[#132C54] hover:bg-[#1A386B] text-sky-200 border border-[#1E3A6D] px-2.5 py-1 rounded-md cursor-pointer transition-colors"
        >
          Kichik uy (8×6×0.3m)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(12, 10, 0.4, 'M400')}
          className="bg-[#132C54] hover:bg-[#1A386B] text-sky-200 border border-[#1E3A6D] px-2.5 py-1 rounded-md cursor-pointer transition-colors"
        >
          Katta bino (12×10×0.4m)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(15, 3, 0.15, 'M500')}
          className="bg-[#132C54] hover:bg-[#1A386B] text-sky-200 border border-[#1E3A6D] px-2.5 py-1 rounded-md cursor-pointer transition-colors"
        >
          Yo‘lak / Plita (15×3×0.15m)
        </button>
      </div>

      {/* Main Grid: Controls & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Form Controls */}
        <div className="lg:col-span-7 bg-[#0A1931] p-5 sm:p-6 rounded-2xl border border-[#1E3A6D] space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="calc-len"
                  className="block text-[11px] font-mono text-sky-300 font-bold mb-1"
                >
                  UZUNLIK (M)
                </label>
                <input
                  id="calc-len"
                  type="number"
                  min="0.5"
                  max="200"
                  step="0.5"
                  value={calcLength}
                  onChange={(e) => setCalcLength(Math.max(0.1, Number(e.target.value) || 0.1))}
                  className="w-full bg-[#0F2547] border border-[#1E3A6D] rounded-xl px-3 py-2 text-white font-mono text-sm sm:text-base focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-wid"
                  className="block text-[11px] font-mono text-sky-300 font-bold mb-1"
                >
                  KENGLIK (M)
                </label>
                <input
                  id="calc-wid"
                  type="number"
                  min="0.5"
                  max="200"
                  step="0.5"
                  value={calcWidth}
                  onChange={(e) => setCalcWidth(Math.max(0.1, Number(e.target.value) || 0.1))}
                  className="w-full bg-[#0F2547] border border-[#1E3A6D] rounded-xl px-3 py-2 text-white font-mono text-sm sm:text-base focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-hgt"
                  className="block text-[11px] font-mono text-sky-300 font-bold mb-1"
                >
                  BALANDLIK (M)
                </label>
                <input
                  id="calc-hgt"
                  type="number"
                  min="0.05"
                  max="10"
                  step="0.05"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Math.max(0.05, Number(e.target.value) || 0.05))}
                  className="w-full bg-[#0F2547] border border-[#1E3A6D] rounded-xl px-3 py-2 text-white font-mono text-sm sm:text-base focus:border-[#FFB800] focus:outline-none"
                />
              </div>
            </div>

            {/* Cement Grade Toggle */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-sky-300 font-bold">
                SEMENT MARKASI
              </label>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Sement markasi tanlovi">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setCalcGrade('M400');
                  }}
                  className={cn(
                    'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer min-h-[44px] touch-target-44 text-left flex flex-col justify-center',
                    calcGrade === 'M400'
                      ? 'bg-[#132C54] border-[#FFB800] text-[#FFB800] shadow-sm'
                      : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300 hover:border-slate-500'
                  )}
                >
                  <span>M400 (Standart Bino)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Turar-joy va oddiy fundament uchun</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setCalcGrade('M500');
                  }}
                  className={cn(
                    'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer min-h-[44px] touch-target-44 text-left flex flex-col justify-center',
                    calcGrade === 'M500'
                      ? 'bg-[#132C54] border-[#FFB800] text-[#FFB800] shadow-sm'
                      : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300 hover:border-slate-500'
                  )}
                >
                  <span>M500 (Mustahkam / Og‘ir)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Ko‘p qavatli va og‘ir plitalar uchun</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0F2547] border border-[#1E3A6D] text-[11px] font-mono text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Formula O‘zDSt va GOST qurilish me‘yorlariga muvofiq hisoblangan.</span>
          </div>
        </div>

        {/* Output Results Box */}
        <div className="lg:col-span-5 bg-[#132C54] p-5 sm:p-6 rounded-2xl border-2 border-[#FFB800]/50 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
              <span className="text-xs font-mono text-sky-200 font-semibold">Umumiy Beton Hajmi:</span>
              <span className="text-2xl font-black font-mono text-white">{calcResults.volume} m³</span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm font-mono">
              <div className="flex justify-between items-center text-slate-200">
                <span>Kerakli Sement:</span>
                <span className="font-bold text-[#FFB800] text-sm sm:text-base">
                  {calcResults.totalCementBags} qop ({calcResults.totalCementTons} t)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-200">
                <span>Qum (Yuvilgan):</span>
                <span className="font-bold text-sky-300">{calcResults.totalSandM3} m³</span>
              </div>
              <div className="flex justify-between items-center text-slate-200">
                <span>Shag‘al (5–20mm):</span>
                <span className="font-bold text-sky-300">{calcResults.totalGravelM3} m³</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E3A6D]">
              <div className="text-[11px] font-mono text-sky-300 font-bold uppercase">
                Taxminiy Material Xarajati:
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
                ~ {calcResults.approxTotalUzs.toLocaleString('uz-UZ')} UZS
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                (O‘rtacha bozor narxlari asosida smeta)
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              triggerHaptic('medium');
              onNavigateToCatalog();
            }}
            className="w-full bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-bold text-xs sm:text-sm py-3 rounded-xl cursor-pointer min-h-[44px] touch-target-44 shadow-md flex items-center justify-center gap-1.5 transition-all mt-4"
          >
            <span>Katalogda Sement Buyurtma Qilish</span>
            <ArrowRight className="w-4 h-4 text-[#071326]" />
          </Button>
        </div>
      </div>
    </section>
  );
};
