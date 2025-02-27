import { LendingInfo, BridgeInfo, DexInfo, TokenAmountInfo } from '../types/protocol';

export const formatMarketDataPrompt = (
  lendingInfo: LendingInfo[],
  dexInfo: DexInfo[],
  bridgeInfo: BridgeInfo[],
  tokenAmountInfo: TokenAmountInfo[]
): string => {
  return JSON.stringify({
    message: "Current DeFi market conditions",
    data: {
      lendingInfo: lendingInfo.map(info => ({
        chain: info.chain,
        lending: info.lending,
        asset: info.token.symbol,
        supplyAPY: (info.supplyAPY * 100).toFixed(2).toString() + '%',
        borrowAPY: (info.borrowAPY * 100).toFixed(2).toString() + '%',
        liquidityUSD: Math.round(info.liquidity),
        userLendingInfo: info.userLendingInfo
      })),
      dexInfo: dexInfo.map(info => ({
        chain: info.chain,
        dex: info.dex,
        asset0: info.token0.symbol,
        asset1: info.token1.symbol,
        fee: info.fee,
        tvlUSD: Math.round(info.tvl),
        volume24hUSD: Math.round(info.volume_24h),
        userDexInfo: info.userDexInfo
      })),
      bridgeInfo,
      tokenAmountInfo: tokenAmountInfo.map(info => ({
        chain: info.token.chain,
        symbol: info.token.symbol,
        price: info.price,
        amount: info.amount / 10 ** info.token.decimals
      }))
    },
    question: "Based on this data, what is the most profitable and secure positions to take? Consider fees and risks."
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