import * as dotenv from 'dotenv';
import { TokenAmountInfo } from '../types/protocol';
import { ASSETS, CHAINS, POOLS_NUMBER } from './config';
import { ethers } from 'ethers';

dotenv.config();

interface UserBalancesInfo {
    chain: string;
    tokenAddress: string;
    amount: number;
}

export class CoinGeckoConnector {

    async fetch(publicKey: string): Promise<TokenAmountInfo[]> {
        const results: TokenAmountInfo[] = [];

        for (const chain of CHAINS) {
            const provider = new ethers.JsonRpcProvider(process.env[`RPC_URL_${chain.toUpperCase()}`]);
            const tokenAddresses = ASSETS[chain as keyof typeof ASSETS];
            let coinGeckoChain = chain;
            if (coinGeckoChain === "avalanche") {
                coinGeckoChain = "avax";
            }
            const url = `https://pro-api.coingecko.com/api/v3/onchain/networks/${coinGeckoChain}/tokens/multi/${tokenAddresses.join(',')}`;

            const rawResponse = await fetch(url, {
                method: 'GET',
                headers: { 
                    'x-cg-pro-api-key': process.env.COINGECKO_API_KEY as string
                },
            });

            const response = await rawResponse.json();
            for (const token of response.data) {
                const tokenContract = new ethers.Contract(token.attributes.address, [
                    "function balanceOf(address owner) view returns (uint256)"
                ], provider);
                const amount = await tokenContract.balanceOf(publicKey);

                results.push({
                    token: {
                        chain,
                        asset: token.attributes.address,
                        symbol: token.attributes.symbol,
                        decimals: token.attributes.decimals
                    },
                    price: Number(token.attributes.price_usd),
                    amount: Number(amount),
                    timestamp: Date.now()
                });
            }
        }
        return results;
    }
}
