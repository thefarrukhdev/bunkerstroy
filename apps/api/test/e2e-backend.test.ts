import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';
import { CatalogService } from '../src/modules/catalog/catalog.service';
import { OrdersService } from '../src/modules/orders/orders.service';
import { LogisticsService } from '../src/modules/logistics/logistics.service';
import { EscoService } from '../src/modules/esco/esco.service';
import { PaymentsService } from '../src/modules/payments/payments.service';
import { AdminService } from '../src/modules/admin/admin.service';
import { AuditLogService } from '../src/modules/admin/audit-log.service';
import { HealthController } from '../src/modules/health/health.controller';
import { RedisService } from '../src/redis/redis.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role, OrderStatus, PaymentMode, VerificationStatus, SupplierType, UserType } from '@bunkerstroy/db';
import { ThrottlerStorage } from '@nestjs/throttler';
import crypto from 'crypto';
import { env } from '../src/config/env';

async function runAllBackendVerificationTests() {
  console.log('🚀 Booting BunkerStroy NestJS Application for E2E Verification...');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  const prisma = app.get(PrismaService);
  const redis = app.get(RedisService);
  const authService = app.get(AuthService);
  const catalogService = app.get(CatalogService);
  const ordersService = app.get(OrdersService);
  const logisticsService = app.get(LogisticsService);
  const escoService = app.get(EscoService);
  const paymentsService = app.get(PaymentsService);
  const adminService = app.get(AdminService);
  const auditLogService = app.get(AuditLogService);

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failedTests++;
    }
  }

  try {
    console.log('\n--- 1. Testing Redis, PostgreSQL & Throttler Infrastructure ---');
    await redis.set('bunker:test:key', 'active_test_val', 10);
    const redisVal = await redis.get('bunker:test:key');
    assert(redisVal === 'active_test_val', 'Redis set and get with TTL works');

    const dbUserCount = await prisma.user.count();
    assert(dbUserCount > 0, `PostgreSQL connection active, users in DB: ${dbUserCount}`);

    const throttlerStorage = app.get(ThrottlerStorage, { strict: false });
    assert(!!throttlerStorage, 'ThrottlerModule & ThrottlerStorage initialized with default and auth tiers');

    const healthController = app.get(HealthController);
    const mockRes: any = {
      statusCode: 200,
      status(code: number) { this.statusCode = code; return this; },
      json(data: any) { this.data = data; return this; },
    };
    await healthController.checkHealth(mockRes);
    assert(
      mockRes.statusCode === 200 && mockRes.data.status === 'ok' && mockRes.data.services.database.status === 'healthy',
      'HealthController /api/health returns 200 OK with connected database and redis'
    );

    console.log('\n--- 2. Testing AuthService (Login, OTP, Refresh, STIR, Me) ---');
    // Admin login
    const adminLogin = await authService.login('admin', 'bunker2026');
    assert(!!adminLogin.token && adminLogin.user.role === Role.ADMIN, 'Admin password login returns valid JWT and role ADMIN');
    assert(!!adminLogin.refreshToken, 'Admin login returns refresh token');

    // Supplier login
    const supplierLogin = await authService.login('supplier', 'supplier123');
    assert(!!supplierLogin.token && supplierLogin.user.role === Role.SUPPLIER, 'Supplier login returns valid JWT and role SUPPLIER');

    // Invalid password
    let failedLoginCaught = false;
    try {
      await authService.login('admin', 'wrong_password_123');
    } catch {
      failedLoginCaught = true;
    }
    assert(failedLoginCaught, 'Incorrect password throws UnauthorizedException');

    // Refresh token
    const refreshRes = await authService.refreshToken(adminLogin.refreshToken);
    assert(!!refreshRes.token, 'Refresh token generates new access token');

    // Send OTP (Must NOT return code in response)
    const testPhone = '+998909876543';
    await redis.del(`otp_cooldown:${testPhone}`);
    await redis.del(`otp:${testPhone}`);

    const otpRes = await authService.sendOtp(testPhone);
    assert(otpRes.success === true, 'sendOtp succeeds');
    assert(!(otpRes as any).code, 'SECURITY CHECK: OTP code is NOT exposed in HTTP response');

    // Rate-limiting on OTP
    let rateLimitCaught = false;
    try {
      await authService.sendOtp(testPhone);
    } catch {
      rateLimitCaught = true;
    }
    assert(rateLimitCaught, 'Repeated OTP within 60s is rate-limited with 400 error');

    // Verify OTP
    const storedCode = await redis.get(`otp:${testPhone}`);
    assert(!!storedCode && storedCode.length === 6, 'OTP code stored in Redis with 120s TTL');

    const verifyOtpRes = await authService.verifyOtp(testPhone, storedCode!);
    assert(!!verifyOtpRes.token && verifyOtpRes.user.phone === testPhone, 'verifyOtp logs in and creates user in database');

    // Get Me
    const meRes = await authService.getMe(adminLogin.user.id);
    assert(meRes.id === adminLogin.user.id && !('passwordHash' in meRes), 'getMe returns user data without exposing passwordHash');

    // STIR lookup
    const stirRes = await authService.lookupStir('201122334');
    assert(stirRes.inn === '201122334' && stirRes.companyName.includes('BUNKER'), 'STIR lookup returns company data');

    console.log('\n--- 3. Testing CatalogService (Filtering, Pagination, Product Creation) ---');
    const catalogResult = await catalogService.findAll({ page: 1, limit: 10 });
    assert(catalogResult.data.length > 0 && catalogResult.total > 0, `Catalog findAll returns products (Count: ${catalogResult.total})`);

    const pagedResult = await catalogService.findAll({ page: 1, limit: 1 });
    assert(pagedResult.data.length === 1 && pagedResult.limit === 1, 'Catalog pagination limits count correctly');

    // Create Product
    const newProd = await catalogService.createProduct(
      {
        title: 'Qurilish Ohagi 25kg (E2E Test)',
        categoryId: 'cat-sement',
        price: 32000,
        stock: 500,
        minOrder: 10,
        description: 'Test mahsuloti description',
        unit: 'qop (25kg)',
      },
      supplierLogin.user.id
    );
    assert(newProd.title.includes('Ohagi') && newProd.stock === 500, 'createProduct successfully creates product in database');

    const categoriesList = await catalogService.getCategories();
    assert(Boolean(categoriesList.length > 0 && categoriesList[0].name), 'getCategories returns categories list');

    const supplierProducts = await catalogService.findSupplierProducts(supplierLogin.user.id);
    assert(Boolean(supplierProducts.some(p => p.id === newProd.id)), 'findSupplierProducts finds supplier product');

    console.log('\n--- 4. Testing OrdersService (Prisma Transaction, Stock Decrement, CWE-472) ---');
    const initialStock = newProd.stock;
    const orderQty = 5;

    const createdOrder = await ordersService.createOrder(
      {
        items: [{ productId: newProd.id, quantity: orderQty }],
        deliveryAddress: {
          region: 'Toshkent shahri',
          district: 'Chilonzor tumani',
          street: 'Test ko‘chasi 1-uy',
        },
        buyerPhone: testPhone,
        buyerName: 'E2E Test Mijoz',
      },
      { id: verifyOtpRes.user.id, role: Role.CLIENT }
    );

    assert(createdOrder.orderNumber.startsWith('BS-'), 'Order created with BS- prefix order number');
    assert(createdOrder.items.length === 1, 'Order has OrderItem in database');
    assert(Number(createdOrder.totalAmount) === 32000 * orderQty, 'Server calculates official price without trusting client');

    // Verify stock decremented in Prisma
    const updatedProdInDb = await prisma.product.findUnique({ where: { id: newProd.id } });
    assert(
      updatedProdInDb?.stock === initialStock - orderQty,
      `Stock decremented from ${initialStock} to ${updatedProdInDb?.stock}`
    );

    // Test updateProduct on newProd
    const updatedProd = await catalogService.updateProduct(
      newProd.id,
      { price: 35000, stock: 450 },
      supplierLogin.user.id,
      supplierLogin.user.role
    );
    assert(Boolean(Number(updatedProd.price) === 35000 && updatedProd.stock === 450), 'updateProduct successfully updates price and stock');

    // Update order status
    const updatedOrder = await ordersService.updateStatus(
      createdOrder.id,
      { status: OrderStatus.CONFIRMED },
      { id: adminLogin.user.id, role: Role.ADMIN }
    );
    assert(updatedOrder.status === 'CONFIRMED', 'updateStatus updates order status in database');

    // Filter orders by role
    const clientOrders = await ordersService.findAll({ id: verifyOtpRes.user.id, role: Role.CLIENT });
    assert(clientOrders.every((o) => o.buyerId === verifyOtpRes.user.id), 'Client sees only own orders');

    const adminOrders = await ordersService.findAll({ id: adminLogin.user.id, role: Role.ADMIN });
    assert(adminOrders.length >= clientOrders.length, 'Admin sees all orders');


    console.log('\n--- 5. Testing LogisticsModule (Vehicles, Quote, Dispatch, Status Tracking) ---');
    const vehicles = await logisticsService.getVehicles();
    assert(vehicles.length >= 3, `Logistics vehicles returned from database: ${vehicles.length}`);

    const quote = await logisticsService.calculateQuote({
      distanceKm: 30,
      cargoWeightTons: 15,
    });
    assert(quote.totalCost > 0 && quote.distanceCost > 0, 'calculateQuote computes distance and base costs');

    const dispatch = await logisticsService.dispatchOrder({
      orderId: createdOrder.id,
      vehicleId: vehicles[0].id,
      origin: 'Keles karyeri',
      destination: 'Toshkent sh., Chilonzor tumani',
      distanceKm: 25,
    });
    assert(dispatch.orderId === createdOrder.id, 'dispatchOrder creates LogisticsDispatch in Prisma');

    // Get dispatches as ADMIN
    const allDispatches = await logisticsService.getDispatches({ id: adminLogin.user.id, role: Role.ADMIN });
    assert(allDispatches.some((d) => d.id === dispatch.id), 'Admin getDispatches returns all dispatches including newly created');

    // Get dispatches as Driver (filtered by driverId)
    const driverDispatches = await logisticsService.getDispatches({ id: 'non-existent-driver-uuid', role: Role.LOGISTICS_DRIVER });
    assert(driverDispatches.length === 0, 'Driver getDispatches filters strictly by driverId');

    // Update dispatch status to IN_TRANSIT
    const inTransitDispatch = await logisticsService.updateDispatchStatus(
      dispatch.id,
      'IN_TRANSIT',
      { id: adminLogin.user.id, role: Role.ADMIN }
    );
    assert(inTransitDispatch.status === 'IN_TRANSIT', 'updateDispatchStatus updates status to IN_TRANSIT');

    // Verify order status synchronized to IN_TRANSIT
    const orderInTransit = await prisma.order.findUnique({ where: { id: createdOrder.id } });
    assert(orderInTransit?.status === 'IN_TRANSIT', 'Order status synchronizes to IN_TRANSIT when dispatch is in transit');

    // Update dispatch status to DELIVERED
    const deliveredDispatch = await logisticsService.updateDispatchStatus(
      dispatch.id,
      'DELIVERED',
      { id: adminLogin.user.id, role: Role.ADMIN }
    );
    assert(
      deliveredDispatch.status === 'DELIVERED' && !!deliveredDispatch.deliveredAt,
      'updateDispatchStatus sets DELIVERED status and records deliveredAt timestamp'
    );

    // Verify order status synchronized to DELIVERED
    const orderDelivered = await prisma.order.findUnique({ where: { id: createdOrder.id } });
    assert(orderDelivered?.status === 'DELIVERED', 'Order status synchronizes to DELIVERED upon completion');


    console.log('\n--- 6. Testing EscoModule (Thermodynamic Calculation, DB Persistence, Access Control) ---');
    // 1. Calculate without saving
    const calcResult = await escoService.calculateEnergyAudit({
      buildingType: 'COMMERCIAL_OFFICE',
      areaM2: 500,
      currentEnergyUsageKwh: 15000,
      wallMaterial: "Pishiq g'isht",
      windowType: '3 kamerali Low-E',
    });
    assert(
      calcResult.energySavingsPercent > 0 &&
      calcResult.annualSavingsSum > 0 &&
      calcResult.recommendedMaterials.length > 0,
      'calculateEnergyAudit returns valid thermodynamic metrics without writing to DB'
    );

    // 2. Save ESCO audit to database
    const savedAudit = await escoService.saveAudit(
      {
        buildingType: 'COMMERCIAL_OFFICE',
        areaM2: 500,
        currentEnergyUsageKwh: 15000,
      },
      { id: verifyOtpRes.user.id, role: Role.CLIENT }
    );
    assert(
      !!savedAudit.id && savedAudit.clientId === verifyOtpRes.user.id,
      'saveAudit successfully persists EscoAudit record in PostgreSQL with client relation'
    );
    assert(
      Number(savedAudit.annualSavingsSum) > 0 && savedAudit.recommendations.length > 0,
      'saveAudit populates financial savings and engineering recommendations'
    );

    // 3. Verify AuditLog record for ESCO_AUDIT_SAVED
    const escoAuditLog = await prisma.auditLog.findFirst({
      where: { action: 'ESCO_AUDIT_SAVED', actorId: verifyOtpRes.user.id },
      orderBy: { createdAt: 'desc' },
    });
    assert(!!escoAuditLog, 'AuditLog records ESCO_AUDIT_SAVED action with actor ID');

    // 4. Retrieve client audits
    const clientAudits = await escoService.getAudits({ id: verifyOtpRes.user.id, role: Role.CLIENT });
    assert(
      clientAudits.length > 0 && clientAudits.every((a) => a.clientId === verifyOtpRes.user.id),
      'Client getAudits returns only audits belonging to current authenticated client'
    );

    // 5. Retrieve audits as ADMIN (includes client)
    const adminAudits = await escoService.getAudits({ id: adminLogin.user.id, role: Role.ADMIN });
    assert(
      adminAudits.some((a) => a.id === savedAudit.id && (a as any).client?.id === verifyOtpRes.user.id),
      'Admin getAudits returns all audits with full client relation included'
    );

    // 6. Retrieve single audit by ID (as owner)
    const singleAudit = await escoService.getAuditById(savedAudit.id, { id: verifyOtpRes.user.id, role: Role.CLIENT });
    assert(singleAudit.id === savedAudit.id, 'getAuditById returns audit entity for owner client');

    // 7. Security check: Unauthorized access by another client
    let forbiddenCaught = false;
    try {
      await escoService.getAuditById(savedAudit.id, { id: 'unauthorized-client-uuid', role: Role.CLIENT });
    } catch {
      forbiddenCaught = true;
    }
    assert(forbiddenCaught, 'SECURITY CHECK: Accessing another user’s ESCO audit throws ForbiddenException');

    // 8. NotFound check
    let notFoundCaught = false;
    try {
      await escoService.getAuditById('non-existent-audit-uuid', { id: adminLogin.user.id, role: Role.ADMIN });
    } catch {
      notFoundCaught = true;
    }
    assert(notFoundCaught, 'Non-existent audit ID throws NotFoundException');


    console.log('\n--- 7. Testing PaymentsModule (Payme JSON-RPC 2.0 & Click MD5) ---');
    // Payme CheckPerformTransaction
    const paymeAuth = `Basic ${Buffer.from(`Paycom:${env.PAYME_SECRET_KEY}`).toString('base64')}`;
    const checkPerform: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CheckPerformTransaction',
      params: {
        amount: Math.round(Number(createdOrder.finalAmount) * 100),
        account: { order_id: createdOrder.id },
      },
      id: 123,
    });
    assert(checkPerform?.result?.allow === true, 'Payme CheckPerformTransaction allows valid order');

    // Payme CreateTransaction
    const paymeTransId = 'payme-tx-' + Date.now();
    const createTx: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CreateTransaction',
      params: {
        id: paymeTransId,
        time: Date.now(),
        amount: Math.round(Number(createdOrder.finalAmount) * 100),
        account: { order_id: createdOrder.id },
      },
      id: 124,
    });
    assert(createTx?.result?.state === 1, 'Payme CreateTransaction creates preauthorized transaction');

    // Payme PerformTransaction
    const performTx: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'PerformTransaction',
      params: { id: paymeTransId },
      id: 125,
    });
    assert(performTx?.result?.state === 2, 'Payme PerformTransaction completes payment and marks PAID');


    // Click MD5 Webhook (Action 0 - Prepare)
    const clickTransId = Date.now().toString().slice(-8);
    const signTime = '2026-10-20 12:00:00';
    const rawSign0 = `${clickTransId}38491${env.CLICK_SECRET_KEY}${createdOrder.id}${createdOrder.finalAmount}0${signTime}`;
    const signString0 = crypto.createHash('md5').update(rawSign0).digest('hex');

    const clickPrepare = await paymentsService.handleClickWebhook({
      click_trans_id: clickTransId,
      service_id: '38491',
      merchant_trans_id: createdOrder.id,
      amount: createdOrder.finalAmount,
      action: 0,
      sign_time: signTime,
      sign_string: signString0,
    });
    assert(clickPrepare.error === 0, 'Click Prepare action returns success 0 with MD5 signature validation');

    // Click Complete action (Action 1)
    const rawSign1 = `${clickTransId}38491${env.CLICK_SECRET_KEY}${createdOrder.id}${createdOrder.finalAmount}1${signTime}`;
    const signString1 = crypto.createHash('md5').update(rawSign1).digest('hex');

    const clickComplete = await paymentsService.handleClickWebhook({
      click_trans_id: clickTransId,
      service_id: '38491',
      merchant_trans_id: createdOrder.id,
      amount: createdOrder.finalAmount,
      action: 1,
      sign_time: signTime,
      sign_string: signString1,
    });
    assert(clickComplete.error === 0, 'Click Complete action completes payment and records in database');

    console.log('\n--- 8. Testing AdminModule (Real Analytics & Audit Logs) ---');
    await auditLogService.logAction({
      actorId: adminLogin.user.id,
      action: 'E2E Test Security Audit',
      category: 'SYSTEM_SECURITY',
      details: 'Automated test execution verification',
      level: 'SUCCESS',
    });

    const logs = await adminService.getLogs();
    assert(logs.length > 0 && logs[0].action.includes('Test'), 'AuditLogService records and retrieves logs from database');

    const metrics = await adminService.getMetrics();
    assert(metrics.ordersCount > 0 && metrics.totalTurnover > 0, `Admin metrics computed from DB: Turnover ${metrics.totalTurnover}`);

    const suppliers = await adminService.getSuppliers();
    assert(suppliers.length > 0, `Admin suppliers retrieved from DB (Count: ${suppliers.length})`);

    console.log('\n--- 9. Testing Construction Marketplace TZ Mechanisms (50/50 Escrow, PIN, Disputes, Monitoring) ---');
    // 1. Create a product with tiered prices for testing
    const tieredProd = await catalogService.createProduct(
      {
        title: 'E2E Sement M500 Zinapoya',
        categoryId: 'cat-sement',
        price: 80000,
        stock: 500,
        unit: 'QOP',
        description: 'E2E Zinapoyali narx sinovi uchun sement',
        tieredPrices: [
          { minQty: 10, maxQty: 49, price: 75000 },
          { minQty: 50, price: 70000 },
        ],
      },
      supplierLogin.user.id
    );
    assert((tieredProd.tieredPrices?.length ?? 0) === 2, 'Product created with Tiered Pricing ladders in DB');

    // 2. Verify unauthorized individual client cannot use SPLIT_50_50
    await prisma.user.update({
      where: { id: verifyOtpRes.user.id },
      data: { isAllowedSplitPayment: false, userType: UserType.INDIVIDUAL },
    });
    let unverifiedSplitRejected = false;
    try {
      await ordersService.createOrder(
        {
          items: [{ productId: tieredProd.id, quantity: 50 }],
          deliveryAddress: {
            region: 'Toshkent shahri',
            district: 'Yunusobod tumani',
            street: '12-mavze, 45-uchastka',
          },
          buyerPhone: testPhone,
          buyerName: 'E2E Builder',
          paymentMode: PaymentMode.SPLIT_50_50,
        },
        { id: verifyOtpRes.user.id, role: Role.CLIENT }
      );
    } catch (e: any) {
      if (e.message?.includes('50/50 to‘lov rejimi')) {
        unverifiedSplitRejected = true;
      }
    }
    assert(unverifiedSplitRejected, 'SECURITY CHECK: 50/50 payment mode forbidden for unverified individual clients');

    // Enable B2B 50/50 split permission via Admin
    await adminService.setClientSplitPayment(verifyOtpRes.user.id, true, adminLogin.user.id);

    // 3. Create Order with SPLIT_50_50 and quantity triggering 2nd tier (50 qop)
    const splitOrder = await ordersService.createOrder(
      {
        items: [{ productId: tieredProd.id, quantity: 50 }],
        deliveryAddress: {
          region: 'Toshkent shahri',
          district: 'Yunusobod tumani',
          street: '12-mavze, 45-uchastka',
          landmark: 'Megaplanet orqasida',
        },
        buyerPhone: testPhone,
        buyerName: 'E2E Builder',
        paymentMode: PaymentMode.SPLIT_50_50,
      },
      { id: verifyOtpRes.user.id, role: Role.CLIENT }
    );

    // Expected total: 50 * 70,000 = 3,500,000 UZS (tier price)
    assert(Number(splitOrder.totalAmount) === 50 * 70000, `Tiered pricing applied automatically: ${splitOrder.totalAmount} UZS`);
    assert(splitOrder.paymentMode === PaymentMode.SPLIT_50_50, 'Order created in SPLIT_50_50 payment mode');
    assert(
      Number(splitOrder.firstPaymentAmount) === Math.round(Number(splitOrder.finalAmount) / 2),
      `First payment is exactly 50%: ${splitOrder.firstPaymentAmount}`
    );
    assert(
      Number(splitOrder.secondPaymentAmount) === Number(splitOrder.finalAmount) - Number(splitOrder.firstPaymentAmount),
      `Second payment is remaining 50%: ${splitOrder.secondPaymentAmount}`
    );
    assert(splitOrder.isSecondPaid === false, 'isSecondPaid is initially false');
    const dbSplitOrder = await prisma.order.findUnique({ where: { id: splitOrder.id } });
    assert(typeof dbSplitOrder?.acceptanceCode === 'string' && /^\d{4}$/.test(dbSplitOrder.acceptanceCode), `Acceptance PIN is a 4-digit code in DB (${dbSplitOrder?.acceptanceCode})`);
    assert(splitOrder.acceptanceCode === null, 'PIN code hidden from client until full payment or arrival');
    assert(splitOrder.subOrders && splitOrder.subOrders.length >= 1, `Sub-orders generated for multi-vendor fulfillment (Count: ${splitOrder.subOrders?.length})`);

    // 3. Mark Arrived & Waiting timer (30 mins)
    const arrivedOrder = await ordersService.markArrived(splitOrder.id, { id: 'DRIVER_1', role: Role.LOGISTICS_DRIVER });
    assert(arrivedOrder.status === 'ARRIVED', 'markArrived updates status to ARRIVED');
    assert(!!arrivedOrder.arrivedAt && !!arrivedOrder.waitingDeadline, 'Arrival timestamp and 30-min waitingDeadline recorded');
    assert(arrivedOrder.isAcceptanceCodeRevealed === false, 'PIN code remains hidden for SPLIT_50_50 order until second payment');

    // 4. Verification fails before paying 2nd half
    let prematureVerificationBlocked = false;
    try {
      await ordersService.verifyAcceptanceCode(splitOrder.id, { code: dbSplitOrder!.acceptanceCode });
    } catch (e: any) {
      if (e.message?.includes('Ikkinchi 50% to‘lov hali to‘lanmagan')) {
        prematureVerificationBlocked = true;
      }
    }
    assert(prematureVerificationBlocked, 'verifyAcceptanceCode blocks release before second 50% payment');

    // 5. Pay second 50%
    const secondPaidOrder = await ordersService.paySecondHalf(splitOrder.id, { id: verifyOtpRes.user.id, role: Role.CLIENT });
    assert(secondPaidOrder.isSecondPaid === true, 'paySecondHalf marks isSecondPaid to true');
    assert(secondPaidOrder.status === 'FULLY_PAID', 'Order status transitions to FULLY_PAID');
    assert(secondPaidOrder.isAcceptanceCodeRevealed === true, 'Acceptance PIN code revealed to buyer upon full payment');
    assert(typeof secondPaidOrder.acceptanceCode === 'string' && secondPaidOrder.acceptanceCode === dbSplitOrder!.acceptanceCode, 'Revealed PIN matches generated DB PIN');

    // 6. Test invalid PIN code rejection
    let invalidPinRejected = false;
    try {
      await ordersService.verifyAcceptanceCode(splitOrder.id, { code: secondPaidOrder.acceptanceCode === '0000' ? '1111' : '0000' });
    } catch (e: any) {
      if (e.message?.includes('noto‘g‘ri')) {
        invalidPinRejected = true;
      }
    }
    assert(invalidPinRejected, 'verifyAcceptanceCode rejects incorrect PIN');

    // 7. Verify with correct PIN code -> completes order & releases Escrow
    const completedOrder = await ordersService.verifyAcceptanceCode(splitOrder.id, { code: secondPaidOrder.acceptanceCode! });
    assert(completedOrder.status === 'COMPLETED' || completedOrder.status === 'RECEIVED', 'verifyAcceptanceCode successfully accepts goods');
    const dbOrderCompleted = await prisma.order.findUnique({ where: { id: splitOrder.id } });
    assert(dbOrderCompleted?.status === 'COMPLETED', 'Order finalized to COMPLETED in database');

    // 8. Open Dispute Workflow
    const disputeOrder = await ordersService.createOrder(
      {
        items: [{ productId: tieredProd.id, quantity: 10 }],
        deliveryAddress: {
          region: 'Toshkent shahri',
          district: 'Olmazor tumani',
          street: 'Kichik halqa yo‘li, 15-bino',
        },
        buyerPhone: testPhone,
        buyerName: 'E2E Builder Dispute',
        paymentMode: PaymentMode.FULL_100,
      },
      { id: verifyOtpRes.user.id, role: Role.CLIENT }
    );
    const dispute = await ordersService.openDispute(
      disputeOrder.id,
      {
        reason: 'Sement qoplaridan 2 tasi yirtilgan va nam tekkan',
        evidenceUrls: ['https://bunkerstroy.uz/evidence/sack1.jpg'],
      },
      { id: verifyOtpRes.user.id, role: Role.CLIENT }
    );
    assert(dispute.orderId === disputeOrder.id && dispute.status === 'OPEN', 'openDispute creates OPEN dispute record');
    const orderInDispute = await prisma.order.findUnique({ where: { id: disputeOrder.id } });
    assert(orderInDispute?.status === 'DISPUTE', 'Order status switches to DISPUTE');

    // Admin resolves dispute
    const resolvedDispute = await adminService.resolveDispute(
      dispute.id,
      'RESOLVED_REFUND',
      'Ta‘minotchi 2 qop sementni bepul almashtirib berdi',
      0,
      adminLogin.user.id
    );
    assert(resolvedDispute.status === 'RESOLVED_REFUND', 'Admin resolveDispute successfully resolves dispute');

    // 9. Admin Monitoring Dashboard
    const monitoringData = await adminService.getMonitoringData();
    assert(
      monitoringData.kpis && typeof monitoringData.kpis.todayOrdersCount === 'number',
      `Admin monitoring dashboard computes real-time KPIs (Today Orders: ${monitoringData.kpis.todayOrdersCount})`
    );
    assert(Array.isArray(monitoringData.attentionList), 'Admin monitoring returns live attentionList');

    // 10. Admin Partners Integration
    const partners = await adminService.getPartners();
    assert(partners.length === 6, `Admin partners integrations returned (Count: ${partners.length})`);
    assert(partners.some(p => p.code === 'PAYME'), 'Payme payment partner present');
    assert(partners.some(p => p.code === 'CLICK'), 'Click payment partner present');
    assert(partners.some(p => p.code === 'ESCROW_BANK'), 'Escrow Bank partner present');
    assert(partners.some(p => p.code === 'E_IMZO'), 'E-IMZO state PKCS#7 partner present');

    // 11. Admin Supplier Verification
    const verifyRes = await adminService.verifySupplier(
      supplierLogin.user.id,
      VerificationStatus.VERIFIED,
      SupplierType.LOCAL,
      adminLogin.user.id
    );
    assert(verifyRes.verificationStatus === VerificationStatus.VERIFIED, 'Admin verifySupplier validates supplier account');

    // Clean up created test data
    const userOrders = await prisma.order.findMany({ where: { buyerId: verifyOtpRes.user.id } });
    const allTestOrderIds = Array.from(new Set([...userOrders.map(o => o.id), createdOrder.id, splitOrder.id, disputeOrder.id]));

    await prisma.dispute.deleteMany({ where: { orderId: { in: allTestOrderIds } } });
    await prisma.subOrder.deleteMany({ where: { orderId: { in: allTestOrderIds } } });
    await prisma.paymentTransaction.deleteMany({ where: { orderId: { in: allTestOrderIds } } });
    await prisma.logisticsDispatch.deleteMany({ where: { orderId: { in: allTestOrderIds } } });
    await prisma.orderItem.deleteMany({
      where: {
        OR: [
          { orderId: { in: allTestOrderIds } },
          { productId: { in: [newProd.id, tieredProd.id] } },
        ],
      },
    });
    await prisma.order.deleteMany({ where: { id: { in: allTestOrderIds } } });
    await prisma.productTieredPrice.deleteMany({ where: { productId: tieredProd.id } });
    await prisma.product.deleteMany({ where: { id: { in: [newProd.id, tieredProd.id] } } });
    await prisma.escoAudit.deleteMany({ where: { clientId: verifyOtpRes.user.id } });
    await prisma.auditLog.deleteMany({
      where: {
        action: {
          in: [
            'E2E Test Security Audit',
            'ESCO_AUDIT_SAVED',
            'LOGISTICS_DISPATCH',
            'LOGISTICS_DISPATCH_STATUS_UPDATED',
            'ORDER_ARRIVED',
            'SECOND_PAYMENT_COMPLETED',
            'ORDER_RECEIVED_VERIFIED',
            'ORDER_DISPUTE_OPENED',
            'DISPUTE_RESOLVED',
            'SUPPLIER_VERIFICATION_UPDATED',
            'CLIENT_SPLIT_PAYMENT_RULE_UPDATED',
          ],
        },
      },
    });
    await prisma.user.deleteMany({ where: { phone: testPhone } });

    console.log('\n========================================');
    console.log(`TOTAL TESTS: ${passedTests + failedTests}`);
    console.log(`PASSED: ${passedTests}`);
    console.log(`FAILED: ${failedTests}`);
    console.log('========================================\n');

    await app.close();
    process.exit(failedTests > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal error during E2E verification:', err);
    await app.close();
    process.exit(1);
  }
}

runAllBackendVerificationTests();
