import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { BigNumber, ethers, utils } from 'ethers';
import { MultisigService } from 'src/multisig/multisig.service';
import { DexInfo, TokenAmountInfo } from 'src/types/protocol';
import { MetaTransactionData } from '@safe-global/types-kit';

dotenv.config();

export class BigNumberUtils {
    protected oneBN: BigNumber = utils.parseUnits("1", 18);
    constructor() {}

    public multiply(
        bn: BigNumber | string,
        number: number,
    ): BigNumber {
        const bnForSure = BigNumber.from(bn);
        const numberBN = utils.parseUnits(number.toString(), 18);

        return bnForSure.mul(numberBN).div(this.oneBN);
    }

    public divide(bn: BigNumber | string, number: number): BigNumber {
        const bnForSure = BigNumber.from(bn);
        const numberBN = utils.parseUnits(number.toString(), 18);

        return bnForSure.div(numberBN).div(this.oneBN);
    }
}

export class ActionHandler {

    private contractMiddlewareAddresses = {
        "arbitrum": "0x77c0518b2bde3F83F9B25f376E49299734497862",
        "optimism": "0x1b5949147D2BB411b1f99a61cC25068A86C42519",
        "avalanche": "0xC9850C7DE9CA210bA3A6c6900Cc86E2D9eB74Bb5",
    };

    async fetchMultisigPositions(multisigAddress: string, chain: string): Promise<any> {
        if (!this.contractMiddlewareAddresses[chain as keyof typeof this.contractMiddlewareAddresses]) {
            return [];
        }
        const provider = new ethers.providers.JsonRpcProvider(process.env[`RPC_URL_${chain.toUpperCase()}`]);
        const abi = JSON.parse(fs.readFileSync("abi/AgentMiddleware.json", 'utf8')).abi;
        const contract = new ethers.Contract(
            this.contractMiddlewareAddresses[chain as keyof typeof this.contractMiddlewareAddresses], abi, provider
        );
        const positions = await contract.balance(multisigAddress);
        return positions;
    }

    async fetchPositionAmounts(chain: string, multisigPositions: any) {
        if (!this.contractMiddlewareAddresses[chain as keyof typeof this.contractMiddlewareAddresses]) {
            return [];
        }
        const provider = new ethers.providers.JsonRpcProvider(process.env[`RPC_URL_${chain.toUpperCase()}`]);
        const abi = JSON.parse(fs.readFileSync("abi/AgentMiddleware.json", 'utf8')).abi;
        const contract = new ethers.Contract(
            this.contractMiddlewareAddresses[chain as keyof typeof this.contractMiddlewareAddresses], abi, provider
        );
        let result = [];
        for (const tokenId of multisigPositions.tokenIds) {
            const amounts = await contract.getAmountsByToken(tokenId);
            const poolAddress = await contract.tokenIdToPool(tokenId);
            result.push({
                amount0: amounts[0],
                amount1: amounts[1],
                poolAddress: poolAddress
            });
        }
        return result;
    }

    getTokenAddressBySymbol(symbol: string, chain: string, tokensInfo: TokenAmountInfo[]) {
        return tokensInfo.find(token => token.token.symbol === symbol && token.token.chain === chain)?.token.asset;
    }

