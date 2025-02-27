import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { 
  BridgeInfo, 
  AgentResponse, 
  RiskAssessment, 
  LendingInfo,
  DexInfo,
  TokenAmountInfo
} from '../types/protocol';
import { SYSTEM_PROMPT } from '../prompts/system';
import { formatMarketDataPrompt, VALIDATION_PROMPT } from '../prompts/market';
import { ConfigService } from '@nestjs/config';
import { MultisigService } from 'src/multisig/multisig.service';

@Injectable()
export class DeFiAgent {
  private openai: OpenAI;
  model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  constructor(private configService: ConfigService, private multisigService: MultisigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not found');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async getStrategyRecommendation(
    lendingInfo: LendingInfo[], 
    dexInfo: DexInfo[], 
    bridgeInfo: BridgeInfo[], 
    tokenAmountInfo: TokenAmountInfo[]
  ): Promise<any> {
    try {
      // console.log(lendingInfo);
      // console.log(dexInfo);
      // console.log(bridgeInfo);
      // console.log(tokenAmountInfo);
      const requestBody = formatMarketDataPrompt(lendingInfo, dexInfo, bridgeInfo, tokenAmountInfo) + "\nRespond with a JSON object.";
      console.log(requestBody);
      const completion = await this.openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: SYSTEM_PROMPT + "\nPlease provide your response in a valid JSON format." 
          },
          { 
            role: "user", 
            content: requestBody
          }
        ],
        model: this.model,
        response_format: { type: "json_object" }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      return response;
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