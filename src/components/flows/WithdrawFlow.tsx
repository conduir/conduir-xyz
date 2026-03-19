import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { formatUnits } from 'viem';
import { useWithdrawFlow } from '../../hooks/useWithdrawFlow';
import type { Position } from '../../web3/hooks/useILVault';
import type { Address } from 'viem';

const BLOCKSCOUT = 'https://blockscout-testnet.polkadot.io';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  position: Position | null;
  userAddress?: Address;
  onSuccess?: () => void;
}

export function WithdrawFlow({ isOpen, onClose, position, userAddress, onSuccess }: Props) {
  const { state, actions } = useWithdrawFlow(position, userAddress);
  const handleClose = () => { actions.reset(); onClose(); };
  if (!isOpen || !position) return null;

  const lockExpired = position.isLockExpired;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="card card-blue w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.07]">
          <div>
            <p className="font-data text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {state.step === 'success' ? 'Complete' : 'Withdraw Position'}
            </p>
            <h2 className="font-display font-bold text-lg mt-0.5">
              Position #{position.positionId.toString()}
            </h2>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
            >
              {(state.step === 'confirm' || state.step === 'approve-lp' || state.step === 'submit') && (
                <div className="space-y-4">
                  <div className="stat-cell p-4 space-y-3">
                    {[
                      { label: 'Token A Deposited', value: `${parseFloat(formatUnits(position.amountA, 18)).toFixed(4)}` },
                      { label: 'Token B Deposited', value: `${parseFloat(formatUnits(position.amountB, 18)).toFixed(4)}` },
                      { label: 'LP Tokens',         value: `${parseFloat(formatUnits(position.lpAmount, 18)).toFixed(4)}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="font-data text-xs text-zinc-500">{label}</span>
                        <span className="font-data text-xs text-white">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 border-t border-white/[0.05]">
                      <span className="font-data text-xs text-zinc-500">Lock Status</span>
                      <span className={`font-data text-xs font-medium ${lockExpired ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {lockExpired ? 'Unlocked ✓' : position.lockExpiry.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {!lockExpired && (
                    <div className="flex items-start gap-2.5 bg-amber-500/8 border border-amber-500/20 rounded-xl p-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="font-data text-[11px] text-amber-400">
                        Lock expires {position.lockExpiry.toLocaleDateString()}. Cannot withdraw yet.
                      </p>
                    </div>
                  )}

                  {state.step === 'approve-lp' && (
                    <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                      <p className="font-data text-xs text-amber-400 font-medium mb-1 uppercase tracking-widest">Approve LP Token</p>
                      <p className="font-data text-[11px] text-amber-400/70">Allow the Router to burn your LP tokens during withdrawal.</p>
                    </div>
                  )}

                  {state.error && <p className="font-data text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{state.error}</p>}

                  {state.step === 'confirm' && (
                    <button onClick={actions.proceedFromConfirm} disabled={!lockExpired} className="btn-primary">
                      {lockExpired ? 'Proceed to Withdraw' : 'Lock Not Expired'}
                    </button>
                  )}
                  {state.step === 'approve-lp' && (
                    <button onClick={actions.approveLp} disabled={state.isSubmitting} className="btn-primary">
                      {state.isSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Approving...</> : 'Approve LP Token'}
                    </button>
                  )}
                  {state.step === 'submit' && (
                    <button onClick={actions.confirmWithdraw} disabled={state.isSubmitting} className="btn-primary">
                      {state.isSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Withdrawing...</> : 'Confirm Withdraw'}
                    </button>
                  )}
                </div>
              )}

              {state.step === 'success' && (
                <div className="text-center space-y-5 py-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                    <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl mb-1">Withdrawal Successful</h3>
                    <p className="font-data text-xs text-zinc-500">Assets returned. Any IL was covered by the protocol.</p>
                  </div>
                  {state.result?.txHash && (
                    <a
                      href={`${BLOCKSCOUT}/tx/${state.result.txHash}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-data text-xs text-[#E6007A] hover:text-[#C20066] transition-colors"
                    >
                      View on Blockscout <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button onClick={() => { actions.reset(); onSuccess?.(); onClose(); }} className="btn-ghost">
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
