import React from 'react';
import { Badge } from '@bunkerstroy/ui';
import { TRADE_MODEL_ITEMS } from '../constants';

export const TradeModelSection: React.FC = () => {
  return (
    <section
      aria-labelledby="trade-model-heading"
      className="rounded-3xl bg-gradient-to-br from-[#0F2547] via-[#0A1931] to-[#0F2547] border-2 border-[#1E3A6D] p-6 sm:p-10 shadow-2xl space-y-8"
    >
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-emerald-400 border-emerald-400/40 font-mono text-xs px-3 py-1">
          4-SLAYD: MONETIZATSIYA &amp; SAVDO
        </Badge>
        <h2 id="trade-model-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          BunkerStroy Savdo Modeli
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80">
          Sotuvchilar va xaridorlar uchun to‘liq shaffof, adolatli va kafolatlangan savdo mexanizmi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TRADE_MODEL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isHighlight = item.number === 3;

          return (
            <article
              key={item.number}
              className={`rounded-2xl bg-[#0A1931] border-2 ${
                isHighlight ? 'border-emerald-500/50 shadow-lg' : 'border-[#1E3A6D]'
              } p-6 space-y-4 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-xl border ${
                    isHighlight
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-400'
                      : 'bg-[#132C54] text-white border-white/20'
                  }`}
                  style={{ color: item.accentColor }}
                >
                  {item.number}
                </div>

                <h3 className="text-xl font-black text-white">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-sky-200/90 leading-relaxed font-mono">
                  {item.description}
                </p>
              </div>

              <div
                className="pt-3 border-t border-[#1E3A6D]/80 inline-flex items-center gap-1.5 text-xs font-mono font-bold"
                style={{ color: item.accentColor }}
              >
                <Icon className="w-4 h-4" />
                <span>{item.badgeText}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
