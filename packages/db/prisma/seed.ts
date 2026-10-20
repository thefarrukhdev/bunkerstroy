import { PrismaClient, Role, UserType, VerificationStatus, VehicleType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding BunkerStroy database with production-grade seed data...');

  // 1. Initial Verified Company
  const company = await prisma.company.upsert({
    where: { inn: '201122334' },
    update: {},
    create: {
      inn: '201122334',
      companyName: '«BUNKER STROY INVEST» MChJ',
      shortName: 'BUNKER STROY',
      status: 'ACTIVE',
      statusDescription: 'Faol soliq to‘lovchi yuridik shaxs',
      director: 'Jumayev Farrukh',
      address: 'Toshkent sh., Chilonzor tumani, Bunyodkor shox ko‘chasi, 42-uy',
      region: 'Toshkent shahri',
      district: 'Chilonzor tumani',
      registrationDate: new Date('2022-01-15'),
      activityType: 'Qurilish materiallari ulgurji savdosi va maxsus texnika logistikasi',
      vatPayer: true,
      verifiedAt: new Date()
    }
  });

  // 2. Initial Supplier Company
  await prisma.company.upsert({
    where: { inn: '305566778' },
    update: {},
    create: {
      inn: '305566778',
      companyName: '«TOSHKENT G\'ISHT VA SEMENT SERVIS» MChJ',
      shortName: 'TOSHKENT SEMENT SERVIS',
      status: 'ACTIVE',
      statusDescription: 'Faol soliq to‘lovchi yuridik shaxs',
      director: 'Qodirov Alisher',
      address: 'Toshkent vil., Zangiota tumani, Qoraqamish dahasi, 12-uy',
      region: 'Toshkent viloyati',
      district: 'Zangiota tumani',
      registrationDate: new Date('2021-06-20'),
      activityType: 'Qurilish materiallari ishlab chiqarish va ulgurji savdo',
      vatPayer: true,
      verifiedAt: new Date()
    }
  });

  // 3. Admin User
  const admin = await prisma.user.upsert({
    where: { phone: '+998901234567' },
    update: {},
    create: {
      phone: '+998901234567',
      email: 'admin@bunkerstroy.uz',
      passwordHash: '$2b$10$epJn7Q8w1gQ8fK0q1p0qseYhXkQ2g9q1.8M3Tq6s7f4q6z8u9w0x2', // demo hash
      displayName: 'Bunker Admin',
      firstName: 'Farrukh',
      lastName: 'Jumayev',
      role: Role.ADMIN,
      userType: UserType.LEGAL_ENTITY,
      verificationStatus: VerificationStatus.VERIFIED,
      inn: company.inn,
      companyName: company.companyName,
      region: 'Toshkent shahri',
      district: 'Chilonzor tumani',
      contractNumber: 'BS-ADMIN-001'
    }
  });

  // 4. Sample Verified Supplier
  const supplier = await prisma.user.upsert({
    where: { phone: '+998971112233' },
    update: {},
    create: {
      phone: '+998971112233',
      email: 'supplier@toshkentsement.uz',
      passwordHash: '$2b$10$epJn7Q8w1gQ8fK0q1p0qseYhXkQ2g9q1.8M3Tq6s7f4q6z8u9w0x2',
      displayName: 'Toshkent Sement Servis MChJ',
      firstName: 'Alisher',
      lastName: 'Qodirov',
      role: Role.SUPPLIER,
      userType: UserType.LEGAL_ENTITY,
      verificationStatus: VerificationStatus.VERIFIED,
      inn: '305566778',
      companyName: '«TOSHKENT G\'ISHT VA SEMENT SERVIS» MChJ',
      region: 'Toshkent viloyati',
      district: 'Zangiota tumani',
      contractNumber: 'BS-SUP-2026-08'
    }
  });

  // 4. Categories
  const categoriesData = [
    { name: 'Sement va qorishmalar', slug: 'sement-qorishmalar', icon: 'Layers' },
    { name: 'Armatura va metall prokat', slug: 'armatura-metall', icon: 'ShieldCheck' },
    { name: 'G‘isht va gazobloklar', slug: 'gisht-gazoblok', icon: 'Building2' },
    { name: 'Izolyatsiya va tom yopish', slug: 'izolyatsiya-tom', icon: 'Sparkles' },
    { name: 'Maxsus texnika va transport', slug: 'texnika-transport', icon: 'Truck' },
  ];

  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });

    // 5. Products in category
    if (cat.slug === 'sement-qorishmalar') {
      await prisma.product.upsert({
        where: { slug: 'sement-m500-d0-50kg' },
        update: {},
        create: {
          title: 'Sement M500 D0 (Qoraqamish zavodi, 50kg)',
          slug: 'sement-m500-d0-50kg',
          categoryId: createdCat.id,
          supplierId: supplier.id,
          price: 64000,
          unit: 'qop (50kg)',
          stock: 4500,
          minOrder: 20,
          energyEfficiencyRating: 'A',
          isEscoCertified: true,
          description: 'Yuqori sifatli M500 D0 markali portlandsement. GOST 31108 talablariga to‘liq javob beradi. Monolit va poydevor uchun mo‘ljallangan.',
          itemType: 'MATERIAL',
          repairType: 'UNIVERSAL',
          region: 'Toshkent viloyati',
          district: 'Zangiota tumani',
          images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'],
          warranty: 'Sertifikatlangan (6 oy)',
          hasDelivery: true,
          hasBonus: true,
          bonusDescription: '100 qopdan ortiq xaridda bepul tushirib berish'
        }
      });
    }

    if (cat.slug === 'armatura-metall') {
      await prisma.product.upsert({
        where: { slug: 'armatura-a500c-d14' },
        update: {},
        create: {
          title: 'Armatura A500C D14 (O‘zmetkombinat)',
          slug: 'armatura-a500c-d14',
          categoryId: createdCat.id,
          supplierId: supplier.id,
          price: 8900000,
          unit: 'tonna',
          stock: 120,
          minOrder: 1,
          energyEfficiencyRating: 'A++',
          isEscoCertified: false,
          description: 'Issiq prokatlangan armatura po‘lati A500C, diametri 14 mm. Seysmik mustahkam karkaslar va ko‘p qavatli binolar uchun.',
          itemType: 'MATERIAL',
          repairType: 'EXTERNAL',
          region: 'Toshkent shahri',
          district: 'Sergeli tumani',
          images: ['https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800'],
          warranty: 'Zavod sertifikati bilan',
          hasDelivery: true
        }
      });
    }

    if (cat.slug === 'izolyatsiya-tom') {
      await prisma.product.upsert({
        where: { slug: 'bazalt-plitasi-50mm' },
        update: {},
        create: {
          title: 'Bazalt Mineral Plitasi 50mm (Fasad izolyatsiya)',
          slug: 'bazalt-plitasi-50mm',
          categoryId: createdCat.id,
          supplierId: supplier.id,
          price: 38000,
          unit: 'm²',
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
          warranty: 'Kafolat 10 yil',
          hasDelivery: true,
          hasBonus: true,
          bonusDescription: '500 m² dan ortiq xaridda bepul yetkazish'
        }
      });
    }
  }

  // 6. Logistics Vehicles
  const vehicles = [
    {
      name: 'HOWO Sinotruk Samosval (25t)',
      type: VehicleType.DUMP_TRUCK_SAMOSVAL,
      plateNumber: '01 777 BSK',
      capacityTons: 25,
      basePrice: 450000,
      pricePerKm: 18000,
      isAvailable: true,
      driverName: 'Sherzod Baxtiyorov',
      driverPhone: '+998901114455',
      currentLocationName: 'Keles qum-shag‘al karyeri',
      imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800'
    },
    {
      name: 'ISUZU Forward Kran-Manipulyator (10t)',
      type: VehicleType.CRANE_MANIPULATOR,
      plateNumber: '01 888 BSK',
      capacityTons: 10,
      basePrice: 550000,
      pricePerKm: 16000,
      isAvailable: true,
      driverName: 'Dilshod Rahmatov',
      driverPhone: '+998935552211',
      currentLocationName: 'Toshkent sh., Bekto‘pi bozori',
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800'
    },
    {
      name: 'Shacman Beton Mikser (10 m³)',
      type: VehicleType.CONCRETE_MIXER,
      plateNumber: '01 999 BSK',
      capacityTons: 24,
      basePrice: 600000,
      pricePerKm: 22000,
      isAvailable: true,
      driverName: 'Ulug‘bek Rustamov',
      driverPhone: '+998943338877',
      currentLocationName: 'Sergeli RBU Zavodi №2',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'
    }
  ];

  for (const v of vehicles) {
    await prisma.logisticsVehicle.upsert({
      where: { plateNumber: v.plateNumber },
      update: {},
      create: v
    });
  }

  console.log('✅ Seed data successfully created!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
