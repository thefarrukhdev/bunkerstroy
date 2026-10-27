import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HardHat,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Building2,
  Factory,
  Truck,
  ClipboardList,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  PhoneCall,
  Package,
  Search,
  MapPin,
  ShieldCheck,
  Store,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { useLanguage } from '../context/LanguageContext';

/* ==========================================================================
   Types & Configuration
   ========================================================================== */

export interface CurrentUser {
  stir?: string;
  companyName?: string;
  displayName?: string;
  email?: string;
  role?: string;
  phone?: string;
  [key: string]: any;
}

export interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

export interface CabinetOption {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  badgeColor: string;
  isAdmin?: boolean;
}

export const UZBEKISTAN_REGIONS = [
  'Barcha viloyatlar',
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand viloyati',
  'Farg‘ona viloyati',
  'Andijon viloyati',
  'Namangan viloyati',
  'Buxoro viloyati',
  'Qashqadaryo viloyati',
  'Surxondaryo viloyati',
  'Xorazm viloyati',
  'Navoiy viloyati',
  'Jizzax viloyati',
  'Sirdaryo viloyati',
  'Qoraqalpog‘iston Respublikasi'
] as const;

export const CABINET_OPTIONS: readonly CabinetOption[] = [
  {
    id: 'customer',
    title: 'Mijoz Kabineti',
    subtitle: 'Buyurtmalar, hisob-fakturalar & shartnomalar',
    path: '/orders',
    icon: ClipboardList,
    badge: 'XARIDOR',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  {
    id: 'seller',
    title: 'Sotuvchi Kabineti',
    subtitle: 'Mahsulotlar vitrinasi, Do‘kon Kassa / POS CRM',
    path: '/seller-panel',
    icon: Store,
    badge: 'POS & CRM',
    badgeColor: 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/40'
  },
  {
    id: 'driver',
    title: 'Haydovchi Kabineti',
    subtitle: 'Og‘ir yuk tashish va GPS marshrutlar',
    path: '/driver',
    icon: Truck,
    badge: 'LOGISTIKA',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'partner',
    title: 'Hamkor & Zavodlar',
    subtitle: 'Ishlab chiqaruvchilar va ulgurji dillerlik',
    path: '/suppliers',
    icon: Factory,
    badge: 'B2B ZAVOD',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'admin',
    title: 'Admin Kabineti',
    subtitle: 'BunkerStroy markaziy monitoring & nazorat',
    path: '/admin',
    icon: ShieldCheck,
    badge: 'ROOT ADMIN',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    isAdmin: true
  }
];

/* ==========================================================================
   Subcomponent: LanguageToggle (Industrial UZ | RU)
   ========================================================================== */

export const LanguageToggle: React.FC<{ variant?: 'desktop' | 'mobile' }> = ({ variant = 'desktop' }) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'mobile') {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F2547] border border-[#1E3A6D]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-sky-200">Til / Язык:</span>
        </div>
        <div className="inline-flex p-0.5 rounded-lg bg-[#071326] border border-[#1E3A6D] font-mono text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setLanguage('uz')}
            className={cn(
              'px-3 py-1 rounded-md transition-all cursor-pointer',
              language === 'uz'
                ? 'bg-[#FFB800] text-[#071326] font-black shadow-xs'
                : 'text-sky-200 hover:text-white'
            )}
          >
            UZ
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ru')}
            className={cn(
              'px-3 py-1 rounded-md transition-all cursor-pointer',
              language === 'ru'
                ? 'bg-[#FFB800] text-[#071326] font-black shadow-xs'
                : 'text-sky-200 hover:text-white'
            )}
          >
            RU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center h-8 sm:h-9 p-0.5 rounded-lg bg-[#071326] border border-[#1E3A6D] font-mono text-[11px] font-bold select-none shrink-0"
      role="group"
      aria-label="Til tanlash"
    >
      <button
        type="button"
        onClick={() => setLanguage('uz')}
        title="O‘zbek tili"
        className={cn(
          'h-7 px-2 sm:px-2.5 rounded-md transition-all cursor-pointer flex items-center justify-center font-bold',
          language === 'uz'
            ? 'bg-[#FFB800] text-[#071326] font-black shadow-xs'
            : 'text-sky-300 hover:text-white'
        )}
      >
        UZ
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ru')}
        title="Русский язык"
        className={cn(
          'h-7 px-2 sm:px-2.5 rounded-md transition-all cursor-pointer flex items-center justify-center font-bold',
          language === 'ru'
            ? 'bg-[#FFB800] text-[#071326] font-black shadow-xs'
            : 'text-sky-300 hover:text-white'
        )}
      >
        RU
      </button>
    </div>
  );
};

