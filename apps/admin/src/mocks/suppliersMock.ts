export interface DSQTaxpayerInfo {
  inn: string;
  companyName: string;
  director: string;
  address: string;
  status: 'ACTIVE' | 'LIQUIDATING' | 'INACTIVE';
  statusDescription: string;
  vatPayer: boolean;
  vatRegCode?: string;
  registrationDate: string;
  taxDebtSum: number;
}

export interface SupplierCompany {
  id: string;
  inn: string;
  companyName: string;
  shortName?: string;
  director: string;
  phone: string;
  email?: string;
  region: string;
  district?: string;
  address: string;
  vatPayer: boolean;
  vatRegCode?: string;
  status: 'VERIFIED' | 'PENDING' | 'SUSPENDED';
  statusDescription: string;
  productsCount: number;
  totalTurnover: number;
  rating: number;
  registrationDate: string;
  verifiedAt?: string;
  contractNumber?: string;
  eimzoSerialNumber?: string;
  eimzoVerifiedAt?: string;
}

export const INITIAL_SUPPLIERS: SupplierCompany[] = [
  {
    id: 'sup-1',
    inn: '201122334',
    companyName: '«TOSHKENT G‘ISHT VA SEMENT SERVIS» MChJ',
    shortName: 'TGSS MChJ',
    director: 'Qodirov Alisher Rustamovich',
    phone: '+998901234567',
    email: 'info@tgss.uz',
    region: 'Toshkent viloyati',
    district: 'Zangiota tumani',
    address: 'Quruvchilar ko‘chasi 45-uy',
    vatPayer: true,
    vatRegCode: '324001928374',
    status: 'VERIFIED',
    statusDescription: 'Soliq va E-IMZO to‘liq tasdiqlangan',
    productsCount: 14,
    totalTurnover: 480000000,
    rating: 4.9,
    registrationDate: '2019-04-12',
    verifiedAt: '2026-01-15',
    contractNumber: 'BS-B2B-2026/014',
    eimzoSerialNumber: '5F4A9B11000200034455',
    eimzoVerifiedAt: '2026-01-15 11:30'
  },
  {
    id: 'sup-2',
    inn: '305566778',
    companyName: '«SAMARQAND CEMENT INDUSTRY» QK MChJ',
    shortName: 'SamCement QK',
    director: 'Saidov Bahrom Olimovich',
    phone: '+998935551122',
    email: 'sales@samcement.uz',
    region: 'Samarqand viloyati',
    district: 'Pastdarg‘om tumani',
    address: 'Sanoat zonasi 12-bino',
    vatPayer: true,
    vatRegCode: '324005511223',
    status: 'VERIFIED',
    statusDescription: 'Soliq va E-IMZO to‘liq tasdiqlangan',
    productsCount: 9,
    totalTurnover: 310000000,
    rating: 4.8,
    registrationDate: '2020-08-25',
    verifiedAt: '2026-02-01',
    contractNumber: 'BS-B2B-2026/028',
    eimzoSerialNumber: '7B1188AA000100098877',
    eimzoVerifiedAt: '2026-02-01 16:45'
  },
  {
    id: 'sup-3',
    inn: '200889912',
    companyName: '«BEKOBOD METALL INVEST» AJ Dileri',
    shortName: 'Metall Invest',
    director: 'Rustamov Sardor Karimovich',
    phone: '+998909876543',
    email: 'invest@metallbekobod.uz',
    region: 'Toshkent shahri',
    district: 'Sergeli tumani',
    address: 'Yangi Sergeli ko‘chasi 88',
    vatPayer: true,
    vatRegCode: '324009988112',
    status: 'VERIFIED',
    statusDescription: 'Yirik metall ta’minotchisi (Diler)',
    productsCount: 22,
    totalTurnover: 520000000,
    rating: 5.0,
    registrationDate: '2018-02-14',
    verifiedAt: '2026-01-10',
    contractNumber: 'BS-B2B-2026/003',
    eimzoSerialNumber: '1A9900CC000400011223',
    eimzoVerifiedAt: '2026-01-10 14:15'
  },
  {
    id: 'sup-4',
    inn: '309998877',
    companyName: '«ECO-PENOPLAST ENERGO» MChJ (ESCO)',
    shortName: 'EcoPenoplast',
    director: 'Karimova Nargiza Shuhratovna',
    phone: '+998998223344',
    email: 'eco@penoplast.uz',
    region: 'Farg‘ona viloyati',
    district: 'Qo‘qon shahri',
    address: 'Temiryo‘lchilar ko‘chasi 14',
    vatPayer: false,
    status: 'PENDING',
    statusDescription: 'Yangi ariza: DSQ va E-IMZO tekshiruvi kutilmoqda',
    productsCount: 6,
    totalTurnover: 0,
    rating: 4.5,
    registrationDate: '2022-11-05',
    contractNumber: 'BS-B2B-2026/102-REQ'
  },
  {
    id: 'sup-5',
    inn: '207654321',
    companyName: '«QUVASOY SHIFER & BLOK» MChJ',
    shortName: 'Quvasoy Shifer',
    director: 'Toshmatov Jamshid Sobirovich',
    phone: '+998913332211',
    email: 'shifer@quvasoy.uz',
    region: 'Farg‘ona viloyati',
    district: 'Quvasoy shahri',
    address: 'Kimyogarlar dahasi 5',
    vatPayer: true,
    vatRegCode: '324007766554',
    status: 'SUSPENDED',
    statusDescription: 'Soliq hisobotlaridagi nomuvofiqlik sabab to‘xtatilgan',
    productsCount: 8,
    totalTurnover: 50000000,
    rating: 4.2,
    registrationDate: '2021-03-30',
    contractNumber: 'BS-B2B-2026/054'
  }
];

