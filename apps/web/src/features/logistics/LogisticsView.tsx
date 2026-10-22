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
        const res = await fetch('/api/logistics/quote', {
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
    <div className="space-y-6">
      {/* 1. Minimalist Logistics Header */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5">
            <span className="text-xs font-mono font-bold text-sky-600 uppercase tracking-wider">
              Dispetcherlik &amp; Marshrut
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-bunker-text-primary">
            Og‘ir Qurilish Texnikalari &amp; Logistika Parki
          </h1>
          <p className="text-xs sm:text-sm text-bunker-text-secondary mt-1">
            HOWO 25t, Shacman mikser va Isuzu kran. Masofa bo‘yicha avtomatik tarif va GPS telemetriya.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="neutral" size="sm" isMono>
            {vehicles.length} ta texnika tayyor
          </Badge>
        </div>
      </div>

      {/* 2. CONFIRMED DISPATCH ACTIVE CARD */}
      {confirmedDispatch && (
        <div className="bg-white border-2 border-bunker-amber-500 p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-bunker-border-strong">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-bunker-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-bunker-text-primary">Reys Tasdiqlandi</h3>
                  <Badge variant="success" size="sm" isMono>
                    STATUS: BIRIKTIRILDI
                  </Badge>
                </div>
                <p className="text-xs text-bunker-text-secondary mt-0.5 font-mono">
                  Dispetcherlik ID: <span className="text-bunker-amber-500 font-bold">{confirmedDispatch.id}</span>
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmedDispatch(null)}
              className="text-xs font-mono"
            >
              Yangi Reys Hisoblash
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <StatCard
              title="Haydovchi"
              value={confirmedDispatch.driverName}
              subtitle={confirmedDispatch.driverPhone}
              variant="amber"
              icon={<Phone className="w-4 h-4 text-bunker-amber-500" />}
            />
            <StatCard
              title="Maxsus Texnika"
              value={confirmedDispatch.vehicleName}
              subtitle={confirmedDispatch.plateNumber}
              variant="default"
              icon={<Truck className="w-4 h-4 text-slate-600" />}
            />
            <StatCard
              title="Masofa & Vaqt"
              value={confirmedDispatch.distanceKm}
              unit="km"
              subtitle={`Taxminiy: ~${confirmedDispatch.estimatedHours} soat`}
              variant="cyan"
              icon={<Navigation className="w-4 h-4 text-bunker-status-cyan" />}
            />
            <StatCard
              title="Jami Reys Narxi"
              value={confirmedDispatch.totalCost.toLocaleString()}
              unit="so'm"
              subtitle="Kafolatlangan reys"
              variant="amber"
              icon={<CheckCircle2 className="w-4 h-4 text-bunker-amber-500" />}
            />
          </div>

          {/* Simple 4-Step Route Tracker */}
          <div className="bg-slate-50 border border-bunker-border-strong p-4 rounded-xl font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Qabul qilindi</span>
              </div>
              <div className="flex items-center gap-2 text-bunker-amber-500 font-bold">
                <Truck className="w-4 h-4" />
                <span>2. Yuklanmoqda</span>
              </div>
              <div className="flex items-center gap-2 text-bunker-text-muted">
                <Navigation className="w-4 h-4" />
                <span>3. Yo'lda</span>
              </div>
              <div className="flex items-center gap-2 text-bunker-text-muted">
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
          <div className="flex items-center justify-between pb-1 border-b border-bunker-border-subtle font-mono text-xs">
            <span className="font-bold text-bunker-text-primary uppercase flex items-center gap-2">
              <Truck className="w-4 h-4 text-bunker-amber-500" />
              1. Maxsus Texnikani Tanlang
            </span>
            <span className="text-bunker-text-muted">{vehicles.length} ta birlik</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all flex flex-col justify-between shadow-xs ${
                    isSelected
                      ? 'bg-amber-50/50 border-bunker-amber-500 ring-2 ring-orange-200'
                      : 'bg-white border-bunker-border-strong hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-bunker-border-subtle bg-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-bunker-text-primary truncate">{v.name}</h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-bunker-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-bunker-amber-500 mt-0.5 font-bold">
                        {v.capacityTons} tonnagacha sig‘im
                      </p>
                      <p className="text-[10px] text-bunker-text-secondary mt-0.5 font-mono">
                        Baza: {Number(v.basePrice).toLocaleString()} so'm
                      </p>
                      <p className="text-[10px] text-bunker-text-muted font-mono">
                        + {Number(v.pricePerKm).toLocaleString()} so'm / km
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-bunker-border-subtle flex items-center justify-between text-[10px] font-mono">
                    <span className="text-bunker-text-muted">Davlat raqami:</span>
                    <Badge variant="neutral" size="sm" isMono>
                      {v.plateNumber}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Route & Price Calculator Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-bunker-border-strong rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-bunker-border-subtle font-mono text-xs">
            <span className="font-bold text-bunker-text-primary uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-bunker-amber-500" />
              2. Marshrut &amp; Yuk Parametrlari
            </span>
            {loadingQuote && <span className="text-[10px] text-bunker-amber-500 font-mono">Hisoblanmoqda...</span>}
          </div>

          {bookingError && (
            <Alert variant="error" description={bookingError} onDismiss={() => setBookingError(null)} />
          )}

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                Yuklash Nuqtasi (Karyer / Zavod):
              </label>
              <Input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Yuk ortish manzili..."
                sizeVariant="sm"
              />
            </div>

            <div>
              <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                Yetkazib Berish Ob'ekti:
              </label>
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Qurilish ob'ekti manzili..."
                sizeVariant="sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                  Masofa (km):
                </label>
                <Input
                  type="number"
                  min="1"
                  max="1500"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Math.max(1, parseInt(e.target.value) || 1))}
                  sizeVariant="sm"
                />
              </div>

              <div>
                <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                  Yuk Og'irligi (t):
                </label>
                <Input
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
                <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                  Mavjud Buyurtmaga Biriktirish (Ixtiyoriy):
                </label>
                <Select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  sizeVariant="sm"
                >
                  <option value="EXPRESS">Alohida ekspress yuk tashish</option>
                  {activeOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} ({Number(o.finalAmount || o.totalAmount).toLocaleString()} so'm)
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          {/* Pricing Summary Box */}
          <div className="bg-slate-50 border border-bunker-border-strong rounded-xl p-3.5 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-bunker-text-secondary">
              <span>Baza tarifi (chiqish):</span>
              <span>{selectedVehicle ? Number(selectedVehicle.basePrice).toLocaleString() : 0} so'm</span>
            </div>
            <div className="flex justify-between text-bunker-text-secondary">
              <span>Masofa to'lovi ({distanceKm} km):</span>
              <span>
                {selectedVehicle ? (distanceKm * Number(selectedVehicle.pricePerKm)).toLocaleString() : 0} so'm
              </span>
            </div>
            <div className="pt-2 border-t border-bunker-border-subtle flex justify-between items-center">
              <span className="font-bold text-bunker-text-primary uppercase text-xs">Jami Reys Narxi:</span>
              <span className="text-base font-extrabold text-bunker-amber-500">
                {totalCostValue.toLocaleString()} so'm
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleBook}
            isLoading={isBooking}
            className="w-full text-xs font-mono font-bold"
          >
            <Truck className="w-4 h-4 mr-2 shrink-0" />
            <span className="hidden sm:inline">Reysni Tasdiqlash &amp; Dispetcherga Yuborish</span>
            <span className="sm:hidden">Reysni Dispetcherga Yuborish</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
