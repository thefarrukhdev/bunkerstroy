import { Injectable } from '@nestjs/common';
import { Product } from '@bunkerstroy/types';

@Injectable()
export class CatalogService {
  private products: Product[] = [
    {
      id: 'prod-1',
      title: 'Sement M500 D0 (Qoraqamish zavodi, 50kg)',
      slug: 'sement-m500-d0-50kg',
      categoryId: 'cat-sement',
      supplierId: 'sup-1',
      supplierName: 'Toshkent Sement Servis MChJ',
      price: 64000,
      unit: 'BAG_50KG',
      stock: 4500,
      minOrder: 20,
      energyEfficiencyRating: 'A',
      isEscoCertified: true,
      description: 'Yuqori sifatli M500 D0 markali portlandsement. GOST 31108 standarti bo‘yicha.',
      itemType: 'MATERIAL',
      repairType: 'UNIVERSAL',
      region: 'Toshkent shahri',
      district: 'Olmazor tumani',
      images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'],
      hasDelivery: true,
      hasBonus: true,
      variants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod-2',
      title: 'Armatura A500C D14 (O‘zmetkombinat)',
      slug: 'armatura-a500c-d14',
      categoryId: 'cat-armatura',
      supplierId: 'sup-1',
      supplierName: 'Toshkent Sement Servis MChJ',
      price: 8900000,
      unit: 'TON',
      stock: 150,
      minOrder: 1,
      energyEfficiencyRating: 'A++',
      isEscoCertified: false,
      description: 'Issiq prokatlangan armatura po‘lati A500C, diametri 14 mm.',
      itemType: 'MATERIAL',
      repairType: 'EXTERNAL',
      region: 'Toshkent shahri',
      district: 'Sergeli tumani',
      images: ['https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800'],
      hasDelivery: true,
      hasBonus: false,
      variants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod-3',
      title: 'Bazalt Mineral Plitasi 50mm (Fasad izolyatsiya)',
      slug: 'bazalt-plitasi-50mm',
      categoryId: 'cat-izolyatsiya',
      supplierId: 'sup-2',
      supplierName: 'EcoFasad Standart QK',
      price: 38000,
      unit: 'SQ_METER',
      stock: 2400,
      minOrder: 50,
      energyEfficiencyRating: 'A++',
      isEscoCertified: true,
      description: 'Fasad va tom uchun mineral tosh plitalari. Issiqlikni 40% gacha tejaydi.',
      itemType: 'MATERIAL',
      repairType: 'EXTERNAL',
      region: 'Samarqand viloyati',
      district: 'Samarqand shahri',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
      hasDelivery: true,
      hasBonus: true,
      variants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  findAll(query?: string, category?: string, region?: string, escoOnly?: boolean): Product[] {
    let result = [...this.products];
    if (category && category !== 'all') {
      result = result.filter((p) => p.categoryId === category);
    }
    if (region && region !== 'all') {
      result = result.filter((p) => p.region?.toLowerCase().includes(region.toLowerCase()));
    }
    if (escoOnly) {
      result = result.filter((p) => p.isEscoCertified);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }

  findById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}
