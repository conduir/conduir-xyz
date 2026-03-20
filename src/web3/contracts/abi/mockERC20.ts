/**
 * Mock ERC20 ABI
 *
 * Extends standard ERC20 with a mint function for testnet faucets.
 * The mint function allows anyone to mint tokens to their address for testing purposes.
 */

import { ERC20_ABI } from './erc20';

export const MOCK_ERC20_ABI = [
  ...ERC20_ABI,
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  }
] as const;

/**
 * Extract just the mint function for type safety
 */
export type MintFunction = typeof MOCK_ERC20_ABI extends readonly [
  ...infer _ERC20,
  { type: 'function'; name: 'mint'; inputs: infer _Inputs }
]
  ? (args: { to: `0x${string}`; amount: bigint }) => void
  : never;
