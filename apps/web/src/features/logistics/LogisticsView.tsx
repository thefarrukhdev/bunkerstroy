import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { LogisticsVehicle } from '@bunkerstroy/types';
import { Alert } from '@bunkerstroy/ui';
import { VehicleCard } from './VehicleCard';
import { RouteCalculatorCard } from './RouteCalculatorCard';
import { ActiveDispatchCard } from './ActiveDispatchCard';
import { DEFAULT_VEHICLES } from './constants';
import type { QuoteCalculation, ConfirmedDispatch } from './types';

export const LogisticsView: React.FC = () => {
  const [vehicles, setVehicles] = useState<LogisticsVehicle[]>(DEFAULT_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<LogisticsVehicle | null>(DEFAULT_VEHICLES[0]);
  const [distanceKm, setDistanceKm] = useState(25);
  const [weightTons, setWeightTons] = useState(15);
  const [origin, setOrigin] = useState('Keles daryosi qum-shag‘al karyeri');
  const [destination, setDestination] = useState('Toshkent sh., Yunusobod 14-mavze');
  const [isBooking, setIsBooking] = useState(false);
  const [confirmedDispatch, setConfirmedDispatch] = useState<ConfirmedDispatch | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/logistics/vehicles');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setVehicles(json.data);
        setSelectedVehicle(json.data[0]);
      }
    } catch {
      // Graceful fallback to default fleet
    }
  };

  // Calculate live quote
  const quote: QuoteCalculation | null = selectedVehicle
    ? {
        vehicle: selectedVehicle,
        distanceKm,
        cargoWeightTons: weightTons,
        baseCost: selectedVehicle.basePrice,
        distanceCost: distanceKm * selectedVehicle.pricePerKm,
        totalCost: selectedVehicle.basePrice + distanceKm * selectedVehicle.pricePerKm,
        estimatedHours: Math.round((distanceKm / 35) * 10) / 10 + 1,
        currency: 'UZS',
      }
    : null;

  const handleBookDispatch = async () => {
    if (!selectedVehicle || !quote) return;
    setIsBooking(true);
    setBookingError(null);

    try {
      // Simulate or call dispatch booking
      await new Promise((r) => setTimeout(r, 600));
      setConfirmedDispatch({
        id: `DSP-${Math.floor(100000 + Math.random() * 900000)}`,
        orderId: 'EXPRESS',
        vehicleId: selectedVehicle.id,
        driverName: selectedVehicle.driverName || 'Dilshod Rahmatov',
        driverPhone: selectedVehicle.driverPhone || '+998 90 842 11 22',
        vehicleName: selectedVehicle.name,
        plateNumber: selectedVehicle.plateNumber || '01 842 BBA',
        status: 'DISPATCHED',
        origin,
        destination,
        distanceKm,
        totalCost: quote.totalCost,
        estimatedHours: quote.estimatedHours,
        dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch {
      setBookingError('Dispetcherlik bilan ulanishda xatolik yuz berdi. Qayta urinib ko‘ring.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 pb-12 font-sans">
      {/* 1. Header */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-2xs border border-slate-200 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#D95D1E] uppercase tracking-wider">
                Dispetcherlik &amp; Marshrut
              </span>
              <span className="bg-orange-50 text-[#D95D1E] border border-orange-200 px-2 py-0.5 rounded text-[10px] font-bold">
                GPS TELEMETRIYA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-900">
              Og‘ir Qurilish Texnikalari &amp; Logistika Parki
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              HOWO 25t, Shacman mikser va Isuzu kran. Kim sotsa — o‘sha yetkazadi: Do‘kon yoki Zavod kafolati ostida.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs shrink-0">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 flex items-center gap-2 shadow-2xs">
              <span className="text-[#D95D1E] font-black">{vehicles.length}</span>
              <span>ta maxsus texnika faol</span>
            </div>
          </div>
        </div>
      </div>

      {bookingError && (
        <Alert variant="error" onDismiss={() => setBookingError(null)}>
          {bookingError}
        </Alert>
      )}

      {/* 2. Confirmed Dispatch card */}
      {confirmedDispatch && (
        <ActiveDispatchCard
          dispatch={confirmedDispatch}
          onReset={() => setConfirmedDispatch(null)}
        />
      )}

      {/* 3. Main Fleet & Route Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vehicles selection list (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 text-xs font-sans">
            <span className="font-bold text-slate-900 uppercase flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D95D1E]" />
              1. Maxsus Texnikani Tanlang
            </span>
            <span className="text-slate-500 font-medium">{vehicles.length} ta birlik</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                isSelected={selectedVehicle?.id === v.id}
                onSelect={(veh) => setSelectedVehicle(veh)}
              />
            ))}
          </div>
        </div>

        {/* Route & Tariff Calculator Card (5 cols) */}
        <div className="lg:col-span-5">
          <RouteCalculatorCard
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            distanceKm={distanceKm}
            setDistanceKm={setDistanceKm}
            weightTons={weightTons}
            setWeightTons={setWeightTons}
            selectedVehicle={selectedVehicle}
            quote={quote}
            loadingQuote={false}
            onBookDispatch={handleBookDispatch}
            isBooking={isBooking}
          />
        </div>
      </div>
    </div>
  );
};
