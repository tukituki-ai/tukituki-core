import { Controller, Post, Body, Get } from '@nestjs/common';
import { DeFiService } from './service';
import { AaveConnector } from '../connectors/AaveConnector';
import { UniV3Connector } from 'src/connectors/UniV3Connector';

@Controller('defi')
export class DeFiController {
  constructor(private readonly defiService: DeFiService) {}

  @Get('strategy')
  async getStrategy(
    // @Body('protocolData') protocolData: ProtocolData[],
    // @Body('bridgeInfo') bridgeInfo: BridgeInfo[],
  ) {
    const lendingInfo = await new AaveConnector().fetch();
    const dexInfo = await new UniV3Connector().fetch();
    const strategy = await this.defiService.getStrategy(lendingInfo, dexInfo, [], []);
    return null;
  }

  @Post('validate')
  async validateStrategy(@Body() strategy: any) {
    const assessment = await this.defiService.validateStrategy(strategy);
    return assessment;
  }
} 