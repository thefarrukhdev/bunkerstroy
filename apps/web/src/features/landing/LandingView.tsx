import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HardHat,
  Package,
  Calculator,
  Truck,
  Factory,
  Store,
  Users,
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
  DollarSign,
  MonitorCheck,
  BarChart3,
  Calendar,
  Globe,
  Wrench,
  Home as HomeIcon,
  Paintbrush,
  Hammer,
  BadgeCheck
} from 'lucide-react';
import { cn, Button, Badge } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../services/mobileBridge';

interface LandingViewProps {
  onNavigateToCatalog: () => void;
  onOpenAuth?: () => void;
}

/* ==========================================================================
   Slide 2: Platformada Nimalar Sotiladi (4 Asosiy Yo'nalish)
   ========================================================================== */
interface ProductCategoryCategory {
  id: string;
  title: string;
  items: string;
  badge: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
}

const PRODUCTS_SOLD: ProductCategoryCategory[] = [
  {
    id: 'tashqi',
    title: 'Tashqi Qurilish',
    items: 'Blok, Tom, Taxta, Temir, Sement',
    badge: 'Asosiy Qurilish',
    icon: HardHat,
    color: '#FFB800',
    bgLight: 'from-amber-500/20 to-transparent'
  },
  {
    id: 'ichki',
    title: 'Ichki Qurilish',
    items: 'Kafel, Dekor, Aboy',
    badge: 'Pardozlash & Bezak',
    icon: Paintbrush,
    color: '#38BDF8',
    bgLight: 'from-sky-500/20 to-transparent'
  },
  {
    id: 'tamirlash',
    title: 'Uy Ta‘mirlash',
    items: 'Mebel, Bezaklar, Chiroqlar',
    badge: 'Interyer & Dizayn',
    icon: HomeIcon,
    color: '#A855F7',
    bgLight: 'from-purple-500/20 to-transparent'
  },
  {
    id: 'uskunalar',
    title: 'Texnik Uskunalar',
    items: 'Qurilish uchun va ustalar uchun kerakli mahsulotlar',
    badge: 'Usta Asboblari',
    icon: Wrench,
    color: '#10B981',
    bgLight: 'from-emerald-500/20 to-transparent'
  }
];

/* ==========================================================================
   Slide 3: Platformadan Kimlar Foydalanadi (3 ta Segment)
   ========================================================================== */
interface UserSegment {
  id: string;
  badge: string;
  title: string;
  description: string;
  keyPoints: string[];
  icon: React.ElementType;
  accent: string;
}

