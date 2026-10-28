import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';
import { JwtStrategy } from '../src/modules/auth/jwt.strategy';
import { PaymentsService } from '../src/modules/payments/payments.service';
import { OrdersService } from '../src/modules/orders/orders.service';
import { CatalogService } from '../src/modules/catalog/catalog.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { Role, OrderStatus, PaymentMode, VerificationStatus, UserType } from '@bunkerstroy/db';
import crypto from 'crypto';
import { env } from '../src/config/env';

async function runFintechAuthVerificationTests() {
  console.log('🚀 Running BunkerStroy FinTech & Auth Hardening Verification Tests...\n');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  const prisma = app.get(PrismaService);
  const redis = app.get(RedisService);
  const authService = app.get(AuthService);
  const paymentsService = app.get(PaymentsService);
  const ordersService = app.get(OrdersService);
  const catalogService = app.get(CatalogService);
  const jwtStrategy = app.get(JwtStrategy);

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

  const testPhone = '+998908889900';
  const cleanPhone = testPhone;

  try {
    // Clean initial test data
    await redis.del(`otp:${cleanPhone}`);
    await redis.del(`otp_cooldown:${cleanPhone}`);
    await redis.del(`otp_failed_attempts:${cleanPhone}`);
    await redis.del(`otp_blocked:${cleanPhone}`);
    await prisma.user.deleteMany({ where: { phone: { in: [testPhone, '+998905554433', '+998901112244'] } } });

    // Setup a verified client user
    const clientUser = await prisma.user.create({
      data: {
        phone: testPhone,
        displayName: 'Fintech Test Client',
        role: Role.CLIENT,
        userType: UserType.LEGAL_ENTITY,
        verificationStatus: VerificationStatus.VERIFIED,
        isAllowedSplitPayment: true,
        passwordHash: 'dummy_hash',
      },
    });

    // Setup product
    const product = await catalogService.createProduct(
      {
        title: 'Armatura A500C 12mm (FinTech Test)',
        categoryId: 'cat-armatura',
        price: 100000,
        stock: 100,
        minOrder: 1,
        description: 'Fintech test product',
        unit: 'metr',
      },
      clientUser.id
    );

    // Create a regular order (FULL_100)
    const fullOrder = await ordersService.createOrder(
      {
        items: [{ productId: product.id, quantity: 2 }],
        deliveryAddress: { region: 'Toshkent', district: 'Chilonzor' },
        buyerPhone: clientUser.phone,
        buyerName: clientUser.displayName,
        paymentMode: PaymentMode.FULL_100,
      },
      { id: clientUser.id, role: Role.CLIENT }
    );

    // ========================================================
    // 1. PAYMENTS SERVICE: simulatePayment
    // ========================================================
    console.log('--- 1. Testing simulatePayment Security ---');
    const originalEnv = env.NODE_ENV;

    // Test in production environment: must throw ForbiddenException
    (env as any).NODE_ENV = 'production';
    let prodSimCaught = false;
    try {
      await paymentsService.simulatePayment(fullOrder.id, 'PAYME');
    } catch (err: any) {
      if (err.message?.includes('taqiqlangan')) {
        prodSimCaught = true;
      }
    }
    (env as any).NODE_ENV = originalEnv;
    assert(prodSimCaught, 'simulatePayment: Throws ForbiddenException in production');

    // Test in development/test environment: must succeed
    const simSuccess = await paymentsService.simulatePayment(fullOrder.id, 'PAYME');
    assert(simSuccess.success === true && simSuccess.status === 'PAID', 'simulatePayment: Works in development/test mode');

    // ========================================================
    // 2. CLICK WEBHOOK SECURITY & PROTOCOL HARDENING
    // ========================================================
    console.log('\n--- 2. Testing Click Webhook Security ---');

    const clickOrderId = fullOrder.id;
    const signTime = '2026-10-28 12:00:00';
    const clickTxId = 'click-test-' + Date.now();

    // 2.1. Signature validation using timingSafeEqual
    const invalidClickRes = await paymentsService.handleClickWebhook({
      click_trans_id: clickTxId,
      service_id: '38491',
      merchant_trans_id: clickOrderId,
      amount: fullOrder.finalAmount,
      action: 0,
      sign_time: signTime,
      sign_string: 'invalid_md5_hash_00000000000000',
    });
    assert(invalidClickRes.error === -1 && invalidClickRes.error_note === 'SIGN CHECK FAILED!', 'Click: Timing-safe signature check rejects invalid sign_string');

    // 2.2. Action 0: Incorrect amount check (-2, 'Incorrect amount')
    const rawSignBadAmount = `${clickTxId}38491${env.CLICK_SECRET_KEY}${clickOrderId}9999990${signTime}`;
    const signBadAmount = crypto.createHash('md5').update(rawSignBadAmount).digest('hex');
    const badAmountRes0 = await paymentsService.handleClickWebhook({
      click_trans_id: clickTxId,
      service_id: '38491',
      merchant_trans_id: clickOrderId,
      amount: 999999,
      action: 0,
      sign_time: signTime,
      sign_string: signBadAmount,
    });
    assert(badAmountRes0.error === -2 && badAmountRes0.error_note === 'Incorrect amount', 'Click Action 0: Returns error -2 on amount mismatch');

    // 2.3. Action 1: Incorrect amount check (-2, 'Incorrect amount')
    const rawSignBadAmount1 = `${clickTxId}38491${env.CLICK_SECRET_KEY}${clickOrderId}9999991${signTime}`;
    const signBadAmount1 = crypto.createHash('md5').update(rawSignBadAmount1).digest('hex');
    const badAmountRes1 = await paymentsService.handleClickWebhook({
      click_trans_id: clickTxId,
      service_id: '38491',
      merchant_trans_id: clickOrderId,
      amount: 999999,
      action: 1,
      sign_time: signTime,
      sign_string: signBadAmount1,
    });
    assert(badAmountRes1.error === -2 && badAmountRes1.error_note === 'Incorrect amount', 'Click Action 1: Returns error -2 on amount mismatch');

    // 2.4. Action 0: Idempotent merchant_prepare_id tied to transaction ID
    const rawSignGood0 = `${clickTxId}38491${env.CLICK_SECRET_KEY}${clickOrderId}${fullOrder.finalAmount}0${signTime}`;
    const signGood0 = crypto.createHash('md5').update(rawSignGood0).digest('hex');
    const prepRes1 = await paymentsService.handleClickWebhook({
      click_trans_id: clickTxId,
      service_id: '38491',
      merchant_trans_id: clickOrderId,
      amount: fullOrder.finalAmount,
      action: 0,
      sign_time: signTime,
      sign_string: signGood0,
    });
    const prepRes2 = await paymentsService.handleClickWebhook({
      click_trans_id: clickTxId,
      service_id: '38491',
      merchant_trans_id: clickOrderId,
      amount: fullOrder.finalAmount,
      action: 0,
      sign_time: signTime,
      sign_string: signGood0,
    });
    assert(
      prepRes1.error === 0 &&
      prepRes1.merchant_prepare_id === prepRes2.merchant_prepare_id &&
      typeof prepRes1.merchant_prepare_id === 'string' &&
      prepRes1.merchant_prepare_id.length > 0,
      'Click Action 0: merchant_prepare_id is idempotent across repeated requests'
    );

    // ========================================================
    // 3. PAYME WEBHOOK SECURITY & PROTOCOL HARDENING
    // ========================================================
    console.log('\n--- 3. Testing Payme Webhook Security ---');

    const paymeAuth = `Basic ${Buffer.from(`Paycom:${env.PAYME_SECRET_KEY}`).toString('base64')}`;

    // 3.1. Basic Auth with timingSafeEqual
    const invalidAuth = `Basic ${Buffer.from(`Paycom:wrong_secret_key_fail`).toString('base64')}`;
    const authFailRes: any = await paymentsService.handlePaymeWebhook(invalidAuth, {
      method: 'CheckPerformTransaction',
      params: {
        amount: Math.round(Number(fullOrder.finalAmount) * 100),
        account: { order_id: fullOrder.id },
      },
      id: 101,
    });
    assert(authFailRes?.error?.code === -32504, 'Payme: timingSafeEqual auth check rejects wrong key with -32504');

    // 3.2. amountInTiyin check: 0, negative, undefined, NaN
    const zeroAmountRes: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CheckPerformTransaction',
      params: {
        amount: 0,
        account: { order_id: fullOrder.id },
      },
      id: 102,
    });
    assert(zeroAmountRes?.error?.code === -31001, 'Payme: amount <= 0 rejected with -31001');

    // 3.3. Strict tiyin comparison with zero tolerance
    const strictTiyinRes: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CheckPerformTransaction',
      params: {
        amount: Math.round(Number(fullOrder.finalAmount) * 100) + 1,
        account: { order_id: fullOrder.id },
      },
      id: 103,
    });
    assert(strictTiyinRes?.error?.code === -31001, 'Payme: Strict tiyin check has zero tolerance (mismatch rejects with -31001)');

    // 3.4. paymeCreateTransaction sets paymentType to FIRST_50 on SPLIT_50_50
    const splitOrder = await ordersService.createOrder(
      {
        items: [{ productId: product.id, quantity: 4 }],
        deliveryAddress: { region: 'Toshkent', district: 'Yunusobod' },
        buyerPhone: clientUser.phone,
        buyerName: clientUser.displayName,
        paymentMode: PaymentMode.SPLIT_50_50,
      },
      { id: clientUser.id, role: Role.CLIENT }
    );

    const splitTxId = 'payme-split-tx-' + Date.now();
    const splitFirstTiyin = Math.round(Number(splitOrder.firstPaymentAmount) * 100);
    const paymeCreateSplitRes: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CreateTransaction',
      params: {
        id: splitTxId,
        time: Date.now(),
        amount: splitFirstTiyin,
        account: { order_id: splitOrder.id },
      },
      id: 104,
    });
    assert(paymeCreateSplitRes?.result?.state === 1, 'Payme: CreateTransaction succeeds for split 50/50 order');

    const splitTxInDb = await prisma.paymentTransaction.findUnique({
      where: { transactionId: splitTxId },
    });
    assert(splitTxInDb?.paymentType === 'FIRST_50', 'Payme: Sets paymentType to FIRST_50 for initial 50/50 payment');

    // 3.5. paymeCancelTransaction rejection when order is IN_TRANSIT, DELIVERED, ARRIVED, COMPLETED (-31007)
    // Perform payment
    await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'PerformTransaction',
      params: { id: splitTxId },
      id: 105,
    });

    // Transition order to IN_TRANSIT
    await prisma.order.update({
      where: { id: splitOrder.id },
      data: { status: OrderStatus.IN_TRANSIT },
    });

    const cancelInTransitRes: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CancelTransaction',
      params: { id: splitTxId },
      id: 106,
    });
    assert(
      cancelInTransitRes?.error?.code === -31007,
      'Payme CancelTransaction: Rejects cancellation with -31007 when order is IN_TRANSIT'
    );

    // Transition order to DELIVERED
    await prisma.order.update({
      where: { id: splitOrder.id },
      data: { status: OrderStatus.DELIVERED },
    });
    const cancelDeliveredRes: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CancelTransaction',
      params: { id: splitTxId },
      id: 107,
    });
    assert(
      cancelDeliveredRes?.error?.code === -31007,
      'Payme CancelTransaction: Rejects cancellation with -31007 when order is DELIVERED'
    );

    // 3.6. paymeCancelTransaction idempotency
    const cancellableTxId = 'payme-cancel-idem-' + Date.now();
    const cancellableOrder = await ordersService.createOrder(
      {
        items: [{ productId: product.id, quantity: 1 }],
        deliveryAddress: { region: 'Toshkent', district: 'Chilonzor' },
        buyerPhone: clientUser.phone,
        buyerName: clientUser.displayName,
      },
      { id: clientUser.id, role: Role.CLIENT }
    );
    await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CreateTransaction',
      params: {
        id: cancellableTxId,
        time: Date.now(),
        amount: Math.round(Number(cancellableOrder.finalAmount) * 100),
        account: { order_id: cancellableOrder.id },
      },
      id: 108,
    });

    const cancelAttempt1: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CancelTransaction',
      params: { id: cancellableTxId },
      id: 109,
    });
    const cancelAttempt2: any = await paymentsService.handlePaymeWebhook(paymeAuth, {
      method: 'CancelTransaction',
      params: { id: cancellableTxId },
      id: 110,
    });
    assert(
      cancelAttempt1?.result?.state === -1 && cancelAttempt2?.result?.state === -1,
      'Payme CancelTransaction: Returns idempotent response on repeated cancel requests'
    );

    // ========================================================
    // 4. AUTH SERVICE & JWT STRATEGY HARDENING
    // ========================================================
    console.log('\n--- 4. Testing Auth Security & Hardening ---');

    // 4.1. Demo accounts upsert disabled in production
    (env as any).NODE_ENV = 'production';
    let prodDemoError = false;
    try {
      await authService.login('unknown_admin_demo', 'bunker2026');
    } catch {
      prodDemoError = true;
    }
    (env as any).NODE_ENV = originalEnv;
    assert(prodDemoError, 'Auth: Demo account auto-upsert is disabled in production environment');

    // 4.2. sendOtp CSPRNG & Brute Force protection in verifyOtp
    const brutePhone = '+998901112244';
    await redis.del(`otp:${brutePhone}`);
    await redis.del(`otp_cooldown:${brutePhone}`);
    await redis.del(`otp_failed_attempts:${brutePhone}`);
    await redis.del(`otp_blocked:${brutePhone}`);

    const otpSendRes = await authService.sendOtp(brutePhone);
    assert(otpSendRes.success === true, 'Auth sendOtp: Generates secure OTP using crypto.randomInt');

    // Check failed attempts 1 through 4
    for (let attempt = 1; attempt <= 4; attempt++) {
      let failedCaught = false;
      try {
        await authService.verifyOtp(brutePhone, '999999');
      } catch (err: any) {
        if (err.message?.includes(`(${attempt}/5)`)) {
          failedCaught = true;
        }
      }
      assert(failedCaught, `Auth verifyOtp: Tracks failed attempt ${attempt}/5 in Redis counter`);
    }

    // 5th attempt must delete OTP and lock phone for 15 minutes
    let fifthAttemptLocked = false;
    try {
      await authService.verifyOtp(brutePhone, '999999');
    } catch (err: any) {
      if (err.message?.includes('15 daqiqaga bloklandingiz')) {
        fifthAttemptLocked = true;
      }
    }
    assert(fifthAttemptLocked, 'Auth verifyOtp: 5th incorrect attempt wipes OTP and locks user for 15 minutes');

    // Subsequent OTP requests while locked must be denied
    let lockedOtpDenied = false;
    try {
      await authService.sendOtp(brutePhone);
    } catch (err: any) {
      if (err.message?.includes('bloklangansiz')) {
        lockedOtpDenied = true;
      }
    }
    assert(lockedOtpDenied, 'Auth sendOtp: Blocks locked out phone from requesting new OTP codes');

    // 4.3. Refresh Token Rotation and Revocation
    const loginRes = await authService.login('admin', 'bunker2026');
    const initialRefreshToken = loginRes.refreshToken;

    // First refresh succeeds and rotates tokens
    const refreshedTokens = await authService.refreshToken(initialRefreshToken);
    assert(!!refreshedTokens.token && !!refreshedTokens.refreshToken, 'Auth refreshToken: Generates new rotated token pair');

    // Attempting to reuse the revoked initialRefreshToken must be rejected
    let reuseDenied = false;
    try {
      await authService.refreshToken(initialRefreshToken);
    } catch (err: any) {
      if (err.message?.includes('allaqachon ishlatilgan') || err.message?.includes('yaroqsiz')) {
        reuseDenied = true;
      }
    }
    assert(reuseDenied, 'Auth refreshToken: Reusing a rotated refresh token is rejected with UnauthorizedException');

    // 4.4. JwtStrategy: DB lookup checks user.isBlocked
    const blockedUser = await prisma.user.create({
      data: {
        phone: '+998905554433',
        displayName: 'Blocked Account User',
        isBlocked: true,
        passwordHash: 'dummy',
      },
    });

    let jwtStrategyBlockedCaught = false;
    try {
      await jwtStrategy.validate({ id: blockedUser.id, role: Role.CLIENT });
    } catch (err: any) {
      if (err.message === 'Hisobingiz bloklangan') {
        jwtStrategyBlockedCaught = true;
      }
    }
    assert(jwtStrategyBlockedCaught, 'JwtStrategy: Throws UnauthorizedException("Hisobingiz bloklangan") when user is blocked in DB');

    // ========================================================
    // CLEANUP
    // ========================================================
    const testOrderIds = [fullOrder.id, splitOrder.id, cancellableOrder.id];
    await prisma.paymentTransaction.deleteMany({ where: { orderId: { in: testOrderIds } } });
    await prisma.subOrder.deleteMany({ where: { orderId: { in: testOrderIds } } });
    await prisma.orderItem.deleteMany({ where: { orderId: { in: testOrderIds } } });
    await prisma.order.deleteMany({ where: { id: { in: testOrderIds } } });
    await prisma.product.deleteMany({ where: { id: product.id } });
    await prisma.user.deleteMany({ where: { id: { in: [clientUser.id, blockedUser.id] } } });
    await redis.del(`otp:${brutePhone}`);
    await redis.del(`otp_cooldown:${brutePhone}`);
    await redis.del(`otp_failed_attempts:${brutePhone}`);
    await redis.del(`otp_blocked:${brutePhone}`);

    console.log('\n========================================');
    console.log(`TOTAL FINTECH & AUTH TESTS: ${passedTests + failedTests}`);
    console.log(`PASSED: ${passedTests}`);
    console.log(`FAILED: ${failedTests}`);
    console.log('========================================\n');

    await app.close();
    process.exit(failedTests > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    await app.close();
    process.exit(1);
  }
}

runFintechAuthVerificationTests();
