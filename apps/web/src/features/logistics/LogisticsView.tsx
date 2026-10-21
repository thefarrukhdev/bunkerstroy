import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  Calculator,
  CheckCircle2,
  Navigation,
  Phone,
  Clock,
  RefreshCw,
  PackageCheck,
  Compass,
  FileCode
} from 'lucide-react';
import { LogisticsVehicle, Order } from '@bunkerstroy/types';
import { Button, Badge, Card, Input, Select, Alert, StatCard, Modal } from '@bunkerstroy/ui';

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

interface TechnicalBlueprint {
  vehicleType: string;
  modelName: string;
  payloadCapacity: string;
  engine: string;
  powerOutput: string;
  torque: string;
  transmission: string;
  axleFormula: string;
  bodyVolume: string;
  hydraulicSystem: string;
  dimensions: string;
  fuelTank: string;
  schematicDetails: string[];
}

const TECHNICAL_BLUEPRINTS: Record<string, TechnicalBlueprint> = {
  HOWO_25T: {
    vehicleType: 'HOWO_25T',
    modelName: 'HOWO Sinotruk 25t Og‘ir Samosval',
    payloadCapacity: '25,000 kg (Nominal)',
    engine: 'Weichai WP10.380E32 (Evro-4 / Dizel)',
    powerOutput: '380 ot kuchi (280 kVt) @ 2200 ayl/daq',
    torque: '1,500 Nm @ 1100-1600 ayl/daq',
    transmission: 'HW19710 (10 oldinga, 2 orqaga)',
    axleFormula: '6x4 (Ikki yetakchi og‘ir reduktorli ko‘prik)',
    bodyVolume: '19.3 m³ (U-simon mustahkamlangan HARDOX po‘lat)',
    hydraulicSystem: 'HYVA old silindrli gidravlik ko‘tarish',
    dimensions: '8,545 × 2,496 × 3,450 mm',
    fuelTank: '380 litr alyuminiy bak',
    schematicDetails: [
      'Shassi ramasi: Ikki qavatli mustahkamlangan 8+8 mm legirlangan po‘lat',
      'Tormoz tizimi: WABCO ABS ikki konturli pnevmatik barabanli tormoz',
      'Kuzov isitish: Qishki rejimda chiqindi gazlar bilan tub isitish tizimi',
      'Telemetriya: Bunker-GPS Onlayn og‘irlik datchigi (±1.5% xatolik)'
    ]
  },
  SHACMAN_MIXER: {
    vehicleType: 'SHACMAN_MIXER',
    modelName: 'Shacman F3000 10m³ Avtobeton Mikser',
    payloadCapacity: '10 m³ suyuq beton qorishmasi',
    engine: 'Cummins ISM11E4 385 (Evro-4)',
    powerOutput: '385 ot kuchi (283 kVt) @ 1900 ayl/daq',
    torque: '1,825 Nm @ 1200 ayl/daq',
    transmission: 'Fast Fuller 12JSD200T (Sinxronizatorli)',
    axleFormula: '6x4 (MAN 16t reduktorli ko‘priklar)',
    bodyVolume: '10 m³ geometrik aylanma baraban (Q345 yuqori chidamli)',
    hydraulicSystem: 'Eaton (AQSh) gidronasos va motor, PMP reduktor (Italiya)',
    dimensions: '9,450 × 2,500 × 3,950 mm',
    fuelTank: '400 litr + 450 litr pnevmatik suv baki',
    schematicDetails: [
      'Baraban aylanish tezligi: 0 - 16 ayl/daq (beton qotib qolishini oldini oluvchi rejim)',
      'Beton tushirish tezligi: ≥ 2 m³/daqiqada tezlik bilan uzatish',
      'Gidravlik sovutish: AKG (Germaniya) avtomatik ventilyatorli radiator',
      'Yuvish tizimi: 0.4 MPa pnevmatik yuqori bosimli suv purkash liniyasi'
    ]
  },
  ISUZU_CRANE: {
    vehicleType: 'ISUZU_CRANE',
    modelName: 'Isuzu FVR 10t Bort Kran-Manipulyator',
    payloadCapacity: '10,000 kg bort yuk / 4,500 kg kran quvvati',
    engine: 'Isuzu 6HK1-TCS (Yaponiya / Dizel Turbo)',
    powerOutput: '280 ot kuchi (206 kVt) @ 2400 ayl/daq',
    torque: '882 Nm @ 1450 ayl/daq',
    transmission: 'Isuzu MZW6P (6 bosqichli mexanik)',
    axleFormula: '4x2 (Shahar ichi tor qurilish ob‘ektlari uchun manyovrli)',
    bodyVolume: 'Bort o‘lchamlari: 6,200 × 2,450 × 600 mm',
    hydraulicSystem: 'UNIC / Soosan 4-seksiyali teleskopik strela (12.8 m radius)',
    dimensions: '8,990 × 2,490 × 3,350 mm',
    fuelTank: '200 litr korroziyaga chidamli po‘lat bak',
    schematicDetails: [
      'Kran strelasi burchagi: 1° dan 78° gacha uzluksiz gidravlik burilish',
      'Autrigerlar (tayanch oyoqlar): 4 nuqtali kengaytirilgan gidravlik tirgaklar',
      'Xavfsizlik tizimi: Haddan ortiq yuk ko‘tarishni avtomatik bloklash datchigi',
      'Bort materiali: Yengil va mustahkam gofrirlangan po‘lat'
    ]
  },
  TIR_35T: {
    vehicleType: 'TIR_35T',
    modelName: 'TIR 35t Uzoq Masofali Tentli Avtopoyezd',
    payloadCapacity: '35,000 kg (33 evropallet / 86 m³)',
    engine: 'KamAZ / Mercedes-Benz OM457LA (Evro-5)',
    powerOutput: '401 ot kuchi (295 kVt) @ 1900 ayl/daq',
    torque: '2,000 Nm @ 1100 ayl/daq',
    transmission: 'ZF 16S2220TD (16 bosqichli intarderli)',
    axleFormula: '6x4 Tyagach + 3 o‘qli SAF tirkama pnevmatik podveska',
    bodyVolume: '86 m³ (KOD-XL xalqaro sertifikatiga ega tentli yarim tirkama)',
    hydraulicSystem: 'Pnevmatik podveska balandlik regulyatori bilan',
    dimensions: '16,500 × 2,550 × 4,000 mm (Avtopoyezd uzunligi)',
    fuelTank: '600 + 400 litr (1000 litr umumiy uzoq reys zaxirasi)',
    schematicDetails: [
      'Xalqaro sertifikat: TIR Carnet, CMR va xalqaro bojxona plombalash mosligi',
      'Podveska: SAF Holland integral diskli pnevmatik o‘qlar',
      'Tormoz: EBS, ESP, ASR elektron tormoz va kurs barqarorligi tizimi',
      'Telemetriya: 24/7 sun‘iy yo‘ldosh GPS va eshik ochilish datchiklari'
    ]
  }
};

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

  // Blueprint Modal State
  const [selectedBlueprint, setSelectedBlueprint] = useState<TechnicalBlueprint | null>(null);

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
      headers: { Authorization: `Bearer ${token}` }
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
            cargoWeightTons: Number(weightTons)
          })
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
        const res = await fetch('/api/logistics/dispatch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId: selectedOrderId === 'EXPRESS' ? 'EXPRESS' : selectedOrderId,
            vehicleId: selectedVehicle.id,
            origin,
            destination,
            distanceKm: Number(distanceKm)
          })
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
            dispatchedAt: d.dispatchedAt || new Date().toISOString()
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
          dispatchedAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error('Dispatch booking error:', err);
      setBookingError('Server bilan aloqa uzildi. Iltimos qayta urinib ko‘ring.');
    } finally {
      setIsBooking(false);
    }
  };

  // Helper to open blueprint
  const handleOpenBlueprint = (vehicleType: string) => {
    const bp = TECHNICAL_BLUEPRINTS[vehicleType] || TECHNICAL_BLUEPRINTS['HOWO_25T'];
    setSelectedBlueprint(bp);
  };

  return (
    <div className="space-y-6">
      {/* 1. Tactical Fleet Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-bunker-border-strong bg-gradient-to-r from-bunker-surface-1 via-bunker-surface-2 to-[#2C2314] p-6 sm:p-10 shadow-2xl">
        <div className="h-1.5 w-full hazard-stripe-sm absolute top-0 left-0" />
        <div className="max-w-3xl space-y-3">
          <Badge variant="warning" className="gap-1.5 font-mono">
            <Truck className="w-3.5 h-3.5" />
            BunkerStroy Og'ir Logistika & Texnik Chizmalar Markazi
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-bunker-text-primary tracking-tight">
            Sanoat Texnikalari: HOWO, Shacman Mikser, Isuzu Kran & TIR
          </h1>
          <p className="text-sm text-bunker-text-secondary leading-relaxed">
            Qurilish ob'ektlariga to‘g‘ridan-to‘g‘ri yetkazib beruvchi maxsus park. Masofa bo‘yicha avtomatik narx
            kalkulyatsiyasi, GPS jonli monitoring va muhandislik spetsifikatsiyalari (Blueprints).
          </p>
        </div>
      </div>

      {/* 2. CONFIRMED DISPATCH ACTIVE CARD (4-Step Route Progress Tracker) */}
      {confirmedDispatch && (
        <div className="bg-bunker-surface-1 border-2 border-bunker-amber-500 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl shadow-bunker-amber-500/10 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-bunker-border-strong">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-bunker-amber-500/20 border border-bunker-amber-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-bunker-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-bunker-text-primary">Reys Muvaffaqiyatli Band Qilindi!</h3>
                  <Badge variant="success" className="font-mono text-[10px]">
                    STATUS: BIRIKTIRILDI
                  </Badge>
                </div>
                <p className="text-xs text-bunker-text-secondary mt-0.5 font-mono">
                  Dispetcherlik ID: <span className="text-bunker-amber-500 font-bold">{confirmedDispatch.id}</span> | Buyurtma:{' '}
                  <span className="text-bunker-text-primary">{confirmedDispatch.orderId}</span>
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

          {/* Details Grid Using StatCard Component */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Haydovchi"
              value={confirmedDispatch.driverName}
              subtitle={confirmedDispatch.driverPhone}
              variant="amber"
              icon={<Phone className="w-4 h-4" />}
            />

            <StatCard
              title="Maxsus Texnika"
              value={confirmedDispatch.vehicleName}
              subtitle={confirmedDispatch.plateNumber}
              variant="default"
              icon={<Truck className="w-4 h-4" />}
            />

            <StatCard
              title="Marshrut va Masofa"
              value={confirmedDispatch.distanceKm}
              unit="km"
              subtitle={`Taxminiy: ~${confirmedDispatch.estimatedHours} soat`}
              variant="cyan"
              icon={<Navigation className="w-4 h-4" />}
            />

            <StatCard
              title="Jami Reys To‘lovi"
              value={confirmedDispatch.totalCost.toLocaleString()}
              unit="so'm"
              subtitle="Kafolatlangan marshrut"
              variant="amber"
              icon={<CheckCircle2 className="w-4 h-4" />}
            />
          </div>

          {/* 4-Step Route Progress Tracker */}
          <div className="bg-bunker-base border border-bunker-border-strong p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-bunker-text-primary uppercase font-mono flex items-center gap-2">
              <Compass className="w-4 h-4 text-bunker-amber-500" />
              4 Bosqichli Real Vaqt Marshrut Dispetcherligi (GPS Telemetriya)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="flex items-start gap-3 relative">
                <div className="w-9 h-9 rounded-full bg-bunker-status-green/20 border-2 border-bunker-status-green flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-bunker-status-green" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-bunker-text-primary">1. Qabul Qilindi</h5>
                  <p className="text-[10px] text-bunker-text-secondary">Dispetcherlik tasdiqladi</p>
                  <span className="text-[9px] font-mono text-bunker-status-green mt-0.5 block font-bold">BAJARILDI</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 relative">
                <div className="w-9 h-9 rounded-full bg-bunker-amber-500/20 border-2 border-bunker-amber-500 flex items-center justify-center shrink-0 animate-pulse">
                  <Truck className="w-5 h-5 text-bunker-amber-500" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-bunker-amber-500">2. Yuklanmoqda</h5>
                  <p className="text-[10px] text-bunker-text-secondary">{confirmedDispatch.driverName}</p>
                  <span className="text-[9px] font-mono text-bunker-amber-500 mt-0.5 block font-bold">Karyerda ortilmoqda</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 relative opacity-60">
                <div className="w-9 h-9 rounded-full bg-bunker-surface-2 border-2 border-bunker-border-strong flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4 text-bunker-text-muted" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-bunker-text-primary">3. Marshrutda (Yo'lda)</h5>
                  <p className="text-[10px] text-bunker-text-secondary">GPS monitoring faol</p>
                  <span className="text-[9px] font-mono text-bunker-text-muted mt-0.5 block">Kutilmoqda</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 relative opacity-60">
                <div className="w-9 h-9 rounded-full bg-bunker-surface-2 border-2 border-bunker-border-strong flex items-center justify-center shrink-0">
                  <PackageCheck className="w-4 h-4 text-bunker-text-muted" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-bunker-text-primary">4. Ob'ektda Qabul Qilish</h5>
                  <p className="text-[10px] text-bunker-text-secondary truncate max-w-[150px]">{confirmedDispatch.destination}</p>
                  <span className="text-[9px] font-mono text-bunker-text-muted mt-0.5 block">E-IMZO dalolatnoma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Fleet Command Deck Grid: Vehicles + Blueprint Actions + Dynamic Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vehicles list & CAD blueprints */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-bunker-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
              <Truck className="w-4 h-4 text-bunker-amber-500" />
              1. Maxsus Texnika Parki & Muhandislik Chizmalari
            </h2>
            <span className="text-xs text-bunker-text-muted font-mono">{vehicles.length} ta birlik mavjud</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-bunker-surface-2 border-bunker-amber-500 shadow-lg shadow-bunker-amber-500/10'
                      : 'bg-bunker-surface-1 border-bunker-border-strong hover:border-bunker-border-active'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-bunker-border-subtle bg-bunker-base"
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
                      <p className="text-[10px] text-bunker-text-secondary mt-0.5">
                        Baza: {Number(v.basePrice).toLocaleString()} so'm
                      </p>
                      <p className="text-[10px] text-bunker-text-muted font-mono">
                        {Number(v.pricePerKm).toLocaleString()} so'm / km
                      </p>
                    </div>
                  </div>

                  {/* Blueprint CTA */}
                  <div className="mt-3 pt-2.5 border-t border-bunker-border-subtle flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBlueprint(v.type);
                      }}
                      className="text-[10px] font-mono font-bold text-bunker-amber-500 hover:text-bunker-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Muhandislik Chizmasi (Blueprint)</span>
                    </button>

                    <Badge variant="neutral" className="text-[9px] font-mono">
                      {v.plateNumber}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Calculator & Booking Command Panel */}
        <div className="lg:col-span-5 bg-bunker-surface-1 border border-bunker-border-strong p-6 rounded-3xl space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-bunker-border-subtle">
            <h3 className="font-bold text-bunker-text-primary flex items-center gap-2 text-sm font-mono">
              <Calculator className="w-4 h-4 text-bunker-amber-500" />
              Yuk Tashish Dinamik Kalkulyatori
            </h3>
            {selectedVehicle && (
              <Badge variant="info" className="text-[10px] font-mono">
                {selectedVehicle.type.replace(/_/g, ' ')}
              </Badge>
            )}
          </div>

          {bookingError && (
            <Alert
              variant="error"
              description={bookingError}
              onDismiss={() => setBookingError(null)}
            />
          )}

          <div className="space-y-4 text-xs font-semibold text-bunker-text-secondary">
            {/* Optional order selector if active orders exist */}
            {activeOrders.length > 0 && (
              <Select
                label="Biriktiriladigan buyurtma:"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
              >
                <option value="EXPRESS">Ekspress transport (Yangi to‘g‘ridan-to‘g‘ri reys)</option>
                {activeOrders.map((ord) => (
                  <option key={ord.id} value={ord.id}>
                    {ord.orderNumber} — {ord.buyerName} ({Number(ord.finalAmount).toLocaleString()} so'm)
                  </option>
                ))}
              </Select>
            )}

            <Input
              label="Yuklash manzili (Karyer / Baza):"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />

            <Input
              label="Yetkazish manzili (Qurilish ob'ekti):"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between mb-1.5 font-mono text-[11px]">
                  <label>Masofa:</label>
                  <span className="text-bunker-amber-500 font-bold">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-bunker-amber-500 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5 font-mono text-[11px]">
                  <label>Yuk og'irligi:</label>
                  <span className="text-bunker-amber-500 font-bold">{weightTons} t</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="35"
                  value={weightTons}
                  onChange={(e) => setWeightTons(Number(e.target.value))}
                  className="w-full accent-bunker-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Official Backend Price Summary */}
          <div className="bg-bunker-base border border-bunker-border-strong p-4 rounded-2xl space-y-2 font-mono">
            <div className="flex justify-between items-center text-xs text-bunker-text-secondary">
              <span>Boshlang'ich baza tarifi:</span>
              <span className="text-bunker-text-primary">
                {Number(quote?.baseCost ?? selectedVehicle?.basePrice ?? 0).toLocaleString()} so'm
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-bunker-text-secondary">
              <span>Masofa qiymati ({distanceKm} km):</span>
              <span className="text-bunker-text-primary">
                {Number(quote?.distanceCost ?? (selectedVehicle ? distanceKm * selectedVehicle.pricePerKm : 0)).toLocaleString()}{' '}
                so'm
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-bunker-text-secondary">
              <span>Taxminiy yetkazish vaqti:</span>
              <span className="text-bunker-amber-500 flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5" />
                ~{quote?.estimatedHours || Math.round((distanceKm / 35) * 10) / 10 + 1} soat
              </span>
            </div>

            <div className="pt-2 border-t border-bunker-border-subtle flex justify-between items-baseline">
              <span className="font-bold text-sm text-bunker-text-primary">Jami rasmiy narx:</span>
              <div className="flex items-center gap-2">
                {loadingQuote && <RefreshCw className="w-3.5 h-3.5 animate-spin text-bunker-amber-500" />}
                <span className="text-xl font-black text-bunker-amber-500">
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
            <span>Reysni Rasmiylashtirish & Yuborish</span>
          </Button>
        </div>
      </div>

      {/* 4. TECHNICAL BLUEPRINT CAD MODAL (Using Modal Component) */}
      {selectedBlueprint && (
        <Modal
          isOpen={!!selectedBlueprint}
          onClose={() => setSelectedBlueprint(null)}
          size="lg"
          headerExtra={
            <div className="w-10 h-10 rounded-xl bg-bunker-amber-500/20 border border-bunker-amber-500/50 flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5 text-bunker-amber-500" />
            </div>
          }
          title={selectedBlueprint.modelName}
          subtitle="TEXNIK CHIZMA & ZAVOD PARAMETRLARI (CAD SPECIFICATION)"
          footer={
            <Button variant="primary" onClick={() => setSelectedBlueprint(null)}>
              Tushunarli / Yopish
            </Button>
          }
        >
          {/* CAD Wireframe Visualizer */}
          <div className="relative bg-bunker-vault border border-bunker-border-strong rounded-2xl p-5 overflow-hidden font-mono text-xs">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFB800_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="flex items-center justify-between text-bunker-text-muted text-[11px] mb-3">
              <span>[BUNKER-CAD v4.8] ARCHITECTURAL WIREFRAME</span>
              <span className="text-bunker-status-green">ONLINE KALIBROVKA</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-bunker-surface-1/80 border border-bunker-border-subtle p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-bunker-text-muted uppercase block">Dvigatel & Quvvat:</span>
                <p className="font-bold text-bunker-text-primary">{selectedBlueprint.engine}</p>
                <span className="text-[11px] text-bunker-amber-500 block">{selectedBlueprint.powerOutput}</span>
              </div>

              <div className="bg-bunker-surface-1/80 border border-bunker-border-subtle p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-bunker-text-muted uppercase block">Aylanish momenti:</span>
                <p className="font-bold text-bunker-text-primary">{selectedBlueprint.torque}</p>
                <span className="text-[11px] text-bunker-text-secondary block">Ko'prik: {selectedBlueprint.axleFormula}</span>
              </div>

              <div className="bg-bunker-surface-1/80 border border-bunker-border-subtle p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-bunker-text-muted uppercase block">Foydali Sig'im:</span>
                <p className="font-bold text-bunker-amber-500">{selectedBlueprint.payloadCapacity}</p>
                <span className="text-[11px] text-bunker-text-secondary block">{selectedBlueprint.bodyVolume}</span>
              </div>

              <div className="bg-bunker-surface-1/80 border border-bunker-border-subtle p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-bunker-text-muted uppercase block">Uzatmalar qutisi:</span>
                <p className="font-bold text-bunker-text-primary">{selectedBlueprint.transmission}</p>
              </div>

              <div className="bg-bunker-surface-1/80 border border-bunker-border-subtle p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-bunker-text-muted uppercase block">Gidravlika tizimi:</span>
                <p className="font-bold text-bunker-text-primary truncate">{selectedBlueprint.hydraulicSystem}</p>
              </div>

              <div className="bg-bunker-surface-1/80 border border-bunker-border-subtle p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-bunker-text-muted uppercase block">Gabarit o'lchamlar:</span>
                <p className="font-bold text-bunker-text-primary">{selectedBlueprint.dimensions}</p>
              </div>
            </div>

            {/* Detailed schematic bullets */}
            <div className="mt-4 pt-3 border-t border-bunker-border-subtle space-y-2">
              <span className="text-[11px] font-bold text-bunker-amber-500 uppercase block">
                Texnik Standartlar & Xavfsizlik Sertifikati:
              </span>
              <div className="space-y-1.5 text-[11px] text-bunker-text-secondary">
                {selectedBlueprint.schematicDetails.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-bunker-amber-500 font-bold shrink-0">►</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
