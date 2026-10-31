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
import type {
  ProductCategoryItem,
  UserSegmentItem,
  TradeModelItem,
  CrmFeatureItem,
  DeliveryFeatureItem
} from './types';

/* ==========================================================================
   Assortiment & Mahsulotlar: 4 Asosiy Qurilish Yo'nalishi
   ========================================================================== */
export const PRODUCTS_SOLD: ProductCategoryItem[] = [
  {
    id: 'tashqi',
    title: 'Tashqi Qurilish',
    badge: 'Poydevor & Konstruksiya',
    tagline: 'Bino poydevori, devorlar va tom qoplamalari uchun og‘ir materiallar',
    itemsSummary: 'Blok, Tom qoplamalari, Taxta, Temir/Armatura, Sement, G‘isht',
    itemTags: [
      'Gazoblok & Shlakoblok',
      'Tom & Profnastil',
      'Yog‘och & Taxta',
      'Temir & Po‘lat Armatura',
      'Sement M400 / M500',
      'Pishiq G‘isht'
    ],
    icon: HardHat,
    color: '#D95D1E',
    bgLight: 'from-orange-500/20 to-transparent'
  },
  {
    id: 'ichki',
    title: 'Ichki Qurilish',
    badge: 'Pardozlash & Yuzalar',
    tagline: 'Devorlar, pollar va shiftlar uchun zamonaviy pardozlash mahsulotlari',
    itemsSummary: 'Kafel, Granit, Dekorativ suvoq, Aboy, Bo‘yoq va gruntlar',
    itemTags: [
      'Kafel & Kafel yelimlari',
      'Kafel & Kafel yelimlari',
      'Dekorativ Suvoq (Travertin)',
      'Sifatli Gulqog‘oz (Aboy)',
      'Emulsiya & Moybo‘yoq',
      'Gipsokarton & Profillar'
    ],
    icon: Paintbrush,
    color: '#38BDF8',
    bgLight: 'from-sky-500/20 to-transparent'
  },
  {
    id: 'tamirlash',
    title: 'Uy Ta‘mirlash & Interyer',
    badge: 'Qulaylik & Dizayn',
    tagline: 'Xonadonlar, ofislar va kottejlarni to‘liq jihozlash mahsulotlari',
    itemsSummary: 'Mebel, Bezaklar, Chiroqlar, Santexnika va aksessuarlar',
    itemTags: [
      'Mebel & Furnitura',
      'Interyer Bezaklari',
      'Chiroqlar & LED Tizimlari',
      'Santexnika & Krantlar',
      'Isitish Radiatorlari',
      'Eshik & Rom Jihozlari'
    ],
    icon: HomeIcon,
    color: '#A855F7',
    bgLight: 'from-purple-500/20 to-transparent'
  },
  {
    id: 'uskunalar',
    title: 'Texnik Uskunalar',
    badge: 'Professional Texnika',
    tagline: 'Qurilish brigadalari, montajchilar va ustalar uchun uskunalar',
    itemsSummary: 'Qurilish uchun va ustalar uchun zarur professional asboblar',
    itemTags: [
      'Perforator & Drellar',
      'Bolgarka & Disklar',
      'Payvandlash (Svarka) Uskunasi',
      'Beton Qorgich & Vibrator',
      'Lazerli O‘lchagichlar',
      'Maxsus Xavfsizlik Kiyimlari'
    ],
    icon: Wrench,
    color: '#10B981',
    bgLight: 'from-emerald-500/20 to-transparent'
  }
];

/* ==========================================================================
   B2B & B2C Ekotizim: 3 Asosiy Ishtirokchi Guruhi
   ========================================================================== */
