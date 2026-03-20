import { useCallback } from 'react';
import { useReadContract, useWriteContract, useSimulateContract, useAccount } from 'wagmi';
import { getContractAddress } from '../contracts/addresses';
import { ROUTER_ABI, CONSTANT_AMM_ABI } from '../contracts/abi';
import { type Address, type Hex } from 'viem';
import { polkadotTestnet } from '../config/chains';

export function useRouter() {
  const { address } = useAccount();
  const routerAddress = getContractAddress('router');
  const { writeContractAsync, isPending } = useWriteContract();

  const deposit = useCallback(async (
    poolId: Hex,
    protocolAddress: Address,
    amountA: bigint,
    amountB: bigint,
    lockDuration: bigint,
  ): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'deposit',
      args: [poolId, protocolAddress, amountA, amountB, lockDuration],
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  const withdraw = useCallback(async (
    positionIndex: bigint,
    lpAmount: bigint,
  ): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'withdraw',
      args: [positionIndex, lpAmount],
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  const registerProtocol = useCallback(async (
    poolId: Hex,
    initialCollateral: bigint,
  ): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: routerAddress,
      abi: ROUTER_ABI,
      functionName: 'registerProtocol',
      args: [poolId, initialCollateral],
      account: address,
      chain: polkadotTestnet,
    });
  }, [routerAddress, writeContractAsync, address]);

  return { deposit, withdraw, registerProtocol, isPending };
}

export function usePoolInfo() {
  const ammAddress = getContractAddress('constantAMM');

  const { data: reserves, isLoading: reservesLoading, refetch } = useReadContract({
    address: ammAddress,
    abi: CONSTANT_AMM_ABI,
    functionName: 'getReserves',
    chainId: polkadotTestnet.id,
    query: { refetchInterval: 30_000 },
  });

  const { data: ammPrice } = useReadContract({
    address: ammAddress,
    abi: CONSTANT_AMM_ABI,
    functionName: 'getPrice',
    chainId: polkadotTestnet.id,
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
    chainId: polkadotTestnet.id,
    query: { enabled: !!owner },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: ammAddress,
    abi: CONSTANT_AMM_ABI,
    functionName: 'allowance',
    args: owner ? [owner, getContractAddress('router')] : undefined,
    chainId: polkadotTestnet.id,
    query: { enabled: !!owner },
  });

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const approveLPToken = useCallback(async (amount: bigint): Promise<`0x${string}`> => {
    return writeContractAsync({
      address: ammAddress,
      abi: CONSTANT_AMM_ABI,
      functionName: 'approve',
      args: [getContractAddress('router'), amount],
      account: address,
      chain: polkadotTestnet,
    });
  }, [ammAddress, writeContractAsync, address]);

  return {
    balance: balance ?? 0n,
    allowance: allowance ?? 0n,
    approveLPToken,
    refetch,
    refetchAllowance,
  };
}

/**
 * Simulation hook for estimating withdrawal results.
 * Note: Full receipt parsing to get actual return values requires
 * additional work with `waitForTransactionReceipt`.
 * This is tracked as a TODO for future enhancement.
 */
export function useSimulateWithdraw(positionIndex: bigint | null, lpAmount: bigint | null) {
  const routerAddress = getContractAddress('router');

  return useSimulateContract({
    address: routerAddress,
    abi: ROUTER_ABI,
    functionName: 'withdraw',
    args: positionIndex !== null && lpAmount !== null ? [positionIndex, lpAmount] : undefined,
    chainId: polkadotTestnet.id,
    query: { enabled: positionIndex !== null && lpAmount !== null },
  });
}

export function useComputePoolId(tokenA?: Address, tokenB?: Address) {
  const routerAddress = getContractAddress('router');
  const tokens = tokenA && tokenB 
    ? (tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA]) as readonly [Address, Address]
    : undefined;

  return useReadContract({
    address: routerAddress,
    abi: ROUTER_ABI,
    functionName: 'computePoolId',
    args: tokens,
    chainId: polkadotTestnet.id,
    query: { enabled: !!tokenA && !!tokenB },
  });
}
