import { Controller, Post, Body } from '@nestjs/common';
import { DeFiService } from './service';
import { ProtocolData, BridgeInfo } from '../types/protocol';

@Controller('defi')
export class DeFiController {
  constructor(private readonly defiService: DeFiService) {}

  @Post('strategy')
  async getStrategy(
    @Body('protocolData') protocolData: ProtocolData[],
    @Body('bridgeInfo') bridgeInfo: BridgeInfo[],
  ) {
    const strategy = await this.defiService.getStrategy(protocolData, bridgeInfo);
    return strategy;
  }

  @Post('validate')
  async validateStrategy(@Body() strategy: any) {
    const assessment = await this.defiService.validateStrategy(strategy);
    return assessment;
  }
} 