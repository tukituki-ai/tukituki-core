import dotenv from 'dotenv';
import { DeFiAgent } from './services/agent';
import { ProtocolData, BridgeInfo } from './types/protocol';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY not found');
}

async function main(): Promise<void> {
  try {
    const agent = new DeFiAgent(process.env.OPENAI_API_KEY!);

    // TODO: Implement data fetching from Aave and Compound
    const protocolData: ProtocolData[] = [
      {
        protocol: 'aave',
        chain: 'arbitrum',
        asset: 'USDC',
        supplyAPY: 3.5,
        borrowAPY: 5.2,
        liquidity: '10000000',
        timestamp: Date.now()
      },
    ];

    const bridgeInfo: BridgeInfo[] = [
      {
        fromChain: 'arbitrum',
        toChain: 'optimism',
        asset: 'USDC',
        estimatedGas: '$2.50',
        bridgeTime: '5-10 minutes',
        bridgeFee: '$1.20'
      },
    ];

    // Get strategy recommendation
    const strategy = await agent.getStrategyRecommendation(protocolData, bridgeInfo);
    console.log('Recommended Strategy:', strategy);

    // Validate strategy
    const assessment = await agent.validateStrategy(strategy);
    if (!assessment.proceed) {
      console.log('Strategy validation failed:', assessment.concerns);
      return;
    }

    // TODO: Implement strategy execution based on action type
    console.log('Executing strategy...');
    
  } catch (error) {
    console.error('Error in main:', error);
  }
}

main(); 