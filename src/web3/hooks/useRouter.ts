import { useCallback } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { getContractAddress } from '../contracts/addresses';
import { ROUTER_ABI, CONSTANT_AMM_ABI } from '../contracts/abi';
import type { Address } from 'viem';

export function useRouter() {
  const routerAddress = getContractAddress('router');
  const { writeContractAsync, isPending } = useWriteContract();

  const deposit = useCallback(async (
    poolId: bigint,
    protocolAddress: Address,
    amountA: bigint,
    amountB: bigint,
    lockDuration: bigint,
  ): Promise<`0x${string}`> => {
    // @ts-expect-error wagmi writeContractAsync types require chain/account at call site
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'deposit',
      args: [poolId, protocolAddress, amountA, amountB, lockDuration],
    });
  }, [routerAddress, writeContractAsync]);

  const withdraw = useCallback(async (
    positionIndex: bigint,
    lpAmount: bigint,
  ): Promise<`0x${string}`> => {
    // @ts-expect-error wagmi writeContractAsync types require chain/account at call site
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'withdraw',
      args: [positionIndex, lpAmount],
    });
  }, [routerAddress, writeContractAsync]);

  return { deposit, withdraw, isPending };
}

export function usePoolInfo() {
  const ammAddress = getContractAddress('constantAMM');

  const { data: reserves, isLoading: reservesLoading, refetch } = useReadContract({
    address: ammAddress,
    abi: CONSTANT_AMM_ABI,
    functionName: 'getReserves',
    query: { refetchInterval: 30_000 },
  });

  const { data: ammPrice } = useReadContract({
    address: ammAddress,
    abi: CONSTANT_AMM_ABI,
    functionName: 'getPrice',
    query: { refetchInterval: 30_000 },
  });

  return {
    reserveA: reserves?.[0] ?? 0n,
    reserveB: reserves?.[1] ?? 0n,
    ammPrice: ammPrice ?? 0n,
    isLoading: reservesLoading,
    refetch,
  };
}

export function useLPBalance(owner?: Address) {
  const ammAddress = getContractAddress('constantAMM');

  const { data: balance, refetch } = useReadContract({
    address: ammAddress,
    abi: CONSTANT_AMM_ABI,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    query: { enabled: !!owner },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: ammAddress,
    abi: CONSTANT_AMM_ABI,
    functionName: 'allowance',
    args: owner ? [owner, getContractAddress('router')] : undefined,
    query: { enabled: !!owner },
  });

  const { writeContractAsync } = useWriteContract();

  const approveLPToken = useCallback(async (amount: bigint): Promise<`0x${string}`> => {
    // @ts-expect-error wagmi writeContractAsync types require chain/account at call site
    return writeContractAsync({
      address: ammAddress,
      abi: CONSTANT_AMM_ABI,
      functionName: 'approve',
      args: [getContractAddress('router'), amount],
    });
  }, [ammAddress, writeContractAsync]);

  return {
    balance: balance ?? 0n,
    allowance: allowance ?? 0n,
    approveLPToken,
    refetch,
    refetchAllowance,
  };
}
