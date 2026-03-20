import { useState, useCallback } from 'react';
import { useRouter, useLPBalance } from '../web3/hooks/useRouter';
import type { Position } from '../web3/hooks/useILVault';
import type { Address } from 'viem';

export type WithdrawStep = 'confirm' | 'approve-lp' | 'submit' | 'success';

export interface WithdrawResult {
  amountA: bigint;
  amountB: bigint;
  ilPayout: bigint;
  txHash: string;
}

export interface WithdrawState {
  step: WithdrawStep;
  isSubmitting: boolean;
  error: string | null;
  result: WithdrawResult | null;
}

export function useWithdrawFlow(position: Position | null, userAddress?: Address) {
  const { withdraw } = useRouter();
  const { balance: lpBalance, allowance: lpAllowance, approveLPToken, refetchAllowance } =
    useLPBalance(userAddress);

  const [state, setState] = useState<WithdrawState>({
    step: 'confirm',
    isSubmitting: false,
    error: null,
    result: null,
  });

  const set = (patch: Partial<WithdrawState>) => setState(prev => ({ ...prev, ...patch }));

  const proceedFromConfirm = useCallback(() => {
    if (!position) return;
    if (position.lpAmount <= 0n) {
      set({ error: 'Position has no LP tokens to withdraw.' });
      return;
    }
    // We approve and withdraw exactly the amount of LP tokens recorded for this position
    const needsApproval = lpAllowance < position.lpAmount;
    set({ step: needsApproval ? 'approve-lp' : 'submit', error: null });
  }, [position, lpAllowance]);

  const approveLp = useCallback(async () => {
    if (!position) return;
    set({ isSubmitting: true, error: null });
    try {
      await approveLPToken(position.lpAmount);
      await refetchAllowance();
      set({ isSubmitting: false, step: 'submit' });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Approval failed' });
    }
  }, [position, approveLPToken, refetchAllowance]);

  const confirmWithdraw = useCallback(async () => {
    if (!position) return;
    set({ isSubmitting: true, error: null });
    try {
      // Send the exact LP amount recorded in the vault for this position
      const hash = await withdraw(BigInt(position.positionIndex), position.lpAmount);
      set({
        isSubmitting: false,
        step: 'success',
        result: {
          amountA: position.amountA,
          amountB: position.amountB,
          ilPayout: 0n,
          txHash: hash,
        },
      });
    } catch (e: any) {
      set({ isSubmitting: false, error: e?.shortMessage || e?.message || 'Withdraw failed' });
    }
  }, [position, withdraw]);

  const reset = useCallback(() => setState({
    step: 'confirm', isSubmitting: false, error: null, result: null,
  }), []);

  return {
    state,
    lpBalance,
    actions: { proceedFromConfirm, approveLp, confirmWithdraw, reset },
  };
}
