import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ethers } from 'ethers';
import { ProtocolData } from '../src/types/protocol';
import { ASSETS, CHAINS } from '../src/connectors/config';

dotenv.config();

function getChainMetadata(chain: string): {
    uiPoolDataProviderAddress: string;
    lendingPoolAddressProvider: string;
} {
    const lendingPoolAddressProvider = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb";
    switch (chain) {
        case 'arbitrum':
            return {
                uiPoolDataProviderAddress: "0x5c5228aC8BC1528482514aF3e27E692495148717",
                lendingPoolAddressProvider,
            }
        case 'optimism':
            return {
                uiPoolDataProviderAddress: "0xE92cd6164CE7DC68e740765BC1f2a091B6CBc3e4",
                lendingPoolAddressProvider,
            }
        case 'avalanche':
            return {
                uiPoolDataProviderAddress: "0x50B4a66bF4D41e6252540eA7427D7A933Bc3c088",
                lendingPoolAddressProvider,
            }
        default:
            throw new Error(`Unsupported chain: ${chain}`);
    }
}

async function fetch(): Promise<ProtocolData[]> {
    const results: ProtocolData[] = [];

    for (const chain of CHAINS) {
        const provider = new ethers.JsonRpcProvider(process.env[`RPC_URL_${chain.toUpperCase()}`]);
        const { uiPoolDataProviderAddress, lendingPoolAddressProvider } = getChainMetadata(chain);      
        const abiFilePath = "abi/aave/IUiPoolDataProviderV3.sol";
        const abi = JSON.parse(fs.readFileSync(abiFilePath, 'utf8'));
        const uiPoolDataProvider = new ethers.Contract(uiPoolDataProviderAddress, abi, provider);

        const reservesData = await uiPoolDataProvider.getReservesData(lendingPoolAddressProvider);
        for (const token of reservesData[0]) {
            console.log(ethers.formatUnits(token[14], 27));
            console.log(ethers.formatUnits(token[15], 27));
            console.log(ethers.formatUnits(token[21], token[3]));
            results.push({
                protocol: "aave",
                chain: chain,
                asset: token[0],
                symbol: token[2],
                supplyAPY: Number(ethers.formatUnits(token[14], 27)),
                borrowAPY: Number(ethers.formatUnits(token[15], 27)),
                liquidity: Number(ethers.formatUnits(token[21], token[3])),
                timestamp: Date.now(),
            });
        }
    }
    console.log(results);
    return results;
}

async function main() {
    const results = await fetch();
    console.log(results);
}

main();