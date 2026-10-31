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
        <Badge className="bg-orange-50 text-[#D95D1E] border-orange-200 font-mono text-xs px-3.5 py-1 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 mr-1 inline-block" />
          Assortiment &amp; Mahsulotlar
        </Badge>
        <h2 id="categories-heading" className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Platformada Nimalar Sotiladi?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
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
              className="rounded-3xl bg-white border border-slate-200 hover:border-slate-300 p-6 space-y-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4 relative z-10">
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-[#D95D1E] transition-colors shadow-xs">
                    <Icon className="w-6 h-6 text-[#D95D1E]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#D95D1E] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>

                {/* Specific Products Tags List */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 font-semibold">
                    <Tag className="w-3 h-3 text-[#D95D1E]" />
                    <span>Asosiy mahsulotlar:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.itemTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md group-hover:border-slate-300 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-[#D95D1E] relative z-10">
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
