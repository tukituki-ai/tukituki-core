import { Module } from "@nestjs/common";
import { MultisigService } from "./multisig.service";
import { MultisigController } from "./multisig.controller";
import { RpcConfigService } from "src/connectors/rpcConfig.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  providers: [MultisigService, RpcConfigService, PrismaService],
  controllers: [MultisigController],
})
export class MultisigModule {}
