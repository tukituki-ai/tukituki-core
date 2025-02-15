import { Controller, Post, Body, Get } from '@nestjs/common';
import { DeFiService } from './service';
import { AaveConnector } from '../connectors/AaveConnector';
import { UniV3Connector } from 'src/connectors/UniV3Connector';
import { CoinGeckoConnector } from 'src/connectors/CoinGeckoConnector';
import { ethers } from 'ethers';
import { ActionHandler } from 'src/handlers/ActionHandler';
import { MultisigService } from 'src/multisig/multisig.service';

@Controller('defi')
export class DeFiController {
  constructor(private readonly defiService: DeFiService, private readonly multisigService: MultisigService) {}

  async fetchBalance(userAddress: string, tokenAddress: string, chain: string): Promise<number> {
    const provider = new ethers.providers.JsonRpcProvider(process.env[`RPC_URL_${chain.toUpperCase()}`]);
    const tokenContract = new ethers.Contract(tokenAddress, [
      "function balanceOf(address owner) view returns (uint256)"
    ], provider);
    const amount = await tokenContract.balanceOf(userAddress);
    return Number(amount);
  }

  @Get('strategy')
  async getStrategy(
    // @Body('protocolData') protocolData: ProtocolData[],
    // @Body('bridgeInfo') bridgeInfo: BridgeInfo[],
  ) {
    const lendingInfo = await new AaveConnector().fetch();
    const dexInfo = await new UniV3Connector().fetch();

    const allClients = await this.multisigService.getAllClients();
    for (const [userWallet, userInfo] of Object.entries(allClients)) {
      const tokensInfo = await new CoinGeckoConnector().fetch();
      for (const token of tokensInfo) {
        const multisigAddress = (userInfo as any).multisigAddress;
        token.amount = await this.fetchBalance(multisigAddress, token.token.asset, token.token.chain);
      }

      const strategy = await this.defiService.getStrategy(lendingInfo, dexInfo, [], tokensInfo);
      await new ActionHandler().handle(strategy, userWallet, this.multisigService, tokensInfo);
    }
    return true;
  }

  @Post('validate')
  async validateStrategy(@Body() strategy: any) {
    const assessment = await this.defiService.validateStrategy(strategy);
    return assessment;
  }
}
