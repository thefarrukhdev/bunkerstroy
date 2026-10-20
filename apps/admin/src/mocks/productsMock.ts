export type ProductUnit = 'QOP_50KG' | 'TONNA' | 'KV_METR' | 'KUB_METR' | 'DONA';

export interface ProductItem {
  id: string;
  sku: string;
  title: string;
  categoryId: string;
  categoryName: string;
  supplierId: string;
  supplierName: string;
  price: number;
  unit: ProductUnit;
  unitLabel: string;
  stock: number;
  lowStockThreshold: number;
  minOrder: number;
  isEscoCertified: boolean;
  energyRating?: 'A+++' | 'A++' | 'A+' | 'STANDARD';
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  productsCount: number;
}

export const CATEGORIES: ProductCategory[] = [
  { id: 'cat-cement', name: 'Sement & Qorishmalar', slug: 'sement-qorishmalar', productsCount: 18 },
  { id: 'cat-metal', name: 'Metall & Armatura', slug: 'metall-armatura', productsCount: 24 },
  { id: 'cat-bricks', name: 'G‘isht & Gazoblok', slug: 'gisht-gazoblok', productsCount: 12 },
  { id: 'cat-insulation', name: 'Issiqlik Izolyatsiyasi (ESCO)', slug: 'izolyatsiya', productsCount: 9 },
  { id: 'cat-concrete', name: 'Beton & Temir-beton', slug: 'beton-buyumlari', productsCount: 15 }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    sku: 'CEM-M500-QOP',
    title: 'Portlendsement M500 D0 (Bekobod zavodi)',
    categoryId: 'cat-cement',
    categoryName: 'Sement & Qorishmalar',
    supplierId: 'sup-1',
    supplierName: '«TOSHKENT G‘ISHT VA SEMENT SERVIS» MChJ',
    price: 68000,
    unit: 'QOP_50KG',
    unitLabel: 'qop (50 kg)',
    stock: 4500,
    lowStockThreshold: 500,
    minOrder: 20,
    isEscoCertified: false,
    energyRating: 'STANDARD',
    status: 'IN_STOCK',
    updatedAt: '2026-10-20 14:30'
  },
  {
    id: 'prod-2',
    sku: 'ARM-A500C-D12',
    title: 'Armatura A500C Ø12 mm (11.7m O‘zmetkombinat)',
    categoryId: 'cat-metal',
    categoryName: 'Metall & Armatura',
    supplierId: 'sup-3',
    supplierName: '«BEKOBOD METALL INVEST» AJ Dileri',
    price: 9200000,
    unit: 'TONNA',
    unitLabel: 'tonna',
    stock: 120,
    lowStockThreshold: 20,
    minOrder: 1,
    isEscoCertified: false,
    energyRating: 'STANDARD',
    status: 'IN_STOCK',
    updatedAt: '2026-10-20 12:15'
  },
  {
    id: 'prod-3',
    sku: 'ESCO-MINVATA-100',
    title: 'Bazalt Mineral Paxta Plitasi 100 mm (Zichlik: 110 kg/m³)',
    categoryId: 'cat-insulation',
    categoryName: 'Issiqlik Izolyatsiyasi (ESCO)',
    supplierId: 'sup-4',
    supplierName: '«ECO-PENOPLAST ENERGO» MChJ (ESCO)',
    price: 85000,
    unit: 'KV_METR',
    unitLabel: 'm²',
    stock: 2800,
    lowStockThreshold: 400,
    minOrder: 50,
    isEscoCertified: true,
    energyRating: 'A++',
    status: 'IN_STOCK',
    updatedAt: '2026-10-19 11:20'
  },
  {
    id: 'prod-4',
    sku: 'GAZO-D500-600',
    title: 'Avtoklav Gazoblok D500 (600x300x200 mm)',
    categoryId: 'cat-bricks',
    categoryName: 'G‘isht & Gazoblok',
    supplierId: 'sup-1',
    supplierName: '«TOSHKENT G‘ISHT VA SEMENT SERVIS» MChJ',
    price: 680000,
    unit: 'KUB_METR',
    unitLabel: 'm³',
    stock: 85,
    lowStockThreshold: 100,
    minOrder: 10,
    isEscoCertified: true,
    energyRating: 'A+',
    status: 'LOW_STOCK',
    updatedAt: '2026-10-20 09:40'
  },
  {
    id: 'prod-5',
    sku: 'BET-M350-B25',
    title: 'Tayyor Tovar Beton M350 B25 (Mikser bilan yetkazish)',
    categoryId: 'cat-concrete',
    categoryName: 'Beton & Temir-beton',
    supplierId: 'sup-2',
    supplierName: '«SAMARQAND CEMENT INDUSTRY» QK MChJ',
    price: 520000,
    unit: 'KUB_METR',
    unitLabel: 'm³',
    stock: 0,
    lowStockThreshold: 50,
    minOrder: 6,
    isEscoCertified: false,
    energyRating: 'STANDARD',
    status: 'OUT_OF_STOCK',
    updatedAt: '2026-10-18 17:00'
  },
  {
    id: 'prod-6',
    sku: 'GISHT-PISHGAN-M100',
    title: 'Pishgan Qizil G‘isht M100 (Standart 250x120x65 mm)',
    categoryId: 'cat-bricks',
    categoryName: 'G‘isht & Gazoblok',
    supplierId: 'sup-5',
    supplierName: '«QUVASOY SHIFER & BLOK» MChJ',
    price: 1100,
    unit: 'DONA',
    unitLabel: 'dona',
    stock: 65000,
    lowStockThreshold: 10000,
    minOrder: 5000,
    isEscoCertified: false,
    energyRating: 'STANDARD',
    status: 'IN_STOCK',
    updatedAt: '2026-10-19 16:30'
  }
];
