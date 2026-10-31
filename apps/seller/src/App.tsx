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
  Building2,
  RefreshCw,
  Menu,
  X,
  Package,
  PlusCircle,
  Calculator,
  BarChart3,
  Truck,
  Wallet,
  ChevronRight
} from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SellerPanelView, SellerTab } from './SellerPanelView';

const SellerPortalInner: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<SellerTab>('inventory');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Cross-app navigation URLs based on environment
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
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

  const navItems = [
    { id: 'inventory' as SellerTab, label: 'Mahsulotlar Ombori', shortLabel: 'Ombor', icon: Package },
    { id: 'create' as SellerTab, label: '+ Yangi Tovar Qo‘shish', shortLabel: '+ Tovar', icon: PlusCircle },
    { id: 'crm_pos' as SellerTab, label: 'Do‘kon Kassa (POS CRM)', shortLabel: 'Kassa POS', icon: Calculator, isAccent: true },
    { id: 'b2b' as SellerTab, label: 'B2B Zavodlar & Buyurtmalar', shortLabel: 'B2B', icon: Factory },
    { id: 'reports' as SellerTab, label: 'Moliyaviy Kirim-Chiqim', shortLabel: 'Moliya', icon: BarChart3 },
    { id: 'orders' as SellerTab, label: 'Buyurtmalar & Logistika', shortLabel: 'Buyurtmalar', icon: Truck },
    { id: 'escrow' as SellerTab, label: '50/50 Escrow Reestri', shortLabel: 'Escrow', icon: Wallet }
  ];

  const handleSelectTab = (tab: SellerTab) => {
    setActiveTab(tab);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#D95D1E] selection:text-white touch-manipulation">
      {/* =========================================================================
          TOP INDUSTRIAL HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs pt-safe">
        <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Hamburger & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Mobile / Tablet Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
              title="Menyuni ochish"
              aria-label="Menyuni ochish"
            >
              <Menu className="w-5 h-5 text-[#D95D1E]" />
            </button>

            {/* BunkerStroy Brand Pill */}
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs shrink-0">
              <div className="w-6 h-6 rounded-lg bg-[#D95D1E] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <Factory className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-slate-900 font-black tracking-wider uppercase text-xs sm:text-sm">
                  BUNKER<span className="text-[#D95D1E]">STROY</span>
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono font-bold tracking-widest uppercase">
                  SELLER &amp; POS CRM
                </span>
              </div>
            </div>

            {/* Active Factory / Store Identity Badge (Responsive) */}
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <Building2 className="w-3.5 h-3.5 text-[#D95D1E]" />
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-bold tracking-wide">
                  BEKOBOD METALL INVEST MCHJ
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">STIR: 308112233</span>
                <span className="text-slate-300">|</span>
                <span className="inline-flex items-center text-emerald-700 font-semibold">
                  POS Terminal #04
                </span>
              </div>
            </div>

            {/* Compact Store indicator on tablet */}
            <div className="hidden sm:flex xl:hidden items-center px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-emerald-700">
              <span>POS #04 Faol</span>
            </div>
          </div>

          {/* Right: Quick Nav, Clock, Lang & Refresh */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Cross-Link 1: Bozor Vitrinasi */}
            <a
              href={marketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold font-mono transition-all duration-200 group shadow-xs min-h-[44px]"
              title="BunkerStroy Xaridorlar Vitrinasi (apps/web)"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D95D1E] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Bozor Vitrinasi</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#D95D1E]" />
            </a>

            {/* Cross-Link 2: Admin Panel */}
            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold font-mono transition-all duration-200 group shadow-xs min-h-[44px]"
              title="BunkerStroy Boshqaruv Markazi (apps/admin)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D95D1E] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Admin Panel</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#D95D1E]" />
            </a>

            {/* Real-time Tashkent Clock */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs shadow-xs min-h-[44px]">
              <Clock className="w-3.5 h-3.5 text-[#D95D1E]" />
              <span className="text-slate-900 font-black">{currentTime || '12:00:00'}</span>
              <span className="text-[10px] text-[#D95D1E] font-bold">UZT</span>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-mono font-bold text-slate-700 hover:text-slate-900 cursor-pointer transition-all shadow-xs min-h-[44px] min-w-[44px] justify-center"
              title="Tilni almashtirish / Сменить язык"
              aria-label="Tilni almashtirish"
            >
              <Globe className="w-3.5 h-3.5 text-[#D95D1E]" />
              <span className="uppercase text-[#D95D1E] font-black">{language}</span>
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-[#D95D1E] cursor-pointer transition-all shadow-xs disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Kassa va Ombor ma'lumotlarini yangilash"
              aria-label="Yangilash"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#D95D1E]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          RESPONSIVE MOBILE / TABLET NAVIGATION DRAWER
          ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white border-r border-slate-200 shadow-2xl flex flex-col h-full z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#D95D1E] text-white flex items-center justify-center font-black">
                  <Factory className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-sm">
                    BUNKER<span className="text-[#D95D1E]">STROY</span>
                  </h3>
                  <span className="text-[9px] font-mono text-slate-500 block">
                    SELLER &amp; POS CRM
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Menyuni yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant Identity Card */}
            <div className="p-4 bg-slate-50/50 border-b border-slate-200 space-y-1.5 font-mono text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Faol Sotuvchi / Zavod:
              </span>
              <p className="font-bold text-slate-900 text-sm">BEKOBOD METALL INVEST MCHJ</p>
              <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1">
                <span>STIR: 308112233</span>
                <span className="text-emerald-700 font-bold">
                  POS #04 Faol
                </span>
              </div>
            </div>

            {/* Drawer Navigation Links */}
            <div className="p-3 space-y-1.5 flex-1">
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                Boshqaruv Bo‘limlari
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer min-h-[48px] ${
                      isActive
                        ? 'bg-[#D95D1E] text-white font-black shadow-xs'
                        : item.isAccent
                        ? 'bg-orange-50/60 text-[#D95D1E] border border-orange-200 hover:border-orange-300'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isAccent ? 'text-[#D95D1E]' : 'text-slate-600'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}

              <div className="pt-4 px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                Tizim Portallari
              </div>

              {/* Cross links in drawer */}
              <a
                href={marketplaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:border-slate-300 font-mono text-xs min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#D95D1E]" />
                  <span>Bozor Vitrinasi (Marketplace)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href={adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:border-slate-300 font-mono text-xs min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#D95D1E]" />
                  <span>Boshqaruv Admin Paneli</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 font-mono text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Toshkent vaqti:</span>
                <span className="text-slate-900 font-bold">{currentTime || '12:00:00'} UZT</span>
              </div>
              <div className="text-[10px] text-slate-400">
                BunkerStroy B2B Industrial Ecosystem v2.4
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN SELLER & POS CRM VIEW
          ========================================================================= */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-3 sm:p-5 lg:p-6 pb-24 md:pb-8">
        <SellerPanelView activeTab={activeTab} onTabChange={setActiveTab} />
      </main>

      {/* =========================================================================
          STICKY MOBILE BOTTOM NAVIGATION BAR (<md screens)
          ========================================================================= */}
      <nav
        aria-label="Mobil tezkor navigatsiya"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe shadow-lg"
      >
        <div className="grid grid-cols-5 gap-1 px-1.5 py-1">
          {/* 1. Ombor */}
          <button
            type="button"
            onClick={() => handleSelectTab('inventory')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              activeTab === 'inventory'
                ? 'text-[#D95D1E] font-bold bg-orange-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-mono mt-0.5">Ombor</span>
          </button>

          {/* 2. Kassa POS (High-visibility) */}
          <button
            type="button"
            onClick={() => handleSelectTab('crm_pos')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              activeTab === 'crm_pos'
                ? 'text-white bg-[#D95D1E] font-black shadow-xs'
                : 'text-[#D95D1E] hover:text-[#B43B06]'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[10px] font-mono mt-0.5">Kassa POS</span>
          </button>

          {/* 3. Buyurtmalar */}
          <button
            type="button"
            onClick={() => handleSelectTab('orders')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              activeTab === 'orders'
                ? 'text-[#D95D1E] font-bold bg-orange-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-[10px] font-mono mt-0.5">Buyurtma</span>
          </button>

          {/* 4. Moliya */}
          <button
            type="button"
            onClick={() => handleSelectTab('reports')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              activeTab === 'reports'
                ? 'text-[#D95D1E] font-bold bg-orange-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-mono mt-0.5">Moliya</span>
          </button>

          {/* 5. Ko'proq (Menyu) */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-500 hover:text-slate-900 transition-all cursor-pointer min-h-[48px]"
          >
            <Menu className="w-5 h-5 text-[#D95D1E]" />
            <span className="text-[10px] font-mono mt-0.5">Menyu</span>
          </button>
        </div>
      </nav>

      {/* =========================================================================
          INDUSTRIAL FOOTER STATUS BAR (Desktop/Tablet)
          ========================================================================= */}
      <footer className="hidden md:block border-t border-slate-200 bg-white text-xs font-mono text-slate-500 py-3 px-4 sm:px-6 lg:px-8 mt-auto pb-safe">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: System Health & Status */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Wifi className="w-3.5 h-3.5" />
              <span>POS TIZIM: ONLAYN</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Activity className="w-3.5 h-3.5 text-[#D95D1E]" />
              <span>Escrow Gateway v2.4: Faol (1.5% komissiya)</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-500">
              STIR: 308112233 (QQS to‘lovchi № 3260012)
            </span>
          </div>

          {/* Right: Build & Copyright */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
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
