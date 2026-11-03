import {
  ClipboardList,
  Store,
  Truck,
  Factory,
  ShieldCheck,
  Home,
  Package,
  Calculator,
  FileSpreadsheet
} from 'lucide-react';
import type { CabinetOption, NavItem } from './types.ts';

export const getDedicatedAppUrl = (id: string): string | null => {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (id === 'seller') {
    return isLocal ? 'http://localhost:3001' : 'https://bunkerstroy-seller.vercel.app';
  }
  if (id === 'driver') {
    return isLocal ? 'http://localhost:3003' : 'https://bunkerstroy-driver.vercel.app';
  }
  if (id === 'admin') {
    return isLocal ? 'http://localhost:3002' : 'https://bunkerstroy-admin.vercel.app';
  }
  return null;
};

export const UZBEKISTAN_REGIONS = [
  'Barcha viloyatlar',
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand viloyati',
  'Farg‘ona viloyati',
  'Andijon viloyati',
  'Namangan viloyati',
  'Buxoro viloyati',
  'Qashqadaryo viloyati',
  'Surxondaryo viloyati',
  'Xorazm viloyati',
  'Navoiy viloyati',
  'Jizzax viloyati',
  'Sirdaryo viloyati',
  'Qoraqalpog‘iston Respublikasi'
] as const;

export const CABINET_OPTIONS: CabinetOption[] = [
  {
    id: 'client',
    title: 'Mijoz Kabineti',
    subtitle: 'Buyurtmalar, Hisob-faktura va Escrow holati',
    path: '/orders',
    icon: ClipboardList,
    badge: 'XARIDOR',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  {
    id: 'seller',
    title: 'Sotuvchi Kabineti',
    subtitle: 'Mahsulotlar vitrinasi, Do‘kon Kassa / POS CRM',
    path: '/seller-panel',
    icon: Store,
    badge: 'POS & CRM',
    badgeColor: 'bg-orange-50 text-[#D95D1E] border-orange-200',
    isDedicatedApp: true
  },
  {
    id: 'driver',
    title: 'Haydovchi Kabineti',
    subtitle: 'Og‘ir yuk tashish va GPS marshrutlar',
    path: '/driver',
    icon: Truck,
    badge: 'LOGISTIKA',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    isDedicatedApp: true
  },
  {
    id: 'partner',
    title: 'Hamkor & Zavodlar',
    subtitle: 'Ishlab chiqaruvchilar va ulgurji dillerlik',
    path: '/suppliers',
    icon: Factory,
    badge: 'B2B ZAVOD',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  {
    id: 'admin',
    title: 'Admin Kabineti',
    subtitle: 'BunkerStroy markaziy monitoring & nazorat',
    path: '/admin',
    icon: ShieldCheck,
    badge: 'ROOT ADMIN',
    badgeColor: 'bg-red-50 text-red-800 border-red-200',
    isAdmin: true,
    isDedicatedApp: true
  }
];

export const NAV_LINKS: NavItem[] = [
  {
    id: 'home',
    label: 'Asosiy',
    path: '/',
    icon: Home,
    exact: true
  },
  {
    id: 'catalog',
    label: 'Katalog',
    path: '/catalog',
    icon: Package
  },
  {
    id: 'suppliers',
    label: 'Zavodlar',
    path: '/suppliers',
    icon: Factory
  },
  {
    id: 'logistics',
    label: 'Logistika',
    path: '/logistics',
    icon: Truck
  },
  {
    id: 'calculators',
    label: 'Kalkulyator',
    path: '/calculators',
    icon: Calculator
  },
  {
    id: 'tenders',
    label: 'Tenderlar',
    path: '/tenders',
    icon: FileSpreadsheet
  }
];

export const OFFICIAL_CHANNELS = {
  telegram: 'https://t.me/bunkerstroy_uz',
  instagram: 'https://instagram.com/bunkerstroy.uz',
  phone: '+998 (71) 200-00-50',
  phoneRaw: '+998712000050',
  hotline: '+998 (71) 200-45-46',
  hotlineRaw: '+998712004546'
} as const;