export const MOCK_DSQ_DATABASE: Record<string, DSQTaxpayerInfo> = {
  '201122334': {
    inn: '201122334',
    companyName: '«TOSHKENT G‘ISHT VA SEMENT SERVIS» MChJ',
    director: 'Qodirov Alisher Rustamovich',
    address: 'Toshkent viloyati, Zangiota tumani, Quruvchilar ko‘chasi 45-uy',
    status: 'ACTIVE',
    statusDescription: 'Faol yuridik shaxs (DSQ)',
    vatPayer: true,
    vatRegCode: '324001928374',
    registrationDate: '2019-04-12',
    taxDebtSum: 0
  },
  '305566778': {
    inn: '305566778',
    companyName: '«SAMARQAND CEMENT INDUSTRY» QK MChJ',
    director: 'Saidov Bahrom Olimovich',
    address: 'Samarqand viloyati, Pastdarg‘om tumani, Sanoat zonasi 12-bino',
    status: 'ACTIVE',
    statusDescription: 'Faol yuridik shaxs (DSQ)',
    vatPayer: true,
    vatRegCode: '324005511223',
    registrationDate: '2020-08-25',
    taxDebtSum: 0
  },
  '200889912': {
    inn: '200889912',
    companyName: '«BEKOBOD METALL INVEST» AJ Dileri',
    director: 'Rustamov Sardor Karimovich',
    address: 'Toshkent shahri, Sergeli tumani, Yangi Sergeli ko‘chasi 88',
    status: 'ACTIVE',
    statusDescription: 'Faol yuridik shaxs (DSQ)',
    vatPayer: true,
    vatRegCode: '324009988112',
    registrationDate: '2018-02-14',
    taxDebtSum: 0
  },
  '309998877': {
    inn: '309998877',
    companyName: '«ECO-PENOPLAST ENERGO» MChJ (ESCO)',
    director: 'Karimova Nargiza Shuhratovna',
    address: 'Farg‘ona viloyati, Qo‘qon shahri, Temiryo‘lchilar ko‘chasi 14',
    status: 'ACTIVE',
    statusDescription: 'Faol yuridik shaxs (DSQ)',
    vatPayer: false,
    registrationDate: '2022-11-05',
    taxDebtSum: 0
  },
  '207654321': {
    inn: '207654321',
    companyName: '«QUVASOY SHIFER & BLOK» MChJ',
    director: 'Toshmatov Jamshid Sobirovich',
    address: 'Farg‘ona viloyati, Quvasoy shahri, Kimyogarlar dahasi 5',
    status: 'ACTIVE',
    statusDescription: 'Faol yuridik shaxs (DSQ)',
    vatPayer: true,
    vatRegCode: '324007766554',
    registrationDate: '2021-03-30',
    taxDebtSum: 14200000
  }
};
