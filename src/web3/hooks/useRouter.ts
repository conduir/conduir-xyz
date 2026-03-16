import { useCallback, useMemo } from 'react';
import {
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { getContractAddress } from '../contracts/addresses';
import { CONTRACT_ABIS } from '../contracts/abi';
import type { Address } from 'viem';

/**
 * Pool information interface
 */
export interface PoolInfo {
  id: bigint;
  tokenA: Address;
  tokenB: Address;
  feeRate: bigint;
}

/**
 * Position information interface
 */
export interface PositionInfo {
  owner: Address;
  poolId: bigint;
  amountA: bigint;
  amountB: bigint;
  lockStart: bigint;
  lockDuration: bigint;
  isActive: boolean;
}

/**
 * Hook for Router contract interactions
 */
export function useRouter() {
  const routerAddress = getContractAddress('router');

  /**
   * Get listing fee
   */
  const { data: listingFee, refetch: refetchListingFee } = useReadContract({
    address: routerAddress,
    abi: CONTRACT_ABIS.router,
    functionName: 'getListingFee',
  });

  /**
   * Get supported pools
   */
  const { data: pools, refetch: refetchPools } = useReadContract({
    address: routerAddress,
    abi: CONTRACT_ABIS.router,
    functionName: 'getSupportedPools',
  });

  /**
   * Write contract hooks
   */
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  /**
   * Execute deposit transaction
   * Returns the transaction hash
   */
  const deposit = useCallback(async (
    poolId: bigint,
    protocolAddress: Address,
    amountA: bigint,
    amountB: bigint,
    lockDuration: bigint
  ): Promise<`0x${string}`> => {
    // @ts-expect-error - wagmi types are complex and work at runtime
    return writeContractAsync({
      address: routerAddress,
      abi: CONTRACT_ABIS.router,
      functionName: 'deposit',
      args: [poolId, protocolAddress, amountA, amountB, lockDuration],
    });
  }, [routerAddress, writeContractAsync]);

  /**
   * Execute withdraw transaction
   */
  const withdraw = useCallback(async (
    positionIndex: bigint,
    lpAmount: bigint
  ): Promise<`0x${string}`> => {
    // @ts-expect-error - wagmi types are complex and work at runtime
    return writeContractAsync({
      address: routerAddress,
      abi: CONTRACT_ABIS.router,
      functionName: 'withdraw',
      args: [positionIndex, lpAmount],
    });
  }, [routerAddress, writeContractAsync]);

  /**
   * Execute register protocol transaction
   */
  const registerProtocol = useCallback(async (
    poolId: bigint,
    initialCollateral: bigint
  ): Promise<`0x${string}`> => {
    // @ts-expect-error - wagmi types are complex and work at runtime
    return writeContractAsync({
      address: routerAddress,
      abi: CONTRACT_ABIS.router,
      functionName: 'registerProtocol',
      args: [poolId, initialCollateral],
    });
  }, [routerAddress, writeContractAsync]);

  /**
   * Get formatted pools
   */
  const formattedPools = useMemo(() => {
    if (!pools) return [];
    return pools.map((pool) => ({
      id: pool.id,
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      feeRate: pool.feeRate,
    }));
  }, [pools]);

  return {
    // Read functions
    listingFee,
    pools: formattedPools,

    // Write functions
    deposit,
    withdraw,
    registerProtocol,

    // State
    isPending: isWritePending,

    // Refetch
    refetchListingFee,
    refetchPools,
  };
}

/**
 * Hook for a specific position
 */
export function usePosition(positionId: bigint) {
  const routerAddress = getContractAddress('router');

  const { data: position, isLoading, refetch } = useReadContract({
    address: routerAddress,
    abi: CONTRACT_ABIS.router,
    functionName: 'getPosition',
    args: [positionId],
    query: {
      enabled: positionId > 0n,
    },
  });

  return {
    position,
    isLoading,
    refetch,
  };
}

/**
 * Hook for listing fee
 */
export function useListingFee() {
  const routerAddress = getContractAddress('router');

  const { data: listingFee, isLoading, refetch } = useReadContract({
    address: routerAddress,
    abi: CONTRACT_ABIS.router,
    functionName: 'getListingFee',
  });

  return {
    listingFee,
    isLoading,
    refetch,
  };
}
