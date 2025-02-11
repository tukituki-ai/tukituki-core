import { Controller, Post, Body, Get } from '@nestjs/common';
import { DeFiService } from './service';
import { ProtocolData, BridgeInfo } from '../types/protocol';
import { AaveConnector } from '../connectors/AaveConnector';

@Controller('defi')
export class DeFiController {
  constructor(private readonly defiService: DeFiService) {}

  @Get('strategy')
  async getStrategy(
    // @Body('protocolData') protocolData: ProtocolData[],
    // @Body('bridgeInfo') bridgeInfo: BridgeInfo[],
  ) {
    const connector = new AaveConnector();
    const protocolData = await connector.fetch();
    const strategy = await this.defiService.getStrategy(protocolData, []);
    return strategy;
  }

  @Post('validate')
  async validateStrategy(@Body() strategy: any) {
    const assessment = await this.defiService.validateStrategy(strategy);
    return assessment;
  }
} 