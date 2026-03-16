import React, { type ReactNode } from 'react';
import {
  WagmiProvider as WagmiCoreProvider,
  createConfig,
  http,
} from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { polkadotTestnet } from '../config/chains';

/**
 * WalletConnect Project ID
 * Get yours at https://cloud.walletconnect.com/
 */
const WALLET_CONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ||
  'a0c2c4b2f0e4d4e9b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8';

/**
 * RPC URL for Polkadot Testnet
 */
const RPC_URL =
  import.meta.env.VITE_POLKADOT_RPC_URL || 'https://eth-rpc.polkadot.io';

/**
 * Create Wagmi config
 */
const config = createConfig({
  chains: [polkadotTestnet],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'Conduir Protocol',
      appLogoUrl: 'https://conduir.xyz/icon.png',
    }),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: 'Conduir Protocol',
        description: 'Institutional liquidity infrastructure for Polkadot',
        url: 'https://conduir.xyz',
        icons: ['https://conduir.xyz/icon.png'],
      },
    }),
  ],
  ssr: true,
  transports: {
    [polkadotTestnet.id]: http(RPC_URL),
  },
});

/**
 * React Query client for wagmi
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

/**
 * Props for WagmiProvider
 */
interface WagmiProviderProps {
  children: ReactNode;
}

/**
 * Wagmi Provider Component
 *
 * Wraps the app with wagmi and React Query providers
 */
export function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <WagmiCoreProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiCoreProvider>
  );
}

/**
 * Export config for use in hooks
 */
export { config, queryClient };
