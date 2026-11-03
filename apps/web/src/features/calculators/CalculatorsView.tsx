import React, { useState } from 'react';
import {
  Calculator,
  Building2,
  Layers,
  Zap,
  Leaf
} from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../services/mobileBridge';
import type { CalculatorTab } from './types';
import { ConcreteCalculator } from './ConcreteCalculator';
import { BrickCalculator } from './BrickCalculator';
import { RebarCalculator } from './RebarCalculator';
import { EscoCalculator } from './EscoCalculator';

export const CalculatorsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('concrete');

  return (
    <div className="space-y-6 text-slate-900 pb-16 font-sans">
      {/* 1. Industrial Header Banner */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-2xs border border-slate-200 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-sans font-bold text-[#D95D1E] uppercase tracking-wider">
                Sanoat Muhandislik Kalkulyatorlari
              </span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200/80 px-2.5 py-0.5 rounded-md text-xs font-sans font-semibold">
                GOST &amp; ShNQ Standart
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-900">
              Qurilish Materiallari &amp; ESCO Hisoblagichi
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Beton, sement, g‘isht, armatura va energiya tejamkor bazalt izolyatsiyasini aniq muhandislik formulalari asosida bir zumda hisoblang.
            </p>
          </div>

          <div className="flex items-center gap-2 font-sans text-xs shrink-0">
            <div className="bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl text-slate-700 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#D95D1E]" />
              <span className="font-semibold">4 xil ixtisoslashgan modul</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Calculator Module Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1 font-sans text-xs touch-pan-x">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('concrete');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs min-h-[44px]',
            activeTab === 'concrete'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span>1. Beton &amp; Sement Sarfi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('brick');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs min-h-[44px]',
            activeTab === 'brick'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>2. G‘isht &amp; Gazoblok</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('rebar');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs min-h-[44px]',
            activeTab === 'rebar'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          <Zap className="w-4 h-4 shrink-0" />
          <span>3. Armatura &amp; Metall</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('esco');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs min-h-[44px]',
            activeTab === 'esco'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          <Leaf className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>4. ESCO &amp; Termoizolyatsiya</span>
        </button>
      </div>

      {/* 3. Active Module Render */}
      {activeTab === 'concrete' && <ConcreteCalculator />}
      {activeTab === 'brick' && <BrickCalculator />}
      {activeTab === 'rebar' && <RebarCalculator />}
      {activeTab === 'esco' && <EscoCalculator />}
    </div>
  );
};
