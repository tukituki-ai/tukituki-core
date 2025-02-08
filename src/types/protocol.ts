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

export type ActionType = 'supply' | 'borrow' | 'bridge' | 'none';

export interface AgentResponse {
  action: ActionType;
  protocol: string;
  chain: string;
  targetChain?: string; // for bridge actions
  asset: string;
  amount: string;
  reason: string;
  estimatedAPY: number;
  estimatedGas?: string;
  bridgeDetails?: {
    bridge: string;
    estimatedTime: string;
    fee: string;
  };
}

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  concerns: string[];
  proceed: boolean;
  adjustments: string[];
} 