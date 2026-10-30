import {
  HardHat,
  Paintbrush,
  Home as HomeIcon,
  Wrench,
  Factory,
  Store,
  Users,
  DollarSign,
  Globe,
  ShieldCheck,
  BarChart3,
  MonitorCheck,
  Truck,
  MapPin
} from 'lucide-react';
import {
  ProductCategoryItem,
  UserSegmentItem,
  TradeModelItem,
  CrmFeatureItem,
  DeliveryFeatureItem
} from './types';

/* ==========================================================================
   Slide 2: Platformada Nimalar Sotiladi (4 Asosiy Yo'nalish)
   ========================================================================== */
export const PRODUCTS_SOLD: ProductCategoryItem[] = [
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
export const USER_SEGMENTS: UserSegmentItem[] = [
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

/* ==========================================================================
   Slide 4: Savdo Modeli (3 Asosiy Qoida)
   ========================================================================== */
export const TRADE_MODEL_ITEMS: TradeModelItem[] = [
  {
    number: 1,
    title: 'Narxni O‘zingiz Qo‘yasiz',
    description: 'Mahsulotlar sizning narxingizda sotiladi. Minimal buyurtma miqdorini ta‘minotchi o‘zi mustaqil belgilaydi.',
    highlightText: 'Minimal buyurtma partiyasi mavjud',
    badgeText: 'Mustaqil Narx Siyosati',
    icon: DollarSign,
    accentColor: '#FFB800'
  },
  {
    number: 2,
    title: 'Onlayn Savdo Bor',
    description: 'Mijozlar platforma orqali buyurtma beradi. Mahsulotlaringiz 24/7 rejimida onlayn vitrinada sotuvda turadi.',
    highlightText: '24/7 onlayn savdo oqimi',
    badgeText: 'Doimiy Savdo Oqimi',
    icon: Globe,
    accentColor: '#38BDF8'
  },
  {
    number: 3,
    title: 'Umumiy Summadan Foiz',
    description: '50% onlayn va yetkazib berilganda 50% naqd/karta to‘lovi. Sotuvchi va xaridor uchun 100% xavfsiz.',
    highlightText: '50% onlayn va 50% naqd',
    badgeText: '50/50 Xavfsiz Escrow Modeli',
    icon: ShieldCheck,
    accentColor: '#10B981'
  }
];

/* ==========================================================================
   Slide 5: Onlayn va Oflayn Savdo Uchun CRM Tizimi
   ========================================================================== */
export const CRM_FEATURES: CrmFeatureItem[] = [
  {
    title: 'Alohida Hisob',
    description: 'Onlayn + oflayn CRM tizimi orqali do‘kondagi savdo hamda internetdagi buyurtmalar bitta joyda jamlanadi.',
    icon: Store,
    accentColor: '#FFB800'
  },
  {
    title: 'Umumiy Hisob-Kitob',
    description: 'Ikkala yo‘nalish bo‘yicha yagona umumiy hisobot, kassa qoldiqlari va moliyaviy tahlil.',
    icon: BarChart3,
    accentColor: '#38BDF8'
  },
  {
    title: 'Savdo Monitoringi',
    description: 'Savdoni real vaqtda kuzatib borish, ombor zaxirasini nazorat qilish va avtomatlashtirish.',
    icon: MonitorCheck,
    accentColor: '#10B981'
  }
];

/* ==========================================================================
   Slide 6: Yetkazib Berish Shartlari
   ========================================================================== */
export const DELIVERY_FEATURES: DeliveryFeatureItem[] = [
  {
    title: 'Ta‘minotchi Yetkazadi',
    description: 'Buyurtmani ta‘minotchining o‘zi mijozga yetkazib beradi (o‘z transporti yoki hamkor yuk tashuvchilar orqali).',
    icon: Truck,
    accentColor: '#FFB800'
  },
  {
    title: 'Yetkazib Berish Narxi',
    description: 'Yetkazib berish narxini ta‘minotchi o‘zi mustaqil belgilaydi (masofa, og‘irlik yoki tekin yetkazish aktsiyalari).',
    icon: DollarSign,
    accentColor: '#10B981'
  },
  {
    title: 'O‘zbekiston Bo‘ylab (12 Viloyat)',
    description: 'Reklama va faol foydalanuvchilar qamrovi butun O‘zbekiston bo‘ylab barcha 12 viloyatni qamrab oladi.',
    icon: MapPin,
    accentColor: '#38BDF8'
  }
];

export const PLATFORM_METRICS = {
  adminPhone: '+998 95 082 1336',
  adminPhoneRaw: '+998950821336',
  domain: 'BunkerStroy.uz',
  startDate: '07.11.2026'
};