export const USER_SEGMENTS: UserSegmentItem[] = [
  {
    id: 'zavodlar',
    badge: 'Ishlab Chiqaruvchilar',
    title: 'Ta‘minotchi Zavodlar',
    subtitle: 'Mahsulotini to‘g‘ridan-to‘g‘ri ulgurji bozorga olib chiquvchilar',
    description: 'Mahsulotini respublika onlayn bozoriga to‘g‘ridan-to‘g‘ri olib chiqmoqchi bo‘lgan yirik ishlab chiqaruvchilar va zavodlar.',
    targetAudience: 'Sement, metallurgiya, gazoblok, tom va quruq qorishma zavodlari',
    keyPoints: [
      'Katta hajmli ulgurji savdo va yirik qurilish obyektlari bilan bevosita shartnomalar',
      'O‘z narxini va minimal buyurtma partiyasini (MOQ) 100% mustaqil belgilash erkinligi',
      'Moslashuvchan to‘lov: 100% onlayn yoki mijoz xohishiga ko‘ra 50% onlayn + 50% mahsulot yetib borganda',
      '12 ta viloyat bo‘ylab doimiy yangi xaridorlar va pudratchilar oqimi'
    ],
    icon: Factory,
    accent: '#D95D1E'
  },
  {
    id: 'marketlar',
    badge: 'B2B Sotuvchilar & Do‘konlar',
    title: 'Qurilish Marketlari',
    subtitle: 'Zavod va eksportdan eng arzon narxda ta‘minot oluvchilar',
    description: 'Mahsulotni zavoddan va eksportdan to‘g‘ridan-to‘g‘ri o‘z marketiga olib kelib sotuvchi viloyat va shahar savdo do‘konlari.',
    targetAudience: 'Qurilish mollari bozorlari, savdo markazlari va distribyutorlik punktlari',
    keyPoints: [
      'Zavod va importchilardan vositachilarsiz to‘g‘ridan-to‘g‘ri eng arzon narxda ta‘minot',
      'Onlayn va oflayn savdoni birlashtiruvchi qulay va bepul BunkerStroy CRM tizimi',
      'Do‘kondagi ombor qoldiqlari, kassa tushumi va mijozlar qarzini real vaqtda yuritish',
      'O‘z hududingizdagi onlayn buyurtmalarni qabul qilib, savdo aylanmasini 2 barobarga oshirish'
    ],
    icon: Store,
    accent: '#0284C7'
  },
  {
    id: 'mijozlar',
    badge: 'Buyurtmachilar & Ustalar',
    title: 'Mijozlar & Ustalar',
    subtitle: 'Bozorma-bozor sarson bo‘lmasdan to‘g‘ridan-to‘g‘ri obyektgacha',
    description: 'Onlayn va oflayn xaridorlar, mohir ustalar, qurilish brigadalari hamda shaxsiy uy-joyini qurayotgan yurtdoshlarimiz.',
    targetAudience: 'Uy egalari, bosh pudratchilar, ustalar va loyiha muhandislari',
    keyPoints: [
      'Bozorlarda vaqt yo‘qotmasdan, barcha qurilish materiallarini bitta platformada xarid qilish',
      'Ishlab chiqaruvchi zavodlarning eng arzon rasmiy narxlarida to‘g‘ridan-to‘g‘ri tejash',
      'Ob‘ektgacha ishonchli yetkazib berish, 100% onlayn yoki mahsulot yetib borganda to‘lash erkinligi',
      'Maxsus poydevor va beton kalkulyatori orqali material xarajatlarini aniq rejalashtirish'
    ],
    icon: Users,
    accent: '#059669'
  }
];

/* ==========================================================================
   Kafolatlangan Savdo Modeli: 3 Asosiy Qoida
   ========================================================================== */
export const TRADE_MODEL_ITEMS: TradeModelItem[] = [
  {
    number: 1,
    stepLabel: '01-QOIDA: ERKIN NARX',
    title: 'Narxni O‘zingiz Qo‘yasiz',
    description: 'Mahsulotlar to‘liq siz belgilagan narxda sotiladi. Har bir ta‘minotchi o‘zining minimal buyurtma partiyasini (MOQ) mustaqil shakllantiradi.',
    highlightText: 'Minimal buyurtma partiyasini ta‘minotchi mustaqil belgilaydi',
    badgeText: 'Erkin Narx & MOQ Siyosati',
    details: [
      'Vositachilarning asossiz ustamalarisiz to‘g‘ridan-to‘g‘ri narx',
      'Ulgurji va partiyaviy xaridlar uchun mustaqil chegirmalar',
      'Bozor dinamikasiga mos ravishda istalgan payt narxni yangilash'
    ],
    icon: DollarSign,
    accentColor: '#D95D1E'
  },
  {
    number: 2,
    stepLabel: '02-QOIDA: UZLUKSIZ SAVDO',
    title: '24/7 Onlayn Savdo Oqimi',
    description: 'Mijozlar platforma orqali kechayu-kunduz buyurtma beradi. Mahsulotlaringiz butun O‘zbekiston bo‘ylab yagona raqamli vitrinada turadi.',
    highlightText: '12 ta viloyatdan doimiy buyurtmalar oqimi',
    badgeText: '24/7 Raqamli Vitrina',
    details: [
      'Tizim orqali avtomatik buyurtma qabul qilish va SMS bildirishnoma',
      'O‘zbekistonning barcha viloyatlaridagi yirik qurilish obyektlari qamrovi',
      'Do‘kon yopiq paytda ham onlayn sotuvlar to‘xtamaydi'
    ],
    icon: Globe,
    accentColor: '#0284C7'
  },
  {
    number: 3,
    stepLabel: '03-QOIDA: MOSLASHUVCHAN TO‘LOV',
    title: '100% Onlayn yoki 50/50 Yetib Borganda',
    description: 'Mijoz o‘z xohishiga ko‘ra to‘lovni 100% onlayn amalga oshirishi mumkin, yoki 50% oldindan onlayn to‘lab, qolgan 50% qismini mahsulot obyektga yetib borgandan so‘ng to‘laydi.',
    highlightText: '100% onlayn yoki 50% mahsulot yetib borganda',
    badgeText: '100% Onlayn yoki 50/50 Kafolat',
    details: [
      '100% to‘liq onlayn to‘lov — tezkor va bir martalik qulay to‘lovni tanlaganlar uchun',
      '50% + 50% varianti — mijoz xohlasa 50% to‘laydi, qolgan 50% mahsulot yetib borgach beriladi',
      'Sotuvchiga buyurtma jiddiyligi kafolati, xaridorga esa yukni ko‘rib olish erkinligi'
    ],
    icon: ShieldCheck,
    accentColor: '#059669'
  }
];

