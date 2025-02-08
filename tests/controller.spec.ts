import { Test, TestingModule } from '@nestjs/testing';
import { DeFiController } from '../src/core/controller';
import { DeFiService } from '../src/core/service';
import { ConfigService } from '@nestjs/config';
import { ProtocolData, BridgeInfo, AgentResponse, RiskAssessment } from '../src/types/protocol';

describe('DeFiController', () => {
  let controller: DeFiController;
  let service: DeFiService;

  const mockProtocolData: ProtocolData[] = [{
    protocol: 'aave',
    chain: 'arbitrum',
    asset: 'USDC',
    supplyAPY: 5.2,
    borrowAPY: 6.8,
    liquidity: '1000000',
    timestamp: Date.now()
  }];

  const mockBridgeInfo: BridgeInfo[] = [{
    fromChain: 'arbitrum',
    toChain: 'optimism',
    asset: 'USDC',
    estimatedGas: '0.001',
    bridgeTime: '10min',
    bridgeFee: '0.1%'
  }];

  const mockStrategy: AgentResponse = {
    action: 'supply',
    protocol: 'aave',
    chain: 'arbitrum',
    asset: 'USDC',
    amount: '10000',
    reason: 'High APY with low risk',
    estimatedAPY: 5.2
  };

  const mockAssessment: RiskAssessment = {
    riskLevel: 'low',
    concerns: ['Market volatility'],
    proceed: true,
    adjustments: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeFiController],
      providers: [
        {
          provide: DeFiService,
          useValue: {
            getStrategy: jest.fn().mockResolvedValue(mockStrategy),
            validateStrategy: jest.fn().mockResolvedValue(mockAssessment),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(process.env.OPENAI_API_KEY),
          },
        },
      ],
    }).compile();

    controller = module.get<DeFiController>(DeFiController);
    service = module.get<DeFiService>(DeFiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStrategy', () => {
    it('should return a strategy recommendation', async () => {
      const result = await controller.getStrategy(mockProtocolData, mockBridgeInfo);
      console.log(result);
      expect(result).toEqual(mockStrategy);
      expect(service.getStrategy).toHaveBeenCalledWith(mockProtocolData, mockBridgeInfo);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'getStrategy').mockRejectedValueOnce(new Error('API Error'));
      await expect(controller.getStrategy(mockProtocolData, mockBridgeInfo))
        .rejects
        .toThrow('API Error');
    });
  });

  describe('validateStrategy', () => {
    it('should return a risk assessment', async () => {
      const result = await controller.validateStrategy(mockStrategy);
      expect(result).toEqual(mockAssessment);
      expect(service.validateStrategy).toHaveBeenCalledWith(mockStrategy);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'validateStrategy').mockRejectedValueOnce(new Error('Validation Error'));
      await expect(controller.validateStrategy(mockStrategy))
        .rejects
        .toThrow('Validation Error');
    });
  });
});