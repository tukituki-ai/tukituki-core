import { Module } from '@nestjs/common';
import { DeFiController } from './controller';
import { DeFiService } from './service';
import { DeFiAgent } from './agent';

@Module({
  controllers: [DeFiController],
  providers: [DeFiService, DeFiAgent],
})
export class DeFiModule {} 