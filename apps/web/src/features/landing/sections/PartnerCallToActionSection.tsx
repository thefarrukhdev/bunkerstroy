import React from 'react';
import { PhoneCall, Package } from 'lucide-react';
import { Badge, Button } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../../services/mobileBridge';
import { PLATFORM_METRICS } from '../constants';

interface PartnerCallToActionSectionProps {
  onNavigateToCatalog: () => void;
}

export const PartnerCallToActionSection: React.FC<PartnerCallToActionSectionProps> = ({
  onNavigateToCatalog
}) => {
  return (
    <section
      aria-labelledby="cta-heading"
      className="rounded-3xl bg-gradient-to-r from-[#FFB800] via-amber-400 to-[#FF9000] p-8 sm:p-12 text-[#071326] space-y-6 shadow-2xl relative overflow-hidden border-2 border-amber-300"
    >
      <div className="max-w-3xl mx-auto text-center space-y-5">
        <Badge className="bg-[#071326] text-[#FFB800] border-none font-mono text-xs px-3.5 py-1">
          7-SLAYD: HAMKORLIKKA TAKLIF
        </Badge>

        <h2 id="cta-heading" className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Platformada Birinchilardan Bo‘ling!
        </h2>

        <p className="text-base sm:text-lg font-bold text-[#0A1931]/90 max-w-2xl mx-auto">
          O‘zbekistondagi ta‘minotchi zavodlar va qurilish marketlarini BunkerStroy platformasida hamkorlikka chorlaymiz.
        </p>

        <div className="p-4 rounded-2xl bg-[#071326]/90 text-white font-mono text-sm sm:text-base max-w-lg mx-auto border border-white/20 shadow-xl space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#FFB800] font-black text-lg">
            <PhoneCall className="w-5 h-5" />
            <span>Aloqa uchun: Admin {PLATFORM_METRICS.adminPhone}</span>
          </div>
          <div className="flex items-center justify-around text-xs text-sky-200 border-t border-white/10 pt-2">
            <span className="font-bold">🌐 {PLATFORM_METRICS.domain}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Start: {PLATFORM_METRICS.startDate}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${PLATFORM_METRICS.adminPhoneRaw}`}
            onClick={() => triggerHaptic('medium')}
            className="bg-[#071326] hover:bg-[#0A1931] text-[#FFB800] font-black text-base px-8 py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-lg inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <PhoneCall className="w-5 h-5 text-[#FFB800]" />
            <span>Hoziroq Qo‘ng‘iroq Qilish</span>
          </a>

          <Button
            size="lg"
            onClick={() => {
              triggerHaptic('medium');
              onNavigateToCatalog();
            }}
            className="bg-white hover:bg-slate-100 text-[#071326] font-black text-base px-8 py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-md transition-all"
          >
            <Package className="w-5 h-5 text-[#071326]" />
            <span>Katalogni Ochish</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
