export interface ProtocolData {
  protocol: string;
  chain: string;
  asset: string;
  supplyAPY: number;
  borrowAPY: number;
  liquidity: string;
  timestamp: number;
}

export interface AgentResponse {
  action: 'supply' | 'borrow' | 'none';
  protocol: string;
  chain: string;
  asset: string;
  amount: string;
  reason: string;
  estimatedAPY: number;
}

export const SYSTEM_PROMPT = `You are a DeFi yield optimization expert. Your task is to analyze lending markets data and provide specific recommendations for liquidity allocation.

Your response must strictly follow this JSON format:
{
  "action": "supply" | "borrow" | "none",
  "protocol": "aave" | "compound",
  "chain": "arbitrum" | "optimism",
  "asset": "<asset symbol>",
  "amount": "<amount in USD>",
  "reason": "<brief explanation>",
  "estimatedAPY": <number>
}

Guidelines for recommendations:
1. Consider supply/borrow spreads across protocols
2. Account for gas costs between networks
3. Prioritize larger, more established pools
4. Consider impermanent loss risks
5. Suggest 'none' if no profitable opportunities exist
6. Focus on sustainable yields, not temporary spikes`;

export const formatMarketDataPrompt = (data: ProtocolData[]): string => {
  return `Current DeFi lending market conditions:

${data.map(market => `
Protocol: ${market.protocol} (${market.chain})
Asset: ${market.asset}
Supply APY: ${market.supplyAPY}%
Borrow APY: ${market.borrowAPY}%
Available Liquidity: ${market.liquidity}
`).join('\n')}

Based on this data, what is the most profitable and secure position to take? Consider gas costs and risks.`;
};

export const VALIDATION_PROMPT = `Analyze the following strategy for risks:

Strategy: {strategy}

Provide a risk assessment in the following format:
{
  "riskLevel": "low" | "medium" | "high",
  "concerns": string[],
  "proceed": boolean,
  "adjustments": string[]
}`;