const USER_SEGMENTS: UserSegment[] = [
  {
    id: 'zavodlar',
    badge: 'Ishlab Chiqaruvchilar',
    title: 'Ta‘minotchi Zavodlar',
    description: 'Mahsulotini onlayn bozorga olib chiqmoqchi bo‘lgan ishlab chiqaruvchilar.',
    keyPoints: [
      'To‘g‘ridan-to‘g‘ri onlayn savdo va yirik B2B xaridorlar oqimi',
      'O‘z narxini va minimal buyurtma partiyasini mustaqil belgilash',
      '50% onlayn va 50% naqd/karta kafolatlangan to‘lov tizimi'
    ],
    icon: Factory,
    accent: '#FFB800'
  },
  {
    id: 'marketlar',
    badge: 'B2B Sotuvchilar',
    title: 'Qurilish Marketlari',
    description: 'Mahsulotni zavoddan va Eksportdan to‘g‘ridan-to‘g‘ri o‘z marketiga olib kelib sotuvchilar.',
    keyPoints: [
      'Zavod va eksportchilardan eng arzon ulgurji ta‘minot narxlari',
      'Onlayn + oflayn savdo uchun qulay yagona CRM tizimi',
      'Do‘kon ombor qoldiqlari va savdo tahlilini real vaqtda yuritish'
    ],
    icon: Store,
    accent: '#38BDF8'
  },
  {
    id: 'mijozlar',
    badge: 'Xaridorlar & Ustalar',
    title: 'Mijozlar',
    description: 'Onlayn va oflayn xaridorlar, ustalar, quruvchilar, uy egalari.',
    keyPoints: [
      'Keng assortiment: tashqi va ichki qurilish materiallari bitta platformada',
      'Bozorga borib vaqt yo‘qotmasdan qulay onlayn buyurtma',
      'O‘zbekistonning 12 ta viloyati bo‘ylab to‘g‘ridan-to‘g‘ri obyektgacha yetkazib berish'
    ],
    icon: Users,
    accent: '#10B981'
  }
];

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateToCatalog,
  onOpenAuth
}) => {
  const navigate = useNavigate();

  // Mini Concrete/Cement Calculator State (Ustalar va quruvchilar uchun qulay vosita)
  const [calcLength, setCalcLength] = useState<number>(10);
  const [calcWidth, setCalcWidth] = useState<number>(8);
  const [calcHeight, setCalcHeight] = useState<number>(0.3);
  const [calcGrade, setCalcGrade] = useState<'M400' | 'M500'>('M400');

  const calcResults = useMemo(() => {
    const volume = Math.max(0.1, Number((calcLength * calcWidth * calcHeight).toFixed(2)));
    const cementBagsPerM3 = calcGrade === 'M400' ? 7 : 8.5;
    const sandPerM3 = calcGrade === 'M400' ? 0.45 : 0.42;
    const gravelPerM3 = calcGrade === 'M400' ? 0.8 : 0.82;

    const totalCementBags = Math.ceil(volume * cementBagsPerM3);
    const totalCementTons = (totalCementBags * 50) / 1000;
    const totalSandM3 = Number((volume * sandPerM3).toFixed(1));
    const totalGravelM3 = Number((volume * gravelPerM3).toFixed(1));

    const bagPrice = calcGrade === 'M400' ? 58000 : 68000;
    const sandPricePerM3 = 120000;
    const gravelPricePerM3 = 145000;

    const approxTotalUzs =
      totalCementBags * bagPrice +
      totalSandM3 * sandPricePerM3 +
      totalGravelM3 * gravelPricePerM3;

    return {
      volume,
      totalCementBags,
      totalCementTons,
      totalSandM3,
      totalGravelM3,
      approxTotalUzs
    };
  }, [calcLength, calcWidth, calcHeight, calcGrade]);

  return (
    <div className="space-y-16 sm:space-y-24 py-2 sm:py-6 text-slate-100 font-sans">

      {/* ====================================================================
          1. HERO SECTION (Taqdimot 1-Slayd asosida)
          ==================================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0A1931] via-[#0F2547] to-[#0A1931] border-2 border-[#1E3A6D] shadow-[0_20px_60px_rgba(7,19,38,0.8)] p-6 sm:p-10 lg:p-14 text-center">
        {/* Subtle Industrial Background Grid & Hazard Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 hazard-stripe-sm opacity-90" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Start Date & Presentation Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#132C54] border border-[#FFB800]/60 text-sky-200 text-xs sm:text-sm font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[#FFB800] font-black">BUNKERSTROY.UZ</span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Calendar className="w-3.5 h-3.5" /> Start: 07.11.2026
            </span>
          </div>

          {/* Exact Headline from Slide 1 */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Tashqi va Ichki Qurilish Mahsulotlarining{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-300 to-[#FF9000]">
              Onlayn Marketpleysi
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-sky-200/90 max-w-3xl mx-auto leading-relaxed">
            Ta‘minotchi zavodlar, qurilish marketlari, ustalar va xaridorlarni yagona onlayn ekotizim va integratsiyalashgan CRM tizimida birlashtiramiz.
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
              <span>Katalog &amp; Mahsulotlar</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <a
              href="tel:+998950821336"
              onClick={() => triggerHaptic('light')}
              className="bg-[#0F2547] hover:bg-[#132C54] text-white border-2 border-[#38BDF8]/60 font-bold text-base px-6 py-3.5 rounded-xl cursor-pointer inline-flex items-center gap-2 transition-all min-h-[48px] touch-target-44"
            >
              <PhoneCall className="w-5 h-5 text-[#38BDF8]" />
              <span>Admin: +998 95 082 1336</span>
            </a>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                triggerHaptic('light');
                navigate('/seller-panel');
              }}
              className="bg-[#0A1931] hover:bg-[#0F2547] text-sky-200 border-2 border-[#1E3A6D] font-bold text-base px-6 py-3.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all min-h-[48px] touch-target-44"
            >
              <Store className="w-5 h-5 text-[#FFB800]" />
              <span>Sotuvchi &amp; CRM Paneli</span>
            </Button>
          </div>

          {/* Quick Pillars info */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-mono text-sky-300/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>50% Onlayn + 50% Naqd</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#38BDF8]" />
              <span>O‘zbekiston Bo‘ylab (12 Viloyat)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MonitorCheck className="w-4 h-4 text-[#FFB800]" />
              <span>Onlayn + Oflayn CRM Tizimi</span>
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. PLATFORMADA NIMALAR SOTILADI (Taqdimot 2-Slayd asosida)
          ==================================================================== */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/40 font-mono text-xs px-3 py-1">
            2-SLAYD: ASSORTIMENT
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Platformada Nimalar Sotiladi?
          </h2>
          <p className="text-sm sm:text-base text-sky-200/80">
            Tashqi qurilish poydevoridan tortib xonadon bezaklari va usta asboblarigacha bo‘lgan to‘liq zanjir.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS_SOLD.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  triggerHaptic('light');
                  onNavigateToCatalog();
                }}
                className="rounded-3xl bg-[#0F2547] border-2 border-[#1E3A6D] hover:border-[#FFB800] p-6 sm:p-7 space-y-4 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.bgLight} rounded-bl-full pointer-events-none`} />

                <div className="w-12 h-12 rounded-2xl bg-[#132C54] border border-[#1E3A6D] flex items-center justify-center group-hover:border-[#FFB800] transition-colors shadow-inner">
                  <Icon className="w-6 h-6" style={{ color: cat.color }} />
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {cat.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FFB800] transition-colors mt-0.5">
                    {cat.title}
                  </h3>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0A1931] border border-[#1E3A6D]/80">
                  <div className="text-xs font-mono font-bold text-sky-200">
                    {cat.items}
                  </div>
                </div>

                <div className="pt-2 text-xs font-mono text-[#FFB800] flex items-center justify-between font-bold">
                  <span>Katalogda ko‘rish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          3. PLATFORMADAN KIMLAR FOYDALANADI (Taqdimot 3-Slayd asosida)
          ==================================================================== */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#132C54] text-[#38BDF8] border-[#38BDF8]/40 font-mono text-xs px-3 py-1">
            3-SLAYD: ISHTIROKCHILAR
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Platformadan Kimlar Foydalanadi?
          </h2>
          <p className="text-sm sm:text-base text-sky-200/80">
            Ishlab chiqaruvchi zavodlar, qurilish do‘konlari va iste‘molchilar o‘rtasidagi eng qisqa raqamli ko‘prik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {USER_SEGMENTS.map((seg) => {
            const Icon = seg.icon;
            return (
              <div
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
                  {seg.id === 'zavodlar' || seg.id === 'marketlar' ? (
                    <Button
                      onClick={() => {
                        triggerHaptic('medium');
                        navigate('/seller-panel');
                      }}
                      className="w-full bg-[#132C54] hover:bg-[#1A386B] text-white border border-[#FFB800]/50 font-bold text-xs py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
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
                      className="w-full bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-bold text-xs py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <span>Katalogda Xarid Qilish</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          4. SAVDO MODELI (Taqdimot 4-Slayd asosida: 3 Ta Asosiy Qoida)
          ==================================================================== */}
      <section className="rounded-3xl bg-gradient-to-br from-[#0F2547] via-[#0A1931] to-[#0F2547] border-2 border-[#1E3A6D] p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#132C54] text-emerald-400 border-emerald-400/40 font-mono text-xs px-3 py-1">
            4-SLAYD: MONETIZATSIYA &amp; SAVDO
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            BunkerStroy Savdo Modeli
          </h2>
          <p className="text-sm sm:text-base text-sky-200/80">
            Sotuvchilar va xaridorlar uchun to‘liq shaffof, adolatli va kafolatlangan savdo mexanizmi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Qoida 1 */}
          <div className="rounded-2xl bg-[#0A1931] border-2 border-[#1E3A6D] p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#132C54] text-[#FFB800] font-mono font-black text-xl flex items-center justify-center border border-[#FFB800]/40">
              1
            </div>
            <h3 className="text-xl font-black text-white">
              Narxni O‘zingiz Qo‘yasiz
            </h3>
            <p className="text-xs sm:text-sm text-sky-200/90 leading-relaxed font-mono">
              Mahsulotlar sizning narxingizda sotiladi. Minimal buyurtma miqdorini ta‘minotchi o‘zi mustaqil belgilaydi.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FFB800]">
              <DollarSign className="w-4 h-4" />
              <span>Mustaqil Narx Siyosati</span>
            </div>
          </div>

          {/* Qoida 2 */}
          <div className="rounded-2xl bg-[#0A1931] border-2 border-[#1E3A6D] p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#132C54] text-[#38BDF8] font-mono font-black text-xl flex items-center justify-center border border-[#38BDF8]/40">
              2
            </div>
            <h3 className="text-xl font-black text-white">
              Onlayn Savdo Bor
            </h3>
            <p className="text-xs sm:text-sm text-sky-200/90 leading-relaxed font-mono">
              Mijozlar platforma orqali buyurtma beradi. Mahsulotlaringiz 24/7 rejimida onlayn vitrinada sotuvda turadi.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#38BDF8]">
              <Globe className="w-4 h-4" />
              <span>24/7 Onlayn Oqim</span>
            </div>
          </div>

          {/* Qoida 3 */}
          <div className="rounded-2xl bg-[#0A1931] border-2 border-emerald-500/50 p-6 space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 font-mono font-black text-xl flex items-center justify-center border border-emerald-400">
              3
            </div>
            <h3 className="text-xl font-black text-white">
              Umumiy Summadan Foiz
            </h3>
            <p className="text-xs sm:text-sm text-sky-200/90 leading-relaxed font-mono">
              <strong className="text-emerald-400">50% onlayn</strong> va yetkazib berilganda <strong className="text-[#FFB800]">50% naqd/karta</strong> to‘lovi. Sotuvchi uchun 100% xavfsiz.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>50/50 Xavfsiz Escrow Modeli</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. ONLAYN VA OFLAYN SAVDO UCHUN CRM (Taqdimot 5-Slayd asosida)
          ==================================================================== */}
      <section className="rounded-3xl bg-[#0F2547] border-2 border-[#1E3A6D] p-6 sm:p-10 shadow-xl space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#132C54] text-[#A855F7] border-[#A855F7]/40 font-mono text-xs px-3 py-1">
            5-SLAYD: CRM &amp; HISOBOT
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Onlayn va Oflayn Savdo Uchun CRM Tizimi
          </h2>
          <p className="text-sm sm:text-base text-sky-200/80">
            BunkerStroy har bir do‘kon va zavodga alohida zamonaviy hisob-kitob dasturini taqdim etadi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] space-y-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#132C54] flex items-center justify-center text-[#FFB800]">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Alohida Hisob</h3>
            <p className="text-xs text-sky-200/80 font-mono">
              Onlayn + oflayn CRM tizimi orqali do‘kondagi savdo hamda internetdagi buyurtmalar bitta joyda jamlanadi.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] space-y-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#132C54] flex items-center justify-center text-[#38BDF8]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Umumiy Hisob-Kitob</h3>
            <p className="text-xs text-sky-200/80 font-mono">
              Ikkala yo‘nalish bo‘yicha yagona umumiy hisobot, kassa qoldiqlari va moliyaviy tahlil.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] space-y-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#132C54] flex items-center justify-center text-emerald-400">
              <MonitorCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Savdo Monitoringi</h3>
            <p className="text-xs text-sky-200/80 font-mono">
              Savdoni real vaqtda kuzatib borish, ombor zaxirasini nazorat qilish va avtomatlashtirish.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Button
            onClick={() => {
              triggerHaptic('medium');
              navigate('/seller-panel');
            }}
            className="bg-[#FFB800] hover:bg-amber-400 text-[#071326] font-bold text-sm px-8 py-3.5 rounded-xl cursor-pointer min-h-[44px] touch-target-44 shadow-lg inline-flex items-center gap-2"
          >
            <Store className="w-4 h-4 text-[#071326]" />
            <span>Sotuvchi CRM Panelini Ko‘rish</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* ====================================================================
          6. YETKAZIB BERISH (Taqdimot 6-Slayd asosida)
          ==================================================================== */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#132C54] text-[#FFB800] border-[#FFB800]/40 font-mono text-xs px-3 py-1">
            6-SLAYD: LOGISTIKA
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Yetkazib Berish Shartlari
          </h2>
          <p className="text-sm sm:text-base text-sky-200/80">
            Logistika erkinligi va 12 ta viloyat bo‘ylab keng ko‘lamli reklama qamrovi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0F2547] border border-[#1E3A6D] space-y-3">
            <Truck className="w-8 h-8 text-[#FFB800]" />
            <h3 className="text-lg font-bold text-white">Ta‘minotchi Yetkazadi</h3>
            <p className="text-xs sm:text-sm text-sky-200/80 font-mono">
              Buyurtmani ta‘minotchining o‘zi mijozga yetkazib beradi (o‘z transporti yoki hamkor yuk tashuvchilar orqali).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F2547] border border-[#1E3A6D] space-y-3">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Yetkazib Berish Narxi</h3>
            <p className="text-xs sm:text-sm text-sky-200/80 font-mono">
              Yetkazib berish narxini ta‘minotchi o‘zi mustaqil belgilaydi (masofa, og‘irlik yoki tekin yetkazish aktsiyalari).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F2547] border border-[#1E3A6D] space-y-3">
            <MapPin className="w-8 h-8 text-[#38BDF8]" />
            <h3 className="text-lg font-bold text-white">O‘zbekiston Bo‘ylab (12 Viloyat)</h3>
            <p className="text-xs sm:text-sm text-sky-200/80 font-mono">
              Reklama va faol foydalanuvchilar qamrovi butun O‘zbekiston bo‘ylab barcha 12 viloyatni qamrab oladi.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          INTERAKTIV POYDEVOR & BETON KALKULYATORI (Ustalar & Xaridorlar uchun)
          ==================================================================== */}
      <section className="rounded-3xl bg-gradient-to-br from-[#0F2547] to-[#0A1931] border-2 border-[#38BDF8]/40 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132C54] text-[#38BDF8] text-xs font-mono border border-[#38BDF8]/40">
            <Calculator className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>USTALAR &amp; QURUVCHILAR UCHUN SMETA VOSITASI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Poydevor &amp; Beton Hajmini Darhol Hisoblang
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80">
            O‘lchamlarni kiriting — tizim bir zumda kerakli sement qoplari soni va taxminiy narxni hisoblaydi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
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
      </section>

      {/* ====================================================================
          7. PLATFORMADA BIRINCHILARDAN BO‘LING! (Taqdimot 7-Slayd asosida)
          ==================================================================== */}
      <section className="rounded-3xl bg-gradient-to-r from-[#FFB800] via-amber-400 to-[#FF9000] p-8 sm:p-12 text-[#071326] space-y-6 shadow-2xl relative overflow-hidden border-2 border-amber-300">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <Badge className="bg-[#071326] text-[#FFB800] border-none font-mono text-xs px-3.5 py-1">
            7-SLAYD: HAMKORLIKKA TAKLIF
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Platformada Birinchilardan Bo‘ling!
          </h2>

          <p className="text-base sm:text-lg font-bold text-[#0A1931]/90 max-w-2xl mx-auto">
            O‘zbekistondagi ta‘minotchi zavodlar va qurilish marketlarini BunkerStroy platformasida hamkorlikka chorlaymiz.
          </p>

          <div className="p-4 rounded-2xl bg-[#071326]/90 text-white font-mono text-sm sm:text-base max-w-lg mx-auto border border-white/20 shadow-xl space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#FFB800] font-black text-lg">
              <PhoneCall className="w-5 h-5" />
              <span>Aloqa uchun: Admin +998 95 082 1336</span>
            </div>
            <div className="flex items-center justify-around text-xs text-sky-200 border-t border-white/10 pt-2">
              <span className="font-bold">🌐 BunkerStroy.uz</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Start: 07.11.2026</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+998950821336"
              onClick={() => triggerHaptic('medium')}
              className="bg-[#071326] hover:bg-[#0A1931] text-[#FFB800] font-black text-base px-8 py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-lg inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <PhoneCall className="w-5 h-5 text-[#FFB800]" />
              <span>Hoziroq Qo‘ng‘iroq Qilish</span>
            </a>

            <Button
              size="lg"
              onClick={() => {
                triggerHaptic('medium');
                onNavigateToCatalog();
              }}
              className="bg-white hover:bg-slate-100 text-[#071326] font-black text-base px-8 py-3.5 rounded-xl cursor-pointer min-h-[48px] touch-target-44 shadow-md transition-all"
            >
              <Package className="w-5 h-5 text-[#071326]" />
              <span>Katalogni Ochish</span>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
