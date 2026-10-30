import React from 'react';
import { Truck, MapPin, DollarSign, Navigation, CheckCircle } from 'lucide-react';
import { Badge } from '@bunkerstroy/ui';
import { DELIVERY_FEATURES, UZBEKISTAN_REGIONS } from '../constants';

export const DeliverySection: React.FC = () => {
  return (
    <section aria-labelledby="delivery-heading" className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/50 font-mono text-xs px-3.5 py-1 uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5 mr-1 inline-block" />
          Respublika Bo‘ylab Logistika
        </Badge>
        <h2 id="delivery-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Yetkazib Berish va Hududiy Qamrov Shartlari
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80 leading-relaxed">
          Ta‘minotchilar uchun logistika erkinligi va butun O‘zbekistonning 12 ta viloyati bo‘ylab keng ko‘lamli reklama hamda buyurtmalar oqimi.
        </p>
      </div>

      {/* 3 Logistics Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DELIVERY_FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.id}
              className="p-6 sm:p-7 rounded-2xl bg-[#0F2547] border-2 border-[#1E3A6D] hover:border-sky-500/50 space-y-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl bg-[#132C54] flex items-center justify-center shadow-inner"
                    style={{ color: item.accentColor }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-sky-300 bg-[#0A1931] px-2.5 py-1 rounded-md border border-[#1E3A6D]">
                    {item.stats}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{item.title}</h3>
                  <div className="text-xs font-semibold text-[#FFB800] mt-0.5">
                    {item.subtitle}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-sky-200/80 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E3A6D]/80 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Kafolatlangan yetkazish zanjiri</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* 12 Regions Coverage Badge Grid */}
      <div className="rounded-2xl bg-[#0A1931] border-2 border-[#1E3A6D] p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E3A6D] pb-3">
          <div className="flex items-center gap-2 text-sky-300 font-mono text-xs sm:text-sm font-bold">
            <MapPin className="w-4 h-4 text-[#FFB800]" />
            <span>REKLAMA VA XARIDORLAR QAMROVI: 12 TA VILOYAT VA QORAQALPOG‘ISTON</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
            ● Faol Hududiy Tarmoq
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {UZBEKISTAN_REGIONS.map((region, idx) => (
            <span
              key={idx}
              className="text-xs font-mono bg-[#0F2547] text-sky-200 border border-[#1E3A6D] hover:border-[#FFB800] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Navigation className="w-3 h-3 text-[#38BDF8]" />
              <span>{region}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
