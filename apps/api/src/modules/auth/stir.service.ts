import { Injectable } from '@nestjs/common';
import { CompanyInfo, StirRegex } from '@bunkerstroy/types';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class StirService {
  private readonly CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

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

  constructor(private readonly redisService?: RedisService) {}

  async lookup(inn: string): Promise<CompanyInfo | null> {
    const cleanInn = inn.trim();
    if (!StirRegex.test(cleanInn)) {
      throw new Error('STIR aynan 9 ta raqamdan iborat bo‘lishi shart');
    }

    const cacheKey = `stir:${cleanInn}`;
    if (this.redisService) {
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached) as CompanyInfo;
        } catch {
          // ignore json parse error
        }
      }
    }

    // Soliq Open Data API or mock lookup
    let company: CompanyInfo;
    const mock = this.testCompanies[cleanInn];
    if (mock) {
      company = {
        inn: cleanInn,
        companyName: mock.companyName || `MChJ (STIR: ${cleanInn})`,
        shortName: mock.shortName || undefined,
        status: (mock.status as any) || 'ACTIVE',
        statusDescription: mock.statusDescription || 'Faol korxona',
        director: mock.director || 'Rahbar aniqlanmagan',
        address: mock.address || "O'zbekiston Respublikasi",
        region: mock.region || 'Toshkent shahri',
        district: mock.district || 'Yunusobod tumani',
        registrationDate: mock.registrationDate || new Date().toISOString().split('T')[0],
        activityType: mock.activityType || 'Qurilish faoliyati',
        vatPayer: mock.vatPayer ?? false
      };
    } else {
      company = {
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
    }

    if (this.redisService) {
      await this.redisService.set(cacheKey, JSON.stringify(company), this.CACHE_TTL_SECONDS);
    }

    return company;
  }
}

export const stirService = new StirService();
