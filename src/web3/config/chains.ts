import { defineChain } from 'viem';

/**
 * Polkadot Ethereum Toolkit Testnet
 * Chain ID: 1000
 */
export const polkadotTestnet = defineChain({
  id: 1000,
  name: 'Polkadot Asset Hub',
  network: 'polkadot-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'DOT',
    symbol: 'DOT',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_POLKADOT_RPC_URL || 'https://eth-rpc.polkadot.io'],
      webSocket: [import.meta.env.VITE_POLKADOT_WS_URL || 'wss://eth-rpc.polkadot.io'],
    },
    public: {
      http: ['https://eth-rpc.polkadot.io'],
      webSocket: ['wss://eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://explorer.polkadot.io' },
  },
  testnet: true,
});

/**
 * Add additional chains here for mainnet or other testnets
 */
export const supportedChains = [polkadotTestnet] as const;

export type SupportedChain = (typeof supportedChains)[number];
