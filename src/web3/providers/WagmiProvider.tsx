import React, { type ReactNode } from 'react';
import { WagmiProvider as WagmiCoreProvider, createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { polkadotTestnet } from '../config/chains';

const RPC_URL = import.meta.env.VITE_POLKADOT_RPC_URL || 'https://eth-rpc-testnet.polkadot.io/';
const WC_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'cb9875305ee3b6d452df9c3235492c0d';

export const config = createConfig({
  chains: [polkadotTestnet],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId: WC_PROJECT_ID,
      metadata: {
        name: 'Conduir Protocol',
        description: 'IL-protected liquidity for Polkadot',
        url: 'https://conduir.xyz',
        icons: ['https://conduir.xyz/icon.png'],
      },
    }),
  ],
  transports: { [polkadotTestnet.id]: http(RPC_URL) },
});

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 30_000 } },
});

export function WagmiProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiCoreProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiCoreProvider>
  );
}
