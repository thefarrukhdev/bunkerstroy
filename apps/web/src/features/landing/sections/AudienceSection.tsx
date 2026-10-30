import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
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
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-[#132C54] text-[#38BDF8] border-[#38BDF8]/40 font-mono text-xs px-3 py-1">
          3-SLAYD: ISHTIROKCHILAR
        </Badge>
        <h2 id="audience-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Platformadan Kimlar Foydalanadi?
        </h2>
        <p className="text-sm sm:text-base text-sky-200/80">
          Ishlab chiqaruvchi zavodlar, qurilish do‘konlari va iste‘molchilar o‘rtasidagi eng qisqa raqamli ko‘prik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {USER_SEGMENTS.map((seg) => {
          const Icon = seg.icon;
          const isSellerRole = seg.id === 'zavodlar' || seg.id === 'marketlar';

          return (
            <article
              key={seg.id}
              className="rounded-3xl bg-[#0F2547] border-2 border-[#1E3A6D] p-6 sm:p-8 space-y-5 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#132C54] border border-[#1E3A6D] flex items-center justify-center">
                    <Icon className="w-6 h-6" style={{ color: seg.accent }} />
                  </div>
                  <Badge className="bg-[#132C54] text-sky-300 border-[#1E3A6D] font-mono text-[10px]">
                    {seg.badge}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {seg.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-200/90 font-medium mt-1 leading-relaxed">
                    {seg.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1E3A6D]/80">
                  <ul className="space-y-2.5">
                    {seg.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                {isSellerRole ? (
                  <Button
                    onClick={() => {
                      triggerHaptic('medium');
                      onNavigateToSellerPanel();
                    }}
                    className="w-full bg-[#132C54] hover:bg-[#1A386B] text-white border border-[#FFB800]/50 font-bold text-xs py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] touch-target-44"
                  >
                    <span>Hamkor Bo‘lib Qo‘shilish</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFB800]" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      triggerHaptic('medium');
                      onNavigateToCatalog();
                    }}
                    className="w-full bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-bold text-xs py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] touch-target-44"
                  >
                    <span>Katalogda Xarid Qilish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
