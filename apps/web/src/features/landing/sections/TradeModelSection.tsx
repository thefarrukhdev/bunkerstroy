import React from 'react';
import { ShieldCheck, Lock, Check } from 'lucide-react';
import { Badge } from '@bunkerstroy/ui';
import { TRADE_MODEL_ITEMS } from '../constants';

export const TradeModelSection: React.FC = () => {
  return (
    <section
      aria-labelledby="trade-model-heading"
      className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 font-mono text-xs px-3.5 py-1 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 inline-block" />
          Kafolatlangan Savdo Modeli
        </Badge>
        <h2 id="trade-model-heading" className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          BunkerStroy Savdo &amp; Monetizatsiya Modeli
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
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
              className={`rounded-2xl bg-white border ${
                isHighlight ? 'border-emerald-300 shadow-sm' : 'border-slate-200 shadow-xs'
              } p-6 sm:p-7 space-y-5 flex flex-col justify-between transition-all hover:-translate-y-1`}
            >
              <div className="space-y-4">
                {/* Step badge & Number */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-xl border ${
                      isHighlight
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    0{item.number}
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {item.stepLabel}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mt-1.5">
                    {item.description}
                  </p>
                </div>

                {/* Highlight callout box */}
                <div
                  className="p-3 rounded-xl border text-xs font-mono font-bold bg-slate-50 border-slate-200 text-slate-800"
                >
                  {item.highlightText}
                </div>

                {/* Details List */}
                <ul className="space-y-2 pt-1">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800"
              >
                <Icon className="w-4 h-4 text-[#D95D1E]" />
                <span>{item.badgeText}</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Special Visual Escrow Explainer Box */}
      <div className="rounded-2xl bg-emerald-50/50 border border-emerald-200 p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-mono font-bold text-sm">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>MOSLASHUVCHAN TO‘LOV TIZIMI (MIJOZ XOHISHIGA KO‘RA):</span>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs font-semibold">
            100% Onlayn yoki 50/50 yetib borganda
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-[11px] font-mono text-amber-700 font-bold">1-BOSQICH</div>
            <div className="text-xs font-bold text-slate-900">To‘lov Usulini Tanlash</div>
            <p className="text-[10px] text-slate-500">100% to‘liq onlayn yoki 50% depozit to‘lash imkoniyati</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-[11px] font-mono text-sky-700 font-bold">2-BOSQICH</div>
            <div className="text-xs font-bold text-slate-900">Yukni Yetkazish</div>
            <p className="text-[10px] text-slate-500">Ta‘minotchi yukni buyurtmachi obyektiga olib boradi</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-[11px] font-mono text-indigo-700 font-bold">3-BOSQICH</div>
            <div className="text-xs font-bold text-slate-900">Sifat Nazorati</div>
            <p className="text-[10px] text-slate-500">Mijoz tovar sifati va miqdorini joyida tekshiradi</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-emerald-300 space-y-1 shadow-2xs">
            <div className="text-[11px] font-mono text-emerald-700 font-bold">4-BOSQICH</div>
            <div className="text-xs font-bold text-slate-900">Yakuniy Hisob-Kitob</div>
            <p className="text-[10px] text-slate-500">Qolgan 50% mahsulot yetib borgach to‘lanadi (yoki 100% to‘langan bo‘lsa qabul qilinadi)</p>
          </div>
        </div>
      </div>
    </section>
  );
};
