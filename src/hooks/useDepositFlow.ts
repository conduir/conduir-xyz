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
// Use a registered protocol address — for demo we use a placeholder; in production
// the user would pick from registered protocols. We use the zero address as a stand-in
// which the contract will reject — the UI should show the real registered protocol.
// For the testnet demo, we use the deployer/admin address as the protocol.
const PROTOCOL_ADDRESS = '0x0000000000000000000000000000000000000001' as Address;

const TOKEN_A = getContractAddress('tokenA');
const TOKEN_B = getContractAddress('tokenB');
const ROUTER  = getContractAddress('router');

const DECIMALS_A = 18;
const DECIMALS_B = 18;

export function useDepositFlow(userAddress?: Address) {
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
  const { data: balanceA } = useReadContract({
    address: TOKEN_A, abi: ERC20_ABI, functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });
  const { data: balanceB } = useReadContract({
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
    if (balanceA && parseUnits(state.amountA, DECIMALS_A) > balanceA) {
      set({ error: 'Insufficient Token A balance' }); return false;
    }
    if (balanceB && parseUnits(state.amountB, DECIMALS_B) > balanceB) {
      set({ error: 'Insufficient Token B balance' }); return false;
    }
    return true;
  }, [state.amountA, state.amountB, balanceA, balanceB]);

  const proceedFromAmount = useCallback(() => {
    if (!validateAmounts()) return;
    const amtA = parseUnits(state.amountA, DECIMALS_A);
    const needsA = !allowanceA || allowanceA < amtA;
    const amtB = parseUnits(state.amountB, DECIMALS_B);
    const needsB = !allowanceB || allowanceB < amtB;
    if (needsA) { set({ step: 'approve-a', error: null }); return; }
    if (needsB) { set({ step: 'approve-b', error: null }); return; }
    set({ step: 'confirm', error: null });
  }, [validateAmounts, state.amountA, state.amountB, allowanceA, allowanceB]);

  const approveA = useCallback(async () => {
    set({ isSubmitting: true, error: null });
    try {
      // @ts-expect-error wagmi writeContractAsync types require chain/account at call site
      await writeContractAsync({
        address: TOKEN_A, abi: ERC20_ABI, functionName: 'approve',
        args: [ROUTER, 2n ** 256n - 1n],
      });
      await refetchA();
      const amtB = parseUnits(state.amountB, DECIMALS_B);
      const needsB = !allowanceB || allowanceB < amtB;
      set({ isSubmitting: false, step: needsB ? 'approve-b' : 'confirm' });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Approval failed' });
    }
  }, [writeContractAsync, refetchA, state.amountB, allowanceB]);

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
      const amtA = parseUnits(state.amountA, DECIMALS_A);
      const amtB = parseUnits(state.amountB, DECIMALS_B);
      const lockDuration = BigInt(state.lockDays) * 86400n;
      const hash = await deposit(POOL_ID, PROTOCOL_ADDRESS, amtA, amtB, lockDuration);
      set({ isSubmitting: false, step: 'success', txHash: hash });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Deposit failed' });
    }
  }, [validateAmounts, state.amountA, state.amountB, state.lockDays, deposit]);

  const reset = useCallback(() => setState({
    step: 'amount', amountA: '', amountB: '', lockDays: 30,
    isSubmitting: false, error: null, txHash: null,
  }), []);

  return {
    state,
    balanceA: balanceA ? formatUnits(balanceA, DECIMALS_A) : '0',
    balanceB: balanceB ? formatUnits(balanceB, DECIMALS_B) : '0',
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
