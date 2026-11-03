import React, { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  Layers,
  PhoneCall,
  Home,
  Factory,
  Truck,
  Calculator,
  FileSpreadsheet
} from 'lucide-react';
import {
  cn,
  RealTelegramLogo,
  RealInstagramLogo
} from '@bunkerstroy/ui';
import { NavbarProps } from './types';
import { BrandLogo } from './BrandLogo';
import { NavbarSearch } from './NavbarSearch';
import { RegionSelector } from './RegionSelector';
import { LanguageToggle } from './LanguageToggle';
import { CartButton } from './CartButton';
import { CabinetSwitcher } from './CabinetSwitcher';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { OFFICIAL_CHANNELS } from './constants';

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  currentUser,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const location = useLocation();

  // Close mobile menu and search on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchExpanded(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white text-slate-900 shadow-2xs transition-colors">
        {/* Subtle Industrial Hazard Hairline Accent */}
        <div className="h-[2.5px] w-full hazard-stripe-sm opacity-90" />

        {/* =========================================================================
            TIER 1: MAIN MARKETPLACE ACTION BAR (Brand, High-impact Search, Actions)
            ========================================================================= */}
        <div className="w-full border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-17 gap-3 sm:gap-6">
              
              {/* 1. Brand Logo */}
              <div className="shrink-0">
                <BrandLogo />
              </div>

              {/* 2. Primary Wide Search Bar (Desktop & Tablet) */}
              <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl min-w-0 mx-2 lg:mx-4">
                <NavbarSearch className="w-full" />
              </div>

              {/* 3. Right Action Controls: Search(mob), Viloyat, Til, Savat, Kabinet */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                
                {/* Mobile Search Toggle Button (Screen < 768px) */}
                <button
                  type="button"
                  onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}
                  className="md:hidden flex items-center justify-center w-9 h-9 min-w-[38px] min-h-[38px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-2xs outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/40"
                  aria-label={isMobileSearchExpanded ? 'Qidiruvni yopish' : 'Qidiruvni ochish'}
                  aria-expanded={isMobileSearchExpanded}
                >
                  {isMobileSearchExpanded ? (
                    <X className="w-4 h-4 text-slate-600" />
                  ) : (
                    <Search className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {/* Viloyat Filtri (Region Selector) */}
                <div className="hidden sm:block">
                  <RegionSelector />
                </div>

                {/* Til Tanlash (Language Switcher UZ | RU) */}
                <div className="hidden min-[520px]:block">
                  <LanguageToggle variant="desktop" />
                </div>

                {/* Savat (Cart Button with Badge) */}
                <CartButton count={cartCount} onClick={onOpenCart} />

                {/* 5 ta Kabinet Switcheri (Mijoz, Sotuvchi, Haydovchi, Hamkor, Admin) */}
                <CabinetSwitcher
                  currentUser={currentUser}
                  onOpenAuth={onOpenAuth}
                  onLogout={onLogout}
                />

                {/* Mobile Hamburger Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden flex items-center justify-center w-9.5 h-9.5 sm:w-10 sm:h-10 min-w-[40px] min-h-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-2xs touch-target-44 outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/40"
                  aria-label={isMobileMenuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Mobile Search Row (Mobile Screen only) */}
            {isMobileSearchExpanded && (
              <div className="md:hidden pb-3 pt-1 border-t border-slate-100 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <NavbarSearch
                  autoFocus={true}
                  onSearchComplete={() => setIsMobileSearchExpanded(false)}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            TIER 2: DISCOVERY & NAVIGATION BAR (Dedicated Category Pill + Nav Links + Socials)
            ========================================================================= */}
        <div className="hidden lg:block w-full bg-slate-50/95 border-b border-slate-200 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-11 text-xs font-mono font-bold">
              
              {/* Left: Prominent Catalog & Categories Trigger Button */}
              <div className="flex items-center gap-3">
                <NavLink
                  to="/catalog"
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-2 h-8 px-3.5 rounded-lg font-heading font-black text-xs transition-all cursor-pointer shadow-2xs',
                      isActive
                        ? 'bg-[#B43B06] text-white shadow-xs'
                        : 'bg-[#D95D1E] hover:bg-[#B43B06] text-white'
                    )
                  }
                >
                  <Layers className="w-3.5 h-3.5 text-white stroke-[2.4]" />
                  <span>Barcha Toifalar &amp; Katalog</span>
                </NavLink>

                {/* Divider */}
                <div className="h-4 w-[1px] bg-slate-200" />

                {/* Primary Nav Links */}
                <nav className="flex items-center gap-1 xl:gap-2">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      cn(
                        'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                        isActive
                          ? 'bg-white text-[#D95D1E] border border-orange-200 font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      )
                    }
                  >
                    <Home className="w-3.5 h-3.5 text-[#D95D1E]" />
                    <span>Asosiy</span>
                  </NavLink>

                  <NavLink
                    to="/suppliers"
                    className={({ isActive }) =>
                      cn(
                        'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                        isActive
                          ? 'bg-white text-[#D95D1E] border border-orange-200 font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      )
                    }
                  >
                    <Factory className="w-3.5 h-3.5 text-[#D95D1E]" />
                    <span>Zavodlar</span>
                  </NavLink>

                  <NavLink
                    to="/logistics"
                    className={({ isActive }) =>
                      cn(
                        'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                        isActive
                          ? 'bg-white text-[#D95D1E] border border-orange-200 font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      )
                    }
                  >
                    <Truck className="w-3.5 h-3.5 text-[#D95D1E]" />
                    <span>Logistika</span>
                  </NavLink>

                  <NavLink
                    to="/calculators"
                    className={({ isActive }) =>
                      cn(
                        'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                        isActive
                          ? 'bg-white text-[#D95D1E] border border-orange-200 font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      )
                    }
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#D95D1E]" />
                    <span>Kalkulyator</span>
                  </NavLink>

                  <NavLink
                    to="/tenders"
                    className={({ isActive }) =>
                      cn(
                        'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                        isActive
                          ? 'bg-white text-[#D95D1E] border border-orange-200 font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      )
                    }
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#D95D1E]" />
                    <span>Tenderlar</span>
                  </NavLink>
                </nav>
              </div>

              {/* Right: 24/7 Hotline & 3D Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${OFFICIAL_CHANNELS.phoneRaw}`}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 transition-colors"
                  title="24/7 Sanoat Dispetcherlik Qo‘ng‘irog‘i"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {OFFICIAL_CHANNELS.phone}
                  </span>
                </a>

                {/* Subtle Divider */}
                <div className="h-4 w-[1px] bg-slate-200" />

                {/* 3D Social Logos */}
                <div className="flex items-center gap-1.5">
                  <a
                    href={OFFICIAL_CHANNELS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6.5 h-6.5 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                    title="BunkerStroy Telegram kanali (@bunkerstroy_uz)"
                  >
                    <RealTelegramLogo className="w-5 h-5" />
                  </a>
                  <a
                    href={OFFICIAL_CHANNELS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6.5 h-6.5 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                    title="BunkerStroy Instagram (@bunkerstroy.uz)"
                  >
                    <RealInstagramLogo className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
      />
    </>
  );
};
