import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
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
      className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50/70 text-[#D95D1E] text-xs font-mono font-bold border border-orange-200/80 shadow-2xs">
          <Calculator className="w-3.5 h-3.5 text-[#D95D1E]" />
          <span>USTALAR &amp; QURUVCHILAR UCHUN SMETA VOSITASI</span>
        </div>
        <h2 id="calculator-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
          Poydevor &amp; Beton Hajmini Darhol Hisoblang
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          O‘lchamlarni kiriting — tizim bir zumda kerakli sement qoplari soni, qum, shag‘al va taxminiy xarajatni hisoblab beradi.
        </p>
      </div>

      {/* Presets Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
        <span className="text-slate-500 mr-1 flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#D95D1E]" /> Tezkor andozalar:
        </span>
        <button
          type="button"
          onClick={() => applyPreset(8, 6, 0.3, 'M400')}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md cursor-pointer transition-colors shadow-2xs"
        >
          Kichik uy (8×6×0.3m)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(12, 10, 0.4, 'M400')}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md cursor-pointer transition-colors shadow-2xs"
        >
          Katta bino (12×10×0.4m)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(15, 3, 0.15, 'M500')}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md cursor-pointer transition-colors shadow-2xs"
        >
          Yo‘lak / Plita (15×3×0.15m)
        </button>
      </div>

      {/* Main Grid: Controls & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Form Controls */}
        <div className="lg:col-span-7 bg-slate-50/75 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="calc-len"
                  className="block text-[11px] font-mono text-slate-700 font-bold mb-1"
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
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-sm sm:text-base focus:border-[#D95D1E] focus:outline-none shadow-2xs"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-wid"
                  className="block text-[11px] font-mono text-slate-700 font-bold mb-1"
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
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-sm sm:text-base focus:border-[#D95D1E] focus:outline-none shadow-2xs"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-hgt"
                  className="block text-[11px] font-mono text-slate-700 font-bold mb-1"
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
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-sm sm:text-base focus:border-[#D95D1E] focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            {/* Cement Grade Toggle */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-slate-700 font-bold">
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
                      ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  )}
                >
                  <span>M400 (Standart Bino)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Turar-joy va oddiy fundament uchun</span>
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
                      ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  )}
                >
                  <span>M500 (Mustahkam / Og‘ir)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Ko‘p qavatli va og‘ir plitalar uchun</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-600 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Formula O‘zDSt va GOST qurilish me‘yorlariga muvofiq hisoblangan.</span>
          </div>
        </div>

        {/* Output Results Box */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono text-slate-600 font-semibold">Umumiy Beton Hajmi:</span>
              <span className="text-2xl font-black font-mono text-slate-900">{calcResults.volume} m³</span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm font-mono">
              <div className="flex justify-between items-center text-slate-700">
                <span>Kerakli Sement:</span>
                <span className="font-bold text-[#D95D1E] text-sm sm:text-base">
                  {calcResults.totalCementBags} qop ({calcResults.totalCementTons} t)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Qum (Yuvilgan):</span>
                <span className="font-bold text-sky-700">{calcResults.totalSandM3} m³</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Shag‘al (5–20mm):</span>
                <span className="font-bold text-sky-700">{calcResults.totalGravelM3} m³</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">
                Taxminiy Material Xarajati:
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 mt-1">
                ~ {calcResults.approxTotalUzs.toLocaleString('uz-UZ')} UZS
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                (O‘rtacha bozor narxlari asosida smeta)
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              triggerHaptic('medium');
              onNavigateToCatalog();
            }}
            className="w-full bg-[#D95D1E] hover:bg-[#B43B06] text-white font-bold text-xs sm:text-sm py-3 rounded-xl cursor-pointer min-h-[44px] touch-target-44 shadow-xs flex items-center justify-center gap-1.5 transition-all mt-4"
          >
            <span>Katalogda Sement Buyurtma Qilish</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </section>
  );
};
