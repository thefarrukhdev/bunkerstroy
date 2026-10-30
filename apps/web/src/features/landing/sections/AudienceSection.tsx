import React from 'react';
import { CheckCircle2, ArrowRight, Network, Building2, Store, Users } from 'lucide-react';
import { Badge, Button } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../../services/mobileBridge';
import { USER_SEGMENTS } from '../constants';

interface AudienceSectionProps {
  onNavigateToCatalog: () => void;
  onNavigateToSellerPanel: () => void;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({
  onNavigateToCatalog,
  onNavigateToSellerPanel
}) => {
  return (
    <section aria-labelledby="audience-heading" className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-[#38BDF8] border-[#38BDF8]/50 font-mono text-xs px-3.5 py-1 uppercase tracking-wider">
          <Network className="w-3.5 h-3.5 mr-1 inline-block" />
          B2B &amp; B2C Ekotizim
        </Badge>
        <h2 id="audience-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Platformadan Kimlar Foydalanadi?
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80 leading-relaxed">
          Ishlab chiqaruvchi zavodlar, mintaqaviy qurilish do‘konlari hamda iste‘molchilar o‘rtasidagi eng qisqa va ishonchli raqamli ko‘prik.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {USER_SEGMENTS.map((seg) => {
          const Icon = seg.icon;
          const isSellerRole = seg.id === 'zavodlar' || seg.id === 'marketlar';

          return (
            <article
              key={seg.id}
              className="rounded-3xl bg-[#0F2547] border-2 border-[#1E3A6D] hover:border-sky-500/50 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="space-y-5">
                {/* Header with Icon and Role Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-13 h-13 rounded-2xl bg-[#132C54] border border-[#1E3A6D] flex items-center justify-center shadow-inner"
                    style={{ borderColor: `${seg.accent}40` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: seg.accent }} />
                  </div>
                  <Badge className="bg-[#132C54] text-sky-300 border-[#1E3A6D] font-mono text-[10px] uppercase tracking-wider">
                    {seg.badge}
                  </Badge>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {seg.title}
                  </h3>
                  <div className="text-xs font-semibold" style={{ color: seg.accent }}>
                    {seg.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-sky-200/90 font-normal leading-relaxed pt-1">
                    {seg.description}
                  </p>
                </div>

                {/* Target Audience Tag */}
                <div className="p-2.5 rounded-xl bg-[#0A1931] border border-[#1E3A6D]/80">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                    Mo‘ljallangan:
                  </span>
                  <span className="text-xs font-mono text-sky-200">
                    {seg.targetAudience}
                  </span>
                </div>

                {/* Key Benefits List */}
                <div className="pt-2 border-t border-[#1E3A6D]/80">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                    Asosiy Imtiyozlar:
                  </div>
                  <ul className="space-y-2.5">
                    {seg.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-normal">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: seg.accent }}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 border-t border-[#1E3A6D]/60">
                {isSellerRole ? (
                  <Button
                    onClick={() => {
                      triggerHaptic('medium');
                      onNavigateToSellerPanel();
                    }}
                    className="w-full bg-[#132C54] hover:bg-[#1A386B] text-white border border-[#FFB800]/60 font-bold text-xs sm:text-sm py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 min-h-[44px] touch-target-44 shadow-md transition-all hover:scale-[1.01]"
                  >
                    <span>Hamkor Bo‘lib Qo‘shilish</span>
                    <ArrowRight className="w-4 h-4 text-[#FFB800]" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      triggerHaptic('medium');
                      onNavigateToCatalog();
                    }}
                    className="w-full bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-bold text-xs sm:text-sm py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 min-h-[44px] touch-target-44 shadow-md transition-all hover:scale-[1.01]"
                  >
                    <span>Katalogda Xarid Qilish</span>
                    <ArrowRight className="w-4 h-4 text-[#071326]" />
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
