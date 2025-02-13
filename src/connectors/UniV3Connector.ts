import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ethers } from 'ethers';
import { DexInfo } from '../types/protocol';
import { CHAINS, UNISWAP_V3_FACTORY_ADDRESS } from './config';

dotenv.config();

export class UniV3Connector {
    async fetch(): Promise<DexInfo[]> {
        const results: DexInfo[] = [];

        for (const chain of CHAINS) {
            const apiUrl = `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3-${chain}`;
            const query = `
                {
                    pools(first: 1000) {
                        id
                        token0 {
                            id
                        }
                        token1 {
                            id
                        }
                        feeTier
                        liquidity
                        volumeUSD
                    }
                }
            `;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            const pools = data.data.pools;

            for (const pool of pools) {
                const tvl = Number(ethers.formatUnits(pool.liquidity, 18));
                const apr = calculateAPR(pool.feeTier, pool.liquidity); // Assume calculateAPR is a function you have defined elsewhere
                const volume_24h = Number(pool.volumeUSD); // Assuming volumeUSD is the 24h volume

                results.push({
                    chain: chain,
                    dex: "uniswap_v3",
                    asset0: pool.token0.id,
                    asset1: pool.token1.id,
                    fee: Number(pool.feeTier),
                    tvl: tvl,
                    apr: apr,
                    volume_24h: volume_24h,
                    timestamp: Date.now(),
                    userDexInfo: undefined,
                });
            }
        }
        return results;
    }
}
