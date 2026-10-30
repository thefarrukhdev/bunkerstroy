import React from 'react';
import { Badge } from '@bunkerstroy/ui';
import { DELIVERY_FEATURES } from '../constants';

export const DeliverySection: React.FC = () => {
  return (
    <section aria-labelledby="delivery-heading" className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/40 font-mono text-xs px-3 py-1">
          6-SLAYD: LOGISTIKA
        </Badge>
        <h2 id="delivery-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Yetkazib Berish Shartlari
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80">
          Logistika erkinligi va 12 ta viloyat bo‘ylab keng ko‘lamli reklama qamrovi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DELIVERY_FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <article
              key={idx}
              className="p-6 rounded-2xl bg-[#0F2547] border border-[#1E3A6D] space-y-3"
            >
              <Icon className="w-8 h-8" style={{ color: item.accentColor }} />
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs sm:text-sm text-sky-200/80 font-mono leading-relaxed">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};
