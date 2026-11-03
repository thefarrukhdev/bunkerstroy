import {
  ClipboardList,
  Store,
  Building2,
  Factory,
  ShieldCheck,
  Home,
  Package,
  Truck,
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
    title: 'Hamkor & Sotuvchi Kabineti',
    subtitle: 'Zavodlar ulgurji savdosi, Do‘kon Kassa / POS CRM',
    path: '/seller-panel',
    icon: Building2,
    badge: 'ZAVOD & DO‘KON',
    badgeColor: 'bg-orange-50 text-[#D95D1E] border-orange-200/80',
    isDedicatedApp: true
  },
  {
    id: 'admin',
    title: 'Admin Kabineti',
    subtitle: 'BunkerStroy markaziy monitoring & nazorat',
    path: '/admin',
    icon: ShieldCheck,
    badge: 'ROOT ADMIN',
    badgeColor: 'bg-red-50 text-red-800 border-red-200/80',
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
  phone: '+998 (95) 082-1336',
  phoneRaw: '+998950821336',
  hotline: '+998 (95) 082-1336',
  hotlineRaw: '+998950821336'
} as const;
