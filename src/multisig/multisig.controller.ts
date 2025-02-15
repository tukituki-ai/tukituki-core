import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { MultisigService } from "./multisig.service";
import { CreateSafeDto } from "./dto/create-safe.dto";
import { ProposeTransactionDto } from "./dto/propose-transaction.dto";
import { ethers } from "ethers";
import { CreateMultipleSafesDto } from "./dto/create-multiple-safe.dto";

@Controller("multisig")
export class MultisigController {
  constructor(private multisigService: MultisigService) {}

  @Post("create")
  async createSafe(@Body() createSafeDto: CreateSafeDto) {
    const { chain, userAddress, signature } = createSafeDto;
    // Construct the message that the user should have signed.
    // Ensure that the message exactly matches what was signed on the client.
    const message = `Create safe for chain ${chain} with user ${userAddress}`;

    // Verify the signature using ethers.js
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
      throw new UnauthorizedException("Invalid signature.");
    }

    return this.multisigService.deployNewSafe(chain, userAddress);
  }

  @Post("create-multiple")
  async createMultipleSafes(@Body() data: CreateMultipleSafesDto) {
    const { userAddress, signature } = data;
    const message = `Deploy Safe for ${userAddress}`;

    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
        throw new UnauthorizedException("Invalid signature");
      }
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException("Signature verification failed");
    }

    console.log("Signature verified");

    const chains = ["ARBITRUM", "OPTIMISM", "AVALANCHE"] as const;
    const multisigAddresses = [];
    for (const chain of chains) {
      const multisigAddress = await this.multisigService.deployNewSafe(chain, userAddress);
      multisigAddresses.push({ chain, multisigAddress });
    }

    return multisigAddresses;
  }

  @Post("propose")
  async proposeTransaction(@Body() proposeTransactionDto: ProposeTransactionDto) {
    return this.multisigService.proposeTransaction(proposeTransactionDto.chain, proposeTransactionDto.userAddress, proposeTransactionDto.transaction);
  }
}
