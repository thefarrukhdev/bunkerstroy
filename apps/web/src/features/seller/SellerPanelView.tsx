import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Truck,
  Layers,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Trash2,
  Edit2,
  ExternalLink,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Save,
  X,
  ShieldCheck,
  Wallet,
  Receipt,
  TrendingUp,
  Percent,
  FileText,
  Download,
  Search,
  Filter,
  Check,
  Award,
  Lock,
  Building2,
  ArrowUpRight,
  Info,
  Globe,
  Coins,
  FileCheck,
  Calculator,
  Store,
  Printer,
  Minus,
  Plus,
  CreditCard,
  Banknote,
  QrCode,
  DollarSign,
  ArrowDownRight,
  Factory,
  BarChart3,
  Calendar,
  SlidersHorizontal,
  ChevronRight,
  Tag
} from 'lucide-react';
import { Product, Order, OrderStatus } from '@bunkerstroy/types';
import { useLanguage } from '../../context/LanguageContext';
import { COLOR_OPTIONS, ColorOption } from '../marketplace/MarketplaceView';

/* ==========================================================================
   Types & Interfaces
   ========================================================================== */

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  productsCount?: number;
}

export interface TierPriceRow {
  id: string;
  minQty: number | '';
  maxQty: number | '';
  price: number | '';
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  priceDelta: number;
  stock: number;
}

export interface PayoutLedgerItem {
  id: string;
  orderNumber: string;
  releaseDate: string;
  buyerName: string;
  buyerStir: string;
  itemSummary: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'RELEASED' | 'ESCROW_LOCKED' | 'PROCESSING';
  payoutMethod: string;
  actNumber: string;
}

// B2B Zavodlar va Ishlab chiqaruvchilar interfeysi
export interface B2bManufacturer {
  id: string;
  name: string;
  location: string;
  stir: string;
  mfo: string;
  accountNumber: string;
  bankName: string;
  category: string;
  minOrderTons: number;
  featuredProduct: string;
  unitPrice: number;
  unit: string;
  rating: number;
  phone: string;
  imageUrl: string;
}

// B2B Wholesale Order
export interface B2bWholesaleOrder {
  id: string;
  orderNumber: string;
  manufacturerName: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  incoterm: 'EXW' | 'DAP';
  deliveryAddress: string;
  bankRequisites: {
    accountNumber: string;
    mfo: string;
    stir: string;
    bankName: string;
  };
  status: 'KUTILMOQDA' | 'TO‘LANDI' | 'ZAVODDAN_YUKLANDI' | 'YETKAZILDI';
  createdAt: string;
}

// POS Cart item and Basket
export interface PosBasketItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  unit: string;
  color?: string;
  size?: string;
  sku?: string;
}

export interface PosBasket {
  id: string;
  name: string;
  items: PosBasketItem[];
  customerName?: string;
  customerPhone?: string;
}

// Financial Ledger item
export interface FinancialOperation {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  channel: 'ONLINE_MARKETPLACE' | 'OFFLINE_POS' | 'OPERATIONAL_COST';
  category: string;
  amount: number;
  paymentMethod: string;
  notes: string;
}

/* ==========================================================================
   Static Seed Data (Zavodlar, Presets & Moliyaviy amallar)
   ========================================================================== */

export const B2B_MANUFACTURERS_LIST: B2bManufacturer[] = [
  {
    id: 'mfg-1',
    name: 'Bekobod Metallurgiya Zavodi (O‘zmetkombinat AJ)',
    location: 'Toshkent viloyati, Bekobod sh.',
    stir: '300123987',
    mfo: '00456',
    accountNumber: '20210000800100456001',
    bankName: 'ATIB Ipoteka Bank Bekobod filiali',
    category: 'Metallurgiya & Armatura',
    minOrderTons: 20,
    featuredProduct: 'Armatura A500C D14 (GOST 34028)',
    unitPrice: 7450000,
    unit: 'tonna',
    rating: 4.9,
    phone: '+998 (78) 120-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800'
  },
  {
    id: 'mfg-2',
    name: 'Qizilqumsement AJ (Navoiy)',
    location: 'Navoiy viloyati, Karmana tumani',
    stir: '200456123',
    mfo: '00876',
    accountNumber: '20208000900200876002',
    bankName: 'O‘zsanoatqurilishbank Navoiy filiali',
    category: 'Sement & Klinker',
    minOrderTons: 40,
    featuredProduct: 'Portlendsement M500 D0 (Qop/Uyma)',
    unitPrice: 680000,
    unit: 'tonna',
    rating: 5.0,
    phone: '+998 (79) 220-40-50',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'
  },
  {
    id: 'mfg-3',
    name: 'Ohangaronsement AJ (Eurocement)',
    location: 'Toshkent viloyati, Ohangaron sh.',
    stir: '201789456',
    mfo: '00765',
    accountNumber: '20208000400300765003',
    bankName: 'Hamkorbank Ohangaron filiali',
    category: 'Sement & Quruq Qorishmalar',
    minOrderTons: 15,
    featuredProduct: 'Portlendsement M400 D20 (50kg qop)',
    unitPrice: 640000,
    unit: 'tonna',
    rating: 4.8,
    phone: '+998 (71) 230-77-88',
    imageUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800'
  },
  {
    id: 'mfg-4',
    name: 'Artel & Akfa Building Systems',
    location: 'Toshkent sh., Yashnobod tumani',
    stir: '304567891',
    mfo: '00654',
    accountNumber: '20208000500400654004',
    bankName: 'Kapitalbank Toshkent Bosh filiali',
    category: 'Sendvich Panellar & Alyuminiy Profillar',
    minOrderTons: 5,
    featuredProduct: 'Sendvich devor panellari 100mm (Bazalt)',
    unitPrice: 155000,
    unit: 'm²',
    rating: 4.9,
    phone: '+998 (71) 203-00-00',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'
  },
  {
    id: 'mfg-5',
    name: 'Knauf Gips Buxoro (Kogon)',
    location: 'Buxoro viloyati, Kogon tumani',
    stir: '301234567',
    mfo: '00543',
    accountNumber: '20208000700500543005',
    bankName: 'Orient Finans Bank Buxoro filiali',
    category: 'Gipsokarton & Suvoq',
    minOrderTons: 10,
    featuredProduct: 'Gipsokarton listi 12.5mm (Standard)',
    unitPrice: 42000,
    unit: 'dona',
    rating: 4.95,
    phone: '+998 (65) 228-55-00',
    imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800'
  },
  {
    id: 'mfg-6',
    name: 'Toshkent Pishiq G‘isht Zavodi',
    location: 'Toshkent viloyati, Yangiyo‘l tumani',
    stir: '303456789',
    mfo: '00432',
    accountNumber: '20208000800600432006',
    bankName: 'Aloqabank Yangiyo‘l filiali',
    category: 'G‘isht & Bloklar',
    minOrderTons: 25,
    featuredProduct: 'Pishgan pishiq g‘isht M150 (Qizil)',
    unitPrice: 1450,
    unit: 'dona',
    rating: 4.75,
    phone: '+998 (71) 200-88-99',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
  }
];

export const INITIAL_FINANCIAL_OPERATIONS: FinancialOperation[] = [
  {
    id: 'fin-1',
    date: '27 Okt 2026, 12:40',
    type: 'INCOME',
    channel: 'OFFLINE_POS',
    category: 'Do‘kon Kassa Savdosi',
    amount: 3450000,
    paymentMethod: 'Naqd pul',
    notes: 'Kassa cheki CHK-004928'
  },
  {
    id: 'fin-2',
    date: '27 Okt 2026, 10:15',
    type: 'INCOME',
    channel: 'ONLINE_MARKETPLACE',
    category: 'Escrow 50% Avans tushumi',
    amount: 18500000,
    paymentMethod: 'Bank Kliring',
    notes: 'Buyurtma BS-94102'
  },
  {
    id: 'fin-3',
    date: '26 Okt 2026, 17:00',
    type: 'EXPENSE',
    channel: 'OPERATIONAL_COST',
    category: 'Ombor va Do‘kon Ijarasi',
    amount: 6000000,
    paymentMethod: 'Bank o‘tkazmasi',
    notes: 'Chilonzor omborxona 1 oylik to‘lov'
  },
  {
    id: 'fin-4',
    date: '25 Okt 2026, 15:30',
    type: 'EXPENSE',
    channel: 'OPERATIONAL_COST',
    category: 'Ishchilar maoshi',
    amount: 7500000,
    paymentMethod: 'Karta',
    notes: '2 nafar yuklovchi va 1 nafar kassa xodimi'
  },
  {
    id: 'fin-5',
    date: '25 Okt 2026, 11:20',
    type: 'INCOME',
    channel: 'OFFLINE_POS',
    category: 'Do‘kon Kassa Savdosi',
    amount: 8200000,
    paymentMethod: 'Uzcard/Humo',
    notes: 'Armatura va sim savdosi'
  },
  {
    id: 'fin-6',
    date: '24 Okt 2026, 14:10',
    type: 'INCOME',
    channel: 'ONLINE_MARKETPLACE',
    category: 'Escrow Qoldiq 50% tushumi',
    amount: 12608000,
    paymentMethod: 'Bank Kliring',
    notes: 'Buyurtma BS-93821 topshirildi'
  }
];

