import {
  PrismaClient,
  Role,
  UserType,
  VerificationStatus,
  VehicleType,
  OrderStatus,
  PaymentMode,
  PaymentProvider,
  PaymentStatus,
  SupplierType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding BunkerStroy Enterprise database with production-grade data...');

  // ==========================================
  // 1. Initial Verified Companies (STIR/INN)
  // ==========================================
  const bunkerCompany = await prisma.company.upsert({
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
      verifiedAt: new Date(),
    },
  });

  const localSupplierCompany = await prisma.company.upsert({
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
      verifiedAt: new Date(),
    },
  });

  const globalSupplierCompany = await prisma.company.upsert({
    where: { inn: '998877665' },
    update: {},
    create: {
      inn: '998877665',
      companyName: '«URAL METALLURGY EXPORT» OOO (Katta Zavod)',
      shortName: 'URAL STEEL GLOBAL',
      status: 'ACTIVE',
      statusDescription: 'Xorijiy ishlab chiqaruvchi va eksportyor zavod',
      director: 'Kuznetsov Ivan',
      address: 'Rossiya Federatsiyasi, Chelyabinsk viloyati, Magnitogorsk sh., Kirova 1',
      region: 'Xorijiy davlat / Rossiya',
      district: 'Magnitogorsk',
      registrationDate: new Date('2018-04-10'),
      activityType: 'Metall prokat va armatura ulgurji eksporti (Vagon / Fura)',
      vatPayer: false,
      verifiedAt: new Date(),
    },
  });

  const b2bClientCompany = await prisma.company.upsert({
    where: { inn: '308991122' },
    update: {},
    create: {
      inn: '308991122',
      companyName: '«MURAD BUILDINGS CONSTRUCTION» MChJ',
      shortName: 'MURAD BUILDINGS',
      status: 'ACTIVE',
      statusDescription: 'Yirik qurilish-development korxonasi',
      director: 'Nazarov Murad',
      address: 'Toshkent sh., Shayxontohur tumani, Navoiy ko‘chasi, 1A-bino (Toshkent City)',
      region: 'Toshkent shahri',
      district: 'Shayxontohur tumani',
      registrationDate: new Date('2019-09-01'),
      activityType: 'Turar-joy va biznes markazlar qurilishi',
      vatPayer: true,
      verifiedAt: new Date(),
    },
  });

  // Password hash for demo users (bunker2026):
  const passwordHash = '$2b$10$QMuFb4NAWpyS6py7d9RDTeoPCyhR9.2OvmEktUMhwb12rtc5jmLBS';

  // ==========================================
  // 2. Platform Users (All 5 Roles)
  // ==========================================
  // 1. SuperAdmin
  await prisma.user.upsert({
    where: { phone: '+998901234567' },
    update: {},
    create: {
      phone: '+998901234567',
      email: 'admin@bunkerstroy.uz',
      passwordHash,
      displayName: 'Bunker SuperAdmin',
      firstName: 'Farrukh',
      lastName: 'Jumayev',
      role: Role.ADMIN,
      userType: UserType.LEGAL_ENTITY,
      verificationStatus: VerificationStatus.VERIFIED,
      inn: bunkerCompany.inn,
      companyName: bunkerCompany.companyName,
      region: 'Toshkent shahri',
      district: 'Chilonzor tumani',
      contractNumber: 'BS-ADMIN-001',
    },
  });

  // 2. Local Supplier
  const localSupplier = await prisma.user.upsert({
    where: { phone: '+998971112233' },
    update: { supplierType: SupplierType.LOCAL },
    create: {
      phone: '+998971112233',
      email: 'supplier@toshkentsement.uz',
      passwordHash,
      displayName: 'Toshkent Sement Servis MChJ',
      firstName: 'Alisher',
      lastName: 'Qodirov',
      role: Role.SUPPLIER,
      supplierType: SupplierType.LOCAL,
      userType: UserType.LEGAL_ENTITY,
      verificationStatus: VerificationStatus.VERIFIED,
      inn: localSupplierCompany.inn,
      companyName: localSupplierCompany.companyName,
      region: 'Toshkent viloyati',
      district: 'Zangiota tumani',
      contractNumber: 'BS-SUP-LOCAL-01',
    },
  });

  // 3. Global Supplier (Large Factory)
  const globalSupplier = await prisma.user.upsert({
    where: { phone: '+998982223344' },
    update: { supplierType: SupplierType.GLOBAL },
    create: {
      phone: '+998982223344',
      email: 'export@uralsteel.ru',
      passwordHash,
      displayName: 'Ural Metallurgy Export (Global Zavod)',
      firstName: 'Ivan',
      lastName: 'Kuznetsov',
      role: Role.SUPPLIER,
      supplierType: SupplierType.GLOBAL,
      userType: UserType.LEGAL_ENTITY,
      verificationStatus: VerificationStatus.VERIFIED,
      inn: globalSupplierCompany.inn,
      companyName: globalSupplierCompany.companyName,
      region: 'Xorijiy davlat / Rossiya',
      district: 'Magnitogorsk',
      contractNumber: 'BS-GLOBAL-IMP-09',
    },
  });

  // 4. Logistics Driver
  const driver = await prisma.user.upsert({
    where: { phone: '+998901114455' },
    update: {},
    create: {
      phone: '+998901114455',
      email: 'driver.sherzod@bunkerstroy.uz',
      passwordHash,
      displayName: 'Sherzod Baxtiyorov (HOWO Haydovchi)',
      firstName: 'Sherzod',
      lastName: 'Baxtiyorov',
      role: Role.LOGISTICS_DRIVER,
      userType: UserType.INDIVIDUAL,
      verificationStatus: VerificationStatus.VERIFIED,
      region: 'Toshkent shahri',
      district: 'Keles',
    },
  });

  // 5. B2B Verified Client (with 50/50 payment split permission)
  const b2bClient = await prisma.user.upsert({
    where: { phone: '+998909876543' },
    update: { isAllowedSplitPayment: true },
    create: {
      phone: '+998909876543',
      email: 'procurement@muradbuildings.uz',
      passwordHash,
      displayName: 'Murad Buildings Procurement',
      firstName: 'Murad',
      lastName: 'Nazarov',
      role: Role.CLIENT,
      userType: UserType.LEGAL_ENTITY,
      verificationStatus: VerificationStatus.VERIFIED,
      isAllowedSplitPayment: true,
      inn: b2bClientCompany.inn,
      companyName: b2bClientCompany.companyName,
      region: 'Toshkent shahri',
      district: 'Shayxontohur tumani',
      contractNumber: 'BS-B2B-MB-2026',
    },
  });

  // ==========================================
  // 3. Product Categories
  // ==========================================
  const categoriesData = [
    { name: 'Sement va qorishmalar', slug: 'sement-qorishmalar', icon: 'Layers' },
    { name: 'Armatura va metall prokat', slug: 'armatura-metall', icon: 'ShieldCheck' },
    { name: 'G‘isht va gazobloklar', slug: 'gisht-gazoblok', icon: 'Building2' },
    { name: 'Izolyatsiya va tom yopish', slug: 'izolyatsiya-tom', icon: 'Sparkles' },
    { name: 'Yog‘och va taxta materiallari', slug: 'yogoch-taxta', icon: 'Box' },
    { name: 'Maxsus texnika va transport', slug: 'texnika-transport', icon: 'Truck' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }

  // ==========================================
  // 4. Products with Volume Tiered Pricing
  // ==========================================
  // Product 1: Sement M500 (Local Supplier)
  const sementProd = await prisma.product.upsert({
    where: { slug: 'sement-m500-d0-50kg' },
    update: {},
    create: {
      title: 'Sement M500 D0 (Qoraqamish zavodi, 50kg)',
      slug: 'sement-m500-d0-50kg',
      categoryId: categoryMap.get('sement-qorishmalar')!,
      supplierId: localSupplier.id,
      price: 64000,
      unit: 'qop (50kg)',
      stock: 4500,
      minOrder: 10,
      energyEfficiencyRating: 'A',
      isEscoCertified: true,
      description: 'Yuqori sifatli M500 D0 markali portlandsement. GOST 31108 talablariga to‘liq javob beradi. Monolit va poydevor uchun mo‘ljallangan.',
      itemType: 'MATERIAL',
      repairType: 'UNIVERSAL',
      region: 'Toshkent viloyati',
      district: 'Zangiota tumani',
      images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'],
      warranty: 'O‘zDSt 31108:2020 sertifikati (6 oy)',
      certificateUrl: 'https://standart.uz/cert/UZ-SMT-2026-991',
      hasDelivery: true,
      hasBonus: true,
      bonusDescription: '100 qopdan ortiq xaridda bepul tushirib berish',
    },
  });

  // Add Tiered Prices for Sement
  await prisma.productTieredPrice.deleteMany({ where: { productId: sementProd.id } });
  await prisma.productTieredPrice.createMany({
    data: [
      { productId: sementProd.id, minQty: 20, maxQty: 99, price: 60000 },
      { productId: sementProd.id, minQty: 100, maxQty: null, price: 56000 },
    ],
  });

  // Product 2: Armatura A500C D14 (Local Supplier)
  const armaturaProd = await prisma.product.upsert({
    where: { slug: 'armatura-a500c-d14' },
    update: {},
    create: {
      title: 'Armatura A500C D14 (O‘zmetkombinat)',
      slug: 'armatura-a500c-d14',
      categoryId: categoryMap.get('armatura-metall')!,
      supplierId: localSupplier.id,
      price: 8900000,
      unit: 'tonna',
      stock: 350,
      minOrder: 1,
      energyEfficiencyRating: 'A++',
      isEscoCertified: false,
      description: 'Issiq prokatlangan armatura po‘lati A500C, diametri 14 mm. Seysmik mustahkam karkaslar va ko‘p qavatli binolar uchun.',
      itemType: 'MATERIAL',
      repairType: 'EXTERNAL',
      region: 'Toshkent shahri',
      district: 'Sergeli tumani',
      images: ['https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800'],
      warranty: 'Zavod GOST 34028 pasporti',
      hasDelivery: true,
    },
  });

  await prisma.productTieredPrice.deleteMany({ where: { productId: armaturaProd.id } });
  await prisma.productTieredPrice.createMany({
    data: [
      { productId: armaturaProd.id, minQty: 5, maxQty: 19, price: 8500000 },
      { productId: armaturaProd.id, minQty: 20, maxQty: null, price: 8100000 },
    ],
  });

  // Product 3: Shveller Po'lat 20P (Global Supplier - Factory Import)
  const globalShvellerProd = await prisma.product.upsert({
    where: { slug: 'shveller-polat-20p-ural' },
    update: {},
    create: {
      title: 'Issiq Prokat Shveller 20P (Ural Zavod Importi)',
      slug: 'shveller-polat-20p-ural',
      categoryId: categoryMap.get('armatura-metall')!,
      supplierId: globalSupplier.id,
      price: 7800000,
      unit: 'tonna',
      stock: 1200,
      minOrder: 60, // 1 Vagon MOQ
      energyEfficiencyRating: 'STANDARD',
      isEscoCertified: false,
      description: 'GOST 8240-97 po‘lat shveller 20P. To‘g‘ridan-to‘g‘ri temir yo‘l vagonlarida yetkazib beriladi (DAP / CIP Toshkent stansiyasi).',
      itemType: 'MATERIAL',
      repairType: 'EXTERNAL',
      region: 'Xorijiy davlat / Rossiya',
      district: 'Magnitogorsk',
      images: ['https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800'],
      warranty: 'Bojxona deklaratsiyasi (GTD) va xalqaro sifat sertifikati',
      certificateUrl: 'https://gtd.customs.uz/decl/2026-URAL-001',
      hasDelivery: true,
    },
  });

  await prisma.productTieredPrice.deleteMany({ where: { productId: globalShvellerProd.id } });
  await prisma.productTieredPrice.createMany({
    data: [
      { productId: globalShvellerProd.id, minQty: 120, maxQty: 299, price: 7500000 },
      { productId: globalShvellerProd.id, minQty: 300, maxQty: null, price: 7200000 },
    ],
  });

  // ==========================================
  // 5. Logistics Vehicles
  // ==========================================
  const howoVehicle = await prisma.logisticsVehicle.upsert({
    where: { plateNumber: '01 777 BSK' },
    update: { isAvailable: false },
    create: {
      name: 'HOWO Sinotruk Samosval (25t)',
      type: VehicleType.DUMP_TRUCK_SAMOSVAL,
      plateNumber: '01 777 BSK',
      capacityTons: 25,
      basePrice: 450000,
      pricePerKm: 18000,
      isAvailable: false,
      driverName: driver.displayName,
      driverPhone: driver.phone,
      currentLocationName: 'Toshkent sh., Yunusobod 12-mavze',
      imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800',
    },
  });

  await prisma.logisticsVehicle.upsert({
    where: { plateNumber: '01 888 BSK' },
    update: {},
    create: {
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
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800',
    },
  });

  await prisma.logisticsVehicle.upsert({
    where: { plateNumber: '01 999 BSK' },
    update: {},
    create: {
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
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    },
  });

  // ==========================================
  // 6. Partner Integrations (TZ-5: AD-07)
  // ==========================================
  const partnersList = [
    {
      code: 'PAYME',
      name: 'Payme JSON-RPC 2.0 Shlyuzi',
      provider: 'Paycom LLC',
      status: 'OPERATIONAL',
      contractEnd: new Date('2027-12-31'),
      lastSyncAt: new Date(),
      errorCount: 0,
      details: { mode: 'Production', timeoutMs: 3000 },
    },
    {
      code: 'CLICK',
      name: 'Click Merchant API',
      provider: 'Click LLC',
      status: 'OPERATIONAL',
      contractEnd: new Date('2027-10-31'),
      lastSyncAt: new Date(),
      errorCount: 0,
      details: { mode: 'MD5 Hash Signature' },
    },
    {
      code: 'ESCROW_BANK',
      name: 'BunkerStroy Escrow Maxsus Hisobi (23120)',
      provider: 'O‘zsanoatqurilishbank ATB (SQB)',
      status: 'OPERATIONAL',
      contractEnd: new Date('2028-06-30'),
      lastSyncAt: new Date(),
      errorCount: 0,
      details: { accountType: '23120 Escrow Account', currency: 'UZS' },
    },
    {
      code: 'E_IMZO',
      name: 'E-IMZO Davlat PKCS#7 Shlyuzi',
      provider: 'O‘zbekiston DSI / E-IMZO',
      status: 'OPERATIONAL',
      contractEnd: new Date('2027-01-01'),
      lastSyncAt: new Date(),
      errorCount: 0,
      details: { version: 'v2.0' },
    },
    {
      code: 'ESKIZ_SMS',
      name: 'Eskiz.uz Tranzaksion SMS Shlyuzi',
      provider: 'Eskiz SMS LLC',
      status: 'OPERATIONAL',
      contractEnd: new Date('2027-04-15'),
      lastSyncAt: new Date(),
      errorCount: 0,
      details: { senderName: 'BUNKERSTROY' },
    },
    {
      code: 'GPS_TRACKER',
      name: 'Logistika GPS va Telemetriya Serveri',
      provider: 'BunkerStroy Telematics Service',
      status: 'OPERATIONAL',
      contractEnd: new Date('2027-12-31'),
      lastSyncAt: new Date(),
      errorCount: 0,
      details: { pingIntervalSec: 15 },
    },
  ];

  for (const p of partnersList) {
    await prisma.partnerIntegration.upsert({
      where: { code: p.code },
      update: { status: p.status, lastSyncAt: p.lastSyncAt },
      create: p,
    });
  }

  // ==========================================
  // 7. Seed Active 50/50 Order in ARRIVED state
  // ==========================================
  const activeOrderNum = 'BS-781290';
  const existingActive = await prisma.order.findUnique({ where: { orderNumber: activeOrderNum } });
  if (!existingActive) {
    const totalAmount = 5600000; // 100 qop * 56,000 UZS (2nd tier)
    const deliveryFee = 150000;
    const finalAmount = totalAmount + deliveryFee;
    const firstPaymentAmount = Math.round(finalAmount / 2);
    const secondPaymentAmount = finalAmount - firstPaymentAmount;

    const arrivedOrder = await prisma.order.create({
      data: {
        orderNumber: activeOrderNum,
        buyerId: b2bClient.id,
        status: OrderStatus.ARRIVED,
        paymentMode: PaymentMode.SPLIT_50_50,
        totalAmount,
        deliveryFee,
        discountAmount: 800000, // saved via tiered ladder
        finalAmount,
        firstPaymentAmount,
        secondPaymentAmount,
        isFirstPaid: true,
        isSecondPaid: false,
        acceptanceCode: '4821', // Secret 4-digit code
        isAcceptanceCodeRevealed: false,
        arrivedAt: new Date(),
        waitingDeadline: new Date(Date.now() + 25 * 60 * 1000), // 25 mins remaining
        deliveryRegion: 'Toshkent shahri',
        deliveryDistrict: 'Yunusobod tumani',
        deliveryStreet: '12-mavze, 45-uchastka',
        deliveryLandmark: 'Megaplanet orqasidagi kottej majmuasi',
        vehicleType: 'HOWO Sinotruk Samosval (25t)',
        items: {
          create: [
            {
              productId: sementProd.id,
              quantity: 100,
              unit: 'qop (50kg)',
              unitPrice: 56000,
              totalPrice: totalAmount,
            },
          ],
        },
        subOrders: {
          create: [
            {
              supplierId: localSupplier.id,
              status: OrderStatus.ARRIVED,
              subTotal: totalAmount,
              deliveryFee,
              acceptanceCode: '4821',
              arrivedAt: new Date(),
              driverId: driver.id,
            },
          ],
        },
        payments: {
          create: [
            {
              provider: PaymentProvider.PAYME,
              paymentType: 'FIRST_50',
              transactionId: `TX-${activeOrderNum}-P1`,
              amount: firstPaymentAmount,
              status: PaymentStatus.PAID,
              qrReceiptUrl: 'https://bunkerstroy.uz/receipt/bs-781290-p1',
            },
          ],
        },
      },
    });

    // Create Dispatch for driver
    await prisma.logisticsDispatch.create({
      data: {
        orderId: arrivedOrder.id,
        vehicleId: howoVehicle.id,
        driverId: driver.id,
        status: 'ARRIVED',
        origin: 'Qoraqamish sement ombori, Zangiota tumani',
        destination: 'Toshkent sh., Yunusobod 12-mavze',
        distanceKm: 28,
        totalCost: 150000,
        dispatchedAt: new Date(Date.now() - 45 * 60 * 1000),
        arrivedAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    });

    console.log(`✅ Seeded active 50/50 order (${activeOrderNum}) with 30-min waiting timer and driver dispatch.`);
  }

  console.log('🎉 Database seeding completed successfully with 5-cabinet enterprise data!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
