import { useCallback, useMemo } from 'react';
import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
  useWatchContractEvent,
} from 'wagmi';
import { getContractAddress } from '../contracts/addresses';
import { CONTRACT_ABIS } from '../contracts/abi';
import { useTransactionReceipt } from './useContract';
import type { Address } from 'viem';

/**
 * Collateral information interface
 */
export interface CollateralInfo {
  totalDeposited: bigint;
  totalLocked: bigint;
  available: bigint;
}

/**
 * Hook for CollateralManager contract interactions
 */
export function useCollateral() {
  const collateralManagerAddress = getContractAddress('collateralManager');

  /**
   * Get collateral info for a protocol
   */
  const getCollateral = useCallback(
    (protocol: Address) => {
      return useReadContract({
        address: collateralManagerAddress,
        abi: CONTRACT_ABIS.collateralManager,
        functionName: 'getCollateral',
        args: [protocol],
        query: {
          enabled: !!protocol,
        },
      });
    },
    [collateralManagerAddress]
  );

  /**
   * Get required collateral for a pool
   */
  const getRequiredCollateral = useCallback(
    (poolId: bigint) => {
      return useReadContract({
        address: collateralManagerAddress,
        abi: CONTRACT_ABIS.collateralManager,
        functionName: 'getRequiredCollateral',
        args: [poolId],
      });
    },
    [collateralManagerAddress]
  );

  /**
   * Lock collateral
   */
  const { writeContract, data: lockHash, isPending: isLockPending } =
    useWriteContract();

  const { receipt: lockReceipt, isSuccess: isLockSuccess } =
    useTransactionReceipt(lockHash);

  const lockCollateral = useCallback(
    async (protocol: Address, amount: bigint) => {
      // @ts-expect-error - wagmi writeContract types work at runtime
      return writeContract({
        address: collateralManagerAddress,
        abi: CONTRACT_ABIS.collateralManager,
        functionName: 'lockCollateral',
        args: [protocol, amount],
      });
    },
    [collateralManagerAddress, writeContract]
  );

  /**
   * Simulate lock collateral
   */
  const simulateLockCollateral = useCallback(
    (protocol: Address, amount: bigint) => {
      return useSimulateContract({
        address: collateralManagerAddress,
        abi: CONTRACT_ABIS.collateralManager,
        functionName: 'lockCollateral',
        args: [protocol, amount],
      });
    },
    [collateralManagerAddress]
  );

  /**
   * Unlock collateral
   */
  const { data: unlockHash, isPending: isUnlockPending } = useWriteContract();

  const { receipt: unlockReceipt, isSuccess: isUnlockSuccess } =
    useTransactionReceipt(unlockHash);

  const unlockCollateral = useCallback(
    async (protocol: Address, amount: bigint) => {
      // @ts-expect-error - wagmi writeContract types work at runtime
      return writeContract({
        address: collateralManagerAddress,
        abi: CONTRACT_ABIS.collateralManager,
        functionName: 'unlockCollateral',
        args: [protocol, amount],
      });
    },
    [collateralManagerAddress, writeContract]
  );

  /**
   * Simulate unlock collateral
   */
  const simulateUnlockCollateral = useCallback(
    (protocol: Address, amount: bigint) => {
      return useSimulateContract({
        address: collateralManagerAddress,
        abi: CONTRACT_ABIS.collateralManager,
        functionName: 'unlockCollateral',
        args: [protocol, amount],
      });
    },
    [collateralManagerAddress]
  );

  return {
    // Read functions
    getCollateral,
    getRequiredCollateral,

    // Lock collateral
    lockCollateral,
    simulateLockCollateral,
    lockHash,
    isLockPending,
    lockReceipt,
    isLockSuccess,

    // Unlock collateral
    unlockCollateral,
    simulateUnlockCollateral,
    unlockHash,
    isUnlockPending,
    unlockReceipt,
    isUnlockSuccess,

    // Address
    address: collateralManagerAddress,
  };
}

/**
 * Hook for collateral info of a specific protocol
 */
export function useProtocolCollateral(protocol: Address) {
  const collateralManagerAddress = getContractAddress('collateralManager');

  const { data: collateral, isLoading, refetch } = useReadContract({
    address: collateralManagerAddress,
    abi: CONTRACT_ABIS.collateralManager,
    functionName: 'getCollateral',
    args: [protocol],
    query: {
      enabled: !!protocol,
    },
  });

  const collateralInfo: CollateralInfo | null = useMemo(() => {
    if (!collateral) return null;
    return {
      totalDeposited: collateral[0],
      totalLocked: collateral[1],
      available: collateral[2],
    };
  }, [collateral]);

  return {
    collateral: collateralInfo,
    isLoading,
    refetch,
  };
}

/**
 * Hook for required collateral of a pool
 */
export function useRequiredCollateral(poolId: bigint) {
  const collateralManagerAddress = getContractAddress('collateralManager');

  const { data: required, isLoading, refetch } = useReadContract({
    address: collateralManagerAddress,
    abi: CONTRACT_ABIS.collateralManager,
    functionName: 'getRequiredCollateral',
    args: [poolId],
    query: {
      enabled: poolId > 0n,
    },
  });

  return {
    required: required || 0n,
    isLoading,
    refetch,
  };
}

/**
 * Hook for collateral events
 */
export function useCollateralEvents(
  eventName: 'CollateralLocked' | 'CollateralUnlocked',
  callback: (logs: any[]) => void,
  enabled = true
) {
  const collateralManagerAddress = getContractAddress('collateralManager');

  useWatchContractEvent({
    address: collateralManagerAddress,
    abi: CONTRACT_ABIS.collateralManager,
    eventName,
    onLogs: callback,
    enabled,
  });
}
