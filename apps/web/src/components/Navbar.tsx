import React from 'react';
import { HardHat, ShoppingCart, User as UserIcon, Mic, LogOut } from 'lucide-react';
import { Button } from '@bunkerstroy/ui';

interface NavbarProps {
  activeTab: 'marketplace' | 'logistics' | 'esco' | 'global_bunker' | 'orders';
  setActiveTab: (tab: any) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenVoice: () => void;
  currentUser: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenVoice,
  currentUser,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 w-full brushed-steel text-[#F5F5F2]">
      <div className="h-0.5 w-full hazard-stripe-sm opacity-90" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-[#222528] border border-[#51504A] group-hover:border-[#FFB800] flex items-center justify-center transition-all shadow-md">
              <div className="absolute top-1 left-1 industrial-rivet" />
              <div className="absolute top-1 right-1 industrial-rivet" />
              <HardHat className="w-5 h-5 text-[#FFB800]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider leading-none">
                <span className="text-[#FFB800]">BUNKER</span> <span className="text-[#F5F5F2]">STROY</span>
              </span>
              <span className="text-[10px] tracking-widest text-[#B8B8B3] uppercase font-mono block mt-0.5">
                B2B Qurilish & Logistika Ekotizimi
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold font-mono">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'marketplace' ? 'text-[#FFB800] border-b-2 border-[#FFB800] pb-1' : 'text-[#B8B8B3] hover:text-[#F5F5F2]'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('logistics')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'logistics' ? 'text-[#FFB800] border-b-2 border-[#FFB800] pb-1' : 'text-[#B8B8B3] hover:text-[#F5F5F2]'
              }`}
            >
              Logistika Hub
            </button>
            <button
              onClick={() => setActiveTab('esco')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'esco' ? 'text-[#FFB800] border-b-2 border-[#FFB800] pb-1' : 'text-[#B8B8B3] hover:text-[#F5F5F2]'
              }`}
            >
              ESCO Audit
            </button>
            <button
              onClick={() => setActiveTab('global_bunker')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'global_bunker' ? 'text-[#FFB800] border-b-2 border-[#FFB800] pb-1' : 'text-[#B8B8B3] hover:text-[#F5F5F2]'
              }`}
            >
              Global Bunker
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'text-[#FFB800] border-b-2 border-[#FFB800] pb-1' : 'text-[#B8B8B3] hover:text-[#F5F5F2]'
              }`}
            >
              Buyurtmalar
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Voice Assistant Button */}
            <button
              onClick={onOpenVoice}
              className="p-2.5 rounded-xl bg-[#222528] border border-[#51504A] hover:border-[#FFB800] text-[#FFB800] transition-all cursor-pointer flex items-center gap-1.5"
              title="Ovozli AI maslahatchi"
            >
              <Mic className="w-4 h-4" />
              <span className="text-xs font-mono hidden lg:inline">Voice AI</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                cartCount > 0
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-[#222528] border-[#51504A] text-[#F5F5F2]'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-[#FFB800]" />
              {cartCount > 0 && (
                <span className="text-xs font-mono font-bold bg-emerald-500 text-black px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#222528] border border-[#51504A] rounded-xl px-3 py-1.5">
                <span className="text-xs font-bold text-[#FFB800] font-mono">{currentUser.displayName || 'Foydalanuvchi'}</span>
                <button onClick={onLogout} title="Chiqish" className="text-[#B8B8B3] hover:text-red-400 cursor-pointer">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button size="sm" onClick={onOpenAuth}>
                <UserIcon className="w-4 h-4" />
                <span>Kirish</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
