import React from 'react';
import { Menu, Clock, ShieldCheck, RefreshCw, Terminal, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AdminHeaderProps {
  moduleTitle: string;
  currentTime: string;
  onOpenSidebar: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  moduleTitle,
  currentTime,
  onOpenSidebar,
  onRefresh,
  isRefreshing = false
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-theme-header/90 backdrop-blur-md border-b border-theme transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl bg-theme-card-subtle text-theme-muted hover:text-theme-main border border-theme lg:hidden cursor-pointer transition-colors"
            aria-label="Menyuni ochish"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-theme-main font-bold tracking-wider flex items-center gap-1.5 uppercase">
              <Terminal className="w-4 h-4 text-[#89B4FA]" />
              BUNKERSTROY
            </span>
            <span className="text-[#89B4FA] font-bold">❯</span>
            <span className="text-theme-muted font-medium tracking-wide">{moduleTitle}</span>
          </div>
        </div>

        {/* Right: Clock, Theme Icon Toggle, Super Admin Badge, Refresh */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          {/* Tashkent Real-time Clock (Pill Widget like User Screenshot) */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-card-subtle border border-theme text-theme-muted shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#89B4FA]" />
            <span className="text-theme-main font-bold">{currentTime || '12:00:00'}</span>
            <span className="text-[10px] text-theme-subtle">UZT</span>
          </div>

          {/* Clean Theme Icon Button (Pill style, no text) */}
          <button
            onClick={toggleTheme}
            aria-label="Mavzuni almashtirish"
            title={theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
            className="w-9 h-9 rounded-full bg-theme-card-subtle border border-theme text-theme-main hover:border-[#89B4FA]/50 flex items-center justify-center transition-all cursor-pointer shadow-xs group"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F9E2AF] transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#1E66F5] transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* Super Admin Badge (Pill Badge) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#89B4FA]/15 border border-[#89B4FA]/30 text-[#89B4FA] font-bold uppercase tracking-wider text-[11px] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SUPER ADMIN</span>
          </div>

          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Ma'lumotlarni yangilash"
              title="Ma'lumotlarni yangilash"
              className="w-9 h-9 rounded-full bg-theme-card-subtle border border-theme text-theme-muted hover:text-theme-main hover:border-theme-subtle flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#89B4FA]' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
