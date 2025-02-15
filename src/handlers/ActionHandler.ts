import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ethers } from 'ethers';
import { MultisigService } from 'src/multisig/multisig.service';
import { TokenAmountInfo } from 'src/types/protocol';

dotenv.config();

export class ActionHandler {

    private contractMiddlewareAddresses = {
        "arbitrum": "0x01C30BfA56e5c7B70CbbE0F85De5894e4b9c1316",
    };

    getTokenAddressBySymbol(symbol: string, chain: string, tokensInfo: TokenAmountInfo[]) {
        return tokensInfo.find(token => token.token.symbol === symbol && token.token.chain === chain)?.token.asset;
    }

    async createTx(action: any, userAddress: string, multisigService: MultisigService, tokensInfo: TokenAmountInfo[]) {
        const abi = JSON.parse(fs.readFileSync("abi/AgentMiddleware.json", 'utf8'));

        if (action.lending_supply) {
            const actionInfo = action.lending_supply;
            const contract = new ethers.Contract(
                this.contractMiddlewareAddresses[actionInfo.chain as keyof typeof this.contractMiddlewareAddresses], abi
            );
            const tx = await contract.supplyAave(
                BigInt(actionInfo.amount) * BigInt(10 ** actionInfo.decimals),
                this.getTokenAddressBySymbol(actionInfo.asset, actionInfo.chain, tokensInfo)
            );
            await multisigService.proposeTransaction(actionInfo.chain, userAddress, tx);
            return tx;
        }
        if (action.lending_close) {
            const actionInfo = action.lending_supply;
            const contract = new ethers.Contract(
                this.contractMiddlewareAddresses[actionInfo.chain as keyof typeof this.contractMiddlewareAddresses], abi
            );
            const tx = await contract.withdrawAave(
                BigInt(actionInfo.amount) * BigInt(10 ** actionInfo.decimals),
                this.getTokenAddressBySymbol(actionInfo.asset, actionInfo.chain, tokensInfo)
            );
            await multisigService.proposeTransaction(actionInfo.chain, userAddress, tx);
            return tx;
        }
        if (action.swap) {
            // todo
        }
        if (action.lp_position_open) {
            const actionInfo = action.lp_position_open;
            const contract = new ethers.Contract(
                this.contractMiddlewareAddresses[actionInfo.chain as keyof typeof this.contractMiddlewareAddresses], abi
            );
            const tx = await contract.withdrawAave(
                BigInt(actionInfo.amount) * BigInt(10 ** actionInfo.decimals),
                this.getTokenAddressBySymbol(actionInfo.asset, actionInfo.chain, tokensInfo)
            );
            await multisigService.proposeTransaction(actionInfo.chain, userAddress, tx);
            return tx;
        }
        if (action.lp_position_close) {
            // todo
        }
        
    }

    async handle(llmResponse: any, userAddress: string, multisigService: MultisigService, tokensInfo: TokenAmountInfo[]) {
        const actions = llmResponse.actions;

        for (const action of actions) {
            console.log(action);
            const tx = await this.createTx(action, userAddress, multisigService, tokensInfo);
            console.log(`Transaction proposed: ${tx.hash}`);

        }
    }
}
