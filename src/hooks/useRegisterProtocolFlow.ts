import { useState, useCallback } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useWriteContract } from 'wagmi';
import { getContractAddress } from '../web3/contracts/addresses';
import { ERC20_ABI } from '../web3/contracts/abi';
import { useRouter } from '../web3/hooks/useRouter';
import type { Address } from 'viem';

export type RegisterStep = 'collateral' | 'approve-usdc' | 'confirm' | 'success';

export interface RegisterState {
  step: RegisterStep;
  collateralAmount: string;
  isSubmitting: boolean;
  error: string | null;
  txHash: string | null;
}

const LISTING_FEE = parseUnits('100', 18);
const USDC = getContractAddress('mockUsdc');
const ROUTER = getContractAddress('router');
const POOL_ID = 0n;

export function useRegisterProtocolFlow(_userAddress?: Address) {
  const [state, setState] = useState<RegisterState>({
    step: 'collateral',
    collateralAmount: '',
    isSubmitting: false,
    error: null,
    txHash: null,
  });

  const { registerProtocol } = useRouter();
  const { writeContractAsync } = useWriteContract();

  const set = (patch: Partial<RegisterState>) => setState(prev => ({ ...prev, ...patch }));

  const proceedFromCollateral = useCallback(() => {
    const amt = parseFloat(state.collateralAmount);
    if (!state.collateralAmount || amt <= 0) {
      set({ error: 'Enter a valid collateral amount' });
      return;
    }
    set({ step: 'approve-usdc', error: null });
  }, [state.collateralAmount]);

  const approveUsdc = useCallback(async () => {
    set({ isSubmitting: true, error: null });
    try {
      const collateralBigInt = parseUnits(state.collateralAmount, 18);
      const totalApproval = collateralBigInt + LISTING_FEE;
      // @ts-expect-error wagmi writeContractAsync types require chain/account at call site
      await writeContractAsync({
        address: USDC,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [ROUTER, totalApproval],
      });
      set({ isSubmitting: false, step: 'confirm' });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Approval failed' });
    }
  }, [writeContractAsync, state.collateralAmount]);

  const confirmRegister = useCallback(async () => {
    set({ isSubmitting: true, error: null });
    try {
      const collateralBigInt = parseUnits(state.collateralAmount, 18);
      const hash = await registerProtocol(POOL_ID, collateralBigInt);
      set({ isSubmitting: false, step: 'success', txHash: hash });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Registration failed' });
    }
  }, [registerProtocol, state.collateralAmount]);

  const reset = useCallback(() => setState({
    step: 'collateral', collateralAmount: '', isSubmitting: false, error: null, txHash: null,
  }), []);

  const totalApproval = state.collateralAmount
    ? formatUnits(parseUnits(state.collateralAmount || '0', 18) + LISTING_FEE, 18)
    : '100';

  return {
    state,
    totalApproval,
    actions: {
      setCollateralAmount: (v: string) => set({ collateralAmount: v, error: null }),
      proceedFromCollateral,
      approveUsdc,
      confirmRegister,
      reset,
    },
  };
}
