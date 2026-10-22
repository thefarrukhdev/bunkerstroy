import React from 'react';
import { NavLink, Link } from 'react-router-dom';
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
  ClipboardList
} from 'lucide-react';
import { Badge, Button } from '@bunkerstroy/ui';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  currentUser: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  currentUser,
  onLogout
}) => {
  const navLinks = [
    { to: '/', label: 'Katalog', icon: <Building2 className="w-3.5 h-3.5" /> },
    { to: '/suppliers', label: 'Zavodlar', icon: <Factory className="w-3.5 h-3.5" /> },
    { to: '/logistics', label: 'Logistika', icon: <Truck className="w-3.5 h-3.5" /> },
    { to: '/tenders', label: 'Tenderlar', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { to: '/esco', label: 'ESCO Audit', icon: <Leaf className="w-3.5 h-3.5" /> },
    { to: '/global-bunker', label: 'Import Hub', icon: <Globe className="w-3.5 h-3.5" /> },
    { to: '/certifications', label: 'Standartlar', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { to: '/orders', label: 'Buyurtmalar', icon: <ClipboardList className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-bunker-border-strong shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 group-hover:border-bunker-amber-500 flex items-center justify-center transition-all shadow-xs">
              <HardHat className="w-5 h-5 text-bunker-amber-500 transition-transform group-hover:scale-105" />
            </div>
            <div>
              <span className="font-heading text-lg font-extrabold tracking-tight leading-none text-bunker-text-primary">
                <span className="text-bunker-amber-500">BUNKER</span>STROY
              </span>
              <span className="text-[9px] tracking-wider text-bunker-text-muted uppercase font-mono block mt-0.5">
                B2B Sanoat Xaridlari
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs uppercase tracking-wider font-semibold font-mono bg-slate-100/70 p-1 rounded-xl border border-bunker-border-strong">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all text-xs cursor-pointer ${
                    isActive
                      ? 'bg-white text-bunker-amber-500 shadow-xs border border-bunker-border-strong'
                      : 'text-bunker-text-secondary hover:text-bunker-text-primary hover:bg-white/60'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              title={cartCount > 0 ? `${cartCount} ta mahsulot xarid savatida` : "Xarid savati bo'sh"}
              className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 shadow-xs text-xs font-mono font-bold ${
                cartCount > 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-bunker-border-strong text-bunker-text-primary hover:border-bunker-amber-500'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-bunker-amber-500" />
              <span className="hidden sm:inline">Savat</span>
              {cartCount > 0 && (
                <Badge variant="success" size="sm" isMono className="px-1.5 py-0 font-bold bg-emerald-600 text-white border-transparent">
                  {cartCount}
                </Badge>
              )}
            </button>

            {/* User STIR or Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-bunker-border-strong rounded-xl px-3 py-1.5 font-mono text-xs">
                <div className="text-left hidden sm:block">
                  <span className="text-[10px] text-bunker-amber-500 font-bold block leading-none">
                    STIR: {currentUser.stir || '304928172'}
                  </span>
                  <span className="font-bold text-bunker-text-primary truncate max-w-[120px] block mt-0.5">
                    {currentUser.companyName || currentUser.displayName || 'B2B Buyurtmachi'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Tizimdan chiqish"
                  className="text-bunker-text-secondary hover:text-bunker-status-red p-1 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button size="sm" onClick={onOpenAuth}>
                <UserIcon className="w-4 h-4 mr-1" />
                <span>Kirish</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (under lg screens) */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto no-scrollbar pb-2.5 pt-1 border-t border-bunker-border-subtle text-[11px] font-mono">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-bunker-amber-500 text-white shadow-xs'
                    : 'bg-white text-bunker-text-secondary border border-bunker-border-strong'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};
