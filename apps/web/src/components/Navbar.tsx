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
  ExternalLink,
  Calculator,
  FileSpreadsheet,
  Home
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
  isDedicatedApp?: boolean;
}

export const getDedicatedAppUrl = (id: string): string | null => {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (id === 'seller') {
    return isLocal ? 'http://localhost:3001' : 'https://bunkerstroy-seller.vercel.app';
  }
  if (id === 'driver') {
    return isLocal ? 'http://localhost:3003' : 'https://bunkerstroy-driver.vercel.app';
  }
  if (id === 'admin') {
    return isLocal ? 'http://localhost:3002' : 'https://bunkerstroy-admin.vercel.app';
  }
  return null;
};

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

export const CABINET_OPTIONS: CabinetOption[] = [
  {
    id: 'client',
    title: 'Mijoz Kabineti',
    subtitle: 'Buyurtmalar, Hisob-faktura va Escrow holati',
    path: '/orders',
    icon: ClipboardList,
    badge: 'XARIDOR',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  {
    id: 'seller',
    title: 'Sotuvchi Kabineti',
    subtitle: 'Mahsulotlar vitrinasi, Do‘kon Kassa / POS CRM',
    path: '/seller-panel',
    icon: Store,
    badge: 'POS & CRM',
    badgeColor: 'bg-orange-50 text-[#D95D1E] border-orange-200',
    isDedicatedApp: true
  },
  {
    id: 'driver',
    title: 'Haydovchi Kabineti',
    subtitle: 'Og‘ir yuk tashish va GPS marshrutlar',
    path: '/driver',
    icon: Truck,
    badge: 'LOGISTIKA',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    isDedicatedApp: true
  },
  {
    id: 'partner',
    title: 'Hamkor & Zavodlar',
    subtitle: 'Ishlab chiqaruvchilar va ulgurji dillerlik',
    path: '/suppliers',
    icon: Factory,
    badge: 'B2B ZAVOD',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  {
    id: 'admin',
    title: 'Admin Kabineti',
    subtitle: 'BunkerStroy markaziy monitoring & nazorat',
    path: '/admin',
    icon: ShieldCheck,
    badge: 'ROOT ADMIN',
    badgeColor: 'bg-red-50 text-red-800 border-red-200',
    isAdmin: true,
    isDedicatedApp: true
  }
];

/* ==========================================================================
   Subcomponent: LanguageToggle (UZ | RU)
   ========================================================================== */

export const LanguageToggle: React.FC<{ variant?: 'desktop' | 'mobile' }> = ({ variant = 'desktop' }) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'mobile') {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700">Til / Язык:</span>
        </div>
        <div className="inline-flex p-0.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage('uz')}
            className={cn(
              'px-3 py-1 rounded-md transition-all cursor-pointer',
              language === 'uz'
                ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
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
                ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
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
      className="inline-flex items-center h-9 sm:h-9 p-0.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-[11px] font-bold select-none shrink-0"
      role="group"
      aria-label="Til tanlash"
    >
      <button
        type="button"
        onClick={() => setLanguage('uz')}
        title="O‘zbek tili"
        className={cn(
          'h-7.5 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center font-bold min-w-[32px]',
          language === 'uz'
            ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        UZ
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ru')}
        title="Русский язык"
        className={cn(
          'h-7.5 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center font-bold min-w-[32px]',
          language === 'ru'
            ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        RU
      </button>
    </div>
  );
};

/* ==========================================================================
   Subcomponent: BrandLogo (Neo-Architectural Precision)
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
      {/* Clean Terracotta Logo Container */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D95D1E] flex items-center justify-center text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
        <HardHat className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white stroke-[2.2]" />
      </div>

      {/* Brand Name & Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-slate-900">
            <span className="text-[#D95D1E]">BUNKER</span>STROY
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-50 text-[#D95D1E] border border-orange-200 leading-none">
            B2B
          </span>
        </div>
        <span className="text-[9px] font-mono font-medium tracking-[0.14em] text-slate-500 uppercase mt-1 leading-none hidden sm:block">
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
        className="flex items-center gap-1.5 h-9 sm:h-9 min-h-[38px] px-2.5 sm:px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-mono font-medium transition-all cursor-pointer shadow-2xs select-none"
        title="Viloyat bo‘yicha filtr"
      >
        <MapPin className="w-3.5 h-3.5 text-[#D95D1E] shrink-0" />
        <span className="truncate max-w-[100px] sm:max-w-[125px] xl:max-w-[150px]">
          {activeRegion}
        </span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-slate-400 transition-transform duration-150 shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-56 max-h-80 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-xl z-50 py-1 font-mono text-xs text-slate-700 animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
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
                  'w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer',
                  isSelected ? 'text-[#D95D1E] font-bold bg-orange-50' : 'text-slate-700'
                )}
              >
                <span>{region}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#D95D1E]" />}
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
      <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      <input
        id="marketplace-nav-search"
        name="query"
        type="text"
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Material, sement, armatura, g‘isht..."
        aria-label="Qurilish mollari qidiruvi"
        className="w-full h-9 sm:h-9 pl-8 pr-7 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D95D1E] focus:ring-2 focus:ring-[#D95D1E]/10 text-base sm:text-xs font-sans text-slate-900 placeholder-slate-400 outline-none transition-colors shadow-2xs"
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
          className="absolute right-2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
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
          'flex items-center gap-2 h-9 sm:h-9 min-h-[40px] sm:min-h-[36px] px-2.5 sm:px-3 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-2xs select-none',
          isOpen
            ? 'bg-slate-50 border-[#D95D1E] text-slate-900 ring-2 ring-[#D95D1E]/10'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
        )}
        title="Kabinetlar tanlash (Mijoz, Sotuvchi, Haydovchi, Hamkor, Admin)"
      >
        <div className="w-5 h-5 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D95D1E] shrink-0">
          <CurrentIcon className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left leading-none hidden md:block">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-tight">
            Kabinet
          </span>
          <span className="text-xs font-bold text-slate-900 truncate max-w-[95px] xl:max-w-[120px]">
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
        <div className="absolute right-0 mt-1.5 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-2 font-sans text-xs animate-in fade-in-50 zoom-in-95">
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
        'group relative flex items-center gap-2 h-9 sm:h-9 min-h-[40px] sm:min-h-[36px] px-2.5 sm:px-3 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-2xs select-none shrink-0',
        hasItems
          ? 'bg-[#D95D1E] hover:bg-[#B43B06] border-[#C2410C] text-white shadow-xs'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700',
        className
      )}
    >
      <ShoppingCart
        className={cn(
          'w-4 h-4 transition-transform group-hover:scale-105 shrink-0',
          hasItems ? 'text-white' : 'text-slate-600'
        )}
      />
      <span className="hidden sm:inline font-bold">Savat</span>
      {hasItems && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-mono font-black rounded-full bg-white text-[#D95D1E] shadow-2xs">
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
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 shrink-0 bg-slate-50">
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
          {/* Search bar */}
          <NavbarSearch onSearchComplete={onClose} />

          {/* Region selector */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-mono font-bold text-slate-700">Hudud / Viloyat:</span>
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
              <span className={cn('text-[11px] font-mono font-black px-2 py-0.5 rounded-full', cartCount > 0 ? 'bg-white text-[#D95D1E]' : 'bg-slate-100 text-slate-700')}>
                {cartCount} ta
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Asosiy Sahifalar Ro'yxati */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase px-1">
              Asosiy Bo‘limlar:
            </div>
            <NavLink
              to="/"
              end
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
              <Home className="w-4.5 h-4.5 text-[#D95D1E]" />
              <span>Bosh Sahifa</span>
            </NavLink>

            <NavLink
              to="/catalog"
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
              <Package className="w-4.5 h-4.5 text-[#D95D1E]" />
              <span>Katalog &amp; Vitrina</span>
            </NavLink>

            <NavLink
              to="/suppliers"
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
              <Factory className="w-4.5 h-4.5 text-[#D95D1E]" />
              <span>Hamkor Zavodlar</span>
            </NavLink>

            <NavLink
              to="/calculators"
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
              <Calculator className="w-4.5 h-4.5 text-[#D95D1E]" />
              <span>Qurilish &amp; ESCO Kalkulyatori</span>
            </NavLink>

            <NavLink
              to="/tenders"
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
              <FileSpreadsheet className="w-4.5 h-4.5 text-[#D95D1E]" />
              <span>B2B Tenderlar &amp; Auksion</span>
            </NavLink>

            <NavLink
              to="/logistics"
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
              <Truck className="w-4.5 h-4.5 text-[#D95D1E]" />
              <span>Logistika &amp; Dispetcherlik</span>
            </NavLink>
          </div>

          {/* 5 ta Kabinetlar ro'yxati */}
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

          {/* User Profile / Auth Action */}
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
                className="w-full py-2.5 rounded-xl bg-[#D95D1E] hover:bg-[#B43B06] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>Kabinetga Kirish (B2B &amp; B2C)</span>
              </button>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2">
          <a
            href="tel:+998712004546"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono font-bold text-slate-900">+998 (71) 200-45-46</span>
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

/* ==========================================================================
   Main Component: Navbar
   Neo-Architectural Precision:
   Clean white surface, Safety Terracotta accents, Logo, Search,
   Region filter, Language switch, Cart button, 5 cabinet switcher.
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 text-slate-900 shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            
            {/* 1. Architectural Brand Logo */}
            <BrandLogo />

            {/* 2. Fast Search Bar (Integrated) */}
            <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm">
              <NavbarSearch className="w-full" />
            </div>

            {/* 3. Primary Catalog Link & Quick Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-mono font-bold">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  cn(
                    'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                    isActive
                      ? 'bg-orange-50 text-[#D95D1E] border border-orange-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                <Home className="w-3.5 h-3.5 text-[#D95D1E]" />
                <span>Asosiy</span>
              </NavLink>

              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  cn(
                    'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                    isActive
                      ? 'bg-orange-50 text-[#D95D1E] border border-orange-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                <Package className="w-3.5 h-3.5 text-[#D95D1E]" />
                <span>Katalog</span>
              </NavLink>

              <NavLink
                to="/suppliers"
                className={({ isActive }) =>
                  cn(
                    'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                    isActive
                      ? 'bg-orange-50 text-[#D95D1E] border border-orange-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                <Factory className="w-3.5 h-3.5 text-[#D95D1E]" />
                <span>Zavodlar</span>
              </NavLink>

              <NavLink
                to="/calculators"
                className={({ isActive }) =>
                  cn(
                    'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5',
                    isActive
                      ? 'bg-orange-50 text-[#D95D1E] border border-orange-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                      ? 'bg-orange-50 text-[#D95D1E] border border-orange-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#D95D1E]" />
                <span>Tenderlar</span>
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
                className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-2xs touch-target-44"
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
