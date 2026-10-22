import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Building2,
  Package,
  MapPin,
  Clock,
  PhoneCall,
  CheckCircle2,
  Plus,
  Minus,
  CreditCard,
  Zap
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import {
  Button,
  Badge,
  Skeleton
} from '@bunkerstroy/ui';

interface ProductDetailViewProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchProduct(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/catalog/products/${productId}`);
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setProduct(json.data);
        setQuantity(json.data.minOrder || 1);
      } else {
        setError(json.message || 'Mahsulot topilmadi');
      }
    } catch {
      setError('Serverga ulanishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton variant="rect" height={360} className="rounded-2xl" />
            <div className="flex gap-2">
              <Skeleton variant="rect" width={80} height={70} className="rounded-lg" />
              <Skeleton variant="rect" width={80} height={70} className="rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="80%" height={36} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rect" height={100} className="rounded-xl" />
            <Skeleton variant="rect" height={120} className="rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-16 bg-white border border-bunker-border-strong rounded-2xl p-8 space-y-4">
        <Badge variant="danger" size="md" className="mx-auto">
          Xatolik
        </Badge>
        <h2 className="text-xl font-bold text-bunker-text-primary">
          {error || 'Mahsulot mavjud emas yoki o‘chirilgan'}
        </h2>
        <p className="text-sm text-bunker-text-secondary">
          Iltimos, katalog ro‘yxatiga qaytib boshqa materialni tanlang.
        </p>
        <Button onClick={() => navigate('/')} variant="primary" className="mx-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Katalogga Qaytish
        </Button>
      </div>
    );
  }

  const basePrice = Number(product.price);
  const totalPrice = basePrice * quantity;
  const unitLabel = product.unit || 'dona';

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    // Open cart drawer or direct checkout
    const cartButton = document.querySelector('[data-cart-button="true"]') as HTMLElement | null;
    if (cartButton) {
      cartButton.click();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Breadcrumbs */}
      <nav className="flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono text-bunker-text-muted">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Link to="/" className="hover:text-bunker-amber-500 transition-colors shrink-0">
            Katalog
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-bunker-text-secondary uppercase shrink-0">
            {product.region || 'O‘zbekiston'}
          </span>
          <span className="shrink-0">/</span>
          <span className="text-bunker-text-primary font-bold truncate max-w-[140px] sm:max-w-xs">
            {product.title}
          </span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-bunker-text-secondary hover:text-bunker-amber-500 transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Katalogga qaytish</span>
        </button>
      </nav>

      {/* 2. Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Visuals & Images (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-bunker-border-strong shadow-xs group">
            <img
              src={
                product.images?.[selectedImageIdx] ||
                'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200'
              }
              alt={product.title}
              className="w-full h-80 sm:h-96 object-cover transition-transform duration-300 group-hover:scale-102"
            />

            {/* In stock badge */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-900 border border-slate-200 shadow-xs">
              Omborda: {product.stock.toLocaleString()} {unitLabel}
            </div>

            {/* Delivery badge */}
            {product.hasDelivery && (
              <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[11px] font-mono font-bold shadow-xs flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                Yetkazib berish bor
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIdx === idx
                      ? 'border-bunker-amber-500 ring-2 ring-orange-200'
                      : 'border-bunker-border-strong opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Verified Seller Card */}
          <div className="bg-slate-50 border border-bunker-border-strong rounded-xl p-4 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-bunker-border-subtle">
              <span className="text-bunker-text-muted uppercase text-[10px] font-bold">
                Sotuvchi / Ishlab chiqaruvchi:
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tasdiqlangan
              </span>
            </div>
            <p className="font-bold text-bunker-text-primary text-sm">
              {product.supplierName || 'Rasmiy Ta’minotchi'}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-bunker-text-secondary">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-bunker-amber-500 shrink-0" />
                <span className="truncate">{product.region || 'Toshkent shahri'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{product.warranty || 'Kafolat mavjud'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Quantity & Order Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Title & Price Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-bunker-amber-500 uppercase font-bold tracking-wider">
                Qurilish Materiali
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                12% QQS Kiritilgan
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-bunker-text-primary tracking-tight">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-bunker-text-secondary leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Pricing Box & Quantity Stepper */}
          <div className="bg-white border-2 border-bunker-border-strong rounded-2xl p-5 space-y-5 shadow-xs font-mono">
            {/* Price display */}
            <div>
              <span className="text-xs text-bunker-text-muted uppercase font-bold block">
                Birlik narxi:
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-bunker-text-primary mt-1">
                {basePrice.toLocaleString()}{' '}
                <span className="text-sm font-normal text-bunker-text-secondary">
                  so‘m / {unitLabel}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-bunker-border-subtle">
              <div>
                <label className="text-xs font-bold text-bunker-text-primary block">
                  Xarid miqdori:
                </label>
                <span className="text-[11px] text-bunker-text-muted">
                  Minimal buyurtma: {product.minOrder || 1} {unitLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(product.minOrder || 1, prev - 1))}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-bunker-border-strong flex items-center justify-center font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  min={product.minOrder || 1}
                  max={product.stock || 9999}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-9 text-center font-mono font-extrabold text-sm border-2 border-bunker-border-strong rounded-xl focus:border-bunker-amber-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-bunker-border-strong flex items-center justify-center font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total calculation line */}
            <div className="bg-slate-50 border border-bunker-border-subtle rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-bunker-text-muted">Jami hisoblangan summa:</span>
              <span className="text-lg font-extrabold text-bunker-amber-500">
                {totalPrice.toLocaleString()} so‘m
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                variant={addedNotice ? 'secondary' : 'primary'}
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 text-sm font-bold"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-5 h-5 text-bunker-status-green mr-2" />
                    <span>Savatga Qo‘shildi!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    <span>Savatga Qo‘shish</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleBuyNow}
                className="flex-1 text-sm font-bold border-bunker-border-strong hover:border-bunker-amber-500"
              >
                <Zap className="w-4 h-4 mr-2 text-bunker-amber-500" />
                <span>Hoziroq Sotib Olish</span>
              </Button>
            </div>
          </div>

          {/* Value Props & Logistics Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-white border border-bunker-border-strong rounded-xl p-3 flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-bunker-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-bunker-text-primary block">Yetkazib berish</span>
                <span className="text-[11px] text-bunker-text-secondary mt-0.5 block">
                  Manzilingizgacha yoki ombordan samovivoz
                </span>
              </div>
            </div>

            <div className="bg-white border border-bunker-border-strong rounded-xl p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-bunker-text-primary block">Sifat kafolati</span>
                <span className="text-[11px] text-bunker-text-secondary mt-0.5 block">
                  {product.warranty || 'Ishlab chiqaruvchi kafolati'}
                </span>
              </div>
            </div>

            <div className="bg-white border border-bunker-border-strong rounded-xl p-3 flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-bunker-text-primary block">Qulay to‘lov</span>
                <span className="text-[11px] text-bunker-text-secondary mt-0.5 block">
                  Naqd, karta yoki hisob-faktura
                </span>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="bg-white border border-bunker-border-strong rounded-2xl p-4 sm:p-5 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-sm text-bunker-text-primary uppercase tracking-wider pb-2 border-b border-bunker-border-subtle">
              Mahsulot Parametrlari
            </h3>

            <div className="divide-y divide-bunker-border-subtle">
              <div className="py-2 flex justify-between">
                <span className="text-bunker-text-muted">O‘lchov birligi:</span>
                <span className="font-bold text-bunker-text-primary">{unitLabel}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-bunker-text-muted">Hudud / Ombor joylashuvi:</span>
                <span className="font-bold text-bunker-text-primary">
                  {product.region || 'Toshkent shahri'}, {product.district || 'Ombor'}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-bunker-text-muted">Minimal xarid soni:</span>
                <span className="font-bold text-bunker-text-primary">
                  {product.minOrder || 1} {unitLabel}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-bunker-text-muted">Ombordagi zaxira:</span>
                <span className="font-bold text-slate-900">
                  {product.stock.toLocaleString()} {unitLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
