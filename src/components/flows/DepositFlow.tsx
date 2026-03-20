import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import { useDepositFlow } from '../../hooks/useDepositFlow';
import type { Address } from 'viem';

const BLOCKSCOUT = 'https://blockscout-testnet.polkadot.io';

// Known registered protocol on testnet (deployer address)
const KNOWN_PROTOCOLS = [
  { label: 'Conduir Testnet Protocol', address: '0x16003e90Ddca83c96751ce5A6cF984aB624870E9' as Address },
] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userAddress?: Address;
  onSuccess?: () => void;
}

const STEPS = ['amount', 'approve-a', 'approve-b', 'confirm', 'success'] as const;

function StepCircles({ current }: { current: string }) {
  const steps = [
    { key: 'amount',    label: 'Amounts' },
    { key: 'approve-a', label: 'Approve A' },
    { key: 'approve-b', label: 'Approve B' },
    { key: 'confirm',   label: 'Confirm' },
  ];
  const idx = STEPS.indexOf(current as typeof STEPS[number]);
  return (
    <div className="flex items-center gap-2 px-6 pt-5">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-data text-[10px] transition-colors ${
              i < idx ? 'bg-[#FF0877] text-white' :
              i === idx ? 'bg-[#FF0877]/20 border border-[#FF0877] text-[#FF0877]' :
              'bg-white/[0.05] border border-white/[0.1] text-zinc-700'
            }`}>
              {i < idx ? '✓' : i + 1}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px transition-colors ${i < idx ? 'bg-[#FF0877]/50' : 'bg-white/[0.1]'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function DepositFlow({ isOpen, onClose, userAddress, onSuccess }: Props) {
  const { state, balanceA, balanceB, actions } = useDepositFlow(userAddress, KNOWN_PROTOCOLS[0].address);
  const handleClose = () => { actions.reset(); onClose(); };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="card card-pink w-full max-w-md shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div>
            <p className="font-data text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              {state.step !== 'success' ? `Step ${Math.max(1, STEPS.indexOf(state.step as typeof STEPS[number]))} of 4` : 'Complete'}
            </p>
            <h2 className="font-display font-bold text-lg mt-0.5 text-white">Deposit Liquidity</h2>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {state.step !== 'success' && <StepCircles current={state.step} />}

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
            >
              {state.step === 'amount' && (
                <div className="space-y-4">
                  <p className="font-data text-xs text-zinc-500">Deposit Token A and Token B with IL protection.</p>

                  {[
                    { label: 'Token A Amount', val: state.amountA, set: actions.setAmountA, bal: balanceA },
                    { label: 'Token B Amount', val: state.amountB, set: actions.setAmountB, bal: balanceB },
                  ].map(({ label, val, set, bal }) => (
                    <div key={label}>
                      <label className="block font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">{label}</label>
                      <div className="relative">
                        <input
                          type="number" min="0" placeholder="0.00"
                          value={val} onChange={e => set(e.target.value)}
                          className="input-field pr-16"
                        />
                        <button
                          onClick={() => set(bal)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 font-data text-[10px] uppercase tracking-widest text-[#FF0877] bg-[#FF0877]/10 hover:bg-[#FF0877]/20 px-2 py-1 rounded transition-colors"
                        >Max</button>
                      </div>
                      <p className="font-data text-[10px] text-zinc-700 mt-1">Balance: {parseFloat(bal).toFixed(4)}</p>
                    </div>
                  ))}

                  <div>
                    <label className="block font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">
                      Lock Duration — <span className="text-white">{state.lockDays} days</span>
                    </label>
                    <input
                      type="range" min="0" max="41" step="1"
                      value={state.lockDays} onChange={e => actions.setLockDays(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between font-data text-[10px] text-zinc-700 mt-1">
                      <span>0 days</span><span>41 days (max)</span>
                    </div>
                  </div>

                  {state.error && <p className="font-data text-xs text-red-400 bg-red-500/[0.08] rounded-lg px-3 py-2 border border-red-500/[0.15]">{state.error}</p>}

                  <button onClick={actions.proceedFromAmount} className="btn-primary">
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {(state.step === 'approve-a' || state.step === 'approve-b') && (
                <div className="space-y-4">
                  <div className="stat-cell p-4 space-y-2">
                    {[
                      { label: 'Token A', value: parseFloat(state.amountA).toFixed(4) },
                      { label: 'Token B', value: parseFloat(state.amountB).toFixed(4) },
                      { label: 'Lock',    value: `${state.lockDays} days` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="font-data text-xs text-zinc-600">{label}</span>
                        <span className="font-data text-xs text-white">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-500/[0.08] border border-amber-500/[0.2] rounded-xl p-4">
                    <p className="font-data text-xs text-amber-400 font-medium mb-1 uppercase tracking-widest">
                      Approve {state.step === 'approve-a' ? 'Token A' : 'Token B'}
                    </p>
                    <p className="font-data text-[11px] text-amber-400/70">
                      Allow the Router to spend your {state.step === 'approve-a' ? 'Token A' : 'Token B'}.
                    </p>
                  </div>

                  {state.error && <p className="font-data text-xs text-red-400 bg-red-500/[0.08] rounded-lg px-3 py-2 border border-red-500/[0.15]">{state.error}</p>}

                  <button
                    onClick={state.step === 'approve-a' ? actions.approveA : actions.approveB}
                    disabled={state.isSubmitting}
                    className="btn-primary"
                  >
                    {state.isSubmitting
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Approving...</>
                      : <>Approve {state.step === 'approve-a' ? 'Token A' : 'Token B'}</>
                    }
                  </button>
                </div>
              )}

              {state.step === 'confirm' && (
                <div className="space-y-4">
                  <div className="stat-cell p-4 space-y-3">
                    {[
                      { label: 'Token A',      value: `${parseFloat(state.amountA).toFixed(4)}` },
                      { label: 'Token B',      value: `${parseFloat(state.amountB).toFixed(4)}` },
                      { label: 'Lock Duration', value: `${state.lockDays} days` },
                      { label: 'Protocol',     value: KNOWN_PROTOCOLS[0].label },
                      { label: 'IL Protection', value: '100% Covered', accent: true },
                    ].map(({ label, value, accent }) => (
                      <div key={label} className={`flex justify-between ${accent ? 'pt-3 border-t border-white/[0.05]' : ''}`}>
                        <span className="font-data text-xs text-zinc-600">{label}</span>
                        <span className={`font-data text-xs font-medium ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {state.error && <p className="font-data text-xs text-red-400 bg-red-500/[0.08] rounded-lg px-3 py-2 border border-red-500/[0.15]">{state.error}</p>}

                  <button onClick={actions.confirmDeposit} disabled={state.isSubmitting} className="btn-primary">
                    {state.isSubmitting
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Depositing...</>
                      : 'Confirm Deposit'
                    }
                  </button>
                </div>
              )}

              {state.step === 'success' && (
                <div className="text-center space-y-5 py-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/[0.1] animate-ping" />
                    <div className="relative w-20 h-20 rounded-full bg-emerald-500/[0.1] border border-emerald-500/[0.3] flex items-center justify-center">
                      <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl mb-1 text-white">Deposit Successful</h3>
                    <p className="font-data text-xs text-zinc-600">Your liquidity is now IL-protected.</p>
                  </div>
                  {state.txHash && (
                    <a
                      href={`${BLOCKSCOUT}/tx/${state.txHash}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-data text-xs text-[#FF0877] hover:text-[#E6006A] transition-colors"
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
