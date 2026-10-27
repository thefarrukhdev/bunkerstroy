import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { Product } from '@bunkerstroy/types';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { MarketplaceView } from './features/marketplace/MarketplaceView';
import { ProductDetailView } from './features/marketplace/ProductDetailView';
import { SuppliersView } from './features/suppliers/SuppliersView';
import { LogisticsView } from './features/logistics/LogisticsView';
import { DriverMobileView } from './features/driver/DriverMobileView';
import { OrdersView } from './features/orders/OrdersView';
import { SellerPanelView } from './features/seller/SellerPanelView';
import { AuthModal } from './features/auth/AuthModal';
import {
  HardHat,
  PhoneCall,
  MapPin,
  Clock
} from 'lucide-react';
import { Badge } from '@bunkerstroy/ui';

export const AppContent: React.FC = () => {
  const navigate = useNavigate();

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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
        console.warn('Session check network error:', err);
      });
  }, []);

  // Cart actions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const qtyToAdd = Math.max(1, quantity);
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: qtyToAdd }];
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
    navigate('/orders');
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
    <div className="min-h-screen flex flex-col bg-bunker-base text-bunker-text-primary selection:bg-bunker-amber-500 selection:text-white font-sans transition-colors duration-200">
      {/* 1. Header Navigation Bar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Main Page Content (Real URL Routes) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all">
        <Routes>
          <Route path="/" element={<MarketplaceView onAddToCart={handleAddToCart} />} />
          <Route path="/products/:id" element={<ProductDetailView onAddToCart={handleAddToCart} />} />
          <Route path="/suppliers" element={<SuppliersView onNavigateToCatalog={() => navigate('/')} />} />
          <Route path="/orders" element={<OrdersView />} />
          <Route path="/seller-panel" element={<SellerPanelView />} />
          <Route path="/logistics" element={<LogisticsView />} />
          <Route path="/driver" element={<DriverMobileView />} />
          {/* Legacy redirects */}
          <Route path="/tenders" element={<Navigate to="/" replace />} />
          <Route path="/esco" element={<Navigate to="/" replace />} />
          <Route path="/global-bunker" element={<Navigate to="/" replace />} />
          <Route path="/certifications" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 3. Minimalist Industrial Footer */}
      <footer className="mt-auto bg-[#0A1931] border-t-2 border-[#1E3A6D] text-sky-200">
        <div className="h-[2px] w-full hazard-stripe-sm opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg bg-[#0F2547] border border-[#254B85] flex items-center justify-center">
                  <div className="absolute top-0.5 left-0.5 industrial-rivet" />
                  <div className="absolute top-0.5 right-0.5 industrial-rivet" />
                  <HardHat className="w-4 h-4 text-[#FFB800]" />
                </div>
                <span className="font-heading text-lg font-extrabold tracking-tight text-white">
                  <span className="text-[#FFB800]">BUNKER</span>STROY
                </span>
              </div>

              <p className="text-xs text-sky-200/80 max-w-sm leading-relaxed">
                Qurilish mollari ishlab chiqaruvchilar, do‘konlar va xaridorlarni to‘g‘ridan-to‘g‘ri
                birlashtiruvchi zamonaviy marketplace va og‘ir yuk logistika platformasi.
              </p>

              <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                <span className="bg-[#0F2547] border border-[#1E3A6D] px-2 py-0.5 rounded text-sky-200">
                  ISO 9001:2015
                </span>
                <span className="bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded text-emerald-400 font-bold">
                  O‘zDSt &amp; GOST
                </span>
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFB800] font-mono">
                Platforma
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-sky-100">
                <li>
                  <Link to="/" className="hover:text-[#FFB800] transition-colors">
                    Katalog &amp; Vitrina
                  </Link>
                </li>
                <li>
                  <Link to="/suppliers" className="hover:text-[#FFB800] transition-colors">
                    Do‘konlar &amp; Zavodlar
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-[#FFB800] transition-colors">
                    Mening Buyurtmalarim
                  </Link>
                </li>
                <li>
                  <Link to="/seller-panel" className="text-[#FFB800] font-bold hover:underline transition-colors">
                    + Sotuvchi Kabineti (POS &amp; CRM)
                  </Link>
                </li>
                <li>
                  <Link to="/logistics" className="hover:text-[#FFB800] transition-colors">
                    Yetkazib berish (Logistika)
                  </Link>
                </li>
                <li>
                  <Link to="/driver" className="text-amber-400 font-bold hover:underline transition-colors flex items-center gap-1">
                    <span>🚛 Haydovchi Kabineti</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Standards & Integrations */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFB800] font-mono">
                Afzalliklar
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-sky-200/90">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                  <span>Zavod va ishlab chiqaruvchi narxlari</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                  <span>Ob'ektgacha yuk yetkazib berish</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>50/50 Xavfsiz Escrow to‘lovi</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Payme, Click, Naqd va B2B to‘lov</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Support */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFB800] font-mono">
                Dispetcherlik
              </h4>
              <div className="space-y-1.5 text-xs text-sky-200/90 font-mono">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-white font-bold">+998 (71) 200-45-46</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB800] shrink-0 mt-0.5" />
                  <span>Toshkent sh., Bunyodkor shoh ko'chasi 42-A</span>
                </div>
                <div className="flex items-center gap-1.5 text-sky-300/70">
                  <Clock className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                  <span>24/7 uzluksiz xizmat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-8 pt-4 border-t border-[#1E3A6D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <p className="text-sky-300/70">
              &copy; 2026 BunkerStroy Enterprise LLC. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded text-[11px] font-bold">
                ● SLA: 99.98%
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. Drawers & Modals */}
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
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};
