import './config/env';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupLiveVoiceGateway } from './modules/ai/liveVoice.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:4000',
    'http://localhost:4050',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured local origins or any localhost / 127.0.0.1 port
      const isLocalOrigin =
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.startsWith('https://localhost:') ||
        origin.startsWith('https://127.0.0.1:');

      // Allow Vercel preview / production deployments and BunkerStroy domains
      const isAllowedDomain =
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.bunkerstroy.uz') ||
        origin === 'https://bunkerstroy.uz' ||
        origin === 'http://bunkerstroy.uz';

      if (isLocalOrigin || isAllowedDomain) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());


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
    .addTag('ESCO Energy Efficiency Audit', 'AI energetik modellashtirish')
    .addTag('Payment Gateways (Payme & Click)', 'Tranzaksiyalar va to‘lov webhooklari')
    .addTag('AI & Google Maps Grounding', 'Gemini AI va xarita qidiruvi')
    .addTag('Admin Analytics & Auditing', 'Aylanma, moliya va xavfsizlik audit jurnali')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Real-time Live Voice WebSocket Gateway on /api/live
  const server = app.getHttpServer();
  setupLiveVoiceGateway(server);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 BunkerStroy Enterprise NestJS API running on: http://localhost:${port}`);
  console.log(`📖 Swagger API Documentation live on: http://localhost:${port}/api/docs`);
  console.log(`🎙️ Live Voice WebSocket Gateway active on: ws://localhost:${port}/api/live`);
}

bootstrap();
