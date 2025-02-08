import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { 
  ProtocolData, 
  BridgeInfo, 
  AgentResponse, 
  RiskAssessment 
} from './types/protocol.types';
import { SYSTEM_PROMPT } from './prompts/system.prompt';
import { formatMarketDataPrompt, VALIDATION_PROMPT } from './prompts/market.prompt';

@Injectable()
export class DeFiAgent {
  private openai: OpenAI;
  model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async getStrategyRecommendation(
    protocolData: ProtocolData[], 
    bridgeInfo: BridgeInfo[]
  ): Promise<AgentResponse> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: SYSTEM_PROMPT + "\nPlease provide your response in JSON format." 
          },
          { 
            role: "user", 
            content: formatMarketDataPrompt(protocolData, bridgeInfo) + "\nRespond with a JSON object." 
          }
        ],
        model: this.model,
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0].message.content || '{}') as AgentResponse;
    } catch (error) {
      console.error('Error getting strategy:', error);
      throw error;
    }
  }

  async validateStrategy(strategy: AgentResponse): Promise<RiskAssessment> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: VALIDATION_PROMPT.replace('{strategy}', JSON.stringify(strategy, null, 2)) + 
                     "\nProvide your assessment in JSON format." 
          }
        ],
        model: this.model,
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0].message.content || '{}') as RiskAssessment;
    } catch (error) {
      console.error('Error validating strategy:', error);
      throw error;
    }
  }
} 