import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  HardHat,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Building2,
  Factory,
  Truck,
  FileSpreadsheet,
  Leaf,
  Globe,
  ShieldCheck,
  ClipboardList,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  PhoneCall,
  Package
} from 'lucide-react';
import { cn } from '@bunkerstroy/ui';

/* ==========================================================================
   Types & Configuration
   ========================================================================== */

export interface CurrentUser {
  stir?: string;
  companyName?: string;
  displayName?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

export interface NavItemConfig {
  to: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const NAV_ITEMS: readonly NavItemConfig[] = [
  {
    to: '/',
    label: 'Katalog',
    description: 'Barcha qurilish mollari va materiallar',
    icon: Building2
  },
  {
    to: '/suppliers',
    label: 'Do‘konlar & Zavodlar',
    description: 'Tasdiqlangan ishlab chiqaruvchilar',
    icon: Factory
  },
  {
    to: '/orders',
    label: 'Buyurtmalarim',
    description: 'Xaridlar va yetkazib berish holati',
    icon: ClipboardList
  },
  {
    to: '/seller-panel',
    label: '+ Mahsulot sotish',
    description: 'Sotuvchi va ishlab chiqaruvchi kabineti',
    icon: Package,
    badge: 'KABINET'
  }
] as const;

/* ==========================================================================
   Subcomponent: BrandLogo
   Space Grotesk architectural branding with industrial badge and status pulse
   ========================================================================== */

interface BrandLogoProps {
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ onClick }) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
      aria-label="BunkerStroy B2B Asosiy sahifa"
    >
      {/* Architectural Emblem */}
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 shadow-xs group-hover:border-bunker-amber-500/50 transition-all duration-200">
        <HardHat className="w-5 h-5 text-bunker-amber-500 transition-transform duration-200 group-hover:scale-105" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-heading font-black text-lg tracking-tight text-slate-900">
            <span className="text-bunker-amber-500">BUNKER</span>STROY
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 leading-none">
            B2B
          </span>
        </div>
        <span className="text-[9px] font-mono font-medium tracking-[0.14em] text-slate-400 uppercase mt-1 leading-none">
          Sanoat Xaridlari
        </span>
      </div>
    </Link>
  );
};

/* ==========================================================================
   Subcomponent: NavLinkItem (DRY Link renderer for Desktop & Mobile)
   ========================================================================== */

interface NavLinkItemProps {
  item: NavItemConfig;
  variant: 'desktop' | 'mobile';
  onClick?: () => void;
}

export const NavLinkItem: React.FC<NavLinkItemProps> = ({ item, variant, onClick }) => {
  const Icon = item.icon;

  if (variant === 'desktop') {
    return (
      <NavLink
        to={item.to}
        end={item.to === '/'}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 text-[13px] font-medium rounded-lg transition-all duration-150 select-none whitespace-nowrap cursor-pointer',
            isActive
              ? 'text-amber-800 bg-amber-500/10 font-semibold shadow-xs ring-1 ring-amber-500/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={cn(
                'w-4 h-4 transition-colors shrink-0',
                isActive ? 'text-bunker-amber-500' : 'text-slate-400 group-hover:text-slate-700'
              )}
            />
            <span>{item.label}</span>
            {item.badge && (
              <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-amber-500/15 text-bunker-amber-500 border border-amber-500/20 leading-tight">
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  }

  // Mobile Drawer Navigation Item
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group flex items-center justify-between p-3 rounded-xl transition-all duration-150 cursor-pointer border select-none',
          isActive
            ? 'bg-amber-50/90 border-amber-500/30 text-amber-950 font-semibold shadow-xs'
            : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                isActive
                  ? 'bg-bunker-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm truncate',
                    isActive ? 'font-bold text-amber-950' : 'font-medium text-slate-800'
                  )}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-bunker-amber-500 leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                {item.description}
              </p>
            </div>
          </div>
          <ChevronRight
            className={cn(
              'w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5',
              isActive ? 'text-bunker-amber-500' : 'text-slate-300'
            )}
          />
        </>
      )}
    </NavLink>
  );
};

/* ==========================================================================
   Subcomponent: CartButton
   Sleek cart trigger with interactive count indicator
   ========================================================================== */

