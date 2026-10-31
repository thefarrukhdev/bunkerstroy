import React, { useState, useEffect, useMemo } from 'react';
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
  Zap,
  Factory,
  Layers,
  Award,
  FileText
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import { Skeleton, Button, Badge } from '@bunkerstroy/ui';
import { COLOR_OPTIONS, ColorOption } from './MarketplaceView';
import { apiFetch } from '../../services/apiClient';

interface ProductDetailViewProps {
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenCart?: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ onAddToCart, onOpenCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Selected Variant state: Color and Size
  const [selectedColor, setSelectedColor] = useState<string>('kulrang');
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    fetchProduct(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/catalog/products/${productId}`);
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setProduct(json.data);
        setQuantity(json.data.minOrder || 1);
        if (json.data.variants && json.data.variants.length > 0) {
          const first = json.data.variants[0];
          if (first.color) setSelectedColor(first.color.toLowerCase());
          if (first.size) setSelectedSize(first.size);
        }
      } else {
        setError(json.message || 'Mahsulot topilmadi');
      }
    } catch {
      setError('Serverga ulanishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Base price calculation including wholesale tiered ladder
  const basePrice = useMemo(() => {
    if (!product) return 0;
    if (product.tieredPrices && product.tieredPrices.length > 0) {
      const match = product.tieredPrices.find(
        (tp) => quantity >= tp.minQty && (!tp.maxQty || quantity <= tp.maxQty)
      );
      if (match) return Number(match.price);
    }
    return Number(product.price);
  }, [product, quantity]);

  const totalPrice = basePrice * quantity;
  const advance50 = Math.round(totalPrice * 0.5);
  const balance50 = totalPrice - advance50;

  // Format unit
  const formatUnit = (unit?: string): string => {
    switch (unit) {
      case 'TON':
        return 'tonna';
      case 'SQ_METER':
        return 'm²';
      case 'BAG_50KG':
        return 'qop (50kg)';
      case 'BAG_25KG':
        return 'qop (25kg)';
      case 'PIECE':
        return 'dona';
      default:
        return unit?.toLowerCase() || 'dona';
    }
  };

  const unitLabel = formatUnit(product?.unit);

  // Available sizes derived from variants or product defaults
  const availableSizes = useMemo(() => {
    if (!product) return [];
    if (product.variants && product.variants.length > 0) {
      const sizes = Array.from(
        new Set(product.variants.map((v) => v.size).filter(Boolean))
      ) as string[];
      if (sizes.length > 0) return sizes;
    }
    // Default sensible sizes based on product unit
    if (product.unit === 'BAG_50KG') return ['50 kg (Standard)', '25 kg (Yarim qop)'];
    if (product.unit === 'TON') return ['1 tonna (Minimal)', '5 tonna', '20 tonna (Fura)'];
    if (product.unit === 'SQ_METER') return ['1 m²', '10 m²', '50 m²'];
    return ['Standart o‘lcham'];
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    onAddToCart(product, quantity);
    onOpenCart?.();
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto text-slate-900">
        <div className="h-6 w-48 bg-slate-100 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton variant="rect" height={360} className="rounded-2xl bg-slate-100" />
            <div className="flex gap-2">
              <Skeleton variant="rect" width={80} height={70} className="rounded-lg bg-slate-100" />
              <Skeleton variant="rect" width={80} height={70} className="rounded-lg bg-slate-100" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <Skeleton variant="text" width="30%" className="bg-slate-100" />
            <Skeleton variant="text" width="80%" height={36} className="bg-slate-100" />
            <Skeleton variant="text" width="60%" className="bg-slate-100" />
            <Skeleton variant="rect" height={100} className="rounded-xl bg-slate-100" />
            <Skeleton variant="rect" height={120} className="rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-16 rounded-2xl p-8 space-y-4 bg-white border border-slate-200 text-slate-900 shadow-2xs">
        <div className="inline-block px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg font-mono text-xs font-bold">
          Xatolik
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {error || 'Mahsulot topilmadi yoki o‘chirilgan'}
        </h2>
        <p className="text-sm text-slate-600">
          Iltimos, katalog ro‘yxatiga qaytib boshqa materialni tanlang.
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-[#D95D1E] hover:bg-[#B43B06] text-white px-5 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Katalogga Qaytish</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-900">
      {/* 1. Breadcrumbs */}
      <nav className="flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/catalog" className="hover:text-[#D95D1E] transition-colors shrink-0">
            Katalog
          </Link>
          <span className="shrink-0 text-slate-300">/</span>
          <span className="text-slate-600 uppercase shrink-0 font-medium">
            {product.region || 'O‘zbekiston'}
          </span>
          <span className="shrink-0 text-slate-300">/</span>
          <span className="text-slate-900 font-bold truncate max-w-[160px] sm:max-w-xs">
            {product.title}
          </span>
        </div>

        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-1.5 text-slate-600 hover:text-[#D95D1E] transition-colors cursor-pointer shrink-0 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Katalogga qaytish</span>
        </button>
      </nav>

      {/* 2. Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Visuals & Images (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-2xs group">
            <img
              src={
                product.images?.[selectedImageIdx] ||
                'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200'
              }
              alt={product.title}
              className="w-full h-80 sm:h-96 object-cover transition-transform duration-300 group-hover:scale-103"
            />

            {/* In stock badge */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-700 border border-slate-200 shadow-2xs">
              Omborda: <span className="text-[#D95D1E] font-black">{product.stock.toLocaleString()}</span> {unitLabel}
            </div>

            {/* 50/50 Escrow badge */}
            <div className="absolute top-3 left-3 bg-emerald-50/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-emerald-700 border border-emerald-200 shadow-2xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>50/50 Xavfsiz Escrow</span>
            </div>
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
                      ? 'border-[#D95D1E] ring-2 ring-[#D95D1E]/30'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Verified Seller & Factory Card */}
          <div className="rounded-2xl p-4 space-y-3 font-mono text-xs bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 uppercase text-[10px] font-bold">
                Ishlab chiqaruvchi &amp; Sotuvchi:
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Rasmiy Zavod
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-[#D95D1E] shrink-0" />
              <p className="font-bold text-slate-900 text-sm">
                {product.supplierName || 'O‘zbekiston Rasmiy Metallurgiya Zavodi'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D95D1E] shrink-0" />
                <span className="truncate">{product.region || 'Toshkent shahri'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{product.warranty || 'Kafolat: 12 oy'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Palette, Escrow & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Title & Price Header */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#D95D1E] uppercase font-bold tracking-wider">
                Sanoat Qurilish Materiali
              </span>
              <span className="text-slate-300">|</span>
              <Badge variant="success" size="sm">
                12% QQS Kiritilgan
              </Badge>
              <Badge variant="neutral" size="sm">
                O‘zDSt / GOST Sertifikatlangan
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Pricing Box & Configuration */}
          <div className="bg-white rounded-2xl p-5 space-y-5 border border-slate-200 shadow-2xs font-mono">
            {/* Price display */}
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold block">
                Zavod ulgurji narxi:
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#D95D1E] mt-1 font-mono-numbers">
                {basePrice.toLocaleString()}{' '}
                <span className="text-sm font-normal text-slate-600">
                  so‘m / {unitLabel}
                </span>
              </div>
            </div>

            {/* Wholesale Tiered Price Ladder */}
            {product.tieredPrices && product.tieredPrices.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-900 uppercase block">
                  Ulgurji Hajm Narxlari (Tiered ladder):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {product.tieredPrices.map((tp, idx) => {
                    const isActive = quantity >= tp.minQty && (!tp.maxQty || quantity <= tp.maxQty);
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isActive
                            ? 'bg-[#D95D1E] text-white border-[#D95D1E] font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="text-[10px] opacity-80">
                          {tp.minQty}{tp.maxQty ? ` - ${tp.maxQty}` : '+'} {unitLabel}
                        </div>
                        <div className="text-xs font-black">
                          {Number(tp.price).toLocaleString()} so‘m
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* COLOR_OPTIONS: Interactive Palette Selector */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Rangni tanlang (Color Palette):
                </span>
                <span className="text-xs font-mono text-[#D95D1E] font-bold">
                  {COLOR_OPTIONS.find((c) => c.id === selectedColor)?.label || 'Standart'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {COLOR_OPTIONS.map((col) => {
                  const isSelected = selectedColor === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColor(col.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border shadow-inner shrink-0"
                        style={{ backgroundColor: col.bg, borderColor: col.border }}
                      />
                      <span>{col.label.split('/')[0].trim()}</span>
                      {isSelected && <Check className="w-3 h-3 text-[#D95D1E]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* O'lchamlar (Sizes Selector) */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase block">
                O‘lcham / Fraksiya:
              </span>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sizeOption) => {
                  const isSelected = selectedSize === sizeOption || (!selectedSize && sizeOption === availableSizes[0]);
                  return (
                    <button
                      key={sizeOption}
                      type="button"
                      onClick={() => setSelectedSize(sizeOption)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {sizeOption}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-900 block">
                  Xarid Miqdori:
                </label>
                <span className="text-[11px] text-slate-500">
                  Minimal buyurtma: {product.minOrder || 1} {unitLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(product.minOrder || 1, prev - 1))}
                  className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  id="product-detail-qty"
                  name="quantity"
                  type="number"
                  aria-label="Mahsulot miqdori"
                  min={product.minOrder || 1}
                  max={product.stock || 9999}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 h-9 text-center font-mono font-black text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:border-[#D95D1E] focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 50/50 SPLIT ESCROW SHOWCASE BOX */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    50/50 Xavfsiz Escrow Tizimi
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  BunkerStroy Himoyasi
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-600 block font-bold">1-bosqich (50% Avans):</span>
                  <span className="text-sm font-black text-slate-900 font-mono-numbers">
                    {advance50.toLocaleString()} so‘m
                  </span>
                  <p className="text-[9px] text-slate-500 mt-1">
                    Buyurtma tasdiqlanganda Escrow hisobida xavfsiz bloklanadi.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-600 block font-bold">2-bosqich (50% Qoldiq):</span>
                  <span className="text-sm font-black text-[#D95D1E] font-mono-numbers">
                    {balance50.toLocaleString()} so‘m
                  </span>
                  <p className="text-[9px] text-slate-500 mt-1">
                    Mahsulot ob'ektda tekshirilib qabul qilingandan so‘ng to‘lanadi.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-200/60">
                <span className="text-slate-600 font-medium">Jami hisoblangan qiymat:</span>
                <span className="text-base sm:text-lg font-black text-[#D95D1E] font-mono-numbers">
                  {totalPrice.toLocaleString()} so‘m
                </span>
              </div>
            </div>

            {/* Action Buttons: Terracotta Primary & Dark Slate Secondary */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                leftIcon={addedNotice ? <Check className="w-5 h-5 stroke-[3]" /> : <ShoppingCart className="w-5 h-5" />}
              >
                {addedNotice ? 'Savatga Qo‘shildi!' : 'Savatga Qo‘shish'}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="flex-1 bg-slate-900 text-white hover:bg-slate-800 border-slate-900"
                onClick={handleBuyNow}
                leftIcon={<Zap className="w-4 h-4 text-orange-400" />}
              >
                Hozir Sotib Olish (50/50)
              </Button>
            </div>
          </div>

          {/* Value Props & Logistics Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
              <Truck className="w-4 h-4 text-[#D95D1E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Yetkazib berish</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Ob'ektgacha og‘ir yuk tashish
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Sifat Kafolati</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {product.warranty || 'Laboratoriya sertifikati bor'}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
              <CreditCard className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">B2B To‘lov</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Hisob-faktura, karta &amp; naqd
                </span>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 font-mono text-xs shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Texnik Parametrlar &amp; GOST Standartlari
            </h3>

            <div className="divide-y divide-slate-100">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">O‘lchov birligi:</span>
                <span className="font-bold text-slate-900">{unitLabel}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Ombor joylashuvi:</span>
                <span className="font-bold text-slate-900">
                  {product.region || 'Toshkent shahri'}, {product.district || 'Sanoat hududi'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Minimal xarid soni:</span>
                <span className="font-bold text-slate-900">
                  {product.minOrder || 1} {unitLabel}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Ombordagi zaxira:</span>
                <span className="font-black text-[#D95D1E]">
                  {product.stock.toLocaleString()} {unitLabel}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Sertifikat:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  O‘zDSt / GOST 34028
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
