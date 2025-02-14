import { Controller, Post, Body, Get } from '@nestjs/common';
import { DeFiService } from './service';
import { AaveConnector } from '../connectors/AaveConnector';
import { UniV3Connector } from 'src/connectors/UniV3Connector';
import { CoinGeckoConnector } from 'src/connectors/CoinGeckoConnector';
import { ethers } from 'ethers';
import { ActionHandler } from 'src/handlers/ActionHandler';

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
    if (!process.env.AGENT_PRIVATE_KEY) {
      throw new Error('AGENT_PRIVATE_KEY is not defined');
    }
    const publicKey = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY).address;
    const tokensInfo = await new CoinGeckoConnector().fetch(publicKey);
    const strategy = await this.defiService.getStrategy(lendingInfo, dexInfo, [], tokensInfo);
    await new ActionHandler().handle(strategy);
    return strategy;
  }

  @Post('validate')
  async validateStrategy(@Body() strategy: any) {
    const assessment = await this.defiService.validateStrategy(strategy);
    return assessment;
  }
}
