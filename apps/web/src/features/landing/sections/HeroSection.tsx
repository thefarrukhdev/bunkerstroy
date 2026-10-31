import React from 'react';
import {
  Calendar,
  Package,
  PhoneCall,
  Store,
  ShieldCheck,
  Truck,
  MonitorCheck,
  ArrowRight,
  Building2
} from 'lucide-react';
import { Button } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../../services/mobileBridge';
import { PLATFORM_METRICS } from '../constants';

interface HeroSectionProps {
  onNavigateToCatalog: () => void;
  onNavigateToSellerPanel: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateToCatalog,
  onNavigateToSellerPanel
}) => {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-14 text-center">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 tech-grid-pattern opacity-60 pointer-events-none" />

      {/* Decorative Subtle Brand Accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Main Platform Value Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Tashqi va Ichki Qurilish Mahsulotlarining{' '}
            <span className="text-[#D95D1E]">
              Milliy Marketpleysi
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Ta‘minotchi zavodlar, qurilish do‘konlari, usta va xaridorlarni yagona raqamli ekotizim, 
            <span className="text-emerald-700 font-semibold"> 50/50 xavfsiz to‘lov </span> 
            hamda bepul <span className="text-sky-700 font-semibold">CRM boshqaruv tizimida</span> birlashtiramiz.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button
            size="lg"
            onClick={() => {
              triggerHaptic('medium');
              onNavigateToCatalog();
            }}
            className="bg-[#D95D1E] hover:bg-[#B43B06] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-xs border border-[#C2410C] cursor-pointer flex items-center gap-2.5 transition-all min-h-[48px] touch-target-44 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Package className="w-5 h-5 text-white" />
            <span>Katalogga O‘tish</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              triggerHaptic('light');
              onNavigateToSellerPanel();
            }}
            className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-base px-6 py-3.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all min-h-[48px] touch-target-44 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <Store className="w-5 h-5 text-[#D95D1E]" />
            <span>Sotuvchi Kabineti / POS</span>
          </Button>

          <a
            href={`tel:${PLATFORM_METRICS.adminPhoneRaw}`}
            onClick={() => triggerHaptic('light')}
            className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 font-bold text-sm sm:text-base px-5 py-3.5 rounded-xl cursor-pointer inline-flex items-center gap-2 transition-all min-h-[48px] touch-target-44 shadow-xs"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>Aloqa: {PLATFORM_METRICS.adminPhone}</span>
          </a>
        </div>

        {/* Senior Statistics & Trust Panel */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-50/75 border border-slate-200 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-700">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>Respublika Qamrovi</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">12 Viloyat</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Obyektgacha to‘g‘ridan-to‘g‘ri yetkazish</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/75 border border-slate-200 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Xavfsiz Savdo</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">100% yoki 50/50</div>
            <p className="text-[11px] text-slate-500 mt-0.5">100% onlayn yoki yetib borganda</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/75 border border-slate-200 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-700">
              <Building2 className="w-4 h-4 text-[#D95D1E]" />
              <span>Zavod Narxlari</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">100% Rasmiy</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Vositachilarsiz to‘g‘ridan-to‘g‘ri ta‘minot</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/75 border border-slate-200 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
              <MonitorCheck className="w-4 h-4 text-slate-700" />
              <span>Aqlli Boshqaruv</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Bepul CRM</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Onlayn + oflayn kassa nazorati</p>
          </div>
        </div>
      </div>
    </header>
  );
};
