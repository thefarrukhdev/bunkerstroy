import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Send,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Filter,
  Layers,
  FileText,
  Search,
  ExternalLink
} from 'lucide-react';
import { Modal, Button, Badge, Alert, Input } from '@bunkerstroy/ui';

interface TenderItem {
  id: string;
  tenderNumber: string;
  projectName: string;
  buyerCompany: string;
  buyerInn: string;
  category: 'armatura' | 'sement' | 'gisht' | 'izolyatsiya' | 'kompleks';
  categoryLabel: string;
  volumeSpecification: string;
  estimatedBudget: string;
  deliveryLocation: string;
  submissionDeadline: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'AWARDED';
  participantsCount: number;
}

export const TendersView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedTender, setSelectedTender] = useState<TenderItem | null>(null);

  // Bid form
  const [bidderCompany, setBidderCompany] = useState('');
  const [bidderInn, setBidderInn] = useState('');
  const [bidderPhone, setBidderPhone] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('5');
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);
  const [bidError, setBidError] = useState<string | null>(null);

  const tenders: TenderItem[] = [
    {
      id: 'TND-2026-001',
      tenderNumber: 'TND-84912',
      projectName: 'Toshkent City Lot 4B Ko‘p qavatli bino karkasi',
      buyerCompany: '«Discover Invest» MCHJ',
      buyerInn: '304918234',
      category: 'armatura',
      categoryLabel: 'Metallurgiya & Armatura',
      volumeSpecification: 'Armatura A500C (d12, d16, d25) - Jami 850 tonna',
      estimatedBudget: '7,990,000,000 so‘m',
      deliveryLocation: 'Toshkent sh., Shayxontohur tumani, Navoiy ko‘chasi',
      submissionDeadline: '2026-11-15',
      status: 'OPEN',
      participantsCount: 4
    },
    {
      id: 'TND-2026-002',
      tenderNumber: 'TND-84913',
      projectName: 'Olmazor Business City turar-joy majmuasi (3-bosqich)',
      buyerCompany: '«Murad Buildings» MCHJ',
      buyerInn: '307119455',
      category: 'sement',
      categoryLabel: 'Portlendsement M500',
      volumeSpecification: 'Ohangaron Sement M500 D0 - Jami 2,400 tonna (quymada)',
      estimatedBudget: '1,920,000,000 so‘m',
      deliveryLocation: 'Toshkent sh., Olmazor tumani, Kichik halqa yo‘li',
      submissionDeadline: '2026-11-20',
      status: 'OPEN',
      participantsCount: 6
    },
    {
      id: 'TND-2026-003',
      tenderNumber: 'TND-84914',
      projectName: 'Yangi O‘zbekiston universiteti yotoqxona binosi',
      buyerCompany: '«Yangi Davr Qurilish» AJ',
      buyerInn: '200845112',
      category: 'gisht',
      categoryLabel: 'Pishgan G‘isht & Gazoblok',
      volumeSpecification: 'Avtoklav Gazoblok D500 (600x300x200) - 3,500 m³',
      estimatedBudget: '2,450,000,000 so‘m',
      deliveryLocation: 'Toshkent viloyati, Qibray tumani',
      submissionDeadline: '2026-11-25',
      status: 'OPEN',
      participantsCount: 3
    },
    {
      id: 'TND-2026-004',
      tenderNumber: 'TND-84915',
      projectName: 'Samarqand Xalqaro Logistika Markazi Omborlari',
      buyerCompany: '«Silk Road Logistics Hub» QK',
      buyerInn: '309228411',
      category: 'izolyatsiya',
      categoryLabel: 'Bazalt Termoizolyatsiya',
      volumeSpecification: 'TermoPlast Bazalt 100mm NG - Jami 45,000 m²',
      estimatedBudget: '3,800,000,000 so‘m',
      deliveryLocation: 'Samarqand viloyati, Pastdarg‘om tumani',
      submissionDeadline: '2026-12-05',
      status: 'OPEN',
      participantsCount: 5
    }
  ];

  const handleOpenBid = (tender: TenderItem) => {
    setSelectedTender(tender);
    setBidError(null);
    setBidModalOpen(true);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidderCompany.trim() || !bidderInn.trim() || !bidderPhone.trim() || !bidPrice.trim()) {
      setBidError('Iltimos, barcha maydonlarni to‘ldiring.');
      return;
    }
    setBidSuccess(
      `"${bidderCompany}" korxonasining tender taklifi (${selectedTender?.tenderNumber}) muvaffaqiyatli qabul qilindi. Auksion natijalari E-IMZO kabinetingizga yuboriladi.`
    );
    setBidModalOpen(false);
    setBidderCompany('');
    setBidderInn('');
    setBidderPhone('');
    setBidPrice('');
  };

  const filteredTenders = tenders.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tenderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 text-slate-900 pb-16 font-sans">
      {/* 1. Header Banner */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#D95D1E] uppercase tracking-wider">
                Davlat &amp; Korporativ Xaridlar
              </span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                B2B AUKSION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-900">
              BunkerStroy Tenderlar &amp; Ulgurji Auksion
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Yirik qurilish kompaniyalari va davlat buyurtmachilari uchun ochiq narx pasaytirish auksioni. Zavod va dilerlar to‘g‘ridan-to‘g‘ri qatnashishi mumkin.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#D95D1E]" />
              <span className="font-semibold">{tenders.length} ta faol ochiq tender</span>
            </div>
          </div>
        </div>
      </div>

      {bidSuccess && (
        <Alert
          variant="success"
          title="Tender Taklifi Qabul Qilindi"
          description={bidSuccess}
          onDismiss={() => setBidSuccess(null)}
        />
      )}

      {/* 2. Search & Filter Bar */}
      <div className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-[#D95D1E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tender raqami, ob'ekt nomi yoki buyurtmachi korxona..."
              className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 outline-none focus:border-[#D95D1E]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 outline-none cursor-pointer focus:border-[#D95D1E]"
          >
            <option value="all">Barcha Kategoriyalar</option>
            <option value="armatura">Metallurgiya &amp; Armatura</option>
            <option value="sement">Portlendsement</option>
            <option value="gisht">G‘isht &amp; Gazoblok</option>
            <option value="izolyatsiya">Bazalt Izolyatsiya</option>
          </select>
        </div>
      </div>

      {/* 3. Tenders Grid */}
      <div className="grid grid-cols-1 gap-4 font-mono">
        {filteredTenders.map((tender) => (
          <div
            key={tender.id}
            className="industrial-card rounded-2xl p-4 sm:p-6 bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-slate-900 space-y-4 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                  {tender.tenderNumber}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                  {tender.categoryLabel}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Muddati: <strong className="text-[#D95D1E]">{tender.submissionDeadline}</strong> gacha
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 leading-snug">
                {tender.projectName}
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Spetsifikatsiya: <strong>{tender.volumeSpecification}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Buyurtmachi</span>
                <p className="font-bold text-slate-900 truncate">{tender.buyerCompany}</p>
                <p className="text-[10px] text-slate-500">STIR: {tender.buyerInn}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Boshlang‘ich Byudjet</span>
                <p className="font-black text-[#D95D1E] text-sm font-mono-numbers">{tender.estimatedBudget}</p>
                <p className="text-[10px] text-emerald-600 font-medium">12% QQS kiritilgan</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Yetkazish Manzili</span>
                <p className="font-semibold text-slate-900 truncate">{tender.deliveryLocation}</p>
                <p className="text-[10px] text-slate-500">{tender.participantsCount} ta ishtirokchi arizasi</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>50/50 Escrow Kafolati &amp; Rasmiy E-IMZO Shartnomasi</span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBid(tender)}
                className="bg-[#D95D1E] hover:bg-[#B43B06] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px] transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Tijoriy Taklif (Bid) Berish</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Tender Bid Modal */}
      {selectedTender && (
        <Modal
          isOpen={bidModalOpen}
          onClose={() => setBidModalOpen(false)}
          title={`Tenderga Taklif Topshirish (#${selectedTender.tenderNumber})`}
          subtitle={selectedTender.projectName}
          size="md"
          footer={
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 w-full font-mono text-xs">
              <Button variant="ghost" size="sm" onClick={() => setBidModalOpen(false)} className="min-h-[44px]">
                Bekor qilish
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmitBid} className="min-h-[44px]">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>Taklifni Tasdiqlash</span>
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSubmitBid} className="space-y-3 font-mono text-xs">
            {bidError && <Alert variant="error" description={bidError} onDismiss={() => setBidError(null)} />}

            <div className="space-y-1">
              <label className="text-slate-700 block font-medium">Korxona nomi (Ishlab chiqaruvchi / Diler) *:</label>
              <Input
                placeholder="«Bekobod Metall Hamkor» MCHJ"
                value={bidderCompany}
                onChange={(e) => setBidderCompany(e.target.value)}
                sizeVariant="sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 block font-medium">STIR (9 xonali) *:</label>
                <Input
                  placeholder="309112455"
                  value={bidderInn}
                  onChange={(e) => setBidderInn(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  sizeVariant="sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-medium">Aloqa telefoni *:</label>
                <Input
                  placeholder="+998 90 123-45-67"
                  value={bidderPhone}
                  onChange={(e) => setBidderPhone(e.target.value)}
                  sizeVariant="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 block font-medium">Sizning narx taklifingiz (so‘m) *:</label>
                <Input
                  placeholder="Masalan: 7,500,000,000"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  sizeVariant="sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-medium">Yetkazib berish muddati (kun):</label>
                <Input
                  type="number"
                  placeholder="5"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  sizeVariant="sm"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1 font-sans">
              <p>
                * Taklif g‘olib deb topilsa, shartnoma Didox.uz tizimi orqali E-IMZO bilan tasdiqlanadi.
              </p>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
