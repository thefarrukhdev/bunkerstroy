import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  CheckCircle2,
  Navigation,
  Phone,
  PackageCheck,
  Compass,
  Building2,
  Factory,
  ShieldCheck,
  ShoppingBag,
  Layers,
  MapPin
} from 'lucide-react';
import { LogisticsVehicle, Order } from '@bunkerstroy/types';
import {
  Button,
  Badge,
  Card,
  Input,
  Select,
  Alert,
  StatCard,
  RealTelegramLogo,
  RealInstagramLogo,
  RealYouTubeLogo,
  RealPhoneLogo
} from '@bunkerstroy/ui';

interface QuoteCalculation {
  vehicle: LogisticsVehicle;
  distanceKm: number;
  cargoWeightTons: number;
  baseCost: number;
  distanceCost: number;
  totalCost: number;
  estimatedHours: number;
  currency: string;
}

interface ConfirmedDispatch {
  id: string;
  orderId: string;
  vehicleId: string;
  driverName: string;
  driverPhone: string;
  vehicleName: string;
  plateNumber: string;
  status: string;
  origin: string;
  destination: string;
  distanceKm: number;
  totalCost: number;
  estimatedHours: number;
  dispatchedAt: string;
}

export const LogisticsView: React.FC = () => {
  const [vehicles, setVehicles] = useState<LogisticsVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<LogisticsVehicle | null>(null);
  const [distanceKm, setDistanceKm] = useState(25);
  const [weightTons, setWeightTons] = useState(15);
  const [origin, setOrigin] = useState('Keles daryosi qum-shag‘al karyeri');
  const [destination, setDestination] = useState('Toshkent sh., Yunusobod 14-mavze');
  const [quote, setQuote] = useState<QuoteCalculation | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Active user orders for linking dispatch
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('EXPRESS');

  // Booking & Confirmation state
  const [isBooking, setIsBooking] = useState(false);
  const [confirmedDispatch, setConfirmedDispatch] = useState<ConfirmedDispatch | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchVehicles();
    fetchUserOrders();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/logistics/vehicles');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setVehicles(json.data);
        setSelectedVehicle(json.data[0]);
      }
    } catch (e) {
      console.error('Failed to fetch logistics vehicles:', e);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
      if (!token) return;

      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setActiveOrders(json.data.filter((o: Order) => o.status === 'CONFIRMED' || o.status === 'PENDING' || o.status === 'ASSIGNED_TO_FLEET'));
      }
    } catch (e) {
      console.warn('Orders fetch for dispatch linking:', e);
    }
  };

  // Debounced quote calculator
  useEffect(() => {
    if (!selectedVehicle) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setLoadingQuote(true);
      try {
        const res = await fetch('/api/logistics/calculate-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicleId: selectedVehicle.id,
            distanceKm,
            cargoWeightTons: weightTons,
            origin,
            destination
          })
        });

        const data = await res.json();
        if (data.success && data.data) {
          setQuote(data.data);
        }
      } catch (err) {
        console.error('Quote calculation network error:', err);
      } finally {
        setLoadingQuote(false);
      }
    }, 250);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [selectedVehicle, distanceKm, weightTons, origin, destination]);

  const totalCostValue = quote
    ? quote.totalCost
    : selectedVehicle
    ? selectedVehicle.basePrice + distanceKm * selectedVehicle.pricePerKm
    : 0;

  // Handle Dispatch Booking
  const handleBook = async () => {
    if (!selectedVehicle) return;

    setIsBooking(true);
    setBookingError(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = {
      orderId: selectedOrderId === 'EXPRESS' ? `BS-EXP-${Date.now().toString().slice(-6)}` : selectedOrderId,
      vehicleId: selectedVehicle.id,
      origin,
      destination,
      distanceKm,
      cargoWeightTons: weightTons,
      totalCost: totalCostValue,
      driverName: selectedVehicle.driverName || 'Farhod Yoqubov',
      driverPhone: selectedVehicle.driverPhone || '+998 90 912 34 56'
    };

    try {
      const res = await fetch('/api/logistics/dispatch', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setConfirmedDispatch({
          id: json.data?.id || `DSP-${Date.now().toString().slice(-6)}`,
          orderId: payload.orderId,
          vehicleId: selectedVehicle.id,
          driverName: payload.driverName,
          driverPhone: payload.driverPhone,
          vehicleName: selectedVehicle.name,
          plateNumber: selectedVehicle.plateNumber || '01 777 AAA',
          status: 'DISPATCHED',
          origin,
          destination,
          distanceKm,
          totalCost: totalCostValue,
          estimatedHours: quote?.estimatedHours || Math.round((distanceKm / 35) * 10) / 10 + 1,
          dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        setBookingError(json.message || 'Dispetcherlik bron qilishda xatolik yuz berdi');
      }
    } catch {
      setBookingError('Server bilan ulanishda xato. Qayta urinib ko‘ring.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 pb-12 font-sans">
      {/* 1. Logistics Header */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-2xs border border-slate-200 overflow-hidden">
        <div className="absolute inset-0 tech-grid-pattern opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#D95D1E] uppercase tracking-wider">
                Dispetcherlik &amp; Marshrut
              </span>
              <span className="bg-orange-50 text-[#D95D1E] border border-orange-200 px-2 py-0.5 rounded text-[10px] font-mono font-black">
                GPS TELEMETRIYA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-900">
              Og‘ir Qurilish Texnikalari &amp; Logistika Parki
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              HOWO 25t, Shacman mikser va Isuzu kran. Kim sotsa — o'sha yetkazadi: Do'kon yoki Zavod kafolati ostida.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 flex items-center gap-2 shadow-2xs">
              <span className="text-[#D95D1E] font-black">{vehicles.length}</span>
              <span>ta maxsus texnika faol</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONFIRMED DISPATCH ACTIVE CARD */}
      {confirmedDispatch && (
        <div className="bg-white border-2 border-emerald-400 p-5 sm:p-6 rounded-2xl space-y-4 shadow-2xs text-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Reys Tasdiqlandi</h3>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    STATUS: BIRIKTIRILDI
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                  Dispetcherlik ID: <span className="text-[#D95D1E] font-bold">{confirmedDispatch.id}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmedDispatch(null)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
            >
              Yangi Reys Hisoblash
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Haydovchi</span>
              <p className="text-sm font-black text-slate-900">{confirmedDispatch.driverName}</p>
              <p className="text-[11px] text-[#D95D1E] font-bold">{confirmedDispatch.driverPhone}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Maxsus Texnika</span>
              <p className="text-sm font-black text-slate-900 truncate">{confirmedDispatch.vehicleName}</p>
              <p className="text-[11px] text-slate-600">{confirmedDispatch.plateNumber}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Masofa &amp; Vaqt</span>
              <p className="text-sm font-black text-slate-900 font-mono-numbers">{confirmedDispatch.distanceKm} km</p>
              <p className="text-[11px] text-slate-600">~{confirmedDispatch.estimatedHours} soat</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Jami Reys Narxi</span>
              <p className="text-sm font-black text-[#D95D1E] font-mono-numbers">{confirmedDispatch.totalCost.toLocaleString()} so‘m</p>
              <p className="text-[11px] text-emerald-700 font-medium">Kafolatlangan reys</p>
            </div>
          </div>

          {/* Simple 4-Step Route Tracker */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. Qabul qilindi</span>
              </div>
              <div className="flex items-center gap-2 text-[#D95D1E] font-bold">
                <Truck className="w-4 h-4 text-[#D95D1E]" />
                <span>2. Yuklanmoqda</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Navigation className="w-4 h-4 text-slate-400" />
                <span>3. Yo‘lda</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <PackageCheck className="w-4 h-4 text-slate-400" />
                <span>4. Ob'ektda</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Fleet & Route Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vehicles selection list (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 font-mono text-xs">
            <span className="font-bold text-slate-900 uppercase flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D95D1E]" />
              1. Maxsus Texnikani Tanlang
            </span>
            <span className="text-slate-500 font-medium">{vehicles.length} ta birlik</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`industrial-card p-3.5 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between shadow-sm ${
                    isSelected
                      ? 'bg-orange-50/50 border-[#D95D1E] ring-1 ring-[#D95D1E]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 bg-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{v.name}</h4>
                        {isSelected && (
                          <span className="text-xs font-bold text-[#D95D1E] shrink-0">✓</span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-[#D95D1E] mt-0.5 font-bold">
                        {v.capacityTons} tonnagacha sig‘im
                      </p>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
                        Baza: {Number(v.basePrice).toLocaleString()} so‘m
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        + {Number(v.pricePerKm).toLocaleString()} so‘m / km
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Davlat raqami:</span>
                    <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-800 font-bold">
                      {v.plateNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Route & Price Calculator Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm text-slate-900 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
            <span className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#D95D1E]" />
              2. Marshrut &amp; Yuk Parametrlari
            </span>
            {loadingQuote && <span className="text-[10px] text-[#D95D1E] font-mono font-bold">Hisoblanmoqda...</span>}
          </div>

          {bookingError && (
            <Alert variant="error" description={bookingError} onDismiss={() => setBookingError(null)} />
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label htmlFor="logistics-origin-input" className="text-slate-700 block text-[10px] uppercase font-bold mb-1">
                Yuklash Nuqtasi (Karyer / Zavod):
              </label>
              <Input
                id="logistics-origin-input"
                name="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Yuk ortish manzili..."
                sizeVariant="sm"
              />
            </div>

            <div>
              <label htmlFor="logistics-destination-input" className="text-slate-700 block text-[10px] uppercase font-bold mb-1">
                Yetkazib Berish Ob'ekti:
              </label>
              <Input
                id="logistics-destination-input"
                name="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Qurilish ob'ekti manzili..."
                sizeVariant="sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="logistics-distance-input" className="text-slate-700 block text-[10px] uppercase font-bold mb-1">
                  Masofa (km):
                </label>
                <Input
                  id="logistics-distance-input"
                  name="distanceKm"
                  type="number"
                  min="1"
                  max="1500"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Math.max(1, parseInt(e.target.value) || 1))}
                  sizeVariant="sm"
                />
              </div>

              <div>
                <label htmlFor="logistics-weight-input" className="text-slate-700 block text-[10px] uppercase font-bold mb-1">
                  Yuk Og‘irligi (t):
                </label>
                <Input
                  id="logistics-weight-input"
                  name="weightTons"
                  type="number"
                  min="1"
                  max="45"
                  value={weightTons}
                  onChange={(e) => setWeightTons(Math.max(1, parseInt(e.target.value) || 1))}
                  sizeVariant="sm"
                />
              </div>
            </div>

            {/* Link to existing Order (optional) */}
            {activeOrders.length > 0 && (
              <div>
                <label htmlFor="logistics-order-select" className="text-slate-700 block text-[10px] uppercase font-bold mb-1">
                  Mavjud Buyurtmaga Biriktirish (Ixtiyoriy):
                </label>
                <select
                  id="logistics-order-select"
                  name="orderId"
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 outline-none cursor-pointer focus:border-[#D95D1E]"
                >
                  <option value="EXPRESS">Alohida ekspress yuk tashish</option>
                  {activeOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} ({Number(o.finalAmount || o.totalAmount).toLocaleString()} so‘m)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Pricing Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Baza tarifi (chiqish):</span>
              <span className="text-slate-900 font-medium">{selectedVehicle ? Number(selectedVehicle.basePrice).toLocaleString() : 0} so‘m</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Masofa to‘lovi ({distanceKm} km):</span>
              <span className="text-slate-900 font-medium">
                {selectedVehicle ? (distanceKm * Number(selectedVehicle.pricePerKm)).toLocaleString() : 0} so‘m
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-800 uppercase text-xs">Jami Reys Narxi:</span>
              <span className="text-base font-black text-[#D95D1E] font-mono-numbers">
                {totalCostValue.toLocaleString()} so‘m
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBook}
            disabled={isBooking}
            className="w-full bg-[#D95D1E] hover:bg-[#B43B06] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors select-none"
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">
              {isBooking ? 'Dispetcherga yuborilmoqda...' : 'Reysni Tasdiqlash & Dispetcherga Yuborish'}
            </span>
            <span className="sm:hidden">
              {isBooking ? 'Yuborilmoqda...' : 'Reysni Dispetcherga Yuborish'}
            </span>
          </button>
        </div>
      </div>

      {/* 4. B2B2C Platforma Modeli & Biz Haqimizda (Legacy LogisticsHub Core Standard) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[#D95D1E] text-xs font-mono font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Biz Haqimizda • B2B2C Platforma</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 leading-tight">
            BunkerStroy: qurilish mahsulotlarining onlayn savdo markazi
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
            BunkerStroy’da ta’minotchilarni bir savdo maydonida jamladik: narxlarni solishtirasiz,
            shartlarni ko‘rasiz, buyurtmani bir joydan berasiz. BunkerStroy mahsulotni o‘zi sotmaydi — 
            u ta’minotchilarni va ularning mijozlarini uchrashtiradigan ishonchli savdo maydoni.
          </p>
        </div>

        {/* Bu yerda kim bor: B2B vs B2C */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* B2B Zavodlar */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D95D1E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Factory className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#D95D1E] block">
                  Ta’minotchilar • B2B yo‘nalish
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Ishlab chiqaruvchi zavodlar (B2B)
                </h3>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-sans">
              Katta hajm, zavod narxi. Qurilish korxonalari, pudratchilar va yirik obyektlar uchun.
            </p>
          </div>

          {/* B2C Chakana do'konlar */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Ta’minotchilar • B2C yo‘nalish
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Chakana sotuvchilar (B2C)
                </h3>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-sans">
              Uyingizdagi ta’mir yoki kichik qurilish uchun kerakli miqdorda, qulay yetkazib berish bilan.
            </p>
          </div>
        </div>

        {/* Mahsulot kafolati va aniqlik */}
        <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-emerald-900 font-mono uppercase tracking-wider">
              Mahsulot kafolati va aniqlik
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              Mahsulot kafolati va aniqlik ma’lumotlari mahsulot tavsifida kiritilgan va tavsif uchun 
              ta’minotchi kafolati mavjud. 50/50 Xavfsiz Escrow xaridoringiz huquqlarini 100% himoya qiladi.
            </p>
          </div>
        </div>

        {/* 5. Rasmiy Ijtimoiy Tarmoqlar va 24/7 Aloqa */}
        <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Rasmiy Ijtimoiy Tarmoqlar
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/bunkerstroy_uz"
                target="_blank"
                rel="noopener noreferrer"
                title="BunkerStroy Telegram"
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <RealTelegramLogo className="w-10 h-10" />
              </a>

              <a
                href="https://instagram.com/bunkerstroy.uz"
                target="_blank"
                rel="noopener noreferrer"
                title="BunkerStroy Instagram"
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <RealInstagramLogo className="w-10 h-10" />
              </a>

              <a
                href="https://youtube.com/@bunkerstroy"
                target="_blank"
                rel="noopener noreferrer"
                title="BunkerStroy YouTube"
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <RealYouTubeLogo className="w-10 h-10" />
              </a>
            </div>
          </div>

          <div className="space-y-2 md:text-right">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Dispetcherlik &amp; 24/7 Aloqa
            </span>
            <div className="flex items-center gap-3">
              <a
                href="tel:+998712000050"
                title="Telefon orqali bog‘lanish"
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <RealPhoneLogo className="w-10 h-10" />
              </a>

              <a
                href="https://t.me/bunkerstroy_uz"
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram orqali to‘g‘ridan-to‘g‘ri aloqa"
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <RealTelegramLogo className="w-10 h-10" />
              </a>

              <div className="text-left font-mono pl-1">
                <div className="text-xs font-bold text-slate-900">+998 (71) 200-00-50</div>
                <div className="text-[10px] text-emerald-600 font-semibold">24/7 Dispetcher faol</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
