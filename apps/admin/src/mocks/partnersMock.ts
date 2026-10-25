export type PartnerStatus = 'OPERATIONAL' | 'DEGRADED' | 'DOWN';

export interface PartnerIntegrationItem {
  id: string;
  code: 'PAYME' | 'CLICK' | 'ESCROW_BANK' | 'E_IMZO' | 'ESKIZ_SMS' | 'GPS_TRACKER';
  name: string;
  category: 'PAYMENT' | 'BANK' | 'GOV_CRYPTO' | 'SMS' | 'TELEMATICS';
  provider: string;
  status: PartnerStatus;
  contractEnd: string;
  lastSyncAt: string;
  errorCount: number;
  uptime: string;
  description: string;
  details: {
    endpoint?: string;
    accountOrId?: string;
    balance?: string;
    lastError?: string;
    protocol?: string;
    twoManRuleActive?: boolean;
    [key: string]: any;
  };
}

export const INITIAL_PARTNERS: PartnerIntegrationItem[] = [
  {
    id: 'prt-1',
    code: 'PAYME',
    name: 'Payme Business Merchant API',
    category: 'PAYMENT',
    provider: 'Payme (ООО «Inspired»)',
    status: 'OPERATIONAL',
    contractEnd: '2027-12-31',
    lastSyncAt: '2026-10-24 14:45',
    errorCount: 0,
    uptime: '99.98%',
    description: 'B2B va chakana xaridlar uchun Payme orqali to‘lov shlyuzi va fiskal cheklar generatsiyasi.',
    details: {
      endpoint: 'https://checkout.paycom.uz/api',
      accountOrId: 'Merchant ID: 65b219f8a31b40',
      protocol: 'JSON-RPC 2.0 Webhook',
      balance: '84 500 000 so‘m (tranzitda)',
      lastError: 'So‘nggi 24 soatda xatolik kuzatilmadi'
    }
  },
  {
    id: 'prt-2',
    code: 'CLICK',
    name: 'Click Evolution B2B Gateway',
    category: 'PAYMENT',
    provider: 'Click (ООО «Click»)',
    status: 'OPERATIONAL',
    contractEnd: '2027-08-15',
    lastSyncAt: '2026-10-24 14:50',
    errorCount: 0,
    uptime: '99.95%',
    description: 'Click Complete & Prepare API protokoli bo‘yicha avtomatik kliring va to‘lov monitoringi.',
    details: {
      endpoint: 'https://api.click.uz/v2/merchant',
      accountOrId: 'Service ID: 38192 / Merchant: 29811',
      protocol: 'RESTful API HMAC-SHA1',
      balance: '62 100 000 so‘m (tranzitda)',
      lastError: 'Barcha tranzaksiyalar muvaffaqiyatli'
    }
  },
  {
    id: 'prt-3',
    code: 'ESCROW_BANK',
    name: 'Milliy Bank (NBU) Smart Escrow',
    category: 'BANK',
    provider: 'O‘zbekiston Milliy Banki AJ (NBU)',
    status: 'OPERATIONAL',
    contractEnd: '2028-06-30',
    lastSyncAt: '2026-10-24 15:02',
    errorCount: 0,
    uptime: '99.99%',
    description: 'Xaridor va ta‘minotchi o‘rtasidagi mablag‘larni xavfsiz bloklash (50/50 avans va to‘liq to‘lov).',
    details: {
      endpoint: 'Host-to-Host ISO 20022 Direct Link',
      accountOrId: 'Hisob: 22602000800000123456 (MFO 00450)',
      balance: '1 450 000 000 so‘m (Escrow depozit)',
      protocol: 'mTLS + Dual Private Tunnel',
      twoManRuleActive: true,
      lastError: 'Hech qanday nomuvofiqlik aniqlanmadi'
    }
  },
  {
    id: 'prt-4',
    code: 'E_IMZO',
    name: 'SICNT Soliq E-IMZO 2.0 PKI',
    category: 'GOV_CRYPTO',
    provider: 'DSQ Yangi Texnologiyalar Ilmiy Markazi',
    status: 'OPERATIONAL',
    contractEnd: '2029-01-01',
    lastSyncAt: '2026-10-24 14:30',
    errorCount: 1,
    uptime: '99.82%',
    description: 'Yuridik shaxslar STIR va sertifikatlari xaqiqiyligini tekshirish, shartnomalarni E-IMZO bilan imzolash.',
    details: {
      endpoint: 'https://e-imzo.soliq.uz/backend/verify',
      accountOrId: 'SICNT-BUNKERSTROY-V3',
      protocol: 'GOST 34.310-2004 / X.509',
      balance: 'Cheklanmagan (Davlat kvotasi)',
      lastError: '14:15 da CRL yangilanishida 3 soniyalik timeout (avtomatik tiklandi)'
    }
  },
  {
    id: 'prt-5',
    code: 'ESKIZ_SMS',
    name: 'Eskiz SMS Gateway (OTP & Dispatch)',
    category: 'SMS',
    provider: 'Eskiz ICT (ООО «Eskiz»)',
    status: 'OPERATIONAL',
    contractEnd: '2027-04-10',
    lastSyncAt: '2026-10-24 15:05',
    errorCount: 2,
    uptime: '99.70%',
    description: 'Haydovchi, mijoz va ta‘minotchilarga PIN-kodlar, yetib kelish bildirishnomalari va buyurtma holati SMSlari.',
    details: {
      endpoint: 'https://notify.eskiz.uz/api/message/sms/send',
      accountOrId: 'Sender Alpha Header: BUNKERSTROY',
      protocol: 'Bearer JWT Auth',
      balance: '48 500 ta SMS (Yetarli)',
      lastError: '2 ta SMS qabul qiluvchi apparati o‘chiqligi sababli navbatga qo‘yildi'
    }
  },
  {
    id: 'prt-6',
    code: 'GPS_TRACKER',
    name: 'Wialon / LocAuto Heavy Fleet Telematics',
    category: 'TELEMATICS',
    provider: 'LocAuto Telematics & GPS Solutions',
    status: 'OPERATIONAL',
    contractEnd: '2026-11-30',
    lastSyncAt: '2026-10-24 15:08',
    errorCount: 0,
    uptime: '99.91%',
    description: 'Og‘ir samosvallar, mikserlar va yuk mashinalarining real-vaqtdagi geolokatsiyasi, tezligi va marshruti.',
    details: {
      endpoint: 'mqtt://telematics.bunkerstroy.uz:8883',
      accountOrId: 'Ulagan transportlar: 18 ta (12 ta harakatda)',
      protocol: 'Wialon IPS v2.0 & MQTT Sensor stream',
      balance: 'Yillik korporativ litsenziya',
      lastError: 'Barcha trekerlar 10 soniyalik intervallarda javob bermoqda'
    }
  }
];
