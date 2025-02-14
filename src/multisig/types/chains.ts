export const CHAINS = ["ARBITRUM", "BASE", "LINEA", "OPTIMISM", "AVALANCHE"] as const;
export type Chain = (typeof CHAINS)[number];
