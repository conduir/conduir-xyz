import { useCallback, useMemo } from 'react';
import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ABIS } from '../contracts/abi';
import { useTransactionReceipt } from './useContract';
import { getContractAddress } from '../contracts/addresses';
import type { Address } from 'viem';

/**
 * Token info interface
 */
export interface TokenInfo {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
}

/**
 * Hook for ERC20 token operations
 *
 * @param tokenAddress - The address of the ERC20 token
 */
export function useToken(tokenAddress: Address) {
  /**
   * Get token decimals
   */
  const { data: decimals = 18 } = useReadContract({
    address: tokenAddress,
    abi: CONTRACT_ABIS.erc20,
    functionName: 'decimals',
  });

  /**
   * Get token symbol
   */
  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: CONTRACT_ABIS.erc20,
    functionName: 'symbol',
  });

  /**
   * Get token name
   */
  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: CONTRACT_ABIS.erc20,
    functionName: 'name',
  });

  /**
   * Get token total supply
   */
  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: CONTRACT_ABIS.erc20,
    functionName: 'totalSupply',
  });

  /**
   * Token info object
   */
  const tokenInfo: TokenInfo = useMemo(
    () => ({
      address: tokenAddress,
      symbol: symbol || 'UNKNOWN',
      name: name || 'Unknown Token',
      decimals,
    }),
    [tokenAddress, symbol, name, decimals]
  );

  return { tokenInfo, totalSupply };
}

/**
 * Hook for token balance
 *
 * @param tokenAddress - The address of the ERC20 token
 * @param owner - The address to check balance for
 */
export function useTokenBalance(tokenAddress: Address, owner?: Address) {
  const { data: balance, refetch } = useReadContract({
    address: tokenAddress,
    abi: CONTRACT_ABIS.erc20,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    query: {
      enabled: !!owner,
    },
  });

  const { data: decimals = 18 } = useReadContract({
    address: tokenAddress,
    abi: CONTRACT_ABIS.erc20,
    functionName: 'decimals',
  });

  const formattedBalance = useMemo(() => {
    if (!balance) return '0';
    return formatUnits(balance, decimals);
  }, [balance, decimals]);

  return {
    balance,
    formattedBalance,
    decimals,
    refetch,
  };
}

/**
 * Hook for token allowance
 *
 * @param tokenAddress - The address of the ERC20 token
 * @param owner - The owner address
 * @param spender - The spender address
 */
export function useTokenAllowance(
  tokenAddress: Address,
  owner?: Address,
  spender?: Address
) {
  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: CONTRACT_ABIS.erc20,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: !!owner && !!spender,
    },
  });

  return {
    allowance,
    refetch,
  };
}

/**
 * Hook for token approval
 *
 * @param tokenAddress - The address of the ERC20 token
 */
export function useTokenApproval(tokenAddress: Address) {
  const { writeContractAsync, isPending, error } = useWriteContract();

  /**
   * Approve tokens for spending
   * Returns the transaction hash
   */
  const approve = useCallback(
    async (
      spender: Address,
      amount: string,
      decimals: number,
      unlimited = false
    ): Promise<`0x${string}`> => {
      const amountToApprove = unlimited
        ? 2n ** 256n - 1n
        : parseUnits(amount, decimals);

      // @ts-expect-error - wagmi types are complex and work at runtime
      return writeContractAsync({
        address: tokenAddress,
        abi: CONTRACT_ABIS.erc20,
        functionName: 'approve',
        args: [spender, amountToApprove],
      });
    },
    [tokenAddress, writeContractAsync]
  );

  /**
   * Simulate approval transaction
   */
  const simulateApproval = useCallback(
    (spender: Address, amount: string, decimals: number, unlimited = false) => {
      const amountToApprove = unlimited
        ? 2n ** 256n - 1n
        : parseUnits(amount, decimals);

      return useSimulateContract({
        address: tokenAddress,
        abi: CONTRACT_ABIS.erc20,
        functionName: 'approve',
        args: [spender, amountToApprove],
      });
    },
    [tokenAddress]
  );

  return {
    approve,
    simulateApproval,
    isPending,
    error,
  };
}

/**
 * Hook for multiple token balances
 *
 * @param tokenAddresses - Array of token addresses
 * @param owner - The owner address
 */
export function useTokenBalances(
  tokenAddresses: Address[],
  owner?: Address
) {
  const balances = useReadContract({
    address: tokenAddresses[0] || ('0x' as Address),
    abi: CONTRACT_ABIS.erc20,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    query: {
      enabled: false, // Disabled since we can't batch in this simple implementation
    },
  });

  // In production, use multicall here
  return { balances, refetch: balances.refetch };
}

/**
 * Hook for supported tokens in the protocol
 */
export function useSupportedTokens(owner?: Address) {
  const routerAddress = getContractAddress('router');

  // Mock USDC address (deployed contract)
  const mockUsdcAddress = getContractAddress('mockUsdc');

  // Define supported tokens
  const tokens = useMemo(
    () => [
      {
        address: mockUsdcAddress,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
      },
      // Add more tokens as they become available
    ],
    []
  );

  return { tokens };
}

/**
 * Utility to format token amount
 */
export function formatTokenAmount(
  amount: bigint | string,
  decimals: number
): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  return formatUnits(value, decimals);
}

/**
 * Utility to parse token amount
 */
export function parseTokenAmount(
  amount: string,
  decimals: number
): bigint {
  return parseUnits(amount, decimals);
}
