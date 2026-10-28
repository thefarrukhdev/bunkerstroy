import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@bunkerstroy/db';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('✅ PostgreSQL / Prisma connected successfully');
        return;
      } catch (err: any) {
        retries--;
        this.logger.warn(`Database connection attempt failed (${err?.message}). Retrying in ${delay}ms...`);
        if (retries === 0) {
          if (process.env.NODE_ENV === 'production') {
            this.logger.error('CRITICAL: Unable to connect to database in production environment. Terminating.');
            process.exit(1);
          } else {
            this.logger.warn('Database connection warning (running in flexible dev/test mode): ' + err?.message);
          }
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {
      // ignore disconnect errors
    }
  }
}
