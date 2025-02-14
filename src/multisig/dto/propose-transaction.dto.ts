import { CHAINS } from "src/connectors/rpcConfig.service";

import { ApiProperty } from "@nestjs/swagger";
import { Chain } from "../types/chains";
import { IsEthereumAddress, IsHexadecimal, IsIn, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class TransactionDto {
  @ApiProperty({
    description: "Transaction to",
    example: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  })
  @IsString()
  to: string;

  @ApiProperty({
    description: "Transaction value",
    example: "0",
  })
  @IsString()
  value: string;

  @ApiProperty({
    description: "Transaction data",
    example: "0xa9059cbb00000000000000000000000049cd9cad11ff206e04a5919d131b316610a7ff9800000000000000000000000000000000000000000000000000000000000186a0",
  })
  @IsString()
  data: string;
}

export class ProposeTransactionDto {
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
    description: "Transaction details",
    type: TransactionDto,
  })
  @Type(() => TransactionDto)
  @ValidateNested()
  transaction: TransactionDto;
}
