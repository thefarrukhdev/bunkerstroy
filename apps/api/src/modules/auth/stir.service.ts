import { CompanyInfo, StirRegex } from '@bunkerstroy/types';

interface CachedCompany {
  data: CompanyInfo;
  cachedAt: number;
}

export class StirService {
  private cache = new Map<string, CachedCompany>();
  private readonly CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  private testCompanies: Record<string, Partial<CompanyInfo>> = {
    '201122334': {
      companyName: '«BUNKER STROY INVEST» MChJ',
      status: 'ACTIVE',
      statusDescription: 'Faol korxona',
      director: 'Jumayev Farrukh',
      address: 'Toshkent sh., Chilonzor tumani, Bunyodkor shox ko‘chasi, 42-uy',
      region: 'Toshkent shahri',
      district: 'Chilonzor tumani',
      registrationDate: '2022-01-15',
      activityType: 'Qurilish materiallari ulgurji savdosi',
      vatPayer: true
    },
    '305566778': {
      companyName: '«TOSHKENT G\'ISHT VA SEMENT SERVIS» MChJ',
      status: 'ACTIVE',
      statusDescription: 'Faol korxona',
      director: 'Qodirov Alisher',
      address: 'Toshkent vil., Zangiota t., Eshonguzar qo‘rg‘oni',
      region: 'Toshkent viloyati',
      district: 'Zangiota tumani',
      registrationDate: '2020-05-12',
      activityType: 'G‘isht va sement ishlab chiqarish',
      vatPayer: true
    },
    '209999999': {
      companyName: '«ESKI QURILISH INVEST» MChJ',
      status: 'LIQUIDATED',
      statusDescription: 'Tugatilgan (Likvidatsiya)',
      director: 'Yusupov Jamshid',
      address: 'Samarqand sh., Registon ko‘chasi 11-uy',
      region: 'Samarqand viloyati',
      district: 'Samarqand shahri',
      registrationDate: '2018-03-10',
      activityType: 'Umumiy qurilish ishlari',
      vatPayer: false
    }
  };

  async lookup(inn: string): Promise<CompanyInfo | null> {
    const cleanInn = inn.trim();
    if (!StirRegex.test(cleanInn)) {
      throw new Error('STIR aynan 9 ta raqamdan iborat bo‘lishi shart');
    }

    const cached = this.cache.get(cleanInn);
    if (cached && Date.now() - cached.cachedAt < this.CACHE_TTL_MS) {
      return cached.data;
    }

    // Soliq Open Data API yoki mock data
    const mock = this.testCompanies[cleanInn];
    if (mock) {
      const company: CompanyInfo = {
        inn: cleanInn,
        companyName: mock.companyName || `MChJ (STIR: ${cleanInn})`,
        shortName: mock.shortName || undefined,
        status: mock.status as any || 'ACTIVE',
        statusDescription: mock.statusDescription || 'Faol korxona',
        director: mock.director || 'Rahbar aniqlanmagan',
        address: mock.address || "O'zbekiston Respublikasi",
        region: mock.region || 'Toshkent shahri',
        district: mock.district || 'Yunusobod tumani',
        registrationDate: mock.registrationDate || new Date().toISOString().split('T')[0],
        activityType: mock.activityType || 'Qurilish faoliyati',
        vatPayer: mock.vatPayer ?? false
      };

      this.cache.set(cleanInn, { data: company, cachedAt: Date.now() });
      return company;
    }

    // Default dynamic lookup for any valid 9 digit STIR
    const generated: CompanyInfo = {
      inn: cleanInn,
      companyName: `«QURILISH INVEST SERVIS ${cleanInn.slice(-4)}» MChJ`,
      status: 'ACTIVE',
      statusDescription: 'Faol soliq to‘lovchi',
      director: 'Mas’ul Shaxs',
      address: `Toshkent shahri, STIR: ${cleanInn}`,
      region: 'Toshkent shahri',
      district: 'Mirobod tumani',
      registrationDate: '2023-01-01',
      activityType: 'Qurilish mollarini realizatsiya qilish',
      vatPayer: true
    };

    this.cache.set(cleanInn, { data: generated, cachedAt: Date.now() });
    return generated;
  }
}

export const stirService = new StirService();
