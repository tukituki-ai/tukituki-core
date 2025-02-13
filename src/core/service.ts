import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeFiAgent } from './agent';
import { LendingInfo, DexInfo, BridgeInfo, TokenAmountInfo, AgentResponse, RiskAssessment } from '../types/protocol';

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
    tokenAmountInfo: TokenAmountInfo[]
  ): Promise<boolean> {
    return this.agent.getStrategyRecommendation(lendingInfo, dexInfo, bridgeInfo, tokenAmountInfo);
  }

  async validateStrategy(strategy: AgentResponse): Promise<RiskAssessment> {
    return this.agent.validateStrategy(strategy);
  }
} 