export const INITIAL_B2B_ORDERS: B2bWholesaleOrder[] = [
  {
    id: 'b2b-ord-1',
    orderNumber: 'B2B-2026-0081',
    manufacturerName: 'Bekobod Metallurgiya Zavodi (O‘zmetkombinat AJ)',
    productName: 'Armatura A500C D14 (20 tonna)',
    quantity: 20,
    unit: 'tonna',
    unitPrice: 7450000,
    totalAmount: 149000000,
    incoterm: 'DAP',
    deliveryAddress: 'Toshkent sh., Sergeli sanoat zonasi ombori',
    bankRequisites: {
      accountNumber: '20210000800100456001',
      mfo: '00456',
      stir: '300123987',
      bankName: 'ATIB Ipoteka Bank Bekobod filiali'
    },
    status: 'ZAVODDAN_YUKLANDI',
    createdAt: '24 Oktabr 2026'
  },
  {
    id: 'b2b-ord-2',
    orderNumber: 'B2B-2026-0074',
    manufacturerName: 'Qizilqumsement AJ (Navoiy)',
    productName: 'Portlendsement M500 D0 (40 tonna)',
    quantity: 40,
    unit: 'tonna',
    unitPrice: 680000,
    totalAmount: 27200000,
    incoterm: 'DAP',
    deliveryAddress: 'Chilonzor ombori 42-A',
    bankRequisites: {
      accountNumber: '20208000900200876002',
      mfo: '00876',
      stir: '200456123',
      bankName: 'O‘zsanoatqurilishbank Navoiy filiali'
    },
    status: 'YETKAZILDI',
    createdAt: '19 Oktabr 2026'
  }
];

