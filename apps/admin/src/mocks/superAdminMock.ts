export interface StaffMember {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FINANCE' | 'LOGISTICS' | 'MODERATOR';
  status: 'ACTIVE' | 'BLOCKED';
  inn?: string;
  department: string;
  lastLogin: string;
  createdAt: string;
}

export interface RolePermission {
  moduleKey: string;
  moduleName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export interface RoleDefinition {
  id: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FINANCE' | 'LOGISTICS' | 'MODERATOR';
  name: string;
  description: string;
  usersCount: number;
  permissions: RolePermission[];
}

export interface SystemServiceStatus {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  lastChecked: string;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  registrationOpen: boolean;
  maxSmsPerHour: number;
  activeEimzoVersion: string;
  lastBackupDate: string;
  backupSizeMb: number;
  services: SystemServiceStatus[];
}

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-1',
    fullName: 'Farrukh Jumayev',
    phone: '+998901234567',
    email: 'farrukh@bunkerstroy.uz',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    inn: '201122334',
    department: 'Boshqaruv & Arxitektura',
    lastLogin: 'Bugun, 14:20',
    createdAt: '2026-01-10'
  },
  {
    id: 'staff-2',
    fullName: 'Sardor Rahimov',
    phone: '+998935551122',
    email: 'sardor.r@bunkerstroy.uz',
    role: 'ADMIN',
    status: 'ACTIVE',
    inn: '305566778',
    department: 'B2B Operatsiyalar',
    lastLogin: 'Bugun, 11:45',
    createdAt: '2026-02-15'
  },
  {
    id: 'staff-3',
    fullName: 'Nodira Karimova',
    phone: '+998946663344',
    email: 'nodira.k@bunkerstroy.uz',
    role: 'FINANCE',
    status: 'ACTIVE',
    department: 'Moliya & Kassa Nazorati',
    lastLogin: 'Kecha, 18:30',
    createdAt: '2026-03-01'
  },
  {
    id: 'staff-4',
    fullName: 'Jasur Aliyev',
    phone: '+998977778899',
    email: 'jasur.logistics@bunkerstroy.uz',
    role: 'LOGISTICS',
    status: 'ACTIVE',
    department: 'Og‘ir Maxsus Texnika Parki',
    lastLogin: 'Bugun, 09:15',
    createdAt: '2026-03-12'
  },
  {
    id: 'staff-5',
    fullName: 'Dilshod Toshmatov',
    phone: '+998912229900',
    email: 'dilshod.moderator@bunkerstroy.uz',
    role: 'MODERATOR',
    status: 'ACTIVE',
    department: 'STIR & E-IMZO Muvofiqlik',
    lastLogin: '2026-10-18, 16:00',
    createdAt: '2026-04-05'
  },
  {
    id: 'staff-6',
    fullName: 'Azizbek Umarov',
    phone: '+998993334455',
    email: 'aziz.u@bunkerstroy.uz',
    role: 'ADMIN',
    status: 'BLOCKED',
    department: 'Mintaqaviy Savdo',
    lastLogin: '2026-09-28, 12:10',
    createdAt: '2026-05-20'
  }
];

