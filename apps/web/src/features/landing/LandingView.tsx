import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HardHat,
  Package,
  Calculator,
  Truck,
  Factory,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  MapPin,
  Clock,
  PhoneCall,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Lock,
  Zap,
  Users,
  Award,
  BarChart3
} from 'lucide-react';
import { cn, Button, Badge } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../services/mobileBridge';

interface LandingViewProps {
  onNavigateToCatalog: () => void;
  onOpenAuth?: () => void;
}

/* ==========================================================================
   Target Audiences Data
   ========================================================================== */
interface AudienceProfile {
  id: string;
  badge: string;
  title: string;
  roleDescription: string;
  painPoints: string[];
  solutions: string[];
  ctaLabel: string;
  ctaRoute: string;
  icon: React.ElementType;
  accentColor: string;
}

const AUDIENCE_PROFILES: AudienceProfile[] = [
  {
    id: 'contractors',
    badge: 'B2B Pudratchilar & Developerlar',
    title: 'Bosh Pudratchi va Qurilish Kompaniyalari',
    roleDescription: 'Ko‘p qavatli turar-joylar, sanoat majmualari va infratuzilma obyektlarini barpo etuvchi bosh pudratchilar va smetachilar.',
    painPoints: [
      'Material kechikishi sababli kran va ishchilar to‘xtab qolishi (prostoy)',
      'Vositachilarning 15–25% asossiz ustamalari va soxta sement/armatura',
      'Rasmiy QQS (NDS) schyot-fakturalar va laboratoriya GOST sertifikatlaridagi muammolar'
    ],
    solutions: [
      'To‘g‘ridan-to‘g‘ri ishlab chiqaruvchi zavodlar bilan shartnoma va ulgurji narxlar',
      'Har bir partiya uchun 100% rasmiy GOST laboratoriya pasporti',
      '50/50 Escrow tizimi: pul faqat yuk obyektda qabul qilingach zavodga o‘tkaziladi',
      'B2B Tender auksionlari orqali yirik partiyalarga eng past narxni yutib olish'
    ],
    ctaLabel: 'Ulgurji Katalogga O‘tish',
    ctaRoute: '/catalog',
    icon: HardHat,
    accentColor: '#FFB800'
  },
  {
    id: 'foremen',
    badge: 'Usta, Prorab & Xususiy Quruvchilar',
    title: 'Usta Brigadalari va Xususiy Uy Quruvchilar',
    roleDescription: 'Hovli, dala hovli (dacha), savdo do‘koni yoki xususiy bino qurayotgan usta brigadalari va prorablar.',
    painPoints: [
      'Aniq smetani hisoblay olmaslik (material yetmay qolishi yoki ortib uvol bo‘lishi)',
      'Og‘ir materiallarni tashish uchun bozorlarda yuk mashinasi (HOWO, ZIL) qidirish',
      'Bozorga borib vaqt yo‘qotish va narxlarning kunlik o‘zgarib turishi'
    ],
    solutions: [
      'Aqlli smeta kalkulyatorlari: poydevor, devor va stajka uchun sement va qumni aniq hisoblash',
      '1 marta bosishda yuk mashinasi (HOWO, Isuzu) bilan to‘g‘ridan-to‘g‘ri obyekt eshigigacha yetkazish',
      'Shaffof, qayd etilgan narxlar va navbatsiz tezkor yetkazib berish'
    ],
    ctaLabel: 'Smeta Kalkulyatorini Ochish',
    ctaRoute: '/calculators',
    icon: Calculator,
    accentColor: '#38BDF8'
  },
  {
    id: 'manufacturers',
    badge: 'Ishlab Chiqaruvchi Zavodlar',
    title: 'Sanoat Zavodlari va Rasmiy Dilerlar',
    roleDescription: 'Sement, metalloprokat, pishgan g‘isht, gazoblok, beton va quruq qorishmalar ishlab chiqaruvchi korxonalar.',
    painPoints: [
      'Doimiy yirik xaridorlar oqimi yetishmasligi va marketing xarajatlari',
      'Qarzga sotish va xaridorlardan oylab pulni undira olmaslik (debitorka fojeasi)',
      'Ombor qoldiqlari va kassa jarayonlarini boshqarishda raqamli tizim yo‘qligi'
    ],
    solutions: [
      'BunkerStroy Seller POS/CRM ekotizimiga bepul ulanish va avtomatik qoldiqlar nazorati',
      '100% kafolatlangan bank depoziti: xaridor puli oldindan muzlatiladi, zavod xavfsiz yuklaydi',
      'O‘zbekiston bo‘ylab minglab faol qurilish obyektlariga to‘g‘ridan-to‘g‘ri chiqish'
    ],
    ctaLabel: 'Zavod / Sotuvchi Paneli',
    ctaRoute: '/seller-panel',
    icon: Factory,
    accentColor: '#10B981'
  },
  {
    id: 'drivers',
    badge: 'Og‘ir Park & Haydovchilar',
    title: 'HOWO, Shacman va Maxsus Texnika Haydovchilari',
    roleDescription: 'Samosval, sementovoz, mikser va bortli og‘ir yuk mashinalari egalari hamda logistika kompaniyalari.',
    painPoints: [
      'Mashinaning bekor turib qolishi (prostoy) va doimiy buyurtma yo‘qligi',
      'Bir tomonga yuk eltib, orqaga bo‘sh qaytish (pustoy probeg va yoqilg‘i yo‘qotish)',
      'Yuk tushirilgandan so‘ng xaridorlar pulni cho‘zishi yoki to‘lamay aldashi'
    ],
    solutions: [
      'BunkerStroy Driver PWA ilovasi orqali og‘ir yuk buyurtmalarining jonli oqimi',
      'Avtomatik marshrutlash va qulay oraliq yuklarni qabul qilish (bo‘sh qaytishga chek)',
      'Kafolatlangan to‘lov: mijoz aytgan 4 xonali PIN kiritilishi bilanoq yo‘l haqi haydovchi hisobiga tushadi'
    ],
    ctaLabel: 'Haydovchi Ilovasini Ko‘rish',
    ctaRoute: '/driver',
    icon: Truck,
    accentColor: '#F59E0B'
  }
];

