import { Module } from '@nestjs/common';
import { EscoController } from './esco.controller';
import { EscoService } from './esco.service';

@Module({
  controllers: [EscoController],
  providers: [EscoService],
  exports: [EscoService],
})
export class EscoModule {}
