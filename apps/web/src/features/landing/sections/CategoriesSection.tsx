import React from 'react';
import { ArrowRight } from 'lucide-react';
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
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/40 font-mono text-xs px-3 py-1">
          2-SLAYD: ASSORTIMENT
        </Badge>
        <h2 id="categories-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Platformada Nimalar Sotiladi?
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80">
          Tashqi qurilish poydevoridan tortib xonadon bezaklari va usta asboblarigacha bo‘lgan to‘liq zanjir.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTS_SOLD.map((cat) => {
          const Icon = cat.icon;
          return (
            <article
              key={cat.id}
              onClick={() => {
                triggerHaptic('light');
                onNavigateToCatalog();
              }}
              className="rounded-3xl bg-[#0F2547] border-2 border-[#1E3A6D] hover:border-[#FFB800] p-6 sm:p-7 space-y-4 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.bgLight} rounded-bl-full pointer-events-none`}
              />

              <div className="w-12 h-12 rounded-2xl bg-[#132C54] border border-[#1E3A6D] flex items-center justify-center group-hover:border-[#FFB800] transition-colors shadow-inner">
                <Icon className="w-6 h-6" style={{ color: cat.color }} />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {cat.badge}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-[#FFB800] transition-colors mt-0.5">
                  {cat.title}
                </h3>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A1931] border border-[#1E3A6D]/80">
                <div className="text-xs font-mono font-bold text-sky-200">
                  {cat.items}
                </div>
              </div>

              <div className="pt-2 text-xs font-mono text-[#FFB800] flex items-center justify-between font-bold">
                <span>Katalogda ko‘rish</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
