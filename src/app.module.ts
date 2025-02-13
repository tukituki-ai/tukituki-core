import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DeFiModule } from "./core/module";
import { MultisigModule } from "./multisig/multisig.module";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DeFiModule,
    MultisigModule,
    ConfigModule,
  ],
})
export class AppModule {}
