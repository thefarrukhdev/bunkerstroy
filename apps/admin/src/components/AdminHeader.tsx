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
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 text-slate-900 transition-colors duration-200">
      <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile hamburger & breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300 border border-slate-200 lg:hidden cursor-pointer transition-colors shadow-xs shrink-0"
            aria-label="Menyuni ochish"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
              <div className="w-5 h-5 rounded bg-[#D95D1E] text-white flex items-center justify-center font-bold">
                <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-slate-900 font-bold tracking-wider uppercase hidden sm:inline">
                BUNKER<span className="text-[#D95D1E]">STROY</span>
              </span>
            </div>
            <span className="text-[#D95D1E] font-bold text-sm shrink-0">❯</span>
            <span className="text-slate-600 font-semibold tracking-wide truncate max-w-[130px] sm:max-w-xs md:max-w-md">
              {moduleTitle}
            </span>
          </div>
        </div>

        {/* Right: Clock, Theme Icon Toggle, Super Admin Badge, Refresh */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-xs shrink-0">
          {/* Tashkent Real-time Clock */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#D95D1E]" />
            <span className="text-slate-900 font-bold font-mono-numbers">{currentTime || '12:00:00'}</span>
            <span className="text-[10px] text-[#D95D1E] font-bold">UZT</span>
          </div>

          {/* Theme Icon Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Mavzuni almashtirish"
            title={theme === 'dark' ? "Yorug' sanoat rejimiga o'tish" : "Qorong'i sanoat rejimiga o'tish"}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-[#D95D1E] flex items-center justify-center transition-all cursor-pointer shadow-xs group shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D95D1E] transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* Super Admin / Staff Role Badge */}
          <div className="flex items-center px-2.5 sm:px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-slate-800 shadow-xs">
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D95D1E]">
                {staffRole}
              </span>
              <span className="text-[9px] text-slate-600 hidden md:inline truncate max-w-[130px]">
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
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-[#D95D1E] flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D95D1E]' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