/* ==========================================================================
   Popular Categories Data
   ========================================================================== */
interface PopularCategory {
  id: string;
  name: string;
  spec: string;
  volumeInfo: string;
  icon: string;
  badge: string;
}

const POPULAR_CATEGORIES: PopularCategory[] = [
  {
    id: 'sement',
    name: 'Sement & Quruq Qorishmalar',
    spec: 'M400, M500 D0/D20, Shuvoq, Kley',
    volumeInfo: '50 kg qoplar va 40t sementovozlar',
    icon: '🏗️',
    badge: 'Zavod narxida'
  },
  {
    id: 'armatura',
    name: 'Metalloprokat & Armatura',
    spec: 'A500C, A400, Katanka, Shveller, Truba',
    volumeInfo: 'O‘lchamlari 10–32mm, GOST 34028',
    icon: '⛓️',
    badge: 'O‘zmetkombinat'
  },
  {
    id: 'gisht',
    name: 'G‘isht & Gazoblok',
    spec: 'M125 pishgan g‘isht, D500/D600 avtoklav blok',
    volumeInfo: 'Paletada yetkazish va kran bilan tushirish',
    icon: '🧱',
    badge: 'Sertifikatlangan'
  },
  {
    id: 'qum-shaghal',
    name: 'Qum, Shag‘al & Chaqiq Tosh',
    spec: 'Karyer qumi, yuvilgan qum, 5–20mm shag‘al',
    volumeInfo: '25–35 tonnalik HOWO samosvallar',
    icon: '⛰️',
    badge: 'Tezkor yetkazish'
  },
  {
    id: 'yoghoch',
    name: 'Yog‘och & Taxta Materiallari',
    spec: 'Rossiya qarag‘ay taxtalari, Brus, Fanera',
    volumeInfo: 'Qurilish va qolip (opalubka) uchun',
    icon: '🌲',
    badge: '1-nav'
  },
  {
    id: 'izolyatsiya',
    name: 'Tom Yopish & Issiqlik Izolyatsiyasi',
    spec: 'Penoplast, Bazalt paxta, Profnastil',
    volumeInfo: 'Energotejamkor ESCO standartlari',
    icon: '🏠',
    badge: 'ESCO tejamkor'
  }
];

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateToCatalog,
  onOpenAuth
}) => {
  const navigate = useNavigate();
  const [selectedAudience, setSelectedAudience] = useState<string>('contractors');

  // Mini Cement/Concrete Calculator State
  const [calcLength, setCalcLength] = useState<number>(10);
  const [calcWidth, setCalcWidth] = useState<number>(8);
  const [calcHeight, setCalcHeight] = useState<number>(0.3); // 30cm thickness
  const [calcGrade, setCalcGrade] = useState<'M400' | 'M500'>('M400');

  // Live Concrete Calculation
  const calcResults = useMemo(() => {
    const volume = Math.max(0.1, Number((calcLength * calcWidth * calcHeight).toFixed(2)));
    
    // Concrete mix formula per 1 m3:
    // M400: ~350 kg cement (7 bags of 50kg), 0.45 m3 sand, 0.8 m3 crushed stone
    // M500: ~420 kg cement (8.4 bags of 50kg), 0.42 m3 sand, 0.82 m3 crushed stone
    const cementBagsPerM3 = calcGrade === 'M400' ? 7 : 8.5;
    const sandPerM3 = calcGrade === 'M400' ? 0.45 : 0.42;
    const gravelPerM3 = calcGrade === 'M400' ? 0.8 : 0.82;

    const totalCementBags = Math.ceil(volume * cementBagsPerM3);
    const totalCementTons = (totalCementBags * 50) / 1000;
    const totalSandM3 = Number((volume * sandPerM3).toFixed(1));
    const totalGravelM3 = Number((volume * gravelPerM3).toFixed(1));

    // Approximate cost: 1 bag M400 ~ 58,000 UZS, M500 ~ 68,000 UZS
    const bagPrice = calcGrade === 'M400' ? 58000 : 68000;
    const sandPricePerM3 = 120000;
    const gravelPricePerM3 = 145000;

    const approxTotalUzs = (totalCementBags * bagPrice) + (totalSandM3 * sandPricePerM3) + (totalGravelM3 * gravelPricePerM3);

    return {
      volume,
      totalCementBags,
      totalCementTons,
      totalSandM3,
      totalGravelM3,
      approxTotalUzs
    };
  }, [calcLength, calcWidth, calcHeight, calcGrade]);

  const activeAudience = AUDIENCE_PROFILES.find((a) => a.id === selectedAudience) || AUDIENCE_PROFILES[0];

  const handleAudienceChange = (id: string) => {
    triggerHaptic('light');
    setSelectedAudience(id);
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-2 sm:py-6 text-slate-100">
      
      {/* ====================================================================
          1. HERO SECTION: Industrial Visual Aesthetics & High-Impact Copy
          ==================================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0A1931] via-[#0F2547] to-[#0A1931] border-2 border-[#1E3A6D] shadow-[0_20px_60px_rgba(7,19,38,0.8)] p-6 sm:p-10 lg:p-14">
        {/* Subtle Industrial Background Grid & Hazard Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 hazard-stripe-sm opacity-90" />
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Live Industrial Ecosystem Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#132C54] border border-[#FFB800]/60 text-sky-200 text-xs sm:text-sm font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[#FFB800] font-bold">BUNKERSTROY B2B</span>
            <span className="text-slate-400">|</span>
            <span>O‘zbekiston Sanoat &amp; Qurilish Materiallari Ekotizimi</span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] font-sans">
            Zavod Narxlarida To‘g‘ridan-to‘g‘ri Yetkazib Berish.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-300 to-[#FF9000]">
              100% Escrow Kafolati Bilan.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-sky-200/90 max-w-3xl mx-auto leading-relaxed">
            Yirik bosh pudratchilar, qurilish ob‘ektlari, ishlab chiqaruvchi zavodlar va og‘ir HOWO/Shacman logistika parkini yagona xavfsiz raqamli platformada birlashtiramiz.
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              onClick={() => {
                triggerHaptic('medium');
                onNavigateToCatalog();
              }}
              className="bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-black text-base px-7 py-3.5 rounded-xl shadow-[0_0_25px_rgba(255,184,0,0.4)] border-2 border-[#FFD000] cursor-pointer flex items-center gap-2.5 transition-all min-h-[48px] touch-target-44 hover:scale-[1.02]"
            >
              <Package className="w-5 h-5 text-[#071326]" />
              <span>Katalog &amp; Ulgurji Narxlar</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                triggerHaptic('light');
                navigate('/calculators');
              }}
              className="bg-[#0F2547] hover:bg-[#132C54] text-white border-2 border-[#38BDF8]/60 font-bold text-base px-6 py-3.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all min-h-[48px] touch-target-44"
            >
              <Calculator className="w-5 h-5 text-[#38BDF8]" />
              <span>Smeta Kalkulyatori</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                triggerHaptic('light');
                navigate('/tenders');
              }}
              className="bg-[#0A1931] hover:bg-[#0F2547] text-sky-200 border-2 border-[#1E3A6D] font-bold text-base px-6 py-3.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all min-h-[48px] touch-target-44"
            >
              <FileSpreadsheet className="w-5 h-5 text-[#FFB800]" />
              <span>B2B Tender E‘lon Qilish</span>
            </Button>
          </div>

          {/* Escrow Trust Micro-Badge */}
          <div className="pt-4 flex items-center justify-center gap-6 text-xs sm:text-sm font-mono text-sky-300/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>50/50 Bank Escrow Himoyasi</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FFB800]" />
              <span>GOST Laboratoriya Sertifikatlari</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#38BDF8]" />
              <span>Jonli GPS Telemetriya</span>
            </span>
          </div>
        </div>

        {/* ==================================================================
            Live Metrics Strip
            ================================================================== */}
        <div className="mt-12 pt-8 border-t border-[#1E3A6D] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 rounded-2xl bg-[#0A1931]/80 border border-[#1E3A6D] text-center">
            <div className="text-2xl sm:text-4xl font-black font-mono text-[#FFB800]">120+</div>
            <div className="text-xs sm:text-sm text-sky-200/80 font-medium mt-1">Hamkor Ishlab Chiqaruvchi Zavodlar</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0A1931]/80 border border-[#1E3A6D] text-center">
            <div className="text-2xl sm:text-4xl font-black font-mono text-sky-400">500,000+</div>
            <div className="text-xs sm:text-sm text-sky-200/80 font-medium mt-1">Tonna Yetkazilgan Og‘ir Material</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0A1931]/80 border border-[#1E3A6D] text-center">
            <div className="text-2xl sm:text-4xl font-black font-mono text-emerald-400">100%</div>
            <div className="text-xs sm:text-sm text-sky-200/80 font-medium mt-1">50/50 Xavfsiz Escrow Bitimlari</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0A1931]/80 border border-[#1E3A6D] text-center">
            <div className="text-2xl sm:text-4xl font-black font-mono text-amber-400">24/7</div>
            <div className="text-xs sm:text-sm text-sky-200/80 font-medium mt-1">HOWO &amp; Shacman GPS Tarmog‘i</div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. TARGET AUDIENCES: Kimlarga Mos? (4 ICP Profiles)
          ==================================================================== */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/40 font-mono text-xs px-3 py-1">
            MAQSADLI AUDITORIYA &amp; EKOTIZIM
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            BunkerStroy Kimlar Uchun Maxsus Yaratilgan?
          </h2>
          <p className="text-sm sm:text-base text-sky-200/80">
            Biz qurilish bozoridagi 4 ta asosiy ishtirokchining eng og‘riqli muammolarini yagona texnologik zanjirda hal qilamiz.
          </p>
        </div>

        {/* Audience Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] max-w-4xl mx-auto">
          {AUDIENCE_PROFILES.map((profile) => {
            const Icon = profile.icon;
            const isSelected = profile.id === selectedAudience;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleAudienceChange(profile.id)}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer min-h-[44px] touch-target-44',
                  isSelected
                    ? 'bg-[#132C54] text-[#FFB800] border-2 border-[#FFB800] shadow-md scale-[1.02]'
                    : 'text-sky-200/70 hover:text-white hover:bg-[#0F2547] border border-transparent'
                )}
              >
                <Icon className={cn('w-4 h-4', isSelected ? 'text-[#FFB800]' : 'text-sky-300')} />
                <span>{profile.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Audience Detailed Card */}
        <div className="rounded-3xl bg-[#0F2547] border-2 border-[#1E3A6D] p-6 sm:p-10 shadow-xl transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Audience Header & Role */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#132C54] border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono">
                <activeAudience.icon className="w-4 h-4 text-[#FFB800]" />
                <span>{activeAudience.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {activeAudience.title}
              </h3>

              <p className="text-sm sm:text-base text-sky-200 leading-relaxed">
                {activeAudience.roleDescription}
              </p>

              <div className="pt-2">
                <Button
                  onClick={() => {
                    triggerHaptic('medium');
                    navigate(activeAudience.ctaRoute);
                  }}
                  className="bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-black text-sm px-6 py-3 rounded-xl cursor-pointer flex items-center gap-2 min-h-[44px] touch-target-44 shadow-md"
                >
                  <span>{activeAudience.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right: Pain Points vs BunkerStroy Solutions */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Pain Points Box */}
              <div className="p-5 rounded-2xl bg-[#0A1931]/90 border border-red-500/30 space-y-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>BOZORDAGI DARD &amp; TO‘SIQLAR</span>
                </div>
                <ul className="space-y-3">
                  {activeAudience.painPoints.map((pain, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <span className="text-red-400 font-bold mt-0.5">✕</span>
                      <span>{pain}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* BunkerStroy Solution Box */}
              <div className="p-5 rounded-2xl bg-[#132C54]/90 border border-emerald-500/40 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>BUNKERSTROY YECHIMI</span>
                </div>
                <ul className="space-y-3">
                  {activeAudience.solutions.map((sol, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-sky-100 font-medium">
                      <span className="text-[#FFB800] font-black mt-0.5">✓</span>
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          3. INTERACTIVE CONCRETE & CEMENT CALCULATOR WIDGET
          ==================================================================== */}
      <section className="rounded-3xl bg-gradient-to-br from-[#0F2547] to-[#0A1931] border-2 border-[#38BDF8]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132C54] text-[#38BDF8] text-xs font-mono border border-[#38BDF8]/40">
              <Calculator className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>INTERAKTIV SMETA WIDGETI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Poydevor &amp; Beton Hajmini Darhol Hisoblang
            </h2>
            <p className="text-xs sm:text-sm text-sky-200/80">
              O‘lchamlarni kiriting — tizim bir zumda kerakli sement qoplari soni va taxminiy narxni ko‘rsatadi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Inputs Panel */}
            <div className="lg:col-span-7 bg-[#0A1931] p-5 sm:p-6 rounded-2xl border border-[#1E3A6D] space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-sky-300 font-bold mb-1">
                    UZUNLIK (M)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={calcLength}
                    onChange={(e) => setCalcLength(Number(e.target.value) || 1)}
                    className="w-full bg-[#0F2547] border border-[#1E3A6D] rounded-xl px-3 py-2 text-white font-mono text-sm sm:text-base focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-sky-300 font-bold mb-1">
                    KENGLIK (M)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={calcWidth}
                    onChange={(e) => setCalcWidth(Number(e.target.value) || 1)}
                    className="w-full bg-[#0F2547] border border-[#1E3A6D] rounded-xl px-3 py-2 text-white font-mono text-sm sm:text-base focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-sky-300 font-bold mb-1">
                    BALANDLIK (M)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(Number(e.target.value) || 0.1)}
                    className="w-full bg-[#0F2547] border border-[#1E3A6D] rounded-xl px-3 py-2 text-white font-mono text-sm sm:text-base focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
              </div>

              {/* Sement Markasi Selector */}
              <div>
                <label className="block text-[11px] font-mono text-sky-300 font-bold mb-1.5">
                  SEMENT MARKASI
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcGrade('M400')}
                    className={cn(
                      'py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer min-h-[40px]',
                      calcGrade === 'M400'
                        ? 'bg-[#132C54] border-[#FFB800] text-[#FFB800]'
                        : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300'
                    )}
                  >
                    M400 (Standart Bino)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGrade('M500')}
                    className={cn(
                      'py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer min-h-[40px]',
                      calcGrade === 'M500'
                        ? 'bg-[#132C54] border-[#FFB800] text-[#FFB800]'
                        : 'bg-[#0F2547] border-[#1E3A6D] text-slate-300'
                    )}
                  >
                    M500 (Mustahkam / Og‘ir)
                  </button>
                </div>
              </div>
            </div>

            {/* Results Live Output Box */}
            <div className="lg:col-span-5 bg-[#132C54] p-5 sm:p-6 rounded-2xl border-2 border-[#FFB800]/50 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
                <span className="text-xs font-mono text-sky-200">Umumiy Beton Hajmi:</span>
                <span className="text-xl font-black font-mono text-white">{calcResults.volume} m³</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="flex justify-between text-slate-200">
                  <span>Kerakli Sement:</span>
                  <span className="font-bold text-[#FFB800]">{calcResults.totalCementBags} qop ({calcResults.totalCementTons} t)</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>Qum (Yuvilgan):</span>
                  <span className="font-bold text-sky-300">{calcResults.totalSandM3} m³</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>Shag‘al (5–20mm):</span>
                  <span className="font-bold text-sky-300">{calcResults.totalGravelM3} m³</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1E3A6D]">
                <div className="text-[11px] font-mono text-sky-300">Taxminiy Material Xarajati:</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  ~ {calcResults.approxTotalUzs.toLocaleString('uz-UZ')} UZS
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                <Button
                  onClick={() => {
                    triggerHaptic('medium');
                    onNavigateToCatalog();
                  }}
                  className="w-full bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-bold text-xs py-2.5 rounded-xl cursor-pointer min-h-[40px]"
                >
                  Katalogda Sement Buyurtma Qilish
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          4. 50/50 ESCROW FINTECH MECHANISM (Xavfsiz Bitim Sxemasi)
          ==================================================================== */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#132C54] text-emerald-400 border-emerald-400/40 font-mono text-xs px-3 py-1">
            XAVFSIZLIK STANDARTI
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            50/50 Escrow To‘lov Mexanizmi Qanday Ishlaydi?
          </h2>
          <p className="text-sm sm:text-base text-sky-200/80">
            Nafaqat xaridorni, balki zavod va haydovchini ham qarz yoki soxta to‘lovlardan 100% himoya qiluvchi bank kafolati.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="rounded-2xl bg-[#0F2547] border border-[#1E3A6D] p-6 space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-[#132C54] text-[#FFB800] font-mono font-black text-lg flex items-center justify-center border border-[#FFB800]/40">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Buyurtma &amp; 50% Depozit</h3>
            <p className="text-xs sm:text-sm text-sky-200/80 leading-relaxed">
              Xaridor buyurtma beradi. To‘lovning 50% qismi BunkerStroy xavfsiz bank Escrow hisobida muzlatiladi. Pul zavodga darhol berilmaydi, xavfsiz turadi.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Mablag‘ Muzlatildi</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl bg-[#0F2547] border border-[#1E3A6D] p-6 space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-[#132C54] text-[#38BDF8] font-mono font-black text-lg flex items-center justify-center border border-[#38BDF8]/40">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Yuklash &amp; Jonli GPS Reys</h3>
            <p className="text-xs sm:text-sm text-sky-200/80 leading-relaxed">
              Depozitni ko‘rgan zavod yukni mashinaga ortadi. HOWO yoki Shacman haydovchisi obyektga yo‘l oladi. Xaridor xaritada mashinani real vaqtda kuzatadi.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#38BDF8]">
              <Truck className="w-3.5 h-3.5" />
              <span>Jonli Telemetriya Faol</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl bg-[#0F2547] border-2 border-emerald-500/50 p-6 space-y-4 relative shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 font-mono font-black text-lg flex items-center justify-center border border-emerald-400">
              03
            </div>
            <h3 className="text-lg font-bold text-white">4 Xonali PIN &amp; Yakuniy To‘lov</h3>
            <p className="text-xs sm:text-sm text-sky-200/80 leading-relaxed">
              Yuk ob‘ektga yetib kelgach, qabul qiluvchi yuk sifatini tekshiradi va 4 xonali PIN kodni haydovchiga aytadi. PIN kiritilishi bilanoq mablag‘ zavod va haydovchiga o‘tadi.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bitim 100% Bajarildi</span>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          5. POPULAR CATEGORIES GRID
          ==================================================================== */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/40 font-mono text-xs px-3 py-1 mb-2">
              MAHSULOTLAR RO‘YXATI
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ommabop Qurilish Materiallari
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              triggerHaptic('light');
              onNavigateToCatalog();
            }}
            className="self-start sm:self-auto bg-[#0F2547] hover:bg-[#132C54] text-[#FFB800] border-[#1E3A6D] text-xs font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 min-h-[40px] touch-target-44"
          >
            <span>Barcha Mahsulotlarni Ko‘rish</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                triggerHaptic('light');
                onNavigateToCatalog();
              }}
              className="rounded-2xl bg-[#0F2547] border border-[#1E3A6D] hover:border-[#FFB800]/70 p-6 space-y-3 cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#132C54] text-[#FFB800] border border-[#FFB800]/30">
                  {cat.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#FFB800] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-sky-200/80 font-mono">
                {cat.spec}
              </p>
              <div className="pt-2 border-t border-[#1E3A6D] text-[11px] text-slate-400 flex items-center justify-between">
                <span>{cat.volumeInfo}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFB800] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          6. TRUST & VERIFIED PARTNER PLANTS (Hamkor Zavodlar)
          ==================================================================== */}
      <section className="rounded-3xl bg-[#0A1931] border border-[#1E3A6D] p-6 sm:p-10 space-y-6 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <Badge className="bg-[#132C54] text-sky-300 border-sky-400/30 font-mono text-xs px-3 py-1">
            LABORATORIYA VA KAFOLAT
          </Badge>
          <h2 className="text-xl sm:text-3xl font-black text-white">
            O‘zbekistonning Yirik Ishlab Chiqaruvchilari Bilan Bevosita Integratsiya
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80">
            Har bir partiya mahsulot rasmiy zavod laboratoriyasi pasporti va O‘zstandart GOST muvofiqlik sertifikati bilan yuboriladi.
          </p>
        </div>

        {/* Industrial Partners Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm">
          <div className="px-5 py-3 rounded-xl bg-[#0F2547] border border-[#1E3A6D] text-slate-200 font-bold">
            🏢 QIZILQUMSEMENT AJ
          </div>
          <div className="px-5 py-3 rounded-xl bg-[#0F2547] border border-[#1E3A6D] text-slate-200 font-bold">
            ⚙️ O‘ZMETKOMBINAT (BEKOBOD)
          </div>
          <div className="px-5 py-3 rounded-xl bg-[#0F2547] border border-[#1E3A6D] text-slate-200 font-bold">
            🏭 OHANGARONSEMENT
          </div>
          <div className="px-5 py-3 rounded-xl bg-[#0F2547] border border-[#1E3A6D] text-slate-200 font-bold">
            🧱 QUVASOYSEMENT &amp; SHIFER
          </div>
          <div className="px-5 py-3 rounded-xl bg-[#0F2547] border border-[#1E3A6D] text-slate-200 font-bold">
            🏗️ KNAUF GIPS BUXORO
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. ECOSYSTEM APPS SHOWCASE (4 Panellar Tizimi)
          ==================================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/40 font-mono text-xs px-3 py-1">
            EKOTIZIM DASTURLARI
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            BunkerStroy 4 Ta Ixtisoslashgan Panelni Taqdim Etadi
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0F2547] border border-[#1E3A6D] space-y-3">
            <Package className="w-6 h-6 text-[#FFB800]" />
            <h3 className="font-bold text-white text-base">Xaridorlar Vitrinasi</h3>
            <p className="text-xs text-sky-200/80">Katalog, savat, laboratoriya sertifikatlari va tenderlar moduli.</p>
            <span className="inline-block text-[10px] font-mono text-emerald-400 font-bold">web.bunkerstroy.uz</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F2547] border border-[#1E3A6D] space-y-3">
            <Factory className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Zavod &amp; POS/CRM</h3>
            <p className="text-xs text-sky-200/80">Zavod ombor qoldiqlari, tarozi hisobi va kassa operatsiyalari.</p>
            <span className="inline-block text-[10px] font-mono text-emerald-400 font-bold">seller.bunkerstroy.uz</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F2547] border border-[#1E3A6D] space-y-3">
            <Truck className="w-6 h-6 text-[#38BDF8]" />
            <h3 className="font-bold text-white text-base">Haydovchilar PWA</h3>
            <p className="text-xs text-sky-200/80">Sensor 60x60px Numpad, GPS telemetriya va PIN-kodli to‘lov.</p>
            <span className="inline-block text-[10px] font-mono text-emerald-400 font-bold">driver.bunkerstroy.uz</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F2547] border border-[#1E3A6D] space-y-3">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <h3 className="font-bold text-white text-base">Admin Dashboard</h3>
            <p className="text-xs text-sky-200/80">Audit loglari, Escrow nazorati va Excel UTF-8 BOM eksporti.</p>
            <span className="inline-block text-[10px] font-mono text-emerald-400 font-bold">admin.bunkerstroy.uz</span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. FINAL CALL TO ACTION BANNER
          ==================================================================== */}
      <section className="rounded-3xl bg-gradient-to-r from-[#132C54] via-[#0F2547] to-[#132C54] border-2 border-[#FFB800] p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Qurilish Ob‘ektingiz Ta‘minotini Bugunoq Avtomatlashtiring
          </h2>
          <p className="text-sm sm:text-base text-sky-200">
            Vositachilarsiz zavod narxlarida xarid qiling, 50/50 xavfsiz Escrow bilan mablag‘ingizni asrang va o‘z vaqtida yetkazib oling.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => {
                triggerHaptic('medium');
                onNavigateToCatalog();
              }}
              className="bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-black text-base px-8 py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-lg hover:scale-[1.02] transition-all"
            >
              <span>Katalogga O‘tish</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                triggerHaptic('light');
                navigate('/suppliers');
              }}
              className="bg-[#0A1931] hover:bg-[#0F2547] text-white border-2 border-[#38BDF8] font-bold text-base px-7 py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44"
            >
              <Factory className="w-4 h-4 text-[#38BDF8] mr-2" />
              <span>Hamkor Zavodlar Ro‘yxati</span>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
