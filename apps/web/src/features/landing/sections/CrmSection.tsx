import React from 'react';
import { Store, ArrowRight } from 'lucide-react';
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
      className="rounded-3xl bg-[#0F2547] border-2 border-[#1E3A6D] p-6 sm:p-10 shadow-xl space-y-8"
    >
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-[#A855F7] border-[#A855F7]/40 font-mono text-xs px-3 py-1">
          5-SLAYD: CRM &amp; HISOBOT
        </Badge>
        <h2 id="crm-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Onlayn va Oflayn Savdo Uchun CRM Tizimi
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80">
          BunkerStroy har bir do‘kon va zavodga alohida zamonaviy hisob-kitob dasturini taqdim etadi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CRM_FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <article
              key={idx}
              className="p-6 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] space-y-3 text-center"
            >
              <div
                className="w-12 h-12 mx-auto rounded-xl bg-[#132C54] flex items-center justify-center"
                style={{ color: feature.accentColor }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{feature.title}</h3>
              <p className="text-xs text-sky-200/80 font-mono leading-relaxed">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <Button
          onClick={() => {
            triggerHaptic('medium');
            onNavigateToSellerPanel();
          }}
          className="bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-bold text-sm px-8 py-3.5 rounded-xl cursor-pointer min-h-[44px] touch-target-44 shadow-lg inline-flex items-center gap-2"
        >
          <Store className="w-4 h-4 text-[#071326]" />
          <span>Sotuvchi CRM Panelini Ko‘rish</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};
