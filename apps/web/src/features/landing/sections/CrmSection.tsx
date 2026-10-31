import React from 'react';
import { Store, ArrowRight, MonitorCheck, DollarSign, Package } from 'lucide-react';
import { Badge, Button } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../../services/mobileBridge';
import { CRM_FEATURES } from '../constants';

interface CrmSectionProps {
  onNavigateToSellerPanel: () => void;
}

export const CrmSection: React.FC<CrmSectionProps> = ({
  onNavigateToSellerPanel
}) => {
  return (
    <section
      aria-labelledby="crm-heading"
      className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-purple-50 text-purple-800 border-purple-200 font-mono text-xs px-3.5 py-1 uppercase tracking-wider">
          <MonitorCheck className="w-3.5 h-3.5 mr-1 inline-block" />
          Aqlli CRM &amp; Boshqaruv
        </Badge>
        <h2 id="crm-heading" className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Onlayn va Oflayn Savdo Uchun Zamonaviy CRM
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          BunkerStroy har bir qurilish do‘koni va ishlab chiqaruvchi zavodga savdoni to‘liq nazorat qiluvchi qulay raqamli kassa va ombor dasturini taqdim etadi.
        </p>
      </div>

      {/* 3 Core CRM Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CRM_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.id}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs"
                  >
                    <Icon className="w-6 h-6 text-[#D95D1E]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                    {feature.metrics}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                  <div className="text-xs font-semibold text-[#D95D1E] mt-0.5">
                    {feature.subtitle}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-mono text-slate-500">
                <span>Onlayn va oflayn sinxronizatsiya</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Interactive CRM Dashboard Mockup Visual */}
      <div className="rounded-2xl bg-slate-50/75 border border-slate-200 p-5 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-slate-900">
              BunkerStroy POS &amp; CRM Monitoring Paneli (Jonli Ko‘rinish)
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs font-medium">
              Do‘kon: &quot;Bunker Mega Stroy Samarqand&quot;
            </span>
          </div>
        </div>

        {/* Mock Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Bugungi Jami Savdo</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
              48,500,000 UZS
            </div>
            <div className="text-[11px] font-mono text-slate-500 flex justify-between pt-1">
              <span>Onlayn: 28.5M</span>
              <span>Oflayn kassa: 20M</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Yangi Buyurtmalar</span>
              <Store className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              34 ta buyurtma
            </div>
            <div className="text-[11px] font-mono text-sky-700 pt-1 font-medium">
              29 tasi muvaffaqiyatli topshirildi
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Ombor Holati</span>
              <Package className="w-3.5 h-3.5 text-[#D95D1E]" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              1,420 tur tovar
            </div>
            <div className="text-[11px] font-mono text-amber-700 pt-1">
              Ogohlantirish: Sement M400 (24 qop qoldi)
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-700">
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            ✓ Chek chiqarish va QR-to‘lov
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            ✓ Shtrix-kod skaneri integratsiyasi
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            ✓ Nasiya va qarz daftari avtomatizatsiyasi
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            ✓ Mobil telefonda ham to‘liq ishlaydi
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-2">
        <Button
          variant="primary"
          onClick={() => {
            triggerHaptic('medium');
            onNavigateToSellerPanel();
          }}
          className="bg-[#D95D1E] hover:bg-[#B43B06] text-white font-bold text-sm px-8 py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-xs inline-flex items-center gap-2 hover:scale-[1.02] transition-all"
        >
          <Store className="w-4 h-4 text-white" />
          <span>Sotuvchi CRM Panelini Ko‘rish</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Button>
      </div>
    </section>
  );
};
