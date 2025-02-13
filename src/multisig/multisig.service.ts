import { Injectable } from "@nestjs/common";
import { createSafeClient } from "@safe-global/sdk-starter-kit";
import { Chain, RpcConfigService } from "src/connectors/rpcConfig.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import Safe, { PredictedSafeProps, SafeAccountConfig } from "@safe-global/protocol-kit";
import { createPublicClient } from "viem";
import { http } from "viem";

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
    return this.prismaService.userMultisig.findUnique({
      where: { userAddress_chain: { userAddress, chain } },
    });
  }
}
