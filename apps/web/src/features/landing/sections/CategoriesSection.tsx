import React from 'react';
import { ArrowRight, Layers, Tag } from 'lucide-react';
import { Badge } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../../services/mobileBridge';
import { PRODUCTS_SOLD } from '../constants';

interface CategoriesSectionProps {
  onNavigateToCatalog: () => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onNavigateToCatalog
}) => {
  return (
    <section aria-labelledby="categories-heading" className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/50 font-mono text-xs px-3.5 py-1 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 mr-1 inline-block" />
          Assortiment &amp; Mahsulotlar
        </Badge>
        <h2 id="categories-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Platformada Nimalar Sotiladi?
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80 leading-relaxed">
          Tashqi og‘ir qurilish poydevoridan tortib, xonadon pardozlash materiallari, interyer bezaklari hamda professional usta asboblarigacha bo‘lgan to‘liq assortiment.
        </p>
      </div>

      {/* 4 Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTS_SOLD.map((cat) => {
          const Icon = cat.icon;
          return (
            <article
              key={cat.id}
              onClick={() => {
                triggerHaptic('light');
                onNavigateToCatalog();
              }}
              className="rounded-3xl bg-[#0F2547] border-2 border-[#1E3A6D] hover:border-[#FFB800] p-6 space-y-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(255,184,0,0.15)] group relative overflow-hidden flex flex-col justify-between"
            >
              {/* Corner Ambient Glow */}
              <div
                className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${cat.bgLight} rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-60`}
              />

              <div className="space-y-4 relative z-10">
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-[#132C54] border border-[#1E3A6D] flex items-center justify-center group-hover:border-[#FFB800] transition-colors shadow-inner">
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300 bg-[#0A1931] border border-[#1E3A6D] px-2.5 py-1 rounded-full">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FFB800] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-sky-200/80 mt-1 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>

                {/* Specific Products Tags List */}
                <div className="space-y-2 pt-2 border-t border-[#1E3A6D]/80">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 font-semibold">
                    <Tag className="w-3 h-3 text-[#FFB800]" />
                    <span>Asosiy mahsulotlar:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.itemTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono bg-[#0A1931] text-sky-200 border border-[#1E3A6D] px-2 py-0.5 rounded-md group-hover:border-sky-500/40 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-[#1E3A6D]/80 flex items-center justify-between text-xs font-mono font-bold text-[#FFB800] relative z-10">
                <span>Katalogda ko‘rish</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
