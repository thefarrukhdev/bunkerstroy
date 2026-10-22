import React, { useState } from 'react';
import {
  Factory,
  ShieldCheck,
  MapPin,
  FileText,
  Phone,
  Search,
  CheckCircle2,
  ExternalLink,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  Building2,
  Truck
} from 'lucide-react';
import {
  Badge,
  Card,
  Button,
  Input,
  Select,
  StatCard,
  Modal,
  Alert,
  Tooltip
} from '@bunkerstroy/ui';

interface FactoryPartner {
  id: string;
  name: string;
  brandName: string;
  inn: string;
  region: string;
  address: string;
  category: 'sement' | 'metall' | 'gisht' | 'izolyatsiya';
  categoryLabel: string;
  annualCapacity: string;
  standards: string[];
  mainProducts: string[];
  director: string;
  phone: string;
  contractStatus: 'VERIFIED' | 'STRATEGIC_PARTNER';
  vatPayer: boolean;
  description: string;
}

export const SuppliersView: React.FC<{ onNavigateToCatalog?: () => void }> = ({
  onNavigateToCatalog
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Direct Contract Inquiry Modal
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState<FactoryPartner | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [stir, setStir] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState<string | null>(null);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const factories: FactoryPartner[] = [
    {
      id: 'fac-1',
      name: '«O‘ZMETKOMBINAT» AJ',
      brandName: 'Bekobod Metall',
      inn: '200114523',
      region: 'tashkent_region',
      address: 'Toshkent viloyati, Bekobod shahri, Sanoat zonasi 1',
      category: 'metall',
      categoryLabel: 'Metallurgiya & Armatura',
      annualCapacity: '850,000 tonna / yil',
      standards: ['GOST 5781-82', 'ASTM A615', 'ISO 9001:2015'],
      mainProducts: ['Armatura A500C / A600C', 'Katanka po‘lat', 'Shveller & Ugolok'],
      director: 'Qayumov Alisher',
      phone: '+998 (71) 203-11-22',
      contractStatus: 'STRATEGIC_PARTNER',
      vatPayer: true,
      description: 'Markaziy Osiyodagi eng yirik qora metallurgiya kombinati. Barcha turdagi qurilish konstruksion metallari ishlab chiqaruvchisi.'
    },
    {
      id: 'fac-2',
      name: '«QIZILQUMSEMENT» AJ',
      brandName: 'Qizilqum Sement (Heidelberg)',
      inn: '200845129',
      region: 'navoi',
      address: 'Navoiy viloyati, Navoiy shahri, Sanoat hududi',
      category: 'sement',
      categoryLabel: 'Sement & Klinker',
      annualCapacity: '3,500,000 tonna / yil',
      standards: ['GOST 31108-2020', 'EN 197-1', 'O‘zDSt ISO 14001'],
      mainProducts: ['Portlandshement M500-D0', 'M400-D20', 'Sulfatga chidamli sement'],
      director: 'Xudoyberdiyev Bobur',
      phone: '+998 (79) 229-45-00',
      contractStatus: 'STRATEGIC_PARTNER',
      vatPayer: true,
      description: 'O‘zbekistondagi eng yirik zamonaviy sement zavodi. Xalqaro EN 197-1 standartidagi klinker va yuqori markali sement kafolati.'
    },
    {
      id: 'fac-3',
      name: '«OHANGARONSEMENT» AJ',
      brandName: 'Ohangaron Sement',
      inn: '200056123',
      region: 'tashkent_region',
      address: 'Toshkent viloyati, Ohangaron shahri',
      category: 'sement',
      categoryLabel: 'Sement & Tayyor Qorishmalar',
      annualCapacity: '2,200,000 tonna / yil',
      standards: ['GOST 31108-2020', 'ISO 9001:2015'],
      mainProducts: ['Sement M500 D0', 'Yo‘l qurilishi sementi', 'Quruq qorishmalar'],
      director: 'Toshmatov Jamshid',
      phone: '+998 (70) 642-12-88',
      contractStatus: 'VERIFIED',
      vatPayer: true,
      description: 'Poytaxt va viloyatlar qurilish obyektlari uchun barqaror ta’minotchi. Toshkentga eng yaqin yirik ishlab chiqaruvchi baza.'
    },
    {
      id: 'fac-4',
      name: '«KNAUF GIPS BUXORO» MChJ XK',
      brandName: 'Knauf Gips',
      inn: '204551239',
      region: 'bukhara',
      address: 'Buxoro viloyati, Kogon tumani, Yangi Hayot',
      category: 'izolyatsiya',
      categoryLabel: 'Gips & Pardozlash Tizimlari',
      annualCapacity: '32,000,000 m² / yil',
      standards: ['DIN 18180', 'GOST 6266-97', 'O‘zDSt 2805:2014'],
      mainProducts: ['Gipsokarton plitalari (GKL, GKLV)', 'Knauf Rotband gips', 'Profil tizimlari'],
      director: 'Mirzayev Furqat',
      phone: '+998 (65) 222-10-10',
      contractStatus: 'STRATEGIC_PARTNER',
      vatPayer: true,
      description: 'Germaniya texnologiyasi asosida ishlab chiqariladigan xalqaro sifatdagi gipsokarton va energiya tejamkor fasad qoplamalari.'
    },
    {
      id: 'fac-5',
      name: '«MODUL 5 QURILISH MATERIALLARI» AJ',
      brandName: 'Modul 5 Gazoblok & G‘isht',
      inn: '305112349',
      region: 'tashkent_region',
      address: 'Toshkent viloyati, Zangiota tumani, Qoraqamish MFY',
      category: 'gisht',
      categoryLabel: 'G‘isht & Avtoklav Gazoblok',
      annualCapacity: '450,000 m³ / yil',
      standards: ['GOST 31360-2007', 'GOST 530-2012'],
      mainProducts: ['Avtoklav Gazoblok D500', 'Pishgan qizil g‘isht M125', 'Drenazh g‘isht'],
      director: 'Rustamov Sardor',
      phone: '+998 (71) 277-50-60',
      contractStatus: 'VERIFIED',
      vatPayer: true,
      description: 'Avtomatlashtirilgan nemis liniyasida tayyorlanadigan energiya samarador D500 gazobeton bloklari va sertifikatlangan pishiq g‘isht.'
    },
    {
      id: 'fac-6',
      name: '«TERMO-PLAST IZOLYATSIYA» MChJ',
      brandName: 'TermoPlast Bazalt',
      inn: '308991204',
      region: 'tashkent',
      address: 'Toshkent shahri, Sergeli tumani, Yangi Sergeli ko‘chasi 14',
      category: 'izolyatsiya',
      categoryLabel: 'Bazalt Mineral Izolyatsiyasi',
      annualCapacity: '18,000 tonna / yil',
      standards: ['ShNQ 2.01.04-18', 'GOST 9573-2012', 'ISO 14001'],
      mainProducts: ['Bazalt mineral plitalar 50-100mm', 'Fasad namlik to‘sig‘i', 'Tom izolyatsiyasi'],
      director: 'Ahmedov Nodir',
      phone: '+998 (71) 200-33-88',
      contractStatus: 'VERIFIED',
      vatPayer: true,
      description: 'Binolarning energiya samaradorligini 40% gacha oshiruvchi bazalt tosh tolali plitalar va yong‘inga chidamli (NG) termoizolyatsiya.'
    }
  ];

  const handleOpenInquiry = (factory: FactoryPartner) => {
    setSelectedFactory(factory);
    setInquiryError(null);
    setInquiryModalOpen(true);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !stir.trim() || !contactPhone.trim() || !estimatedMonthlyVolume.trim()) {
      setInquiryError("Iltimos, barcha majburiy maydonlarni (Kompaniya, STIR, Telefon, Oylik hajm) to'ldiring.");
      return;
    }

    if (stir.replace(/\D/g, '').length !== 9) {
      setInquiryError("STIR 9 ta raqamdan iborat bo'lishi shart.");
      return;
    }

    setInquirySuccess(
      `"${companyName}" kompaniyasining ${selectedFactory?.name} zavodiga to'g'ridan-to'g'ri ulgurji shartnoma so'rovi qabul qilindi. Zavod sotuv bo'limi 2 soat ichida tijoriy taklif va temir yo'l yuklash rejasini taqdim etadi.`
    );
    setInquiryModalOpen(false);
    setCompanyName('');
    setStir('');
    setContactPhone('');
    setEstimatedMonthlyVolume('');
    setInquiryError(null);
  };

  const filteredFactories = factories.filter((f) => {
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
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-bunker-amber-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-bunker-amber-500 uppercase tracking-wider">
              Zavodlar Reyestri
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Akkreditatsiyalangan Ishlab Chiqaruvchilar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Vositachilarsiz zavod narxlari, 12% QQS va GOST laboratoriya kafolati.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="neutral" size="sm" isMono>
            {factories.length} ta strategik zavod
          </Badge>
        </div>
      </div>

      {/* 2. Success Alert */}
      {inquirySuccess && (
        <Alert
          variant="success"
          title="Zavod B2B Shartnomasi So'rovi Qabul Qilindi"
          description={inquirySuccess}
          onDismiss={() => setInquirySuccess(null)}
        />
      )}

      {/* 3. Key Industry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Rasmiy Hamkor Zavodlar"
          value="18 ta"
          subtitle="O‘zbekiston va xalqaro brendlar"
          trend={{ value: '100% akkreditatsiya', isPositive: true }}
          icon={<Factory className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="Oylik Ishlab Chiqarish Quvvati"
          value="820,000+"
          unit="t"
          subtitle="Sement, armatura, g‘isht va gips"
          trend={{ value: 'Uzluksiz ta’minot', isPositive: true }}
          icon={<Building2 className="w-5 h-5" />}
          variant="cyan"
        />
        <StatCard
          title="Vositachilik Ustamasi"
          value="0%"
          subtitle="To‘g‘ridan-to‘g‘ri zavod narxlari"
          trend={{ value: 'Toza ulgurji narx', isPositive: true }}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="green"
        />
        <StatCard
          title="Davlat Sertifikatlari"
          value="100%"
          subtitle="GOST, O‘zDSt va ISO 9001 kafolati"
          trend={{ value: 'ShNQ muvofiqligi', isPositive: true }}
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="default"
        />
      </div>

      {/* 4. Search & Filters Bar */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Zavod nomi, STIR yoki tovar turi bo‘yicha qidiruv..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            sizeVariant="sm"
          />

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sizeVariant="sm"
            options={[
              { value: 'all', label: 'Barcha Ishlab Chiqarish Yo‘nalishlari' },
              { value: 'sement', label: 'Sement & Bog‘lovchi Materiallar' },
              { value: 'metall', label: 'Metallurgiya & Konstruksion Po‘lat' },
              { value: 'gisht', label: 'G‘isht & Gazobeton Bloklar' },
              { value: 'izolyatsiya', label: 'Gips & Issiqlik Izolyatsiyasi' }
            ]}
          />

          <Select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            sizeVariant="sm"
            options={[
              { value: 'all', label: 'Barcha Hududlar & Shaharlar' },
              { value: 'tashkent', label: 'Toshkent shahri' },
              { value: 'tashkent_region', label: 'Toshkent viloyati (Bekobod, Ohangaron)' },
              { value: 'navoi', label: 'Navoiy viloyati' },
              { value: 'bukhara', label: 'Buxoro viloyati' }
            ]}
          />
        </div>
      </Card>

      {/* 5. Verified Factories Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredFactories.map((f) => (
          <Card key={f.id} className="p-6 flex flex-col justify-between space-y-5 hover:border-slate-300 transition-all">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" size="sm" isMono>
                      {f.categoryLabel}
                    </Badge>
                    {f.contractStatus === 'STRATEGIC_PARTNER' && (
                      <Badge variant="success" size="sm" isMono dot>
                        STRATEGIK HAMKOR
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{f.name}</h3>
                  <p className="text-xs font-semibold text-orange-600 font-mono">{f.brandName}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <Factory className="w-5 h-5 text-slate-600" />
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>

              {/* Data Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">STIR (INN):</span>
                  <span className="font-bold text-slate-800">{f.inn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Ishlab Chiqarish Quvvati:</span>
                  <span className="font-bold text-slate-800">{f.annualCapacity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Manzil:</span>
                  <span className="text-slate-700 truncate block">{f.address}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">QQS To‘lovchi:</span>
                  <span className="text-emerald-700 font-bold">12% QQS To‘liq Tasdiqlangan</span>
                </div>
              </div>

              {/* Certified Standards Badges */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                  Sertifikatlar & Davlat Standartlari:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {f.standards.map((std, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-medium"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Products */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                  Asosiy Tovarlar:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {f.mainProducts.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-800 text-[11px] font-mono font-semibold"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{f.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                {onNavigateToCatalog && (
                  <Button variant="secondary" size="sm" onClick={onNavigateToCatalog}>
                    <span>Katalogda Ko‘rish</span>
                  </Button>
                )}
                <Button variant="primary" size="sm" onClick={() => handleOpenInquiry(f)}>
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  <span>Zavod Shartnomasi</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 6. Direct Factory Contract Inquiry Modal */}
      <Modal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        title="To‘g‘ridan-to‘g‘ri Zavod B2B Shartnomasi So‘rovi"
        subtitle={selectedFactory ? `${selectedFactory.name} rasmiy korxonasiga ulgurji xarid so‘rovi yuborish` : undefined}
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="ghost" size="sm" onClick={() => setInquiryModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmitInquiry}>
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              <span>Shartnoma So‘rovini Yuborish</span>
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmitInquiry} className="space-y-4">
          {inquiryError && <Alert variant="error" description={inquiryError} />}

          <Alert
            variant="info"
            title="To‘g‘ridan-to‘g‘ri Zavod Narxi Kafolati"
            description="BunkerStroy platformasi orqali yuborilgan so‘rovlar ishlab chiqaruvchi zavodning to‘g‘ridan-to‘g‘ri B2B departamentiga tushadi va 0% vositachilik ustamasi bilan rasmiylashtiriladi."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="B2B Kompaniya Nomi (Xaridor)"
              placeholder="Masalan: Murad Buildings LLC"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              isMono
              sizeVariant="sm"
            />

            <Input
              label="Soliq To‘lovchi STIR (9 xonali)"
              placeholder="304829102"
              value={stir}
              onChange={(e) => setStir(e.target.value.replace(/\D/g, '').slice(0, 9))}
              isMono
              sizeVariant="sm"
              helperText="Davlat Soliq Qo‘mitasi bazasi orqali QQS to‘lovchi ekanligi tasdiqlanadi"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Aloqa Uchun Telefon"
              placeholder="+998 (90) 123-45-67"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              isMono
              sizeVariant="sm"
            />

            <Input
              label="Kutilayotgan Oylik Xarid Hajmi"
              placeholder="Masalan: 1,500 tonna / oy"
              value={estimatedMonthlyVolume}
              onChange={(e) => setEstimatedMonthlyVolume(e.target.value)}
              isMono
              sizeVariant="sm"
              helperText="Minimal partiya: 1 samosval yoki 1 temir yo‘l vagoni"
            />
          </div>

          <Alert
            variant="warning"
            icon={<ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />}
            description="Barcha rasmiy shartnomalar E-IMZO raqamli elektron imzosi orqali DIDX.uz elektron hujjat aylanish tizimida yuridik kuchga ega bo‘ladi."
          />
        </form>
      </Modal>
    </div>
  );
};
