import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OrdersModule } from './modules/orders/orders.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
import { EscoModule } from './modules/esco/esco.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CatalogModule,
    OrdersModule,
    LogisticsModule,
    EscoModule,
    PaymentsModule,
    AiModule,
    AdminModule,
  ],
})
export class AppModule {}
