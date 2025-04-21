import { Module } from '@nestjs/common';
import { DesController } from './des/des.controller';
import { DesService } from './des/des.service';

@Module({
  controllers: [DesController],
  providers: [DesService],
  exports: [DesService],
})
export class CryptoModule {}
