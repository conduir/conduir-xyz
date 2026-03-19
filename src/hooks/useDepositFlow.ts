import { useState, useCallback } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';
import { getContractAddress } from '../web3/contracts/addresses';
import { ERC20_ABI } from '../web3/contracts/abi';
import { useRouter } from '../web3/hooks/useRouter';
import type { Address } from 'viem';

export type DepositStep = 'amount' | 'approve-a' | 'approve-b' | 'confirm' | 'success';

export interface DepositState {
  step: DepositStep;
  amountA: string;
  amountB: string;
  lockDays: number;
  isSubmitting: boolean;
  error: string | null;
  txHash: string | null;
}

const POOL_ID = 0n;

const TOKEN_A = getContractAddress('tokenA');
const TOKEN_B = getContractAddress('tokenB');
const ROUTER  = getContractAddress('router');

export function useDepositFlow(userAddress?: Address, protocolAddress?: Address) {
  const [state, setState] = useState<DepositState>({
    step: 'amount',
    amountA: '',
    amountB: '',
    lockDays: 30,
    isSubmitting: false,
    error: null,
    txHash: null,
  });

  const { deposit } = useRouter();
  const { writeContractAsync } = useWriteContract();

  // Fetch decimals dynamically from token contracts
  const { data: decimalsA = 18 } = useReadContract({
    address: TOKEN_A, abi: ERC20_ABI, functionName: 'decimals',
  });
  const { data: decimalsB = 18 } = useReadContract({
    address: TOKEN_B, abi: ERC20_ABI, functionName: 'decimals',
  });

  const { data: allowanceA, refetch: refetchA } = useReadContract({
    address: TOKEN_A, abi: ERC20_ABI, functionName: 'allowance',
    args: userAddress ? [userAddress, ROUTER] : undefined,
    query: { enabled: !!userAddress },
  });
  const { data: allowanceB, refetch: refetchB } = useReadContract({
    address: TOKEN_B, abi: ERC20_ABI, functionName: 'allowance',
    args: userAddress ? [userAddress, ROUTER] : undefined,
    query: { enabled: !!userAddress },
  });
  const { data: balanceA, error: balanceAError } = useReadContract({
    address: TOKEN_A, abi: ERC20_ABI, functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });
  const { data: balanceB, error: balanceBError } = useReadContract({
    address: TOKEN_B, abi: ERC20_ABI, functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const set = (patch: Partial<DepositState>) => setState(prev => ({ ...prev, ...patch }));

  const goToStep = useCallback((step: DepositStep) => set({ step, error: null }), []);

  const validateAmounts = useCallback((): boolean => {
    const a = parseFloat(state.amountA);
    const b = parseFloat(state.amountB);
    if (!state.amountA || a <= 0) { set({ error: 'Enter a valid Token A amount' }); return false; }
    if (!state.amountB || b <= 0) { set({ error: 'Enter a valid Token B amount' }); return false; }
    if (balanceA && parseUnits(state.amountA, decimalsA) > balanceA) {
      set({ error: 'Insufficient Token A balance' }); return false;
    }
    if (balanceB && parseUnits(state.amountB, decimalsB) > balanceB) {
      set({ error: 'Insufficient Token B balance' }); return false;
    }
    return true;
  }, [state.amountA, state.amountB, balanceA, balanceB, decimalsA, decimalsB]);

  const proceedFromAmount = useCallback(() => {
    if (!validateAmounts()) return;
    const amtA = parseUnits(state.amountA, decimalsA);
    const needsA = !allowanceA || allowanceA < amtA;
    const amtB = parseUnits(state.amountB, decimalsB);
    const needsB = !allowanceB || allowanceB < amtB;
    if (needsA) { set({ step: 'approve-a', error: null }); return; }
    if (needsB) { set({ step: 'approve-b', error: null }); return; }
    set({ step: 'confirm', error: null });
  }, [validateAmounts, state.amountA, state.amountB, allowanceA, allowanceB, decimalsA, decimalsB]);

  const approveA = useCallback(async () => {
    set({ isSubmitting: true, error: null });
    try {
      // @ts-expect-error wagmi writeContractAsync types require chain/account at call site
      await writeContractAsync({
        address: TOKEN_A, abi: ERC20_ABI, functionName: 'approve',
        args: [ROUTER, 2n ** 256n - 1n],
      });
      await refetchA();
      const amtB = parseUnits(state.amountB, decimalsB);
      const needsB = !allowanceB || allowanceB < amtB;
      set({ isSubmitting: false, step: needsB ? 'approve-b' : 'confirm' });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Approval failed' });
    }
  }, [writeContractAsync, refetchA, state.amountB, allowanceB, decimalsB]);

  const approveB = useCallback(async () => {
    set({ isSubmitting: true, error: null });
    try {
      // @ts-expect-error wagmi writeContractAsync types require chain/account at call site
      await writeContractAsync({
        address: TOKEN_B, abi: ERC20_ABI, functionName: 'approve',
        args: [ROUTER, 2n ** 256n - 1n],
      });
      await refetchB();
      set({ isSubmitting: false, step: 'confirm' });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Approval failed' });
    }
  }, [writeContractAsync, refetchB]);

  const confirmDeposit = useCallback(async () => {
    if (!validateAmounts()) return;
    set({ isSubmitting: true, error: null });
    try {
      const amtA = parseUnits(state.amountA, decimalsA);
      const amtB = parseUnits(state.amountB, decimalsB);
      const lockDuration = BigInt(state.lockDays) * 86400n;
      const hash = await deposit(POOL_ID, protocolAddress ?? '0x0000000000000000000000000000000000000001', amtA, amtB, lockDuration);
      set({ isSubmitting: false, step: 'success', txHash: hash });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Deposit failed' });
    }
  }, [validateAmounts, state.amountA, state.amountB, state.lockDays, deposit, decimalsA, decimalsB]);

  const reset = useCallback(() => setState({
    step: 'amount', amountA: '', amountB: '', lockDays: 30,
    isSubmitting: false, error: null, txHash: null,
  }), []);

  // Provide better error messages for debugging
  const getBalanceError = () => {
    if (balanceAError) return `Token A error: ${balanceAError.message}`;
    if (balanceBError) return `Token B error: ${balanceBError.message}`;
    return null;
  };

  return {
    state,
    balanceA: balanceA ? formatUnits(balanceA, decimalsA) : '0',
    balanceB: balanceB ? formatUnits(balanceB, decimalsB) : '0',
    decimalsA,
    decimalsB,
    balanceError: getBalanceError(),
    actions: {
      setAmountA: (v: string) => set({ amountA: v, error: null }),
      setAmountB: (v: string) => set({ amountB: v, error: null }),
      setLockDays: (v: number) => set({ lockDays: v }),
      proceedFromAmount,
      approveA,
      approveB,
      confirmDeposit,
      goToStep,
      reset,
    },
  };
}
