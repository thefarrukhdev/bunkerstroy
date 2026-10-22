import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { Product } from '@bunkerstroy/types';
import { Navbar, ActiveTabType } from './components/Navbar';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { MarketplaceView } from './features/marketplace/MarketplaceView';
import { ProductDetailView } from './features/marketplace/ProductDetailView';
import { SuppliersView } from './features/suppliers/SuppliersView';
import { LogisticsView } from './features/logistics/LogisticsView';
import { TendersView } from './features/tenders/TendersView';
import { EscoCalculatorView } from './features/esco/EscoCalculatorView';
import { GlobalBunkerHubView } from './features/global_bunker/GlobalBunkerHubView';
import { CertificationsView } from './features/certifications/CertificationsView';
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
  Building2,
  Truck,
  Leaf,
  Globe,
  ClipboardList,
  Factory,
  FileSpreadsheet
} from 'lucide-react';
import { Badge, Modal, Input, Tooltip } from '@bunkerstroy/ui';

export const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchPaletteQuery, setSearchPaletteQuery] = useState('');

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

  // Global Keyboard Shortcuts: Ctrl + K (Search) & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
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

  // Command palette navigation items
  const quickNavItems = [
    { label: 'Katalog & B2B Mahsulotlar', path: '/', icon: <Building2 className="w-4 h-4 text-bunker-amber-500" />, desc: 'Sement, armatura, g‘isht va izolyatsiya materiallari' },
    { label: 'Zavodlar & Ishlab Chiqaruvchilar', path: '/suppliers', icon: <Factory className="w-4 h-4 text-bunker-amber-500" />, desc: 'O‘zmetkombinat, Qizilqumsement, Knauf zavod narxlari' },
    { label: 'Logistika Hub & Maxsus Texnikalar', path: '/logistics', icon: <Truck className="w-4 h-4 text-bunker-amber-500" />, desc: 'HOWO 25t, Shacman mikser, Isuzu kran marshruti' },
    { label: 'Qurilish Tenderlari & Smeta RFQ', path: '/tenders', icon: <FileSpreadsheet className="w-4 h-4 text-bunker-amber-500" />, desc: 'Yirik smeta xaridlari va korporativ auksion' },
    { label: 'ESCO Bino Energiya Auditi', path: '/esco', icon: <Leaf className="w-4 h-4 text-bunker-status-green" />, desc: 'ShNQ 2.01.04-18 davlat standarti, termal pasport' },
    { label: 'Global Bunker Xalqaro Import', path: '/global-bunker', icon: <Globe className="w-4 h-4 text-bunker-status-cyan" />, desc: 'Temir yo‘l hopperlari va xorijiy klinker ta’minoti' },
    { label: 'Davlat Standartlari & Laboratoriya', path: '/certifications', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, desc: 'GOST, O‘zDSt va ShNQ sinov bayonnomalari' },
    { label: 'Mening Buyurtmalarim & Invoyslar', path: '/orders', icon: <ClipboardList className="w-4 h-4 text-bunker-amber-500" />, desc: 'Shartnomalar, hisob-fakturalar va to‘lov holati' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bunker-base text-bunker-text-primary selection:bg-bunker-amber-500 selection:text-white font-sans transition-colors duration-200">
      {/* 1. Header Navigation Bar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Main Page Content (Real URL Routes) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all">
        <Routes>
          <Route path="/" element={<MarketplaceView onAddToCart={handleAddToCart} />} />
          <Route path="/products/:id" element={<ProductDetailView onAddToCart={handleAddToCart} />} />
          <Route path="/suppliers" element={<SuppliersView onNavigateToCatalog={() => navigate('/')} />} />
          <Route path="/logistics" element={<LogisticsView />} />
          <Route path="/tenders" element={<TendersView />} />
          <Route path="/esco" element={<EscoCalculatorView />} />
          <Route path="/global-bunker" element={<GlobalBunkerHubView />} />
          <Route path="/certifications" element={<CertificationsView />} />
          <Route path="/orders" element={<OrdersView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 3. Minimalist Industrial Footer */}
      <footer className="mt-auto bg-white border-t border-bunker-border-strong text-bunker-text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
                  <HardHat className="w-4 h-4 text-bunker-amber-500" />
                </div>
                <span className="font-heading text-lg font-extrabold tracking-tight text-bunker-text-primary">
                  <span className="text-bunker-amber-500">BUNKER</span>STROY
                </span>
              </div>

              <p className="text-xs text-bunker-text-secondary max-w-sm leading-relaxed">
                O‘zbekiston bo‘ylab yirik ishlab chiqaruvchilar va qurilish developerlarini to‘g‘ridan-to‘g‘ri
                birlashtiruvchi B2B xaridlar va og‘ir logistika platformasi.
              </p>

              <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                <span className="bg-slate-50 border border-bunker-border-strong px-2 py-0.5 rounded text-bunker-text-secondary">
                  ISO 9001:2015
                </span>
                <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-emerald-800 font-bold">
                  O‘zDSt &amp; GOST
                </span>
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bunker-text-primary font-mono">
                Sahifalar
              </h4>
              <ul className="space-y-1.5 text-xs font-mono">
                <li>
                  <Link to="/" className="hover:text-bunker-amber-500 transition-colors">
                    Katalog &amp; Smeta
                  </Link>
                </li>
                <li>
                  <Link to="/suppliers" className="hover:text-bunker-amber-500 transition-colors">
                    Zavodlar
                  </Link>
                </li>
                <li>
                  <Link to="/logistics" className="hover:text-bunker-amber-500 transition-colors">
                    Logistika &amp; HOWO
                  </Link>
                </li>
                <li>
                  <Link to="/tenders" className="hover:text-bunker-amber-500 transition-colors">
                    Tenderlar &amp; RFQ
                  </Link>
                </li>
                <li>
                  <Link to="/esco" className="hover:text-bunker-amber-500 transition-colors">
                    ESCO Audit
                  </Link>
                </li>
                <li>
                  <Link to="/global-bunker" className="hover:text-bunker-amber-500 transition-colors">
                    Import Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Standards & Integrations */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bunker-text-primary font-mono">
                Integratsiyalar
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-bunker-text-secondary">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-amber-500" />
                  <span>E-IMZO PKCS#7 Raqamli Imzo</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-amber-500" />
                  <span>Davlat Soliq Qo‘mitasi (STIR)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-status-green" />
                  <span>Google Gemini AI Copilot</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-status-green" />
                  <span>Payme, Click &amp; B2B Faktura</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Support */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bunker-text-primary font-mono">
                Dispetcherlik
              </h4>
              <div className="space-y-2 text-xs text-bunker-text-secondary font-mono">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-bunker-text-primary font-bold">+998 (71) 200-45-46</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-bunker-amber-500 shrink-0 mt-0.5" />
                  <span>Toshkent sh., Bunyodkor shoh ko'chasi 42-A</span>
                </div>
                <div className="flex items-center gap-1.5 text-bunker-text-muted">
                  <Clock className="w-3.5 h-3.5 text-bunker-amber-500 shrink-0" />
                  <span>Dispetcherlik: 24/7 uzluksiz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-8 pt-4 border-t border-bunker-border-strong flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <p className="text-bunker-text-muted">
              &copy; 2026 BunkerStroy Enterprise LLC.
            </p>
            <div className="flex items-center gap-3">
              <Badge variant="success" size="sm" isMono dot className="bg-emerald-50 text-emerald-700 border-emerald-200">
                SLA: 99.98%
              </Badge>
              <span className="text-bunker-border-strong">|</span>
              <span className="text-bunker-text-muted">v2.0 Nordic Enterprise</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. Global Command Search Palette Modal (Ctrl + K) */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Global Qidiruv"
        subtitle="Platforma sahifalari va xizmatlari bo'yicha tezkor o‘tish"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            autoFocus
            placeholder="Sahifa yoki xizmat nomini yozing..."
            value={searchPaletteQuery}
            onChange={(e) => setSearchPaletteQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-bunker-amber-500" />}
            isMono
            sizeVariant="md"
          />

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {quickNavItems
              .filter(
                (item) =>
                  !searchPaletteQuery ||
                  item.label.toLowerCase().includes(searchPaletteQuery.toLowerCase()) ||
                  item.desc.toLowerCase().includes(searchPaletteQuery.toLowerCase())
              )
              .map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    setIsSearchOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-bunker-border-strong hover:border-bunker-amber-500 flex items-center justify-between cursor-pointer transition-all group font-mono shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-bunker-border-strong group-hover:border-bunker-amber-500">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-bunker-text-primary group-hover:text-bunker-amber-500 transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-bunker-text-muted">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs text-bunker-text-muted group-hover:text-bunker-amber-500 font-bold">&rarr;</span>
                </div>
              ))}
          </div>
        </div>
      </Modal>

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

      {/* Voice Copilot Dock */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onNavigateTab={(tab) => {
          const tabToPath: Record<string, string> = {
            marketplace: '/',
            suppliers: '/suppliers',
            logistics: '/logistics',
            tenders: '/tenders',
            esco: '/esco',
            global_bunker: '/global-bunker',
            certifications: '/certifications',
            orders: '/orders'
          };
          if (tabToPath[tab]) {
            navigate(tabToPath[tab]);
          }
        }}
      />
    </div>
  );
};
