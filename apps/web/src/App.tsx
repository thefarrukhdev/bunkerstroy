import React, { useState, useEffect } from 'react';
import { Product } from '@bunkerstroy/types';
import { Navbar, ActiveTabType } from './components/Navbar';
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
  Search,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Clock,
  Layers,
  Activity,
  X,
  Building2,
  Truck,
  Leaf,
  Globe,
  ClipboardList
} from 'lucide-react';
import { Button } from '@bunkerstroy/ui';

export const App: React.FC = () => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveTabType>('marketplace');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchPaletteQuery, setSearchPaletteQuery] = useState('');

  // High-Vis Construction Field Mode state
  const [highVisMode, setHighVisMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bunkerstroy_high_vis') === 'true';
    } catch {
      return false;
    }
  });

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

  // Sync high-vis mode to HTML element & localStorage
  useEffect(() => {
    if (highVisMode) {
      document.documentElement.classList.add('high-vis-mode');
      localStorage.setItem('bunkerstroy_high_vis', 'true');
    } else {
      document.documentElement.classList.remove('high-vis-mode');
      localStorage.setItem('bunkerstroy_high_vis', 'false');
    }
  }, [highVisMode]);

  // Global Keyboard Shortcuts: Shift + S (High-Vis) & Ctrl + K (Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + S toggle high-vis mode (prevent conflict if typing in input)
      if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          return;
        }
        e.preventDefault();
        setHighVisMode((prev) => !prev);
      }

      // Ctrl + K or Cmd + K opens Global Command Search Palette
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }

      // Escape closes modals
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('bunkerstroy_token');
          setCurrentUser(null);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setCurrentUser(data.data);
          }
        }
      })
      .catch((err) => {
        console.warn('Session check network error (token preserved):', err);
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

  // Command palette navigation items
  const quickNavItems: { label: string; tab: ActiveTabType; icon: React.ReactNode; desc: string }[] = [
    { label: 'B2B Marketplace & Mahsulotlar', tab: 'marketplace', icon: <Building2 className="w-4 h-4 text-bunker-amber-500" />, desc: 'Sement, armatura, g‘isht va izolyatsiya materiallari' },
    { label: 'Logistika Hub & Maxsus Texnikalar', tab: 'logistics', icon: <Truck className="w-4 h-4 text-bunker-amber-500" />, desc: 'HOWO 25t, Shacman mikser, Isuzu kran marshruti' },
    { label: 'ESCO Bino Energiya Auditi', tab: 'esco', icon: <Leaf className="w-4 h-4 text-bunker-status-green" />, desc: 'ShNQ 2.01.04-18 davlat standarti, termal pasport' },
    { label: 'Global Bunker Xalqaro Import', tab: 'global_bunker', icon: <Globe className="w-4 h-4 text-bunker-status-cyan" />, desc: 'Temir yo‘l hopperlari va xorijiy klinker ta’minoti' },
    { label: 'Mening Buyurtmalarim & Invoyslar', tab: 'orders', icon: <ClipboardList className="w-4 h-4 text-bunker-amber-500" />, desc: 'Shartnomalar, hisob-fakturalar va to‘lov holati' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bunker-base text-bunker-text-primary selection:bg-bunker-amber-500 selection:text-bunker-vault font-sans transition-colors duration-200">
      {/* 1. Double-Decker Mission Control Navigation & Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        highVisMode={highVisMode}
        onToggleHighVis={() => setHighVisMode((prev) => !prev)}
      />

      {/* 2. Main Views Content */}
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

      {/* 3. Brushed Steel Industrial Footer */}
      <footer className="mt-auto brushed-steel border-t border-bunker-border-strong text-bunker-text-secondary relative">
        <div className="h-1 w-full hazard-stripe-sm opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-bunker-surface-2 border border-bunker-border-strong flex items-center justify-center shadow-inner">
                  <div className="absolute top-1 left-1 industrial-rivet" />
                  <div className="absolute top-1 right-1 industrial-rivet" />
                  <HardHat className="w-5 h-5 text-bunker-amber-500" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-wider leading-none text-bunker-text-primary">
                    <span className="text-bunker-amber-500">BUNKER</span> STROY
                  </span>
                  <span className="text-[10px] tracking-widest text-bunker-text-muted uppercase font-mono block mt-0.5">
                    Sanoat & B2B Qurilish Ekologik Tizimi
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-bunker-text-secondary max-w-md">
                BunkerStroy — O‘zbekiston Respublikasi bo‘ylab yirik qurilish ob’ektlari, pudratchilar va ishlab chiqaruvchilarni
                to‘g‘ridan-to‘g‘ri birlashtiruvchi avtomatlashtirilgan B2B xaridlar, og‘ir logistika va ESCO energiya auditi platformasi.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <div className="flex items-center gap-1.5 bg-bunker-surface-1 border border-bunker-border-strong px-2.5 py-1 rounded-lg text-[10px] font-mono text-bunker-amber-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-bunker-status-green" />
                  <span>ISO 9001:2015 Sertifikatlangan</span>
                </div>
                <div className="flex items-center gap-1.5 bg-bunker-surface-1 border border-bunker-border-strong px-2.5 py-1 rounded-lg text-[10px] font-mono text-bunker-status-green">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Davlat Standartlari Muqobilligi</span>
                </div>
              </div>
            </div>

            {/* Column 2: Platform Modules */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bunker-text-primary font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-bunker-amber-500" />
                Modullar
              </h4>
              <ul className="space-y-2 text-xs font-mono">
                <li>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="hover:text-bunker-amber-500 transition-colors cursor-pointer"
                  >
                    B2B Marketplace & Katalog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('logistics')}
                    className="hover:text-bunker-amber-500 transition-colors cursor-pointer"
                  >
                    Og'ir Yuk Tashish & HOWO
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('esco')}
                    className="hover:text-bunker-amber-500 transition-colors cursor-pointer"
                  >
                    ESCO Energiya Auditi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('global_bunker')}
                    className="hover:text-bunker-amber-500 transition-colors cursor-pointer"
                  >
                    Global Bunker Import Hub
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="hover:text-bunker-amber-500 transition-colors cursor-pointer"
                  >
                    Mening Buyurtmalarim
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Texnologiyalar & Xavfsizlik */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bunker-text-primary font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-bunker-amber-500" />
                Integratsiyalar
              </h4>
              <ul className="space-y-2 text-xs font-mono text-bunker-text-secondary">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-amber-500" />
                  <span>E-IMZO Raqamli Imzo</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-amber-500" />
                  <span>Davlat Soliq Qo‘mitasi (STIR)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-status-green" />
                  <span>Google Gemini 3.8 AI & Maps</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-status-green" />
                  <span>Eskiz.uz SMS Gateway</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-status-cyan" />
                  <span>Payme, Click & B2B Invoicing</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Bog'lanish & Aloqa */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bunker-text-primary font-mono flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-bunker-amber-500" />
                Aloqa Markazi
              </h4>
              <div className="space-y-2.5 text-xs text-bunker-text-secondary font-mono">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-bunker-amber-500 shrink-0 mt-0.5" />
                  <span>Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko'chasi 42-A</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-bunker-status-green shrink-0" />
                  <span className="text-bunker-text-primary font-bold">+998 (71) 200-45-46</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-bunker-amber-500 shrink-0" />
                  <span>Dispetcherlik: 24/7 uzluksiz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & SLA */}
          <div className="mt-10 pt-6 border-t border-bunker-border-strong flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <p className="text-bunker-text-muted text-center sm:text-left">
              &copy; 2026 BunkerStroy Technologies LLC. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-bunker-status-green">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                SLA: 99.98% Ishonchlilik
              </span>
              <span className="text-bunker-border-strong">|</span>
              <span className="text-bunker-text-muted">v1.2.0 (Tactile Precision Core)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. Global Command Search Palette Modal (Ctrl + K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-bunker-surface-1 border-2 border-bunker-amber-500 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-bunker-border-subtle">
              <Search className="w-5 h-5 text-bunker-amber-500 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Modul, mahsulot yoki xizmat nomini yozing..."
                value={searchPaletteQuery}
                onChange={(e) => setSearchPaletteQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-bunker-text-primary outline-none font-mono placeholder:text-bunker-text-muted"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-bunker-text-secondary hover:text-bunker-text-primary p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-bunker-text-muted uppercase font-mono block font-bold">
                Tezkor O‘tish Modullari:
              </span>
              <div className="space-y-1">
                {quickNavItems
                  .filter((item) =>
                    !searchPaletteQuery ||
                    item.label.toLowerCase().includes(searchPaletteQuery.toLowerCase()) ||
                    item.desc.toLowerCase().includes(searchPaletteQuery.toLowerCase())
                  )
                  .map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveTab(item.tab);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-bunker-base hover:bg-bunker-surface-hover border border-bunker-border-subtle hover:border-bunker-amber-500 flex items-center justify-between cursor-pointer transition-all group font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-bunker-surface-2 border border-bunker-border-strong group-hover:border-bunker-amber-500">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-bunker-text-primary group-hover:text-bunker-amber-500 transition-colors">
                            {item.label}
                          </h4>
                          <p className="text-[11px] text-bunker-text-muted">{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs text-bunker-text-muted group-hover:text-bunker-amber-500">↵</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2 border-t border-bunker-border-subtle flex items-center justify-between text-[10px] font-mono text-bunker-text-muted">
              <span>Navigatsiya: <kbd className="bg-bunker-surface-2 px-1.5 py-0.5 rounded">↑</kbd> <kbd className="bg-bunker-surface-2 px-1.5 py-0.5 rounded">↓</kbd></span>
              <span>Yopish: <kbd className="bg-bunker-surface-2 px-1.5 py-0.5 rounded">ESC</kbd></span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Drawers & Modals */}
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

      {/* Non-Blocking Floating AI Copilot Dock */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
        }}
      />
    </div>
  );
};
