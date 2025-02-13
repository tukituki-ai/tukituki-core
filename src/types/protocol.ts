export interface TokenInfo {
  chain: string;
  asset: string;
  symbol: string;
  decimals: number;
}

export interface UserLendingInfo {
  amountSupplied: number;
  amountBorrowed: number;
}

export interface UserDexInfo {
  amount0: number;
  amount1: number;
  outOfRange: boolean;
}

export interface LendingInfo {
  chain: string;
  lending: string;
  token: TokenInfo;
  supplyAPY: number;
  borrowAPY: number;
  liquidity: number;
  timestamp: number;
  userLendingInfo: UserLendingInfo | undefined;
}

export interface DexInfo {
  chain: string;
  dex: string;
  token0: TokenInfo;
  token1: TokenInfo;
  fee: number;
  tvl: number;
  volume_24h: number;
  timestamp: number;
  userDexInfo: UserDexInfo | undefined;
}

export interface BridgeInfo {
  fromChain: string;
  toChain: string;
  token: TokenInfo;
  estimatedGas: string;
  bridgeTime: string;
  bridgeFee: string;
}

export interface TokenAmountInfo {
  token: TokenInfo;
  price: number;
  amount: number;
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

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  concerns: string[];
  proceed: boolean;
  adjustments: string[];
} 