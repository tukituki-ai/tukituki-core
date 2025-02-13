export const CHAINS = [
    'arbitrum',
    'optimism',
    'avalanche',
];

export const ASSETS = {
  arbitrum: [
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' // WETH
  ],
  optimism: [
    '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC
    '0x4200000000000000000000000000000000000006', // WETH
  ],
};

// Aave
export const AAVE_LENDING_POOL_ADDRESS_PROVIDER = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb";

export const AAVE_UI_POOL_DATA_PROVIDER = {
    arbitrum: "0x5c5228aC8BC1528482514aF3e27E692495148717",
    optimism: "0xE92cd6164CE7DC68e740765BC1f2a091B6CBc3e4",
    avalanche: "0x50B4a66bF4D41e6252540eA7427D7A933Bc3c088",
}

// UniV3
export const POOLS_NUMBER = 10;
