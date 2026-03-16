import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ArrowRight, FileText, Layers, Shield, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { useVoucherFlow, Voucher } from '../../hooks/useVoucherFlow';
import { Modal, Input, Select, SuccessView, Button, LoadingSpinner } from '../ui';

interface VoucherFlowProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'list' | 'register';
}

export function VoucherFlow({ isOpen, onClose, initialTab = 'list' }: VoucherFlowProps) {
  const { state, actions } = useVoucherFlow();
  const [statusFilter, setStatusFilter] = useState<React.ReactNode>('All');

  useEffect(() => {
    if (isOpen && initialTab === 'register') {
      actions.startRegistration();
    }
  }, [isOpen, initialTab, actions]);

  useEffect(() => {
    if (!isOpen) {
      actions.reset();
    }
  }, [isOpen, actions]);

  const statusColors = {
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Redeemed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    Expired: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Traded: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const renderList = () => (
    <div>
      <h3 className="text-xl font-bold mb-2">IL Vouchers</h3>
      <p className="text-slate-400 mb-6">Manage your protocol's IL Voucher tokens and track underwritten positions.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0A0B10] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#E6007A]">{actions.getActiveVouchersCount()}</div>
          <div className="text-xs text-slate-500">Active</div>
        </div>
        <div className="bg-[#0A0B10] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{actions.getVouchers().length}</div>
          <div className="text-xs text-slate-500">Total</div>
        </div>
        <div className="bg-[#0A0B10] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">${(actions.getTotalCollateralDeposited() / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-slate-500">Collateral</div>
        </div>
      </div>

      {/* Voucher List */}
      <div className="space-y-3 mb-6">
        {actions.getVouchers().map((voucher) => (
          <motion.button
            key={voucher.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => actions.selectVoucher(voucher)}
            className="w-full bg-[#0A0B10] border border-white/10 hover:border-white/20 rounded-xl p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#E6007A]/50 focus:ring-offset-2 focus:ring-offset-[#0A0B10]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-bold">{voucher.pool}</div>
                  <div className="text-xs text-slate-500">{voucher.id}</div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded border ${statusColors[voucher.status]}`}>
                {voucher.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-400">
                {voucher.amount} ILV • {voucher.oracle}
              </div>
              <div className={`font-medium ${voucher.change24h.startsWith('+') ? 'text-emerald-400' : voucher.change24h.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
                {voucher.change24h}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <Button
        variant="info"
        onClick={actions.startRegistration}
        className="w-full"
      >
        <FileText className="w-4 h-4" />
        Register New Vault
      </Button>
    </div>
  );

  const renderRegister = () => {
    const registration = state.registration;

    return (
      <div>
        <button
          onClick={() => actions.goToStep('list')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to vouchers
        </button>

        <h3 className="text-xl font-bold mb-2">Register Protocol Vault</h3>
        <p className="text-slate-400 mb-6">Register a new vault and deposit collateral to mint IL Vouchers.</p>

        <div className="space-y-4">
          <Select
            label="Target Trading Pair"
            value={registration?.targetPair || ''}
            onChange={(e) => actions.updateRegistration('targetPair', e.target.value)}
            options={[{ value: '', label: 'Select a pair...', disabled: true }, ...actions.getTargetPairs().map(p => ({ value: p, label: p }))]}
          />

          <Select
            label="Collateral Token"
            value={registration?.collateralToken || ''}
            onChange={(e) => actions.updateRegistration('collateralToken', e.target.value)}
            options={[{ value: '', label: 'Select collateral token...', disabled: true }, ...actions.getCollateralTokens().map(t => ({ value: t.symbol, label: `${t.symbol} - Balance: ${parseFloat(t.balance).toLocaleString()}` }))]}
          />

          <Input
            label="Collateral Amount"
            type="number"
            placeholder="0.00"
            value={registration?.collateralAmount || ''}
            onChange={(e) => actions.updateRegistration('collateralAmount', e.target.value)}
          />

          {/* Fee Breakdown */}
          {registration && (
            <div className="bg-[#0A0B10] rounded-xl p-4 space-y-3">
              <div className="text-sm font-semibold text-slate-400">Fee Breakdown</div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Listing Fee + Premium</span>
                <span className="font-bold">${registration.listingFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Fee Split</span>
                <span className="font-bold">40% Upfront / 60% Accrued</span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                <span className="text-slate-500">Vouchers to Mint</span>
                <span className="font-bold text-blue-400">{actions.calculateVouchersToMint()} ILV</span>
              </div>
            </div>
          )}

          {state.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              {state.error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={() => actions.goToStep('list')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="info"
            onClick={() => actions.goToStep('confirm')}
            disabled={!registration?.targetPair || !registration?.collateralToken || !registration?.collateralAmount}
            className="flex-1"
          >
            Review Registration <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderConfirm = () => {
    const registration = state.registration;

    return (
      <div>
        <button
          onClick={() => actions.goToStep('register')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to edit
        </button>

        <h3 className="text-xl font-bold mb-2">Confirm Vault Registration</h3>
        <p className="text-slate-400 mb-6">Review your vault registration details before proposing to your Safe.</p>

        <div className="bg-[#0A0B10] rounded-xl p-6 space-y-4 mb-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="text-slate-400">Target Pair</span>
            <span className="font-bold">{registration?.targetPair}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="text-slate-400">Collateral Token</span>
            <span className="font-bold">{registration?.collateralToken}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="text-slate-400">Collateral Amount</span>
            <span className="font-bold">{parseFloat(registration?.collateralAmount || '0').toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="text-slate-400">Listing Fee</span>
            <span className="font-bold">${registration?.listingFee}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Vouchers to Mint</span>
            <span className="font-bold text-blue-400">{actions.calculateVouchersToMint()} ILV</span>
          </div>
        </div>

        <div className="bg-[#13141C] border border-white/10 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-400">
            Your collateral will be locked for the vault duration. If IL occurs, it will be used to payout LPs. Otherwise, it will be returned at expiration.
          </p>
        </div>

        <Button
          variant="info"
          onClick={actions.confirmRegistration}
          disabled={state.isSubmitting}
          className="w-full"
          size="lg"
        >
          {state.isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Propose Registration via Safe
            </>
          )}
        </Button>
      </div>
    );
  };

  const renderDetails = () => {
    const voucher = state.selectedVoucher;
    if (!voucher) return null;

    const expiryDays = Math.max(0, Math.ceil((voucher.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    return (
      <div>
        <button
          onClick={() => actions.goToStep('list')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to vouchers
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Layers className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">{voucher.pool}</div>
            <div className="text-sm text-slate-500">{voucher.id}</div>
          </div>
          <span className={`ml-auto text-sm font-bold px-3 py-1 rounded border ${statusColors[voucher.status]}`}>
            {voucher.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#0A0B10] rounded-xl p-4">
            <div className="text-sm text-slate-500 mb-1">Voucher Amount</div>
            <div className="text-xl font-bold">{voucher.amount} ILV</div>
          </div>
          <div className="bg-[#0A0B10] rounded-xl p-4">
            <div className="text-sm text-slate-500 mb-1">Collateral Locked</div>
            <div className="text-xl font-bold">${(voucher.collateralDeposited / 1000).toFixed(0)}K</div>
          </div>
          <div className="bg-[#0A0B10] rounded-xl p-4">
            <div className="text-sm text-slate-500 mb-1">Price Oracle</div>
            <div className="text-xl font-bold">{voucher.oracle}</div>
          </div>
          <div className="bg-[#0A0B10] rounded-xl p-4">
            <div className="text-sm text-slate-500 mb-1">24h Change</div>
            <div className={`text-xl font-bold ${voucher.change24h.startsWith('+') ? 'text-emerald-400' : voucher.change24h.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
              {voucher.change24h}
            </div>
          </div>
        </div>

        <div className="bg-[#0A0B10] rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Created</span>
            <span className="text-slate-300">{voucher.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Expires</span>
            <span className="text-slate-300">{voucher.expiresAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm items-center pt-2 border-t border-white/10">
            <span className="text-slate-500">Time Remaining</span>
            <span className={`font-bold ${expiryDays < 30 ? 'text-orange-400' : 'text-emerald-400'}`}>
              {expiryDays} days
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <a
            href="#"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#E6007A]/50 focus:ring-offset-2 focus:ring-offset-[#0A0B10]"
          >
            <ExternalLink className="w-4 h-4" />
            View on Explorer
          </a>
          {voucher.status === 'Active' && (
            <Button variant="info" className="flex-1">
              Trade Voucher
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <SuccessView
      title="Vault Registered!"
      message="Your vault registration has been proposed to the Safe. Once approved, IL Vouchers will be minted and your collateral will be locked."
      txHash={state.txHash || undefined}
      details={state.registration ? [
        { label: 'Target Pair', value: state.registration.targetPair },
        { label: 'Collateral', value: `${state.registration.collateralToken} - ${parseFloat(state.registration.collateralAmount).toLocaleString()}` },
        { label: 'Vouchers to Mint', value: `${actions.calculateVouchersToMint()} ILV` },
      ] : []}
      onNewAction={() => {
        actions.reset();
        onClose();
      }}
      actionLabel="Register Another Vault"
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
          {state.step === 'list' && renderList()}
          {state.step === 'register' && renderRegister()}
          {state.step === 'confirm' && renderConfirm()}
          {state.step === 'details' && renderDetails()}
          {state.step === 'success' && renderSuccess()}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}
