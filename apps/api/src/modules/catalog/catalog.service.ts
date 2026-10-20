import { Injectable } from '@nestjs/common';
import { Product } from '@bunkerstroy/types';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly defaultProducts: Product[] = [
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

  private mapPrismaProduct(p: any): Product {
    let unit = p.unit as any;
    if (unit === 'qop (50kg)' || unit?.includes('50kg') || unit?.includes('qop')) {
      unit = 'BAG_50KG';
    } else if (unit === 'tonna' || unit?.includes('ton')) {
      unit = 'TON';
    } else if (unit === 'm²' || unit === 'm2' || unit?.includes('SQ_METER')) {
      unit = 'SQ_METER';
    } else if (unit === 'dona' || unit?.includes('PIECE')) {
      unit = 'PIECE';
    } else if (!['BAG_50KG', 'TON', 'PIECE', 'SQ_METER', 'CUBIC_METER', 'ROLL', 'METER', 'LITER'].includes(unit)) {
      unit = 'BAG_50KG';
    }

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      categoryId: p.categoryId,
      supplierId: p.supplierId,
      supplierName: p.supplier?.companyName || p.supplier?.displayName || 'Toshkent Sement Servis MChJ',
      price: Number(p.price),
      unit,
      stock: p.stock,
      minOrder: p.minOrder,
      energyEfficiencyRating: (p.energyEfficiencyRating || 'STANDARD') as any,
      isEscoCertified: Boolean(p.isEscoCertified),
      description: p.description,
      itemType: (p.itemType || 'MATERIAL') as any,
      repairType: (p.repairType || 'UNIVERSAL') as any,
      region: p.region || null,
      district: p.district || null,
      images: Array.isArray(p.images) ? p.images : [],
      warranty: p.warranty || null,
      hasDelivery: Boolean(p.hasDelivery),
      hasBonus: Boolean(p.hasBonus),
      bonusDescription: p.bonusDescription || null,
      bonusThreshold: p.bonusThreshold ? Number(p.bonusThreshold) : null,
      bonusAmount: p.bonusAmount ? Number(p.bonusAmount) : null,
      variants: Array.isArray(p.variants)
        ? p.variants.map((v: any) => ({
            id: v.id,
            productId: v.productId,
            sku: v.sku,
            color: v.color || null,
            size: v.size || null,
            weight: v.weight || null,
            length: v.length || null,
            priceDelta: Number(v.priceDelta || 0),
            stock: v.stock || 0
          }))
        : [],
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : (p.createdAt || new Date().toISOString()),
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : (p.updatedAt || new Date().toISOString())
    };
  }

  async findAll(query?: string, category?: string, region?: string, escoOnly?: boolean): Promise<Product[]> {
    let products: Product[] = [];
    try {
      const dbProducts = await this.prisma.product.findMany({
        include: { supplier: true, variants: true, category: true }
      });
      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts.map((p) => this.mapPrismaProduct(p));
      }
    } catch (err) {
      console.warn('Prisma CatalogService findAll fallback due to DB error/connecting:', err);
    }

    if (products.length === 0) {
      products = [...this.defaultProducts];
    }

    let result = products;
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

  async findById(id: string): Promise<Product | undefined> {
    const slugMap: Record<string, string> = {
      'prod-1': 'sement-m500-d0-50kg',
      'prod-2': 'armatura-a500c-d14',
      'prod-3': 'bazalt-plitasi-50mm'
    };
    const targetSlug = slugMap[id] || id;

    try {
      const dbProduct = await this.prisma.product.findFirst({
        where: {
          OR: [{ id }, { slug: id }, { slug: targetSlug }]
        },
        include: { supplier: true, variants: true, category: true }
      });
      if (dbProduct) {
        return this.mapPrismaProduct(dbProduct);
      }
    } catch (err) {
      console.warn(`Prisma CatalogService findById error/fallback for ${id}:`, err);
    }

    return this.defaultProducts.find((p) => p.id === id || p.slug === id || p.slug === targetSlug);
  }
}
