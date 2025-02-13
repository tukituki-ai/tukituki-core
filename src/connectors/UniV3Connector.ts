import * as dotenv from 'dotenv';
import { DexInfo } from '../types/protocol';
import { CHAINS, POOLS_NUMBER } from './config';

dotenv.config();

export class UniV3Connector {
    async fetch(): Promise<DexInfo[]> {
        const apiUrl = `https://interface.gateway.uniswap.org/v1/graphql`;
        const results: DexInfo[] = [];

        for (const chain of CHAINS) {
            const rawResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'origin': 'https://app.uniswap.org'
                },
                body: JSON.stringify({
                    query: `
                        {
                            topV3Pools(chain: ${chain.toUpperCase()}, first: ${POOLS_NUMBER}) {
                                address
                                feeTier
                                token0 {
                                    address
                                    decimals
                                    symbol
                                }
                                token1 {
                                    address
                                    decimals
                                    symbol
                                }
                                totalLiquidity {
                                    value
                                }
                                cumulativeVolume(duration: DAY) {
                                    value
                                }
                            }
                        }
                    `
                })
            });

            const response = await rawResponse.json();
            for (const pool of response.data.topV3Pools) {
                results.push({
                    chain,
                    dex: "uniswap",
                    token0: {
                        chain,
                        asset: pool.token0.address,
                        symbol: pool.token0.symbol,
                        decimals: pool.token0.decimals
                    },
                    token1: {
                        chain,
                        asset: pool.token1.address,
                        symbol: pool.token1.symbol,
                        decimals: pool.token1.decimals
                    },
                    fee: pool.feeTier,
                    tvl: pool.totalLiquidity.value,
                    volume_24h: pool.cumulativeVolume.value,
                    timestamp: Date.now(),
                    userDexInfo: undefined
                });
            }
        }
        return results;
    }
}
