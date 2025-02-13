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
  asset: string;
  supplyAPY: number;
  borrowAPY: number;
  liquidity: number;
  timestamp: number;
  userLendingInfo: UserLendingInfo | undefined;
}

export interface DexInfo {
  chain: string;
  dex: string;
  asset0: string;
  asset1: string;
  fee: number;
  tvl: number;
  apr: number;
  volume_24h: number;
  timestamp: number;
  userDexInfo: UserDexInfo | undefined;
}

export interface BridgeInfo {
  fromChain: string;
  toChain: string;
  asset: string;
  estimatedGas: string;
  bridgeTime: string;
  bridgeFee: string;
}

export interface TokenPriceInfo {
  chain: string;
  asset: string;
  price: number;
  timestamp: number;
}

export interface AvailableUserFunds {
  chain: string;
  asset: string;
  amount: number;
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