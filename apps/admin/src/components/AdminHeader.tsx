import React from 'react';
import { Menu, Clock, ShieldCheck, RefreshCw, Terminal, Sun, Moon, HardHat, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AdminHeaderProps {
  moduleTitle: string;
  currentTime: string;
  onOpenSidebar: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  staffRole?: string;
  staffName?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  moduleTitle,
  currentTime,
  onOpenSidebar,
  onRefresh,
  isRefreshing = false,
  staffRole = 'BOSH SUPER ADMIN',
  staffName = 'ADMIN. (TOSHKENT HQ)'
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 brushed-steel-header border-b-2 border-[#1E3A6D] text-[#F5F5F2] transition-colors duration-200">
      {/* Top Hazard Stripe Ribbon */}
      <div className="h-1 w-full hazard-stripe-sm opacity-90" />

      <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile hamburger & breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#0F2547] text-sky-200 hover:text-white hover:border-[#FFB800] border border-[#1E3A6D] lg:hidden cursor-pointer transition-colors shadow-sm shrink-0"
            aria-label="Menyuni ochish"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071326] border border-[#1E3A6D] shrink-0">
              <div className="w-5 h-5 rounded bg-[#FFB800] text-[#071326] flex items-center justify-center font-black">
                <Terminal className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-white font-black tracking-wider uppercase hidden sm:inline">
                BUNKER<span className="text-[#FFB800]">STROY</span>
              </span>
            </div>
            <span className="text-[#FFB800] font-black text-sm shrink-0">❯</span>
            <span className="text-sky-200 font-semibold tracking-wide truncate max-w-[130px] sm:max-w-xs md:max-w-md">
              {moduleTitle}
            </span>
          </div>
        </div>

        {/* Right: Clock, Theme Icon Toggle, Super Admin Badge, Refresh */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-xs shrink-0">
          {/* Tashkent Real-time Clock (Industrial Pill Widget) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#071326] border border-[#1E3A6D] text-sky-200 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-[#FFB800]" />
            <span className="text-white font-black font-mono-numbers">{currentTime || '12:00:00'}</span>
            <span className="text-[10px] text-[#FFB800] font-bold">UZT</span>
          </div>

          {/* Theme Icon Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Mavzuni almashtirish"
            title={theme === 'dark' ? "Yorug' sanoat rejimiga o'tish" : "Qorong'i sanoat rejimiga o'tish"}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#071326] border border-[#1E3A6D] hover:border-[#FFB800] text-sky-200 hover:text-[#FFB800] flex items-center justify-center transition-all cursor-pointer shadow-sm group shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FFB800] transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-sky-300 transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* Super Admin / Staff Role Badge (Industrial Hazard Badge) */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#071326] border border-[#FFB800]/50 text-[#FFB800] shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse shrink-0" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FFB800]">
                {staffRole}
              </span>
              <span className="text-[9px] text-sky-200 hidden md:inline truncate max-w-[130px]">
                {staffName}
              </span>
            </div>
          </div>

          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Ma'lumotlarni yangilash"
              title="Ma'lumotlarni yangilash"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#071326] border border-[#1E3A6D] hover:border-[#FFB800] text-sky-200 hover:text-[#FFB800] flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FFB800]' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