export const SAMPLE_IMAGE_PRESETS = [
  { label: 'Sement & Bog‘lovchi', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800' },
  { label: 'Armatura & Po‘lat', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800' },
  { label: 'Pishiq G‘isht', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800' },
  { label: 'Quruq Qorishma', url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800' },
  { label: 'Sendvich Panellar', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800' }
];

export const INITIAL_ESCROW_LEDGER: PayoutLedgerItem[] = [
  {
    id: 'led-1',
    orderNumber: 'BS-94102',
    releaseDate: '24 Oktabr 2026, 14:32',
    buyerName: 'Toshkent City Qurilish MCHJ',
    buyerStir: '309112844',
    itemSummary: 'Sement M500 D0 (200 qop)',
    grossAmount: 12800000,
    platformFee: 192000,
    netAmount: 12608000,
    status: 'RELEASED',
    payoutMethod: 'Bank Kliring (20208...001)',
    actNumber: 'DAL-2026/0894'
  },
  {
    id: 'led-2',
    orderNumber: 'BS-93104',
    releaseDate: '22 Oktabr 2026, 11:15',
    buyerName: 'Modern Build Construction XK',
    buyerStir: '308774219',
    itemSummary: 'Armatura A500C D14 (5 tonna)',
    grossAmount: 48500000,
    platformFee: 727500,
    netAmount: 47772500,
    status: 'RELEASED',
    payoutMethod: 'Bank Kliring (20208...001)',
    actNumber: 'DAL-2026/0872'
  }
];

/* ==========================================================================
   Main Component: SellerPanelView
   ========================================================================== */

export const SellerPanelView: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Active Main Tab:
  // 'inventory' | 'create' | 'crm_pos' | 'b2b' | 'reports' | 'orders' | 'escrow'
  const [activeTab, setActiveTab] = useState<
    'inventory' | 'create' | 'crm_pos' | 'b2b' | 'reports' | 'orders' | 'escrow'
  >('inventory');

  // a) Online vs Offline inventory sub-tab filter:
  const [inventorySubTab, setInventorySubTab] = useState<'all' | 'online' | 'offline'>('all');

  // State: Categories & Products
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // State: Orders & Escrow Ledger
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [escrowLedger, setEscrowLedger] = useState<PayoutLedgerItem[]>(INITIAL_ESCROW_LEDGER);

  // State: B2B Wholesale
  const [b2bOrders, setB2bOrders] = useState<B2bWholesaleOrder[]>(() => {
    try {
      const saved = localStorage.getItem('bunkerstroy_b2b_orders');
      return saved ? JSON.parse(saved) : INITIAL_B2B_ORDERS;
    } catch {
      return INITIAL_B2B_ORDERS;
    }
  });

  const [selectedManufacturer, setSelectedManufacturer] = useState<B2bManufacturer | null>(null);
  const [b2bQuantity, setB2bQuantity] = useState<number>(20);
  const [b2bIncoterm, setB2bIncoterm] = useState<'EXW' | 'DAP'>('DAP');
  const [b2bDeliveryAddress, setB2bDeliveryAddress] = useState('Chilonzor ombori, Toshkent');
  const [isB2bModalOpen, setIsB2bModalOpen] = useState(false);
  const [b2bSuccessNotice, setB2bSuccessNotice] = useState(false);

  // State: Financial Operations (Kirim-Chiqim)
  const [financialOperations, setFinancialOperations] = useState<FinancialOperation[]>(() => {
    try {
      const saved = localStorage.getItem('bunkerstroy_financial_ops');
      return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_OPERATIONS;
    } catch {
      return INITIAL_FINANCIAL_OPERATIONS;
    }
  });

  const [financialPeriod, setFinancialPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState('Ombor Arendasi');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [expenseNotes, setExpenseNotes] = useState('');
  const [expensePaymentMethod, setExpensePaymentMethod] = useState('Bank o‘tkazmasi');

  // State: POS CRM Kassa (Multiple customer baskets)
  const [posBaskets, setPosBaskets] = useState<PosBasket[]>([
    { id: 'basket-1', name: 'Savat #1 (Mijoz 1)', items: [] },
    { id: 'basket-2', name: 'Savat #2 (Kutish)', items: [] }
  ]);
  const [activeBasketId, setActiveBasketId] = useState<string>('basket-1');
  const [posSearchTerm, setPosSearchTerm] = useState('');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'CASH' | 'CARD' | 'PAYME_CLICK' | 'B2B'>('CASH');
  const [cashGiven, setCashGiven] = useState<number | ''>('');
  const [posDiscountPercent, setPosDiscountPercent] = useState<number>(0);

  // Completed POS Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState<{
    receiptNumber: string;
    date: string;
    items: PosBasketItem[];
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    grandTotal: number;
    paymentMethod: string;
    cashGiven?: number;
    cashChange?: number;
    cashier: string;
  } | null>(null);

  // Notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State for + Mahsulot Qo'shish
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [unit, setUnit] = useState('BAG_50KG');
  const [stock, setStock] = useState<number | ''>('');
  const [minOrder, setMinOrder] = useState<number | ''>(1);
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGE_PRESETS[0].url);
  const [region, setRegion] = useState('Toshkent shahri');
  const [district, setDistrict] = useState('Chilonzor sanoat hududi');
  const [hasDelivery, setHasDelivery] = useState(true);
  const [description, setDescription] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // b) Online vs Offline toggles for new product
  const [isOnlinePublish, setIsOnlinePublish] = useState(true);
  const [isOfflineStore, setIsOfflineStore] = useState(true);

  // b) Colors & Sizes (Variants builder)
  const [selectedFormColors, setSelectedFormColors] = useState<string[]>(['kulrang']);
  const [selectedFormSizes, setSelectedFormSizes] = useState<string[]>(['50 kg']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [tieredPrices, setTieredPrices] = useState<TierPriceRow[]>([]);
  const [certificateNumber, setCertificateNumber] = useState('');

  // Editing state for inventory item
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Save B2B Orders and Financial ops
  useEffect(() => {
    try {
      localStorage.setItem('bunkerstroy_b2b_orders', JSON.stringify(b2bOrders));
    } catch {}
  }, [b2bOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('bunkerstroy_financial_ops', JSON.stringify(financialOperations));
    } catch {}
  }, [financialOperations]);

  // Initial Data Fetching
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/catalog/categories');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
        if (json.data.length > 0 && !categoryId) {
          setCategoryId(json.data[0].id);
        }
      }
    } catch (err) {
      console.warn('Categories fetch error:', err);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/catalog/products');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      }
    } catch (err) {
      console.warn('Products fetch error:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('bunkerstroy_token');
      const res = await fetch('/api/orders/supplier/all', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Show Feedback Notification
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  /* ==========================================================================
     (a) Filtered Inventory: All vs Online vs Offline
     ========================================================================== */
  const filteredProducts = useMemo(() => {
    if (inventorySubTab === 'online') {
      return products.filter((p) => (p as any).isOnline !== false);
    }
    if (inventorySubTab === 'offline') {
      return products.filter((p) => (p as any).isOffline !== false);
    }
    return products;
  }, [products, inventorySubTab]);

  // Toggle Online / Offline for a product
  const handleToggleProductChannel = (productId: string, channel: 'online' | 'offline') => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          if (channel === 'online') {
            const current = (p as any).isOnline !== false;
            return { ...p, isOnline: !current } as Product;
          } else {
            const current = (p as any).isOffline !== false;
            return { ...p, isOffline: !current } as Product;
          }
        }
        return p;
      })
    );
    showFeedback('success', `Tovar ${channel === 'online' ? 'Online Vitrina' : 'Do‘kon Kassa'} holati yangilandi!`);
  };

  /* ==========================================================================
     (b) Create Product with Colors, Sizes & Generated Variants
     ========================================================================== */
  const handleToggleFormColor = (colorId: string) => {
    setSelectedFormColors((prev) =>
      prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]
    );
  };

  const handleAddFormSize = (sizeStr: string) => {
    const trimmed = sizeStr.trim();
    if (!trimmed) return;
    if (!selectedFormSizes.includes(trimmed)) {
      setSelectedFormSizes((prev) => [...prev, trimmed]);
    }
    setCustomSizeInput('');
  };

  const handleRemoveFormSize = (sizeStr: string) => {
    setSelectedFormSizes((prev) => prev.filter((s) => s !== sizeStr));
  };

  // Generated Variants Matrix
  const generatedVariants = useMemo<ProductVariantItem[]>(() => {
    const colors = selectedFormColors.length > 0 ? selectedFormColors : ['standart'];
    const sizes = selectedFormSizes.length > 0 ? selectedFormSizes : ['standart'];
    const list: ProductVariantItem[] = [];

    colors.forEach((col) => {
      sizes.forEach((sz) => {
        list.push({
          id: `${col}-${sz}`,
          sku: `SKU-${col.toUpperCase().slice(0, 3)}-${sz.replace(/\s+/g, '')}`,
          color: col,
          size: sz,
          priceDelta: 0,
          stock: typeof stock === 'number' ? Math.floor(stock / (colors.length * sizes.length)) : 100
        });
      });
    });
    return list;
  }, [selectedFormColors, selectedFormSizes, stock]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !stock) {
      showFeedback('error', 'Iltimos, mahsulot nomi, narxi va zaxirasini to‘liq kiriting!');
      return;
    }

    setFormSubmitting(true);
    const newProduct: any = {
      id: `prod-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      categoryId: categoryId || categories[0]?.id || 'cat-general',
      supplierId: 'sup-my-store',
      supplierName: 'BunkerStroy Hamkor Do‘koni',
      price: Number(price),
      unit,
      stock: Number(stock),
      minOrder: Number(minOrder) || 1,
      description: description || `${title} - Yuqori sifatli sertifikatlangan qurilish materiali.`,
      images: [imageUrl],
      region,
      district,
      hasDelivery,
      isOnline: isOnlinePublish,
      isOffline: isOfflineStore,
      variants: generatedVariants,
      tieredPrices: tieredPrices.filter((tp) => tp.minQty && tp.price),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/catalog/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setProducts((prev) => [json.data, ...prev]);
        } else {
          setProducts((prev) => [newProduct, ...prev]);
        }
      } else {
        // Fallback local memory addition
        setProducts((prev) => [newProduct, ...prev]);
      }

      showFeedback('success', `"${title}" tovari muvaffaqiyatli saqlandi!`);
      // Reset form
      setTitle('');
      setPrice('');
      setStock('');
      setDescription('');
      setActiveTab('inventory');
    } catch {
      setProducts((prev) => [newProduct, ...prev]);
      showFeedback('success', `"${title}" omborga qo‘shildi!`);
      setActiveTab('inventory');
    } finally {
      setFormSubmitting(false);
    }
  };

  /* ==========================================================================
     (c) POS CRM Kassa Methods (Multiple Baskets, Cash change & Thermal Receipt)
     ========================================================================== */
  const activeBasket = useMemo(() => {
    return posBaskets.find((b) => b.id === activeBasketId) || posBaskets[0];
  }, [posBaskets, activeBasketId]);

  const handleCreateNewBasket = () => {
    const nextNum = posBaskets.length + 1;
    const newB: PosBasket = {
      id: `basket-${Date.now()}`,
      name: `Savat #${nextNum} (Yangi)`,
      items: []
    };
    setPosBaskets((prev) => [...prev, newB]);
    setActiveBasketId(newB.id);
    showFeedback('success', 'Yangi savdo savati ochildi!');
  };

  const handleAddItemToBasket = (product: Product) => {
    setPosBaskets((prev) =>
      prev.map((b) => {
        if (b.id === activeBasketId) {
          const existing = b.items.find((item) => item.productId === product.id);
          if (existing) {
            return {
              ...b,
              items: b.items.map((item) =>
                item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
              )
            };
          }
          const newItem: PosBasketItem = {
            id: `bi-${Date.now()}-${Math.random()}`,
            productId: product.id,
            title: product.title,
            price: Number(product.price),
            quantity: 1,
            unit: product.unit || 'dona',
            color: product.variants?.[0]?.color || undefined,
            size: product.variants?.[0]?.size || undefined
          };
          return { ...b, items: [...b.items, newItem] };
        }
        return b;
      })
    );
  };

  const handleUpdateBasketQty = (itemId: string, delta: number) => {
    setPosBaskets((prev) =>
      prev.map((b) => {
        if (b.id === activeBasketId) {
          return {
            ...b,
            items: b.items
              .map((item) => {
                if (item.id === itemId) {
                  const nextQ = item.quantity + delta;
                  return nextQ > 0 ? { ...item, quantity: nextQ } : null;
                }
                return item;
              })
              .filter(Boolean) as PosBasketItem[]
          };
        }
        return b;
      })
    );
  };

  const handleRemoveBasketItem = (itemId: string) => {
    setPosBaskets((prev) =>
      prev.map((b) => {
        if (b.id === activeBasketId) {
          return { ...b, items: b.items.filter((item) => item.id !== itemId) };
        }
        return b;
      })
    );
  };

  const handleClearCurrentBasket = () => {
    setPosBaskets((prev) =>
      prev.map((b) => (b.id === activeBasketId ? { ...b, items: [] } : b))
    );
  };

  // POS Calculations
  const posSubtotal = useMemo(() => {
    return activeBasket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [activeBasket.items]);

  const posDiscountAmount = Math.round((posSubtotal * posDiscountPercent) / 100);
  const posAfterDiscount = posSubtotal - posDiscountAmount;
  const posTaxAmount = Math.round(posAfterDiscount * 0.12);
  const posGrandTotal = posAfterDiscount;

  const cashChange = typeof cashGiven === 'number' && cashGiven >= posGrandTotal
    ? cashGiven - posGrandTotal
    : 0;

  // Complete POS Sale & Generate Receipt
  const handleCompletePosSale = () => {
    if (activeBasket.items.length === 0) {
      showFeedback('error', 'Savat bo‘sh! Iltimos, mahsulot qo‘shing.');
      return;
    }

    if (posPaymentMethod === 'CASH' && typeof cashGiven === 'number' && cashGiven < posGrandTotal) {
      showFeedback('error', 'Qabul qilingan naqd pul summa to‘lovdan kam!');
      return;
    }

    const receiptNum = `CHK-${Date.now().toString().slice(-6)}`;
    const nowStr = new Date().toLocaleString('uz-UZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const receiptData = {
      receiptNumber: receiptNum,
      date: nowStr,
      items: [...activeBasket.items],
      subtotal: posSubtotal,
      discountAmount: posDiscountAmount,
      taxAmount: posTaxAmount,
      grandTotal: posGrandTotal,
      paymentMethod:
        posPaymentMethod === 'CASH'
          ? 'Naqd pul'
          : posPaymentMethod === 'CARD'
          ? 'Uzcard / Humo Terminal'
          : posPaymentMethod === 'PAYME_CLICK'
          ? 'Payme / Click QR'
          : 'B2B Nasiya Shartnoma',
      cashGiven: typeof cashGiven === 'number' ? cashGiven : undefined,
      cashChange: typeof cashGiven === 'number' ? cashChange : undefined,
      cashier: 'Kassir: Alisher N. (Kassa #1)'
    };

    // 1. Decrement product stocks locally
    setProducts((prev) =>
      prev.map((p) => {
        const boughtItem = activeBasket.items.find((item) => item.productId === p.id);
        if (boughtItem) {
          const nextStock = Math.max(0, p.stock - boughtItem.quantity);
          return { ...p, stock: nextStock };
        }
        return p;
      })
    );

    // 2. Add to Financial Operations
    const newFinOp: FinancialOperation = {
      id: `fin-pos-${Date.now()}`,
      date: nowStr,
      type: 'INCOME',
      channel: 'OFFLINE_POS',
      category: 'Do‘kon Kassa Savdosi',
      amount: posGrandTotal,
      paymentMethod: receiptData.paymentMethod,
      notes: `Kassa cheki ${receiptNum} (${activeBasket.items.length} xil tovar)`
    };
    setFinancialOperations((prev) => [newFinOp, ...prev]);

    // 3. Set Active Receipt Modal & Reset current basket
    setActiveReceipt(receiptData);
    handleClearCurrentBasket();
    setCashGiven('');
    showFeedback('success', `Savdo muvaffaqiyatli yakunlandi! Chek: ${receiptNum}`);
  };

  /* ==========================================================================
     (d) B2B Wholesale Order Methods
     ========================================================================== */
  const handleOpenB2bModal = (mfg: B2bManufacturer) => {
    setSelectedManufacturer(mfg);
    setB2bQuantity(mfg.minOrderTons);
    setIsB2bModalOpen(true);
  };

  const handleConfirmB2bWholesaleOrder = () => {
    if (!selectedManufacturer) return;
    const total = b2bQuantity * selectedManufacturer.unitPrice;
    const orderNum = `B2B-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: B2bWholesaleOrder = {
      id: `b2b-${Date.now()}`,
      orderNumber: orderNum,
      manufacturerName: selectedManufacturer.name,
      productName: `${selectedManufacturer.featuredProduct} (${b2bQuantity} ${selectedManufacturer.unit})`,
      quantity: b2bQuantity,
      unit: selectedManufacturer.unit,
      unitPrice: selectedManufacturer.unitPrice,
      totalAmount: total,
      incoterm: b2bIncoterm,
      deliveryAddress: b2bDeliveryAddress,
      bankRequisites: {
        accountNumber: selectedManufacturer.accountNumber,
        mfo: selectedManufacturer.mfo,
        stir: selectedManufacturer.stir,
        bankName: selectedManufacturer.bankName
      },
      status: 'KUTILMOQDA',
      createdAt: 'Bugun, ' + new Date().toLocaleDateString('uz-UZ')
    };

    setB2bOrders((prev) => [newOrder, ...prev]);
    setIsB2bModalOpen(false);
    setB2bSuccessNotice(true);
    setTimeout(() => setB2bSuccessNotice(false), 4000);
    showFeedback('success', `Zavodga ulgurji buyurtma yuborildi! Invoys: ${orderNum}`);
  };

  /* ==========================================================================
     (e) Financial Reports Calculations (Income / Expense / Net Profit)
     ========================================================================== */
  const totalIncome = useMemo(() => {
    return financialOperations
      .filter((op) => op.type === 'INCOME')
      .reduce((sum, op) => sum + op.amount, 0);
  }, [financialOperations]);

  const totalExpense = useMemo(() => {
    return financialOperations
      .filter((op) => op.type === 'EXPENSE')
      .reduce((sum, op) => sum + op.amount, 0);
  }, [financialOperations]);

  const netProfit = totalIncome - totalExpense;
  const profitMarginPercent = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

  const onlineIncome = useMemo(() => {
    return financialOperations
      .filter((op) => op.type === 'INCOME' && op.channel === 'ONLINE_MARKETPLACE')
      .reduce((sum, op) => sum + op.amount, 0);
  }, [financialOperations]);

  const offlineIncome = useMemo(() => {
    return financialOperations
      .filter((op) => op.type === 'INCOME' && op.channel === 'OFFLINE_POS')
      .reduce((sum, op) => sum + op.amount, 0);
  }, [financialOperations]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || Number(expenseAmount) <= 0) {
      showFeedback('error', 'Xarajat summasini to‘g‘ri kiriting!');
      return;
    }

    const newOp: FinancialOperation = {
      id: `exp-${Date.now()}`,
      date: 'Bugun, ' + new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      type: 'EXPENSE',
      channel: 'OPERATIONAL_COST',
      category: expenseCategory,
      amount: Number(expenseAmount),
      paymentMethod: expensePaymentMethod,
      notes: expenseNotes || 'Do‘kon operatsion chiqimi'
    };

    setFinancialOperations((prev) => [newOp, ...prev]);
    setIsExpenseModalOpen(false);
    setExpenseAmount('');
    setExpenseNotes('');
    showFeedback('success', 'Xarajat muvaffaqiyatli qayd etildi!');
  };

  return (
    <div className="space-y-6 text-white pb-16 font-sans">
      {/* 1. Header Banner & Quick Action Bar */}
      <div className="brushed-steel rounded-2xl p-5 sm:p-6 border-2 border-[#1E3A6D] shadow-xl relative overflow-hidden">
        <div className="absolute top-2 left-2 industrial-rivet" />
        <div className="absolute top-2 right-2 industrial-rivet" />
        <div className="absolute bottom-2 left-2 industrial-rivet" />
        <div className="absolute bottom-2 right-2 industrial-rivet" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-[#FFB800] uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#FFB800]" />
                Sotuvchi &amp; Do‘kon Boshqaruv Markazi
              </span>
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                ● Tizim Faol
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
              Sanoat Vitrinasi, Kassa POS &amp; B2B Xaridlar
            </h1>
            <p className="text-xs sm:text-sm text-sky-200/80 max-w-2xl leading-relaxed">
              Jismoniy do‘kon kassa apparati (POS CRM), B2B zavodlardan ulgurji xaridlar,
              online tovarlar vitrinasi va to‘liq moliyaviy Kirim-Chiqim hisobotlari.
            </p>
          </div>

          {/* Quick POS Trigger Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('crm_pos')}
              className="btn-industrial-yellow px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg select-none"
            >
              <Calculator className="w-4 h-4" />
              <span>Do‘kon Kassa / POS CRM</span>
              <span className="bg-[#071326] text-[#FFB800] px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                {activeBasket.items.length}
              </span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-between animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/80 border-red-500/50 text-red-300'
            }`}
          >
            <span>{feedback.message}</span>
            <button type="button" onClick={() => setFeedback(null)} className="cursor-pointer text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Main Navigation Tabs (7 ta bo'lim) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {/* 1. Ombor & Mahsulotlar */}
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            activeTab === 'inventory'
              ? 'bg-[#FFB800] text-[#071326] border-[#FFC928] font-black'
              : 'bg-[#0A1931] text-sky-200 border-[#1E3A6D] hover:border-[#2E5A9C] hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Mahsulotlar Ombori</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#071326] text-[#FFB800]">
            {products.length}
          </span>
        </button>

        {/* 2. + Yangi Tovar Qo'shish */}
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            activeTab === 'create'
              ? 'bg-[#FFB800] text-[#071326] border-[#FFC928] font-black'
              : 'bg-[#0A1931] text-sky-200 border-[#1E3A6D] hover:border-[#2E5A9C] hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Yangi Tovar Qo‘shish</span>
        </button>

        {/* 3. Do'kon Kassa / POS CRM */}
        <button
          type="button"
          onClick={() => setActiveTab('crm_pos')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            activeTab === 'crm_pos'
              ? 'bg-[#FFB800] text-[#071326] border-[#FFC928] font-black'
              : 'bg-[#0A1931] text-emerald-400 border-emerald-500/40 hover:border-emerald-400'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Do‘kon Kassa / POS CRM</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            POS
          </span>
        </button>

        {/* 4. B2B Zavodlar & Buyurtmalar */}
        <button
          type="button"
          onClick={() => setActiveTab('b2b')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            activeTab === 'b2b'
              ? 'bg-[#FFB800] text-[#071326] border-[#FFC928] font-black'
              : 'bg-[#0A1931] text-sky-200 border-[#1E3A6D] hover:border-[#2E5A9C] hover:text-white'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>B2B Zavodlar &amp; Buyurtmalar</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#071326] text-purple-400">
            {b2bOrders.length}
          </span>
        </button>

        {/* 5. Moliyaviy Kirim-Chiqim */}
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            activeTab === 'reports'
              ? 'bg-[#FFB800] text-[#071326] border-[#FFC928] font-black'
              : 'bg-[#0A1931] text-sky-200 border-[#1E3A6D] hover:border-[#2E5A9C] hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Moliyaviy Kirim-Chiqim</span>
        </button>

        {/* 6. Marketplace Buyurtmalari */}
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            activeTab === 'orders'
              ? 'bg-[#FFB800] text-[#071326] border-[#FFC928] font-black'
              : 'bg-[#0A1931] text-sky-200 border-[#1E3A6D] hover:border-[#2E5A9C] hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Buyurtmalar</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#071326] text-sky-200">
            {orders.length}
          </span>
        </button>

        {/* 7. Escrow Hisobi */}
        <button
          type="button"
          onClick={() => setActiveTab('escrow')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            activeTab === 'escrow'
              ? 'bg-[#FFB800] text-[#071326] border-[#FFC928] font-black'
              : 'bg-[#0A1931] text-sky-200 border-[#1E3A6D] hover:border-[#2E5A9C] hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>50/50 Escrow Reestri</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: MAHSULOTLAR OMBORI (With Online vs Offline Sub-Tabs)
          ===================================================================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Sub-tabs: All vs Online vs Offline */}
          <div className="industrial-card rounded-2xl p-4 bg-[#0A1931] border border-[#1E3A6D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-sky-400 font-bold uppercase text-[11px] mr-1">
                Kanal bo‘yicha filtr:
              </span>
              <button
                type="button"
                onClick={() => setInventorySubTab('all')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  inventorySubTab === 'all'
                    ? 'bg-[#132C54] text-[#FFB800] border-[#FFB800] font-bold'
                    : 'bg-[#071326] text-sky-300 border-[#1E3A6D] hover:border-[#2E5A9C]'
                }`}
              >
                Barcha tovarlar ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setInventorySubTab('online')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  inventorySubTab === 'online'
                    ? 'bg-[#132C54] text-emerald-400 border-emerald-500 font-bold'
                    : 'bg-[#071326] text-sky-300 border-[#1E3A6D] hover:border-[#2E5A9C]'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>🌐 Online Vitrina ({products.filter((p) => (p as any).isOnline !== false).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setInventorySubTab('offline')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  inventorySubTab === 'offline'
                    ? 'bg-[#132C54] text-[#FFB800] border-[#FFB800] font-bold'
                    : 'bg-[#071326] text-sky-300 border-[#1E3A6D] hover:border-[#2E5A9C]'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>🏪 Do‘kon Kassa / POS ({products.filter((p) => (p as any).isOffline !== false).length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className="btn-industrial-yellow px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Tovar</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="industrial-card rounded-2xl overflow-hidden bg-[#0A1931] border border-[#1E3A6D]">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#071326] text-sky-300 border-b border-[#1E3A6D] uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Tovar</th>
                    <th className="p-3.5">Birlik Narxi</th>
                    <th className="p-3.5">Ombordagi Zaxira</th>
                    <th className="p-3.5">Savdo Kanallari (Online / Offline)</th>
                    <th className="p-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A6D]">
                  {filteredProducts.map((p) => {
                    const isOnline = (p as any).isOnline !== false;
                    const isOffline = (p as any).isOffline !== false;

                    return (
                      <tr key={p.id} className="hover:bg-[#0F2547]/60 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || SAMPLE_IMAGE_PRESETS[0].url}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-[#071326] border border-[#1E3A6D]"
                            />
                            <div>
                              <div className="font-bold text-white text-sm line-clamp-1">{p.title}</div>
                              <span className="text-[10px] text-sky-400">
                                {p.region || 'Toshkent'} • {p.unit || 'dona'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-[#FFB800] text-sm font-mono-numbers">
                            {Number(p.price).toLocaleString()} so‘m
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`font-bold ${
                              p.stock > 10 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {p.stock} {p.unit || 'dona'}
                          </span>
                        </td>

                        {/* Savdo kanallari tezkor switcheri */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleProductChannel(p.id, 'online')}
                              title={isOnline ? 'Online vitrinada faol' : 'Online vitrinada o‘chirilgan'}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                isOnline
                                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                                  : 'bg-[#071326] text-sky-400/50 border-[#1E3A6D] line-through'
                              }`}
                            >
                              <Globe className="w-3 h-3" />
                              <span>Online Vitrina</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleProductChannel(p.id, 'offline')}
                              title={isOffline ? 'Do‘kon kassa POS da faol' : 'Kassada o‘chirilgan'}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                isOffline
                                  ? 'bg-[#132C54] text-[#FFB800] border-[#FFB800]/50'
                                  : 'bg-[#071326] text-sky-400/50 border-[#1E3A6D] line-through'
                              }`}
                            >
                              <Store className="w-3 h-3" />
                              <span>Do‘kon Kassa</span>
                            </button>
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleAddItemToBasket(p)}
                            className="btn-industrial-yellow px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer inline-flex items-center gap-1 shadow-xs"
                            title="Kassa savatiga qo‘shish"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Kassaga</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: + MAHSULOT QO'SHISH (With Color Palette, Sizes & Generated Variants)
          ===================================================================== */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateProduct} className="space-y-6">
          <div className="industrial-card rounded-2xl p-5 sm:p-7 bg-[#0A1931] border border-[#1E3A6D] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A6D]">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#FFB800]" />
                <h2 className="text-lg font-heading font-black text-white">
                  Yangi Qurilish Materiali Kiritish
                </h2>
              </div>
              <span className="text-xs font-mono text-[#FFB800] bg-[#132C54] px-2.5 py-1 rounded-lg border border-[#254B85]">
                BunkerStroy Standarti
              </span>
            </div>

            {/* Asosiy ma'lumotlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-sky-200">
                  Mahsulot Nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Portlendsement M500 D0 (50kg)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] text-sm text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-sky-200">
                  Kategoriya / Bo‘lim
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] text-sm text-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-sky-200">
                  Chakana / Birlik Narxi (so‘m) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Masalan: 65000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] text-sm text-[#FFB800] font-black outline-none font-mono-numbers"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-sky-200">
                  O‘lchov birligi
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] text-sm text-white outline-none font-mono"
                >
                  <option value="BAG_50KG">Qop (50 kg)</option>
                  <option value="TON">Tonna</option>
                  <option value="PIECE">Dona</option>
                  <option value="SQ_METER">Kvadrat metr (m²)</option>
                  <option value="CUBIC_METER">Kub metr (m³)</option>
                  <option value="METER">Pogona metr (m)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-sky-200">
                  Ombordagi Jami Zaxira *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Masalan: 500"
                  value={stock}
                  onChange={(e) => setStock(e.target.value ? Number(e.target.value) : '')}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] text-sm text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-sky-200">
                  Minimal buyurtma miqdori
                </label>
                <input
                  type="number"
                  placeholder="1"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value ? Number(e.target.value) : '')}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] text-sm text-white outline-none font-mono"
                />
              </div>
            </div>

            {/* a) Savdo Kanallari Toggles (Online vitrina vs Do'kon kassa) */}
            <div className="p-4 rounded-xl bg-[#071326] border border-[#1E3A6D] space-y-3">
              <span className="text-xs font-mono font-bold text-[#FFB800] uppercase block">
                Savdo Kanallari Sozlamasi:
              </span>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isOnlinePublish}
                    onChange={(e) => setIsOnlinePublish(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FFB800] focus:ring-[#FFB800] bg-[#0A1931] border-[#1E3A6D]"
                  />
                  <span className="text-xs font-mono text-white">
                    🌐 Online Vitrinada ko‘rinsin (Marketplace xaridorlari uchun)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isOfflineStore}
                    onChange={(e) => setIsOfflineStore(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FFB800] focus:ring-[#FFB800] bg-[#0A1931] border-[#1E3A6D]"
                  />
                  <span className="text-xs font-mono text-white">
                    🏪 Offline Do‘kon Kassa / POS da sotilsin
                  </span>
                </label>
              </div>
            </div>

            {/* b) Ranglar Palitrasi (COLOR_OPTIONS) */}
            <div className="p-4 rounded-xl bg-[#071326] border border-[#1E3A6D] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#FFB800] uppercase">
                  Ranglar Palitrasi (COLOR_OPTIONS):
                </span>
                <span className="text-[11px] font-mono text-sky-400">
                  Tanlangan: {selectedFormColors.length} ta rang
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => {
                  const isChecked = selectedFormColors.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleToggleFormColor(c.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#132C54] border-[#FFB800] text-white shadow-xs'
                          : 'bg-[#0A1931] border-[#1E3A6D] text-sky-300 hover:border-[#2E5A9C]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border shadow-inner"
                        style={{ backgroundColor: c.bg, borderColor: c.border }}
                      />
                      <span>{c.label.split('/')[0].trim()}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#FFB800]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* b) O'lchamlar (Sizes Chips & Custom input) */}
            <div className="p-4 rounded-xl bg-[#071326] border border-[#1E3A6D] space-y-3">
              <span className="text-xs font-mono font-bold text-[#FFB800] uppercase block">
                O‘lchamlar &amp; Fraksiyalar (Sizes):
              </span>

              {/* Popular size quick add */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-sky-400 mr-1">Tezkor:</span>
                {['50 kg', '25 kg', 'D12', 'D14', 'D16', '1 m²', '2x1 m', 'Dona'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleAddFormSize(chip)}
                    className="px-2 py-0.5 rounded-lg bg-[#0A1931] border border-[#1E3A6D] hover:border-[#FFB800] text-[11px] font-mono text-sky-200 cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              {/* Added sizes tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selectedFormSizes.map((sz) => (
                  <span
                    key={sz}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#132C54] border border-[#254B85] text-white font-mono text-xs font-bold"
                  >
                    <span>{sz}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFormSize(sz)}
                      className="text-sky-300 hover:text-red-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Custom size input */}
              <div className="flex items-center gap-2 pt-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Boshqa o‘lcham (masalan: 100mm)"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFormSize(customSizeInput);
                    }
                  }}
                  className="flex-1 h-9 px-3 rounded-lg bg-[#0A1931] border border-[#1E3A6D] text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddFormSize(customSizeInput)}
                  className="btn-industrial-dark px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Qo‘shish
                </button>
              </div>
            </div>

            {/* Generated Variants Preview */}
            <div className="p-4 rounded-xl bg-[#071326] border border-[#1E3A6D] space-y-2">
              <span className="text-xs font-mono font-bold text-sky-300 uppercase block">
                Hosil bo‘lgan Variantlar ({generatedVariants.length} ta kombinatsiya):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                {generatedVariants.slice(0, 6).map((v) => (
                  <div key={v.id} className="p-2 rounded-lg bg-[#0A1931] border border-[#1E3A6D]">
                    <span className="text-[#FFB800] font-bold">{v.color}</span> • <span>{v.size}</span>
                    <div className="text-[10px] text-sky-400">{v.sku}</div>
                  </div>
                ))}
                {generatedVariants.length > 6 && (
                  <div className="p-2 rounded-lg bg-[#0A1931] border border-[#1E3A6D] flex items-center justify-center text-sky-400 text-xs">
                    +{generatedVariants.length - 6} ta variant...
                  </div>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={formSubmitting}
                className="btn-industrial-yellow px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{formSubmitting ? 'Saqlanmoqda...' : 'Tovarni Omborga Saqlash'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =====================================================================
          TAB 3: DO'KON KASSA / POS CRM (Fullscreen, Multiple Carts, Thermal Receipt)
          ===================================================================== */}
      {activeTab === 'crm_pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Product Search & Quick Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* POS Header & Basket Switcher */}
            <div className="industrial-card rounded-2xl p-4 bg-[#0A1931] border border-[#1E3A6D] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#FFB800]" />
                  <span className="font-heading font-black text-white text-base">
                    Do‘kon Kassa Apparati (POS CRM)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCreateNewBasket}
                  className="btn-industrial-yellow px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Yangi Savat</span>
                </button>
              </div>

              {/* Active Baskets Switcher Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
                {posBaskets.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setActiveBasketId(b.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold cursor-pointer transition-all ${
                      activeBasketId === b.id
                        ? 'bg-[#132C54] text-[#FFB800] border-[#FFB800] shadow-xs'
                        : 'bg-[#071326] text-sky-300 border-[#1E3A6D] hover:border-[#2E5A9C]'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] bg-[#071326] px-1.5 py-0.2 rounded-full text-white">
                      {b.items.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fast Product Search in POS */}
            <div className="relative">
              <Search className="absolute left-3.5 w-4 h-4 text-[#FFB800] pointer-events-none" />
              <input
                type="text"
                placeholder="Mahsulot nomi yoki shtrixkodi bo‘yicha tezkor qidiruv..."
                value={posSearchTerm}
                onChange={(e) => setPosSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0A1931] border border-[#1E3A6D] focus:border-[#FFB800] text-sm text-white placeholder-sky-300/50 outline-none font-mono"
              />
            </div>

            {/* Quick Products Grid to add to current basket */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
              {products
                .filter(
                  (p) =>
                    !posSearchTerm ||
                    p.title.toLowerCase().includes(posSearchTerm.toLowerCase()) ||
                    p.supplierName.toLowerCase().includes(posSearchTerm.toLowerCase())
                )
                .map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleAddItemToBasket(prod)}
                    className="industrial-card rounded-xl p-3 bg-[#0A1931] border border-[#1E3A6D] hover:border-[#FFB800] cursor-pointer transition-all flex flex-col justify-between select-none group"
                  >
                    <div>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-[#071326] mb-2 border border-[#1E3A6D]">
                        <img
                          src={prod.images?.[0] || SAMPLE_IMAGE_PRESETS[0].url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 bg-[#071326]/90 px-1.5 py-0.2 rounded text-[9px] font-mono text-sky-200">
                          {prod.stock} {prod.unit || 'dona'}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs line-clamp-2 leading-tight">
                        {prod.title}
                      </h4>
                    </div>
                    <div className="pt-2 mt-2 border-t border-[#1E3A6D] flex items-center justify-between">
                      <span className="text-xs font-black text-[#FFB800] font-mono-numbers">
                        {Number(prod.price).toLocaleString()} so‘m
                      </span>
                      <div className="w-6 h-6 rounded bg-[#FFB800] text-[#071326] flex items-center justify-center font-black">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Column: Active Basket, Checkout & Thermal Receipt Trigger (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="industrial-card rounded-2xl p-5 bg-[#0A1931] border-2 border-[#1E3A6D] shadow-xl space-y-4 font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E3A6D]">
                <div>
                  <h3 className="font-bold text-white text-sm">{activeBasket.name}</h3>
                  <span className="text-[11px] text-sky-400">
                    Jami: {activeBasket.items.length} xil tovar
                  </span>
                </div>
                {activeBasket.items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCurrentBasket}
                    className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    Savatni tozalash
                  </button>
                )}
              </div>

              {/* Basket Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeBasket.items.length === 0 ? (
                  <div className="py-8 text-center text-sky-400/60 text-xs">
                    Savat bo‘sh. Chapdagi tovarlarni bosing.
                  </div>
                ) : (
                  activeBasket.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#071326] border border-[#1E3A6D] text-xs"
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <div className="font-bold text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-sky-400">
                          {item.price.toLocaleString()} so‘m x {item.quantity} {item.unit}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateBasketQty(item.id, -1)}
                          className="w-6 h-6 rounded bg-[#0F2547] text-white flex items-center justify-center font-bold hover:bg-[#132C54]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-black text-white w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateBasketQty(item.id, 1)}
                          className="w-6 h-6 rounded bg-[#0F2547] text-white flex items-center justify-center font-bold hover:bg-[#132C54]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveBasketItem(item.id)}
                          className="p-1 text-sky-400 hover:text-red-400 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Discount Selector */}
              <div className="pt-2 border-t border-[#1E3A6D] flex items-center justify-between text-xs">
                <span className="text-sky-300">Skidka / Chegirma:</span>
                <div className="flex items-center gap-1">
                  {[0, 3, 5, 10].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPosDiscountPercent(pct)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        posDiscountPercent === pct
                          ? 'bg-[#FFB800] text-[#071326] border-[#FFC928]'
                          : 'bg-[#071326] text-sky-300 border-[#1E3A6D]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-1.5 pt-2 border-t border-[#1E3A6D]">
                <span className="text-[11px] text-sky-300 uppercase font-bold block">
                  To‘lov turi:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('CASH')}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer font-bold ${
                      posPaymentMethod === 'CASH'
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-[#071326] border-[#1E3A6D] text-sky-300'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Naqd pul</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('CARD')}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer font-bold ${
                      posPaymentMethod === 'CARD'
                        ? 'bg-[#132C54] border-[#FFB800] text-[#FFB800]'
                        : 'bg-[#071326] border-[#1E3A6D] text-sky-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Karta / Terminal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('PAYME_CLICK')}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer font-bold ${
                      posPaymentMethod === 'PAYME_CLICK'
                        ? 'bg-[#132C54] border-cyan-400 text-cyan-300'
                        : 'bg-[#071326] border-[#1E3A6D] text-sky-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Payme / Click</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('B2B')}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer font-bold ${
                      posPaymentMethod === 'B2B'
                        ? 'bg-[#132C54] border-purple-400 text-purple-300'
                        : 'bg-[#071326] border-[#1E3A6D] text-sky-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>B2B Nasiya</span>
                  </button>
                </div>
              </div>

              {/* Cash given & Change calculator */}
              {posPaymentMethod === 'CASH' && (
                <div className="p-3 rounded-xl bg-[#071326] border border-[#1E3A6D] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-sky-300">Qabul qilingan naqd:</span>
                    <input
                      type="number"
                      placeholder={posGrandTotal.toString()}
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value ? Number(e.target.value) : '')}
                      className="w-32 h-8 px-2 rounded-lg bg-[#0A1931] border border-[#1E3A6D] text-right font-black text-white"
                    />
                  </div>
                  {typeof cashGiven === 'number' && cashGiven >= posGrandTotal && (
                    <div className="flex items-center justify-between text-emerald-400 font-black pt-1 border-t border-[#1E3A6D]">
                      <span>Qaytim (Change):</span>
                      <span>{cashChange.toLocaleString()} so‘m</span>
                    </div>
                  )}
                </div>
              )}

              {/* Calculation Summary */}
              <div className="space-y-1.5 pt-2 border-t border-[#1E3A6D] text-xs">
                <div className="flex justify-between text-sky-300">
                  <span>Oraliq summa:</span>
                  <span>{posSubtotal.toLocaleString()} so‘m</span>
                </div>
                {posDiscountAmount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Chegirma ({posDiscountPercent}%):</span>
                    <span>-{posDiscountAmount.toLocaleString()} so‘m</span>
                  </div>
                )}
                <div className="flex justify-between text-sky-400 text-[10px]">
                  <span>Shu jumladan 12% QQS:</span>
                  <span>{posTaxAmount.toLocaleString()} so‘m</span>
                </div>
                <div className="flex justify-between text-white font-black text-base pt-2 border-t border-[#1E3A6D]">
                  <span>To‘lov summasi:</span>
                  <span className="text-[#FFB800]">{posGrandTotal.toLocaleString()} so‘m</span>
                </div>
              </div>

              {/* Complete sale button */}
              <button
                type="button"
                onClick={handleCompletePosSale}
                className="w-full btn-industrial-yellow py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg select-none"
              >
                <Printer className="w-4 h-4" />
                <span>Savdoni Yakunlash &amp; Chek Chiqarish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: B2B ZAVODLAR VA ULARGA ULUG'RJI BUYURTMA BERISH
          ===================================================================== */}
      {activeTab === 'b2b' && (
        <div className="space-y-6">
          {/* Header notice */}
          <div className="industrial-card rounded-2xl p-5 bg-[#0A1931] border border-[#1E3A6D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Factory className="w-4 h-4 text-[#FFB800]" />
                <span className="text-xs font-mono font-bold text-[#FFB800] uppercase">
                  B2B To‘g‘ridan-to‘g‘ri Zavod Xaridlari
                </span>
              </div>
              <h2 className="text-lg font-heading font-black text-white">
                O‘zbekiston Ishlab Chiqaruvchi Zavodlari Vitrinasi
              </h2>
              <p className="text-xs text-sky-200/80 max-w-xl">
                O‘zmetkombinat, Qizilqumsement, Knauf va boshqa yirik zavodlardan to‘g‘ridan-to‘g‘ri
                vagon va fura partiyalarida xarid qiling. Bank to‘lov topshiriqnomasi va shartnoma bilan.
              </p>
            </div>

            <div className="text-right font-mono text-xs shrink-0">
              <span className="text-purple-400 font-bold block">{b2bOrders.length} ta B2B buyurtma</span>
              <span className="text-[10px] text-sky-400">100% rasmiy invoys</span>
            </div>
          </div>

          {/* Manufacturers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {B2B_MANUFACTURERS_LIST.map((mfg) => (
              <div
                key={mfg.id}
                className="industrial-card rounded-2xl p-5 bg-[#0A1931] border border-[#1E3A6D] hover:border-[#FFB800] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#071326] border border-[#1E3A6D]">
                    <img src={mfg.imageUrl} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#071326]/90 text-[#FFB800] border border-[#1E3A6D] text-[10px] font-mono font-bold">
                      {mfg.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-black text-white text-base leading-snug">
                      {mfg.name}
                    </h3>
                    <p className="text-[11px] font-mono text-sky-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>{mfg.location}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#071326] border border-[#1E3A6D] space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-sky-400">Asosiy tovar:</span>
                      <span className="text-white font-bold truncate max-w-[150px]">
                        {mfg.featuredProduct}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sky-400">Zavod narxi:</span>
                      <span className="text-[#FFB800] font-black">
                        {mfg.unitPrice.toLocaleString()} so‘m / {mfg.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-sky-400">Min. partiya:</span>
                      <span className="text-emerald-400 font-bold">
                        {mfg.minOrderTons} {mfg.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenB2bModal(mfg)}
                  className="w-full btn-industrial-yellow py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ulgurji Buyurtma &amp; Shartnoma</span>
                </button>
              </div>
            ))}
          </div>

          {/* B2B Buyurtmalarim Ro'yxati */}
          <div className="industrial-card rounded-2xl p-5 bg-[#0A1931] border border-[#1E3A6D] space-y-4">
            <h3 className="font-heading font-black text-white text-base">
              B2B Buyurtmalarim &amp; Invoyslar
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#071326] text-sky-300 border-b border-[#1E3A6D] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Invoys #</th>
                    <th className="p-3">Ishlab Chiqaruvchi</th>
                    <th className="p-3">Mahsulot</th>
                    <th className="p-3">Jami Summa</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Rekvizitlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A6D]">
                  {b2bOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#0F2547]/50">
                      <td className="p-3 font-bold text-[#FFB800]">{ord.orderNumber}</td>
                      <td className="p-3 text-white font-bold">{ord.manufacturerName}</td>
                      <td className="p-3 text-sky-200">{ord.productName}</td>
                      <td className="p-3 font-black text-[#FFB800]">
                        {ord.totalAmount.toLocaleString()} so‘m
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === 'YETKAZILDI'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                              : 'bg-[#132C54] text-[#FFB800] border border-[#FFB800]/40'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-[11px] text-sky-300">
                        STIR: {ord.bankRequisites.stir}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: MOLIYAVIY KIRIM-CHIQIM (Income / Expense / Net Profit)
          ===================================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Jami Tushum / Kirim */}
            <div className="brushed-steel rounded-2xl p-5 border border-[#1E3A6D] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                <span>Jami Kirim (Tushum)</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono-numbers">
                +{totalIncome.toLocaleString()} so‘m
              </div>
              <div className="text-[10px] font-mono text-sky-300">
                Online: {onlineIncome.toLocaleString()} • POS: {offlineIncome.toLocaleString()}
              </div>
            </div>

            {/* 2. Jami Chiqim / Xarajatlar */}
            <div className="brushed-steel rounded-2xl p-5 border border-[#1E3A6D] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                <span>Jami Chiqim (Xarajatlar)</span>
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-black text-red-400 font-mono-numbers">
                -{totalExpense.toLocaleString()} so‘m
              </div>
              <div className="text-[10px] font-mono text-sky-300">
                Ijara, ish haqi, transport &amp; soliqlar
              </div>
            </div>

            {/* 3. Sof Foyda (Net Profit) */}
            <div className="brushed-steel rounded-2xl p-5 border-2 border-[#FFB800]/50 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono text-[#FFB800] font-bold">
                <span>Sof Foyda (Net Profit)</span>
                <Coins className="w-4 h-4 text-[#FFB800]" />
              </div>
              <div className="text-2xl font-black text-[#FFB800] font-mono-numbers">
                {netProfit.toLocaleString()} so‘m
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold">
                Marja rentabelligi: {profitMarginPercent}%
              </div>
            </div>

            {/* 4. Savdo Ulushi */}
            <div className="brushed-steel rounded-2xl p-5 border border-[#1E3A6D] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                <span>Kanal Ulushi (Online / POS)</span>
                <Percent className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-black text-white font-mono-numbers">
                {totalIncome > 0 ? Math.round((onlineIncome / totalIncome) * 100) : 0}% /{' '}
                {totalIncome > 0 ? Math.round((offlineIncome / totalIncome) * 100) : 0}%
              </div>
              <div className="text-[10px] font-mono text-sky-300">
                Marketplace vs Do‘kon Kassa
              </div>
            </div>
          </div>

          {/* Operations Ledger & Add Expense Button */}
          <div className="industrial-card rounded-2xl p-5 bg-[#0A1931] border border-[#1E3A6D] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-black text-white text-base">
                  Moliyaviy Kirim-Chiqim Jurnali
                </h3>
                <span className="text-xs font-mono text-sky-400">
                  Barcha kassa va marketplace tranzaksiyalari
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(true)}
                className="btn-industrial-dark px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4 text-[#FFB800]" />
                <span>+ Yangi Chiqim / Xarajat Kiritish</span>
              </button>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#071326] text-sky-300 border-b border-[#1E3A6D] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Sana</th>
                    <th className="p-3">Turi</th>
                    <th className="p-3">Kategoriya</th>
                    <th className="p-3">To‘lov vositasi</th>
                    <th className="p-3">Izoh</th>
                    <th className="p-3 text-right">Summa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A6D]">
                  {financialOperations.map((op) => (
                    <tr key={op.id} className="hover:bg-[#0F2547]/50">
                      <td className="p-3 text-sky-300">{op.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            op.type === 'INCOME'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                              : 'bg-red-950/80 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {op.type === 'INCOME' ? 'KIRIM (+)' : 'CHIQIM (-)'}
                        </span>
                      </td>
                      <td className="p-3 text-white font-bold">{op.category}</td>
                      <td className="p-3 text-sky-200">{op.paymentMethod}</td>
                      <td className="p-3 text-sky-400 text-[11px]">{op.notes}</td>
                      <td
                        className={`p-3 text-right font-black text-sm ${
                          op.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {op.type === 'INCOME' ? '+' : '-'}
                        {op.amount.toLocaleString()} so‘m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: MARKETPLACE BUYURTMALARI
          ===================================================================== */}
      {activeTab === 'orders' && (
        <div className="industrial-card rounded-2xl p-5 bg-[#0A1931] border border-[#1E3A6D] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E3A6D]">
            <h3 className="font-heading font-black text-white text-base">
              Marketplace Xaridlari va Yetkazib Berish
            </h3>
            <span className="text-xs font-mono text-sky-400">
              {orders.length} ta faol buyurtma
            </span>
          </div>

          {loadingOrders ? (
            <div className="py-12 text-center text-sky-400 text-xs font-mono">
              Buyurtmalar yuklanmoqda...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-sky-400/70 text-xs font-mono">
              Hozircha yangi buyurtmalar mavjud emas.
            </div>
          ) : (
            <div className="divide-y divide-[#1E3A6D]">
              {orders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[#FFB800] font-bold">#{ord.orderNumber}</span>
                    <p className="text-white font-bold text-sm mt-0.5">
                      {(ord as any).customerName || (ord as any).buyerCompanyName || 'Mijoz'} • {Number(ord.totalAmount).toLocaleString()} so‘m
                    </p>
                    <span className="text-[10px] text-sky-400">
                      {typeof ord.deliveryAddress === 'string'
                        ? ord.deliveryAddress
                        : `${ord.deliveryAddress?.region || ''}, ${ord.deliveryAddress?.district || ''}`}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#132C54] text-[#FFB800] border border-[#254B85] text-xs font-bold">
                    {ord.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 7: 50/50 ESCROW & PAYOUT LEDGER
          ===================================================================== */}
      {activeTab === 'escrow' && (
        <div className="industrial-card rounded-2xl p-5 bg-[#0A1931] border border-[#1E3A6D] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E3A6D]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FFB800]" />
              <h3 className="font-heading font-black text-white text-base">
                50/50 Escrow Mablag‘lari va To‘lov Reestri
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40">
              BunkerStroy Escrow Himoyasi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#071326] text-sky-300 border-b border-[#1E3A6D] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Dalolatnoma #</th>
                  <th className="p-3">Xaridor (STIR)</th>
                  <th className="p-3">Tovar Tavsifi</th>
                  <th className="p-3">Brutto Summa</th>
                  <th className="p-3">Komissiya</th>
                  <th className="p-3">Netto To‘lov</th>
                  <th className="p-3">Holati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A6D]">
                {escrowLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-[#0F2547]/50">
                    <td className="p-3 font-bold text-[#FFB800]">{row.actNumber}</td>
                    <td className="p-3 text-white">
                      <div>{row.buyerName}</div>
                      <div className="text-[10px] text-sky-400">STIR: {row.buyerStir}</div>
                    </td>
                    <td className="p-3 text-sky-200">{row.itemSummary}</td>
                    <td className="p-3 text-white font-bold">
                      {row.grossAmount.toLocaleString()} so‘m
                    </td>
                    <td className="p-3 text-red-400 font-bold">
                      -{row.platformFee.toLocaleString()} so‘m
                    </td>
                    <td className="p-3 text-emerald-400 font-black">
                      {row.netAmount.toLocaleString()} so‘m
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: THERMAL POS KASSA CHEKI (Printable / Real Receipt)
          ===================================================================== */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071326]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 p-6 shadow-2xl space-y-4 font-mono text-xs border-2 border-slate-300">
            {/* Receipt Header */}
            <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-slate-400">
              <h2 className="font-black text-base text-slate-950 tracking-wider">
                BUNKERSTROY
              </h2>
              <p className="text-[10px] text-slate-600">
                SANOAT VA QURILISH MATERIALLARI MARKAZI
              </p>
              <p className="text-[10px] text-slate-600">
                Do‘kon: BunkerStroy Hamkor #1 • STIR: 309112844
              </p>
              <div className="text-[10px] font-bold pt-1 text-slate-800">
                CHEK RAQAMI: {activeReceipt.receiptNumber}
              </div>
              <div className="text-[10px] text-slate-500">{activeReceipt.date}</div>
            </div>

            {/* Items */}
            <div className="space-y-1.5 py-1 divide-y divide-dashed divide-slate-200">
              {activeReceipt.items.map((it, idx) => (
                <div key={idx} className="pt-1.5 flex justify-between items-start text-[11px]">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold block truncate max-w-[180px]">{it.title}</span>
                    <span className="text-[10px] text-slate-500">
                      {it.quantity} x {it.price.toLocaleString()} so‘m
                    </span>
                  </div>
                  <span className="font-black shrink-0">
                    {(it.price * it.quantity).toLocaleString()} so‘m
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-2 border-t-2 border-dashed border-slate-400 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Oraliq summa:</span>
                <span>{activeReceipt.subtotal.toLocaleString()} so‘m</span>
              </div>
              {activeReceipt.discountAmount > 0 && (
                <div className="flex justify-between text-red-600 font-bold">
                  <span>Chegirma:</span>
                  <span>-{activeReceipt.discountAmount.toLocaleString()} so‘m</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 text-[10px]">
                <span>Shu jumladan 12% QQS:</span>
                <span>{activeReceipt.taxAmount.toLocaleString()} so‘m</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
                <span>JAMI TO‘LOV:</span>
                <span>{activeReceipt.grandTotal.toLocaleString()} so‘m</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-700 pt-0.5">
                <span>To‘lov usuli:</span>
                <span className="font-bold">{activeReceipt.paymentMethod}</span>
              </div>
              {typeof activeReceipt.cashGiven === 'number' && (
                <>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Qabul qilindi:</span>
                    <span>{activeReceipt.cashGiven.toLocaleString()} so‘m</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-700 font-black">
                    <span>Qaytim:</span>
                    <span>{(activeReceipt.cashChange || 0).toLocaleString()} so‘m</span>
                  </div>
                </>
              )}
            </div>

            {/* QR Simulation & Footer */}
            <div className="text-center pt-2 border-t-2 border-dashed border-slate-400 space-y-1">
              <div className="w-16 h-16 bg-slate-100 border border-slate-300 mx-auto flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <p className="text-[9px] text-slate-500">
                SOLIQ QO‘MITASI FISKAL CHEKI (SIMULATSIYA)
              </p>
              <p className="text-[10px] font-bold text-slate-800">
                Xaridingiz uchun rahmat!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Chop etish</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: B2B WHOLESALE ORDER MODAL (Bank Requisites & Contract)
          ===================================================================== */}
      {isB2bModalOpen && selectedManufacturer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071326]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0A1931] text-white p-6 shadow-2xl border-2 border-[#1E3A6D] space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A6D]">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-[#FFB800]" />
                <h3 className="font-heading font-black text-white text-base">
                  Zavoddan Ulgurji Xarid (B2B Shartnoma)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsB2bModalOpen(false)}
                className="text-sky-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#071326] border border-[#1E3A6D] space-y-1">
                <span className="text-[10px] text-sky-400 uppercase font-bold">Ishlab chiqaruvchi:</span>
                <p className="font-black text-white text-sm">{selectedManufacturer.name}</p>
                <p className="text-[11px] text-sky-300">{selectedManufacturer.featuredProduct}</p>
              </div>

              {/* Quantity selector */}
              <div className="space-y-1">
                <label className="text-sky-300 font-bold block">
                  Buyurtma hajmi ({selectedManufacturer.unit}):
                </label>
                <input
                  type="number"
                  min={selectedManufacturer.minOrderTons}
                  value={b2bQuantity}
                  onChange={(e) => setB2bQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] text-white font-bold"
                />
                <span className="text-[10px] text-sky-400">
                  Minimal partiya: {selectedManufacturer.minOrderTons} {selectedManufacturer.unit}
                </span>
              </div>

              {/* Incoterm */}
              <div className="space-y-1">
                <label className="text-sky-300 font-bold block">Yetkazib berish sharti:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setB2bIncoterm('DAP')}
                    className={`p-2 rounded-xl border text-center font-bold cursor-pointer ${
                      b2bIncoterm === 'DAP'
                        ? 'bg-[#132C54] border-[#FFB800] text-white'
                        : 'bg-[#071326] border-[#1E3A6D] text-sky-300'
                    }`}
                  >
                    DAP (Manzilga fura/vagon)
                  </button>
                  <button
                    type="button"
                    onClick={() => setB2bIncoterm('EXW')}
                    className={`p-2 rounded-xl border text-center font-bold cursor-pointer ${
                      b2bIncoterm === 'EXW'
                        ? 'bg-[#132C54] border-[#FFB800] text-white'
                        : 'bg-[#071326] border-[#1E3A6D] text-sky-300'
                    }`}
                  >
                    EXW (Zavoddan olib ketish)
                  </button>
                </div>
              </div>

              {/* Bank Requisites of Manufacturer */}
              <div className="p-3.5 rounded-xl bg-[#071326] border border-[#1E3A6D] space-y-1.5 text-[11px]">
                <span className="text-[#FFB800] font-bold uppercase block text-[10px]">
                  Zavod Bank Rekvizitlari (To‘lov uchun):
                </span>
                <div className="flex justify-between text-sky-300">
                  <span>H/R (Hisob raqam):</span>
                  <span className="text-white font-bold">{selectedManufacturer.accountNumber}</span>
                </div>
                <div className="flex justify-between text-sky-300">
                  <span>MFO:</span>
                  <span className="text-white font-bold">{selectedManufacturer.mfo}</span>
                </div>
                <div className="flex justify-between text-sky-300">
                  <span>STIR:</span>
                  <span className="text-white font-bold">{selectedManufacturer.stir}</span>
                </div>
                <div className="flex justify-between text-sky-300">
                  <span>Bank:</span>
                  <span className="text-white font-bold">{selectedManufacturer.bankName}</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-3 rounded-xl bg-[#071326] border-2 border-[#FFB800]/50 flex items-center justify-between">
                <span className="text-sky-300">Jami shartnoma qiymati:</span>
                <span className="text-base font-black text-[#FFB800]">
                  {(b2bQuantity * selectedManufacturer.unitPrice).toLocaleString()} so‘m
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmB2bWholesaleOrder}
                className="flex-1 btn-industrial-yellow py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Buyurtmani Tasdiqlash &amp; Invoys Shakllantirish</span>
              </button>
              <button
                type="button"
                onClick={() => setIsB2bModalOpen(false)}
                className="py-3 px-4 rounded-xl bg-[#071326] border border-[#1E3A6D] text-sky-300 hover:text-white cursor-pointer"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: YANGI XARAJAT / CHIQIM KIRITISH
          ===================================================================== */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071326]/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddExpense}
            className="w-full max-w-md rounded-2xl bg-[#0A1931] text-white p-6 shadow-2xl border-2 border-[#1E3A6D] space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A6D]">
              <h3 className="font-heading font-black text-white text-base">
                + Yangi Chiqim / Xarajat Kiritish
              </h3>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-sky-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sky-300 font-bold block">Xarajat Kategoriyasi *</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] text-white"
                >
                  <option value="Ombor Arendasi">Ombor / Do‘kon Ijarasi</option>
                  <option value="Ishchilar Maoshi">Ishchilar va Haydovchilar Maoshi</option>
                  <option value="Logistika va Yoqilg‘i">Logistika, Yuk tashish &amp; Benzin</option>
                  <option value="Kommunal To‘lovlar">Kommunal, Elektr &amp; Internet</option>
                  <option value="Soliqlar va Litsenziya">Soliqlar va Davlat to‘lovlari</option>
                  <option value="Xom-ashyo Xaridi">Xom-ashyo &amp; Tovar xaridi</option>
                  <option value="Boshqa Xarajatlar">Boshqa operatsion chiqimlar</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sky-300 font-bold block">Summa (so‘m) *</label>
                <input
                  type="number"
                  required
                  placeholder="Masalan: 3500000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] text-red-400 font-black text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sky-300 font-bold block">To‘lov vositasi</label>
                <select
                  value={expensePaymentMethod}
                  onChange={(e) => setExpensePaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] text-white"
                >
                  <option value="Bank o‘tkazmasi">Bank o‘tkazmasi (H/R)</option>
                  <option value="Korporativ Karta">Korporativ Karta</option>
                  <option value="Naqd pul">Naqd pul (Kassadan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sky-300 font-bold block">Izoh / Maqsad</label>
                <input
                  type="text"
                  placeholder="Xarajat bo‘yicha qo‘shimcha izoh..."
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 btn-industrial-yellow py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-md"
              >
                Saqlash
              </button>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-[#071326] border border-[#1E3A6D] text-sky-300 hover:text-white cursor-pointer"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
