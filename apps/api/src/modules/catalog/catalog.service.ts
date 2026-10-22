import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { Product } from '@bunkerstroy/types';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../admin/audit-log.service';
import { GetProductsQueryDto, CreateProductDto, UpdateProductDto } from './dto/catalog.dto';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private slugify(text: string): string {
    const cyrillicToLatin: Record<string, string> = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j',
      з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
      п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
      ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
      я: 'ya', ғ: 'g', қ: 'q', ҳ: 'h', ў: 'o',
    };

    const transliterated = text
      .toLowerCase()
      .split('')
      .map((char) => cyrillicToLatin[char] || char)
      .join('');

    let clean = transliterated
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!clean) {
      clean = `prod-${Date.now().toString(36)}`;
    }

    return clean;
  }

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
      images: ['https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800'],
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

  public mapPrismaProduct(p: any): Product {
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

  async findAll(queryDto: GetProductsQueryDto = {}): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, Number(queryDto.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(queryDto.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (queryDto.category && queryDto.category !== 'all') {
      where.OR = [
        { categoryId: queryDto.category },
        { category: { slug: queryDto.category } }
      ];
    }

    if (queryDto.region && queryDto.region !== 'all') {
      where.region = { contains: queryDto.region, mode: 'insensitive' };
    }

    if (queryDto.escoOnly) {
      where.isEscoCertified = true;
    }

    if (queryDto.supplierId) {
      where.supplierId = queryDto.supplierId;
    }

    if (queryDto.query) {
      const q = queryDto.query.trim();
      const searchConditions = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    try {
      const [dbProducts, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { supplier: true, variants: true, category: true },
        }),
        this.prisma.product.count({ where }),
      ]);

      if (total > 0 || (queryDto.category || queryDto.query || queryDto.region)) {
        const mapped = dbProducts.map((p) => this.mapPrismaProduct(p));
        return {
          data: mapped,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    } catch (err: any) {
      this.logger.warn(`Prisma CatalogService findAll warning: ${err?.message}`);
    }

    // Fallback in-memory filter if database empty
    let fallbackResult = [...this.defaultProducts];
    if (queryDto.category && queryDto.category !== 'all') {
      fallbackResult = fallbackResult.filter((p) => p.categoryId === queryDto.category);
    }
    if (queryDto.region && queryDto.region !== 'all') {
      fallbackResult = fallbackResult.filter((p) =>
        p.region?.toLowerCase().includes(queryDto.region!.toLowerCase())
      );
    }
    if (queryDto.escoOnly) {
      fallbackResult = fallbackResult.filter((p) => p.isEscoCertified);
    }
    if (queryDto.query) {
      const q = queryDto.query.toLowerCase();
      fallbackResult = fallbackResult.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    const total = fallbackResult.length;
    const paginated = fallbackResult.slice(skip, skip + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
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
    } catch (err: any) {
      this.logger.warn(`Prisma CatalogService findById warning for ${id}: ${err?.message}`);
    }

    return this.defaultProducts.find((p) => p.id === id || p.slug === id || p.slug === targetSlug);
  }

  async createProduct(dto: CreateProductDto, actorSupplierId: string): Promise<Product> {
    // 1. Resolve Category
    let category = await this.prisma.category.findFirst({
      where: {
        OR: [{ id: dto.categoryId }, { slug: dto.categoryId }],
      },
    });

    if (!category) {
      // Find default category or create one
      category = await this.prisma.category.findFirst();
      if (!category) {
        category = await this.prisma.category.create({
          data: {
            name: 'Umumiy qurilish mollari',
            slug: 'umumiy-qurilish',
          },
        });
      }
    }

    // 2. Resolve Supplier User
    let supplier = await this.prisma.user.findUnique({
      where: { id: actorSupplierId },
    });

    if (!supplier) {
      supplier = await this.prisma.user.findFirst({
        where: { role: 'SUPPLIER' },
      });
      if (!supplier) {
        supplier = await this.prisma.user.findFirst({
          where: { role: 'ADMIN' },
        });
      }
    }

    if (!supplier) {
      throw new BadRequestException('Ta’minotchi foydalanuvchi tizimda topilmadi');
    }

    // 3. Generate unique slug
    let slug = dto.slug?.trim() || this.slugify(dto.title);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const created = await this.prisma.product.create({
      data: {
        title: dto.title,
        slug,
        categoryId: category.id,
        supplierId: supplier.id,
        price: dto.price,
        unit: dto.unit || 'dona',
        stock: dto.stock,
        minOrder: dto.minOrder || 1,
        energyEfficiencyRating: dto.energyEfficiencyRating || 'STANDARD',
        isEscoCertified: dto.isEscoCertified || false,
        description: dto.description,
        itemType: dto.itemType || 'MATERIAL',
        repairType: dto.repairType || 'UNIVERSAL',
        region: dto.region || supplier.region || 'Toshkent shahri',
        district: dto.district || supplier.district || 'Chilonzor tumani',
        images: dto.images && dto.images.length > 0 ? dto.images : ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'],
        warranty: dto.warranty || null,
        hasDelivery: dto.hasDelivery ?? true,
        hasBonus: dto.hasBonus ?? false,
      },
      include: { supplier: true, variants: true, category: true },
    });

    await this.auditLogService.logAction({
      actorId: supplier.id,
      action: 'PRODUCT_CREATED',
      category: 'CATALOG',
      details: `Yangi mahsulot qo‘shildi: ${created.title} (${created.id})`,
      level: 'INFO',
    });

    return this.mapPrismaProduct(created);
  }

  async getCategories() {
    try {
      const cats = await this.prisma.category.findMany({
        orderBy: { orderIndex: 'asc' },
        include: { _count: { select: { products: true } } },
      });
      if (cats && cats.length > 0) {
        return cats.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon || null,
          productsCount: c._count.products,
        }));
      }
    } catch (err: any) {
      this.logger.warn(`Failed to fetch categories: ${err?.message}`);
    }

    return [
      { id: 'cat-sement', name: 'Sement & Qorishmalar', slug: 'sement-qorishmalar', productsCount: 18 },
      { id: 'cat-armatura', name: 'Metall & Armatura', slug: 'armatura-metall', productsCount: 24 },
      { id: 'cat-gisht', name: 'G‘isht & Gazoblok', slug: 'gisht-gazoblok', productsCount: 15 },
      { id: 'cat-izolyatsiya', name: 'Izolyatsiya & Tom yopish', slug: 'izolyatsiya-tom', productsCount: 12 },
      { id: 'cat-boyoq', name: 'Bo‘yoq & Pardozlash', slug: 'boyoq-pardozlash', productsCount: 9 },
      { id: 'cat-santexnika', name: 'Santexnika & Quvurlar', slug: 'santexnika-quvurlar', productsCount: 14 },
      { id: 'cat-elektr', name: 'Elektr & Kabellar', slug: 'elektr-kabellar', productsCount: 20 },
    ];
  }

  async findSupplierProducts(supplierId: string): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: { supplierId },
        include: { supplier: true, variants: true, category: true },
        orderBy: { createdAt: 'desc' },
      });
      return products.map((p) => this.mapPrismaProduct(p));
    } catch (err: any) {
      this.logger.warn(`Failed to fetch supplier products: ${err?.message}`);
      return this.defaultProducts.filter((p) => p.supplierId === supplierId);
    }
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
    actorUserId: string,
    userRole: string
  ): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Mahsulot topilmadi: ${id}`);
    }

    if (userRole !== 'ADMIN' && product.supplierId !== actorUserId) {
      throw new ForbiddenException('Siz ushbu mahsulotni tahrirlash huquqiga ega emassiz');
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.categoryId !== undefined) {
      const cat = await this.prisma.category.findFirst({
        where: { OR: [{ id: dto.categoryId }, { slug: dto.categoryId }] },
      });
      if (cat) data.categoryId = cat.id;
    }
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.unit !== undefined) data.unit = dto.unit;
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.minOrder !== undefined) data.minOrder = dto.minOrder;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.images !== undefined) data.images = dto.images;
    if (dto.hasDelivery !== undefined) data.hasDelivery = dto.hasDelivery;
    if (dto.region !== undefined) data.region = dto.region;
    if (dto.district !== undefined) data.district = dto.district;

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: { supplier: true, variants: true, category: true },
    });

    await this.auditLogService.logAction({
      actorId: actorUserId,
      action: 'PRODUCT_UPDATED',
      category: 'CATALOG',
      details: `Mahsulot yangilandi: ${updated.title} (${updated.id})`,
      level: 'INFO',
    });

    return this.mapPrismaProduct(updated);
  }

  async deleteProduct(
    id: string,
    actorUserId: string,
    userRole: string
  ): Promise<{ success: boolean; id: string }> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Mahsulot topilmadi: ${id}`);
    }

    if (userRole !== 'ADMIN' && product.supplierId !== actorUserId) {
      throw new ForbiddenException('Siz ushbu mahsulotni o‘chirish huquqiga ega emassiz');
    }

    await this.prisma.product.delete({ where: { id } });

    await this.auditLogService.logAction({
      actorId: actorUserId,
      action: 'PRODUCT_DELETED',
      category: 'CATALOG',
      details: `Mahsulot o‘chirildi: ${product.title} (${product.id})`,
      level: 'WARN',
    });

    return { success: true, id };
  }
}
