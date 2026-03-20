import { useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { getContractAddress } from '../contracts/addresses';
import { ROUTER_ABI } from '../contracts/abi';
import { type Address } from 'viem';
import { polkadotTestnet } from '../config/chains';

/**
 * Admin hook for Router contract administrative functions.
 * These functions can only be called by the contract owner.
 */
export function useRouterAdmin() {
  const { address } = useAccount();
  const routerAddress = getContractAddress('router');
  const { writeContractAsync } = useWriteContract();

  const { data: owner } = useReadContract({
    address: routerAddress,
    abi: ROUTER_ABI,
    functionName: 'owner',
    chainId: polkadotTestnet.id,
  });

  const { data: currentListingFee, refetch: refetchListingFee } = useReadContract({
    address: routerAddress,
    abi: ROUTER_ABI,
    functionName: 'listingFeeAmount',
    chainId: polkadotTestnet.id,
  });

  const { data: currentMonthlyFee } = useReadContract({
    address: routerAddress,
    abi: ROUTER_ABI,
    functionName: 'monthlyFeeAmount',
    chainId: polkadotTestnet.id,
  });

  const { data: isPaused } = useReadContract({
    address: routerAddress,
    abi: ROUTER_ABI,
    functionName: 'paused',
    chainId: polkadotTestnet.id,
  });

  /**
   * Set the listing fee amount.
   * For USDC with 6 decimals: 100 USDC = 100 * 10^6 = 100000000
   */
  const setListingFeeAmount = useCallback(async (
    amount: bigint,
  ): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'setListingFeeAmount',
      args: [amount],
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  /**
   * Set the monthly fee amount.
   */
  const setMonthlyFeeAmount = useCallback(async (
    amount: bigint,
  ): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'setMonthlyFeeAmount',
      args: [amount],
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  /**
   * Set the treasury address.
   */
  const setTreasury = useCallback(async (
    treasury: Address,
  ): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'setTreasury',
      args: [treasury],
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  /**
   * Pause the contract (emergency stop).
   */
  const pause = useCallback(async (): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'pause',
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  /**
   * Unpause the contract.
   */
  const unpause = useCallback(async (): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'unpause',
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  /**
   * Set minimum lock duration.
   */
  const setMinLockDuration = useCallback(async (
    duration: bigint,
  ): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'setMinLockDuration',
      args: [duration],
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  /**
   * Set maximum lock duration.
   */
  const setMaxLockDuration = useCallback(async (
    duration: bigint,
  ): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'setMaxLockDuration',
      args: [duration],
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  return {
    // State
    owner,
    currentListingFee: currentListingFee ?? 0n,
    currentMonthlyFee: currentMonthlyFee ?? 0n,
    isPaused: isPaused ?? false,
    isOwner: address?.toLowerCase() === owner?.toLowerCase(),

    // Admin functions
    setListingFeeAmount,
    setMonthlyFeeAmount,
    setTreasury,
    pause,
    unpause,
    setMinLockDuration,
    setMaxLockDuration,

    // Utilities
    refetchListingFee,
  };
}
