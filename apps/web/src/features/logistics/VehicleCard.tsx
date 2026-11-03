import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { LogisticsVehicle } from '@bunkerstroy/types';

interface VehicleCardProps {
  vehicle: LogisticsVehicle;
  isSelected: boolean;
  onSelect: (vehicle: LogisticsVehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle: v,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(v)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
        isSelected
          ? 'bg-orange-50/80 border-[#D95D1E] shadow-2xs'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isSelected ? 'bg-[#D95D1E] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 leading-tight">
              {v.name}
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">
              Davlat raqami: {v.plateNumber || '01 777 AAA'}
            </span>
          </div>
        </div>

        {isSelected ? (
          <CheckCircle2 className="w-4 h-4 text-[#D95D1E] shrink-0" />
        ) : (
          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-sans pt-1 border-t border-slate-100">
        <div>
          <span className="text-slate-400 text-[10px] block uppercase font-bold">Yuk Ko‘tarish:</span>
          <span className="font-bold text-slate-800">{v.capacityTons} tonna</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block uppercase font-bold">Hajmi:</span>
          <span className="font-bold text-slate-800">{v.volumeM3} m³</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block uppercase font-bold">Boshlang‘ich Narx:</span>
          <span className="font-bold text-slate-900 font-mono-numbers">{v.basePrice.toLocaleString()} so‘m</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block uppercase font-bold">Har 1 km Narxi:</span>
          <span className="font-bold text-[#D95D1E] font-mono-numbers">{v.pricePerKm.toLocaleString()} so‘m</span>
        </div>
      </div>
    </div>
  );
};
