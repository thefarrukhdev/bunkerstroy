import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { CabinetSwitcherProps } from './types';
import { CABINET_OPTIONS, getDedicatedAppUrl } from './constants';

export const CabinetSwitcher: React.FC<CabinetSwitcherProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPath = location.pathname;
  const currentCabinet =
    CABINET_OPTIONS.find((c) => currentPath.startsWith(c.path)) ||
    (currentUser?.role === 'supplier'
      ? CABINET_OPTIONS[1]
      : currentUser?.role === 'admin'
      ? CABINET_OPTIONS[2]
      : CABINET_OPTIONS[0]);

  const CurrentIcon = currentCabinet.icon;

  return (
    <div className={cn('relative shrink-0', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          'flex items-center gap-1.5 sm:gap-2 h-9 sm:h-9 min-h-[38px] px-2.5 sm:px-3 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-2xs select-none outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/40',
          isOpen
            ? 'bg-slate-50 border-[#D95D1E] text-slate-900 ring-2 ring-[#D95D1E]/10'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
        )}
        title="Kabinetlar tanlash (Mijoz, Sotuvchi, Haydovchi, Hamkor, Admin)"
      >
        <div className="w-5 h-5 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D95D1E] shrink-0">
          <CurrentIcon className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left leading-none hidden min-[900px]:block">
          <span className="text-[9.5px] font-mono text-slate-500 font-bold uppercase tracking-tight">
            Kabinet
          </span>
          <span className="text-xs font-bold text-slate-900 truncate max-w-[90px] xl:max-w-[120px]">
            {currentCabinet.title.split(' ')[0]}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-slate-400 transition-transform duration-150 shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Boshqaruv kabinetlari"
          className="absolute right-0 mt-1.5 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-2 font-sans text-xs animate-in fade-in-50 zoom-in-95"
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-slate-900 uppercase tracking-wider">
              5 ta Boshqaruv Kabineti:
            </span>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
              BunkerStroy OS
            </span>
          </div>

          {/* Cabinet Options List */}
          <div className="py-1.5 space-y-1">
            {CABINET_OPTIONS.map((cab) => {
              const Icon = cab.icon;
              const isActive = currentPath.startsWith(cab.path);

              return (
                <button
                  key={cab.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    const dedicatedUrl = getDedicatedAppUrl(cab.id);
                    if (dedicatedUrl) {
                      window.location.href = dedicatedUrl;
                    } else {
                      navigate(cab.path);
                    }
                  }}
                  className={cn(
                    'w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer text-left border',
                    isActive
                      ? 'bg-orange-50 border-orange-200 text-slate-900 shadow-2xs font-semibold'
                      : 'bg-white hover:bg-slate-50 border-transparent text-slate-700 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
                        isActive
                          ? 'bg-[#D95D1E] text-white border-[#C2410C]'
                          : 'bg-slate-50 text-[#D95D1E] border-slate-200'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {cab.title}
                        </span>
                        {cab.isDedicatedApp && <ExternalLink className="w-3 h-3 text-slate-400" />}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {cab.subtitle}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ml-2',
                      cab.badgeColor
                    )}
                  >
                    {cab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* User Account / Auth Section inside dropdown */}
          <div className="mt-1 pt-2 border-t border-slate-100">
            {currentUser ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono font-bold text-[#D95D1E]">
                      {currentUser.stir ? `STIR: ${currentUser.stir}` : currentUser.phone || 'Kirilgan'}
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div className="text-slate-900 font-bold text-xs truncate">
                    {currentUser.companyName || currentUser.displayName || 'Foydalanuvchi'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                  title="Chiqish"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#D95D1E] hover:bg-[#B43B06] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Kabinetga Kirish (B2B &amp; B2C)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
