import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { ProtocolData } from '../src/types/protocol';
import { Connector } from '../src/connectors/Connector';
import { ASSETS, CHAINS } from '../src/connectors/config';
import {
    UiPoolDataProvider,
    UiIncentiveDataProvider,
    ChainId,
  } from '@aave/contract-helpers';
//   import * as markets from '@bgd-labs/aave-address-book';

dotenv.config();

function getChainMetadata(chain: string): {
    uiPoolDataProviderAddress: string;
    lendingPoolAddressProvider: string;
    chainId: ChainId;
} {
    switch (chain) {
        case 'arbitrum':
            return {
                uiPoolDataProviderAddress: "0x5c5228aC8BC1528482514aF3e27E692495148717",
                lendingPoolAddressProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
                chainId: 42161,
            }
        case 'optimism':
            return {
                uiPoolDataProviderAddress: "0xE92cd6164CE7DC68e740765BC1f2a091B6CBc3e4",
                lendingPoolAddressProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
                chainId: 10,
            }
        default:
            throw new Error(`Unsupported chain: ${chain}`);
    }
}

async function fetch(): Promise<ProtocolData[]> {
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
    }
    return results;
}

async function main() {
    const results = await fetch();
    console.log(results);
}

main();