import React from 'react';
import { Store, ArrowRight, BarChart3, MonitorCheck, Layers, Smartphone, DollarSign, Package } from 'lucide-react';
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
      className="rounded-3xl bg-[#0F2547] border-2 border-[#1E3A6D] p-6 sm:p-10 shadow-2xl space-y-8"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-[#A855F7] border-[#A855F7]/50 font-mono text-xs px-3.5 py-1 uppercase tracking-wider">
          <MonitorCheck className="w-3.5 h-3.5 mr-1 inline-block" />
          Aqlli CRM &amp; Boshqaruv
        </Badge>
        <h2 id="crm-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Onlayn va Oflayn Savdo Uchun Zamonaviy CRM
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80 leading-relaxed">
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
              className="p-6 sm:p-7 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] hover:border-[#38BDF8]/50 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl bg-[#132C54] flex items-center justify-center shadow-inner"
                    style={{ color: feature.accentColor }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-sky-300 bg-[#132C54] px-2.5 py-1 rounded-md border border-[#1E3A6D]">
                    {feature.metrics}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <div className="text-xs font-semibold text-[#FFB800] mt-0.5">
                    {feature.subtitle}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-sky-200/80 leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E3A6D]/60 flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: feature.accentColor }} />
                <span>Onlayn va oflayn sinxronizatsiya</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Interactive CRM Dashboard Mockup Visual */}
      <div className="rounded-2xl bg-[#0A1931] border-2 border-[#1E3A6D] p-5 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E3A6D] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-sm font-bold text-white">
              BunkerStroy POS &amp; CRM Monitoring Paneli (Jonli Ko‘rinish)
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-sky-300">
            <span className="bg-[#132C54] px-2.5 py-1 rounded-md border border-[#1E3A6D]">
              Do‘kon: &quot;Bunker Mega Stroy Samarqand&quot;
            </span>
          </div>
        </div>

        {/* Mock Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0F2547] border border-[#1E3A6D] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Bugungi Jami Savdo</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
              48,500,000 UZS
            </div>
            <div className="text-[11px] font-mono text-slate-300 flex justify-between pt-1">
              <span>Onlayn: 28.5M</span>
              <span>Oflayn kassa: 20M</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F2547] border border-[#1E3A6D] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Yangi Buyurtmalar</span>
              <Store className="w-3.5 h-3.5 text-[#38BDF8]" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              34 ta buyurtma
            </div>
            <div className="text-[11px] font-mono text-sky-300 pt-1">
              ● 29 tasi muvaffaqiyatli topshirildi
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F2547] border border-[#1E3A6D] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Ombor Holati</span>
              <Package className="w-3.5 h-3.5 text-[#FFB800]" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#FFB800]">
              1,420 tur tovar
            </div>
            <div className="text-[11px] font-mono text-amber-300/90 pt-1">
              Ogohlantirish: Sement M400 (24 qop qoldi)
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-sky-200">
          <span className="flex items-center gap-1.5 bg-[#132C54] px-3 py-1.5 rounded-lg border border-[#1E3A6D]">
            ✓ Chek chiqarish va QR-to‘lov
          </span>
          <span className="flex items-center gap-1.5 bg-[#132C54] px-3 py-1.5 rounded-lg border border-[#1E3A6D]">
            ✓ Shtrix-kod skaneri integratsiyasi
          </span>
          <span className="flex items-center gap-1.5 bg-[#132C54] px-3 py-1.5 rounded-lg border border-[#1E3A6D]">
            ✓ Nasiya va qarz daftari avtomatizatsiyasi
          </span>
          <span className="flex items-center gap-1.5 bg-[#132C54] px-3 py-1.5 rounded-lg border border-[#1E3A6D]">
            ✓ Mobil telefonda ham to‘liq ishlaydi
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-2">
        <Button
          onClick={() => {
            triggerHaptic('medium');
            onNavigateToSellerPanel();
          }}
          className="bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-bold text-sm px-8 py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-lg inline-flex items-center gap-2 hover:scale-[1.02] transition-all"
        >
          <Store className="w-4 h-4 text-[#071326]" />
          <span>Sotuvchi CRM Panelini Ko‘rish</span>
          <ArrowRight className="w-4 h-4 text-[#071326]" />
        </Button>
      </div>
    </section>
  );
};
