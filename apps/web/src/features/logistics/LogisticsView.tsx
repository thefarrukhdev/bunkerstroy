import React, { useState, useEffect } from 'react';
import { Truck, Calculator, MapPin, CheckCircle2, ShieldCheck, Navigation } from 'lucide-react';
import { LogisticsVehicle } from '@bunkerstroy/types';
import { Button, Badge, Card } from '@bunkerstroy/ui';

export const LogisticsView: React.FC = () => {
  const [vehicles, setVehicles] = useState<LogisticsVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<LogisticsVehicle | null>(null);
  const [distanceKm, setDistanceKm] = useState(25);
  const [weightTons, setWeightTons] = useState(15);
  const [origin, setOrigin] = useState('Keles daryosi qum-shag‘al karyeri');
  const [destination, setDestination] = useState('Toshkent sh., Yunusobod 14-mavze');
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    fetch('/api/logistics/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setVehicles(data.data);
          setSelectedVehicle(data.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const calculateTotal = () => {
    if (!selectedVehicle) return 0;
    return selectedVehicle.basePrice + distanceKm * selectedVehicle.pricePerKm;
  };

  const handleBook = () => {
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden border border-[#33373B] bg-gradient-to-r from-[#1C1F22] via-[#1A1D20] to-[#2B2313] p-6 sm:p-10 shadow-2xl">
        <div className="h-1.5 w-full hazard-stripe-sm absolute top-0 left-0" />
        <div className="max-w-3xl space-y-3">
          <Badge variant="warning" className="gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            BunkerStroy Og'ir Yuk Logistikasi & Maxsus Texnikalar
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-[#F5F5F2]">
            Qurilish ob'ektlariga to'g'ridan-to'g'ri yetkazib berish
          </h1>
          <p className="text-sm text-[#B8B8B3]">
            Samosvallar (HOWO, Shacman), avtokran-manipulyatorlar va beton mikserlari. GPS marshrut monitoringi va kafolatlangan reyslar.
          </p>
        </div>
      </div>

      {/* Main Grid */}
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
                      ? 'bg-[#FFB800]/15 border-[#FFB800] shadow-lg shadow-[#FFB800]/10'
                      : 'bg-[#1A1D20] border-[#33373B] hover:border-[#51504A]'
                  }`}
                >
                  <img src={v.imageUrl} alt={v.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#F5F5F2] truncate">{v.name}</h4>
                    <p className="text-[11px] font-mono text-[#FFB800] mt-0.5">{v.capacityTons} tonnagacha</p>
                    <p className="text-[10px] text-[#B8B8B3] mt-0.5">
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
            <h3 className="font-bold text-[#F5F5F2] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#FFB800]" />
              Yuk Tashish Kalkulyatori
            </h3>
            {selectedVehicle && (
              <Badge variant="info">{selectedVehicle.type.replace(/_/g, ' ')}</Badge>
            )}
          </div>

          <div className="space-y-4 text-xs font-semibold text-[#B8B8B3]">
            <div>
              <label className="block mb-1.5">Yuklash manzili (Origin):</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
              />
            </div>

            <div>
              <label className="block mb-1.5">Yetkazish manzili (Destination):</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5">Masofa ({distanceKm} km):</label>
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
                <label className="block mb-1.5">Yuk og'irligi ({weightTons} t):</label>
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

          {/* Price Summary */}
          <div className="bg-[#151719] border border-[#33373B] p-4 rounded-2xl space-y-2">
            <div className="flex justify-between text-xs text-[#B8B8B3]">
              <span>Boshlang'ich reys narxi:</span>
              <span className="font-mono text-[#F5F5F2]">{Number(selectedVehicle?.basePrice || 0).toLocaleString()} so'm</span>
            </div>
            <div className="flex justify-between text-xs text-[#B8B8B3]">
              <span>Masofa to'lovi ({distanceKm} km):</span>
              <span className="font-mono text-[#F5F5F2]">
                {(distanceKm * Number(selectedVehicle?.pricePerKm || 0)).toLocaleString()} so'm
              </span>
            </div>
            <div className="pt-2 border-t border-[#33373B] flex justify-between items-baseline">
              <span className="font-bold text-sm text-[#F5F5F2]">Jami hisoblangan narx:</span>
              <span className="text-xl font-black text-[#FFB800] font-mono">
                {calculateTotal().toLocaleString()} so'm
              </span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleBook}
            disabled={isBooked}
          >
            {isBooked ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Reys muvaffaqiyatli band qilindi!</span>
              </>
            ) : (
              <>
                <Truck className="w-5 h-5" />
                <span>Texnikani Buyurtma Qilish</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
