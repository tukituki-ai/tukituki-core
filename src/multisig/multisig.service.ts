import { Injectable } from "@nestjs/common";
import { Chain, RpcConfigService } from "src/connectors/rpcConfig.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import Safe from "@safe-global/protocol-kit";
import { createPublicClient } from "viem";
import { http } from "viem";
import { OperationType } from "@safe-global/types-kit";
import { MetaTransactionData } from "@safe-global/types-kit";
import SafeApiKit from "@safe-global/api-kit";
import { ethers } from "ethers";

@Injectable()
export class MultisigService {
  constructor(
    private rpcConfigService: RpcConfigService,
    private configService: ConfigService,
    private prismaService: PrismaService
  ) {}

  async deployNewSafe(chain: Chain, userAddress: string) {
    const isSafeAlreadyDeployed = await this.prismaService.userMultisig.findUnique({
      where: { userAddress_chain: { userAddress, chain } },
    });

    if (isSafeAlreadyDeployed) {
      throw new Error("A Safe multisig already exists for this user on this chain.");
    }

    const saltNonce = Math.trunc(Math.random() * 10 ** 10).toString();
    const protocolKit = await Safe.init({
      provider: this.rpcConfigService.getRpcUrl(chain),
      signer: this.configService.get("AGENT_PRIVATE_KEY") as `0x${string}`,
      predictedSafe: {
        safeAccountConfig: {
          owners: [this.configService.get("AGENT1_ADDRESS") as string, this.configService.get("AGENT2_ADDRESS") as string],
          threshold: 2,
        },
        safeDeploymentConfig: {
          saltNonce,
        },
      },
    });

    const safeAddress = await protocolKit.getAddress();

    const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction();

    const safeClient = await protocolKit.getSafeProvider().getExternalSigner();

    const transactionHash = await safeClient?.sendTransaction({
      to: deploymentTransaction.to,
      value: BigInt(deploymentTransaction.value),
      data: deploymentTransaction.data as `0x${string}`,
      chain: this.rpcConfigService.getChain(chain),
    });

    const publicClient = createPublicClient({
      chain: this.rpcConfigService.getChain(chain),
      transport: http(),
    });

    await publicClient?.waitForTransactionReceipt({
      hash: transactionHash as `0x${string}`,
    });

    await this.prismaService.userMultisig.create({
      data: {
        userAddress,
        chain,
        multisigAddress: safeAddress,
      },
    });

    return safeAddress;
  }

  async getSafeClient(chain: Chain, userAddress: string) {
    const safe = await this.prismaService.userMultisig.findUnique({
      where: { userAddress_chain: { userAddress, chain } },
    });

    if (!safe) {
      throw new Error("Safe not found");
    }

    return safe.multisigAddress;
  }

  async getAllClients() {
    const dbResponse = await this.prismaService.userMultisig.findMany();
    const result: any = {};
    for (const row of dbResponse) {
      result[row.userAddress] = {
        chain: row.chain,
        multisigAddress: row.multisigAddress,
      };
    }
    return result;
  }

  async logAction(chain: Chain, userAddress: string, action: string, multisigAddress: string) {
    await this.prismaService.actionLog.create({
      data: {
        chain,
        userAddress,
        action,
        multisigAddress,
      },
    });
  }

  async proposeTransaction(chain: Chain, userAddress: string, transaction: MetaTransactionData) {
    const safeAddress = await this.getSafeClient(chain, userAddress);
    console.log("safeAddress:", safeAddress);

    const protocolKitOwner = await Safe.init({
      provider: this.rpcConfigService.getRpcUrl(chain),
      signer: this.configService.get("AGENT_PRIVATE_KEY") as `0x${string}`,
      safeAddress,
    });

    const safeTransaction = await protocolKitOwner.createTransaction({
      transactions: [transaction],
    });

    const apiKit = new SafeApiKit({
      chainId: BigInt(this.rpcConfigService.getChain(chain).id),
    });

    const safeTxHash = await protocolKitOwner.getTransactionHash(safeTransaction);

    const senderSignature = await protocolKitOwner.signHash(safeTxHash);

    await apiKit.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: this.configService.get("AGENT1_ADDRESS") as string,
      senderSignature: senderSignature.data,
    });
  }
}
