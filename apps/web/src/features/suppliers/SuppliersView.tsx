import React, { useState } from 'react';
import {
  Factory,
  ShieldCheck,
  Search,
  Building2,
  TrendingUp,
  Globe,
  Truck
} from 'lucide-react';
import { Alert, Select } from '@bunkerstroy/ui';
import type { FactoryPartner, GlobalPartner } from './types';
import { FACTORY_PARTNERS, GLOBAL_PARTNERS } from './constants';
import { SupplierCard } from './SupplierCard';
import { GlobalTransitCard } from './GlobalTransitCard';
import { InquiryModal } from './InquiryModal';
import { GlobalInquiryModal } from './GlobalInquiryModal';

export const SuppliersView: React.FC<{ onNavigateToCatalog?: () => void }> = ({
  onNavigateToCatalog
}) => {
  const [supplierTab, setSupplierTab] = useState<'local' | 'global'>('local');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Modals state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState<FactoryPartner | null>(null);
  const [globalInquiryOpen, setGlobalInquiryOpen] = useState(false);
  const [selectedGlobalPartner, setSelectedGlobalPartner] = useState<GlobalPartner | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState<string | null>(null);

  const handleOpenInquiry = (factory: FactoryPartner) => {
    setSelectedFactory(factory);
    setInquiryModalOpen(true);
  };

  const handleOpenGlobalInquiry = (partner: GlobalPartner) => {
    setSelectedGlobalPartner(partner);
    setGlobalInquiryOpen(true);
  };

  const filteredFactories = FACTORY_PARTNERS.filter((f) => {
    const matchesSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.mainProducts.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.inn.includes(searchQuery);

    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesRegion = selectedRegion === 'all' || f.region === selectedRegion;

    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="space-y-6 text-slate-900 pb-12 font-sans">
      {/* 1. Header Banner */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-2xs border border-slate-200 overflow-hidden">
        <div className="absolute inset-0 tech-grid-pattern opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-sans font-bold text-[#D95D1E] uppercase tracking-wider">
                Zavodlar Reyestri
              </span>
              <span className="bg-orange-50 text-[#D95D1E] border border-orange-200/80 px-2.5 py-0.5 rounded-md text-xs font-sans font-bold">
                100% RASMIY INVOYS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-900">
              Akkreditatsiyalangan Ishlab Chiqaruvchilar
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Vositachilarsiz zavod narxlari, 12% QQS va GOST laboratoriya kafolati.
            </p>
          </div>
          <div className="flex items-center gap-2 font-sans text-xs shrink-0">
            <div className="bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl text-slate-700 flex items-center gap-2 shadow-2xs">
              <span className="text-[#D95D1E] font-black font-mono-numbers">{FACTORY_PARTNERS.length}</span>
              <span>ta strategik zavod</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Success Alert */}
      {inquirySuccess && (
        <Alert
          variant="success"
          title="B2B Shartnomasi So'rovi Qabul Qilindi"
          description={inquirySuccess}
          onDismiss={() => setInquirySuccess(null)}
        />
      )}

      {/* 3. Tab Switcher: Mahalliy Zavodlar vs Global Bunker */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 font-sans text-xs">
        <button
          type="button"
          onClick={() => setSupplierTab('local')}
          className={`px-4 py-2.5 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
            supplierTab === 'local'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>O‘zbekiston Zavodlari (Mahalliy Vitrina)</span>
        </button>

        <button
          type="button"
          onClick={() => setSupplierTab('global')}
          className={`px-4 py-2.5 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
            supplierTab === 'global'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Globe className="w-4 h-4 text-[#D95D1E]" />
          <span>Global Bunker • Xalqaro Tranzit &amp; Import</span>
          <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
            5 TA DAVLAT
          </span>
        </button>
      </div>

      {/* 4. Key Industry KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Hamkor Zavodlar</span>
            <Factory className="w-4 h-4 text-[#D95D1E]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono-numbers">18 ta</div>
          <p className="text-xs text-emerald-700 font-semibold">100% akkreditatsiya</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Oylik Quvvat</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-[#D95D1E] font-mono-numbers">820,000+ t</div>
          <p className="text-xs text-slate-500 font-medium">Uzluksiz ta’minot</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Vositachilik</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono-numbers">0%</div>
          <p className="text-xs text-emerald-600 font-semibold">Toza ulgurji narx</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Sertifikatlar</span>
            <ShieldCheck className="w-4 h-4 text-[#D95D1E]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono-numbers">100%</div>
          <p className="text-xs text-[#D95D1E] font-semibold">ShNQ muvofiqligi</p>
        </div>
      </div>

      {/* 5. Search & Filters Bar (Local) */}
      {supplierTab === 'local' && (
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Zavod nomi, STIR yoki tovar turi bo‘yicha qidiruv..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:border-[#D95D1E] outline-none transition-colors"
              />
            </div>

            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: 'all', label: 'Barcha Ishlab Chiqarish Yo‘nalishlari' },
                { value: 'sement', label: 'Sement & Klinker Zavodlari' },
                { value: 'metall', label: 'Metallurgiya Kombinatlari' },
                { value: 'gisht', label: 'G‘isht & Gazoblok Zavodlari' },
                { value: 'izolyatsiya', label: 'Termoizolyatsiya & Gips' }
              ]}
              sizeVariant="md"
            />

            <Select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              options={[
                { value: 'all', label: 'Barcha Hududlar & Shaharlar' },
                { value: 'tashkent', label: 'Toshkent shahri' },
                { value: 'tashkent_region', label: 'Toshkent viloyati' },
                { value: 'navoi', label: 'Navoiy viloyati' },
                { value: 'bukhara', label: 'Buxoro viloyati' }
              ]}
              sizeVariant="md"
            />
          </div>

          {/* Local Factories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredFactories.map((factory) => (
              <SupplierCard
                key={factory.id}
                factory={factory}
                onOpenInquiry={handleOpenInquiry}
                onNavigateToCatalog={onNavigateToCatalog}
              />
            ))}
          </div>

          {filteredFactories.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Factory className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-heading font-bold text-slate-700">Zavod topilmadi</h3>
              <p className="text-xs text-slate-500">Qidiruv yoki filtr parametrlarini o‘zgartirib ko‘ring.</p>
            </div>
          )}
        </div>
      )}

      {/* 6. Global Bunker International Transit Section */}
      {supplierTab === 'global' && (
        <div className="space-y-6">
          <div className="industrial-card rounded-2xl p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D95D1E]" />
                <h3 className="font-heading font-black text-lg text-white">
                  Global Bunker • To‘g‘ridan-to‘g‘ri Xalqaro Tranzit
                </h3>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Qozog‘iston, Rossiya, Xitoy, Turkiya va Erondagi eng yirik sanoat metallurgiya kombinatlaridan
                to‘g‘ridan-to‘g‘ri vagon va konteyner partiyalarida import. Rasmiy bojxona tozalovi bilan.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 shrink-0">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Bojxona omborigacha fura/vagon</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GLOBAL_PARTNERS.map((partner) => (
              <GlobalTransitCard
                key={partner.id}
                partner={partner}
                onOpenGlobalInquiry={handleOpenGlobalInquiry}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        factory={selectedFactory}
        onSuccess={(msg) => setInquirySuccess(msg)}
      />

      <GlobalInquiryModal
        isOpen={globalInquiryOpen}
        onClose={() => setGlobalInquiryOpen(false)}
        partner={selectedGlobalPartner}
        onSuccess={(msg) => setInquirySuccess(msg)}
      />
    </div>
  );
};
