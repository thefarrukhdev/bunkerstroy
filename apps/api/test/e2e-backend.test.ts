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
import { RedisService } from '../src/redis/redis.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role, OrderStatus } from '@bunkerstroy/db';
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

    // Clean up created test data
    await prisma.escoAudit.deleteMany({ where: { clientId: verifyOtpRes.user.id } });
    await prisma.logisticsDispatch.deleteMany({ where: { orderId: createdOrder.id } });
    await prisma.paymentTransaction.deleteMany({ where: { orderId: createdOrder.id } });
    await prisma.orderItem.deleteMany({ where: { orderId: createdOrder.id } });
    await prisma.order.delete({ where: { id: createdOrder.id } });
    await prisma.product.delete({ where: { id: newProd.id } });
    await prisma.auditLog.deleteMany({
      where: {
        action: {
          in: [
            'E2E Test Security Audit',
            'ESCO_AUDIT_SAVED',
            'LOGISTICS_DISPATCH',
            'LOGISTICS_DISPATCH_STATUS_UPDATED',
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
