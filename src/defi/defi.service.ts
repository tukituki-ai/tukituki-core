import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeFiAgent } from './defi.agent';
import { ProtocolData, BridgeInfo, AgentResponse, RiskAssessment } from './types/protocol.types';

@Injectable()
export class DeFiService {
  private readonly agent: DeFiAgent;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not found');
    }
    this.agent = new DeFiAgent(apiKey);
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