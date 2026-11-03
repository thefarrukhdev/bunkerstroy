import React, { useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingCart,
  ChevronRight,
  LogOut,
  User as UserIcon,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import {
  cn,
  RealTelegramLogo,
  RealInstagramLogo
} from '@bunkerstroy/ui';
import { MobileMenuDrawerProps } from './types';
import { BrandLogo } from './BrandLogo';
import { NavbarSearch } from './NavbarSearch';
import { RegionSelector } from './RegionSelector';
import { LanguageToggle } from './LanguageToggle';
import {
  CABINET_OPTIONS,
  NAV_LINKS,
  OFFICIAL_CHANNELS,
  getDedicatedAppUrl
} from './constants';

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const navigate = useNavigate();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobil navigatsiya menyusi"
    >
      <div className="w-full max-w-sm h-full bg-white border-l border-slate-200 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 text-slate-900">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0 bg-slate-50">
          <BrandLogo onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 bg-white border border-slate-200 transition-colors cursor-pointer touch-target-44 shadow-2xs"
            aria-label="Menyuni yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          
          {/* 1. Search bar */}
          <NavbarSearch onSearchComplete={onClose} />

          {/* 2. Region selector row */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-mono font-bold text-slate-700">Hudud / Viloyat:</span>
            <RegionSelector />
          </div>

          {/* 3. Language Switcher row */}
          <LanguageToggle variant="mobile" />

          {/* 4. Cart Trigger Banner */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            className={cn(
              'w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none min-h-[48px] touch-target-44 shadow-2xs',
              cartCount > 0
                ? 'bg-[#D95D1E] border-[#C2410C] text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            )}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart
                className={cn('w-4 h-4', cartCount > 0 ? 'text-white' : 'text-slate-600')}
              />
              <span className="font-bold text-sm">Xarid Savati</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-[11px] font-mono font-black px-2 py-0.5 rounded-full',
                  cartCount > 0 ? 'bg-white text-[#D95D1E]' : 'bg-slate-100 text-slate-700'
                )}
              >
                {cartCount} ta
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* 5. Asosiy Sahifalar Ro'yxati */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase px-1">
              Asosiy Bo‘limlar:
            </div>
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.id}
                  to={link.path}
                  end={link.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer min-h-[44px] touch-target-44 shadow-2xs',
                      isActive
                        ? 'bg-orange-50 border-orange-200 text-[#D95D1E] font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    )
                  }
                >
                  <Icon className="w-4.5 h-4.5 text-[#D95D1E]" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* 6. 5 ta Kabinetlar ro'yxati */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase px-1">
              5 ta Boshqaruv Kabineti:
            </div>
            {CABINET_OPTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    const dedicatedUrl = getDedicatedAppUrl(item.id);
                    if (dedicatedUrl) {
                      window.location.href = dedicatedUrl;
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer text-left min-h-[44px] touch-target-44 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 text-[#D95D1E]">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm truncate">
                          {item.title}
                        </span>
                        {item.isDedicatedApp && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* 7. User Profile / Auth Action */}
          <div className="pt-2">
            {currentUser ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono font-bold text-[#D95D1E]">
                      {currentUser.stir ? `STIR: ${currentUser.stir}` : currentUser.phone || 'Kirilgan'}
                    </div>
                    <div className="font-bold text-sm text-slate-900 truncate mt-0.5">
                      {currentUser.companyName || currentUser.displayName || 'Kabinet'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="p-2 rounded-lg bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors shadow-2xs"
                    aria-label="Tizimdan chiqish"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-xl bg-[#D95D1E] hover:bg-[#B43B06] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px] touch-target-44"
              >
                <UserIcon className="w-4 h-4" />
                <span>Kabinetga Kirish (B2B &amp; B2C)</span>
              </button>
            )}
          </div>

          {/* 8. Official Social Channels */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href={OFFICIAL_CHANNELS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#2AABEE]/50 text-xs text-slate-700 transition-all shadow-2xs"
            >
              <RealTelegramLogo className="w-5.5 h-5.5" />
              <span className="font-bold text-xs">Telegram</span>
            </a>
            <a
              href={OFFICIAL_CHANNELS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#E1306C]/50 text-xs text-slate-700 transition-all shadow-2xs"
            >
              <RealInstagramLogo className="w-5.5 h-5.5" />
              <span className="font-bold text-xs">Instagram</span>
            </a>
          </div>
        </div>

        {/* 9. Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2">
          <a
            href={`tel:${OFFICIAL_CHANNELS.hotlineRaw}`}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono font-bold text-slate-900">{OFFICIAL_CHANNELS.hotline}</span>
            </div>
            <span className="text-[10px] text-slate-500">24/7 B2B Qo‘llab-quvvatlash</span>
          </a>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 pt-1">
            <span>BunkerStroy v3.0 Neo</span>
            <span>O‘zDSt / GOST 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
