import { Injectable } from '@nestjs/common';
import { SystemLog } from '@bunkerstroy/types';

@Injectable()
export class AdminService {
  private logs: SystemLog[] = [
    {
      id: 'log-1',
      action: 'Boshqaruv paneliga kirish',
      actor: 'Farrukh Jumayev (Admin)',
      category: 'AUTH',
      details: 'IP: 127.0.0.1 orqali muvaffaqiyatli kirildi',
      level: 'SUCCESS',
      timestamp: new Date().toISOString()
    },
    {
      id: 'log-2',
      action: 'STIR tekshirildi',
      actor: 'Soliq Gateway',
      category: 'SYSTEM_SECURITY',
      details: 'STIR: 201122334 «BUNKER STROY INVEST» MChJ faol',
      level: 'INFO',
      timestamp: new Date().toISOString()
    }
  ];

  getMetrics() {
    return {
      totalTurnover: 1485000000,
      totalIncome: 185000000,
      totalExpense: 42000000,
      netProfit: 143000000,
      ordersCount: 384,
      activePartnersCount: 28,
      returnsCount: 2,
      returnsSum: 3200000
    };
  }

  getLogs() {
    return this.logs;
  }

  getSuppliers() {
    return [
      {
        id: 'sup-1',
        companyName: '«TOSHKENT G\'ISHT VA SEMENT SERVIS» MChJ',
        director: 'Qodirov Alisher',
        phone: '+998971112233',
        region: 'Toshkent viloyati',
        status: 'ACTIVE',
        rating: 4.9,
        productsCount: 14,
        totalSalesSum: 480000000
      },
      {
        id: 'sup-2',
        companyName: '«SAMARQAND CEMENT INDUSTRY» QK MChJ',
        director: 'Saidov Bahrom',
        phone: '+998934445566',
        region: 'Samarqand viloyati',
        status: 'ACTIVE',
        rating: 4.8,
        productsCount: 9,
        totalSalesSum: 310000000
      }
    ];
  }
}
