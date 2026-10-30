import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
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

  const calcResults: ConcreteCalculationResult = useMemo(() => {
    const volume = Math.max(0.1, Number((calcLength * calcWidth * calcHeight).toFixed(2)));
    const cementBagsPerM3 = calcGrade === 'M400' ? 7 : 8.5;
    const sandPerM3 = calcGrade === 'M400' ? 0.45 : 0.42;
    const gravelPerM3 = calcGrade === 'M400' ? 0.8 : 0.82;

    const totalCementBags = Math.ceil(volume * cementBagsPerM3);
    const totalCementTons = (totalCementBags * 50) / 1000;
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
      className="rounded-3xl bg-gradient-to-br from-[#0F2547] to-[#0A1931] border-2 border-[#38BDF8]/40 p-6 sm:p-10 shadow-2xl space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132C54] text-[#38BDF8] text-xs font-mono border border-[#38BDF8]/40">
          <Calculator className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>USTALAR &amp; QURUVCHILAR UCHUN SMETA VOSITASI</span>
        </div>
        <h2 id="calculator-heading" className="text-2xl sm:text-3xl font-black text-white">
          Poydevor &amp; Beton Hajmini Darhol Hisoblang
        </h2>
        <p className="text-xs sm:text-sm text-sky-200/80">
          O‘lchamlarni kiriting — tizim bir zumda kerakli sement qoplari soni va taxminiy narxni hisoblaydi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Form Controls */}
        <div className="lg:col-span-7 bg-[#0A1931] p-5 sm:p-6 rounded-2xl border border-[#1E3A6D] space-y-4">
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
                min="1"
                max="100"
                step="0.5"
                value={calcLength}
                onChange={(e) => setCalcLength(Number(e.target.value) || 1)}
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
                min="1"
                max="100"
                step="0.5"
                value={calcWidth}
                onChange={(e) => setCalcWidth(Number(e.target.value) || 1)}
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
                min="0.1"
                max="5"
                step="0.1"
                value={calcHeight}
                onChange={(e) => setCalcHeight(Number(e.target.value) || 0.1)}
                className="w-full bg-[#0F2547] border border-[#1E3A6D] rounded-xl px-3 py-2 text-white font-mono text-sm sm:text-base focus:border-[#FFB800] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-sky-300 font-bold mb-1.5">
              SEMENT MARKASI
            </label>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Sement markasi tanlovi">
              <button
                type="button"
                onClick={() => setCalcGrade('M400')}
                className={cn(
                  'py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer min-h-[40px] touch-target-44',
                  calcGrade === 'M400'
                    ? 'bg-[#132C54] border-[#FFB800] text-[#FFB800]'
                    : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300'
                )}
              >
                M400 (Standart Bino)
              </button>
              <button
                type="button"
                onClick={() => setCalcGrade('M500')}
                className={cn(
                  'py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer min-h-[40px] touch-target-44',
                  calcGrade === 'M500'
                    ? 'bg-[#132C54] border-[#FFB800] text-[#FFB800]'
                    : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300'
                )}
              >
                M500 (Mustahkam / Og‘ir)
              </button>
            </div>
          </div>
        </div>

        {/* Output Results */}
        <div className="lg:col-span-5 bg-[#132C54] p-5 sm:p-6 rounded-2xl border-2 border-[#FFB800]/50 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
            <span className="text-xs font-mono text-sky-200">Umumiy Beton Hajmi:</span>
            <span className="text-xl font-black font-mono text-white">{calcResults.volume} m³</span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm font-mono">
            <div className="flex justify-between text-slate-200">
              <span>Kerakli Sement:</span>
              <span className="font-bold text-[#FFB800]">
                {calcResults.totalCementBags} qop ({calcResults.totalCementTons} t)
              </span>
            </div>
            <div className="flex justify-between text-slate-200">
              <span>Qum (Yuvilgan):</span>
              <span className="font-bold text-sky-300">{calcResults.totalSandM3} m³</span>
            </div>
            <div className="flex justify-between text-slate-200">
              <span>Shag‘al (5–20mm):</span>
              <span className="font-bold text-sky-300">{calcResults.totalGravelM3} m³</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E3A6D]">
            <div className="text-[11px] font-mono text-sky-300">Taxminiy Material Xarajati:</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
              ~ {calcResults.approxTotalUzs.toLocaleString('uz-UZ')} UZS
            </div>
          </div>

          <Button
            onClick={() => {
              triggerHaptic('medium');
              onNavigateToCatalog();
            }}
            className="w-full bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-bold text-xs py-2.5 rounded-xl cursor-pointer min-h-[40px] touch-target-44"
          >
            Katalogda Sement Buyurtma Qilish
          </Button>
        </div>
      </div>
    </section>
  );
};
