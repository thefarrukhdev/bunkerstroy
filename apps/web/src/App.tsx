import React, { useState, useEffect } from 'react';
import { Product } from '@bunkerstroy/types';
import { Navbar } from './components/Navbar';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { MarketplaceView } from './features/marketplace/MarketplaceView';
import { LogisticsView } from './features/logistics/LogisticsView';
import { EscoCalculatorView } from './features/esco/EscoCalculatorView';
import { GlobalBunkerHubView } from './features/global_bunker/GlobalBunkerHubView';
import { OrdersView } from './features/orders/OrdersView';
import { AuthModal } from './features/auth/AuthModal';
import { VoiceAssistantModal } from './features/ai/VoiceAssistantModal';
import {
  HardHat,
  ShieldCheck,
  Truck,
  Leaf,
  Globe,
  Activity,
  PhoneCall,
  MapPin,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';

type TabType = 'marketplace' | 'logistics' | 'esco' | 'global_bunker' | 'orders';

export const App: React.FC = () => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<TabType>('marketplace');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // User state
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Cart state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bunkerstroy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bunkerstroy_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Check auth session via /api/auth/me on initial load
  useEffect(() => {
    const token = localStorage.getItem('bunkerstroy_token');
    if (!token) return;

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Session invalid');
      })
      .then((data) => {
        if (data.success && data.data) {
          setCurrentUser(data.data);
        } else {
          localStorage.removeItem('bunkerstroy_token');
          setCurrentUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('bunkerstroy_token');
        setCurrentUser(null);
      });
  }, []);

  // Cart actions
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderSuccess = () => {
    setActiveTab('orders');
  };

  // Auth actions
  const handleLogout = () => {
    localStorage.removeItem('bunkerstroy_token');
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#151719] text-[#F5F5F2] selection:bg-[#FFB800] selection:text-[#151719]">
      {/* 1. Industrial Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Industrial Telemetry / Live Status Bar */}
      <aside aria-label="BunkerStroy Tizim Telemetriyasi" className="bg-[#1C1F22] border-b border-[#33373B] text-[11px] font-mono text-[#B8B8B3] py-2 px-4 select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              BUNKER-NET ONLINE
            </span>
            <span className="hidden sm:inline text-[#51504A]">|</span>
            <span className="hidden sm:inline">
              Ombor zaxirasi: <strong className="text-[#FFB800]">38,400+ tonna</strong>
            </span>
            <span className="hidden md:inline text-[#51504A]">|</span>
            <span className="hidden md:inline">
              Maxsus transport parki: <strong className="text-[#F5F5F2]">64 ta faol texnika</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1 text-[#FFB800]">
              <ShieldCheck className="w-3.5 h-3.5" />
              E-IMZO & Soliq STIR integratsiyalangan
            </span>
            <span className="hidden lg:inline text-emerald-400 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" />
              ESCO Bino Energiya Auditi faol
            </span>
          </div>
        </div>
      </aside>

      {/* 3. Main Views Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all">
        {activeTab === 'marketplace' && (
          <MarketplaceView onAddToCart={handleAddToCart} />
        )}

        {activeTab === 'logistics' && (
          <LogisticsView />
        )}

        {activeTab === 'esco' && (
          <EscoCalculatorView />
        )}

        {activeTab === 'global_bunker' && (
          <GlobalBunkerHubView />
        )}

        {activeTab === 'orders' && (
          <OrdersView />
        )}
      </main>

      {/* 4. Brushed Steel Industrial Footer */}
      <footer className="mt-auto brushed-steel border-t border-[#33373B] text-[#B8B8B3] relative">
        <div className="h-1 w-full hazard-stripe-sm opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-[#222528] border border-[#51504A] flex items-center justify-center shadow-inner">
                  <div className="absolute top-1 left-1 industrial-rivet" />
                  <div className="absolute top-1 right-1 industrial-rivet" />
                  <HardHat className="w-5 h-5 text-[#FFB800]" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-wider leading-none text-[#F5F5F2]">
                    <span className="text-[#FFB800]">BUNKER</span> STROY
                  </span>
                  <span className="text-[10px] tracking-widest text-[#B8B8B3] uppercase font-mono block mt-0.5">
                    Sanoat & B2B Qurilish Ekologik Tizimi
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-[#B8B8B3] max-w-md">
                BunkerStroy — O‘zbekiston Respublikasi bo‘ylab yirik qurilish ob’ektlari, pudratchilar va ishlab chiqaruvchilarni to‘g‘ridan-to‘g‘ri birlashtiruvchi avtomatlashtirilgan B2B xaridlar, og‘ir logistika va ESCO energiya auditi platformasi.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <div className="flex items-center gap-1.5 bg-[#151719] border border-[#33373B] px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#FFB800]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ISO 9001:2015 Sertifikatlangan</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#151719] border border-[#33373B] px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Davlat Standartlari Muqobilligi</span>
                </div>
              </div>
            </div>

            {/* Column 2: Platform Modules */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F2] font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FFB800]" />
                Modullar
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="hover:text-[#FFB800] transition-colors cursor-pointer"
                  >
                    B2B Marketplace & Katalog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('logistics')}
                    className="hover:text-[#FFB800] transition-colors cursor-pointer"
                  >
                    Og'ir Yuk Tashish & HOWO
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('esco')}
                    className="hover:text-[#FFB800] transition-colors cursor-pointer"
                  >
                    ESCO Energiya Auditi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('global_bunker')}
                    className="hover:text-[#FFB800] transition-colors cursor-pointer"
                  >
                    Global Bunker Import Hub
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="hover:text-[#FFB800] transition-colors cursor-pointer"
                  >
                    Mening Buyurtmalarim
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Texnologiyalar & Xavfsizlik */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F2] font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFB800]" />
                Integratsiyalar
              </h4>
              <ul className="space-y-2 text-xs text-[#B8B8B3]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                  <span>E-IMZO Raqamli Imzo</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                  <span>Davlat Soliq Qo‘mitasi (STIR)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Google Gemini 3.8 AI & Maps</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Eskiz.uz SMS Gateway</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Payme, Click & B2B Invoicing</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Bog'lanish & Aloqa */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F2] font-mono flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#FFB800]" />
                Aloqa Markazi
              </h4>
              <div className="space-y-2.5 text-xs text-[#B8B8B3]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                  <span>Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko'chasi 42-A</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[#F5F5F2] font-bold">+998 (71) 200-45-46</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FFB800] shrink-0" />
                  <span>Dispatcherlik: 24/7 uzluksiz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Dispatcher Status */}
          <div className="mt-10 pt-6 border-t border-[#33373B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <p className="text-[#777A7C] text-center sm:text-left">
              &copy; 2026 BunkerStroy Technologies LLC. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                SLA: 99.98% Ishonchlilik
              </span>
              <span className="text-[#51504A]">|</span>
              <span className="text-[#777A7C]">v1.0.0 (Production Core)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </div>
  );
};
