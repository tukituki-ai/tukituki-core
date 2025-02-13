import { Body, Controller, Post } from "@nestjs/common";
import { MultisigService } from "./multisig.service";
import { CreateSafeDto } from "./dto/create-safe.dto";

@Controller("multisig")
export class MultisigController {
  constructor(private multisigService: MultisigService) {}

  @Post("create")
  async createSafe(@Body() createSafeDto: CreateSafeDto) {
    return this.multisigService.deployNewSafe(createSafeDto.chain, createSafeDto.userAddress);
  }
}
