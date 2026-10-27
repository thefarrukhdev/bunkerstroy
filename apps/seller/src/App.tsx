import React, { useState, useEffect } from 'react';
import {
  Factory,
  Store,
  ShoppingBag,
  ShieldCheck,
  ExternalLink,
  Clock,
  Globe,
  Wifi,
  Activity,
  Terminal,
  Building2,
  RefreshCw
} from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SellerPanelView } from './SellerPanelView';

const SellerPortalInner: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cross-app navigation URLs based on environment
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const marketplaceUrl = isLocal ? 'http://localhost:3000' : 'https://bunkerstroy-web.vercel.app';
  const adminUrl = isLocal ? 'http://localhost:3002' : 'https://bunkerstroy-admin.vercel.app';

  // Live Tashkent Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#071326] text-[#F5F5F2] flex flex-col font-sans selection:bg-[#FFB800] selection:text-[#071326]">
      {/* =========================================================================
          TOP INDUSTRIAL HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 brushed-steel-header border-b-2 border-[#1E3A6D] text-[#F5F5F2] shadow-2xl">
        {/* Top Hazard Stripe Accent */}
        <div className="h-1 w-full hazard-stripe-sm opacity-90" />

        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Identity & Active Profile */}
          <div className="flex items-center gap-3 md:gap-5 min-w-0">
            {/* BunkerStroy Brand Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#071326] border border-[#1E3A6D] shadow-inner shrink-0">
              <div className="w-6 h-6 rounded-lg bg-[#FFB800] text-[#071326] flex items-center justify-center font-black shadow-md">
                <Factory className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black tracking-wider uppercase text-sm">
                  BUNKER<span className="text-[#FFB800]">STROY</span>
                </span>
                <span className="text-[9px] text-sky-300 font-mono font-bold tracking-widest uppercase">
                  SELLER & POS CRM
                </span>
              </div>
            </div>

            {/* Active Factory / Store Identity Badge */}
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0A1931]/80 border border-[#1E3A6D] text-xs font-mono">
              <Building2 className="w-3.5 h-3.5 text-[#FFB800]" />
              <div className="flex items-center gap-2">
                <span className="text-white font-bold tracking-wide">
                  BEKOBOD METALL INVEST MCHJ
                </span>
                <span className="text-[#1E3A6D]">|</span>
                <span className="text-sky-300">STIR: 308112233</span>
                <span className="text-[#1E3A6D]">|</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  POS Terminal #04
                </span>
              </div>
            </div>
          </div>

          {/* Right: Cross-Platform Quick Nav, Clock, Lang & Refresh */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cross-Link 1: Bozor Vitrinasi (Marketplace) */}
            <a
              href={marketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0F2547] hover:bg-[#1E3A6D] border border-[#1E3A6D] hover:border-[#FFB800] text-sky-200 hover:text-white text-xs font-bold font-mono transition-all duration-200 group shadow-sm"
              title="BunkerStroy Xaridorlar Vitrinasi (apps/web)"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#FFB800] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Bozor Vitrinasi</span>
              <ExternalLink className="w-3 h-3 text-sky-400 group-hover:text-[#FFB800]" />
            </a>

            {/* Cross-Link 2: Admin Panel */}
            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0F2547] hover:bg-[#1E3A6D] border border-[#1E3A6D] hover:border-[#FFB800] text-sky-200 hover:text-white text-xs font-bold font-mono transition-all duration-200 group shadow-sm"
              title="BunkerStroy Boshqaruv Markazi (apps/admin)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFB800] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Admin Panel</span>
              <ExternalLink className="w-3 h-3 text-sky-400 group-hover:text-[#FFB800]" />
            </a>

            {/* Real-time Tashkent Clock */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#071326] border border-[#1E3A6D] text-sky-200 font-mono text-xs shadow-inner">
              <Clock className="w-3.5 h-3.5 text-[#FFB800]" />
              <span className="text-white font-black">{currentTime || '12:00:00'}</span>
              <span className="text-[10px] text-[#FFB800] font-bold">UZT</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#071326] hover:bg-[#0F2547] border border-[#1E3A6D] hover:border-[#FFB800] text-xs font-mono font-bold text-sky-200 hover:text-white cursor-pointer transition-all shadow-sm"
              title="Tilni almashtirish / Сменить язык"
              aria-label="Tilni almashtirish"
            >
              <Globe className="w-3.5 h-3.5 text-[#FFB800]" />
              <span className="uppercase text-[#FFB800] font-black">{language}</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-[#071326] hover:bg-[#0F2547] border border-[#1E3A6D] hover:border-[#FFB800] text-sky-200 hover:text-[#FFB800] cursor-pointer transition-all shadow-sm disabled:opacity-50"
              title="Kassa va Ombor ma'lumotlarini yangilash"
              aria-label="Yangilash"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FFB800]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN SELLER & POS CRM VIEW
          ========================================================================= */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-3 sm:p-5 lg:p-6">
        <SellerPanelView />
      </main>

      {/* =========================================================================
          INDUSTRIAL FOOTER STATUS BAR
          ========================================================================= */}
      <footer className="border-t border-[#1E3A6D] bg-[#0A1931] text-xs font-mono text-slate-400 py-3 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: System Health & Status */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Wifi className="w-3.5 h-3.5" />
              <span>POS TIZIM: ONLAYN</span>
            </div>
            <span className="text-[#1E3A6D] hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-sky-300">
              <Activity className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Escrow Gateway v2.4: Faol (1.5% komissiya)</span>
            </div>
            <span className="text-[#1E3A6D] hidden sm:inline">•</span>
            <span className="text-slate-400">
              STIR: 308112233 (QQS to‘lovchi № 3260012)
            </span>
          </div>

          {/* Right: Build & Copyright */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-[#071326] border border-[#1E3A6D] text-sky-200">
              @bunkerstroy/seller:3001
            </span>
            <span>&copy; {new Date().getFullYear()} BunkerStroy B2B Industrial Ecosystem</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <SellerPortalInner />
    </LanguageProvider>
  );
}
