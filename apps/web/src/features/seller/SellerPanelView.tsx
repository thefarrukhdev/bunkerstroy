import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import { Product, Order, OrderStatus } from '@bunkerstroy/types';
import {
  Button,
  Badge,
  Card,
  Input,
  Select,
  Alert,
  Skeleton
} from '@bunkerstroy/ui';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  productsCount?: number;
}

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Sement (Qop)', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800' },
  { label: 'Armatura & Metall', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800' },
  { label: 'G‘isht & Blok', url: 'https://images.unsplash.com/photo-1584463699042-4946654b4260?w=800' },
  { label: 'Izolyatsiya Plitasi', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800' },
  { label: 'Bo‘yoq & Lak', url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800' },
  { label: 'Santexnika & Quvur', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800' },
];

export const SellerPanelView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'create' | 'inventory' | 'orders'>('inventory');

  // Categories & Products state
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Notifications & Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Product Form state
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [unit, setUnit] = useState('dona');
  const [stock, setStock] = useState<number | ''>('');
  const [minOrder, setMinOrder] = useState<number | ''>(1);
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGE_PRESETS[0].url);
  const [region, setRegion] = useState('Toshkent shahri');
  const [district, setDistrict] = useState('Chilonzor tumani');
  const [hasDelivery, setHasDelivery] = useState(true);
  const [description, setDescription] = useState('');

  // Editing state for inventory items
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Status updating for orders
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
  };

  const getAuthHeaders = (): Record<string, string> => {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // 1. Load Categories
  useEffect(() => {
    fetchCategories();
  }, []);

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
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  };

  // 2. Load Products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const headers = getAuthHeaders();
      // Try to fetch seller's own products
      const res = await fetch('/api/catalog/my-products', { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
          return;
        }
      }
      // Fallback to catalog products
      const fallbackRes = await fetch('/api/catalog/products?limit=50');
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && Array.isArray(fallbackJson.data)) {
        setProducts(fallbackJson.data);
      }
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  // 3. Load Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const headers = getAuthHeaders();
      const res = await fetch('/api/orders', { headers });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  // Handle Create Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'Iltimos, mahsulot nomini kiriting' });
      return;
    }
    if (!price || Number(price) <= 0) {
      setFeedback({ type: 'error', message: 'Iltimos, to‘g‘ri mahsulot narxini kiriting' });
      return;
    }
    if (stock === '' || Number(stock) < 0) {
      setFeedback({ type: 'error', message: 'Iltimos, ombordagi mavjud miqdorni kiriting' });
      return;
    }

    setFormSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        title: title.trim(),
        categoryId: categoryId || (categories[0]?.id || 'cat-sement'),
        price: Number(price),
        unit,
        stock: Number(stock),
        minOrder: Number(minOrder) || 1,
        description: description.trim() || `${title} - O‘zbekistondagi zavoddan to‘g‘ridan-to‘g‘ri yetkazib beriladi.`,
        images: imageUrl ? [imageUrl] : [SAMPLE_IMAGE_PRESETS[0].url],
        region,
        district,
        hasDelivery,
      };

      const res = await fetch('/api/catalog/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setFeedback({
          type: 'success',
          message: `"${json.data?.title || title}" muvaffaqiyatli qo‘shildi va vitrinada e’lon qilindi!`
        });
        // Reset form
        setTitle('');
        setPrice('');
        setStock('');
        setDescription('');
        // Refresh products and switch to inventory tab
        setTimeout(() => {
          setActiveTab('inventory');
          fetchProducts();
        }, 800);
      } else {
        setFeedback({
          type: 'error',
          message: json.message || 'Mahsulotni qo‘shishda xatolik yuz berdi'
        });
      }
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Server bilan aloqa uzildi. Qayta urinib ko‘ring.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Start inline editing
  const startEditing = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(Number(p.price));
    setEditStock(p.stock);
  };

  // Save inline edit
  const handleSaveEdit = async (productId: string) => {
    setActionLoadingId(productId);
    try {
      const res = await fetch(`/api/catalog/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          price: Number(editPrice),
          stock: Number(editStock),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === productId
              ? { ...item, price: Number(editPrice), stock: Number(editStock) }
              : item
          )
        );
        setEditingId(null);
        setFeedback({ type: 'success', message: 'Mahsulot ma’lumotlari muvaffaqiyatli yangilandi' });
      } else {
        setFeedback({ type: 'error', message: json.message || 'Yangilashda xatolik' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Server bilan aloqa uzildi' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string, productTitle: string) => {
    if (!window.confirm(`Haqiqatan ham "${productTitle}" mahsulotini o‘chirmoqchimisiz?`)) {
      return;
    }

    setActionLoadingId(productId);
    try {
      const res = await fetch(`/api/catalog/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setFeedback({ type: 'success', message: `"${productTitle}" o‘chirildi` });
      } else {
        setFeedback({ type: 'error', message: json.message || 'O‘chirishda xatolik yuz berdi' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Server bilan aloqa uzildi' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
        );
        setFeedback({ type: 'success', message: `Buyurtma holati "${nextStatus}" ga o‘zgartirildi` });
      } else {
        setFeedback({ type: 'error', message: json.message || 'Holatni yangilashda xatolik' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Server bilan aloqa uzildi' });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Metrics
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'CONFIRMED' || o.status === 'IN_TRANSIT' || o.status === 'PENDING'
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. Header Overview */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-bunker-amber-500 uppercase tracking-wider">
              Ishlab chiqaruvchi &amp; Do‘kon Paneli
            </span>
            <Badge variant="success" size="sm" isMono>
              UZUM REJIMIDA
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-bunker-text-primary">
            Sotuvchi Kabineti (Boshqaruv Markazi)
          </h1>
          <p className="text-xs sm:text-sm text-bunker-text-secondary mt-1 max-w-2xl">
            Mahsulotlaringizni erkin qo‘shing, ombordagi narx va qoldiqlarni tahrirlang hamda tushgan buyurtmalarni mijozlarga yetkazib berishga yuboring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant={activeTab === 'create' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('create')}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span>Yangi Tovar Qo‘shish</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (activeTab === 'inventory') fetchProducts();
              else if (activeTab === 'orders') fetchOrders();
            }}
          >
            <RotateCw className="w-4 h-4 mr-1.5" />
            <span>Yangilash</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 font-mono">
        <div className="bg-white border border-bunker-border-strong rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-bunker-text-muted uppercase">Mening Tovarlarim</div>
            <div className="text-xl sm:text-2xl font-extrabold text-bunker-text-primary mt-1">
              {products.length} ta
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Barcha toifalar bo‘yicha</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-bunker-amber-500">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-bunker-border-strong rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-bunker-text-muted uppercase">Ombordagi Umumiy Zaxira</div>
            <div className="text-xl sm:text-2xl font-extrabold text-bunker-text-primary mt-1">
              {totalStockUnits.toLocaleString()} dona
            </div>
            <div className="text-[10px] text-bunker-text-secondary mt-0.5">Sotuvga tayyor qoldiq</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-bunker-border-strong rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-bunker-text-muted uppercase">Tushgan Buyurtmalar</div>
            <div className="text-xl sm:text-2xl font-extrabold text-bunker-text-primary mt-1">
              {orders.length} ta
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5">
              {activeOrdersCount} tasi yetkazilmoqda / jarayonda
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <Alert
          variant={feedback.type === 'success' ? 'success' : 'error'}
          title={feedback.type === 'success' ? 'Muvaffaqiyatli' : 'Xatolik'}
          onDismiss={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-bunker-border-strong bg-white rounded-t-xl px-2 pt-2 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 font-mono text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'border-bunker-amber-500 text-bunker-amber-500'
              : 'border-transparent text-bunker-text-secondary hover:text-bunker-text-primary'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Mening Mahsulotlarim ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2.5 font-mono text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'create'
              ? 'border-bunker-amber-500 text-bunker-amber-500'
              : 'border-transparent text-bunker-text-secondary hover:text-bunker-text-primary'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Yangi Tovar Qo‘shish</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 font-mono text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-bunker-amber-500 text-bunker-amber-500'
              : 'border-transparent text-bunker-text-secondary hover:text-bunker-text-primary'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Tushgan Buyurtmalar ({orders.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: MENING MAHSULOTLARIM (INVENTORY LIST & INLINE EDITING)
          ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white border border-bunker-border-strong rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-bunker-text-primary uppercase tracking-wider font-mono">
                Sotuvdagi Mahsulotlar Zaxirasi
              </h2>
              <p className="text-xs text-bunker-text-secondary mt-0.5">
                Narxlarni va ombordagi sonini to‘g‘ridan-to‘g‘ri shu yerdan yangilashingiz mumkin.
              </p>
            </div>
            <Link
              to="/"
              className="text-xs font-mono font-bold text-bunker-amber-500 hover:underline flex items-center gap-1"
            >
              <span>Vitrinda ko‘rish</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-bunker-border-strong space-y-2">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="rect" height={40} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-bunker-border-strong rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 text-bunker-amber-500 mx-auto flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-bunker-text-primary">
                Hozircha hech qanday tovar mavjud emas
              </h3>
              <p className="text-xs text-bunker-text-secondary max-w-md mx-auto">
                Qurilish mollaringizni xaridorlarga taklif qilish uchun birinchi mahsulotingizni joylang.
              </p>
              <Button variant="primary" size="sm" onClick={() => setActiveTab('create')}>
                <PlusCircle className="w-4 h-4 mr-1.5" />
                <span>Birinchi Mahsulotni Qo‘shish</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {products.map((p) => {
                const isEditing = editingId === p.id;
                const isActionLoading = actionLoadingId === p.id;

                return (
                  <div
                    key={p.id}
                    className="bg-white border border-bunker-border-strong rounded-xl p-3.5 sm:p-4 shadow-xs transition-all hover:border-slate-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {/* Left: Image & Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <img
                          src={p.images?.[0] || SAMPLE_IMAGE_PRESETS[0].url}
                          alt={p.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-bunker-border-strong shrink-0 bg-slate-50"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {p.unit || 'dona'}
                            </span>
                            {p.stock > 0 ? (
                              <Badge variant="success" size="sm" isMono>
                                Sotuvda faol
                              </Badge>
                            ) : (
                              <Badge variant="danger" size="sm" isMono>
                                Zaxira tugagan
                              </Badge>
                            )}
                            {p.hasDelivery && (
                              <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                Yetkazish bor
                              </span>
                            )}
                          </div>

                          <h3 className="font-heading font-bold text-sm text-bunker-text-primary truncate">
                            {p.title}
                          </h3>

                          <div className="text-xs text-bunker-text-muted flex items-center gap-2 font-mono">
                            <span>{p.region || 'Toshkent shahri'}</span>
                            <span>•</span>
                            <span className="truncate">{p.supplierName || 'Do‘kon zaxirasi'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price, Stock & Actions */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-bunker-border-subtle">
                        {isEditing ? (
                          <div className="flex flex-wrap items-center gap-2 font-mono">
                            <div className="w-32">
                              <label className="text-[10px] text-bunker-text-muted block">Narx (so‘m):</label>
                              <Input
                                type="number"
                                sizeVariant="sm"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                              />
                            </div>
                            <div className="w-24">
                              <label className="text-[10px] text-bunker-text-muted block">Qoldiq:</label>
                              <Input
                                type="number"
                                sizeVariant="sm"
                                value={editStock}
                                onChange={(e) => setEditStock(Number(e.target.value))}
                              />
                            </div>
                            <div className="flex items-end gap-1 pt-4">
                              <Button
                                size="sm"
                                variant="primary"
                                isLoading={isActionLoading}
                                onClick={() => handleSaveEdit(p.id)}
                              >
                                <Save className="w-3.5 h-3.5 mr-1" />
                                <span>Saqlash</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 font-mono">
                            <div className="text-right">
                              <div className="text-xs sm:text-sm font-extrabold text-bunker-text-primary">
                                {Number(p.price).toLocaleString()} so‘m
                              </div>
                              <div className="text-[11px] text-bunker-text-secondary">
                                Qoldiq: <span className="font-bold text-slate-900">{p.stock}</span> {p.unit}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => startEditing(p)}
                                title="Narx va qoldiqni tahrirlash"
                              >
                                <Edit2 className="w-3.5 h-3.5 mr-1" />
                                <span className="hidden sm:inline">Tahrirlash</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-700 hover:bg-red-50 hover:border-red-300"
                                isLoading={isActionLoading}
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                title="O‘chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: YANGI MAHSULOT QO‘SHISH (ADD PRODUCT FORM)
          ========================================================================= */}
      {activeTab === 'create' && (
        <div className="bg-white border border-bunker-border-strong rounded-2xl p-4 sm:p-6 shadow-xs">
          <div className="border-b border-bunker-border-strong pb-4 mb-6">
            <h2 className="text-base font-heading font-extrabold text-bunker-text-primary">
              BunkerStroy Vitrinasiga Yangi Qurilish Mahsulotini Joylash
            </h2>
            <p className="text-xs text-bunker-text-secondary mt-1">
              Qurilish korxonalari va xususiy xaridorlar ushbu mahsulotni to‘g‘ridan-to‘g‘ri sizdan sotib olishadi.
            </p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-5">
            {/* 1. Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-bunker-text-primary mb-1">
                  Mahsulot Nomi *
                </label>
                <Input
                  placeholder="Masalan: Sement M500 D0 (Qoraqamish, 50kg)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <span className="text-[10px] text-bunker-text-muted mt-1 block">
                  Brend, markasi va o‘lchamini aniq yozing.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-bunker-text-primary mb-1">
                  Kategoriya *
                </label>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                <span className="text-[10px] text-bunker-text-muted mt-1 block">
                  Xaridor mahsulotni qidirayotganda ushbu toifada ko‘radi.
                </span>
              </div>
            </div>

            {/* 2. Price, Unit, Stock & MinOrder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div>
                <label className="block text-xs font-bold text-bunker-text-primary mb-1">
                  Narxi (so‘m) *
                </label>
                <Input
                  type="number"
                  placeholder="64000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-bunker-text-primary mb-1">
                  O‘lchov birligi *
                </label>
                <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="dona">dona (dona)</option>
                  <option value="qop (50kg)">qop (50kg)</option>
                  <option value="qop (25kg)">qop (25kg)</option>
                  <option value="tonna">tonna (ton)</option>
                  <option value="m²">m² (kvadrat metr)</option>
                  <option value="metr">metr (p.m)</option>
                  <option value="m³">m³ (kub metr)</option>
                  <option value="litr">litr (l)</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-bunker-text-primary mb-1">
                  Ombordagi zaxira soni *
                </label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={stock}
                  onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-bunker-text-primary mb-1">
                  Minimal buyurtma hajmi
                </label>
                <Input
                  type="number"
                  placeholder="1"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            {/* 3. Image URL & Quick Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-bunker-text-primary">
                Mahsulot Rasmi (URL havolasi)
              </label>
              <Input
                placeholder="https://example.com/rasm.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-mono text-bunker-text-muted">Tayyor shablon rasmlar:</span>
                {SAMPLE_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Region & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-bunker-text-primary mb-1">
                  Ombor / Ishlab chiqarish hududi
                </label>
                <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="Toshkent shahri">Toshkent shahri</option>
                  <option value="Toshkent viloyati">Toshkent viloyati</option>
                  <option value="Samarqand viloyati">Samarqand viloyati</option>
                  <option value="Farg‘ona viloyati">Farg‘ona viloyati</option>
                  <option value="Andijon viloyati">Andijon viloyati</option>
                  <option value="Namangan viloyati">Namangan viloyati</option>
                  <option value="Buxoro viloyati">Buxoro viloyati</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-bunker-text-primary mb-1">
                  Tuman / Manzil
                </label>
                <Input
                  placeholder="Masalan: Chilonzor tumani, Bunyodkor shox ko‘chasi"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
            </div>

            {/* 5. Delivery Checkbox */}
            <div className="bg-slate-50 border border-bunker-border-strong rounded-xl p-3.5 flex items-center gap-3">
              <input
                type="checkbox"
                id="hasDelivery"
                checked={hasDelivery}
                onChange={(e) => setHasDelivery(e.target.checked)}
                className="w-4 h-4 text-bunker-amber-500 rounded border-slate-300 focus:ring-bunker-amber-500"
              />
              <label htmlFor="hasDelivery" className="text-xs font-mono text-bunker-text-primary cursor-pointer select-none">
                <span className="font-bold">Yetkazib berish xizmati mavjud:</span> Xaridor manziliga yuk avtotransporti (HOWO / Gazel / Kuryer) orqali yetkazib beriladi.
              </label>
            </div>

            {/* 6. Description */}
            <div>
              <label className="block text-xs font-mono font-bold text-bunker-text-primary mb-1">
                Mahsulot Tavsifi va Xususiyatlari
              </label>
              <textarea
                rows={3}
                className="w-full text-xs font-mono p-3 rounded-xl border border-bunker-border-strong bg-white focus:outline-none focus:ring-2 focus:ring-bunker-amber-500 text-bunker-text-primary"
                placeholder="Mahsulotning texnik parametrlari, qo‘llanilishi, GOST yoki laboratoriya kafolati..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setActiveTab('inventory')}
              >
                Bekor qilish
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={formSubmitting}
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                <span>Vitrinda E’lon Qilish</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 3: TUSHGAN BUYURTMALAR (INCOMING BUYER ORDERS)
          ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white border border-bunker-border-strong rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-bunker-text-primary uppercase tracking-wider font-mono">
                Mijozlardan Tushgan Buyurtmalar
              </h2>
              <p className="text-xs text-bunker-text-secondary mt-0.5">
                Xaridorlar to‘g‘ridan-to‘g‘ri sizning mahsulotlaringizni xarid qilganda buyurtmalar shu yerda paydo bo‘ladi.
              </p>
            </div>
            <div className="font-mono text-xs text-bunker-text-muted">
              Jami: <span className="font-bold text-slate-900">{orders.length}</span> ta
            </div>
          </div>

          {loadingOrders ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-bunker-border-strong space-y-2">
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="rect" height={60} />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-bunker-border-strong rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-bunker-text-primary">
                Hozircha yangi buyurtmalar yo‘q
              </h3>
              <p className="text-xs text-bunker-text-secondary max-w-md mx-auto">
                Xaridorlar savatchaga mahsulot qo‘shib rasmiylashtirganda, sizga yetkazib berish xabarnomasi keladi.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => {
                const isUpdating = updatingOrderId === ord.id;

                return (
                  <div
                    key={ord.id}
                    className="bg-white border border-bunker-border-strong rounded-xl p-4 shadow-xs space-y-3 transition-all hover:border-slate-300"
                  >
                    {/* Header: Order Number, Date, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-bunker-border-subtle font-mono">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-bunker-text-primary">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-xs text-bunker-text-muted">
                          {new Date(ord.createdAt).toLocaleDateString('uz-UZ', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ord.status === 'PENDING' && (
                          <Badge variant="warning" size="sm" isMono>
                            KUTILMOQDA
                          </Badge>
                        )}
                        {ord.status === 'CONFIRMED' && (
                          <Badge variant="info" size="sm" isMono>
                            TASDIQLANDI
                          </Badge>
                        )}
                        {ord.status === 'IN_TRANSIT' && (
                          <Badge variant="warning" size="sm" isMono>
                            YO‘LDA (YETKAZILMOQDA)
                          </Badge>
                        )}
                        {ord.status === 'DELIVERED' && (
                          <Badge variant="success" size="sm" isMono>
                            YETKAZILDI
                          </Badge>
                        )}
                        {ord.status === 'CANCELLED' && (
                          <Badge variant="danger" size="sm" isMono>
                            BEKOR QILINDI
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Customer & Delivery Destination Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-bunker-border-subtle">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase text-bunker-text-muted">Buyurtmachi:</div>
                        <div className="font-bold text-bunker-text-primary">
                          {ord.buyerName || (ord as any).buyer?.displayName || 'Xaridor'}
                        </div>
                        <div className="flex items-center gap-1.5 text-bunker-text-secondary">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{ord.buyerPhone || (ord as any).buyer?.phone || '+998901234567'}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] uppercase text-bunker-text-muted">Yetkazib berish manzili:</div>
                        <div className="flex items-start gap-1.5 text-bunker-text-primary">
                          <MapPin className="w-3.5 h-3.5 text-bunker-amber-500 shrink-0 mt-0.5" />
                          <span>
                            {ord.deliveryAddress?.region || (ord as any).deliveryRegion || 'Toshkent shahri'},{' '}
                            {ord.deliveryAddress?.district || (ord as any).deliveryDistrict || ''}
                            {ord.deliveryAddress?.street ? `, ${ord.deliveryAddress.street}` : (ord as any).deliveryStreet ? `, ${(ord as any).deliveryStreet}` : ''}
                          </span>
                        </div>
                        <div className="text-[10px] text-bunker-text-muted">
                          Transport: {ord.vehicleType || 'Standart Kuryer / Yuk mashinasi'}
                        </div>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="text-[10px] uppercase text-bunker-text-muted">Buyurtma qilingan tovarlar:</div>
                      <div className="divide-y divide-bunker-border-subtle">
                        {ord.items.map((it) => (
                          <div key={it.id} className="py-1.5 flex items-center justify-between">
                            <span className="text-bunker-text-primary font-medium truncate max-w-sm">
                              {it.productTitle || (it as any).product?.title || 'Qurilish materiali'}
                            </span>
                            <div className="text-right shrink-0">
                              <span className="text-bunker-text-muted mr-2">
                                {it.quantity} {it.unit} &times; {Number(it.unitPrice).toLocaleString()} so‘m
                              </span>
                              <span className="font-bold text-slate-900">
                                {Number(it.totalPrice).toLocaleString()} so‘m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status Control Buttons & Summary */}
                    <div className="pt-3 border-t border-bunker-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
                      <div className="text-xs">
                        <span className="text-bunker-text-muted">Jami to‘lov: </span>
                        <span className="font-extrabold text-sm text-bunker-text-primary">
                          {Number(ord.finalAmount || ord.totalAmount).toLocaleString()} so‘m
                        </span>
                        {Number(ord.deliveryFee) > 0 && (
                          <span className="text-[10px] text-emerald-800 ml-1.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            +{Number(ord.deliveryFee).toLocaleString()} so‘m yetkazish
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {ord.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="primary"
                            isLoading={isUpdating}
                            onClick={() => handleUpdateOrderStatus(ord.id, 'CONFIRMED')}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            <span>Qabul Qilish</span>
                          </Button>
                        )}

                        {ord.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            variant="primary"
                            className="bg-sky-600 hover:bg-sky-700 text-white"
                            isLoading={isUpdating}
                            onClick={() => handleUpdateOrderStatus(ord.id, 'IN_TRANSIT')}
                          >
                            <Truck className="w-3.5 h-3.5 mr-1" />
                            <span>Yo‘lga Chiqarish (Yetkazish)</span>
                          </Button>
                        )}

                        {ord.status === 'IN_TRANSIT' && (
                          <Button
                            size="sm"
                            variant="primary"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            isLoading={isUpdating}
                            onClick={() => handleUpdateOrderStatus(ord.id, 'DELIVERED')}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            <span>Yetkazildi deb belgilash</span>
                          </Button>
                        )}

                        {ord.status !== 'DELIVERED' && ord.status !== 'CANCELLED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-700 hover:bg-red-50 hover:border-red-300"
                            isLoading={isUpdating}
                            onClick={() => handleUpdateOrderStatus(ord.id, 'CANCELLED')}
                          >
                            <span>Bekor qilish</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
