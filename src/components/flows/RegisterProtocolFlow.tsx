import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, CheckCircle2, ExternalLink, Loader2, Info } from 'lucide-react';
import { useRegisterProtocolFlow } from '../../hooks/useRegisterProtocolFlow';
import type { Address } from 'viem';

const BLOCKSCOUT = 'https://blockscout-testnet.polkadot.io';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userAddress?: Address;
  onSuccess?: () => void;
}

const STEPS = ['collateral', 'approve-usdc', 'confirm', 'success'] as const;

function StepCircles({ current }: { current: string }) {
  const steps = [
    { key: 'collateral',   label: 'Collateral' },
    { key: 'approve-usdc', label: 'Approve' },
    { key: 'confirm',      label: 'Confirm' },
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

export function RegisterProtocolFlow({ isOpen, onClose, userAddress, onSuccess }: Props) {
  const { state, totalApproval, actions } = useRegisterProtocolFlow(userAddress);
  const handleClose = () => { actions.reset(); onClose(); };
  if (!isOpen) return null;

  const stepIdx = STEPS.indexOf(state.step as typeof STEPS[number]);

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
              {state.step !== 'success' ? `Step ${Math.max(1, stepIdx)} of 3` : 'Complete'}
            </p>
            <h2 className="font-display font-bold text-lg mt-0.5 text-white">Register Protocol</h2>
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
              {state.step === 'collateral' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">Initial Collateral (USDC)</label>
                    <input
                      type="number" min="0" placeholder="0.00"
                      value={state.collateralAmount}
                      onChange={e => actions.setCollateralAmount(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/[0.15]">
                    <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="font-data text-[11px] text-blue-400/80">
                      100 USDC listing fee + your collateral will be approved in one transaction.
                    </p>
                  </div>

                  {state.error && <p className="font-data text-xs text-red-400 bg-red-500/[0.08] rounded-lg px-3 py-2 border border-red-500/[0.15]">{state.error}</p>}

                  <button onClick={actions.proceedFromCollateral} className="btn-primary">
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {state.step === 'approve-usdc' && (
                <div className="space-y-4">
                  <div className="stat-cell p-4 space-y-2">
                    {[
                      { label: 'Collateral',    value: `${parseFloat(state.collateralAmount).toFixed(2)} USDC` },
                      { label: 'Listing Fee',   value: '100.00 USDC' },
                      { label: 'Total Approval', value: `${parseFloat(totalApproval).toFixed(2)} USDC` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="font-data text-xs text-zinc-600">{label}</span>
                        <span className="font-data text-xs text-white">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-500/[0.08] border border-amber-500/[0.2] rounded-xl p-4">
                    <p className="font-data text-xs text-amber-400 font-medium mb-1 uppercase tracking-widest">Approve USDC</p>
                    <p className="font-data text-[11px] text-amber-400/70">
                      Allow the Router to spend {parseFloat(totalApproval).toFixed(2)} USDC (fee + collateral).
                    </p>
                  </div>

                  {state.error && <p className="font-data text-xs text-red-400 bg-red-500/[0.08] rounded-lg px-3 py-2 border border-red-500/[0.15]">{state.error}</p>}

                  <button onClick={actions.approveUsdc} disabled={state.isSubmitting} className="btn-primary">
                    {state.isSubmitting
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Approving...</>
                      : 'Approve USDC'
                    }
                  </button>
                </div>
              )}

              {state.step === 'confirm' && (
                <div className="space-y-4">
                  <div className="stat-cell p-4 space-y-3">
                    {[
                      { label: 'Collateral',     value: `${parseFloat(state.collateralAmount).toFixed(2)} USDC` },
                      { label: 'Listing Fee',    value: '100.00 USDC' },
                      { label: 'Pool ID',        value: '0' },
                      { label: 'IL Protection',  value: 'Enabled', accent: true },
                    ].map(({ label, value, accent }) => (
                      <div key={label} className={`flex justify-between ${accent ? 'pt-3 border-t border-white/[0.05]' : ''}`}>
                        <span className="font-data text-xs text-zinc-600">{label}</span>
                        <span className={`font-data text-xs font-medium ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {state.error && <p className="font-data text-xs text-red-400 bg-red-500/[0.08] rounded-lg px-3 py-2 border border-red-500/[0.15]">{state.error}</p>}

                  <button onClick={actions.confirmRegister} disabled={state.isSubmitting} className="btn-primary">
                    {state.isSubmitting
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Registering...</>
                      : 'Confirm Registration'
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
                    <h3 className="font-display font-bold text-xl mb-1 text-white">Protocol Registered</h3>
                    <p className="font-data text-xs text-zinc-600">Your protocol is now live. LPs can deposit into your pool.</p>
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
