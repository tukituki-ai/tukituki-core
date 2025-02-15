import { Module } from '@nestjs/common';
import { DeFiController } from './controller';
import { DeFiService } from './service';
import { DeFiAgent } from './agent';
import { MultisigModule } from 'src/multisig/multisig.module';

@Module({
  imports: [MultisigModule],
  controllers: [DeFiController],
  providers: [DeFiService, DeFiAgent],
})
export class DeFiModule {} 