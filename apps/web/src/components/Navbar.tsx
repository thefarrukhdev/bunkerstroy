import React from 'react';
import {
  HardHat,
  ShoppingCart,
  User as UserIcon,
  Mic,
  LogOut,
  Search,
  ShieldCheck,
  Truck,
  Leaf,
  Globe,
  ClipboardList,
  Building2,
  Factory,
  FileSpreadsheet
} from 'lucide-react';
import { Badge, Button, Tooltip } from '@bunkerstroy/ui';

export type ActiveTabType =
  | 'marketplace'
  | 'suppliers'
  | 'logistics'
  | 'tenders'
  | 'esco'
  | 'global_bunker'
  | 'certifications'
  | 'orders';

interface NavbarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenVoice: () => void;
  onOpenSearch: () => void;
  currentUser: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenVoice,
  onOpenSearch,
  currentUser,
  onLogout
}) => {
  const navTabs: { id: ActiveTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'marketplace', label: 'B2B Marketplace', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'suppliers', label: 'Zavodlar', icon: <Factory className="w-3.5 h-3.5" /> },
    { id: 'logistics', label: 'Logistika Hub', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'tenders', label: 'Tender & Smeta', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'esco', label: 'ESCO Audit', icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'global_bunker', label: 'Global Bunker', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'certifications', label: 'Standartlar', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'orders', label: 'Buyurtmalar', icon: <ClipboardList className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-bunker-border-strong shadow-xs">
      {/* 1. UPPER DECK: Live Telemetry Bar */}
      <div className="bg-slate-50/90 border-b border-bunker-border-subtle py-1.5 px-4 text-[11px] font-mono text-bunker-text-secondary select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left Telemetry Indicators */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
            <Badge variant="success" size="sm" isMono dot className="shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200">
              BUNKER-NET: 99.98% ONLINE
            </Badge>
            <span className="text-bunker-border-strong hidden sm:inline">|</span>
            <span className="text-bunker-text-muted hidden md:inline shrink-0">
              Toshkent: <span className="text-bunker-text-primary font-semibold">+24°C</span> (Beton qotish: <strong className="text-bunker-status-green">92% OPTIMAL</strong>)
            </span>
            <span className="text-bunker-border-strong hidden sm:inline">|</span>
            <span className="shrink-0 hidden sm:inline text-bunker-text-secondary">
              Kafolatlangan ombor: <strong className="text-bunker-amber-500 font-bold">38,400+ t</strong>
            </span>
            <span className="text-bunker-border-strong hidden lg:inline">|</span>
            <span className="shrink-0 hidden lg:inline text-bunker-text-secondary">
              Faol og'ir park: <strong className="text-bunker-text-primary font-bold">64 texnika</strong>
            </span>
          </div>

          {/* Right Action / Compliance Indicators */}
          <div className="flex items-center gap-2.5 text-[10px] shrink-0">
            <Tooltip content="O‘zbekiston Respublikasi Davlat Soliq Qo‘mitasi va E-IMZO integratsiyasi" position="bottom">
              <Badge variant="warning" size="sm" isMono leftIcon={<ShieldCheck className="w-3.5 h-3.5" />} className="cursor-default bg-orange-50 text-orange-800 border-orange-200">
                E-IMZO &amp; Soliq STIR
              </Badge>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* 2. LOWER DECK: Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 group-hover:border-bunker-amber-500 flex items-center justify-center transition-all shadow-xs">
              <HardHat className="w-5 h-5 text-bunker-amber-500 transition-transform group-hover:scale-105" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none text-bunker-text-primary">
                <span className="text-bunker-amber-500">BUNKER</span>STROY
              </span>
              <span className="text-[10px] tracking-wider text-bunker-text-muted uppercase font-mono block mt-0.5">
                B2B Sanoat Xaridlari &amp; Logistika
              </span>
            </div>
          </div>

          {/* Clean Segmented Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-xs uppercase tracking-wider font-semibold font-mono bg-slate-100/70 p-1 rounded-xl border border-bunker-border-strong">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-2 cursor-pointer font-bold transition-all text-xs ${
                    isActive
                      ? 'bg-white text-bunker-amber-500 shadow-xs border border-bunker-border-strong'
                      : 'text-bunker-text-secondary hover:text-bunker-text-primary hover:bg-white/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Global Search Button (Ctrl + K) */}
            <Tooltip content="Global komanda va mahsulotlar qidiruvi (Ctrl + K)" position="bottom">
              <button
                onClick={onOpenSearch}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-white border border-bunker-border-strong hover:border-bunker-amber-500 text-bunker-text-secondary hover:text-bunker-text-primary transition-all cursor-pointer flex items-center gap-2 text-xs font-mono shadow-xs"
              >
                <Search className="w-3.5 h-3.5 text-bunker-amber-500" />
                <span className="hidden lg:inline text-bunker-text-muted">Qidiruv</span>
                <kbd className="hidden sm:inline bg-slate-100 border border-bunker-border-subtle px-1.5 py-0.5 rounded text-[10px] text-bunker-amber-500 font-bold">
                  Ctrl K
                </kbd>
              </button>
            </Tooltip>

            {/* Voice Assistant Button */}
            <Tooltip content="Ovozli AI maslahatchi (Dock Copilot)" position="bottom">
              <button
                onClick={onOpenVoice}
                className="p-2 sm:p-2.5 rounded-xl bg-white border border-bunker-border-strong hover:border-bunker-amber-500 text-bunker-amber-500 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Mic className="w-4 h-4" />
                <span className="text-xs font-mono hidden xl:inline font-semibold">Voice AI</span>
              </button>
            </Tooltip>

            {/* Cart Button */}
            <Tooltip content={cartCount > 0 ? `${cartCount} ta mahsulot xarid savatida` : "Xarid savati bo'sh"} position="bottom">
              <button
                onClick={onOpenCart}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                  cartCount > 0
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-bunker-border-strong text-bunker-text-primary hover:border-bunker-amber-500'
                }`}
              >
                <ShoppingCart className="w-4 h-4 text-bunker-amber-500" />
                {cartCount > 0 && (
                  <Badge variant="success" size="sm" isMono className="px-1.5 py-0 font-bold bg-emerald-600 text-white border-transparent">
                    {cartCount}
                  </Badge>
                )}
              </button>
            </Tooltip>

            {/* Authenticated STIR Corporate Identity Badge or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-bunker-border-strong rounded-xl px-2.5 sm:px-3 py-1.5">
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-bunker-amber-500 font-bold">
                    <ShieldCheck className="w-3 h-3 text-bunker-status-green" />
                    <span>STIR: {currentUser.stir || '304928172'}</span>
                  </div>
                  <span className="text-xs font-bold text-bunker-text-primary truncate max-w-[130px] block">
                    {currentUser.companyName || currentUser.displayName || 'B2B Buyurtmachi'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Tizimdan chiqish"
                  className="text-bunker-text-secondary hover:text-bunker-status-red p-1 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button size="sm" onClick={onOpenAuth}>
                <UserIcon className="w-4 h-4 mr-1" />
                <span>Kirish</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (under sm/md screens) */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 pt-1 border-t border-bunker-border-subtle text-[11px] font-mono">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-bunker-amber-500 text-white shadow-xs'
                    : 'bg-white text-bunker-text-secondary border border-bunker-border-strong'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
