import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Droplet,
  Copy,
  Check,
  ExternalLink,
  Wallet,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { WalletButton } from '../components/web3/WalletButton';
import {
  useFaucet,
  useFaucetTokens,
  type FaucetToken,
  type TransactionState,
} from '../web3/hooks/useFaucet';

// Token card color variants
const tokenCardVariants: Record<string, { cardClass: string; iconBg: string; iconBorder: string; iconColor: string }> = {
  USDC: { cardClass: 'card-green', iconBg: 'bg-emerald-500/10', iconBorder: 'border-emerald-500/20', iconColor: 'text-emerald-400' },
  TKNA: { cardClass: 'card-blue', iconBg: 'bg-blue-500/10', iconBorder: 'border-blue-500/20', iconColor: 'text-blue-400' },
  TKNB: { cardClass: 'card-amber', iconBg: 'bg-orange-500/10', iconBorder: 'border-orange-500/20', iconColor: 'text-orange-400' },
};

// Water drop SVG animation component
function WaterDropAnimation({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={`relative ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M12 2.5C12 2.5 4 10.5 4 15.5C4 19.09 6.91 22 10.5 22C14.09 22 17 19.09 17 15.5C17 10.5 9 2.5 9 2.5H12Z"
          fill="url(#waterGradient)"
          filter="url(#glow)"
          animate={{
            d: [
              'M12 2.5C12 2.5 4 10.5 4 15.5C4 19.09 6.91 22 10.5 22C14.09 22 17 19.09 17 15.5C17 10.5 9 2.5 9 2.5H12Z',
              'M12 3C12 3 4.5 11 4.5 15.5C4.5 18.81 7.19 21.5 10.5 21.5C13.81 21.5 16.5 18.81 16.5 15.5C16.5 11 9 3 9 3H12Z',
              'M12 2.5C12 2.5 4 10.5 4 15.5C4 19.09 6.91 22 10.5 22C14.09 22 17 19.09 17 15.5C17 10.5 9 2.5 9 2.5H12Z',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.circle
          cx="9"
          cy="14"
          r="1.5"
          fill="rgba(255,255,255,0.6)"
          animate={{
            cy: [14, 16, 14],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-blue-400/30"
        animate={{
          scale: [1, 1.5, 2],
          opacity: [0.5, 0.2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  );
}

// Dripping animation for buttons
function DrippingButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden"
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-400/0 via-blue-400/10 to-blue-400/20"
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Token card component
function TokenCard({
  token,
  balance,
  txState,
  onMint,
  onCopyAddress,
}: {
  token: FaucetToken & { balance?: bigint; formattedBalance: string };
  balance?: bigint;
  txState: TransactionState;
  onMint: () => void;
  onCopyAddress: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyAddress();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl = `https://blockscout-testnet.polkadot.io/address/${token.address}`;
  const variant = tokenCardVariants[token.symbol] || tokenCardVariants.USDC;
  const Icon = token.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${variant.cardClass} p-6`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-10 h-10 rounded-lg ${variant.iconBg} ${variant.iconBorder} border flex items-center justify-center`}
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className={`w-5 h-5 ${variant.iconColor}`} />
            </motion.div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">{token.symbol}</h3>
              <p className="text-sm text-zinc-500">{token.name}</p>
            </div>
          </div>

          {/* Explorer link */}
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-700 hover:text-zinc-400"
            title="View in explorer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Balance in stat-cell */}
        <div className="stat-cell p-4 mb-4">
          <p className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">Your Balance</p>
          <p className="font-data text-xl text-white">
            {balance !== undefined ? parseFloat(token.formattedBalance).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: Math.min(token.decimals, 6),
            }) : '0.00'}
          </p>
        </div>

        {/* Mint amount info */}
        <div className="mb-4 p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
          <div className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-700 mb-1">Mint Amount</div>
          <div className="font-data text-sm text-zinc-300">
            {parseFloat(token.mintAmount).toLocaleString('en-US')} {token.symbol}
          </div>
        </div>

        {/* Address copy */}
        <div className="mb-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs text-zinc-700 hover:text-zinc-400 transition-colors group/copy"
          >
            <code className="truncate max-w-[150px] font-data text-[10px]">{token.address}</code>
            <motion.div
              className="p-1 hover:bg-white/5 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Mint button */}
        <motion.button
          onClick={onMint}
          disabled={txState === 'pending'}
          whileHover={{ scale: txState === 'idle' ? 1.02 : 1 }}
          whileTap={{ scale: txState === 'idle' ? 0.98 : 1 }}
          className={`w-full py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            txState === 'success'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : txState === 'error'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : txState === 'pending'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 cursor-wait'
              : 'btn-primary'
          }`}
        >
          {txState === 'pending' ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.span>
              Minting...
            </>
          ) : txState === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              Minted!
            </>
          ) : txState === 'error' ? (
            <>
              <AlertCircle className="w-4 h-4" />
              Try Again
            </>
          ) : (
            <>
              <Droplet className="w-3.5 h-3.5" />
              Mint {token.symbol}
            </>
          )}
        </motion.button>

        {/* Status indicator */}
        <AnimatePresence>
          {txState !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 text-center"
            >
              {txState === 'pending' && (
                <p className="font-data text-xs text-blue-400">Transaction pending...</p>
              )}
              {txState === 'success' && (
                <p className="font-data text-xs text-emerald-400">Tokens minted successfully!</p>
              )}
              {txState === 'error' && (
                <p className="font-data text-xs text-red-400">Transaction failed. Please try again.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Info section component
function InfoSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="card p-6 mt-12"
    >
      <h3 className="font-display font-bold text-lg text-white mb-4">About Testnet Faucet</h3>
      <div className="space-y-3 text-sm text-zinc-500">
        <p>
          This faucet allows you to mint test tokens for testing the Conduir Protocol on{' '}
          <a
            href="https://blockscout-testnet.polkadot.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Polkadot Hub TestNet
          </a>
          .
        </p>
        <p>
          These tokens have no real-world value and can only be used on the testnet. You can
          mint up to the specified amount for each token type.
        </p>
        <div className="pt-3 border-t border-white/[0.06]">
          <p className="text-xs text-zinc-700">
            <strong className="text-zinc-500">Need help?</strong> Check out our{' '}
            <a href="/docs" className="text-blue-400 hover:text-blue-300">
              documentation
            </a>{' '}
            or join our Discord community.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Main Faucet page component
export default function Faucet() {
  const { address, isConnected } = useAccount();
  const { tokens, refetchAll } = useFaucetTokens(address);
  const { mintFaucetToken, getTransactionState, resetTransactionState } = useFaucet();
  const [txStates, setTxStates] = useState<Record<string, TransactionState>>({});

  // Refetch balances when connected
  useEffect(() => {
    if (isConnected && address) {
      refetchAll();
    }
  }, [isConnected, address, refetchAll]);

  // Update local tx states when global states change
  useEffect(() => {
    const newStates: Record<string, TransactionState> = {};
    tokens.forEach(token => {
      const state = getTransactionState(token.address);
      if (state !== 'idle') {
        newStates[token.address] = state;
      }
    });
    setTxStates(newStates);
  }, [tokens, getTransactionState]);

  // Refetch balances after successful transaction
  useEffect(() => {
    const hasSuccess = Object.values(txStates).some(s => s === 'success');
    if (hasSuccess) {
      setTimeout(() => refetchAll(), 1000);
    }
  }, [txStates, refetchAll]);

  const handleMint = async (token: FaucetToken) => {
    if (!address) return;

    try {
      setTxStates(prev => ({ ...prev, [token.address]: 'pending' }));
      await mintFaucetToken(token, address);
    } catch (error) {
      console.error('Mint failed:', error);
      setTxStates(prev => ({ ...prev, [token.address]: 'error' }));
      setTimeout(() => {
        setTxStates(prev => {
          const newState = { ...prev };
          if (newState[token.address] === 'error') {
            delete newState[token.address];
          }
          return newState;
        });
      }, 3000);
    }
  };

  const handleCopyAddress = (tokenAddress: string) => {
    navigator.clipboard.writeText(tokenAddress);
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF0877]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        {/* Header Section with WalletButton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-16"
        >
          <div>
            <p className="font-data text-[10px] uppercase tracking-[0.2em] text-zinc-700 mb-1">Polkadot Hub TestNet</p>
            <h1 className="text-3xl font-display font-bold tracking-tight text-white">Testnet Faucet</h1>
          </div>
          <WalletButton />
        </motion.div>

        {/* Connection prompt */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-12 card p-8 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Connect Your Wallet</h2>
            <p className="text-zinc-500 text-sm mb-6">
              Connect your wallet to mint test tokens for experimenting with the Conduir Protocol.
            </p>
          </motion.div>
        )}

        {/* Token Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tokens.map((token, index) => (
            <motion.div
              key={token.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TokenCard
                token={token}
                balance={token.balance}
                txState={txStates[token.address] || 'idle'}
                onMint={() => handleMint(token)}
                onCopyAddress={() => handleCopyAddress(token.address)}
              />
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <InfoSection />
      </div>
    </div>
  );
}
