import { Body, Controller, Post } from "@nestjs/common";
import { MultisigService } from "./multisig.service";
import { CreateSafeDto } from "./dto/create-safe.dto";
import { ProposeTransactionDto } from "./dto/propose-transaction.dto";
import { ethers } from "ethers";

@Controller("multisig")
export class MultisigController {
  constructor(private multisigService: MultisigService) {}

  @Post("create")
  async createSafe(@Body() createSafeDto: CreateSafeDto) {
    return this.multisigService.deployNewSafe(createSafeDto.chain, createSafeDto.userAddress);
  }

  @Post("propose")
  async proposeTransaction(@Body() proposeTransactionDto: ProposeTransactionDto) {
    return this.multisigService.proposeTransaction(proposeTransactionDto.chain, proposeTransactionDto.userAddress, proposeTransactionDto.transaction);
  }
}