/* ==========================================================================
   Aqlli CRM & Boshqaruv: Onlayn va Oflayn Savdo Uchun Tizim
   ========================================================================== */
export const CRM_FEATURES: CrmFeatureItem[] = [
  {
    id: 'alohida-hisob',
    title: 'Alohida Hisob (Onlayn + Oflayn)',
    subtitle: 'Yagona qulay kassa va hisob tizimi',
    description: 'Onlayn do‘kondagi buyurtmalar va oflayn savdo nuqtangizdagi harakatlar yagona CRM tizimida avtomatik ajratiladi va jamlanadi.',
    metrics: '100% Avtomatlashtirilgan',
    icon: Store,
    accentColor: '#D95D1E'
  },
  {
    id: 'umumiy-hisob',
    title: 'Umumiy Hisob-Kitob & Balans',
    subtitle: 'Birlashgan moliyaviy hisobot',
    description: 'Ikkala yo‘nalish (onlayn sotuvlar va do‘kondagi savdo) bo‘yicha yagona konsolidatsiyalashgan hisobot, kassa qoldiqlari va sof tushum nazorati.',
    metrics: 'Real Vaqt Balansi',
    icon: BarChart3,
    accentColor: '#0284C7'
  },
  {
    id: 'monitoring',
    title: 'Savdo Monitoringi & Zaxira',
    subtitle: 'Ombor va tovarlar to‘liq nazoratda',
    description: 'Savdoni daqiqama-daqiqa kuzatib borish, qoldiq tovarlar monitoringi, kam qolgan materiallar haqida ogohlantirish va tahliliy grafiklar.',
    metrics: '24/7 Kuzatuv & Tahlil',
    icon: MonitorCheck,
    accentColor: '#059669'
  }
];

/* ==========================================================================
   Respublika Bo'ylab Logistika: Yetkazib Berish Shartlari
   ========================================================================== */
export const DELIVERY_FEATURES: DeliveryFeatureItem[] = [
  {
    id: 'taminotchi-yetkazadi',
    title: 'Kim Sotsa — O‘sha Yetkazadi',
    subtitle: 'Do‘kon mijozga, Zavod do‘konga yetkazadi',
    description: 'Buyurtmani ta‘minotchining o‘zi o‘z transport parki (Gazel, Isuzu, HOWO, MAN) orqali yetkazib beradi: do‘kon sotsa do‘konning zimmasida, zavod sotsa zavodning zimmasida.',
    stats: 'To‘g‘ridan-to‘g‘ri Obyektgacha',
    icon: Truck,
    accentColor: '#D95D1E'
  },
  {
    id: 'erkin-narx',
    title: 'Yetkazib Berish Narxini Mustaqil Belgilash',
    subtitle: 'Shaxsiy tariflar va aksiyalar',
    description: 'Yetkazib berish narxini ta‘minotchi o‘zi mustaqil belgilaydi (masofa, yuk og‘irligi, shahar yoki tumanlar kesimida) yoki tekin yetkazish imtiyozlarini joriy etadi.',
    stats: 'Erkin Narx Siyosati',
    icon: DollarSign,
    accentColor: '#10B981'
  },
  {
    id: 'respublika-qamrov',
    title: 'O‘zbekiston Bo‘ylab Keng Qamrov',
    subtitle: '12 ta viloyat bo‘yicha reklama va buyurtmalar',
    description: 'BunkerStroy platformasi respublikamizning barcha 12 ta viloyatida doimiy reklama va foydalanuvchilar oqimini ta‘minlaydi, savdo doirangizni kengaytiradi.',
    stats: '12 Viloyat + Toshkent Sh.',
    icon: MapPin,
    accentColor: '#38BDF8'
  }
];

/* ==========================================================================
   12 ta Viloyat & Hududlar Ro'yxati
   ========================================================================== */
export const UZBEKISTAN_REGIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand',
  'Farg‘ona',
  'Andijon',
  'Namangan',
  'Buxoro',
  'Navoiy',
  'Qashqadaryo',
  'Surxondaryo',
  'Xorazm',
  'Jizzax',
  'Sirdaryo',
  'Qoraqalpog‘iston Respublikasi'
];

/* ==========================================================================
   Platforma Asosiy Ma'lumotlari & Kontaktlar
   ========================================================================== */
export const PLATFORM_METRICS = {
  adminPhone: '+998 95 082 1336',
  adminPhoneRaw: '+998950821336',
  domain: 'BunkerStroy.uz',
  startDate: '07.11.2026',
  regionCount: 12,
  escrowRatio: '50/50'
};
