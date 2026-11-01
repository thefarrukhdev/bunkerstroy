import './config/env';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : [];

  const defaultAllowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:4000',
    'http://localhost:4050',
    'https://bunkerstroy.uz',
    'http://bunkerstroy.uz',
    'https://admin.bunkerstroy.uz',
    'https://supplier.bunkerstroy.uz',
    'https://app.bunkerstroy.uz',
  ];

  const allowedOriginsSet = new Set([...defaultAllowedOrigins, ...envOrigins]);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Check explicit whitelist first
      if (allowedOriginsSet.has(origin)) {
        return callback(null, true);
      }

      // Allow localhost / 127.0.0.1 ports during local development
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) {
        const isLocalDevOrigin =
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:') ||
          origin.startsWith('https://localhost:') ||
          origin.startsWith('https://127.0.0.1:');
        if (isLocalDevOrigin) {
          return callback(null, true);
        }
      }

      // Allow verified bunkerStroy.uz production subdomains
      try {
        const parsed = new URL(origin);
        if (
          parsed.protocol === 'https:' &&
          (parsed.hostname === 'bunkerstroy.uz' || parsed.hostname.endsWith('.bunkerstroy.uz'))
        ) {
          return callback(null, true);
        }
      } catch {
        // Invalid origin format
      }

      callback(null, false);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, X-Idempotency-Key, Idempotency-Key',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable graceful shutdown hooks for Prisma, Redis, etc.
  app.enableShutdownHooks();


  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('BunkerStroy Enterprise API')
    .setDescription("B2B Qurilish Mollari Marketplace, Logistika Hub va ESCO Energiya Auditi API'si")
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication & Identity', 'STIR, E-IMZO, Eskiz SMS OTP')
    .addTag('Building Materials Catalog', 'Qurilish materiallari katalogi va zaxiralar')
    .addTag('Orders & Checkout', 'Buyurtmalar rasmiylashtirish va kuzatuv')
    .addTag('Logistics & Fleet Transport', 'Maxsus texnikalar va masofa kalkulyatori')
    .addTag('ESCO Energy Efficiency Audit', 'Energetik modellashtirish va hisob-kitoblar')
    .addTag('Payment Gateways (Payme & Click)', 'Tranzaksiyalar va to‘lov webhooklari')
    .addTag('Admin Analytics & Auditing', 'Aylanma, moliya va xavfsizlik audit jurnali')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 BunkerStroy Enterprise NestJS API running on: http://localhost:${port}`);
  console.log(`📖 Swagger API Documentation live on: http://localhost:${port}/api/docs`);
}

bootstrap();
