import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Package,
  Truck,
  Building,
  CreditCard,
  Banknote,
  FileText,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Clock,
  Sparkles,
  Bookmark,
  Check
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import { Button, Badge, Drawer, Input, Select, Alert } from '@bunkerstroy/ui';

export interface ConstructionSite {
  id: string;
  name: string;
  region: string;
  district: string;
  street: string;
  landmark: string;
}

const DEFAULT_CONSTRUCTION_SITES: ConstructionSite[] = [
  {
    id: 'tc-lot4',
    name: 'Toshkent City Lot 4',
    region: 'Toshkent shahri',
    district: 'Shayxontohur tumani',
    street: 'Navoiy ko‘chasi, 1A-bino',
    landmark: 'Humo Arena ro‘parasida',
  },
  {
    id: 'obc-blok-b',
    name: 'Olmazor Business City (Blok B)',
    region: 'Toshkent shahri',
    district: 'Olmazor tumani',
    street: 'Kichik halqa yo‘li, 15-bino',
    landmark: 'Daryo bo‘yi mavzesi, 2-kirish',
  },
  {
    id: 'yunus-12',
    name: 'Yunusobod 12-mavze (Kottej)',
    region: 'Toshkent shahri',
    district: 'Yunusobod tumani',
    street: '12-mavze, 45-uchastka',
    landmark: 'Megaplanet orqasida',
  },
];

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onOrderSuccess: () => void;
}

