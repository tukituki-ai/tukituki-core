import { SupportedChainId, OrderKind, TradeParameters, TradingSdk, OrderBookApi, SigningScheme, OrderQuoteRequest, PriceQuality, OrderQuoteSideKindSell, OrderQuoteSideKindBuy, OrderParameters } from '@cowprotocol/cow-sdk'
import { getOrderToSign } from '@cowprotocol/cow-sdk'
import { ethers, Contract } from 'ethers'
import * as dotenv from 'dotenv';

dotenv.config();
// Initialize the SDK
const sdk = new TradingSdk({
  chainId: SupportedChainId.ARBITRUM_ONE,
  signer: process.env.PRIVATE_KEY as string,
  appCode: 'Decentralized CoW',
})

// Define trade parameters
const parameters: TradeParameters = {
  kind: OrderKind.BUY,
  sellToken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  sellTokenDecimals: 18,
  buyToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  buyTokenDecimals: 6,
  amount: '100000000'
}



// Post the order

const approveAbi = [
	{
	  inputs: [
		{ name: '_spender', type: 'address' },
		{ name: '_value', type: 'uint256' },
	  ],
	  name: 'approve',
	  outputs: [{ type: 'bool' }],
	  stateMutability: 'nonpayable',
	  type: 'function',
	},
  ];

  const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.ARBITRUM_ONE })

// async function getOrderToSign(  sellToken: string, 
//                                 buyToken: string, 
//                                 amount: string, 
//                                 receiver: string, 
//                                 validTo: string, 
//                                 kind: OrderKind, 
//                                 feeAmount: string) {
//     const orderParams: OrderParameters = {
//         sellToken: sellToken,
//         buyToken: buyToken,
//         receiver: null,
//         sellAmount: amount,
//         buyAmount: amount,
//         validTo: Math.floor(Date.now() / 1000) + 10,
//         kind: OrderKind.BUY,
//         feeAmount: '0',
//         appData: 'Decentralized CoW',
//         partiallyFillable: false,
//       }

// }

async function swapTokens(sellToken: string, buyToken: string, amount: string) {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/arbitrum')
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)
    const token_sold = new Contract(sellToken, approveAbi, signer)
    const relayerAddress = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110';

    const parameters: TradeParameters = {
        kind: OrderKind.BUY,
        sellToken: sellToken,
        sellTokenDecimals: 18,
        buyToken: buyToken,
        buyTokenDecimals: 6,
        amount: amount
      }

      const orderId = await sdk.postSwapOrder(parameters)
}

async function main() {

    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/arbitrum')
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)
    const weth = new Contract('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', approveAbi, signer)
    const relayerAddress = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110';

    // const tx = await weth.approve(relayerAddress, ethers.constants.MaxUint256);
    // console.log('tx', tx);
    // const receipt = await tx.wait();



    const orderId = await sdk.postSwapOrder(parameters)
    // const orderId = "0x7d78c80fbffb8cfe84e5db985bd876a248385602fd192fd18b5e896f7af25b268df424e487de4218b347e1798efa11a078fece9067afe6bb"

    console.log('Order created, id: ', orderId)

    const order = await orderBookApi.getOrder(orderId)

    const trades = await orderBookApi.getTrades({ orderUid: order.uid })

    console.log('order', order)
    console.log('trades', trades)
}

main()