export const INITIAL_ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'role-super-admin',
    role: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Barcha modullar, moliyaviy oqimlar va ma’murlar hisobini to‘liq boshqarish vakolati.',
    usersCount: 1,
    permissions: [
      { moduleKey: 'super_admin', moduleName: 'Super Admin Katalogi', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { moduleKey: 'suppliers', moduleName: 'Ta’minotchilar & STIR', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { moduleKey: 'products', moduleName: 'Mahsulotlar & Zaxira', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { moduleKey: 'orders', moduleName: 'Buyurtmalar & Savdo', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { moduleKey: 'logistics', moduleName: 'Og‘ir Logistika', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { moduleKey: 'financial', moduleName: 'Kassa & Moliya', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { moduleKey: 'audit_logs', moduleName: 'Xavfsizlik Jurnali', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true }
    ]
  },
  {
    id: 'role-admin',
    role: 'ADMIN',
    name: 'Boshqaruvchi Administrator',
    description: 'B2B savdo, mahsulot zaxiralari va yetkazib beruvchilar bilan ishlash huquqi.',
    usersCount: 2,
    permissions: [
      { moduleKey: 'super_admin', moduleName: 'Super Admin Katalogi', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'suppliers', moduleName: 'Ta’minotchilar & STIR', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { moduleKey: 'products', moduleName: 'Mahsulotlar & Zaxira', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { moduleKey: 'orders', moduleName: 'Buyurtmalar & Savdo', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { moduleKey: 'logistics', moduleName: 'Og‘ir Logistika', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { moduleKey: 'financial', moduleName: 'Kassa & Moliya', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'audit_logs', moduleName: 'Xavfsizlik Jurnali', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
    ]
  },
  {
    id: 'role-finance',
    role: 'FINANCE',
    name: 'Moliyachi & Kassa Nazorati',
    description: 'Payme, Click va bank hisob-fakturalari, solishtirma dalolatnomalarni nazorat qilish.',
    usersCount: 1,
    permissions: [
      { moduleKey: 'super_admin', moduleName: 'Super Admin Katalogi', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'suppliers', moduleName: 'Ta’minotchilar & STIR', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'products', moduleName: 'Mahsulotlar & Zaxira', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'orders', moduleName: 'Buyurtmalar & Savdo', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: true },
      { moduleKey: 'logistics', moduleName: 'Og‘ir Logistika', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'financial', moduleName: 'Kassa & Moliya', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { moduleKey: 'audit_logs', moduleName: 'Xavfsizlik Jurnali', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
    ]
  },
  {
    id: 'role-logistics',
    role: 'LOGISTICS',
    name: 'Logistika Dispecheri',
    description: 'Samosvallar, mikserlar va yuk transportlarini buyurtmalarga biriktirish vakolati.',
    usersCount: 1,
    permissions: [
      { moduleKey: 'super_admin', moduleName: 'Super Admin Katalogi', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'suppliers', moduleName: 'Ta’minotchilar & STIR', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'products', moduleName: 'Mahsulotlar & Zaxira', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'orders', moduleName: 'Buyurtmalar & Savdo', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'logistics', moduleName: 'Og‘ir Logistika', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { moduleKey: 'financial', moduleName: 'Kassa & Moliya', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { moduleKey: 'audit_logs', moduleName: 'Xavfsizlik Jurnali', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
    ]
  }
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  maintenanceMode: false,
  registrationOpen: true,
  maxSmsPerHour: 100,
  activeEimzoVersion: 'v2.4.1 (PKCS#7)',
  lastBackupDate: '2026-10-20 04:00',
  backupSizeMb: 418.5,
  services: [
    {
      id: 'srv-soliq',
      name: 'Davlat Soliq Qo‘mitasi STIR API',
      provider: 'Soliq Open Data (DSQ)',
      endpoint: 'https://api.soliq.uz/v1/taxpayer',
      status: 'OPERATIONAL',
      latencyMs: 142,
      lastChecked: 'Hozir'
    },
    {
      id: 'srv-eimzo',
      name: 'E-IMZO Raqamli Imzo Shlyuzi',
      provider: 'Davlat Soliq Qo‘mitasi',
      endpoint: 'https://e-imzo.soliq.uz/api',
      status: 'OPERATIONAL',
      latencyMs: 88,
      lastChecked: 'Hozir'
    },
    {
      id: 'srv-eskiz',
      name: 'Eskiz.uz SMS OTP Shlyuzi',
      provider: 'Eskiz SMS API',
      endpoint: 'https://notify.eskiz.uz/api',
      status: 'OPERATIONAL',
      latencyMs: 195,
      lastChecked: 'Hozir'
    },
    {
      id: 'srv-payme',
      name: 'Payme JSON-RPC 2.0 Webhook',
      provider: 'Paycom Merchant API',
      endpoint: 'http://localhost:4000/api/payments/payme',
      status: 'OPERATIONAL',
      latencyMs: 24,
      lastChecked: 'Hozir'
    },
    {
      id: 'srv-click',
      name: 'Click MD5 Webhook Gateway',
      provider: 'Click Merchant API',
      endpoint: 'http://localhost:4000/api/payments/click',
      status: 'OPERATIONAL',
      latencyMs: 18,
      lastChecked: 'Hozir'
    }
  ]
};
