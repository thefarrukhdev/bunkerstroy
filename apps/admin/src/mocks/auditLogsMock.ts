export type AuditAction =
  | 'PRICE_CHANGE'
  | 'USER_BLOCK'
  | 'ORDER_CANCEL'
  | 'EIMZO_VERIFY'
  | 'LOGIN_SUCCESS'
  | 'RATE_LIMIT_BLOCK'
  | 'CONFIG_UPDATE';

export type AuditLevel = 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';

export type AuditCategory = 'SECURITY' | 'FINANCE' | 'CATALOG' | 'ORDERS' | 'SYSTEM';

export interface AuditLogRecord {
  id: string;
  action: AuditAction;
  actionName: string;
  actorName: string;
  actorRole: string;
  actorInn?: string;
  actorPhone?: string;
  category: AuditCategory;
  level: AuditLevel;
  details: string;
  payloadJson?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'log-1',
    action: 'LOGIN_SUCCESS',
    actionName: 'Ma’mur Tizimga Kirdi',
    actorName: 'Farrukh Jumayev',
    actorRole: 'SUPER_ADMIN',
    actorInn: '201122334',
    actorPhone: '+998901234567',
    category: 'SECURITY',
    level: 'SUCCESS',
    details: 'Super Admin hisobiga 127.0.0.1 orqali muvaffaqiyatli kirildi. Sessiya boshlandi.',
    payloadJson: {
      authType: 'BEARER_JWT',
      sessionId: 'sess-889102-bs',
      mfaVerified: true
    },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) ArchLinux Chrome/130.0',
    timestamp: '2026-10-20 14:20:15'
  },
  {
    id: 'log-2',
    action: 'PRICE_CHANGE',
    actionName: 'Ommaviy Narx O‘zgartirildi',
    actorName: 'Sardor Rahimov',
    actorRole: 'ADMIN',
    actorInn: '305566778',
    category: 'CATALOG',
    level: 'WARNING',
    details: 'Sement va Armatura toifalari bo‘yicha 2 ta tovar narxi +5% indeksatsiya qilindi.',
    payloadJson: {
      affectedItems: ['CEM-M500-QOP', 'ARM-A500C-D12'],
      adjustmentType: 'PERCENT_INCREASE',
      adjustmentValue: 5,
      reason: 'Zavod ulgurji narxi oshishi'
    },
    ipAddress: '84.54.82.11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/128.0',
    timestamp: '2026-10-20 13:45:00'
  },
  {
    id: 'log-3',
    action: 'EIMZO_VERIFY',
    actionName: 'E-IMZO Shartnomasi Tasdiqlandi',
    actorName: 'Dilshod Toshmatov',
    actorRole: 'MODERATOR',
    actorInn: '309998877',
    category: 'SECURITY',
    level: 'SUCCESS',
    details: '«SAMARQAND CEMENT INDUSTRY» QK MChJ bilan B2B bosh shartnomasi PKCS#7 raqamli imzosi tekshirildi.',
    payloadJson: {
      serialNumber: '7B1188AA000100098877',
      standard: 'O‘zDSt 1092:2009',
      dsqStatus: 'VERIFIED'
    },
    ipAddress: '195.158.12.90',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/129.0',
    timestamp: '2026-10-20 12:15:33'
  },
  {
    id: 'log-4',
    action: 'RATE_LIMIT_BLOCK',
    actionName: 'Kiberxavfsizlik Cheklovi (Throttler)',
    actorName: 'Tizim Avtomat Himoyasi (WAF)',
    actorRole: 'SYSTEM',
    category: 'SECURITY',
    level: 'CRITICAL',
    details: '1 daqiqa ichida bir xil IP manzilidan 20 dan ortiq shubhali so‘rovlar qayd etildi va vaqtincha bloklandi.',
    payloadJson: {
      blockedIp: '185.203.118.23',
      endpoint: '/api/auth/login',
      attemptCount: 24,
      blockDurationSeconds: 900
    },
    ipAddress: '185.203.118.23',
    userAgent: 'python-requests/2.31.0 (Scraper/Bot)',
    timestamp: '2026-10-20 11:50:08'
  },
  {
    id: 'log-5',
    action: 'ORDER_CANCEL',
    actionName: 'B2B Buyurtma Bekor Qilindi',
    actorName: 'Jasur Aliyev',
    actorRole: 'LOGISTICS',
    actorInn: '304499118',
    category: 'ORDERS',
    level: 'WARNING',
    details: '#ORD-9025 buyurtmasi bekor qilindi. Sabab: Buyurtmachi to‘lov muddatini kechiktirdi.',
    payloadJson: {
      orderNumber: '#ORD-9025',
      finalAmount: 18000000,
      reason: 'To‘lov muddati o‘tdi'
    },
    ipAddress: '213.230.100.4',
    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) Firefox/131.0',
    timestamp: '2026-10-20 10:30:19'
  },
  {
    id: 'log-6',
    action: 'CONFIG_UPDATE',
    actionName: 'Tizim Konfiguratsiyasi Yangilandi',
    actorName: 'Sukhrob Sadullayev',
    actorRole: 'SUPER_ADMIN',
    actorInn: '201122334',
    category: 'SYSTEM',
    level: 'INFO',
    details: 'PostgreSQL & PostGIS ma’lumotlar bazasi qo‘lda muvaffaqiyatli zaxira olindi (Backup trigger).',
    payloadJson: {
      backupSizeMb: 418.5,
      backupFile: 'backup-2026-10-20.dump',
      durationSeconds: 1.5
    },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) ArchLinux Chrome/130.0',
    timestamp: '2026-10-20 09:10:45'
  }
];
