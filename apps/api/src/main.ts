import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

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

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 BunkerStroy Enterprise NestJS API running on: http://localhost:${port}`);
  console.log(`📖 Swagger API Documentation live on: http://localhost:${port}/api/docs`);
}

bootstrap();
