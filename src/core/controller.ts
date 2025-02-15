import { Controller, Post, Body, Get } from '@nestjs/common';
import { DeFiService } from './service';
import { AaveConnector } from '../connectors/AaveConnector';
import { UniV3Connector } from 'src/connectors/UniV3Connector';
import { CoinGeckoConnector } from 'src/connectors/CoinGeckoConnector';
import { ethers } from 'ethers';
import { ActionHandler } from 'src/handlers/ActionHandler';
import { MultisigService } from 'src/multisig/multisig.service';
import { CHAINS } from 'src/connectors/config';

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

  getAaveUserLendingInfo(chain: string, tokenAddress: string, multisigPositions: any) {
    switch (chain) {
      case 'arbitrum': {
        if (tokenAddress.toLowerCase() === '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'.toLowerCase()) {
          return multisigPositions.aaveWeth;
        }
        if (tokenAddress.toLowerCase() === '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'.toLowerCase()) {
          return multisigPositions.aaveUsdc;
        }
        if (tokenAddress.toLowerCase() === '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f'.toLowerCase()) {
          return multisigPositions.aaveWbtc;
        }
        if (tokenAddress.toLowerCase() === '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'.toLowerCase()) {
          return multisigPositions.aaveUsdt;
        }
        break;
      }

      case 'optimism': {
        if (tokenAddress.toLowerCase() === '0x4200000000000000000000000000000000000006'.toLowerCase()) {
          return multisigPositions.aaveWeth;
        }
        if (tokenAddress.toLowerCase() === '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'.toLowerCase()) {
          return multisigPositions.aaveUsdc;
        }
        if (tokenAddress.toLowerCase() === '0x68f180fcCe6836688e9084f035309E29Bf0A2095'.toLowerCase()) {
          return multisigPositions.aaveWbtc;
        }
        if (tokenAddress.toLowerCase() === '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'.toLowerCase()) {
          return multisigPositions.aaveUsdt;
        }
        break;
      }

      case 'avalanche': {
        if (tokenAddress.toLowerCase() === '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB'.toLowerCase()) {
          return multisigPositions.aaveWeth;
        }
        if (tokenAddress.toLowerCase() === '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E'.toLowerCase()) {
          return multisigPositions.aaveUsdc;
        }
        if (tokenAddress.toLowerCase() === '0x50b7545627a5162f82a992c33b87adc75187b218'.toLowerCase()) {
          return multisigPositions.aaveWbtc;
        }
        if (tokenAddress.toLowerCase() === '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7'.toLowerCase()) {
          return multisigPositions.aaveUsdt;
        }
        break;
      }
    }
    return 0;
  }

  @Get('strategy')
  async getStrategy(
    // @Body('protocolData') protocolData: ProtocolData[],
    // @Body('bridgeInfo') bridgeInfo: BridgeInfo[],
  ) {
    const allClients = await this.multisigService.getAllClients();
    for (const [userWallet, userInfo] of Object.entries(allClients)) {
      const multisigAddress = (userInfo as any).multisigAddress;

      const lendingInfo = await new AaveConnector().fetch();
      const dexInfo = await new UniV3Connector().fetch();
      const tokensInfo = await new CoinGeckoConnector().fetch();
      const actionHandler = new ActionHandler();

      for (const chain of CHAINS) {
        const multisigPositions = await actionHandler.fetchMultisigPositions(multisigAddress, chain);
        
        for (let i = 0; i < lendingInfo.length; i++) {
          if (lendingInfo[i].chain.toLowerCase() !== chain.toLowerCase()) continue;
          lendingInfo[i].userLendingInfo = {
            amountSupplied: this.getAaveUserLendingInfo(chain, lendingInfo[i].token.asset, multisigPositions),
            amountBorrowed: 0
          };
        }
        
        const positionAmounts = await actionHandler.fetchPositionAmounts(chain, multisigPositions);

        for (let i = 0; i < dexInfo.length; i++) {
          if (dexInfo[i].chain.toLowerCase() !== chain.toLowerCase()) continue;
          const position = positionAmounts.find((position: any) => position.poolAddress.toLowerCase() === dexInfo[i].poolAddress.toLowerCase());
          if (position) {
            dexInfo[i].userDexInfo = {
              amount0: position.amount0,
              amount1: position.amount1,
              outOfRange: false
            };
          }
        }
      }

      for (let i = 0; i < tokensInfo.length; i++) {
        tokensInfo[i].amount = await this.fetchBalance(multisigAddress, tokensInfo[i].token.asset, tokensInfo[i].token.chain);
      }

      const strategy = await this.defiService.getStrategy(lendingInfo, dexInfo, [], tokensInfo);
      await actionHandler.handle(strategy, userWallet, this.multisigService, tokensInfo, dexInfo);
    }
    return true;
  }

  @Post('validate')
  async validateStrategy(@Body() strategy: any) {
    const assessment = await this.defiService.validateStrategy(strategy);
    return assessment;
  }
}
