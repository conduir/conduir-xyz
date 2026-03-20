import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  AlertTriangle,
  Check,
  ExternalLink,
  Shield,
  Clock,
  DollarSign,
  Wallet,
  Loader2,
} from 'lucide-react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { WalletButton } from '../components/web3/WalletButton';
import { useRouterAdmin } from '../web3/hooks/useRouterAdmin';
import { getContractAddress } from '../web3/contracts/addresses';
import { polkadotTestnet } from '../web3/config/chains';

// USDC uses 6 decimals
const USDC_DECIMALS = 6;

// Preset values for common USDC amounts
const PRESET_AMOUNTS = [
  { label: '10 USDC', value: '10' },
  { label: '50 USDC', value: '50' },
  { label: '100 USDC (Recommended)', value: '100' },
  { label: '500 USDC', value: '500' },
  { label: '1000 USDC', value: '1000' },
];

export default function Admin() {
  const { address, isConnected } = useAccount();
  const {
    owner,
    currentListingFee,
    currentMonthlyFee,
    isPaused,
    isOwner,
    setListingFeeAmount,
    refetchListingFee,
  } = useRouterAdmin();

  const [listingFeeInput, setListingFeeInput] = useState('100');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update input when current fee loads
  useEffect(() => {
    if (currentListingFee > 0n) {
      setListingFeeInput(formatUnits(currentListingFee, USDC_DECIMALS));
    }
  }, [currentListingFee]);

  const explorerUrl = txHash
    ? `https://blockscout-testnet.polkadot.io/tx/${txHash}`
    : `https://blockscout-testnet.polkadot.io/address/${getContractAddress('router')}`;

  const handleSubmit = async () => {
    if (!address || !isOwner) {
      setError('Only the contract owner can perform this action');
      return;
    }

    const amount = parseFloat(listingFeeInput);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setTxHash(null);

    try {
      const hash = await setListingFeeAmount(parseUnits(listingFeeInput, USDC_DECIMALS));
      setTxHash(hash);
      setSuccess(true);
      // Refetch after a short delay to get the updated value
      setTimeout(() => refetchListingFee(), 2000);
    } catch (err: any) {
      console.error('Failed to set listing fee:', err);
      setError(err?.message || err?.shortMessage || 'Transaction failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedCurrentFee = formatUnits(currentListingFee || 0n, USDC_DECIMALS);
  const formattedMonthlyFee = formatUnits(currentMonthlyFee || 0n, USDC_DECIMALS);

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF0877]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-16"
        >
          <div>
            <p className="font-data text-[10px] uppercase tracking-[0.2em] text-purple-400 mb-1">Contract Administration</p>
            <h1 className="text-3xl font-display font-bold tracking-tight text-white">Router Admin</h1>
          </div>
          <WalletButton />
        </motion.div>

        {/* Not connected */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center mb-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Connect Your Wallet</h2>
            <p className="text-zinc-500 text-sm">
              Connect as the contract owner to access admin functions.
            </p>
          </motion.div>
        )}

        {/* Connected but not owner */}
        {isConnected && !isOwner && owner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8 border border-amber-500/30 bg-amber-500/5"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-white mb-1">Not the Contract Owner</h3>
                <p className="text-sm text-zinc-500">
                  Connected address: <code className="text-purple-400">{address?.slice(0, 8)}...{address?.slice(-6)}</code>
                </p>
                <p className="text-sm text-zinc-500">
                  Owner address: <code className="text-amber-400">{owner.slice(0, 8)}...{owner.slice(-6)}</code>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Owner status */}
        {isConnected && isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8 border border-emerald-500/30 bg-emerald-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white">Contract Owner Verified</h3>
                <p className="text-sm text-zinc-500">
                  You have permission to modify contract settings.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Current State Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-zinc-600" />
              Current Router State
            </h2>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View in Explorer
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Listing Fee */}
            <div className="stat-cell p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-zinc-600" />
                <p className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600">Listing Fee</p>
              </div>
              <p className="font-data text-2xl text-white">
                {parseFloat(formattedCurrentFee).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
                <span className="text-sm text-zinc-500 ml-1">USDC</span>
              </p>
              <p className="font-data text-[10px] text-zinc-700 mt-1">
                {currentListingFee.toString()} wei
              </p>
            </div>

            {/* Monthly Fee */}
            <div className="stat-cell p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-zinc-600" />
                <p className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600">Monthly Fee</p>
              </div>
              <p className="font-data text-2xl text-white">
                {parseFloat(formattedMonthlyFee).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
                <span className="text-sm text-zinc-500 ml-1">USDC</span>
              </p>
              <p className="font-data text-[10px] text-zinc-700 mt-1">
                {currentMonthlyFee.toString()} wei
              </p>
            </div>

            {/* Contract Status */}
            <div className="stat-cell p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-zinc-600" />
                <p className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600">Contract Status</p>
              </div>
              <p className={`font-data text-2xl ${isPaused ? 'text-amber-400' : 'text-emerald-400'}`}>
                {isPaused ? 'PAUSED' : 'ACTIVE'}
              </p>
              <p className="font-data text-[10px] text-zinc-700 mt-1">
                Chain ID: {polkadotTestnet.id}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Set Listing Fee Form */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-400" />
              Update Listing Fee
            </h2>

            {/* USDC Decimals Notice */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-white text-sm mb-1">USDC Uses 6 Decimals</h4>
                  <p className="text-sm text-zinc-500">
                    Unlike most ERC20 tokens (18 decimals), USDC uses only 6 decimals.
                    For example: <code className="text-blue-400">100 USDC = 100 * 10^6 = 100,000,000</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Preset Amounts */}
            <div className="mb-4">
              <label className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2 block">
                Quick Select (USDC)
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setListingFeeInput(preset.value)}
                    className={`px-3 py-2 rounded-lg font-data text-xs transition-all ${
                      listingFeeInput === preset.value
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-white/5 text-zinc-500 border border-white/[0.06] hover:bg-white/10'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2 block">
                New Listing Fee Amount (USDC)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={listingFeeInput}
                  onChange={(e) => setListingFeeInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/[0.06] rounded-lg px-4 py-3 font-data text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                  placeholder="100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-data text-sm text-zinc-600">
                  USDC
                </span>
              </div>
              <p className="font-data text-[10px] text-zinc-700 mt-2">
                Will send: <code className="text-purple-400">{parseUnits(listingFeeInput || '0', USDC_DECIMALS).toString()}</code> wei
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {success && txHash && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-emerald-400">Listing fee updated successfully!</p>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-zinc-400 flex items-center gap-1 mt-1"
                    >
                      View transaction <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isOwner}
              className={`w-full py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 cursor-wait'
                  : 'btn-primary'
              } ${!isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4" />
                  Set Listing Fee Amount
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
