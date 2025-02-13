import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ethers } from 'ethers';
import { LendingInfo } from '../types/protocol';
import { AAVE_LENDING_POOL_ADDRESS_PROVIDER, AAVE_UI_POOL_DATA_PROVIDER, ASSETS, CHAINS } from './config';

dotenv.config();

export class AaveConnector {
    async fetch(): Promise<LendingInfo[]> {
        const results: LendingInfo[] = [];

        for (const chain of CHAINS) {
            const lendingPoolAddressProvider = AAVE_LENDING_POOL_ADDRESS_PROVIDER;
            const uiPoolDataProviderAddress = AAVE_UI_POOL_DATA_PROVIDER[chain as keyof typeof AAVE_UI_POOL_DATA_PROVIDER];
            
            const provider = new ethers.JsonRpcProvider(process.env[`RPC_URL_${chain.toUpperCase()}`]); 
            const abiFilePath = "abi/aave/IUiPoolDataProviderV3.json";
            const abi = JSON.parse(fs.readFileSync(abiFilePath, 'utf8'));
            const uiPoolDataProvider = new ethers.Contract(uiPoolDataProviderAddress, abi, provider);
    
            const reservesData = await uiPoolDataProvider.getReservesData(lendingPoolAddressProvider);
            for (const token of reservesData[0]) {
                const asset = token[0];
                if (!ASSETS[chain as keyof typeof ASSETS].filter(_asset => _asset.toLowerCase() === asset.toLowerCase()).length) {
                    continue;
                }
                results.push({
                    chain: chain,
                    lending: "aave",
                    token: {
                        chain: chain,
                        asset,
                        symbol: token[2],
                        decimals: Number(token[3]),
                    },
                    supplyAPY: Number(ethers.formatUnits(token[14], 27)),
                    borrowAPY: Number(ethers.formatUnits(token[15], 27)),
                    liquidity: Number(ethers.formatUnits(token[21], token[3])),
                    timestamp: Date.now(),
                    userLendingInfo: undefined,
                });
            }
        }
        return results;
    }
}
