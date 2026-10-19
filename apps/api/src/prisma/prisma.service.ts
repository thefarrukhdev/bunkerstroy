import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@bunkerstroy/db';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ PostgreSQL / Prisma connected successfully');
    } catch (err) {
      console.warn('Database connection warning (running in flexible mode):', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
