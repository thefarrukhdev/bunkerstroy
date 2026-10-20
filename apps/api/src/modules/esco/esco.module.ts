import { Module } from '@nestjs/common';
import { EscoController } from './esco.controller';
import { EscoService } from './esco.service';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [EscoController],
  providers: [EscoService],
  exports: [EscoService],
})
export class EscoModule {}
