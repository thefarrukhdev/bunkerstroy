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
  FileText
} from 'lucide-react';
import {
  Badge,
  Card,
  Button,
  Input,
  Select,
  StatCard,
  Modal,
  Alert
} from '@bunkerstroy/ui';

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
  status: 'OPEN' | 'REVIEW' | 'AWARDED';
  bidsCount: number;
  paymentTerms: string;
}

export const TendersView: React.FC = () => {
  const [tenders, setTenders] = useState<TenderItem[]>([
    {
      id: 'tnd-1',
      tenderNumber: 'BS-TND-2026-04',
      projectName: 'Yangi Toshkent 4-mavze ko‘p qavatli turar-joy majmuasi',
      buyerCompany: '«DISCOVERY INVEST» MChJ',
      buyerInn: '304899120',
      category: 'armatura',
      categoryLabel: 'Armatura A500C',
      volumeSpecification: '1,200 tonna Armatura A500C (diametr 12mm - 25mm)',
      estimatedBudget: '9,840,000,000 so‘m',
      deliveryLocation: 'Toshkent vil., Yangi Toshkent 4-mavze qurilish maydoni',
      submissionDeadline: '28-oktabr 2026, 18:00',
      status: 'OPEN',
      bidsCount: 6,
      paymentTerms: '100% Bank Akkreditivi (Didox E-IMZO orqali)'
    },
    {
      id: 'tnd-2',
      tenderNumber: 'BS-TND-2026-03',
      projectName: 'Chilonzor Business Park & Savdo Majmuasi',
      buyerCompany: '«GOLDEN HOUSE DEVELOPMENT» MChJ',
      buyerInn: '302941552',
      category: 'sement',
      categoryLabel: 'Portlandshement M500',
      volumeSpecification: '2,500 tonna Sement M500 D0 (temir yo‘l hopper va avtotsisterna)',
      estimatedBudget: '3,200,000,000 so‘m',
      deliveryLocation: 'Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko‘chasi',
      submissionDeadline: '31-oktabr 2026, 12:00',
      status: 'OPEN',
      bidsCount: 4,
      paymentTerms: '30% oldindan to‘lov + 70% partiyalar bo‘yicha'
    },
    {
      id: 'tnd-3',
      tenderNumber: 'BS-TND-2026-02',
      projectName: 'Samarqand Silk Road Xalqaro Mehmonxona Majmuasi',
      buyerCompany: '«SAMARKAND TOURISM INVEST» MChJ',
      buyerInn: '301145290',
      category: 'izolyatsiya',
      categoryLabel: 'Bazalt Termoizolyatsiya',
      volumeSpecification: '35,000 m² Bazalt mineral plitalari 100mm (NG sinfi)',
      estimatedBudget: '2,150,000,000 so‘m',
      deliveryLocation: 'Samarqand viloyati, Konigil hududi',
      submissionDeadline: '25-oktabr 2026, 17:00',
      status: 'REVIEW',
      bidsCount: 8,
      paymentTerms: 'Bank kafolati orqali to‘liq to‘lov'
    },
    {
      id: 'tnd-4',
      tenderNumber: 'BS-TND-2026-01',
      projectName: 'Sergeli Sanoat Xabi Logistika Omborlari',
      buyerCompany: '«TASHKENT LOGISTICS PARK» MChJ',
      buyerInn: '307845112',
      category: 'gisht',
      categoryLabel: 'Pishgan G‘isht & Gazoblok',
      volumeSpecification: '650,000 dona Pishgan g‘isht M125 va 1,200 m³ Gazobeton D500',
      estimatedBudget: '1,420,000,000 so‘m',
      deliveryLocation: 'Toshkent sh., Sergeli tumani, Yangi Sergeli ko‘chasi',
      submissionDeadline: 'Yakunlangan',
      status: 'AWARDED',
      bidsCount: 9,
      paymentTerms: '100% to‘lov qilingan (G‘olib: Modul 5)'
    }
  ]);

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'REVIEW' | 'AWARDED'>('ALL');

  // RFQ (Request for Quotation) Modal State
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [rfqProjectName, setRfqProjectName] = useState('');
  const [rfqBuyerCompany, setRfqBuyerCompany] = useState('');
  const [rfqBuyerInn, setRfqBuyerInn] = useState('');
  const [rfqCategory, setRfqCategory] = useState('armatura');
  const [rfqVolume, setRfqVolume] = useState('');
  const [rfqLocation, setRfqLocation] = useState('');
  const [rfqDeadline, setRfqDeadline] = useState('');
  const [rfqSuccessMsg, setRfqSuccessMsg] = useState<string | null>(null);
  const [rfqErrorMsg, setRfqErrorMsg] = useState<string | null>(null);

  // Bid Submission Modal State
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [activeTender, setActiveTender] = useState<TenderItem | null>(null);
  const [bidSupplierName, setBidSupplierName] = useState('');
  const [bidSupplierInn, setBidSupplierInn] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [bidDeliveryDays, setBidDeliveryDays] = useState('');
  const [bidSuccessMsg, setBidSuccessMsg] = useState<string | null>(null);

  const handleOpenBid = (t: TenderItem) => {
    setActiveTender(t);
    setIsBidModalOpen(true);
  };

  const handleSubmitRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqProjectName || !rfqBuyerCompany || !rfqBuyerInn || !rfqVolume || !rfqLocation) {
      setRfqErrorMsg("Iltimos, loyiha, kompaniya, STIR va hajm maydonlarini to'ldiring.");
      return;
    }

    const newTender: TenderItem = {
      id: `tnd-${Date.now()}`,
      tenderNumber: `BS-TND-2026-0${tenders.length + 1}`,
      projectName: rfqProjectName,
      buyerCompany: rfqBuyerCompany,
      buyerInn: rfqBuyerInn,
      category: rfqCategory as any,
      categoryLabel: rfqCategory.toUpperCase(),
      volumeSpecification: rfqVolume,
      estimatedBudget: "Kompaniya so'rovi bo'yicha",
      deliveryLocation: rfqLocation,
      submissionDeadline: rfqDeadline || '14 kun ichida',
      status: 'OPEN',
      bidsCount: 0,
      paymentTerms: 'Bank shartnomasi / E-IMZO'
    };

    setTenders([newTender, ...tenders]);
    setIsRfqModalOpen(false);
    setRfqSuccessMsg(`"${rfqProjectName}" bo'yicha yangi B2B tender muvaffaqiyatli e'lon qilindi! Tasdiqlangan ishlab chiqaruvchilarga xabarnoma yuborildi.`);
    setRfqProjectName('');
    setRfqBuyerCompany('');
    setRfqBuyerInn('');
    setRfqVolume('');
    setRfqLocation('');
    setRfqErrorMsg(null);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidSupplierName || !bidPrice) return;

    if (activeTender) {
      setTenders(
        tenders.map((t) =>
          t.id === activeTender.id ? { ...t, bidsCount: t.bidsCount + 1 } : t
        )
      );
    }

    setIsBidModalOpen(false);
    setBidSuccessMsg(`"${activeTender?.projectName}" bo'yicha taklifingiz (${bidPrice} so'm) qabul qilindi. Buyurtmachi 24 soat ichida javob qaytaradi.`);
    setBidSupplierName('');
    setBidPrice('');
  };

  const filteredTenders = tenders.filter((t) => {
    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* 1. Minimalist Tenders Header */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5">
            <span className="text-xs font-mono font-bold text-bunker-amber-500 uppercase tracking-wider">
              B2B Smeta &amp; Tenderlar
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Qurilish Tenderlari &amp; Smeta RFQ
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Yirik partiyalar uchun zavodlardan eng yaxshi takliflarni olish va shaffof auksion.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => setIsRfqModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Smeta So‘rovi (RFQ) Yaratish</span>
        </Button>
      </div>

      {/* 2. Notifications */}
      {rfqSuccessMsg && (
        <Alert
          variant="success"
          title="Tender Muvaffaqiyatli E'lon Qilindi"
          description={rfqSuccessMsg}
          onDismiss={() => setRfqSuccessMsg(null)}
        />
      )}
      {bidSuccessMsg && (
        <Alert
          variant="success"
          title="Tijoriy Taklif Qabul Qilindi"
          description={bidSuccessMsg}
          onDismiss={() => setBidSuccessMsg(null)}
        />
      )}

      {/* 3. Industry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Faol B2B Tenderlar"
          value="14 ta"
          subtitle="Ochiq takliflar qabul qilinmoqda"
          trend={{ value: '+4 ta bu hafta', isPositive: true }}
          icon={<FileSpreadsheet className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="Umumiy Smeta Hajmi"
          value="42.8 mlrd"
          unit="so‘m"
          subtitle="Yirik poytaxt va viloyat loyihalari"
          trend={{ value: '100% kafolatlangan', isPositive: true }}
          icon={<Building2 className="w-5 h-5" />}
          variant="cyan"
        />
        <StatCard
          title="O‘rtacha Tejamkorlik"
          value="14.5%"
          subtitle="Zavodlar raqobati evaziga"
          trend={{ value: 'Tannarx optimizatsiyasi', isPositive: true }}
          icon={<TrendingDown className="w-5 h-5" />}
          variant="green"
        />
        <StatCard
          title="Huquqiy Himoya"
          value="100%"
          subtitle="E-IMZO orqali rasmiy shartnoma"
          trend={{ value: 'Didox integratsiyasi', isPositive: true }}
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="default"
        />
      </div>

      {/* 4. Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'ALL', label: 'Barcha Tenderlar' },
          { id: 'OPEN', label: 'Ochiq Takliflar' },
          { id: 'REVIEW', label: 'Ko‘rib Chiqilmoqda' },
          { id: 'AWARDED', label: 'G‘olib Aniqlangan' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap border ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 5. Tenders List */}
      <div className="space-y-4">
        {filteredTenders.map((t) => (
          <Card key={t.id} className="p-6 hover:border-slate-300 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="warning" size="sm" isMono>
                    {t.tenderNumber}
                  </Badge>
                  {t.status === 'OPEN' && (
                    <Badge variant="success" size="sm" isMono dot>
                      OCHIQ TAKLIFLAR ({t.bidsCount} ta taklif)
                    </Badge>
                  )}
                  {t.status === 'REVIEW' && (
                    <Badge variant="info" size="sm" isMono dot>
                      TAKLIflAR KO‘RIB CHIQILMOQDA ({t.bidsCount} ta)
                    </Badge>
                  )}
                  {t.status === 'AWARDED' && (
                    <Badge variant="neutral" size="sm" isMono>
                      YAKUNLANGAN (G‘olib aniqlandi)
                    </Badge>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.projectName}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {t.buyerCompany} (STIR: {t.buyerInn})
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {t.deliveryLocation}
                  </span>
                </div>

                <div className="pt-2 text-xs font-mono">
                  <span className="text-slate-400">Talab qilinadigan hajm: </span>
                  <span className="font-bold text-orange-600">{t.volumeSpecification}</span>
                </div>
              </div>

              {/* Right Details & Action */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-left lg:text-right space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Taxminiy Byudjet:
                  </span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {t.estimatedBudget}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    Muddati: {t.submissionDeadline}
                  </span>
                </div>

                {t.status === 'OPEN' && (
                  <Button variant="primary" size="sm" onClick={() => handleOpenBid(t)}>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    <span>Tijoriy Taklif Yuborish</span>
                  </Button>
                )}
                {t.status === 'REVIEW' && (
                  <Button variant="secondary" size="sm" disabled>
                    <span>Ko‘rib chiqilmoqda</span>
                  </Button>
                )}
                {t.status === 'AWARDED' && (
                  <Badge variant="success" size="sm" isMono>
                    Tender yakunlangan
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 6. RFQ Creation Modal */}
      <Modal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        title="Yangi Qurilish Smeta So‘rovi (RFQ) E'lon Qilish"
        subtitle="O‘zbekistonning tasdiqlangan ishlab chiqaruvchilari va zavodlaridan eng yaxshi ulgurji narx takliflarini oling"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="ghost" size="sm" onClick={() => setIsRfqModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmitRfq}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Tenderni E'lon Qilish</span>
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmitRfq} className="space-y-4">
          {rfqErrorMsg && <Alert variant="error" description={rfqErrorMsg} />}

          <Input
            label="Qurilish Obyekti / Majmua Nomi"
            placeholder="Masalan: Mirabad Avenue 2-bosqich, 16 qavatli bino"
            value={rfqProjectName}
            onChange={(e) => setRfqProjectName(e.target.value)}
            sizeVariant="sm"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kompaniya Nomi (Buyurtmachi)"
              placeholder="Masalan: Golden House LLC"
              value={rfqBuyerCompany}
              onChange={(e) => setRfqBuyerCompany(e.target.value)}
              sizeVariant="sm"
            />
            <Input
              label="STIR Raqami (9 xonali)"
              placeholder="302941552"
              value={rfqBuyerInn}
              onChange={(e) => setRfqBuyerInn(e.target.value.replace(/\D/g, '').slice(0, 9))}
              isMono
              sizeVariant="sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Asosiy Material Toifasi"
              value={rfqCategory}
              onChange={(e) => setRfqCategory(e.target.value)}
              sizeVariant="sm"
              options={[
                { value: 'armatura', label: 'Armatura & Metall Konstruksiya' },
                { value: 'sement', label: 'Sement & Beton Bog‘lovchilari' },
                { value: 'gisht', label: 'G‘isht & Gazobeton Bloklar' },
                { value: 'izolyatsiya', label: 'Bazalt Izolyatsiya & Gips' },
                { value: 'kompleks', label: 'Kompleks Qurilish Smetasi' }
              ]}
            />
            <Input
              label="Talab qilinadigan hajm"
              placeholder="Masalan: 1,500 tonna M500 yoki 800 t A500C"
              value={rfqVolume}
              onChange={(e) => setRfqVolume(e.target.value)}
              isMono
              sizeVariant="sm"
            />
          </div>

          <Input
            label="Yetkazib Berish Manzili (Obyekt koordinatasi)"
            placeholder="Toshkent sh., Mirobod tumani, Nukus ko‘chasi"
            value={rfqLocation}
            onChange={(e) => setRfqLocation(e.target.value)}
            sizeVariant="sm"
          />

          <Alert
            variant="info"
            title="Smeta Fayli (Excel / PDF)"
            description="Barcha smeta hujjatlari BunkerStroy platformasida avtomatlashtirilgan tahlildan o'tadi va faqat litsenziyaga ega ishlab chiqaruvchilarga yuboriladi."
          />
        </form>
      </Modal>

      {/* 7. Bid Submission Modal */}
      <Modal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        title="Tijoriy Taklif Yuborish (B2B Bid)"
        subtitle={activeTender ? `${activeTender.projectName} tenderi bo‘yicha zavod taklifi` : undefined}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="ghost" size="sm" onClick={() => setIsBidModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmitBid}>
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>Taklifni Rasmiylashtirish</span>
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmitBid} className="space-y-4">
          <Input
            label="Ishlab Chiqaruvchi / Zavod Nomi"
            placeholder="Masalan: «O‘zmetkombinat» AJ"
            value={bidSupplierName}
            onChange={(e) => setBidSupplierName(e.target.value)}
            sizeVariant="sm"
          />

          <Input
            label="Taklif Qilinadigan Narx (QQS bilan, so‘mda)"
            placeholder="Masalan: 9,450,000,000"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
            isMono
            sizeVariant="sm"
          />

          <Input
            label="Yetkazib Berish Muddati"
            placeholder="Masalan: 7 ish kuni ichida (bosqichma-bosqich)"
            value={bidDeliveryDays}
            onChange={(e) => setBidDeliveryDays(e.target.value)}
            sizeVariant="sm"
          />

          <Alert
            variant="warning"
            icon={<ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />}
            description="Taklif yuborilgach, buyurtmachi bilan E-IMZO orqali rasmiy shartnoma tuzish huquqi paydo bo'ladi."
          />
        </form>
      </Modal>
    </div>
  );
};
