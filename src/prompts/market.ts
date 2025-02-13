import { LendingInfo, BridgeInfo, DexInfo, TokenPriceInfo, AvailableUserFunds } from '../types/protocol';

export const formatMarketDataPrompt = (
  lendingInfo: LendingInfo[],
  dexInfo: DexInfo[],
  bridgeInfo: BridgeInfo[],
  tokenPriceInfo: TokenPriceInfo[],
  availableUserFunds: AvailableUserFunds[]
): string => {
  return JSON.stringify({
    message: "Current DeFi market conditions",
    data: {
      lendingInfo,
      dexInfo,
      bridgeInfo,
      tokenPriceInfo,
      availableUserFunds
    },
    question: "Based on this data, what is the most profitable and secure position to take? Consider gas costs and risks."
  }, null, 2);
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