    async createTx(action: any, userAddress: string, multisigService: MultisigService, tokensInfo: TokenAmountInfo[], dexInfo: DexInfo[]) {
        const abi = JSON.parse(fs.readFileSync("abi/AgentMiddleware.json", 'utf8')).abi;

        if (action.lending_supply) {
            const actionInfo = action.lending_supply;
            const decimals =  tokensInfo.find(token => token.token.symbol === actionInfo.asset && token.token.chain === actionInfo.chain)?.token.decimals!;

            const contract = new ethers.Contract(
                this.contractMiddlewareAddresses[actionInfo.chain as keyof typeof this.contractMiddlewareAddresses], abi
            );
            const tx = await contract.populateTransaction.supplyAave(
                new BigNumberUtils().multiply(BigNumber.from((10 ** decimals).toString()), actionInfo.amount),
                this.getTokenAddressBySymbol(actionInfo.asset, actionInfo.chain, tokensInfo)
            );
            const cookedTx: MetaTransactionData = {
                to: tx.to!,
                value: tx.value?.toString() || "0",
                data: tx.data!
            };
            await multisigService.proposeTransaction(actionInfo.chain.toUpperCase(), userAddress, cookedTx);
            return cookedTx;
        }
        if (action.lending_close) {
            const actionInfo = action.lending_supply;
            const decimals =  tokensInfo.find(token => token.token.symbol === actionInfo.asset && token.token.chain === actionInfo.chain)?.token.decimals!;
            const contract = new ethers.Contract(
                this.contractMiddlewareAddresses[actionInfo.chain as keyof typeof this.contractMiddlewareAddresses], abi
            );
            const tx = await contract.populateTransaction.withdrawAave(
                new BigNumberUtils().multiply(BigNumber.from((10 ** decimals).toString()), actionInfo.amount),
                this.getTokenAddressBySymbol(actionInfo.asset, actionInfo.chain, tokensInfo)
            );
            const cookedTx: MetaTransactionData = {
                to: tx.to!,
                value: tx.value?.toString() || "0",
                data: tx.data!
            };
            await multisigService.proposeTransaction(actionInfo.chain.toUpperCase(), userAddress, cookedTx);
            return cookedTx;
        }
        if (action.swap) {
            // todo
        }
        if (action.lp_position_open) {
            const actionInfo = action.lp_position_open;
            const decimals0 = tokensInfo.find(token => token.token.symbol === actionInfo.asset0 && token.token.chain === actionInfo.chain)?.token.decimals!;
            const decimals1 = tokensInfo.find(token => token.token.symbol === actionInfo.asset1 && token.token.chain === actionInfo.chain)?.token.decimals!;

            const contract = new ethers.Contract(this.contractMiddlewareAddresses[actionInfo.chain as keyof typeof this.contractMiddlewareAddresses], abi);

            const tokenAddress0 = this.getTokenAddressBySymbol(actionInfo.asset0, actionInfo.chain, tokensInfo);
            const tokenAddress1 = this.getTokenAddressBySymbol(actionInfo.asset1, actionInfo.chain, tokensInfo);
            const price0 = tokensInfo.find(token => token.token.symbol === actionInfo.asset0 && token.token.chain === actionInfo.chain)?.price!;
            const price1 = tokensInfo.find(token => token.token.symbol === actionInfo.asset1 && token.token.chain === actionInfo.chain)?.price!;
            const fee = dexInfo.find(dex => dex.token0.symbol === actionInfo.asset0 && dex.token1.symbol === actionInfo.asset1 && dex.chain === actionInfo.chain)?.fee!;
            const amount0 = new BigNumberUtils().multiply(BigNumber.from((10 ** decimals0).toString()), actionInfo.amountUSD / price0);
            const tx = await contract.populateTransaction.depositUniswap(
                amount0,
                "0",
                tokenAddress0,
                tokenAddress1,
                fee
            );
            const cookedTx: MetaTransactionData = {
                to: tx.to!,
                value: tx.value?.toString() || "0",
                data: tx.data!
            };
            await multisigService.proposeTransaction(actionInfo.chain.toUpperCase(), userAddress, cookedTx);
            return cookedTx;
        }
        if (action.lp_position_close) {
            // todo
        }
    }

    async handle(
        llmResponse: any, 
        userAddress: string, 
        multisigService: MultisigService, 
        tokensInfo: TokenAmountInfo[], 
        dexInfo: DexInfo[]
    ) {
        const actions = llmResponse.actions;

        for (const action of actions) {
            console.log(action);
            const tx = await this.createTx(action, userAddress, multisigService, tokensInfo, dexInfo);
            console.log(`Transaction proposed:`);
            console.log(tx);
        }
    }
}
