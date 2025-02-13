import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { optimism, arbitrum, base, linea, avalanche } from "viem/chains";

export const CHAINS = ["ARBITRUM", "BASE", "LINEA", "OPTIMISM", "AVALANCHE"] as const;
export type Chain = (typeof CHAINS)[number];

@Injectable()
export class RpcConfigService {
  constructor(private configService: ConfigService) {}

  getRpcUrl(chain: Chain) {
    return this.configService.get(`RPC_URL_${chain.toUpperCase()}`);
  }

  getChainRpcUrl(chain: Chain) {
    switch (chain) {
      case "ARBITRUM":
        return this.configService.get("RPC_URL_ARBITRUM") || arbitrum.rpcUrls.default.http[0];
      case "BASE":
        return this.configService.get("RPC_URL_BASE") || base.rpcUrls.default.http[0];
      case "LINEA":
        return this.configService.get("RPC_URL_LINEA") || linea.rpcUrls.default.http[0];
      case "OPTIMISM":
        return this.configService.get("RPC_URL_OPTIMISM") || optimism.rpcUrls.default.http[0];
      case "AVALANCHE":
        return this.configService.get("RPC_URL_AVALANCHE") || avalanche.rpcUrls.default.http[0];
      default:
        throw new Error(`Chain ${chain} not supported`);
    }
  }

  getChain(chain: Chain) {
    switch (chain) {
      case "ARBITRUM":
        return arbitrum;
      case "BASE":
        return base;
      case "LINEA":
        return linea;
      case "OPTIMISM":
        return optimism;
      case "AVALANCHE":
        return avalanche;
      default:
        throw new Error(`Chain ${chain} not supported`);
    }
  }
}