/* ==========================================================================
   Subcomponent: BrandLogo (Industrial with Rivets & Hazard Pulse)
   ========================================================================== */

interface BrandLogoProps {
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ onClick }) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0 py-0.5"
      aria-label="BunkerStroy Asosiy sahifa"
    >
      {/* Industrial Logo Icon Container with Rivets */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0F2547] border border-[#254B85] group-hover:border-[#FFB800] flex items-center justify-center transition-all shadow-[0_4px_12px_rgba(7,19,38,0.5)]">
        <div className="absolute top-1 left-1 industrial-rivet" />
        <div className="absolute top-1 right-1 industrial-rivet" />
        <HardHat className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#FFB800] stroke-[2.2] transition-transform duration-200 group-hover:scale-105" />
      </div>

      {/* Brand Name & Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-white">
            <span className="text-[#FFB800]">BUNKER</span>STROY
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#132C54] text-[#FFB800] border border-[#254B85] leading-none">
            B2B
          </span>
        </div>
        <span className="text-[9px] font-mono font-medium tracking-[0.14em] text-sky-200/80 uppercase mt-1 leading-none hidden sm:block">
          Sanoat Xaridlari B2B &amp; B2C
        </span>
      </div>
    </Link>
  );
};

/* ==========================================================================
   Subcomponent: RegionSelector (Viloyat tanlash)
   ========================================================================== */

interface RegionSelectorProps {
  currentRegion?: string;
  onSelectRegion?: (region: string) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  currentRegion = 'Barcha viloyatlar',
  onSelectRegion
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Parse region from URL if present
  const searchParams = new URLSearchParams(location.search);
  const activeRegion = searchParams.get('region') || currentRegion;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (region: string) => {
    setIsOpen(false);
    if (onSelectRegion) {
      onSelectRegion(region);
    }
    const params = new URLSearchParams(location.search);
    if (region === 'Barcha viloyatlar') {
      params.delete('region');
    } else {
      params.set('region', region);
    }
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-[#071326] hover:bg-[#0F2547] border border-[#1E3A6D] hover:border-[#FFB800]/70 text-sky-100 text-xs font-mono font-medium transition-all cursor-pointer shadow-xs select-none"
        title="Viloyat bo‘yicha filtr"
      >
        <MapPin className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
        <span className="truncate max-w-[100px] sm:max-w-[125px] xl:max-w-[150px]">
          {activeRegion}
        </span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-sky-400 transition-transform duration-150 shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-56 max-h-80 overflow-y-auto rounded-xl bg-[#0A1931] border border-[#254B85] shadow-[0_12px_32px_rgba(7,19,38,0.75)] z-50 py-1 font-mono text-xs text-sky-100 animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-sky-300/70 border-b border-[#1E3A6D]">
            Yetkazib berish hududi:
          </div>
          {UZBEKISTAN_REGIONS.map((region) => {
            const isSelected = activeRegion === region;
            return (
              <button
                key={region}
                type="button"
                onClick={() => handleSelect(region)}
                className={cn(
                  'w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#0F2547] transition-colors cursor-pointer',
                  isSelected ? 'text-[#FFB800] font-bold bg-[#0F2547]/80' : 'text-sky-200'
                )}
              >
                <span>{region}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB800]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   Subcomponent: NavbarSearch (Tezkor Qidiruv)
   ========================================================================== */

export const NavbarSearch: React.FC<{ className?: string; onSearchComplete?: () => void }> = ({
  className,
  onSearchComplete
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('query') || searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchTerm.trim()) {
      params.set('query', searchTerm.trim());
    } else {
      params.delete('query');
    }
    navigate(`/?${params.toString()}`);
    if (onSearchComplete) onSearchComplete();
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative flex items-center', className)}>
      <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#FFB800] pointer-events-none" />
      <input
        id="marketplace-nav-search"
        name="query"
        type="text"
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Material, sement, armatura, g‘isht..."
        aria-label="Qurilish mollari qidiruvi"
        className="w-full h-8 sm:h-9 pl-8 pr-7 rounded-lg bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/40 text-xs font-sans text-white placeholder-sky-300/50 outline-none transition-colors"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            const params = new URLSearchParams(location.search);
            params.delete('query');
            navigate(`/?${params.toString()}`);
          }}
          className="absolute right-2 text-sky-400 hover:text-white cursor-pointer p-0.5"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </form>
  );
};

/* ==========================================================================
   Subcomponent: CabinetSwitcherDropdown (5 ta Kabinet Switcheri)
   ========================================================================== */

interface CabinetSwitcherProps {
  currentUser: CurrentUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const CabinetSwitcherDropdown: React.FC<CabinetSwitcherProps> = ({
  currentUser,
  onOpenAuth,
  onLogout
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

  // Determine active cabinet based on route
  const currentPath = location.pathname;
  const currentCabinet =
    CABINET_OPTIONS.find((c) => currentPath.startsWith(c.path)) ||
    (currentUser?.role === 'supplier'
      ? CABINET_OPTIONS[1]
      : currentUser?.role === 'driver'
      ? CABINET_OPTIONS[2]
      : currentUser?.role === 'admin'
      ? CABINET_OPTIONS[4]
      : CABINET_OPTIONS[0]);

  const CurrentIcon = currentCabinet.icon;

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border transition-all text-xs font-semibold cursor-pointer shadow-xs select-none',
          isOpen
            ? 'bg-[#132C54] border-[#FFB800] text-white ring-1 ring-[#FFB800]/50'
            : 'bg-[#0F2547] hover:bg-[#132C54] border-[#1E3A6D] hover:border-[#2E5A9C] text-sky-100'
        )}
        title="Kabinetlar tanlash (Mijoz, Sotuvchi, Haydovchi, Hamkor, Admin)"
      >
        <div className="w-5 h-5 rounded bg-[#071326] border border-[#254B85] flex items-center justify-center text-[#FFB800] shrink-0">
          <CurrentIcon className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left leading-none hidden md:block">
          <span className="text-[10px] font-mono text-sky-300 font-bold uppercase tracking-tight">
            Kabinet
          </span>
          <span className="text-xs font-bold text-white truncate max-w-[95px] xl:max-w-[120px]">
            {currentCabinet.title.split(' ')[0]}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-sky-400 transition-transform duration-150 shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-72 sm:w-80 rounded-2xl bg-[#0A1931] border-2 border-[#254B85] shadow-[0_16px_40px_rgba(7,19,38,0.85)] z-50 p-2 font-sans text-xs animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="px-3 py-2 border-b border-[#1E3A6D] flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-[#FFB800] uppercase tracking-wider">
              5 ta Boshqaruv Kabineti:
            </span>
            <span className="text-[10px] font-mono bg-[#071326] px-2 py-0.5 rounded text-sky-300 border border-[#1E3A6D]">
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
                  onClick={() => {
                    setIsOpen(false);
                    if (cab.isAdmin) {
                      window.location.href = 'http://localhost:5174';
                    } else {
                      navigate(cab.path);
                    }
                  }}
                  className={cn(
                    'w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer text-left border',
                    isActive
                      ? 'bg-[#132C54] border-[#FFB800]/70 text-white shadow-xs'
                      : 'bg-[#071326]/60 hover:bg-[#0F2547] border-[#1E3A6D] text-sky-100 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
                        isActive
                          ? 'bg-[#FFB800] text-[#071326] border-[#FFC928]'
                          : 'bg-[#0F2547] text-[#FFB800] border-[#254B85]'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs truncate">
                          {cab.title}
                        </span>
                        {cab.isAdmin && <ExternalLink className="w-3 h-3 text-red-400" />}
                      </div>
                      <p className="text-[10px] text-sky-300/70 truncate mt-0.5">
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
          <div className="mt-1 pt-2 border-t border-[#1E3A6D]">
            {currentUser ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#071326] border border-[#1E3A6D]">
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono font-bold text-[#FFB800]">
                      {currentUser.stir ? `STIR: ${currentUser.stir}` : currentUser.phone || 'Kirilgan'}
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="text-white font-bold text-xs truncate">
                    {currentUser.companyName || currentUser.displayName || 'Foydalanuvchi'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="p-1.5 rounded-lg bg-[#132C54] hover:bg-red-950/80 text-sky-300 hover:text-red-400 border border-[#254B85] hover:border-red-500/40 transition-colors cursor-pointer"
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
                className="w-full py-2 px-3 rounded-xl bg-[#FFB800] hover:bg-[#FFC928] text-[#071326] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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

/* ==========================================================================
   Subcomponent: CartButton
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
      data-cart-button="true"
      onClick={onClick}
      title={hasItems ? `${count} ta mahsulot xarid savatida` : "Xarid savati bo'sh"}
      aria-label={hasItems ? `Xarid savati, ${count} ta mahsulot` : 'Xarid savati'}
      className={cn(
        'group relative flex items-center gap-2 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border transition-all text-xs font-semibold cursor-pointer shadow-xs select-none shrink-0',
        hasItems
          ? 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)] ring-1 ring-emerald-500/40'
          : 'bg-[#0F2547] hover:bg-[#132C54] border-[#1E3A6D] hover:border-[#FFB800] text-sky-100',
        className
      )}
    >
      <ShoppingCart
        className={cn(
          'w-4 h-4 transition-transform group-hover:scale-105 shrink-0',
          hasItems ? 'text-emerald-400' : 'text-[#FFB800]'
        )}
      />
      <span className="hidden sm:inline font-bold">Savat</span>
      {hasItems && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-mono font-black rounded-full bg-emerald-500 text-[#071326] shadow-xs animate-pulse">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

/* ==========================================================================
   Subcomponent: MobileMenuDrawer
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
  const navigate = useNavigate();

  // Close on Escape key
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
      className="fixed inset-0 z-50 flex justify-end bg-[#071326]/80 backdrop-blur-sm transition-opacity lg:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobil navigatsiya menyusi"
    >
      <div className="w-full max-w-sm h-full bg-[#0A1931] border-l-2 border-[#1E3A6D] flex flex-col justify-between shadow-[0_0_40px_rgba(7,19,38,0.9)] overflow-y-auto animate-in slide-in-from-right duration-200 text-white">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1E3A6D] shrink-0 bg-[#071326]">
          <BrandLogo onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-sky-200 hover:text-white bg-[#0F2547] border border-[#1E3A6D] transition-colors cursor-pointer"
            aria-label="Menyuni yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Search bar */}
          <NavbarSearch onSearchComplete={onClose} />

          {/* Region selector */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F2547] border border-[#1E3A6D]">
            <span className="text-xs font-mono font-bold text-sky-200">Hudud / Viloyat:</span>
            <RegionSelector />
          </div>

          {/* Language Switcher */}
          <LanguageToggle variant="mobile" />

          {/* Cart Trigger Banner */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            className={cn(
              'w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none',
              cartCount > 0
                ? 'bg-emerald-950/80 border-emerald-500/50 text-white'
                : 'bg-[#0F2547] border-[#1E3A6D] text-sky-100 hover:bg-[#132C54]'
            )}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart
                className={cn('w-4 h-4', cartCount > 0 ? 'text-emerald-400' : 'text-[#FFB800]')}
              />
              <span className="font-bold text-sm">Xarid Savati</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-full bg-[#FFB800] text-[#071326]">
                {cartCount} ta
              </span>
              <ChevronRight className="w-4 h-4 text-sky-300" />
            </div>
          </button>

          {/* 5 ta Kabinetlar ro'yxati */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-mono font-bold tracking-wider text-[#FFB800] uppercase px-1">
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
                    if (item.isAdmin) {
                      window.location.href = 'http://localhost:5174';
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0F2547] hover:bg-[#132C54] border border-[#1E3A6D] hover:border-[#FFB800]/50 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#071326] border border-[#254B85] flex items-center justify-center shrink-0 text-[#FFB800]">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm truncate">
                          {item.title}
                        </span>
                        {item.isAdmin && <ExternalLink className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                      <p className="text-[11px] text-sky-200/70 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* User Profile / Auth Action */}
          <div className="pt-2">
            {currentUser ? (
              <div className="p-3.5 rounded-xl bg-[#071326] border border-[#1E3A6D]">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono font-bold text-[#FFB800]">
                      {currentUser.stir ? `STIR: ${currentUser.stir}` : currentUser.phone || 'Kirilgan'}
                    </div>
                    <div className="font-bold text-sm text-white truncate mt-0.5">
                      {currentUser.companyName || currentUser.displayName || 'Kabinet'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="p-2 rounded-lg bg-[#132C54] hover:bg-red-950/80 text-sky-200 hover:text-red-400 border border-[#254B85] transition-colors"
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
                className="w-full py-2.5 rounded-xl bg-[#FFB800] hover:bg-[#FFC928] text-[#071326] font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <UserIcon className="w-4 h-4" />
                <span>Kabinetga Kirish (B2B &amp; B2C)</span>
              </button>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#1E3A6D] bg-[#071326] shrink-0 space-y-2">
          <a
            href="tel:+998712004546"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0F2547] border border-[#1E3A6D] text-xs text-sky-100 hover:border-[#FFB800] transition-colors"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-bold text-white">+998 (71) 200-45-46</span>
            </div>
            <span className="text-[10px] text-sky-300">24/7 B2B Qo‘llab-quvvatlash</span>
          </a>
          <div className="flex items-center justify-between text-[10px] font-mono text-sky-400/80 px-1 pt-1">
            <span>BunkerStroy v2.5 Industrial</span>
            <span>O‘zDSt / GOST 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   Main Component: Navbar
   Sanoat darajasidagi industrial header:
   brushed-steel-header, Hazard Yellow aksentlar, Logo, Qidiruv,
   Viloyat filtri, Til tanlash, Savat (badge bilan), 5 ta kabinet switcher.
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
      <header className="sticky top-0 z-40 w-full brushed-steel-header text-white transition-colors">
        {/* Top Hazard Stripe Hairline Accent */}
        <div className="h-[2px] w-full hazard-stripe-sm opacity-90" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            
            {/* 1. Architectural Brand Logo */}
            <BrandLogo />

            {/* 2. Fast Search Bar (Integrated) */}
            <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm">
              <NavbarSearch className="w-full" />
            </div>

            {/* 3. Primary Catalog Link & Suppliers Quick Access */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-mono font-bold">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  cn(
                    'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                    isActive
                      ? 'bg-[#132C54] text-[#FFB800] border border-[#FFB800]/50'
                      : 'text-sky-200 hover:text-white hover:bg-[#0F2547]'
                  )
                }
              >
                <Package className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Katalog</span>
              </NavLink>

              <NavLink
                to="/suppliers"
                className={({ isActive }) =>
                  cn(
                    'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                    isActive
                      ? 'bg-[#132C54] text-[#FFB800] border border-[#FFB800]/50'
                      : 'text-sky-200 hover:text-white hover:bg-[#0F2547]'
                  )
                }
              >
                <Factory className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Zavodlar</span>
              </NavLink>
            </nav>

            {/* 4. Action Controls: Viloyat, Til, Savat, 5 ta Kabinet Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Viloyat Filtri (Region Selector) */}
              <div className="hidden sm:block">
                <RegionSelector />
              </div>

              {/* Til Tanlash (Language Switcher UZ | RU) */}
              <LanguageToggle variant="desktop" />

              {/* Savat (Cart Button with Badge) */}
              <CartButton count={cartCount} onClick={onOpenCart} />

              {/* 5 ta Kabinet Switcheri (Mijoz, Sotuvchi, Haydovchi, Hamkor, Admin) */}
              <CabinetSwitcherDropdown
                currentUser={currentUser}
                onOpenAuth={onOpenAuth}
                onLogout={onLogout}
              />

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#1E3A6D] bg-[#0F2547] hover:bg-[#132C54] text-sky-200 hover:text-white transition-colors cursor-pointer shadow-xs"
                aria-label={isMobileMenuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 text-sky-200" />
                ) : (
                  <Menu className="w-4 h-4 text-sky-200" />
                )}
              </button>
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
