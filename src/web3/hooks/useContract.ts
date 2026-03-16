import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { getContractAddress } from '../contracts/addresses';
import { CONTRACT_ABIS } from '../contracts/abi';
import type { Address } from 'viem';

/**
 * Base hook for contract reads
 *
 * @param contractKey - The key of the contract from CONTRACT_ADDRESSES
 * @param functionName - The name of the function to call
 * @param args - Arguments to pass to the function
 * @param options - Additional options
 */
export function useContractRead<T extends readonly unknown[]>(
  contractKey: keyof typeof CONTRACT_ABIS,
  functionName: string,
  args?: T,
  options?: {
    enabled?: boolean;
    address?: Address;
  }
) {
  const defaultAddress = getContractAddress(
    contractKey === 'erc20' ? 'router' : contractKey
  );

  return useReadContract({
    address: options?.address || defaultAddress,
    abi: CONTRACT_ABIS[contractKey],
    functionName: functionName as any,
    args: args as any,
    query: {
      enabled: options?.enabled !== false,
    },
  });
}

/**
 * Base hook for contract writes
 *
 * @param contractKey - The key of the contract from CONTRACT_ADDRESSES
 * @param functionName - The name of the function to call
 * @param options - Additional options
 */
export function useContractWrite(
  contractKey: keyof typeof CONTRACT_ABIS,
  functionName: string,
  options?: {
    address?: Address;
  }
) {
  const defaultAddress = getContractAddress(
    contractKey === 'erc20' ? 'router' : contractKey
  );

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const write = async (
    args?: readonly unknown[],
    overrides?: {
      value?: bigint;
    }
  ) => {
    // @ts-expect-error - wagmi writeContract types work at runtime
    return writeContract({
      address: options?.address || defaultAddress,
      abi: CONTRACT_ABIS[contractKey],
      functionName: functionName as any,
      args: args as any,
      ...(overrides?.value && { value: overrides.value }),
    });
  };

  return {
    write,
    data: hash,
    isPending,
    error,
  };
}

/**
 * Hook to wait for transaction receipt
 *
 * @param hash - Transaction hash
 */
export function useTransactionReceipt(hash?: `0x${string}`) {
  const { data, isLoading, isSuccess, error } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    receipt: data,
    isLoading,
    isSuccess,
    error,
  };
}

/**
 * Hook for batch contract reads (multicall simulation)
 * Note: This is a simplified version that makes multiple calls
 */
export function useContractReads<T extends Record<string, unknown>>(
  reads: T
): T {
  // This is a placeholder for multicall functionality
  // In production, you would use viem's multicall or a similar solution
  return reads;
}
