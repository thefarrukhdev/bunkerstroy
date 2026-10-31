import React from 'react';
import { Truck, MapPin, Navigation, CheckCircle } from 'lucide-react';
import { Badge } from '@bunkerstroy/ui';
import { DELIVERY_FEATURES, UZBEKISTAN_REGIONS } from '../constants';

export const DeliverySection: React.FC = () => {
  return (
    <section aria-labelledby="delivery-heading" className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-sky-50 text-sky-800 border-sky-200 font-mono text-xs px-3.5 py-1 uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5 mr-1 inline-block" />
          Respublika Bo‘ylab Logistika
        </Badge>
        <h2 id="delivery-heading" className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          «Kim sotsa — o‘sha yetkazadi» Logistika Tizimi
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Do‘kon mijozga sotsa — yetkazib berish do‘konning zimmasida. Zavod do‘konga sotsa — yetkazib berish zavodning zimmasida. 12 viloyat bo‘yicha to‘liq shaffof qamrov.
        </p>
      </div>

      {/* 3 Logistics Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DELIVERY_FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.id}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 space-y-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs"
                  >
                    <Icon className="w-6 h-6 text-[#D95D1E]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                    {item.stats}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">{item.title}</h3>
                  <div className="text-xs font-semibold text-[#D95D1E] mt-0.5">
                    {item.subtitle}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-emerald-700">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Kafolatlangan yetkazish zanjiri</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* 12 Regions Coverage Badge Grid */}
      <div className="rounded-2xl bg-slate-50/75 border border-slate-200 p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-mono text-xs sm:text-sm font-bold">
            <MapPin className="w-4 h-4 text-[#D95D1E]" />
            <span>REKLAMA VA XARIDORLAR QAMROVI: 12 TA VILOYAT VA QORAQALPOG‘ISTON</span>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-semibold">
            ● Faol Hududiy Tarmoq
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {UZBEKISTAN_REGIONS.map((region, idx) => (
            <span
              key={idx}
              className="text-xs font-mono bg-white text-slate-700 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Navigation className="w-3 h-3 text-sky-600" />
              <span>{region}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
