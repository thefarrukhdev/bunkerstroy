import React, { useState } from 'react';
import {
  Globe,
  Train,
  ShieldCheck,
  Container,
  FileText,
  CheckCircle2,
  Building2,
  PhoneCall,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  Badge,
  Card,
  Button,
  StatCard,
  Modal,
  Input,
  Select,
  Alert
} from '@bunkerstroy/ui';

interface GlobalPartner {
  id: string;
  name: string;
  country: string;
  category: string;
  materials: string[];
  capacity: string;
  transitTime: string;
  deliveryMethod: string;
  certified: string;
}

export const GlobalBunkerHubView: React.FC = () => {
  const partners: GlobalPartner[] = [
    {
      id: 'gp-1',
      name: 'Heidelberg Materials AG',
      country: 'Germaniya (DE)',
      category: 'Sement Klinkeri & Maxsus Bog‘lovchilar',
      materials: ['Portlandshement M600-D0', 'Sulfatga chidamli klinker'],
      capacity: '25,000 tonna / oy',
      transitTime: '12-16 kun',
      deliveryMethod: 'Temir yo‘l hopper vagonlari',
      certified: 'ISO 9001, EN 197-1'
    },
    {
      id: 'gp-2',
      name: 'POSCO Steel Corporation',
      country: 'Janubiy Koreya (KR)',
      category: 'Konstruksion Metall & Yuqori Markali Armatura',
      materials: ['Armatura A500C / A600C', 'Dvuhtavr (Beam)'],
      capacity: '18,000 tonna / oy',
      transitTime: '18-22 kun',
      deliveryMethod: 'Multimodal (Dengiz + TY Container)',
      certified: 'ASTM A615, KS D 3504'
    },
    {
      id: 'gp-3',
      name: 'Saint-Gobain Weber',
      country: 'Fransiya (FR)',
      category: 'Izolyatsiya & Akustik Qoplamalar',
      materials: ['Bazalt mineral plitalar', 'Fasad namlik to‘siqlari'],
      capacity: '12,000 kv.m / oy',
      transitTime: '10-14 kun',
      deliveryMethod: 'TIR Avto-fura va TY vagon',
      certified: 'CE Mark, ISO 14001'
    }
  ];

  // Interactive B2B Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('gp-1');
  const [companyName, setCompanyName] = useState('');
  const [stir, setStir] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [customsTerminal, setCustomsTerminal] = useState('tashkent_chukursay');
  const [volume, setVolume] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleOpenModal = (partnerId?: string) => {
    if (partnerId) {
      setSelectedPartnerId(partnerId);
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !stir.trim() || !phone.trim() || !volume.trim()) {
      setFormError("Iltimos, barcha majburiy maydonlarni (Kompaniya, STIR, Telefon, Hajm) to'ldiring.");
      return;
    }

    if (stir.replace(/\D/g, '').length !== 9) {
      setFormError("STIR 9 ta raqamdan iborat bo'lishi shart.");
      return;
    }

    const partnerName =
      partners.find((p) => p.id === selectedPartnerId)?.name || 'Xalqaro Hamkor';

    setSubmitSuccess(
      `"${companyName}" kompaniyasi uchun ${partnerName} zavodidan ${volume} hajmiga B2B import so'rovi qabul qilindi. 2 soat ichida tijoriy taklif va temir yo'l vagonlari jadvali taqdim etiladi.`
    );
    setIsModalOpen(false);

    // Reset fields
    setCompanyName('');
    setStir('');
    setContactPerson('');
    setPhone('');
    setVolume('');
    setFormError(null);
  };

  const partnerOptions = [
    ...partners.map((p) => ({
      label: `${p.name} (${p.country})`,
      value: p.id
    })),
    { label: 'Boshqa xalqaro ishlab chiqaruvchi (maxsus so‘rov)', value: 'custom_other' }
  ];

  const terminalOptions = [
    { label: 'Toshkent-Tovarniy (Chukursay bojxona posti)', value: 'tashkent_chukursay' },
    { label: 'Sergeli Logistika Markazi (TY vagonlar)', value: 'sergeli_hub' },
    { label: 'Navoiy Xalqaro Multimodal Hub (EIZ)', value: 'navoi_eiz' },
    { label: 'Samarqand-Tovarniy bojxona hududi', value: 'samarkand_hub' }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Minimalist Global Bunker Header */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider">
              Xalqaro Import &amp; TY Vagonlar
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-bunker-text-primary">
            Xalqaro Ta'minot &amp; Temir Yo‘l Koridorlari
          </h1>
          <p className="text-xs sm:text-sm text-bunker-text-secondary mt-1">
            Xorijiy ishlab chiqaruvchilardan to‘g‘ridan-to‘g‘ri import klinker, armatura va fasad materiallari.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="neutral" size="sm" isMono>
            {partners.length} ta xalqaro koridor
          </Badge>
        </div>
      </div>

      {/* 2. Success Banner Notification */}
      {submitSuccess && (
        <Alert
          variant="success"
          title="B2B Import Shartnomasi So'rovi Qabul Qilindi"
          description={submitSuccess}
          onDismiss={() => setSubmitSuccess(null)}
        />
      )}

      {/* 3. Global Bunker KPI StatCard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Oylik Import Quvvati"
          value="55,000+"
          unit="t"
          subtitle="Temir yo'l va multimodal koridor"
          trend={{ value: '+14%', isPositive: true, label: 'vs 2025' }}
          icon={<Train className="w-5 h-5 text-bunker-amber-500" />}
          variant="amber"
        />
        <StatCard
          title="Faol Xalqaro Koridorlar"
          value="8 ta"
          subtitle="Germaniya, Koreya, Turkiya, RF, Qozog'iston"
          trend={{ value: 'Uzluksiz', isPositive: true, label: '24/7 dispetcherlik' }}
          icon={<Globe className="w-5 h-5 text-sky-600" />}
          variant="cyan"
        />
        <StatCard
          title="O'rtacha Tranzit Vaqti"
          value="14"
          unit="kun"
          subtitle="Toshkent-Tovarniy (Chukursay)"
          trend={{ value: '-2.5 kun', isPositive: true, label: 'jadval bo‘yicha' }}
          icon={<Container className="w-5 h-5 text-emerald-600" />}
          variant="green"
        />
        <StatCard
          title="ShNQ & ISO Standart"
          value="100%"
          subtitle="EN 197-1 / ASTM A615 akkreditatsiya"
          trend={{ value: 'Kafolatlangan', isPositive: true, label: 'Davlat nazorati' }}
          icon={<ShieldCheck className="w-5 h-5 text-slate-700" />}
          variant="default"
        />
      </div>

      {/* 4. Verified Global Partners Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-bunker-text-primary flex items-center gap-2">
            <Building2 className="w-5 h-5 text-bunker-amber-500" />
            Akkreditatsiyalangan Xorijiy Zavodlar
          </h2>
          <Button variant="secondary" size="sm" onClick={() => handleOpenModal()}>
            <span>Maxsus Buyurtma Berish</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {partners.map((p) => (
            <Card key={p.id} className="flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" isMono className="bg-orange-50 text-orange-800 border-orange-200">{p.country}</Badge>
                  <span className="text-[11px] font-mono text-bunker-text-muted flex items-center gap-1">
                    <Train className="w-3.5 h-3.5 text-bunker-amber-500" />
                    {p.transitTime}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-bunker-text-primary text-lg">{p.name}</h3>
                  <p className="text-xs text-bunker-amber-500 font-mono mt-0.5 font-semibold">{p.category}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-bunker-border-subtle text-xs text-bunker-text-secondary font-mono">
                  <div>
                    <span className="text-bunker-text-muted">Yetkazish turi:</span> {p.deliveryMethod}
                  </div>
                  <div>
                    <span className="text-bunker-text-muted">Ta'minot quvvati:</span> {p.capacity}
                  </div>
                  <div>
                    <span className="text-bunker-text-muted">Sertifikat:</span> {p.certified}
                  </div>
                </div>

                <div className="pt-2 border-t border-bunker-border-subtle">
                  <span className="text-[10px] uppercase font-mono text-bunker-text-muted block mb-1 font-bold">
                    Asosiy Mahsulotlar:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {p.materials.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-bunker-border-subtle text-bunker-text-primary"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => handleOpenModal(p.id)}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                <span>B2B Shartnoma So'rash</span>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Interactive B2B Import Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Xalqaro B2B Import Shartnomasi So'rovi"
        subtitle="To'g'ridan-to'g'ri xorijiy zavoddan ulgurji ta'minot shartnomasi rasmiylashtirish"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmitRequest}>
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              <span>Shartnoma So'rovini Yuborish</span>
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          {formError && (
            <Alert variant="error" description={formError} />
          )}

          <Alert
            variant="info"
            title="INCOTERMS 2020 CIP/DAP Standarti"
            description="Barcha yuklar O'zbekiston Respublikasi bojxona deklaratsiyasi (GTD), sifat sertifikatlari va to'liq sug'urta paketi bilan rasmiylashtiriladi."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Hamkor Zavod / Ishlab Chiqaruvchi"
              options={partnerOptions}
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              sizeVariant="sm"
            />

            <Input
              label="Kutilayotgan Hajm"
              placeholder="Masalan: 3,000 tonna yoki 5 ta hopper"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              isMono
              sizeVariant="sm"
              helperText="Minimal partiya: 1 temir yo‘l vagoni (60 tonna)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="B2B Kompaniya Nomi"
              placeholder="Masalan: Discovery Invest LLC"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              isMono
              sizeVariant="sm"
            />

            <Input
              label="Soliq To‘lovchi STIR (INN)"
              placeholder="9 xonali STIR raqami"
              value={stir}
              onChange={(e) => setStir(e.target.value.replace(/\D/g, '').slice(0, 9))}
              isMono
              sizeVariant="sm"
              helperText="Davlat soliq ma'lumotlar bazasi bilan tekshiriladi"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mas'ul Shaxs Ism-Familiyasi"
              placeholder="Masalan: Bobur Karimov"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              sizeVariant="sm"
            />

            <Input
              label="Bog'lanish Uchun Telefon"
              placeholder="+998 (90) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isMono
              sizeVariant="sm"
              helperText="SMS tasdiqlash kodi va vagon bildirishnomasi yuboriladi"
            />
          </div>

          <Select
            label="Yetkazish Manzili / Bojxona Terminali"
            options={terminalOptions}
            value={customsTerminal}
            onChange={(e) => setCustomsTerminal(e.target.value)}
            sizeVariant="sm"
          />

          <Alert
            variant="warning"
            icon={<ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />}
            description="Barcha rasmiy shartnomalar E-IMZO raqamli elektron imzosi orqali DIDX.uz elektron hujjat aylanish tizimida yuridik kuchga ega bo'ladi."
          />
        </form>
      </Modal>
    </div>
  );
};
