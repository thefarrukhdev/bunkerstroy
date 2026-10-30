import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, DollarSign, Globe, Lock, Check } from 'lucide-react';
import { Badge } from '@bunkerstroy/ui';
import { TRADE_MODEL_ITEMS } from '../constants';

export const TradeModelSection: React.FC = () => {
  return (
    <section
      aria-labelledby="trade-model-heading"
      className="rounded-3xl bg-gradient-to-br from-[#0F2547] via-[#0A1931] to-[#0F2547] border-2 border-[#1E3A6D] p-6 sm:p-10 shadow-2xl space-y-8"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-emerald-400 border-emerald-400/50 font-mono text-xs px-3.5 py-1 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 inline-block" />
          Kafolatlangan Savdo Modeli
        </Badge>
        <h2 id="trade-model-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          BunkerStroy Savdo &amp; Monetizatsiya Modeli
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80 leading-relaxed">
          Sotuvchilar va xaridorlar o‘rtasidagi to‘liq shaffof, adolatli va xavfsiz hisob-kitob mexanizmi.
        </p>
      </div>

      {/* 3 Step Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TRADE_MODEL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isHighlight = item.number === 3;

          return (
            <article
              key={item.number}
              className={`rounded-2xl bg-[#0A1931] border-2 ${
                isHighlight ? 'border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.15)]' : 'border-[#1E3A6D]'
              } p-6 sm:p-7 space-y-5 flex flex-col justify-between transition-all hover:-translate-y-1`}
            >
              <div className="space-y-4">
                {/* Step badge & Number */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-xl border ${
                      isHighlight
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-400/60'
                        : 'bg-[#132C54] text-white border-white/20'
                    }`}
                    style={{ color: item.accentColor }}
                  >
                    0{item.number}
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 bg-[#132C54] px-2.5 py-1 rounded-md border border-[#1E3A6D]">
                    {item.stepLabel}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-200/90 leading-relaxed font-sans mt-1.5">
                    {item.description}
                  </p>
                </div>

                {/* Highlight callout box */}
                <div
                  className="p-3 rounded-xl border text-xs font-mono font-bold"
                  style={{
                    backgroundColor: `${item.accentColor}10`,
                    borderColor: `${item.accentColor}40`,
                    color: item.accentColor
                  }}
                >
                  ● {item.highlightText}
                </div>

                {/* Details List */}
                <ul className="space-y-2 pt-1">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
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

      {/* Special Visual Escrow Explainer Box */}
      <div className="rounded-2xl bg-[#132C54]/80 border-2 border-emerald-500/40 p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-emerald-400 font-mono font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>50/50 XAVFSIZ ESCROW BITIMINING ISHLASH KETMA-KETLIGI:</span>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-[#0A1931] px-3 py-1 rounded-full border border-[#1E3A6D]">
            Sotuvchi va xaridor 100% himoyalangan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-[#0A1931] border border-[#1E3A6D] space-y-1">
            <div className="text-[11px] font-mono text-amber-400 font-bold">1-BOSQICH</div>
            <div className="text-xs font-bold text-white">50% Onlayn To‘lov</div>
            <p className="text-[10px] text-slate-400">Buyurtma rasmiylashtiriladi va depozitga olinadi</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A1931] border border-[#1E3A6D] space-y-1">
            <div className="text-[11px] font-mono text-sky-400 font-bold">2-BOSQICH</div>
            <div className="text-xs font-bold text-white">Yukni Yetkazish</div>
            <p className="text-[10px] text-slate-400">Ta‘minotchi yukni buyurtmachi obyektiga olib boradi</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A1931] border border-[#1E3A6D] space-y-1">
            <div className="text-[11px] font-mono text-purple-400 font-bold">3-BOSQICH</div>
            <div className="text-xs font-bold text-white">Sifat Nazorati</div>
            <p className="text-[10px] text-slate-400">Mijoz tovar sifati va miqdorini joyida tekshiradi</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A1931] border border-emerald-500/50 space-y-1">
            <div className="text-[11px] font-mono text-emerald-400 font-bold">4-BOSQICH</div>
            <div className="text-xs font-bold text-white">50% Yakuniy To‘lov</div>
            <p className="text-[10px] text-slate-400">Naqd yoki karta orqali bitim to‘liq yopiladi</p>
          </div>
        </div>
      </div>
    </section>
  );
};
