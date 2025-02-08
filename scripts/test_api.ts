import axios from 'axios';
import { ProtocolData, BridgeInfo, AgentResponse, RiskAssessment } from '../src/types/protocol';

const API_BASE_URL = 'http://localhost:3000/defi';

async function testDeFiAPI() {
  try {
    // Sample protocol data
    const protocolData: ProtocolData[] = [
      {
        protocol: 'aave',
        chain: 'arbitrum',
        asset: 'USDC',
        supplyAPY: 5.2,
        borrowAPY: 6.8,
        liquidity: '1000000',
        timestamp: Date.now()
      },
      {
        protocol: 'compound',
        chain: 'optimism',
        asset: 'USDC',
        supplyAPY: 4.8,
        borrowAPY: 7.2,
        liquidity: '800000',
        timestamp: Date.now()
      }
    ];

    // Sample bridge info
    const bridgeInfo: BridgeInfo[] = [
      {
        fromChain: 'arbitrum',
        toChain: 'optimism',
        asset: 'USDC',
        estimatedGas: '0.001',
        bridgeTime: '10min',
        bridgeFee: '0.1%'
      }
    ];

    console.log('🚀 Testing DeFi API...\n');

    // Test strategy endpoint
    console.log('1. Testing /strategy endpoint...');
    const strategyResponse = await axios.post<AgentResponse>(`${API_BASE_URL}/strategy`, {
      protocolData,
      bridgeInfo
    });

    console.log('Strategy Response:');
    console.log(JSON.stringify(strategyResponse.data, null, 2));
    console.log('\n-------------------\n');

    // Test validation endpoint
    console.log('2. Testing /validate endpoint...');
    const validationResponse = await axios.post<RiskAssessment>(`${API_BASE_URL}/validate`, 
      strategyResponse.data
    );

    console.log('Validation Response:');
    console.log(JSON.stringify(validationResponse.data, null, 2));

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data || error.message
      });
    } else {
      console.error('Error:', error);
    }
  }
}

// Add this to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

// Run the test
testDeFiAPI();