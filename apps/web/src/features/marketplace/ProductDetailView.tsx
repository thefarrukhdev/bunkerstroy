import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ShoppingCart,
  FileSpreadsheet,
  Truck,
  ShieldCheck,
  Download,
  Building2,
  Package,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  FileCheck2,
  Plus,
  Minus
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import {
  Button,
  Badge,
  Card,
  Input,
  Alert,
  Skeleton,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tooltip,
  Modal
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
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  // RFQ form state
  const [rfqCompany, setRfqCompany] = useState('');
  const [rfqPhone, setRfqPhone] = useState('');
  const [rfqNote, setRfqNote] = useState('');

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
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton variant="rect" height={380} className="rounded-2xl" />
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
        <p className="text-sm text-bunker-text-muted">
          Iltimos, katalog ro‘yxatiga qaytib boshqa materialni tanlang.
        </p>
        <Button onClick={() => navigate('/')} variant="primary" className="mx-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Katalogga Qaytish
        </Button>
      </div>
    );
  }

  // Standards resolver
  const getGostStandard = (p: Product): { code: string; title: string } => {
    const text = (p.title + ' ' + p.description).toLowerCase();
    if (text.includes('sement')) {
      return { code: 'GOST 31108-2020', title: 'Umumiy qurilish sementlari. M-500 D0' };
    }
    if (text.includes('armatura')) {
      return { code: 'GOST 5781-82 / A500C', title: 'Issiq holda prokatlangan po‘lat armatura' };
    }
    if (text.includes('bazalt') || text.includes('izolyatsiya')) {
      return { code: 'GOST 9573-2012 / O‘zDSt 2826', title: 'Sintetik bog‘lovchidagi mineral tosh plitalar' };
    }
    if (text.includes('beton')) {
      return { code: 'GOST 7473-2010', title: 'Og‘ir va mayda donador beton qorishmalari' };
    }
    if (text.includes('g\'isht') || text.includes('gisht')) {
      return { code: 'GOST 530-2012', title: 'Oddiy va yuzbop keramik g‘ishtlar. M-150' };
    }
    return { code: 'GOST 30244-94 / ISO 9001', title: 'Davlat sanoat xavfsizligi standarti' };
  };

  const gost = getGostStandard(product);
  const basePrice = Number(product.price);

  // Volume pricing calculation
  const getDiscountPercent = (qty: number): number => {
    if (qty >= 50) return 10;
    if (qty >= 10) return 5;
    return 0;
  };

  const discountPct = getDiscountPercent(quantity);
  const effectiveUnitPrice = Math.round(basePrice * (1 - discountPct / 100));
  const totalPrice = effectiveUnitPrice * quantity;
  const qqsAmount = Math.round(totalPrice * 0.12);
  const savedAmount = (basePrice - effectiveUnitPrice) * quantity;

  // Logistics recommendation
  const getRecommendedTransport = (qty: number) => {
    if (qty >= 50) {
      return {
        name: 'TIR 35t Fura & Temir Yo‘l Vagoni',
        sub: 'To‘g‘ridan-to‘g‘ri zavod liniyasidan yuklash',
        icon: <Truck className="w-5 h-5 text-bunker-amber-500" />
      };
    }
    if (qty >= 10) {
      return {
        name: 'HOWO 25t Samosval',
        sub: 'Shahar va viloyatlar bo‘yicha tezkor yetkazish',
        icon: <Truck className="w-5 h-5 text-bunker-status-cyan" />
      };
    }
    return {
      name: 'Isuzu 10t Bortli Manipulyator',
      sub: 'Kichik va o‘rta partiyalar uchun kranli tushirish',
      icon: <Truck className="w-5 h-5 text-emerald-600" />
    };
  };

  const transport = getRecommendedTransport(quantity);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitted(true);
    setTimeout(() => {
      setIsRfqModalOpen(false);
      setRfqSubmitted(false);
    }, 2000);
  };

  const unitLabel = product.unit === 'TON' ? 'tonna' : product.unit === 'SQ_METER' ? 'm²' : 'dona';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Breadcrumbs & Back Navigation */}
      <nav className="flex items-center justify-between text-xs font-mono text-bunker-text-muted">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-bunker-amber-500 transition-colors">
            Katalog
          </Link>
          <span>/</span>
          <span className="text-bunker-text-secondary uppercase">{product.region || 'O‘zbekiston'}</span>
          <span>/</span>
          <span className="text-bunker-text-primary font-bold truncate max-w-xs">{product.title}</span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-bunker-text-secondary hover:text-bunker-amber-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Katalogga qaytish</span>
        </button>
      </nav>

      {/* 2. Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visuals & Compliance (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-bunker-border-strong shadow-xs group">
            <img
              src={
                product.images[selectedImageIdx] ||
                'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200'
              }
              alt={product.title}
              className="w-full h-80 sm:h-96 object-cover transition-transform duration-300 group-hover:scale-102"
            />

            {/* Overlaid Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-slate-900 border border-slate-200 shadow-xs">
                {gost.code}
              </span>
              {product.isEscoCertified && (
                <Badge variant="success" size="sm" isMono dot>
                  ESCO {product.energyEfficiencyRating}
                </Badge>
              )}
            </div>

            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-900 border border-slate-200 shadow-xs">
              Omborda: {product.stock.toLocaleString()} {unitLabel}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
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

          {/* Plant Verification Card */}
          <div className="bg-slate-50 border border-bunker-border-strong rounded-xl p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-bunker-border-subtle">
              <span className="text-bunker-text-muted uppercase text-[10px] font-bold">Ishlab Chiqaruvchi:</span>
              <Badge variant="neutral" size="sm" leftIcon={<Building2 className="w-3 h-3 text-bunker-amber-500" />}>
                Zavod Kafolatlangan
              </Badge>
            </div>
            <p className="font-bold text-bunker-text-primary text-sm">{product.supplierName}</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-bunker-text-secondary">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-bunker-amber-500 shrink-0" />
                <span className="truncate">{product.region || 'Toshkent'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{product.warranty || 'Kafolat 12 oy'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Specs & Order Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Title */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-bunker-amber-500 uppercase font-bold tracking-wider">
                {product.itemType === 'MATERIAL' ? 'Qurilish Materiali' : 'Muhandislik Tizimi'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                QQS 12% Kiritilgan
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-bunker-text-primary tracking-tight">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-bunker-text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Interactive Tiered Pricing Matrix */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-bunker-text-muted uppercase font-bold tracking-wider block">
              Hajm Bo‘yicha Ulgurji Narx Pog‘onalari:
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Tier 1 */}
              <div
                onClick={() => setQuantity(product.minOrder || 1)}
                className={`p-3 rounded-xl border text-center font-mono cursor-pointer transition-all ${
                  discountPct === 0
                    ? 'bg-amber-50/50 border-bunker-amber-500 ring-2 ring-orange-200 shadow-xs'
                    : 'bg-white border-bunker-border-strong hover:border-slate-400'
                }`}
              >
                <span className="text-[10px] text-bunker-text-muted block">1 - 9 {unitLabel}</span>
                <span className="text-sm font-extrabold text-bunker-text-primary block mt-0.5">
                  {basePrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-bunker-text-muted">so'm / {unitLabel}</span>
              </div>

              {/* Tier 2 */}
              <div
                onClick={() => setQuantity(15)}
                className={`p-3 rounded-xl border text-center font-mono cursor-pointer transition-all ${
                  discountPct === 5
                    ? 'bg-amber-50/50 border-bunker-amber-500 ring-2 ring-orange-200 shadow-xs'
                    : 'bg-white border-bunker-border-strong hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[10px] text-bunker-amber-500 font-bold">10 - 49 {unitLabel}</span>
                  <span className="text-[9px] bg-orange-100 text-orange-800 px-1 rounded font-bold">-5%</span>
                </div>
                <span className="text-sm font-extrabold text-bunker-amber-500 block mt-0.5">
                  {Math.round(basePrice * 0.95).toLocaleString()}
                </span>
                <span className="text-[10px] text-bunker-text-muted">so'm / {unitLabel}</span>
              </div>

              {/* Tier 3 */}
              <div
                onClick={() => setQuantity(50)}
                className={`p-3 rounded-xl border text-center font-mono cursor-pointer transition-all ${
                  discountPct === 10
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-200 shadow-xs'
                    : 'bg-white border-bunker-border-strong hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[10px] text-emerald-700 font-bold">50+ {unitLabel}</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">-10%</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-700 block mt-0.5">
                  {Math.round(basePrice * 0.90).toLocaleString()}
                </span>
                <span className="text-[10px] text-bunker-text-muted">so'm / {unitLabel}</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Box */}
          <div className="bg-white border-2 border-bunker-border-strong rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-bunker-border-subtle">
              <div>
                <label className="text-xs font-mono font-bold text-bunker-text-primary uppercase tracking-wider block">
                  Xarid Hajmi ({unitLabel}):
                </label>
                <span className="text-[11px] text-bunker-text-muted font-mono">
                  Minimal partiya: {product.minOrder || 1} {unitLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(product.minOrder || 1, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-bunker-border-strong flex items-center justify-center font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  min={product.minOrder || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 h-10 text-center font-mono font-extrabold text-base border-2 border-bunker-border-strong rounded-xl focus:border-bunker-amber-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-bunker-border-strong flex items-center justify-center font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <div className="hidden sm:flex items-center gap-1 pl-1">
                  {[+5, +10, +25].map((addVal) => (
                    <button
                      key={addVal}
                      type="button"
                      onClick={() => setQuantity((prev) => prev + addVal)}
                      className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-bunker-border-strong text-[11px] font-mono font-bold text-slate-700 cursor-pointer"
                    >
                      +{addVal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculations Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
              <div>
                <span className="text-bunker-text-muted text-[10px] block uppercase">Birlik Narxi:</span>
                <span className="font-extrabold text-bunker-text-primary text-sm">
                  {effectiveUnitPrice.toLocaleString()} <span className="text-[11px] font-normal">so'm</span>
                </span>
              </div>

              <div>
                <span className="text-bunker-text-muted text-[10px] block uppercase">QQS 12% (hisoblangan):</span>
                <span className="font-semibold text-emerald-700 text-sm">
                  {qqsAmount.toLocaleString()} <span className="text-[11px] font-normal">so'm</span>
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-bunker-text-muted text-[10px] block uppercase">Jami To‘lov:</span>
                <span className="text-lg font-extrabold text-bunker-amber-500">
                  {totalPrice.toLocaleString()} <span className="text-xs font-normal text-bunker-text-primary">so'm</span>
                </span>
              </div>
            </div>

            {savedAmount > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center text-xs font-mono font-bold text-emerald-800">
                Ulgurji hajm chegirmasi orqali tejab qolindi: {savedAmount.toLocaleString()} so'm (-{discountPct}%)
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant={addedNotice ? 'secondary' : 'primary'}
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 text-sm font-bold"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-5 h-5 text-bunker-status-green mr-2" />
                    <span>Savatga Qo'shildi!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    <span>Savatga Qo'shish</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsRfqModalOpen(true)}
                className="text-sm font-bold border-bunker-border-strong hover:border-bunker-amber-500"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 text-bunker-amber-500" />
                <span>Zavod Shartnomasi (RFQ)</span>
              </Button>
            </div>
          </div>

          {/* Quick Logistics Preview */}
          <div className="bg-slate-50 border border-bunker-border-strong rounded-xl p-4 flex items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border border-bunker-border-subtle shrink-0">
                {transport.icon}
              </div>
              <div>
                <span className="text-[10px] uppercase text-bunker-text-muted block font-bold">
                  Tavsiya Etiladigan Transport:
                </span>
                <span className="font-bold text-bunker-text-primary">{transport.name}</span>
                <p className="text-[11px] text-bunker-text-secondary mt-0.5">{transport.sub}</p>
              </div>
            </div>

            <Link
              to="/logistics"
              className="text-bunker-amber-500 hover:text-orange-600 font-bold shrink-0 text-xs hover:underline flex items-center gap-1"
            >
              <span>Tarifni ko'rish</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Tabular Technical Specification Sheet */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 pb-2 border-b border-bunker-border-strong">
          <FileCheck2 className="w-5 h-5 text-bunker-amber-500" />
          <h2 className="text-lg font-extrabold text-bunker-text-primary">
            Rasmiy Texnik Ko‘rsatkichlar &amp; Davlat Standartlari (O‘zDSt)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-bunker-border-strong rounded-xl overflow-hidden">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-muted w-1/2">
                    Davlat Standarti (GOST):
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-primary">
                    {gost.code}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-muted">
                    Standart Tavsifi:
                  </TableCell>
                  <TableCell className="font-mono text-xs text-bunker-text-secondary">
                    {gost.title}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-muted">
                    Sanoat Markasi / Sinf:
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-bunker-amber-500">
                    {product.title.includes('M500') || product.title.includes('M-500')
                      ? 'M-500 D0 (CEM I 42.5N)'
                      : product.title.includes('A500')
                      ? 'A500C (Davriy profil)'
                      : product.title.includes('Bazalt')
                      ? 'Zichlik: 110 kg/m³'
                      : 'Standart seriya'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-muted">
                    Siqilish Mustahkamligi:
                  </TableCell>
                  <TableCell className="font-mono text-xs text-bunker-text-primary">
                    ≥ 42.5 MPa (28 sutkalik sinovda)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="bg-white border border-bunker-border-strong rounded-xl overflow-hidden">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-muted w-1/2">
                    Qadoqlash Turi:
                  </TableCell>
                  <TableCell className="font-mono text-xs text-bunker-text-primary">
                    3 qavatli mustahkam qog‘oz qop / Big-Bag
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-muted">
                    Minimal Buyurtma Partiyasi:
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-primary">
                    {product.minOrder || 1} {unitLabel}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-muted">
                    Ombor Joylashuvi:
                  </TableCell>
                  <TableCell className="font-mono text-xs text-bunker-text-primary">
                    {product.region || 'Toshkent viloyati'}, {product.district || 'Zavod terminali'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs font-bold text-bunker-text-muted">
                    Kafolat Muddati:
                  </TableCell>
                  <TableCell className="font-mono text-xs text-emerald-700 font-bold">
                    {product.warranty || '12 oy to‘liq kafolat'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* 4. Laboratory Certificate & Verification Notice */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-bunker-text-primary text-sm sm:text-base">
              Davlat Laboratoriya Sinov Bayonnomasi &amp; Muvofiqlik Pasporti
            </h3>
            <p className="text-xs text-bunker-text-muted font-mono mt-0.5">
              Har bir partiya mahsulot O‘zDSt va GOST akkreditatsiyalangan laboratoriyasi orqali tekshirilgan.
            </p>
          </div>
        </div>

        <Link to="/certifications">
          <Button variant="secondary" size="sm" className="font-mono text-xs shrink-0">
            <Download className="w-4 h-4 mr-2 text-bunker-amber-500" />
            Sertifikatni Ko‘rish
          </Button>
        </Link>
      </div>

      {/* 5. RFQ Modal */}
      <Modal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        title="To‘g‘ridan-to‘g‘ri Zavod Shartnomasi (RFQ)"
        subtitle={`${product.title} bo‘yicha yirik ulgurji kontrakt so‘rovi`}
        size="md"
      >
        {rfqSubmitted ? (
          <div className="py-8 text-center space-y-3 font-mono">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-bunker-text-primary text-base">So‘rovingiz Qabul Qilindi!</h3>
            <p className="text-xs text-bunker-text-muted">
              Zavod savdo bo‘limi menejeri 15 daqiqa ichida siz bilan bog‘lanadi va rasmiy hisob-faktura yuboradi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRfqSubmit} className="space-y-4 font-mono text-xs">
            <Alert
              variant="info"
              title="Korporativ Ulgurji Xarid"
              description="Yirik partiyalar uchun qo‘shimcha zavod chegirmasi va kechiktirilgan to‘lov imkoniyati."
            />

            <div>
              <label className="font-bold text-bunker-text-primary block mb-1">
                Kompaniya Nomi yoki STIR:
              </label>
              <Input
                required
                placeholder="«ENTERPRISE BUILD» MChJ / STIR: 304..."
                value={rfqCompany}
                onChange={(e) => setRfqCompany(e.target.value)}
                sizeVariant="sm"
              />
            </div>

            <div>
              <label className="font-bold text-bunker-text-primary block mb-1">
                Aloqa Telefoni:
              </label>
              <Input
                required
                type="tel"
                placeholder="+998 90 123 45 67"
                value={rfqPhone}
                onChange={(e) => setRfqPhone(e.target.value)}
                sizeVariant="sm"
              />
            </div>

            <div>
              <label className="font-bold text-bunker-text-primary block mb-1">
                Qo‘shimcha Izoh (Ob'ekt manzili, yetkazish sanasi):
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-bunker-border-strong p-2.5 text-xs font-mono focus:border-bunker-amber-500 focus:outline-none"
                placeholder="Toshkent sh., Yunusobod tumani qurilish ob'ekti uchun..."
                value={rfqNote}
                onChange={(e) => setRfqNote(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsRfqModalOpen(false)}>
                Bekor Qilish
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Kontrakt So‘rovini Yuborish
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
