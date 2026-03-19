import { defineChain } from 'viem';

export const polkadotTestnet = defineChain({
  id: 420420417,
  name: 'Polkadot Hub TestNet',
  nativeCurrency: { decimals: 18, name: 'Paseo', symbol: 'PAS' },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_POLKADOT_RPC_URL || 'https://eth-rpc-testnet.polkadot.io/'],
      webSocket: ['wss://asset-hub-paseo-rpc.n.dwellir.com'],
    },
    public: {
      http: ['https://eth-rpc-testnet.polkadot.io/'],
    },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://blockscout-testnet.polkadot.io' },
  },
  testnet: true,
});

export const supportedChains = [polkadotTestnet] as const;
export type SupportedChain = (typeof supportedChains)[number];
