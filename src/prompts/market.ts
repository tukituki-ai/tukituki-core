import { ProtocolData, BridgeInfo } from '../types/protocol';

export const formatMarketDataPrompt = (
  protocolData: ProtocolData[], 
  bridgeInfo: BridgeInfo[]
): string => {
  return `Current DeFi market conditions:

LENDING MARKETS:
${protocolData.map(market => `
Protocol: ${market.protocol} (${market.chain})
Asset: ${market.asset}
Supply APY: ${market.supplyAPY}%
Borrow APY: ${market.borrowAPY}%
Available Liquidity: ${market.liquidity}
`).join('\n')}

BRIDGE INFORMATION:
${bridgeInfo.map(bridge => `
Route: ${bridge.fromChain} → ${bridge.toChain}
Asset: ${bridge.asset}
Estimated Gas: ${bridge.estimatedGas}
Bridge Time: ${bridge.bridgeTime}
Bridge Fee: ${bridge.bridgeFee}
`).join('\n')}

Based on this data, what is the most profitable and secure position to take? Consider gas costs, bridge fees, and risks.`;
};

export const VALIDATION_PROMPT = `Analyze the following strategy for risks:

Strategy: {strategy}

Consider:
1. Protocol security
2. Bridge risks if applicable
3. Gas costs and bridge fees
4. Market volatility
5. Smart contract risks

Provide a risk assessment in the following format:
{
  "riskLevel": "low" | "medium" | "high",
  "concerns": string[],
  "proceed": boolean,
  "adjustments": string[]
}`; 