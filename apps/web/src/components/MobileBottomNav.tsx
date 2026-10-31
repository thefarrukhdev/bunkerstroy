import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  Factory,
  Calculator,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { triggerHaptic } from '../services/mobileBridge';

interface MobileBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onOpenCart
}) => {
  const location = useLocation();

  const handleTabClick = () => {
    triggerHaptic('light');
  };

  const handleCartClick = () => {
    triggerHaptic('medium');
    onOpenCart();
  };

  const navItems = [
    {
      to: '/',
      end: true,
      label: 'Asosiy',
      icon: Home
    },
    {
      to: '/catalog',
      label: 'Katalog',
      icon: Package
    },
    {
      to: '/suppliers',
      label: 'Zavodlar',
      icon: Factory
    },
    {
      to: '/calculators',
      label: 'Kalkulyator',
      icon: Calculator
    }
  ];

  return (
    <nav
      aria-label="Mobil pastki navigatsiya"
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md select-none transition-transform"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)'
      }}
    >
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={handleTabClick}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[48px] touch-target-44',
                isActive
                  ? 'text-[#D95D1E] font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <div
                className={cn(
                  'relative p-1 rounded-lg transition-transform',
                  isActive
                    ? 'bg-orange-50 border border-orange-200 scale-105 shadow-2xs'
                    : 'bg-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-[#D95D1E]' : 'text-slate-500'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-[10px] font-mono tracking-tight mt-0.5 leading-none',
                  isActive ? 'text-[#D95D1E] font-bold' : 'text-slate-500'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* 5th Action: Savat (Cart) */}
        <button
          type="button"
          onClick={handleCartClick}
          className={cn(
            'relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[48px] touch-target-44',
            cartCount > 0 ? 'text-[#D95D1E] font-bold' : 'text-slate-500 hover:text-slate-900'
          )}
          aria-label={`Savat, ${cartCount} ta mahsulot`}
        >
          <div
            className={cn(
              'relative p-1 rounded-lg transition-transform',
              cartCount > 0
                ? 'bg-orange-50 border border-orange-200 shadow-2xs'
                : 'bg-transparent'
            )}
          >
            <ShoppingCart
              className={cn(
                'w-5 h-5 transition-colors',
                cartCount > 0 ? 'text-[#D95D1E]' : 'text-slate-500'
              )}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[18px] h-4 px-1 rounded-full bg-[#D95D1E] text-white font-mono text-[9px] font-black flex items-center justify-center shadow-2xs animate-pulse">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span
            className={cn(
              'text-[10px] font-mono tracking-tight mt-0.5 leading-none',
              cartCount > 0 ? 'text-[#D95D1E] font-bold' : 'text-slate-500'
            )}
          >
            Savat
          </span>
        </button>
      </div>
    </nav>
  );
};
