import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ethers } from 'ethers';

dotenv.config();

export class ActionHandler {

    private contractMiddlewareAddresses = {
        "arbitrum": "0x01C30BfA56e5c7B70CbbE0F85De5894e4b9c1316",
    };

    async handle(llmResponse: any) {
        console.log("llmResponse", llmResponse);
        const actions = llmResponse.actions;
        for (const action of actions) {
            if (action.lending_supply) {
                const actionInfo = action.lending_supply;
                const provider = new ethers.JsonRpcProvider(process.env[`RPC_URL_${actionInfo.chain.toUpperCase()}`]); 

                const abi = JSON.parse(fs.readFileSync("abi/AgentMiddleware.json", 'utf8'));
                const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
                const contract = new ethers.Contract(
                    this.contractMiddlewareAddresses[actionInfo.chain as keyof typeof this.contractMiddlewareAddresses], abi, signer
                );
                const tx = await contract.supplyAave(
                    BigInt(actionInfo.amount) * BigInt(10 ** actionInfo.decimals),
                    actionInfo.asset
                );
                await tx.wait();
                console.log(`Transaction successful with hash: ${tx.hash}`);
            }
        }
    }
}
