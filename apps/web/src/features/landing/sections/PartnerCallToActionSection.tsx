import React, { useState } from 'react';
import {
  PhoneCall,
  Package,
  Send,
  CheckCircle2,
  Building2,
  Store,
  Wrench,
  User,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Badge, Button } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../../services/mobileBridge';
import { PLATFORM_METRICS, UZBEKISTAN_REGIONS } from '../constants';
import { PartnerLeadFormData } from '../types';

interface PartnerCallToActionSectionProps {
  onNavigateToCatalog: () => void;
}

export const PartnerCallToActionSection: React.FC<PartnerCallToActionSectionProps> = ({
  onNavigateToCatalog
}) => {
  const [formData, setFormData] = useState<PartnerLeadFormData>({
    fullName: '',
    phoneNumber: '+998 ',
    businessType: 'market',
    region: UZBEKISTAN_REGIONS[0],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Iltimos, ism yoki korxona nomini kiriting.');
      return;
    }

    if (formData.phoneNumber.trim().length < 9) {
      setErrorMsg('Iltimos, to‘g‘ri telefon raqamini kiriting.');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('medium');

    // Simulate instant local lead processing and persistent state
    setTimeout(() => {
      try {
        const existingLeads = JSON.parse(localStorage.getItem('bunkerstroy_partner_leads') || '[]');
        existingLeads.push({
          ...formData,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('bunkerstroy_partner_leads', JSON.stringify(existingLeads));
      } catch {
        // Fallback gracefully
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
      triggerHaptic('success');
    }, 600);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      phoneNumber: '+998 ',
      businessType: 'market',
      region: UZBEKISTAN_REGIONS[0],
      notes: ''
    });
    setIsSubmitted(false);
    setErrorMsg('');
  };

  return (
    <section
      aria-labelledby="cta-heading"
      className="rounded-3xl bg-gradient-to-br from-[#0F2547] via-[#0A1931] to-[#0A1931] border-2 border-[#FFB800]/50 p-6 sm:p-10 lg:p-12 text-white space-y-8 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
        <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/60 font-mono text-xs px-4 py-1.5 uppercase tracking-wider shadow-md">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block text-[#FFB800]" />
          Hamkorlikka Taklif
        </Badge>

        <h2 id="cta-heading" className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Platformada Birinchilardan Bo‘ling!
        </h2>

        <p className="text-base sm:text-lg text-sky-200/90 max-w-2xl mx-auto leading-relaxed">
          O‘zbekistondagi ta‘minotchi zavodlar, qurilish mollari do‘konlari va usta brigadalarini yangi raqamli bozor ekotizimida hamkorlikka chorlaymiz.
        </p>
      </div>

      {/* Main Grid: Direct Contacts Card & Lead Capture Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-stretch">
        {/* Left Column: Direct Official Contact Details */}
        <div className="lg:col-span-5 bg-[#0A1931] border-2 border-[#1E3A6D] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#132C54] text-[#FFB800] text-xs font-mono font-bold border border-[#FFB800]/30">
              <Clock className="w-3.5 h-3.5" />
              <span>RASMIY BOSHLANISH: {PLATFORM_METRICS.startDate}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">To‘g‘ridan-to‘g‘ri Aloqa</h3>
              <p className="text-xs sm:text-sm text-sky-200/80 leading-relaxed font-sans">
                Savollaringiz bormi? Admin bilan bevosita bog‘lanib, shartlar va hamkorlik imkoniyatlarini birinchi bo‘lib o‘rganing.
              </p>
            </div>

            {/* Direct Phone Box */}
            <div className="p-4 rounded-xl bg-[#0F2547] border border-[#38BDF8]/40 space-y-2">
              <div className="text-[11px] font-mono text-slate-300 font-semibold uppercase">
                Admin bilan bog‘lanish:
              </div>
              <a
                href={`tel:${PLATFORM_METRICS.adminPhoneRaw}`}
                onClick={() => triggerHaptic('medium')}
                className="flex items-center gap-2.5 text-xl sm:text-2xl font-black text-[#FFB800] hover:text-amber-300 transition-colors font-mono"
              >
                <PhoneCall className="w-6 h-6 text-[#FFB800] shrink-0" />
                <span>{PLATFORM_METRICS.adminPhone}</span>
              </a>
              <div className="text-[11px] text-emerald-400 font-mono">
                ● 24/7 Qo‘ng‘iroqlar qabul qilinadi
              </div>
            </div>

            {/* Platform Credentials */}
            <div className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-[#1E3A6D]">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Rasmiy Portal:</span>
                <span className="text-white font-bold">{PLATFORM_METRICS.domain}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Savdo Qamrovi:</span>
                <span className="text-sky-300 font-bold">12 Viloyat + Qoraqalpog‘iston</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">To‘lov Tizimi:</span>
                <span className="text-emerald-400 font-bold">100% Onlayn yoki 50/50 Yetganda</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <a
              href={`tel:${PLATFORM_METRICS.adminPhoneRaw}`}
              onClick={() => triggerHaptic('medium')}
              className="w-full bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-black text-sm sm:text-base py-3.5 px-6 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <PhoneCall className="w-5 h-5 text-[#071326]" />
              <span>Hoziroq Qo‘ng‘iroq Qilish</span>
            </a>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                triggerHaptic('light');
                onNavigateToCatalog();
              }}
              className="w-full bg-[#132C54] hover:bg-[#1A386B] text-sky-200 hover:text-white border border-[#1E3A6D] font-bold text-sm py-3 rounded-xl cursor-pointer min-h-[44px] touch-target-44 flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-sky-300" />
              <span>Katalogni Ko‘rish</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Interactive Lead Capture Form */}
        <div className="lg:col-span-7 bg-[#0A1931] border-2 border-[#1E3A6D] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          {isSubmitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">
                  Arizangiz Muvaffaqiyatli Qabul Qilindi!
                </h3>
                <p className="text-sm text-sky-200/90 max-w-md mx-auto leading-relaxed">
                  Rahmat, <span className="text-[#FFB800] font-bold">{formData.fullName}</span>. 
                  BunkerStroy loyihasi ma‘muri tez orada <span className="text-white font-mono font-bold">{formData.phoneNumber}</span> raqami orqali siz bilan bog‘lanadi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0F2547] border border-[#1E3A6D] text-xs font-mono text-slate-300 max-w-sm w-full space-y-1">
                <div className="flex justify-between">
                  <span>Faoliyat:</span>
                  <span className="text-white font-bold capitalize">{formData.businessType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Viloyat:</span>
                  <span className="text-sky-300">{formData.region}</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleResetForm}
                className="bg-[#132C54] hover:bg-[#1A386B] text-sky-200 border border-[#1E3A6D] font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer flex items-center gap-2 mt-4"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Boshqa Ariza Yuborish</span>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Hamkorlik Uchun Ariza Qoldiring
                </h3>
                <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
                  Ma‘lumotlaringizni qoldiring, admin sizga barcha imtiyozli tariflar va shartlarni taqdim etadi.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-mono">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Form Field: Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-sky-300 uppercase">
                  Ismingiz yoki Korxona Nomi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Bekzod Aliyev / 'Mega Stroy' MCHJ"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#0F2547] border border-[#1E3A6D] focus:border-[#FFB800] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Form Field: Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-sky-300 uppercase">
                  Telefon Raqamingiz <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full bg-[#0F2547] border border-[#1E3A6D] focus:border-[#FFB800] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Form Field: Business Role Segment Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-sky-300 uppercase">
                  Faoliyat Yo‘nalishingiz
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, businessType: 'zavod' })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.businessType === 'zavod'
                        ? 'bg-[#132C54] border-[#FFB800] text-[#FFB800]'
                        : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mb-1" />
                    <div className="text-xs font-bold">Zavod</div>
                    <div className="text-[10px] text-slate-400">Ishlab chiqaruvchi</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, businessType: 'market' })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.businessType === 'market'
                        ? 'bg-[#132C54] border-[#38BDF8] text-[#38BDF8]'
                        : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <Store className="w-4 h-4 mb-1" />
                    <div className="text-xs font-bold">Market</div>
                    <div className="text-[10px] text-slate-400">Do‘kon / Baza</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, businessType: 'usta' })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.businessType === 'usta'
                        ? 'bg-[#132C54] border-[#10B981] text-[#10B981]'
                        : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <Wrench className="w-4 h-4 mb-1" />
                    <div className="text-xs font-bold">Usta</div>
                    <div className="text-[10px] text-slate-400">Qurilish brigadasi</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, businessType: 'xaridor' })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.businessType === 'xaridor'
                        ? 'bg-[#132C54] border-[#A855F7] text-[#A855F7]'
                        : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <User className="w-4 h-4 mb-1" />
                    <div className="text-xs font-bold">Xaridor</div>
                    <div className="text-[10px] text-slate-400">Buyurtmachi</div>
                  </button>
                </div>
              </div>

              {/* Form Field: Region */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-sky-300 uppercase">
                  Viloyat / Hudud
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-[#0F2547] border border-[#1E3A6D] focus:border-[#FFB800] rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none transition-colors"
                >
                  {UZBEKISTAN_REGIONS.map((r, idx) => (
                    <option key={idx} value={r} className="bg-[#0A1931] text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-black text-sm sm:text-base py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#071326]" />
                    <span>Hamkor Bo‘lish Uchun Arizani Yuborish</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
