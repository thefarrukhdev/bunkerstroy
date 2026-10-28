import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { OrdersService } from '../src/modules/orders/orders.service';
import { OrdersController } from '../src/modules/orders/orders.controller';
import { LogisticsService } from '../src/modules/logistics/logistics.service';
import { CatalogService } from '../src/modules/catalog/catalog.service';
import { RedisService } from '../src/redis/redis.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role, OrderStatus, PaymentMode, UserType } from '@bunkerstroy/db';

async function runDomainAndLogisticsVerification() {
  console.log('🚀 Running Domain & Logistics Dedicated Verification Tests...');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  const prisma = app.get(PrismaService);
  const redis = app.get(RedisService);
  const ordersService = app.get(OrdersService);
  const ordersController = app.get(OrdersController);
  const logisticsService = app.get(LogisticsService);
  const catalogService = app.get(CatalogService);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  const testPhone = '+998908889977';
  let buyerUser: any;
  let strangerUser: any;
  let supplierUser: any;
  let driverUser: any;
  let adminUser: any;
  let testProduct: any;
  let createdOrderId: string | null = null;
  let dispatchId: string | null = null;

  try {
    // Setup test users
    buyerUser = await prisma.user.upsert({
      where: { phone: testPhone },
      update: { isAllowedSplitPayment: true },
      create: {
        phone: testPhone,
        displayName: 'Domain Buyer',
        role: Role.CLIENT,
        userType: UserType.LEGAL_ENTITY,
        isAllowedSplitPayment: true,
        passwordHash: '$2b$10$temporaryGuestOrderPasswordHashBunker2026',
      },
    });

    strangerUser = await prisma.user.upsert({
      where: { phone: '+998908889966' },
      update: {},
      create: {
        phone: '+998908889966',
        displayName: 'Stranger User',
        role: Role.CLIENT,
        userType: UserType.INDIVIDUAL,
        passwordHash: '$2b$10$temporaryGuestOrderPasswordHashBunker2026',
      },
    });

    supplierUser = await prisma.user.findFirst({ where: { role: Role.SUPPLIER } });
    if (!supplierUser) {
      supplierUser = await prisma.user.create({
        data: {
          phone: '+998908889955',
          displayName: 'Test Supplier',
          role: Role.SUPPLIER,
          userType: UserType.LEGAL_ENTITY,
          passwordHash: '$2b$10$temporaryGuestOrderPasswordHashBunker2026',
        },
      });
    }

    driverUser = await prisma.user.findFirst({ where: { role: Role.LOGISTICS_DRIVER } });
    if (!driverUser) {
      driverUser = await prisma.user.create({
        data: {
          phone: '+998908889944',
          displayName: 'Test Driver',
          role: Role.LOGISTICS_DRIVER,
          userType: UserType.INDIVIDUAL,
          passwordHash: '$2b$10$temporaryGuestOrderPasswordHashBunker2026',
        },
      });
    }

    adminUser = await prisma.user.findFirst({ where: { role: Role.ADMIN } });

    // Setup test product
    testProduct = await catalogService.createProduct(
      {
        title: 'Domain Test Armatura A500C 12mm',
        categoryId: 'cat-metall',
        price: 9500,
        stock: 1000,
        minOrder: 1,
        unit: 'metr',
        description: 'Test armatura',
      },
      supplierUser.id
    );

    console.log('\n--- 1. Testing Ghost Items Bug & Collision-free Order Number ---');
    const orderPayload = {
      items: [{ productId: testProduct.id, quantity: 20 }],
      deliveryAddress: {
        region: 'Toshkent shahri',
        district: 'Yunusobod tumani',
        street: 'Amir Temur shoh ko‘chasi, 107-uy',
      },
      buyerPhone: testPhone,
      buyerName: 'Domain Buyer',
      paymentMode: PaymentMode.SPLIT_50_50,
    };

    const newOrder = await ordersService.createOrder(orderPayload, {
      id: buyerUser.id,
      role: Role.CLIENT,
    });
    createdOrderId = newOrder.id;

    assert(
      /^BS-[0-9A-Z]+-\d{4,5}$/.test(newOrder.orderNumber),
      `Order number is collision-free and follows format BS-{timestampBase36}-{randomInt}: ${newOrder.orderNumber}`
    );

    assert(
      Array.isArray(newOrder.subOrders) && newOrder.subOrders.length === 1,
      'SubOrder created for supplier'
    );

    const subOrder = newOrder.subOrders[0];
    assert(
      Array.isArray(subOrder.items) &&
      subOrder.items.length === 1 &&
      subOrder.items[0].productId === testProduct.id &&
      subOrder.items[0].subOrderId === subOrder.id,
      'GHOST ITEMS BUG FIXED: SubOrder contains all associated OrderItems with matching subOrderId'
    );

    console.log('\n--- 2. Testing CRITICAL DATA LEAK Prevention on acceptanceCode ---');
    // Initially code is not revealed
    assert(newOrder.acceptanceCode === null, 'Initial order acceptanceCode is null');
    assert(
      subOrder.acceptanceCode === null || subOrder.acceptanceCode === undefined,
      'Initial subOrder acceptanceCode is null'
    );

    // Pay second half as buyer -> reveals code
    const fullyPaidOrder = await ordersService.paySecondHalf(newOrder.id, {
      id: buyerUser.id,
      role: Role.CLIENT,
    });
    assert(fullyPaidOrder.isAcceptanceCodeRevealed === true, 'Order isAcceptanceCodeRevealed is true');

    const dbOrder = await prisma.order.findUniqueOrThrow({ where: { id: newOrder.id } });
    assert(
      typeof dbOrder.acceptanceCode === 'string' && /^\d{4}$/.test(dbOrder.acceptanceCode),
      `Acceptance code is secure 4-digit PIN in DB (${dbOrder.acceptanceCode})`
    );

    // Buyer sees revealed acceptanceCode
    const buyerView = await ordersService.findOne(newOrder.id, {
      id: buyerUser.id,
      role: Role.CLIENT,
    });
    assert(
      buyerView.acceptanceCode === dbOrder.acceptanceCode &&
      buyerView.subOrders[0].acceptanceCode === dbOrder.acceptanceCode,
      'Buyer CAN see acceptanceCode when revealed'
    );

    // Admin sees revealed acceptanceCode
    const adminView = await ordersService.findOne(newOrder.id, {
      id: adminUser.id,
      role: Role.ADMIN,
    });
    assert(
      adminView.acceptanceCode === dbOrder.acceptanceCode &&
      adminView.subOrders[0].acceptanceCode === dbOrder.acceptanceCode,
      'ADMIN CAN see acceptanceCode when revealed'
    );

    // Supplier CANNOT see acceptanceCode even when revealed
    const supplierView = await ordersService.findOne(newOrder.id, {
      id: supplierUser.id,
      role: Role.SUPPLIER,
    });
    assert(
      supplierView.acceptanceCode === null &&
      (supplierView.subOrders[0].acceptanceCode === null || supplierView.subOrders[0].acceptanceCode === undefined),
      'CRITICAL: Supplier CANNOT see acceptanceCode on order or subOrders'
    );

    // Driver CANNOT see acceptanceCode even when revealed
    await prisma.subOrder.updateMany({
      where: { orderId: newOrder.id },
      data: { driverId: driverUser.id },
    });
    const driverView = await ordersService.findOne(newOrder.id, {
      id: driverUser.id,
      role: Role.LOGISTICS_DRIVER,
    });
    assert(
      driverView.acceptanceCode === null &&
      (driverView.subOrders[0].acceptanceCode === null || driverView.subOrders[0].acceptanceCode === undefined),
      'CRITICAL: Driver CANNOT see acceptanceCode on order or subOrders'
    );

    console.log('\n--- 3. Testing paySecondHalf IDOR Prevention ---');
    // Create another split order for IDOR test
    const idorOrder = await ordersService.createOrder(orderPayload, {
      id: buyerUser.id,
      role: Role.CLIENT,
    });

    let strangerPayCaught = false;
    try {
      await ordersService.paySecondHalf(idorOrder.id, {
        id: strangerUser.id,
        role: Role.CLIENT,
      });
    } catch (e: any) {
      if (e.status === 403 || e.message?.includes('Faqat buyurtmachi')) {
        strangerPayCaught = true;
      }
    }
    assert(strangerPayCaught, 'SECURITY: Stranger cannot paySecondHalf on another user order (IDOR protected)');

    console.log('\n--- 4. Testing openDispute IDOR Prevention ---');
    let strangerDisputeCaught = false;
    try {
      await ordersService.openDispute(
        idorOrder.id,
        { reason: 'Malicious dispute attempt' },
        { id: strangerUser.id, role: Role.CLIENT }
      );
    } catch (e: any) {
      if (e.status === 403 || e.message?.includes('Faqat buyurtmachi')) {
        strangerDisputeCaught = true;
      }
    }
    assert(strangerDisputeCaught, 'SECURITY: Stranger cannot openDispute on another user order (IDOR protected)');

    // Buyer can open dispute
    const validDispute = await ordersService.openDispute(
      idorOrder.id,
      { reason: 'Material sifati talabga javob bermadi', evidenceUrls: ['https://bunkerstroy.uz/proof.jpg'] },
      { id: buyerUser.id, role: Role.CLIENT }
    );
    assert(validDispute.status === 'OPEN', 'Buyer can legitimately open dispute');

    console.log('\n--- 5. Testing PIN Brute-force Lockout in verifyAcceptanceCode ---');
    const lockKey = `pin_failed_attempts:${newOrder.id}`;
    await redis.del(lockKey);

    // 4 wrong attempts
    for (let i = 1; i <= 4; i++) {
      let rejected = false;
      try {
        await ordersService.verifyAcceptanceCode(newOrder.id, { code: '0000' });
      } catch (e: any) {
        if (e.message?.includes('noto‘g‘ri')) {
          rejected = true;
        }
      }
      assert(rejected, `Wrong attempt ${i}/5 rejected`);
    }

    // 5th wrong attempt triggers 15-min lockout
    let fifthLocked = false;
    try {
      await ordersService.verifyAcceptanceCode(newOrder.id, { code: '0000' });
    } catch (e: any) {
      if (e.message?.includes('bloklandi')) {
        fifthLocked = true;
      }
    }
    assert(fifthLocked, '5th consecutive wrong attempt locks order for 15 minutes');

    // 6th attempt is blocked immediately by lockout
    let subsequentBlocked = false;
    try {
      await ordersService.verifyAcceptanceCode(newOrder.id, { code: dbOrder.acceptanceCode });
    } catch (e: any) {
      if (e.message?.includes('bloklandi')) {
        subsequentBlocked = true;
      }
    }
    assert(subsequentBlocked, 'Subsequent attempts blocked by 15-minute lockout even with correct PIN');

    // Clear lockout and verify successful PIN releases counter
    await redis.del(lockKey);
    const verifiedOrder = await ordersService.verifyAcceptanceCode(newOrder.id, {
      code: dbOrder.acceptanceCode,
    });
    assert(verifiedOrder.status === 'COMPLETED', 'Successful PIN verification completes order');
    const attemptsAfterVerify = await redis.get(lockKey);
    assert(attemptsAfterVerify === null, 'Redis failed attempts counter cleared upon success');

    console.log('\n--- 6. Testing Pagination in findAll ---');
    const paged1 = await ordersService.findAll({ id: adminUser.id, role: Role.ADMIN }, 1, 2);
    assert(paged1.length <= 2, `findAll(page=1, limit=2) returns <= 2 items (Got: ${paged1.length})`);

    const pagedController = await ordersController.findAll(
      { id: adminUser.id, role: Role.ADMIN },
      '1',
      '2'
    );
    assert(
      pagedController.success === true && pagedController.data.length <= 2,
      'OrdersController.findAll handles query page and limit parameters'
    );

    console.log('\n--- 7. Testing Logistics Vehicle Availability Lifecycle ---');
    const vehicles = await logisticsService.getVehicles();
    assert(vehicles.length > 0, 'Logistics vehicles available');
    const testVeh = vehicles[0];

    // Ensure vehicle is currently available
    await prisma.logisticsVehicle.update({
      where: { id: testVeh.id },
      data: { isAvailable: true },
    });

    const dispatchRes = await logisticsService.dispatchOrder({
      orderId: idorOrder.id,
      vehicleId: testVeh.id,
      origin: 'Keles',
      destination: 'Toshkent sh., Yunusobod',
      distanceKm: 20,
    });
    dispatchId = dispatchRes.id;

    const vehAfterDispatch = await prisma.logisticsVehicle.findUnique({
      where: { id: testVeh.id },
    });
    assert(vehAfterDispatch?.isAvailable === false, 'Vehicle marked isAvailable: false upon dispatchOrder');

    // Delivery completion sets vehicle isAvailable: true
    await logisticsService.updateDispatchStatus(dispatchRes.id, 'DELIVERED', {
      id: adminUser.id,
      role: Role.ADMIN,
    });

    const vehAfterDelivery = await prisma.logisticsVehicle.findUnique({
      where: { id: testVeh.id },
    });
    assert(vehAfterDelivery?.isAvailable === true, 'Vehicle restored to isAvailable: true upon DELIVERED');

    // Clean up created test data
    await prisma.dispute.deleteMany({ where: { orderId: { in: [newOrder.id, idorOrder.id] } } });
    await prisma.logisticsDispatch.deleteMany({ where: { orderId: { in: [newOrder.id, idorOrder.id] } } });
    await prisma.paymentTransaction.deleteMany({ where: { orderId: { in: [newOrder.id, idorOrder.id] } } });
    await prisma.orderItem.deleteMany({ where: { orderId: { in: [newOrder.id, idorOrder.id] } } });
    await prisma.subOrder.deleteMany({ where: { orderId: { in: [newOrder.id, idorOrder.id] } } });
    await prisma.order.deleteMany({ where: { id: { in: [newOrder.id, idorOrder.id] } } });
    await prisma.product.deleteMany({ where: { id: testProduct.id } });
    await prisma.user.deleteMany({ where: { phone: { in: [testPhone, '+998908889966'] } } });

    console.log('\n========================================');
    console.log(`DOMAIN & LOGISTICS TESTS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log('========================================\n');

    await app.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal error in domain verification:', err);
    await app.close();
    process.exit(1);
  }
}

runDomainAndLogisticsVerification();
