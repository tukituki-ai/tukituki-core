import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeFiModule } from './defi/defi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DeFiModule,
  ],
})
export class AppModule {} 