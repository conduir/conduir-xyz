import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  ChevronDown,
  Copy,
  LogOut,
  AlertCircle,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useWalletConnection } from '../../web3/hooks/useWalletConnection';
import { useIsCorrectChain } from '../../web3/hooks/useWalletConnection';

/**
 * Props for WalletButton
 */
export interface WalletButtonProps {
  className?: string;
  showBalance?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

/**
 * Wallet Button Component
 *
 * Displays connect button when disconnected, or address/balance when connected
 */
export function WalletButton({
  className = '',
  showBalance = true,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [{ address, isConnected, isConnecting, formattedBalance, chainId },
    { connect, disconnect, switchChain }
  ] = useWalletConnection();

  const isCorrectChain = useIsCorrectChain();

  const handleConnect = async () => {
    try {
      await connect();
      onConnect?.();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsOpen(false);
      onDisconnect?.();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleSwitchChain = async () => {
    try {
      await switchChain();
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Disconnected state
  if (!isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleConnect}
        disabled={isConnecting}
        className={`bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2 disabled:opacity-50 ${className}`}
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </motion.button>
    );
  }

  // Connected state
  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-[#0A0B10] border ${
          !isCorrectChain ? 'border-amber-500/50' : 'border-white/10'
        } px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-3`}
      >
        {!isCorrectChain && (
          <AlertCircle className="w-4 h-4 text-amber-500" />
        )}
        {showBalance && (
          <span className="text-slate-400">{formattedBalance} PAS</span>
        )}
        <span className="text-white">{address && formatAddress(address)}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-72 bg-[#0A0B10] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* Address */}
              <div className="p-4 border-b border-white/10">
                <div className="text-xs text-slate-500 mb-1">Connected as</div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm text-white truncate flex-1">
                    {address}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Balance */}
              {showBalance && (
                <div className="p-4 border-b border-white/10">
                  <div className="text-xs text-slate-500 mb-1">Balance</div>
                  <div className="text-lg font-semibold text-white">
                    {formattedBalance} PAS
                  </div>
                </div>
              )}

              {/* Chain Warning */}
              {!isCorrectChain && (
                <div className="p-4 bg-amber-500/10 border-b border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-amber-500">
                        Wrong Network
                      </div>
                      <div className="text-xs text-amber-400/80 mt-1">
                      Please switch to Polkadot Hub TestNet
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSwitchChain}
                    className="mt-3 w-full px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Switch Network
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="p-2">
                <a
                  href={`https://blockscout-testnet.polkadot.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View in Explorer
                </a>
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-lg text-sm text-slate-300 hover:text-red-500 transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WalletButton;
