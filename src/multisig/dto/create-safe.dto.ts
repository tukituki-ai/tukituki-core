import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsIn } from "class-validator";
import { Chain, CHAINS } from "src/connectors/rpcConfig.service";

export class CreateSafeDto {
  @ApiProperty({
    description: "Blockchain chain on which the safe is deployed",
    enum: CHAINS,
    example: "ARBITRUM",
  })
  @IsString()
  @IsIn(CHAINS)
  chain: Chain;

  @ApiProperty({
    description: "User's wallet address",
    example: "0x49CD9Cad11Ff206E04a5919D131b316610a7fF98",
  })
  @IsString()
  userAddress: string;
}
