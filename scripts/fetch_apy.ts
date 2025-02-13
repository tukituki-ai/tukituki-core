import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ethers } from 'ethers';
import { LendingData } from '../src/types/protocol';
import { ASSETS, CHAINS } from '../src/connectors/config';

dotenv.config();
async function fetchUniswapV3Pools(): Promise<LendingData[]> {
    const results: LendingData[] = [];

    for (const chain of CHAINS) {
        const provider = new ethers.JsonRpcProvider(process.env[`RPC_URL_${chain.toUpperCase()}`]);
        const uniswapFactoryAddress = process.env[`UNISWAP_V3_FACTORY_ADDRESS_${chain.toUpperCase()}`];
        
        if (!uniswapFactoryAddress) {
            console.error(`Uniswap V3 Factory address not set for chain: ${chain}`);
            continue;
        }

        const abiFilePath = "abi/uniswap/IUniswapV3Factory.json";
        const abi = JSON.parse(fs.readFileSync(abiFilePath, 'utf8'));
        const uniswapFactory = new ethers.Contract(uniswapFactoryAddress, abi, provider);

        const poolCount = await uniswapFactory.poolCount();
        for (let i = 0; i < poolCount; i++) {
            const poolAddress = await uniswapFactory.getPool(i);
            const poolAbiFilePath = "abi/uniswap/IUniswapV3Pool.json";
            const poolAbi = JSON.parse(fs.readFileSync(poolAbiFilePath, 'utf8'));
            const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);

            const [token0, token1, liquidity] = await Promise.all([
                poolContract.token0(),
                poolContract.token1(),
                poolContract.liquidity()
            ]);

            const token0Symbol = await new ethers.Contract(token0, ["function symbol() view returns (string)"], provider).symbol();
            const token1Symbol = await new ethers.Contract(token1, ["function symbol() view returns (string)"], provider).symbol();

            results.push({
                protocol: "uniswap_v3",
                chain: chain,
                asset: `${token0Symbol}-${token1Symbol}`,
                symbol: `${token0Symbol}-${token1Symbol}`,
                supplyAPY: 0, // Uniswap V3 pools do not have a supply APY
                borrowAPY: 0, // Uniswap V3 pools do not have a borrow APY
                liquidity: Number(ethers.formatUnits(liquidity, 18)),
                timestamp: Date.now(),
            });
        }
    }
    console.log(results);
    return results;
}

async function main() {
    
}

main();