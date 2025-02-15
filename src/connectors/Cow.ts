import { SupportedChainId, OrderKind, TradeParameters, TradingSdk, OrderBookApi } from '@cowprotocol/cow-sdk'
import { ethers, Contract } from 'ethers'


// Initialize the SDK
const sdk = new TradingSdk({
  chainId: SupportedChainId.ARBITRUM_ONE,
  signer: '',
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


async function main() {

    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/arbitrum')
    const signer = new ethers.Wallet('', provider)
    const weth = new Contract('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', approveAbi, signer)
    const relayerAddress = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110';

    // const tx = await weth.approve(relayerAddress, ethers.constants.MaxUint256);
    // console.log('tx', tx);
    // const receipt = await tx.wait();



    // const orderId = await sdk.postSwapOrder(parameters)
    const orderId = "0x7d78c80fbffb8cfe84e5db985bd876a248385602fd192fd18b5e896f7af25b268df424e487de4218b347e1798efa11a078fece9067afe6bb"

    console.log('Order created, id: ', orderId)

    const order = await orderBookApi.getOrder(orderId)

    const trades = await orderBookApi.getTrades({ orderUid: order.uid })

    console.log('order', order)
    console.log('trades', trades)
}

main()
