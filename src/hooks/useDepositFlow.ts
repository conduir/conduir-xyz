import { useState, useCallback } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';
import { getContractAddress } from '../web3/contracts/addresses';
import { ERC20_ABI } from '../web3/contracts/abi';
import { useRouter, useComputePoolId } from '../web3/hooks/useRouter';
import { polkadotTestnet } from '../web3/config/chains';
import type { Address, Hex } from 'viem';

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

const PROTOCOL_ADDRESS: Address = '0x16003e90Ddca83c96751ce5A6cF984aB624870E9';

const TOKEN_A = getContractAddress('tokenA');
const TOKEN_B = getContractAddress('tokenB');
const ROUTER  = getContractAddress('router');

export function useDepositFlow(userAddress?: Address, protocolAddress?: Address) {
  const [state, setState] = useState<DepositState>({
    step: 'amount',
    amountA: '',
    amountB: '',
    lockDays: 0,
    isSubmitting: false,
    error: null,
    txHash: null,
  });

  const { deposit } = useRouter();
  const { data: poolId, isLoading: poolIdLoading, error: poolIdError } = useComputePoolId(TOKEN_A, TOKEN_B);
  const { writeContractAsync } = useWriteContract();

  // Updated to 6 decimals as per user requirement
  const decimalsA = 6;
  const decimalsB = 6;

  const { data: allowanceA, refetch: refetchA } = useReadContract({
    address: TOKEN_A, abi: ERC20_ABI, functionName: 'allowance',
    args: userAddress ? [userAddress, ROUTER] : undefined,
    chainId: polkadotTestnet.id,
    query: { enabled: !!userAddress },
  });
  const { data: allowanceB, refetch: refetchB } = useReadContract({
    address: TOKEN_B, abi: ERC20_ABI, functionName: 'allowance',
    args: userAddress ? [userAddress, ROUTER] : undefined,
    chainId: polkadotTestnet.id,
    query: { enabled: !!userAddress },
  });
  const { data: balanceA, error: balanceAError } = useReadContract({
    address: TOKEN_A, abi: ERC20_ABI, functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    chainId: polkadotTestnet.id,
    query: { enabled: !!userAddress },
  });
  const { data: balanceB, error: balanceBError } = useReadContract({
    address: TOKEN_B, abi: ERC20_ABI, functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    chainId: polkadotTestnet.id,
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
      await writeContractAsync({
        address: TOKEN_A, abi: ERC20_ABI, functionName: 'approve',
        args: [ROUTER, 2n ** 256n - 1n],
        account: userAddress,
        chain: polkadotTestnet,
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
      await writeContractAsync({
        address: TOKEN_B, abi: ERC20_ABI, functionName: 'approve',
        args: [ROUTER, 2n ** 256n - 1n],
        account: userAddress,
        chain: polkadotTestnet,
      });
      await refetchB();
      set({ isSubmitting: false, step: 'confirm' });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Approval failed' });
    }
  }, [writeContractAsync, refetchB]);

  const confirmDeposit = useCallback(async () => {
    set({ isSubmitting: true, error: null });
    try {
      // Use the hardcoded poolId fallback if computePoolId fails or returns empty
      const finalPoolId = poolId || '0x53eb4e86acd669bbe56a8400f7058b729ac5520ef46e79afde643cb330425796';
      
      const amtA = parseUnits(state.amountA, decimalsA);
      const amtB = parseUnits(state.amountB, decimalsB);
      const lockDuration = BigInt(state.lockDays) * 86400n;

      console.group('🚀 [DEPOSIT DEBUG]');
      console.log('Pool ID:', finalPoolId);
      console.log('Protocol:', PROTOCOL_ADDRESS);
      console.log('Amount A:', amtA.toString(), `(${state.amountA} tokens)`);
      console.log('Amount B:', amtB.toString(), `(${state.amountB} tokens)`);
      console.log('Lock Duration (sec):', lockDuration.toString(), `(${state.lockDays} days)`);
      console.groupEnd();

      const hash = await deposit(finalPoolId as Hex, PROTOCOL_ADDRESS, amtA, amtB, lockDuration);
      set({ isSubmitting: false, step: 'success', txHash: hash });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Deposit failed. Please try again.' });
    }
  }, [validateAmounts, state.amountA, state.amountB, state.lockDays, deposit, decimalsA, decimalsB, poolId]);

  const reset = useCallback(() => setState({
    step: 'amount', amountA: '', amountB: '', lockDays: 0,
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