interface CartButtonProps {
  count: number;
  onClick: () => void;
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ count, onClick, className }) => {
  const hasItems = count > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      title={hasItems ? `${count} ta mahsulot xarid savatida` : "Xarid savati bo'sh"}
      aria-label={hasItems ? `Xarid savati, ${count} ta mahsulot` : 'Xarid savati'}
      className={cn(
        'group relative flex items-center gap-2 h-9 px-3 rounded-lg border transition-all text-xs font-medium cursor-pointer shadow-xs select-none',
        hasItems
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 hover:bg-amber-500/15 hover:border-amber-500/40'
          : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900',
        className
      )}
    >
      <ShoppingCart
        className={cn(
          'w-4 h-4 transition-transform group-hover:scale-105 shrink-0',
          hasItems ? 'text-bunker-amber-500' : 'text-slate-500'
        )}
      />
      <span className="hidden sm:inline font-semibold">Savat</span>
      {hasItems && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-mono font-bold rounded-full bg-bunker-amber-500 text-white shadow-xs">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

/* ==========================================================================
   Subcomponent: UserAccountBadge
   Enterprise STIR & Company profile badge with logout action
   ========================================================================== */

interface UserAccountBadgeProps {
  currentUser: CurrentUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  variant?: 'desktop' | 'mobile';
}

export const UserAccountBadge: React.FC<UserAccountBadgeProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  variant = 'desktop'
}) => {
  if (!currentUser) {
    return (
      <button
        type="button"
        onClick={onOpenAuth}
        className={cn(
          'flex items-center justify-center gap-1.5 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer select-none',
          variant === 'desktop' ? 'px-3.5' : 'w-full py-2.5 text-sm'
        )}
      >
        <UserIcon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span>B2B Kirish</span>
      </button>
    );
  }

  const stirNumber = currentUser.stir || '304928172';
  const companyTitle = currentUser.companyName || currentUser.displayName || 'B2B Buyurtmachi';

  if (variant === 'desktop') {
    return (
      <div className="flex items-center gap-2.5 h-9 pl-2.5 pr-1.5 py-1 rounded-lg bg-slate-50 border border-slate-200/90 shadow-xs text-xs select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200/70">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="text-left hidden sm:flex sm:flex-col leading-none min-w-0 max-w-[130px] xl:max-w-[160px]">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-bunker-amber-500 tracking-tight">
                STIR: {stirNumber}
              </span>
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
            </div>
            <span className="font-semibold text-slate-800 truncate text-[11px] mt-0.5">
              {companyTitle}
            </span>
          </div>
        </div>
        <div className="h-4 w-px bg-slate-200 shrink-0 hidden sm:block" />
        <button
          type="button"
          onClick={onLogout}
          title="Tizimdan chiqish"
          aria-label="Tizimdan chiqish"
          className="p-1.5 rounded-md text-slate-400 hover:text-bunker-status-red hover:bg-red-50 transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Mobile User Card
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-bunker-amber-500" />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-bunker-amber-500">
                STIR: {stirNumber}
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-2.5 h-2.5" /> Tasdiqlangan
              </span>
            </div>
            <div className="font-bold text-sm text-slate-900 truncate mt-0.5">
              {companyTitle}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          title="Tizimdan chiqish"
          aria-label="Tizimdan chiqish"
          className="p-2 rounded-lg text-slate-400 hover:text-bunker-status-red hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* ==========================================================================
   Subcomponent: MobileMenuDrawer
   Responsive slide-over drawer with backdrop blur and touch dismiss
   ========================================================================== */

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser: CurrentUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
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

  const handleCartClick = () => {
    onClose();
    onOpenCart();
  };

  const handleAuthClick = () => {
    onClose();
    onOpenAuth();
  };

  const handleLogoutClick = () => {
    onClose();
    onLogout();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity lg:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobil navigatsiya menyusi"
    >
      <div className="w-full max-w-sm h-full bg-white border-l border-slate-200 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <BrandLogo onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Menyuni yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* User Profile / Auth Action */}
          <UserAccountBadge
            currentUser={currentUser}
            onOpenAuth={handleAuthClick}
            onLogout={handleLogoutClick}
            variant="mobile"
          />

          {/* Quick Cart Trigger Banner */}
          <button
            type="button"
            onClick={handleCartClick}
            className={cn(
              'w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none',
              cartCount > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 hover:bg-amber-500/15'
                : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
            )}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart
                className={cn('w-4 h-4', cartCount > 0 ? 'text-bunker-amber-500' : 'text-slate-500')}
              />
              <span className="font-semibold text-sm">Xarid Savati</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-bunker-amber-500 text-white">
                {cartCount} ta
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* Navigation Items (DRY NavLinkItem mapping) */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase px-1 pb-1">
              Platforma Bo'limlari
            </div>
            {NAV_ITEMS.map((item) => (
              <NavLinkItem key={item.to} item={item} variant="mobile" onClick={onClose} />
            ))}
          </div>
        </div>

        {/* Drawer Footer: B2B Support & Compliance */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 shrink-0 space-y-2">
          <a
            href="tel:+998712000000"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-bunker-amber-500" />
              <span className="font-mono font-bold">+998 (71) 200-00-00</span>
            </div>
            <span className="text-[10px] text-slate-400">24/7 B2B Qo'llab-quvvatlash</span>
          </a>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 pt-1">
            <span>BunkerStroy Enterprise v2.4</span>
            <span>O'zDSt / GOST Sertifikatlangan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   Main Component: Navbar
   Production-grade, highly responsive B2B industrial header
   ========================================================================== */

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  currentUser,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-bunker-border-subtle shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 lg:gap-4">
            {/* 1. Architectural Brand Logo */}
            <BrandLogo />

            {/* 2. Desktop Navigation Links (Clean, lightweight, DRY) */}
            <nav
              className="hidden lg:flex items-center gap-0.5 xl:gap-1"
              aria-label="Asosiy navigatsiya"
            >
              {NAV_ITEMS.map((item) => (
                <NavLinkItem key={item.to} item={item} variant="desktop" />
              ))}
            </nav>

            {/* 3. Action Controls (Cart, STIR / Auth, Mobile Toggle) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Cart Button */}
              <CartButton count={cartCount} onClick={onOpenCart} />

              {/* User STIR / Login (Desktop) */}
              <div className="hidden sm:block">
                <UserAccountBadge
                  currentUser={currentUser}
                  onOpenAuth={onOpenAuth}
                  onLogout={onLogout}
                  variant="desktop"
                />
              </div>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
                aria-label={isMobileMenuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 text-slate-700" />
                ) : (
                  <Menu className="w-4 h-4 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Responsive Mobile Navigation Drawer */}
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
