import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { Product } from '@bunkerstroy/types';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { MarketplaceView } from './features/marketplace/MarketplaceView';
import { LandingView } from './features/landing/LandingView';
import { ProductDetailView } from './features/marketplace/ProductDetailView';
import { SuppliersView } from './features/suppliers/SuppliersView';
import { CalculatorsView } from './features/calculators/CalculatorsView';
import { TendersView } from './features/tenders/TendersView';
import { LogisticsView } from './features/logistics/LogisticsView';
import { DriverMobileView } from './features/driver/DriverMobileView';
import { OrdersView } from './features/orders/OrdersView';
import { SellerPanelView } from './features/seller/SellerPanelView';
import { AuthModal } from './features/auth/AuthModal';
import {
  HardHat,
  PhoneCall,
  MapPin,
  Clock,
  WifiOff
} from 'lucide-react';
import { Badge } from '@bunkerstroy/ui';
import { initializeMobilePlatform, triggerHaptic } from './services/mobileBridge';
import { apiFetch, resolveApiUrl } from './services/apiClient';

export const AppContent: React.FC = () => {
  const navigate = useNavigate();

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // References for native back button handling
  const isCartOpenRef = React.useRef(isCartOpen);
  const isAuthOpenRef = React.useRef(isAuthOpen);
  isCartOpenRef.current = isCartOpen;
  isAuthOpenRef.current = isAuthOpen;

  // Initialize native mobile features (StatusBar, Splash, Network, BackButton)
  useEffect(() => {
    const cleanupPromise = initializeMobilePlatform({
      onBackPress: () => {
        if (isCartOpenRef.current) {
          setIsCartOpen(false);
          return true;
        }
        if (isAuthOpenRef.current) {
          setIsAuthOpen(false);
          return true;
        }
        return false;
      },
      onNetworkChange: (connected) => {
        setIsOffline(!connected);
      }
    });

    return () => {
      cleanupPromise.then((cleanup) => cleanup && cleanup());
    };
  }, []);

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

    apiFetch('/auth/me')
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
    triggerHaptic('medium');
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
      {/* Mobile Offline Notice Banner */}
      {isOffline && (
        <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-sm animate-pulse">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Internet aloqasi uzildi. Ilova oflayn rejimda ishlamoqda.</span>
        </div>
      )}

      {/* 1. Header Navigation Bar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Main Page Content (Real URL Routes) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 lg:pb-6 transition-all">
        <Routes>
          <Route
            path="/"
            element={
              <LandingView
                onNavigateToCatalog={() => navigate('/catalog')}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            }
          />
          <Route path="/catalog" element={<MarketplaceView onAddToCart={handleAddToCart} />} />
          <Route path="/marketplace" element={<Navigate to="/catalog" replace />} />
          <Route
            path="/products/:id"
            element={
              <ProductDetailView
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
              />
            }
          />
          <Route path="/suppliers" element={<SuppliersView onNavigateToCatalog={() => navigate('/catalog')} />} />
          <Route path="/calculators" element={<CalculatorsView />} />
          <Route path="/tenders" element={<TendersView />} />
          <Route path="/orders" element={<OrdersView />} />
          <Route path="/seller-panel" element={<SellerPanelView />} />
          <Route path="/logistics" element={<LogisticsView />} />
          <Route path="/driver" element={<DriverMobileView />} />
          {/* Legacy redirects */}
          <Route path="/esco" element={<Navigate to="/calculators" replace />} />
          <Route path="/global-bunker" element={<Navigate to="/" replace />} />
          <Route path="/certifications" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 3. Minimalist Precision Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D95D1E] flex items-center justify-center text-white shadow-xs">
                  <HardHat className="w-4 h-4" />
                </div>
                <span className="font-heading text-lg font-extrabold tracking-tight text-slate-900">
                  <span className="text-[#D95D1E]">BUNKER</span>STROY
                </span>
              </div>

              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Qurilish mollari ishlab chiqaruvchilar, do‘konlar va xaridorlarni to‘g‘ridan-to‘g‘ri
                birlashtiruvchi zamonaviy marketplace va og‘ir yuk logistika platformasi.
              </p>

              <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                  ISO 9001:2015
                </span>
                <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-emerald-700 font-bold">
                  O‘zDSt &amp; GOST
                </span>
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Platforma
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-slate-600">
                <li>
                  <Link to="/" className="hover:text-[#D95D1E] transition-colors">
                    Bosh Sahifa
                  </Link>
                </li>
                <li>
                  <Link to="/catalog" className="hover:text-[#D95D1E] transition-colors">
                    Katalog &amp; Vitrina
                  </Link>
                </li>
                <li>
                  <Link to="/suppliers" className="hover:text-[#D95D1E] transition-colors">
                    Do‘konlar &amp; Zavodlar
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-[#D95D1E] transition-colors">
                    Mening Buyurtmalarim
                  </Link>
                </li>
                <li>
                  <Link to="/seller-panel" className="text-[#D95D1E] font-bold hover:underline transition-colors">
                    + Sotuvchi Kabineti (POS &amp; CRM)
                  </Link>
                </li>
                <li>
                  <Link to="/logistics" className="hover:text-[#D95D1E] transition-colors">
                    Yetkazib berish (Logistika)
                  </Link>
                </li>
                <li>
                  <Link to="/driver" className="text-sky-700 font-bold hover:underline transition-colors flex items-center gap-1">
                    <span>🚛 Haydovchi Kabineti</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Standards & Integrations */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Afzalliklar
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#D95D1E] font-bold">—</span>
                  <span>Zavod va ishlab chiqaruvchi narxlari</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#D95D1E] font-bold">—</span>
                  <span>Ob'ektgacha yuk yetkazib berish</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-700 font-bold">—</span>
                  <span>100% yoki 50/50 Xavfsiz to‘lov</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-700 font-bold">—</span>
                  <span>Payme, Click, Naqd va B2B to‘lov</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Support */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Dispetcherlik
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-slate-900 font-bold">+998 (71) 200-45-46</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D95D1E] shrink-0 mt-0.5" />
                  <span>Toshkent sh., Bunyodkor shoh ko'chasi 42-A</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-[#D95D1E] shrink-0" />
                  <span>24/7 uzluksiz xizmat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <p className="text-slate-500">
              &copy; 2026 BunkerStroy Enterprise LLC. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-bold">
                SLA: 99.98%
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

      {/* 5. Mobile Bottom Navigation */}
      <MobileBottomNav
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
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
