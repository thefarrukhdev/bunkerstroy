import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { NavbarProps } from './types';
import { BrandLogo } from './BrandLogo';
import { NavbarSearch } from './NavbarSearch';
import { NavLinks } from './NavLinks';
import { RegionSelector } from './RegionSelector';
import { LanguageToggle } from './LanguageToggle';
import { CartButton } from './CartButton';
import { CabinetSwitcher } from './CabinetSwitcher';
import { MobileMenuDrawer } from './MobileMenuDrawer';

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
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 text-slate-900 shadow-2xs transition-colors">
        {/* Subtle Industrial Hazard Hairline Accent */}
        <div className="h-[2.5px] w-full hazard-stripe-sm opacity-90" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 sm:h-16 gap-2 sm:gap-4">
            
            {/* 1. Architectural Brand Logo & Official Channels */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <BrandLogo showSocialsOnDesktop={true} />
            </div>

            {/* 2. Fast Search Bar (Integrated Desktop & Tablet) */}
            <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm">
              <NavbarSearch className="w-full" />
            </div>

            {/* 3. Primary Catalog Link & Quick Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center">
              <NavLinks />
            </div>

            {/* 4. Action Controls: Viloyat, Til, Savat, 5 ta Kabinet Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Mobile Quick Search Toggle (Screen < 768px) */}
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
              <div className="hidden min-[480px]:block">
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
