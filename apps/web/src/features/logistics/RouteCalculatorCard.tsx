import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';
import { Button, Input, Select } from '@bunkerstroy/ui';
import { LogisticsVehicle } from '@bunkerstroy/types';
import type { QuoteCalculation } from './types';

interface RouteCalculatorCardProps {
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  distanceKm: number;
  setDistanceKm: (val: number) => void;
  weightTons: number;
  setWeightTons: (val: number) => void;
  selectedVehicle: LogisticsVehicle | null;
  quote: QuoteCalculation | null;
  loadingQuote: boolean;
  onBookDispatch: () => void;
  isBooking: boolean;
}

export const RouteCalculatorCard: React.FC<RouteCalculatorCardProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  distanceKm,
  setDistanceKm,
  weightTons,
  setWeightTons,
  selectedVehicle,
  quote,
  loadingQuote,
  onBookDispatch,
  isBooking,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs font-sans">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Compass className="w-4 h-4 text-[#D95D1E]" />
        <h3 className="font-heading font-black text-slate-900 text-sm uppercase tracking-wide">
          2. Marshrut &amp; Tarif Hisoblagichi
        </h3>
      </div>

      <div className="space-y-3">
        <Input
          label="Yuklash Manzili (Zavod / Karyer / Baza)"
          placeholder="Masalan: Bekobod Metallurgiya Kombinati"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />

        <Input
          label="Yetkazish Manzili (Obyekt)"
          placeholder="Masalan: Toshkent sh., Chilonzor 9-mavze"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Masofa (km): <strong className="text-[#D95D1E] font-mono">{distanceKm} km</strong>
            </label>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D95D1E]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Yuk Og‘irligi: <strong className="text-[#D95D1E] font-mono">{weightTons} tonna</strong>
            </label>
            <input
              type="range"
              min="1"
              max={selectedVehicle?.capacityTons || 30}
              step="1"
              value={weightTons}
              onChange={(e) => setWeightTons(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D95D1E]"
            />
          </div>
        </div>
      </div>

      {/* Quote summary card */}
      {quote && (
        <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 space-y-2.5">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Boshlang‘ich tarif:</span>
            <span className="font-bold text-slate-900 font-mono">{quote.baseCost.toLocaleString()} so‘m</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Masofa to‘lovi ({quote.distanceKm} km):</span>
            <span className="font-bold text-slate-900 font-mono">{quote.distanceCost.toLocaleString()} so‘m</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Taxminiy yetkazish vaqti:</span>
            <span className="font-bold text-slate-900">~{quote.estimatedHours} soat</span>
          </div>
          <div className="pt-2 border-t border-orange-200 flex justify-between items-baseline">
            <span className="text-xs font-bold text-slate-900">Jami Reys Narxi:</span>
            <span className="font-heading font-black text-lg text-[#D95D1E] font-mono-numbers">
              {quote.totalCost.toLocaleString()} so‘m
            </span>
          </div>
        </div>
      )}

      {/* Kim sotsa - o'sha yetkazadi Escrow guarantee notice */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span className="leading-snug">
          <strong>«Kim sotsa — o‘sha yetkazadi»:</strong> Haydovchi tovar yetkazib bergach, siz bergan PIN-kod orqali reys yopiladi va mablag‘ sotuvchiga o‘tkaziladi.
        </span>
      </div>

      <Button
        variant="primary"
        size="md"
        className="w-full"
        isLoading={isBooking}
        onClick={onBookDispatch}
      >
        <span>Reysni Bron Qilish &amp; Dispetcherga Yuborish</span>
      </Button>
    </div>
  );
};
