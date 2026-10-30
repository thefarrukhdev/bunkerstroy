import React from 'react';
import {
  Calendar,
  Package,
  PhoneCall,
  Store,
  ShieldCheck,
  Truck,
  MonitorCheck,
  ArrowRight
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
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0A1931] via-[#0F2547] to-[#0A1931] border-2 border-[#1E3A6D] shadow-[0_20px_60px_rgba(7,19,38,0.8)] p-6 sm:p-10 lg:p-14 text-center">
      {/* Subtle Industrial Background Grid & Hazard Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 hazard-stripe-sm opacity-90" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Start Date & Presentation Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#132C54] border border-[#FFB800]/60 text-sky-200 text-xs sm:text-sm font-mono shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[#FFB800] font-black">{PLATFORM_METRICS.domain}</span>
          <span className="text-slate-400">|</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Calendar className="w-3.5 h-3.5" /> Start: {PLATFORM_METRICS.startDate}
          </span>
        </div>

        {/* Exact Headline from Slide 1 */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Tashqi va Ichki Qurilish Mahsulotlarining{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-300 to-[#FF9000]">
            Onlayn Marketpleysi
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-sky-200/90 max-w-3xl mx-auto leading-relaxed">
          Ta‘minotchi zavodlar, qurilish marketlari, ustalar va xaridorlarni yagona onlayn ekotizim va integratsiyalashgan CRM tizimida birlashtiramiz.
        </p>

        {/* Call to Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button
            size="lg"
            onClick={() => {
              triggerHaptic('medium');
              onNavigateToCatalog();
            }}
            className="bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-black text-base px-7 py-3.5 rounded-xl shadow-[0_0_25px_rgba(255,184,0,0.4)] border-2 border-[#FFD000] cursor-pointer flex items-center gap-2.5 transition-all min-h-[48px] touch-target-44 hover:scale-[1.02]"
          >
            <Package className="w-5 h-5 text-[#071326]" />
            <span>Katalog &amp; Mahsulotlar</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <a
            href={`tel:${PLATFORM_METRICS.adminPhoneRaw}`}
            onClick={() => triggerHaptic('light')}
            className="bg-[#0F2547] hover:bg-[#132C54] text-white border-2 border-[#38BDF8]/60 font-bold text-base px-6 py-3.5 rounded-xl cursor-pointer inline-flex items-center gap-2 transition-all min-h-[48px] touch-target-44"
          >
            <PhoneCall className="w-5 h-5 text-[#38BDF8]" />
            <span>Admin: {PLATFORM_METRICS.adminPhone}</span>
          </a>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              triggerHaptic('light');
              onNavigateToSellerPanel();
            }}
            className="bg-[#0A1931] hover:bg-[#0F2547] text-sky-200 border-2 border-[#1E3A6D] font-bold text-base px-6 py-3.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all min-h-[48px] touch-target-44"
          >
            <Store className="w-5 h-5 text-[#FFB800]" />
            <span>Sotuvchi &amp; CRM Paneli</span>
          </Button>
        </div>

        {/* Quick Pillars info */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-mono text-sky-300/80">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>50% Onlayn + 50% Naqd</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#38BDF8]" />
            <span>O‘zbekiston Bo‘ylab (12 Viloyat)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MonitorCheck className="w-4 h-4 text-[#FFB800]" />
            <span>Onlayn + Oflayn CRM Tizimi</span>
          </span>
        </div>
      </div>
    </header>
  );
};
