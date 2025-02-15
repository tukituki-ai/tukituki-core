import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEthereumAddress } from "class-validator";

export class CreateMultipleSafesDto {
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
