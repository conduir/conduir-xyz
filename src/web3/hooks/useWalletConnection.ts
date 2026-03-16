import { useCallback, useEffect, useMemo } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useBalance,
  type Connector,
} from 'wagmi';
import { formatUnits } from 'viem';
import { polkadotTestnet } from '../config/chains';

/**
 * Wallet connection state
 */
export interface WalletConnectionState {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  chainId: number | undefined;
  chainName: string | undefined;
  balance: string | undefined;
  formattedBalance: string;
  connector: Connector | undefined;
  error: Error | null;
}

/**
 * Wallet connection actions
 */
export interface WalletConnectionActions {
  connect: (connector?: Connector) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: () => Promise<void>;
  refetchBalance: () => void;
}

/**
 * Hook for wallet connection management
 *
 * Provides a unified interface for wallet connection,
 * including address, balance, chain info, and connection actions.
 */
export function useWalletConnection(): [
  state: WalletConnectionState,
  actions: WalletConnectionActions,
] {
  const { address, isConnected, isConnecting, isDisconnected, chain, connector } =
    useAccount();

  const { connect: wagmiConnect, connectors, error: connectError } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  // Fetch native token balance
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address,
    chainId: polkadotTestnet.id,
  });

  /**
   * Format balance for display
   */
  const formattedBalance = useMemo(() => {
    if (!balanceData) return '0.00';
    return parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4);
  }, [balanceData]);

  /**
   * Connect wallet with auto connector selection
   */
  const connect = useCallback(
    async (connectorOverride?: Connector) => {
      try {
        // Use provided connector or try available connectors
        const connectorToUse =
          connectorOverride ||
          connectors.find((c) => c.id === 'injected') ||
          connectors[0];

        if (connectorToUse) {
          await wagmiConnect({ connector: connectorToUse });
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    },
    [wagmiConnect, connectors]
  );

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback(async () => {
    try {
      await wagmiDisconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }, [wagmiDisconnect]);

  /**
   * Switch to Polkadot testnet
   */
  const switchChain = useCallback(async () => {
    try {
      if (switchChainAsync && chain?.id !== polkadotTestnet.id) {
        await switchChainAsync({ chainId: polkadotTestnet.id });
      }
    } catch (error) {
      console.error('Failed to switch chain:', error);
      throw error;
    }
  }, [switchChainAsync, chain]);

  /**
   * Auto-switch to correct chain on mount
   */
  useEffect(() => {
    if (isConnected && chain?.id !== polkadotTestnet.id) {
      switchChain().catch(console.error);
    }
  }, [isConnected, chain, switchChain]);

  /**
   * Connection state
   */
  const state: WalletConnectionState = {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    chainId: chain?.id,
    chainName: chain?.name,
    balance: balanceData?.value.toString(),
    formattedBalance,
    connector,
    error: connectError,
  };

  /**
   * Connection actions
   */
  const actions: WalletConnectionActions = {
    connect,
    disconnect,
    switchChain,
    refetchBalance: () => refetchBalance(),
  };

  return [state, actions];
}

/**
 * Hook to check if user is on correct chain
 */
export function useIsCorrectChain(): boolean {
  const { chain } = useAccount();
  return chain?.id === polkadotTestnet.id;
}

/**
 * Hook to get chain name
 */
export function useChainName(): string {
  const { chain } = useAccount();
  return chain?.name || 'Unknown';
}
