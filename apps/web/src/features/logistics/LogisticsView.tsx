import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  CheckCircle2,
  Navigation,
  Phone,
  PackageCheck,
  Compass
} from 'lucide-react';
import { LogisticsVehicle, Order } from '@bunkerstroy/types';
import { Button, Badge, Card, Input, Select, Alert, StatCard } from '@bunkerstroy/ui';

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
    <div className="space-y-6 text-white pb-12 font-sans">
      {/* 1. Authentic Industrial Logistics Header */}
      <div className="relative brushed-steel rounded-2xl p-5 sm:p-7 shadow-[0_8px_24px_rgba(7,19,38,0.5)] border border-[#1E3A6D] overflow-hidden">
        <div className="absolute top-2 left-2 industrial-rivet" />
        <div className="absolute top-2 right-2 industrial-rivet" />
        <div className="absolute bottom-2 left-2 industrial-rivet" />
        <div className="absolute bottom-2 right-2 industrial-rivet" />
        <div className="absolute inset-0 tech-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#FFB800] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-ping" />
                Dispetcherlik &amp; Marshrut
              </span>
              <span className="bg-[#132C54] text-[#FFB800] border border-[#254B85] px-2 py-0.5 rounded text-[10px] font-mono font-black">
                GPS TELEMETRIYA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
              Og‘ir Qurilish Texnikalari &amp; Logistika Parki
            </h1>
            <p className="text-xs sm:text-sm text-sky-200/90 mt-1 max-w-2xl leading-relaxed">
              HOWO 25t, Shacman mikser va Isuzu kran. Masofa bo‘yicha avtomatik tarif va GPS telemetriya.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <div className="bg-[#071326] border border-[#1E3A6D] px-3.5 py-2 rounded-xl text-sky-200 flex items-center gap-2">
              <span className="text-[#FFB800] font-black">{vehicles.length}</span>
              <span>ta maxsus texnika faol</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONFIRMED DISPATCH ACTIVE CARD */}
      {confirmedDispatch && (
        <div className="bg-[#0F2547] border-2 border-[#FFB800] p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl text-white">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1E3A6D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#071326] border border-[#FFB800] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#FFB800]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Reys Tasdiqlandi</h3>
                  <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    STATUS: BIRIKTIRILDI
                  </span>
                </div>
                <p className="text-xs text-sky-300 mt-0.5 font-mono">
                  Dispetcherlik ID: <span className="text-[#FFB800] font-bold">{confirmedDispatch.id}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmedDispatch(null)}
              className="btn-industrial-dark px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer"
            >
              Yangi Reys Hisoblash
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#071326] border border-[#1E3A6D] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-sky-400 uppercase font-bold">Haydovchi</span>
              <p className="text-sm font-black text-white">{confirmedDispatch.driverName}</p>
              <p className="text-[11px] text-[#FFB800]">{confirmedDispatch.driverPhone}</p>
            </div>

            <div className="bg-[#071326] border border-[#1E3A6D] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-sky-400 uppercase font-bold">Maxsus Texnika</span>
              <p className="text-sm font-black text-white truncate">{confirmedDispatch.vehicleName}</p>
              <p className="text-[11px] text-sky-300">{confirmedDispatch.plateNumber}</p>
            </div>

            <div className="bg-[#071326] border border-[#1E3A6D] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-sky-400 uppercase font-bold">Masofa &amp; Vaqt</span>
              <p className="text-sm font-black text-white font-mono-numbers">{confirmedDispatch.distanceKm} km</p>
              <p className="text-[11px] text-sky-300">~{confirmedDispatch.estimatedHours} soat</p>
            </div>

            <div className="bg-[#071326] border border-[#1E3A6D] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-sky-400 uppercase font-bold">Jami Reys Narxi</span>
              <p className="text-sm font-black text-[#FFB800] font-mono-numbers">{confirmedDispatch.totalCost.toLocaleString()} so‘m</p>
              <p className="text-[11px] text-emerald-400">Kafolatlangan reys</p>
            </div>
          </div>

          {/* Simple 4-Step Route Tracker */}
          <div className="bg-[#071326] border border-[#1E3A6D] p-4 rounded-xl font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1. Qabul qilindi</span>
              </div>
              <div className="flex items-center gap-2 text-[#FFB800] font-bold">
                <Truck className="w-4 h-4 text-[#FFB800]" />
                <span>2. Yuklanmoqda</span>
              </div>
              <div className="flex items-center gap-2 text-sky-300">
                <Navigation className="w-4 h-4" />
                <span>3. Yo‘lda</span>
              </div>
              <div className="flex items-center gap-2 text-sky-300">
                <PackageCheck className="w-4 h-4" />
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
          <div className="flex items-center justify-between pb-1 border-b border-[#1E3A6D] font-mono text-xs">
            <span className="font-bold text-white uppercase flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#FFB800]" />
              1. Maxsus Texnikani Tanlang
            </span>
            <span className="text-sky-300">{vehicles.length} ta birlik</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`industrial-card p-3.5 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between shadow-md ${
                    isSelected
                      ? 'bg-[#132C54] border-[#FFB800] ring-1 ring-[#FFB800]'
                      : 'bg-[#0A1931] border-[#1E3A6D] hover:border-[#2E5A9C]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#1E3A6D] bg-[#071326]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">{v.name}</h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#FFB800] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-[#FFB800] mt-0.5 font-bold">
                        {v.capacityTons} tonnagacha sig‘im
                      </p>
                      <p className="text-[10px] text-sky-200 mt-0.5 font-mono">
                        Baza: {Number(v.basePrice).toLocaleString()} so‘m
                      </p>
                      <p className="text-[10px] text-sky-400 font-mono">
                        + {Number(v.pricePerKm).toLocaleString()} so‘m / km
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#1E3A6D] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-sky-300">Davlat raqami:</span>
                    <span className="bg-[#071326] border border-[#1E3A6D] px-2 py-0.5 rounded text-white font-bold">
                      {v.plateNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Route & Price Calculator Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#0A1931] border border-[#1E3A6D] rounded-2xl p-5 space-y-4 shadow-lg text-white font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3A6D] text-xs">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#FFB800]" />
              2. Marshrut &amp; Yuk Parametrlari
            </span>
            {loadingQuote && <span className="text-[10px] text-[#FFB800] font-mono">Hisoblanmoqda...</span>}
          </div>

          {bookingError && (
            <Alert variant="error" description={bookingError} onDismiss={() => setBookingError(null)} />
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label htmlFor="logistics-origin-input" className="text-sky-200 block text-[10px] uppercase font-bold mb-1">
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
              <label htmlFor="logistics-destination-input" className="text-sky-200 block text-[10px] uppercase font-bold mb-1">
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
                <label htmlFor="logistics-distance-input" className="text-sky-200 block text-[10px] uppercase font-bold mb-1">
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
                <label htmlFor="logistics-weight-input" className="text-sky-200 block text-[10px] uppercase font-bold mb-1">
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
                <label htmlFor="logistics-order-select" className="text-sky-200 block text-[10px] uppercase font-bold mb-1">
                  Mavjud Buyurtmaga Biriktirish (Ixtiyoriy):
                </label>
                <select
                  id="logistics-order-select"
                  name="orderId"
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] text-xs font-mono text-white outline-none cursor-pointer"
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
          <div className="bg-[#071326] border border-[#1E3A6D] rounded-xl p-3.5 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-sky-300">
              <span>Baza tarifi (chiqish):</span>
              <span className="text-white">{selectedVehicle ? Number(selectedVehicle.basePrice).toLocaleString() : 0} so‘m</span>
            </div>
            <div className="flex justify-between text-sky-300">
              <span>Masofa to‘lovi ({distanceKm} km):</span>
              <span className="text-white">
                {selectedVehicle ? (distanceKm * Number(selectedVehicle.pricePerKm)).toLocaleString() : 0} so‘m
              </span>
            </div>
            <div className="pt-2 border-t border-[#1E3A6D] flex justify-between items-center">
              <span className="font-bold text-sky-200 uppercase text-xs">Jami Reys Narxi:</span>
              <span className="text-base font-black text-[#FFB800] font-mono-numbers">
                {totalCostValue.toLocaleString()} so‘m
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBook}
            disabled={isBooking}
            className="w-full btn-industrial-yellow py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg select-none"
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
    </div>
  );
};
