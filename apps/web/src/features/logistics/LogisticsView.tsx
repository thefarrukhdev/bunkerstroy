import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  Calculator,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Navigation,
  Phone,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  PackageCheck,
  Radio,
  Compass,
} from 'lucide-react';
import { LogisticsVehicle, Order } from '@bunkerstroy/types';
import { Button, Badge, Card } from '@bunkerstroy/ui';

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

  // Backend quote calculation state
  const [quote, setQuote] = useState<QuoteCalculation | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Booking & Dispatch state
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('EXPRESS');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedDispatch, setConfirmedDispatch] = useState<ConfirmedDispatch | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
  };

  // 1. Fetch available fleet vehicles from backend
  useEffect(() => {
    fetch('/api/logistics/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setVehicles(data.data);
          setSelectedVehicle(data.data[0]);
        }
      })
      .catch((err) => console.error('Logistics vehicles load error:', err));
  }, []);

  // 2. Fetch user's active orders for optional dispatch linking
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const pendings = data.data.filter(
            (o: Order) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'ASSIGNED_TO_FLEET'
          );
          setActiveOrders(pendings);
        }
      })
      .catch((err) => console.warn('Active orders fetch error:', err));
  }, []);

  // 3. Dynamically call POST /api/logistics/calculate-quote when parameters change (debounced 200ms)
  useEffect(() => {
    if (!selectedVehicle) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setLoadingQuote(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/logistics/calculate-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicleId: selectedVehicle.id,
            distanceKm: Number(distanceKm),
            cargoWeightTons: Number(weightTons),
          }),
        });

        const json = await res.json();
        if (res.ok && json.success && json.data) {
          setQuote(json.data);
        }
      } catch (err) {
        console.error('Calculate quote error:', err);
      } finally {
        setLoadingQuote(false);
      }
    }, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedVehicle, distanceKm, weightTons]);

  // Fallback price calculator if quote hasn't returned yet
  const totalCostValue =
    quote?.totalCost ??
    (selectedVehicle ? selectedVehicle.basePrice + distanceKm * selectedVehicle.pricePerKm : 0);

  // 4. Handle Book Trip (Reysni band qilish)
  const handleBook = async () => {
    if (!selectedVehicle) return;

    setIsBooking(true);
    setBookingError(null);

    const token = getToken();

    try {
      if (token) {
        // Authenticated real dispatch request
        const res = await fetch('/api/logistics/dispatch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: selectedOrderId === 'EXPRESS' ? 'EXPRESS' : selectedOrderId,
            vehicleId: selectedVehicle.id,
            origin,
            destination,
            distanceKm: Number(distanceKm),
          }),
        });

        const json = await res.json();
        if (res.ok && json.success && json.data) {
          const d = json.data;
          setConfirmedDispatch({
            id: d.id,
            orderId: d.order?.orderNumber || d.orderId,
            vehicleId: selectedVehicle.id,
            driverName: d.driver?.displayName || d.vehicle?.driverName || selectedVehicle.driverName || 'Sherzod Baxtiyorov',
            driverPhone: d.driver?.phone || d.vehicle?.driverPhone || selectedVehicle.driverPhone || '+998901114455',
            vehicleName: d.vehicle?.name || selectedVehicle.name,
            plateNumber: d.vehicle?.plateNumber || selectedVehicle.plateNumber || '01 777 BSK',
            status: d.status || 'ASSIGNED',
            origin: d.origin,
            destination: d.destination,
            distanceKm: d.distanceKm,
            totalCost: Number(d.totalCost),
            estimatedHours: quote?.estimatedHours || Math.round((distanceKm / 35) * 10) / 10 + 1,
            dispatchedAt: d.dispatchedAt || new Date().toISOString(),
          });
        } else {
          setBookingError(json.message || 'Reysni biriktirishda xatolik yuz berdi');
        }
      } else {
        // Unauthenticated demo booking: instant confirmation preview
        setConfirmedDispatch({
          id: `BS-DISP-${Math.floor(100000 + Math.random() * 900000)}`,
          orderId: `BS-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
          vehicleId: selectedVehicle.id,
          driverName: selectedVehicle.driverName || 'Sherzod Baxtiyorov',
          driverPhone: selectedVehicle.driverPhone || '+998901114455',
          vehicleName: selectedVehicle.name,
          plateNumber: selectedVehicle.plateNumber || '01 777 BSK',
          status: 'ASSIGNED',
          origin,
          destination,
          distanceKm,
          totalCost: totalCostValue,
          estimatedHours: quote?.estimatedHours || Math.round((distanceKm / 35) * 10) / 10 + 1,
          dispatchedAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error('Dispatch booking error:', err);
      setBookingError('Server bilan aloqa uzildi. Iltimos qayta urinib ko‘ring.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden border border-[#33373B] bg-gradient-to-r from-[#1C1F22] via-[#1A1D20] to-[#2B2313] p-6 sm:p-10 shadow-2xl">
        <div className="h-1.5 w-full hazard-stripe-sm absolute top-0 left-0" />
        <div className="max-w-3xl space-y-3">
          <Badge variant="warning" className="gap-1.5 font-mono">
            <Truck className="w-3.5 h-3.5" />
            BunkerStroy Og'ir Yuk Logistikasi & Maxsus Texnikalar
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-[#F5F5F2]">
            Qurilish ob'ektlariga to'g'ridan-to'g'ri yetkazib berish
          </h1>
          <p className="text-sm text-[#B8B8B3]">
            Samosvallar (HOWO, Shacman), avtokran-manipulyatorlar va beton mikserlari. GPS marshrut monitoringi,
            avtomatlashtirilgan dispetcherlik va kafolatlangan reyslar.
          </p>
        </div>
      </div>

      {/* CONFIRMED DISPATCH ACTIVE CARD */}
      {confirmedDispatch && (
        <div className="bg-[#1A1D20] border-2 border-[#FFB800] p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl shadow-[#FFB800]/10 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#33373B]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB800]/20 border border-[#FFB800]/40 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#FFB800]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#F5F5F2]">Reys Muvaffaqiyatli Band Qilindi!</h3>
                  <Badge variant="success" className="font-mono text-[10px]">
                    STATUS: BIRIKTIRILDI
                  </Badge>
                </div>
                <p className="text-xs text-[#B8B8B3] mt-0.5 font-mono">
                  Dispetcherlik ID: <span className="text-[#FFB800] font-bold">{confirmedDispatch.id}</span> | Buyurtma:{' '}
                  <span className="text-[#F5F5F2]">{confirmedDispatch.orderId}</span>
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmedDispatch(null)}
              className="text-xs"
            >
              Yangi Reys Hisoblash
            </Button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#151719] p-4 rounded-2xl border border-[#33373B] space-y-1">
              <span className="text-[10px] text-[#777A7C] uppercase font-mono block">Haydovchi:</span>
              <p className="font-bold text-sm text-[#F5F5F2]">{confirmedDispatch.driverName}</p>
              <a
                href={`tel:${confirmedDispatch.driverPhone}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#FFB800] hover:underline font-mono mt-1"
              >
                <Phone className="w-3.5 h-3.5" />
                {confirmedDispatch.driverPhone}
              </a>
            </div>

            <div className="bg-[#151719] p-4 rounded-2xl border border-[#33373B] space-y-1">
              <span className="text-[10px] text-[#777A7C] uppercase font-mono block">Maxsus Texnika:</span>
              <p className="font-bold text-sm text-[#F5F5F2] truncate">{confirmedDispatch.vehicleName}</p>
              <Badge variant="warning" className="font-mono text-[10px] mt-1">
                {confirmedDispatch.plateNumber}
              </Badge>
            </div>

            <div className="bg-[#151719] p-4 rounded-2xl border border-[#33373B] space-y-1">
              <span className="text-[10px] text-[#777A7C] uppercase font-mono block">Marshrut va Masofa:</span>
              <p className="font-bold text-[#F5F5F2] font-mono">{confirmedDispatch.distanceKm} km</p>
              <span className="text-[11px] text-[#B8B8B3] block">
                Taxminiy vaqt: ~{confirmedDispatch.estimatedHours} soat
              </span>
            </div>

            <div className="bg-[#151719] p-4 rounded-2xl border border-[#33373B] space-y-1">
              <span className="text-[10px] text-[#777A7C] uppercase font-mono block">Jami Reys To‘lovi:</span>
              <p className="text-lg font-black text-[#FFB800] font-mono">
                {confirmedDispatch.totalCost.toLocaleString()} so'm
              </p>
              <span className="text-[11px] text-emerald-400 font-mono">Kafolatlangan yetkazish</span>
            </div>
          </div>

          {/* Visual Route Progression Timeline */}
          <div className="bg-[#151719] border border-[#33373B] p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-[#F5F5F2] uppercase font-mono flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#FFB800]" />
              Real Vaqt Marshrut Bosqichlari (GPS Live Tracking)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="flex items-start gap-3 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#F5F5F2]">1. Qabul Qilindi</h5>
                  <p className="text-[10px] text-[#B8B8B3]">Dispetcherlik tasdiqladi</p>
                  <span className="text-[9px] font-mono text-emerald-400 mt-0.5 block">Bajarildi</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 relative">
                <div className="w-8 h-8 rounded-full bg-[#FFB800]/20 border-2 border-[#FFB800] flex items-center justify-center shrink-0 animate-pulse">
                  <Truck className="w-4 h-4 text-[#FFB800]" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#FFB800]">2. Haydovchi Biriktirildi</h5>
                  <p className="text-[10px] text-[#B8B8B3]">{confirmedDispatch.driverName}</p>
                  <span className="text-[9px] font-mono text-[#FFB800] mt-0.5 block">Karyerda yuklanmoqda</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 relative opacity-60">
                <div className="w-8 h-8 rounded-full bg-[#292C2F] border-2 border-[#51504A] flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4 text-[#B8B8B3]" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#F5F5F2]">3. Yuk Yo‘lda</h5>
                  <p className="text-[10px] text-[#B8B8B3]">GPS monitoring faol</p>
                  <span className="text-[9px] font-mono text-[#777A7C] mt-0.5 block">Kutilmoqda</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 relative opacity-60">
                <div className="w-8 h-8 rounded-full bg-[#292C2F] border-2 border-[#51504A] flex items-center justify-center shrink-0">
                  <PackageCheck className="w-4 h-4 text-[#B8B8B3]" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#F5F5F2]">4. Ob'ektda Qabul Qilish</h5>
                  <p className="text-[10px] text-[#B8B8B3]">{confirmedDispatch.destination}</p>
                  <span className="text-[9px] font-mono text-[#777A7C] mt-0.5 block">Yakuniy qadam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Vehicles + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vehicles list */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold text-[#F5F5F2] uppercase tracking-wider font-mono flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#FFB800]" />
            1. Maxsus texnika turini tanlang
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-[#FFB800]/15 border-[#FFB800] shadow-lg shadow-[#FFB800]/10 scale-[1.01]'
                      : 'bg-[#1A1D20] border-[#33373B] hover:border-[#51504A]'
                  }`}
                >
                  <img
                    src={v.imageUrl}
                    alt={v.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#33373B]"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#F5F5F2] truncate">{v.name}</h4>
                    <p className="text-[11px] font-mono text-[#FFB800] mt-0.5">{v.capacityTons} tonnagacha sig‘im</p>
                    <p className="text-[10px] text-[#B8B8B3] mt-0.5">
                      Baza: {Number(v.basePrice).toLocaleString()} so'm
                    </p>
                    <p className="text-[10px] text-[#777A7C] font-mono">
                      {Number(v.pricePerKm).toLocaleString()} so'm / km
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calculation Panel */}
        <div className="lg:col-span-5 bg-[#1A1D20] border border-[#33373B] p-6 rounded-3xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#33373B]">
            <h3 className="font-bold text-[#F5F5F2] flex items-center gap-2 text-sm">
              <Calculator className="w-4 h-4 text-[#FFB800]" />
              Yuk Tashish Kalkulyatori
            </h3>
            {selectedVehicle && (
              <Badge variant="info" className="text-[10px] font-mono">
                {selectedVehicle.type.replace(/_/g, ' ')}
              </Badge>
            )}
          </div>

          {bookingError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{bookingError}</span>
            </div>
          )}

          <div className="space-y-4 text-xs font-semibold text-[#B8B8B3]">
            {/* Optional order selector if active orders exist */}
            {activeOrders.length > 0 && (
              <div>
                <label className="block mb-1.5 text-[#F5F5F2]">Biriktiriladigan buyurtma:</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full bg-[#151719] border border-[#33373B] focus:border-[#FFB800] p-2.5 rounded-xl text-xs text-[#F5F5F2] outline-none"
                >
                  <option value="EXPRESS">Ekspress transport (Yangi to‘g‘ridan-to‘g‘ri reys)</option>
                  {activeOrders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.orderNumber} — {ord.buyerName} ({Number(ord.finalAmount).toLocaleString()} so'm)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block mb-1.5">Yuklash manzili (Origin):</label>
              <div className="relative">
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-[#151719] border border-[#33373B] focus:border-[#FFB800] p-2.5 rounded-xl text-[#F5F5F2] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5">Yetkazish manzili (Destination):</label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#151719] border border-[#33373B] focus:border-[#FFB800] p-2.5 rounded-xl text-[#F5F5F2] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label>Masofa:</label>
                  <span className="text-[#FFB800] font-mono font-bold">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-[#FFB800] cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label>Yuk og'irligi:</label>
                  <span className="text-[#FFB800] font-mono font-bold">{weightTons} t</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="35"
                  value={weightTons}
                  onChange={(e) => setWeightTons(Number(e.target.value))}
                  className="w-full accent-[#FFB800] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Official Backend Price Summary */}
          <div className="bg-[#151719] border border-[#33373B] p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs text-[#B8B8B3]">
              <span>Boshlang'ich reys narxi:</span>
              <span className="font-mono text-[#F5F5F2]">
                {Number(quote?.baseCost ?? selectedVehicle?.basePrice ?? 0).toLocaleString()} so'm
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#B8B8B3]">
              <span>Masofa to'lovi ({distanceKm} km):</span>
              <span className="font-mono text-[#F5F5F2]">
                {Number(
                  quote?.distanceCost ?? (selectedVehicle ? distanceKm * selectedVehicle.pricePerKm : 0)
                ).toLocaleString()}{' '}
                so'm
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#B8B8B3]">
              <span>Kutilayotgan yetkazish vaqti:</span>
              <span className="font-mono text-[#FFB800] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{quote?.estimatedHours || Math.round((distanceKm / 35) * 10) / 10 + 1} soat
              </span>
            </div>

            <div className="pt-2 border-t border-[#33373B] flex justify-between items-baseline">
              <span className="font-bold text-sm text-[#F5F5F2]">Jami rasmiy narx:</span>
              <div className="flex items-center gap-2">
                {loadingQuote && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFB800]" />}
                <span className="text-xl font-black text-[#FFB800] font-mono">
                  {totalCostValue.toLocaleString()} so'm
                </span>
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleBook}
            isLoading={isBooking}
          >
            <Truck className="w-5 h-5 mr-1" />
            <span>Reysni Band Qilish</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
