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
  TrendingUp,
  Building2,
  CheckCircle2
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
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0A1931] via-[#0F2547] to-[#0A1931] border-2 border-[#1E3A6D] shadow-[0_25px_70px_rgba(7,19,38,0.85)] p-6 sm:p-10 lg:p-14 text-center">
      {/* Industrial Accent Hazard Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 hazard-stripe-sm opacity-90" />
      
      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Decorative Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Status Pill & Domain */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#132C54]/90 border border-[#FFB800]/60 text-sky-200 text-xs sm:text-sm font-mono shadow-md backdrop-blur-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#FFB800] font-black tracking-wide">{PLATFORM_METRICS.domain}</span>
          <span className="text-slate-400">|</span>
          <span className="text-sky-300 font-medium">B2B &amp; B2C Qurilish Platformasi</span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Calendar className="w-3.5 h-3.5" /> Start: {PLATFORM_METRICS.startDate}
          </span>
        </div>

        {/* Main Platform Value Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Tashqi va Ichki Qurilish Mahsulotlarining{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-300 to-[#FF9000]">
              Onlayn Marketpleysi
            </span>
          </h1>

          <p className="text-base sm:text-xl text-sky-200/90 max-w-3xl mx-auto leading-relaxed font-normal">
            Ta‘minotchi zavodlar, qurilish do‘konlari, usta va xaridorlarni yagona raqamli ekotizim, 
            <span className="text-[#FFB800] font-semibold"> 50/50 xavfsiz to‘lov </span> 
            hamda bepul <span className="text-[#38BDF8] font-semibold">CRM boshqaruv tizimida</span> birlashtiramiz.
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
            className="bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-black text-base px-7 py-3.5 rounded-xl shadow-[0_0_30px_rgba(255,184,0,0.45)] border-2 border-[#FFD000] cursor-pointer flex items-center gap-2.5 transition-all min-h-[48px] touch-target-44 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Package className="w-5 h-5 text-[#071326]" />
            <span>Katalogga O‘tish</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              triggerHaptic('light');
              onNavigateToSellerPanel();
            }}
            className="bg-[#0F2547] hover:bg-[#132C54] text-white border-2 border-[#38BDF8]/70 font-bold text-base px-6 py-3.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all min-h-[48px] touch-target-44 shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Store className="w-5 h-5 text-[#38BDF8]" />
            <span>Sotuvchi Bo‘lish / CRM</span>
          </Button>

          <a
            href={`tel:${PLATFORM_METRICS.adminPhoneRaw}`}
            onClick={() => triggerHaptic('light')}
            className="bg-[#0A1931] hover:bg-[#132C54] text-sky-200 hover:text-white border-2 border-[#1E3A6D] hover:border-[#FFB800]/60 font-bold text-sm sm:text-base px-5 py-3.5 rounded-xl cursor-pointer inline-flex items-center gap-2 transition-all min-h-[48px] touch-target-44"
          >
            <PhoneCall className="w-4 h-4 text-[#FFB800]" />
            <span>Aloqa: {PLATFORM_METRICS.adminPhone}</span>
          </a>
        </div>

        {/* Senior Statistics & Trust Panel */}
        <div className="pt-6 border-t border-[#1E3A6D]/80 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-2xl bg-[#0A1931]/80 border border-[#1E3A6D] text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-300">
              <Truck className="w-4 h-4 text-[#38BDF8]" />
              <span>Respublika Qamrovi</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">12 Viloyat</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Obyektgacha to‘g‘ridan-to‘g‘ri yetkazish</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0A1931]/80 border border-[#1E3A6D] text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Xavfsiz Savdo</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">100% yoki 50/50</div>
            <p className="text-[11px] text-slate-400 mt-0.5">100% onlayn yoki yetib borganda</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0A1931]/80 border border-[#1E3A6D] text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800]">
              <Building2 className="w-4 h-4 text-[#FFB800]" />
              <span>Zavod Narxlari</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">100% Rasmiy</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Vositachilarsiz arzon ta‘minot</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0A1931]/80 border border-[#1E3A6D] text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-200">
              <MonitorCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Aqlli Boshqaruv</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">Bepul CRM</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Onlayn + oflayn kassa nazorati</p>
          </div>
        </div>
      </div>
    </header>
  );
};
