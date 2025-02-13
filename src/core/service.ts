import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeFiAgent } from './agent';
import { LendingInfo, DexInfo, BridgeInfo, TokenPriceInfo, AgentResponse, RiskAssessment, AvailableUserFunds } from '../types/protocol';

@Injectable()
export class DeFiService {
  private readonly agent: DeFiAgent;

  constructor(private configService: ConfigService) {
    this.agent = new DeFiAgent(this.configService);
  }

  async getStrategy(
    lendingInfo: LendingInfo[],
    dexInfo: DexInfo[],
    bridgeInfo: BridgeInfo[],
    tokenPriceInfo: TokenPriceInfo[],
    availableUserFunds: AvailableUserFunds[]
  ): Promise<AgentResponse> {
    return this.agent.getStrategyRecommendation(lendingInfo, dexInfo, bridgeInfo, tokenPriceInfo, availableUserFunds);
  }

  async validateStrategy(strategy: AgentResponse): Promise<RiskAssessment> {
    return this.agent.validateStrategy(strategy);
  }
} 