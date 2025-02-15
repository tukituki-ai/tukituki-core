import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsIn, IsEthereumAddress } from "class-validator";
import { Chain } from "@prisma/client";
import { CHAINS } from "src/connectors/rpcConfig.service";

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
  @IsEthereumAddress()
  userAddress: string;

  @ApiProperty({
    description: "Signature of the deployment message",
    example: "0x...",
  })
  @IsString()
  signature: string;
}
