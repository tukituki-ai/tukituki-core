import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeFiAgent } from './agent';
import { ProtocolData, BridgeInfo, AgentResponse, RiskAssessment } from '../types/protocol';

@Injectable()
export class DeFiService {
  private readonly agent: DeFiAgent;

  constructor(private configService: ConfigService) {
    this.agent = new DeFiAgent(this.configService);
  }

  async getStrategy(
    protocolData: ProtocolData[],
    bridgeInfo: BridgeInfo[],
  ): Promise<AgentResponse> {
    return this.agent.getStrategyRecommendation(protocolData, bridgeInfo);
  }

  async validateStrategy(strategy: AgentResponse): Promise<RiskAssessment> {
    return this.agent.validateStrategy(strategy);
  }
} 