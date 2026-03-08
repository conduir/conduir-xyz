import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Wallet, TrendingUp, Shield, Layers, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useDepositFlow, Asset, Vault } from '../../hooks/useDepositFlow';
import { Modal, ConfirmDialog, SuccessView, Input } from '../ui';

interface DepositFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositFlow({ isOpen, onClose }: DepositFlowProps) {
  const { state, actions } = useDepositFlow();

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      actions.reset();
    }
  }, [isOpen, actions]);

  if (!isOpen) return null;

  const renderSelectAsset = () => (
    <div>
      <h3 className="text-xl font-bold mb-2">Select Asset to Deposit</h3>
      <p className="text-slate-400 mb-6">Choose an asset from your treasury to deposit into a Conduir vault.</p>

      <div className="grid gap-3">
        {actions.getAssets().map((asset) => (
          <motion.button
            key={asset.symbol}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => actions.selectAsset(asset)}
            className="bg-[#0A0B10] border border-white/10 hover:border-[#E6007A]/50 rounded-xl p-4 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <span className="text-lg font-bold">{asset.symbol.charAt(0)}</span>
              </div>
              <div>
                <div className="font-bold">{asset.symbol}</div>
                <div className="text-sm text-slate-400">{asset.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono">{parseFloat(asset.balance).toLocaleString()}</div>
              <div className="text-xs text-slate-500">Available</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderAmount = () => {
    const availableVaults = state.selectedAsset ? actions.getAvailableVaults(state.selectedAsset.symbol) : [];
    const estimatedYield = actions.getEstimatedYield();

    return (
      <div>
        <button
          onClick={() => actions.goToStep('select')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to asset selection
        </button>

        <h3 className="text-xl font-bold mb-2">Enter Deposit Amount</h3>
        <p className="text-slate-400 mb-6">
          Depositing {state.selectedAsset?.symbol} into a vault for IL-protected yield.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Amount ({state.selectedAsset?.symbol})
            </label>
            <div className="relative">
              <input
                type="number"
                value={state.amount}
                onChange={(e) => actions.setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#0A0B10] border border-white/10 rounded-xl pl-4 pr-24 py-4 text-white text-lg focus:outline-none focus:border-[#E6007A]/50 transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-slate-400">{state.selectedAsset?.symbol}</span>
                <button
                  onClick={actions.setMaxAmount}
                  className="text-xs font-bold text-[#E6007A] bg-[#E6007A]/10 hover:bg-[#E6007A]/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-slate-500">Available: {parseFloat(state.selectedAsset?.balance || '0').toLocaleString()}</span>
              {estimatedYield > 0 && (
                <span className="text-emerald-400">~${estimatedYield.toLocaleString()}/yr est. yield</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">
              Select Vault
            </label>
            <div className="space-y-3">
              {availableVaults.map((vault) => (
                <button
                  key={vault.id}
                  onClick={() => actions.selectVault(vault)}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${
                    state.selectedVault?.id === vault.id
                      ? 'border-[#E6007A] bg-[#E6007A]/5'
                      : 'border-white/10 hover:border-white/20 bg-[#0A0B10]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-[#E6007A]" />
                      </div>
                      <div>
                        <div className="font-bold">{vault.protocol}</div>
                        <div className="text-xs text-slate-500">Single-sided {vault.asset}</div>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold">{vault.apy}% APY</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-slate-500">
                      Capacity: ${(vault.capacity / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-slate-500">
                      Risk: <span className={`font-medium ${
                        vault.riskLevel === 'Low' ? 'text-emerald-400' :
                        vault.riskLevel === 'Medium' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>{vault.riskLevel}</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E6007A] to-purple-500"
                      style={{ width: `${(vault.utilized / vault.capacity) * 100}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {state.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              {state.error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => actions.goToStep('select')}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => actions.goToStep('confirm')}
            disabled={!state.amount || !state.selectedVault}
            className="flex-1 px-4 py-3 rounded-xl bg-[#E6007A] hover:bg-[#C20066] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Review Deposit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderConfirm = () => (
    <div>
      <button
        onClick={() => actions.goToStep('amount')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to edit amount
      </button>

      <h3 className="text-xl font-bold mb-2">Confirm Deposit</h3>
      <p className="text-slate-400 mb-6">Review your deposit details before proposing to your Safe.</p>

      <div className="bg-[#0A0B10] rounded-xl p-6 space-y-4 mb-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-slate-400">Asset</span>
          <span className="font-bold">{state.selectedAsset?.symbol}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-slate-400">Amount</span>
          <span className="font-bold">{parseFloat(state.amount).toLocaleString()} {state.selectedAsset?.symbol}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-slate-400">Target Vault</span>
          <span className="font-bold">{state.selectedVault?.protocol}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-slate-400">Expected APY</span>
          <span className="font-bold text-emerald-400">{state.selectedVault?.apy}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">IL Protection</span>
          <span className="font-bold text-[#E6007A]">100% Covered</span>
        </div>
      </div>

      <div className="bg-[#13141C] border border-white/10 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400">
          Your deposit is fully protected from impermanent loss. Any IL incurred will be covered by the protocol's collateral.
        </p>
      </div>

      <button
        onClick={actions.confirmDeposit}
        disabled={state.isSubmitting}
        className="w-full px-6 py-4 rounded-xl bg-[#E6007A] hover:bg-[#C20066] text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {state.isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5" />
            Propose Deposit via Safe
          </>
        )}
      </button>
    </div>
  );

  const renderSuccess = () => (
    <SuccessView
      title="Deposit Proposed!"
      message="Your deposit has been added to the Safe queue. Once 3 out of 5 signers approve, it will be executed on-chain."
      txHash={state.receiptTxHash || undefined}
      details={[
        { label: 'Asset', value: state.selectedAsset?.symbol || '' },
        { label: 'Amount', value: `${parseFloat(state.amount).toLocaleString()} ${state.selectedAsset?.symbol}` },
        { label: 'Vault', value: state.selectedVault?.protocol || '' },
        { label: 'Expected APY', value: `${state.selectedVault?.apy}%` },
      ]}
      onNewAction={() => {
        actions.reset();
        onClose();
      }}
      actionLabel="New Deposit"
    />
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {state.step === 'select' && renderSelectAsset()}
          {state.step === 'amount' && renderAmount()}
          {state.step === 'confirm' && renderConfirm()}
          {state.step === 'success' && renderSuccess()}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}
