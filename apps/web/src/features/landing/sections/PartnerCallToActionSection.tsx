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
  };

  return (
    <section
      aria-labelledby="cta-heading"
      className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 lg:p-12 text-slate-900 space-y-8 shadow-xs relative overflow-hidden"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-orange-50 text-[#D95D1E] border-orange-200 font-mono text-xs px-4 py-1.5 uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block text-[#D95D1E]" />
          Hamkorlik &amp; Savdoni Boshlash
        </Badge>
        <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          BunkerStroy Bilan Bugunoq Savdoni Kengaytiring
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Zavodingiz yoki do‘koningiz bormi? Mahsulotlaringizni 12 ta viloyat bo‘yicha minglab pudratchilarga soting va bepul CRM tizimiga ega bo‘ling.
        </p>
      </div>

      {/* Main 2-Column Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        {/* Left Column: Fast Phone Contact & Admin Hotline */}
        <div className="lg:col-span-5 bg-slate-50/75 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white text-[#D95D1E] text-xs font-mono font-bold border border-slate-200 shadow-2xs">
              <Clock className="w-3.5 h-3.5" />
              <span>TEZKOR BOG‘LANISH (24/7)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              To‘g‘ridan-to‘g‘ri Platforma Rahbariyati Bilan Aloqa
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Katta hajmli shartnomalar, zavod integratsiyasi yoki do‘koningizni tizimga ulash bo‘yicha bepul professional maslahat oling.
            </p>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                Mas‘ul Rahbar Telefon Raqami:
              </span>
              <a
                href={`tel:${PLATFORM_METRICS.adminPhoneRaw}`}
                onClick={() => triggerHaptic('medium')}
                className="flex items-center gap-2.5 text-xl sm:text-2xl font-black text-[#D95D1E] hover:text-[#B43B06] transition-colors font-mono"
              >
                <PhoneCall className="w-6 h-6 text-[#D95D1E] shrink-0" />
                <span>{PLATFORM_METRICS.adminPhone}</span>
              </a>
              <span className="text-[11px] font-mono text-emerald-700 block font-medium">
                ● Qo‘ng‘iroqlarga darhol javob beriladi
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Minimal buyurtma (MOQ) va narxlarni o‘zingiz belgilaysiz</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% onlayn yoki 50/50 yetkazilganda to‘lov xavfsizligi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Do‘konlar va zavodlar uchun bepul CRM tizimi</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <a
              href={`tel:${PLATFORM_METRICS.adminPhoneRaw}`}
              onClick={() => triggerHaptic('medium')}
              className="w-full bg-[#D95D1E] hover:bg-[#B43B06] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <PhoneCall className="w-5 h-5 text-white" />
              <span>Hoziroq Qo‘ng‘iroq Qilish</span>
            </a>

            <Button
              variant="secondary"
              onClick={() => {
                triggerHaptic('light');
                onNavigateToCatalog();
              }}
              className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-sm py-3 rounded-xl cursor-pointer min-h-[44px] touch-target-44 flex items-center justify-center gap-2 shadow-2xs"
            >
              <Package className="w-4 h-4 text-slate-700" />
              <span>Barcha Tovarlarni Ko‘rish (Vitrina)</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Lead Capture Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Arizangiz Qabul Qilindi!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Rahmat, <span className="text-[#D95D1E] font-bold">{formData.fullName}</span>. 
                Menejerimiz qisqa vaqt ichida siz bilan bog‘lanib, platformaga ulanish shartlarini tushuntiradi.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 max-w-sm w-full mx-auto space-y-1">
                <div>Telefon: {formData.phoneNumber}</div>
                <div>Faoliyat: {formData.businessType}</div>
                <div>Viloyat: {formData.region}</div>
              </div>
              <div className="pt-4">
                <Button
                  variant="secondary"
                  onClick={handleResetForm}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer flex items-center gap-2 mx-auto shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D95D1E]" />
                  <span>Yangi Ariza Yuborish</span>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-xl font-black text-slate-900">
                  Hamkorlik Uchun Ariza Qoldiring
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ma‘lumotlaringizni qoldiring, 15 daqiqa ichida sizga qo‘ng‘iroq qilamiz.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-mono">
                  {errorMsg}
                </div>
              )}

              {/* Input: Full Name / Company */}
              <div>
                <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                  ISM-FAMILIYA YOKI KORXONA NOMI *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Bektemir Qurilish Mollari MCHJ"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-[#D95D1E] rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none transition-colors shadow-2xs"
                />
              </div>

              {/* Input: Phone Number */}
              <div>
                <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                  TELEFON RAQAMINGIZ *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-[#D95D1E] rounded-xl px-4 py-2.5 text-slate-900 font-mono text-sm focus:outline-none transition-colors shadow-2xs"
                />
              </div>

              {/* Selector: Business Type */}
              <div>
                <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                  FAOLIYAT YO‘NALISHINGIZ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, businessType: 'zavod' })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      formData.businessType === 'zavod'
                        ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Zavod</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, businessType: 'market' })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      formData.businessType === 'market'
                        ? 'bg-sky-50 border-sky-600 text-sky-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Do‘kon / Baza</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, businessType: 'usta' })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      formData.businessType === 'usta'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Usta / Pudratchi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, businessType: 'xaridor' })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      formData.businessType === 'xaridor'
                        ? 'bg-purple-50 border-purple-600 text-purple-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Mijoz</span>
                  </button>
                </div>
              </div>

              {/* Selector: Region */}
              <div>
                <label className="block text-xs font-mono text-slate-700 font-bold mb-1">
                  VILOYAT / SHAHAR
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-[#D95D1E] rounded-xl px-4 py-2.5 text-slate-900 text-xs sm:text-sm focus:outline-none transition-colors shadow-2xs"
                >
                  {UZBEKISTAN_REGIONS.map((r, idx) => (
                    <option key={idx} value={r} className="bg-white text-slate-900">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D95D1E] hover:bg-[#B43B06] text-white font-bold text-sm sm:text-base py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <span>Yuborilmoqda...</span>
                  ) : (
                    <>
                      <span>Arizani Yuborish (Bepul)</span>
                      <Send className="w-4 h-4 text-white" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
