import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  usePendingTransactions,
  useTransactionActions,
  formatTransaction,
  getExplorerUrl,
  type TransactionStatus,
} from '../../web3/stores/transactions';
import { useWaitForTransactionReceipt } from 'wagmi';

/**
 * Transaction queue component props
 */
export interface TransactionQueueProps {
  maxVisible?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Get status icon for transaction
 */
function getStatusIcon(status: TransactionStatus) {
  switch (status) {
    case 'pending':
    case 'confirming':
      return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    case 'confirmed':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'rejected':
      return <XCircle className="w-5 h-5 text-slate-500" />;
  }
}

/**
 * Get status color for transaction
 */
function getStatusColor(status: TransactionStatus) {
  switch (status) {
    case 'pending':
    case 'confirming':
      return 'border-blue-500/30 bg-blue-500/5';
    case 'confirmed':
      return 'border-emerald-500/30 bg-emerald-500/5';
    case 'failed':
      return 'border-red-500/30 bg-red-500/5';
    case 'rejected':
      return 'border-slate-500/30 bg-slate-500/5';
  }
}

/**
 * Position classes
 */
const positionClasses: Record<
  Required<TransactionQueueProps>['position'],
  string
> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};

/**
 * Transaction Queue Component
 *
 * Displays pending and recent transactions with live status updates
 */
export function TransactionQueue({
  maxVisible = 3,
  position = 'top-right',
}: TransactionQueueProps) {
  const pendingTxs = usePendingTransactions();
  const { updateTransaction, removeTransaction } = useTransactionActions();

  // Auto-remove confirmed transactions after 5 seconds
  useEffect(() => {
    pendingTxs.forEach((tx) => {
      if (tx.status === 'confirmed') {
        const timer = setTimeout(() => {
          removeTransaction(tx.hash);
        }, 5000);
        return () => clearTimeout(timer);
      }
    });
  }, [pendingTxs, removeTransaction]);

  // Get receipts for all transactions
  const transactionsWithReceipts = pendingTxs.map((tx) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: receipt } = useWaitForTransactionReceipt({
      hash: tx.hash,
    });
    return { tx, receipt };
  });

  // Update transaction status when receipt changes
  useEffect(() => {
    transactionsWithReceipts.forEach(({ tx, receipt }) => {
      if (!receipt) return;

      if (receipt.status === 'success') {
        updateTransaction(tx.hash, {
          status: 'confirmed',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
        });
      } else if (receipt.status === 'reverted') {
        updateTransaction(tx.hash, {
          status: 'failed',
          error: 'Transaction reverted',
        });
      }
    });
  }, [transactionsWithReceipts, updateTransaction]);

  const visibleTxs = pendingTxs.slice(0, maxVisible);

  if (visibleTxs.length === 0) {
    return null;
  }

  return (
    <div className={`fixed z-50 ${positionClasses[position]} space-y-2`}>
      <AnimatePresence mode="popLayout">
        {visibleTxs.map((tx) => {
          const formatted = formatTransaction(tx);

          return (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, x: position.includes('right') ? 50 : -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`w-80 border rounded-xl p-4 ${getStatusColor(tx.status)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(tx.status)}
                  <div>
                    <div className="text-sm font-medium text-white">
                      {formatted.typeLabel}
                    </div>
                    <div className="text-xs text-slate-500">
                      {tx.status === 'confirming'
                        ? 'Confirming...'
                        : tx.status === 'pending'
                        ? 'Pending...'
                        : formatted.statusLabel}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeTransaction(tx.hash)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Transaction details */}
              {(tx.metadata?.amountA || tx.metadata?.amountB) && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-slate-500">Amount</div>
                  <div className="text-sm text-white">
                    {tx.metadata.amountA && `${tx.metadata.amountA.toString()} `}
                    {tx.metadata.tokenSymbol || 'tokens'}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={getExplorerUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View transaction
                </a>
                {tx.error && (
                  <span className="text-xs text-red-400 ml-auto">
                    {tx.error.slice(0, 30)}...
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default TransactionQueue;
