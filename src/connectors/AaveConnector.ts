import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { ProtocolData } from '../types/protocol';
import { Connector } from './Connector';
import { ASSETS, CHAINS } from './config';
import {
    UiPoolDataProvider,
    UiIncentiveDataProvider,
    ChainId,
  } from '@aave/contract-helpers';
  import * as markets from '@bgd-labs/aave-address-book';

dotenv.config();


function getChainMetadata(chain: string): {
    uiPoolDataProviderAddress: string;
    lendingPoolAddressProvider: string;
    chainId: ChainId;
} {
    switch (chain) {
        case 'arbitrum':
            return {
                uiPoolDataProviderAddress: markets.AaveV3Arbitrum.UI_POOL_DATA_PROVIDER,
                lendingPoolAddressProvider: markets.AaveV3Arbitrum.POOL_ADDRESSES_PROVIDER,
                chainId: ChainId.arbitrum_one,
            }
        case 'optimism':
            return {
                uiPoolDataProviderAddress: markets.AaveV3Optimism.UI_POOL_DATA_PROVIDER,
                lendingPoolAddressProvider: markets.AaveV3Optimism.POOL_ADDRESSES_PROVIDER,
                chainId: ChainId.optimism,
            }
        default:
            throw new Error(`Unsupported chain: ${chain}`);
    }
}

export class AaveConnector implements Connector {
    async fetch(): Promise<ProtocolData[]> {
        const results: ProtocolData[] = [];

        for (const chain of CHAINS) {
            const provider = new ethers.JsonRpcProvider(process.env[`RPC_URL_${chain.toUpperCase()}`]);
            
            const { uiPoolDataProviderAddress, lendingPoolAddressProvider, chainId } = getChainMetadata(chain);
            
            const poolDataProviderContract = new UiPoolDataProvider({
                uiPoolDataProviderAddress,
                provider,
                chainId,
              });
              
            const reserves = await poolDataProviderContract.getReservesHumanized({
                lendingPoolAddressProvider,
            });

            console.log(reserves);

            // for (const asset of ASSETS[chain as keyof typeof ASSETS]) {
            //     const reserveData = await lendingPoolContract.getReserveData(asset);
            //     console.log(reserveData);
                
            //     const liquidityIndex = reserveData[1];
            //     const currentLiquidityRate = reserveData[2];
            //     const variableBorrowIndex = reserveData[3];
            //     const currentVariableBorrowRate = reserveData[4];
            //     const aTokenAddress = reserveData[8];
            //     const variableDebtTokenAddress = reserveData[10];
            //     const accruedToTreasury = reserveData[12];

            //     console.log(`Liquidity Index: ${ethers.formatUnits(liquidityIndex, 27)}`);
            //     console.log(`Current Liquidity Rate: ${ethers.formatUnits(currentLiquidityRate, 27)}`);
            //     console.log(`Variable Borrow Index: ${ethers.formatUnits(variableBorrowIndex, 27)}`);
            //     console.log(`Variable Borrow Rate: ${ethers.formatUnits(currentVariableBorrowRate, 27)}`);
            //     console.log(`aToken Address: ${aTokenAddress}`);
            //     console.log(`Variable Debt Token Address: ${variableDebtTokenAddress}`);
            //     console.log(`Accrued to Treasury: ${ethers.formatUnits(accruedToTreasury, 6)} USDC`);

            //     // Fetch actual token balances
            //     const aToken = new ethers.Contract(aTokenAddress, ["function totalSupply() view returns (uint256)"], provider);
            //     const variableDebtToken = new ethers.Contract(variableDebtTokenAddress, ["function totalSupply() view returns (uint256)"], provider);

            //     const supplyRate = ethers.formatUnits(currentLiquidityRate, 25);
            //     const borrowRate = ethers.formatUnits(currentVariableBorrowRate, 25);

            //     const totalLiquidity = await aToken.totalSupply();
            //     console.log(aTokenAddress);
            //     console.log(lendingPoolAddress);
            //     const totalDebt = await variableDebtToken.totalSupply();

            //     console.log(`Total Liquidity: ${ethers.formatUnits(totalLiquidity, 6)} USDC`);
            //     console.log(`Total Borrowed: ${ethers.formatUnits(totalDebt, 6)} USDC`);
            //     console.log(`Available Liquidity: ${ethers.formatUnits(totalLiquidity - totalDebt, 6)} USDC`);

            //     results.push({
            //     protocol: 'aave',
            //     chain,
            //     asset: asset, // You may want to map this to a more readable name
            //     supplyAPY: parseFloat(supplyRate),
            //         borrowAPY: parseFloat(borrowRate),
            //         liquidity: 'N/A', // You can fetch liquidity if needed
            //         timestamp: Date.now(),
            //     });
            // }
        }

        return results;
    }
}
