import { ProtocolData, BridgeInfo } from '../types/protocol.types';

export const formatMarketDataPrompt = (protocolData: ProtocolData[], bridgeInfo: BridgeInfo[]): string => {
  return `Current DeFi lending market conditions:

${protocolData.map(market => `
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