type CheckoutStep = 1 | 2 | 'success';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClear,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 2: Receiver & Delivery Details
  const [buyerName, setBuyerName] = useState('Alisher Normurodov');
  const [buyerPhone, setBuyerPhone] = useState('+998 90 123 45 67');
  const [deliveryMethod, setDeliveryMethod] = useState<'COURIER' | 'PICKUP'>('COURIER');
  const [vehicleType, setVehicleType] = useState('Standart Kuryer / HOWO');
  const [region, setRegion] = useState('Toshkent shahri');
  const [district, setDistrict] = useState('Chilonzor tumani');
  const [streetAddress, setStreetAddress] = useState('Bunyodkor shox ko‘chasi, 42-uy');
  const [landmark, setLandmark] = useState('Novza metro bekati yaqinida');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'PAYME' | 'CLICK' | 'BANK_TRANSFER'>('PAYME');
  const [paymentMode, setPaymentMode] = useState<'FULL_100' | 'SPLIT_50_50'>('FULL_100');

  // Saved construction sites (MJ-02)
  const [savedSites, setSavedSites] = useState<ConstructionSite[]>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_saved_sites') : null;
      return stored ? JSON.parse(stored) : DEFAULT_CONSTRUCTION_SITES;
    } catch {
      return DEFAULT_CONSTRUCTION_SITES;
    }
  });
  const [selectedSiteId, setSelectedSiteId] = useState<string>('tc-lot4');
  const [newSiteName, setNewSiteName] = useState('');
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [siteSavedSuccess, setSiteSavedSuccess] = useState(false);

  const handleSelectSite = (site: ConstructionSite) => {
    setSelectedSiteId(site.id);
    setRegion(site.region);
    setDistrict(site.district);
    setStreetAddress(site.street);
    setLandmark(site.landmark);
  };

  const handleSaveCurrentSite = () => {
    if (!newSiteName.trim() || !streetAddress.trim()) return;
    const newSite: ConstructionSite = {
      id: `site-${Date.now()}`,
      name: newSiteName.trim(),
      region,
      district,
      street: streetAddress.trim(),
      landmark: landmark.trim(),
    };
    const updated = [...savedSites, newSite];
    setSavedSites(updated);
    setSelectedSiteId(newSite.id);
    setNewSiteName('');
    setIsAddingSite(false);
    setSiteSavedSuccess(true);
    setTimeout(() => setSiteSavedSuccess(false), 3000);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bunkerstroy_saved_sites', JSON.stringify(updated));
      }
    } catch {}
  };

  // Success state
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  if (!isOpen) return null;

  // Calculation
  const totalItemsSum = items.reduce(
    (acc, it) => acc + Number(it.product.price) * it.quantity,
    0
  );

  // Delivery fee is 0 if pickup, or 50,000 UZS / 150,000 UZS if courier based on weight/size
  const deliveryFee = deliveryMethod === 'PICKUP' ? 0 : 50000;
  const grandTotal = totalItemsSum + deliveryFee;

  // Handle Place Order
  const handlePlaceOrder = async () => {
    if (!buyerName.trim()) {
      setErrorMsg('Iltimos, ismingizni kiriting');
      return;
    }
    if (!buyerPhone.trim()) {
      setErrorMsg('Iltimos, telefon raqamingizni kiriting');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
          items: items.map((it) => ({
            productId: it.product.id,
            quantity: it.quantity,
          })),
          deliveryAddress: {
            region,
            district,
            street: streetAddress.trim(),
            landmark: landmark.trim(),
          },
          vehicleType: deliveryMethod === 'PICKUP' ? 'O‘zi olib ketish (Samovivoz)' : vehicleType,
          paymentMethod: paymentMethod === 'CASH_ON_DELIVERY' ? 'PAYME' : paymentMethod,
          paymentMode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const orderNum = data.data?.orderNumber || `BS-${Math.floor(100000 + Math.random() * 900000)}`;
        setCreatedOrderNumber(orderNum);
        onClear();
        setStep('success');
      } else {
        setErrorMsg(data.message || 'Buyurtmani rasmiylashtirishda xatolik yuz berdi');
      }
    } catch {
      setErrorMsg('Server bilan aloqa uzildi. Iltimos qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndNavigate = () => {
    onOrderSuccess();
    onClose();
    setStep(1);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        step === 1
          ? 'Xarid Savatchasi'
          : step === 2
          ? 'Yetkazib Berish & Rasmiylashtirish'
          : 'Buyurtma Muvaffaqiyatli Qabul Qilindi'
      }
      subtitle={
        step === 1
          ? `${items.length} xil qurilish mahsulotlari tanlangan`
          : step === 2
          ? 'Manzilni ko‘rsating va yetkazib berish usulini tanlang'
          : 'Mahsulotlar to‘g‘ridan-to‘g‘ri sotuvchiga yo‘naltirildi'
      }
      headerExtra={
        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5 text-bunker-amber-500" />
        </div>
      }
      footer={
        step !== 'success' && items.length > 0 ? (
          <div className="w-full space-y-3 font-mono">
            {/* Price Summary bar */}
            <div className="bg-slate-50 border border-bunker-border-strong rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-bunker-text-secondary">
                <span>Mahsulotlar summasi:</span>
                <span>{totalItemsSum.toLocaleString()} so‘m</span>
              </div>
              <div className="flex justify-between text-bunker-text-secondary">
                <span>Yetkazib berish to‘lovi:</span>
                <span className={deliveryFee === 0 ? 'text-emerald-700 font-bold' : ''}>
                  {deliveryFee === 0 ? 'BEPUL (O‘zi olib ketish)' : `${deliveryFee.toLocaleString()} so‘m`}
                </span>
              </div>
              <div className="pt-1.5 border-t border-bunker-border-subtle flex justify-between text-sm font-bold text-bunker-text-primary">
                <span>Jami to‘lov:</span>
                <span className="text-bunker-amber-500">{grandTotal.toLocaleString()} so‘m</span>
              </div>

              {paymentMode === 'SPLIT_50_50' && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-[11px] space-y-1 text-amber-950">
                  <div className="flex justify-between font-bold">
                    <span>Avans to‘lovi (50%):</span>
                    <span className="text-bunker-amber-600">{Math.round(grandTotal / 2).toLocaleString()} so‘m</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Qoldiq to‘lov (50%):</span>
                    <span>{(grandTotal - Math.round(grandTotal / 2)).toLocaleString()} so‘m (yetib kelgach)</span>
                  </div>
                  <p className="text-[10px] text-amber-800 pt-0.5 font-sans">
                    * Qabul kodi yuk yetib kelib, 2-to‘lov tasdiqlangach ochiladi.
                  </p>
                </div>
              )}
            </div>

            {/* Step navigation buttons */}
            <div className="flex gap-2">
              {step === 2 && (
                <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Ortga</span>
                </Button>
              )}

              {step === 1 ? (
                <Button
                  className="flex-1"
                  size="md"
                  variant="primary"
                  onClick={() => setStep(2)}
                >
                  <span>Yetkazib berishga o‘tish</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  size="md"
                  variant="primary"
                  isLoading={loading}
                  onClick={handlePlaceOrder}
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  <span>Buyurtmani Tasdiqlash</span>
                </Button>
              )}
            </div>
          </div>
        ) : null
      }
    >
      {/* Error Alert */}
      {errorMsg && (
        <Alert
          variant="error"
          onDismiss={() => setErrorMsg(null)}
          className="mb-4"
        >
          {errorMsg}
        </Alert>
      )}

      {/* =========================================================================
          STEP 1: SAVATCHA MAHSULOTLAR RO‘YXATI
          ========================================================================= */}
      {step === 1 && (
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-base text-bunker-text-primary">
                Savatchangiz bo‘sh
              </h3>
              <p className="text-xs text-bunker-text-secondary max-w-xs mx-auto">
                Katalogdan kerakli qurilish mahsulotlarini tanlab, savatchaga qo‘shing.
              </p>
              <Button size="sm" variant="primary" onClick={onClose}>
                Katalogga Qaytish
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-xs text-bunker-text-secondary pb-1 border-b border-bunker-border-subtle">
                <span>Mahsulotlar ({items.length})</span>
                <button
                  type="button"
                  onClick={onClear}
                  className="text-red-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Tozalash</span>
                </button>
              </div>

              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-[#0F2547] border border-[#1E3A6D] rounded-xl p-3 flex items-start gap-3 shadow-xs"
                >
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover border border-[#1E3A6D] shrink-0 bg-[#071326]"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-heading font-bold text-xs text-white line-clamp-1">
                      {product.title}
                    </h4>

                    <div className="text-[11px] font-mono text-sky-300">
                      {Number(product.price).toLocaleString()} so‘m / {product.unit}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#1E3A6D] rounded-lg bg-[#071326] overflow-hidden font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, -1)}
                          className="px-2 py-1 hover:bg-[#132C54] transition-colors text-sky-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 font-bold text-white bg-[#0A1931]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, 1)}
                          className="px-2 py-1 hover:bg-[#132C54] transition-colors text-sky-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-xs font-black text-[#FFB800]">
                          {(Number(product.price) * quantity).toLocaleString()} so‘m
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    className="text-slate-400 hover:text-red-700 p-1 rounded-md transition-colors"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STEP 2: YETKAZIB BERISH VA BUYURTMACHI MA’LUMOTLARI
          ========================================================================= */}
      {step === 2 && (
        <div className="space-y-5 font-mono">
          {/* 1. Receiver Details */}
          <div className="bg-[#0F2547] border border-[#1E3A6D] rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E3A6D]">
              <User className="w-4 h-4 text-bunker-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                1. Qabul Qiluvchi Ma’lumotlari
              </h3>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] text-sky-200 block mb-1">
                  Ismingiz / Korxona nomi *
                </label>
                <Input
                  sizeVariant="sm"
                  placeholder="Alisher Normurodov"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[11px] text-sky-200 block mb-1">
                  Telefon raqamingiz *
                </label>
                <Input
                  sizeVariant="sm"
                  placeholder="+998 90 123 45 67"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                />
                <span className="text-[10px] text-sky-400 mt-0.5 block">
                  Kuryer yoki sotuvchi yetkazib berishdan oldin telefon qiladi.
                </span>
              </div>
            </div>
          </div>

          {/* 2. Delivery Method */}
          <div className="bg-[#0F2547] border border-[#1E3A6D] rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E3A6D]">
              <Truck className="w-4 h-4 text-bunker-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                2. Yetkazib Berish Usuli
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDeliveryMethod('COURIER')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'COURIER'
                    ? 'border-[#FFB800] bg-[#132C54] shadow-xs'
                    : 'border-[#1E3A6D] bg-[#071326] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-bunker-amber-500" />
                    <span>Keltirib berish</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#FFB800]">+50,000 so‘m</span>
                </div>
                <p className="text-[10px] text-sky-300">
                  Toshkent va viloyatlar bo‘yicha manzilingizgacha olib boriladi.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('PICKUP')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'PICKUP'
                    ? 'border-[#FFB800] bg-[#132C54] shadow-xs'
                    : 'border-[#1E3A6D] bg-[#071326] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-sky-300" />
                    <span>O‘zi olib ketish</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">BEPUL</span>
                </div>
                <p className="text-[10px] text-sky-300">
                  Sotuvchining omboridan o‘zingiz olib ketasiz.
                </p>
              </button>
            </div>

            {deliveryMethod === 'COURIER' && (
              <div className="pt-2 space-y-3">
                {/* Saved Construction Sites Quick-Picker (MJ-02) */}
                <div className="bg-[#071326] border border-[#1E3A6D] rounded-lg p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5 font-mono">
                      <Bookmark className="w-3.5 h-3.5 text-[#FFB800]" />
                      Qurilish Obyektlari (Saqlangan Manzillar)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingSite(!isAddingSite)}
                      className="text-[10px] text-[#FFB800] font-bold hover:underline"
                    >
                      {isAddingSite ? 'Yopish' : '+ Obyekt qo‘shish'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {savedSites.map((site) => {
                      const isSelected = selectedSiteId === site.id;
                      return (
                        <button
                          key={site.id}
                          type="button"
                          onClick={() => handleSelectSite(site)}
                          className={`p-2 rounded-md border text-left transition-all text-xs flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#FFB800] bg-[#FFB800]/15 font-bold text-[#FFB800] shadow-sm'
                              : 'border-[#1E3A6D] bg-[#0A1931] text-slate-200 hover:border-[#FFB800]/60 hover:text-white'
                          }`}
                        >
                          <div className="truncate mr-1">
                            <div className="text-[11px] font-semibold truncate">{site.name}</div>
                            <div className="text-[9px] text-sky-300/70 truncate">{site.district}, {site.street}</div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setSelectedSiteId('custom')}
                      className={`p-2 rounded-md border text-left transition-all text-xs flex items-center justify-between cursor-pointer ${
                        selectedSiteId === 'custom'
                          ? 'border-[#FFB800] bg-[#FFB800]/15 font-bold text-[#FFB800] shadow-sm'
                          : 'border-[#1E3A6D] bg-[#0A1931] text-slate-200 hover:border-[#FFB800]/60 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="text-[11px] font-semibold">Boshqa yangi manzil</div>
                        <div className="text-[9px] text-sky-300/70">Qo‘lda kiritish</div>
                      </div>
                      {selectedSiteId === 'custom' && <Check className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />}
                    </button>
                  </div>

                  {/* Add New Site Form */}
                  {isAddingSite && (
                    <div className="pt-2 border-t border-[#1E3A6D] flex gap-2">
                      <Input
                        sizeVariant="sm"
                        placeholder="Obyekt nomi (masalan: Mirzo Ulug‘bek Lot 2)"
                        value={newSiteName}
                        onChange={(e) => setNewSiteName(e.target.value)}
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleSaveCurrentSite}
                        className="shrink-0 text-xs px-2.5"
                      >
                        Saqlash
                      </Button>
                    </div>
                  )}

                  {siteSavedSuccess && (
                    <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 p-1.5 rounded">
                      Yangi qurilish obyekti muvaffaqiyatli saqlandi!
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-bunker-text-secondary block mb-1">
                      Viloyat / Shahar
                    </label>
                    <Select
                      sizeVariant="sm"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="Toshkent shahri">Toshkent shahri</option>
                      <option value="Toshkent viloyati">Toshkent viloyati</option>
                      <option value="Samarqand viloyati">Samarqand viloyati</option>
                      <option value="Farg‘ona viloyati">Farg‘ona viloyati</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[11px] text-bunker-text-secondary block mb-1">
                      Tuman
                    </label>
                    <Input
                      sizeVariant="sm"
                      placeholder="Chilonzor tumani"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-bunker-text-secondary block mb-1">
                    Ko‘cha, uy / xonadon raqami *
                  </label>
                  <Input
                    sizeVariant="sm"
                    placeholder="Bunyodkor shox ko‘chasi, 42-uy"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[11px] text-bunker-text-secondary block mb-1">
                    Mo‘ljal (Landmark)
                  </label>
                  <Input
                    sizeVariant="sm"
                    placeholder="Novza metro bekati ro‘parasida"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment Method */}
          <div className="bg-[#0F2547] border border-[#1E3A6D] rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E3A6D]">
              <CreditCard className="w-4 h-4 text-bunker-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                3. To‘lov Turi
              </h3>
            </div>

            <div className="space-y-2">
              <label htmlFor="payment-cod" className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#1E3A6D] bg-[#071326] hover:bg-[#132C54] cursor-pointer">
                <input
                  id="payment-cod"
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="text-bunker-amber-500"
                />
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  Qabul qilganda naqd yoki karta orqali to‘lov
                </span>
              </label>

              <label htmlFor="payment-payme" className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#1E3A6D] bg-[#071326] hover:bg-[#132C54] cursor-pointer">
                <input
                  id="payment-payme"
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'PAYME'}
                  onChange={() => setPaymentMethod('PAYME')}
                  className="text-bunker-amber-500"
                />
                <CreditCard className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white">
                  Payme / Click orqali onlayn to‘lov
                </span>
              </label>

              <label htmlFor="payment-bank" className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#1E3A6D] bg-[#071326] hover:bg-[#132C54] cursor-pointer">
                <input
                  id="payment-bank"
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                  className="text-bunker-amber-500"
                />
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">
                  Korxona hisob-fakturasi (B2B Bank o‘tkazmasi)
                </span>
              </label>
            </div>
          </div>

          {/* 4. Escrow & Payment Mode (100% vs 50/50) */}
          <div className="bg-[#0F2547] border border-[#1E3A6D] rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E3A6D]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-bunker-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  4. To‘lov Rejimi (Escrow Himoyasi)
                </h3>
              </div>
              <Badge variant="warning" size="sm" isMono>
                XAVFSIZ ESCROW
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMode('FULL_100')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMode === 'FULL_100'
                    ? 'border-[#FFB800] bg-[#132C54] shadow-xs'
                    : 'border-[#1E3A6D] bg-[#071326] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">100% Oldindan To‘lov</span>
                  <Badge variant="success" size="sm">Standart</Badge>
                </div>
                <p className="text-[10px] text-sky-300 leading-relaxed">
                  Pul xavfsiz Escrow hisobida turadi. Yuk yetib kelgach darhol qabul kodi bilan qabul qilasiz.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('SPLIT_50_50')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMode === 'SPLIT_50_50'
                    ? 'border-[#FFB800] bg-[#132C54] shadow-xs'
                    : 'border-[#1E3A6D] bg-[#071326] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">50% / 50% Bo‘lib To‘lash</span>
                  <Badge variant="warning" size="sm">B2B Pilot</Badge>
                </div>
                <p className="text-[10px] text-sky-300 leading-relaxed">
                  50% avans buyurtmada, qolgan 50% yuk yetib kelganda, tushirishdan oldin to‘lanadi.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: BUYURTMA QABUL QILINDI (SUCCESS)
          ========================================================================= */}
      {step === 'success' && (
        <div className="py-8 text-center space-y-4 font-mono">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <Badge variant="success" size="md" isMono>
              BUYURTMA QABUL QILINDI
            </Badge>
            <h2 className="text-lg font-extrabold text-bunker-text-primary mt-2">
              Buyurtma Raqami: #{createdOrderNumber}
            </h2>
            <p className="text-xs text-bunker-text-secondary max-w-sm mx-auto">
              Xaridingiz to‘g‘ridan-to‘g‘ri ishlab chiqaruvchi/do‘konga yo‘naltirildi. Kuryer jo‘natishdan avval siz bilan bog‘lanadi.
            </p>
          </div>

          <div className="bg-slate-50 border border-bunker-border-strong rounded-xl p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
            <div className="flex items-center justify-between text-bunker-text-muted">
              <span>Holat:</span>
              <span className="font-bold text-sky-700">Tasdiqlandi &amp; Tayyorlanmoqda</span>
            </div>
            <div className="flex items-center justify-between text-bunker-text-muted">
              <span>Yetkazib berish:</span>
              <span className="font-bold text-slate-800">
                {deliveryMethod === 'PICKUP' ? 'Samovivoz (Ombordan)' : 'BunkerStroy Kuryer'}
              </span>
            </div>
            <div className="flex items-center justify-between text-bunker-text-muted">
              <span>Qabul qiluvchi:</span>
              <span className="font-bold text-slate-800">{buyerPhone}</span>
            </div>
          </div>

          <div className="pt-4">
            <Button size="md" variant="primary" onClick={handleFinishAndNavigate}>
              <span>Buyurtmalarim Sahifasiga O‘tish</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
};
