export interface ProtocolData {
  protocol: string;
  chain: string;
  asset: string;
  supplyAPY: number;
  borrowAPY: number;
  liquidity: string;
  timestamp: number;
}

export interface BridgeInfo {
  fromChain: string;
  toChain: string;
  asset: string;
  estimatedGas: string;
  bridgeTime: string;
  bridgeFee: string;
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