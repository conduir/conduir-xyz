import { useCallback, useState } from 'react';
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ABIS } from '../contracts/abi';
import { getContractAddress } from '../contracts/addresses';
import { polkadotTestnet } from '../config/chains';
import type { Address } from 'viem';
import { type LucideIcon, DollarSign, Circle, Square } from 'lucide-react';

/**
 * Faucet token configuration
 */
export interface FaucetToken {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  mintAmount: string;
  icon: LucideIcon;
  gradient: string;
}

/**
 * Available faucet tokens on Polkadot Hub TestNet
 */
export const FAUCET_TOKENS: FaucetToken[] = [
  {
    address: getContractAddress('mockUsdc'),
    symbol: 'USDC',
    name: 'Mock USDC',
    decimals: 6,
    mintAmount: '10000',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    address: getContractAddress('tokenA'),
    symbol: 'TKNA',
    name: 'Token A',
    decimals: 18,
    mintAmount: '1000',
    icon: Circle,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    address: getContractAddress('tokenB'),
    symbol: 'TKNB',
    name: 'Token B',
    decimals: 18,
    mintAmount: '1000',
    icon: Square,
    gradient: 'from-orange-500 to-amber-500',
  },
];

/**
 * Transaction state for faucet operations
 */
export type TransactionState = 'idle' | 'pending' | 'success' | 'error';

/**
 * Hook for faucet interactions
 *
 * Provides functions to mint test tokens and check balances
 */
export function useFaucet() {
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [txStates, setTxStates] = useState<Record<string, TransactionState>>({});

  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract();

  /**
   * Get token balance for an address
   */
  function useTokenBalance(tokenAddress: Address, owner?: Address) {
    const { data: balance, refetch, error: balanceError } = useReadContract({
      address: tokenAddress,
      abi: CONTRACT_ABIS.mockErc20,
      functionName: 'balanceOf',
      args: owner ? [owner] : undefined,
      chainId: polkadotTestnet.id,
      query: {
        enabled: !!owner,
        refetchInterval: 10_000, // Refetch every 10 seconds
      },
    });

    const { data: decimals = 18 } = useReadContract({
      address: tokenAddress,
      abi: CONTRACT_ABIS.erc20,
      functionName: 'decimals',
      chainId: polkadotTestnet.id,
    });

    const formattedBalance = balance !== undefined ? formatUnits(balance || 0n, decimals) : '0';

    return {
      balance,
      formattedBalance,
      decimals,
      refetch,
      error: balanceError,
    };
  }

  /**
   * Wait for transaction receipt
   */
  const { data: receipt, isLoading: isReceiptLoading } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    chainId: polkadotTestnet.id,
  });

  /**
   * Mint tokens to the specified address
   */
  const mintTokens = useCallback(
    async (tokenAddress: Address, to: Address, amount: string, decimals: number): Promise<`0x${string}`> => {
      const tokenKey = tokenAddress.toLowerCase();
      setTxStates(prev => ({ ...prev, [tokenKey]: 'pending' }));

      try {
        const amountToMint = parseUnits(amount, decimals);

        const hash = await writeContract({
          address: tokenAddress,
          abi: CONTRACT_ABIS.mockErc20,
          functionName: 'mint',
          args: [to, amountToMint],
          chain: polkadotTestnet,
        });

        setTxHash(hash);
        return hash;
      } catch (error) {
        setTxStates(prev => ({ ...prev, [tokenKey]: 'error' }));
        throw error;
      }
    },
    [writeContract]
  );

  /**
   * Mint a specific faucet token by symbol
   */
  const mintFaucetToken = useCallback(
    async (token: FaucetToken, to: Address): Promise<`0x${string}`> => {
      return mintTokens(token.address, to, token.mintAmount, token.decimals);
    },
    [mintTokens]
  );

  /**
   * Get transaction state for a specific token
   */
  const getTransactionState = useCallback(
    (tokenAddress: Address): TransactionState => {
      const tokenKey = tokenAddress.toLowerCase();
      return txStates[tokenKey] || 'idle';
    },
    [txStates]
  );

  /**
   * Reset transaction state for a token
   */
  const resetTransactionState = useCallback((tokenAddress: Address) => {
    const tokenKey = tokenAddress.toLowerCase();
    setTxStates(prev => {
      const newState = { ...prev };
      delete newState[tokenKey];
      return newState;
    });
  }, []);

  /**
   * Update transaction state after receipt
   */
  if (receipt && receipt.status === 'success') {
    // Find which token this tx was for and update state
    for (const token of FAUCET_TOKENS) {
      const tokenKey = token.address.toLowerCase();
      if (txStates[tokenKey] === 'pending') {
        setTxStates(prev => ({ ...prev, [tokenKey]: 'success' }));
        // Reset after 3 seconds
        setTimeout(() => {
          setTxStates(prev => {
            const newState = { ...prev };
            if (newState[tokenKey] === 'success') {
              delete newState[tokenKey];
            }
            return newState;
          });
        }, 3000);
        break;
      }
    }
  }

  return {
    useTokenBalance,
    mintTokens,
    mintFaucetToken,
    getTransactionState,
    resetTransactionState,
    txHash,
    receipt,
    isPending: isWritePending || isReceiptLoading,
    error: writeError,
  };
}

/**
 * Hook to get all faucet tokens with their balances
 */
export function useFaucetTokens(owner?: Address) {
  const { useTokenBalance } = useFaucet();

  const tokensWithBalances = FAUCET_TOKENS.map(token => {
    const { formattedBalance, balance, refetch, decimals } = useTokenBalance(
      token.address,
      owner
    );

    return {
      ...token,
      balance,
      formattedBalance,
      decimals,
      refetchBalance: refetch,
    };
  });

  /**
   * Refetch all token balances
   */
  const refetchAll = useCallback(() => {
    tokensWithBalances.forEach(token => {
      token.refetchBalance();
    });
  }, [tokensWithBalances]);

  return {
    tokens: tokensWithBalances,
    refetchAll,
  };
}
