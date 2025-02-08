import { Module } from '@nestjs/common';
import { DeFiController } from './defi.controller';
import { DeFiService } from './defi.service';
import { DeFiAgent } from './defi.agent';

@Module({
  controllers: [DeFiController],
  providers: [DeFiService, DeFiAgent],
})
export class DeFiModule {} 