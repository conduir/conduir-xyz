import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address } from 'viem';

/**
 * Transaction status
 */
export type TransactionStatus =
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'rejected';

/**
 * Transaction type
 */
export type TransactionType =
  | 'deposit'
  | 'withdraw'
  | 'approve'
  | 'registerProtocol'
  | 'lockCollateral'
  | 'unlockCollateral';

/**
 * Transaction metadata
 */
export interface TransactionMetadata {
  positionId?: bigint;
  poolId?: bigint;
  amountA?: bigint;
  amountB?: bigint;
  tokenSymbol?: string;
  protocol?: Address;
  voucherId?: bigint;
}

/**
 * Transaction record
 */
export interface Transaction {
  id: string;
  hash: `0x${string}`;
  type: TransactionType;
  status: TransactionStatus;
  from: Address;
  timestamp: number;
  blockNumber?: number;
  gasUsed?: bigint;
  metadata?: TransactionMetadata;
  error?: string;
}

/**
 * Transaction store state
 */
interface TransactionState {
  transactions: Transaction[];
  pendingTransactions: Transaction[];
}

/**
 * Transaction store actions
 */
interface TransactionActions {
  addTransaction: (
    hash: `0x${string}`,
    type: TransactionType,
    from: Address,
    metadata?: TransactionMetadata
  ) => void;
  updateTransaction: (
    hash: `0x${string}`,
    updates: Partial<Omit<Transaction, 'id' | 'hash' | 'type' | 'from' | 'timestamp'>>
  ) => void;
  removeTransaction: (hash: `0x${string}`) => void;
  getTransaction: (hash: `0x${string}`) => Transaction | undefined;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByAddress: (address: Address) => Transaction[];
  clearTransactions: () => void;
  clearOldTransactions: (olderThan: number) => void;
}

/**
 * Create transaction store
 */
const useTransactionStoreBase = create<
  TransactionState & TransactionActions
>()(
  persist(
    (set, get) => ({
      transactions: [],

      get pendingTransactions() {
        return get().transactions.filter(
          (tx) => tx.status === 'pending' || tx.status === 'confirming'
        );
      },

      addTransaction: (hash, type, from, metadata) => {
        const newTransaction: Transaction = {
          id: `${Date.now()}-${type}`,
          hash,
          type,
          status: 'pending',
          from,
          timestamp: Date.now(),
          metadata,
        };

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));

        return newTransaction.id;
      },

      updateTransaction: (hash, updates) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.hash === hash ? { ...tx, ...updates } : tx
          ),
        }));
      },

      removeTransaction: (hash) => {
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.hash !== hash),
        }));
      },

      getTransaction: (hash) => {
        return get().transactions.find((tx) => tx.hash === hash);
      },

      getTransactionsByType: (type) => {
        return get().transactions.filter((tx) => tx.type === type);
      },

      getTransactionsByAddress: (address) => {
        return get().transactions.filter((tx) =>
          tx.from.toLowerCase() === address.toLowerCase()
        );
      },

      clearTransactions: () => {
        set({ transactions: [] });
      },

      clearOldTransactions: (olderThan) => {
        const cutoff = Date.now() - olderThan;
        set((state) => ({
          transactions: state.transactions.filter(
            (tx) => tx.timestamp > cutoff
          ),
        }));
      },
    }),
    {
      name: 'conduir-transactions',
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
);

/**
 * Hook for transaction store
 */
export const useTransactionStore = useTransactionStoreBase;

/**
 * Hook for pending transactions
 */
export function usePendingTransactions() {
  const transactions = useTransactionStore((state) => state.transactions);
  return transactions.filter(
    (tx) => tx.status === 'pending' || tx.status === 'confirming'
  );
}

/**
 * Hook for transactions by address
 */
export function useUserTransactions(address?: Address) {
  const transactions = useTransactionStore((state) => state.transactions);

  if (!address) return [];

  return transactions.filter(
    (tx) => tx.from.toLowerCase() === address.toLowerCase()
  );
}

/**
 * Hook for recent transactions
 */
export function useRecentTransactions(limit = 10) {
  const transactions = useTransactionStore((state) => state.transactions);
  return transactions.slice(0, limit);
}

/**
 * Hook for transaction actions
 */
export function useTransactionActions() {
  return {
    addTransaction: useTransactionStore((state) => state.addTransaction),
    updateTransaction: useTransactionStore((state) => state.updateTransaction),
    removeTransaction: useTransactionStore((state) => state.removeTransaction),
    getTransaction: useTransactionStore((state) => state.getTransaction),
    getTransactionsByType: useTransactionStore(
      (state) => state.getTransactionsByType
    ),
    getTransactionsByAddress: useTransactionStore(
      (state) => state.getTransactionsByAddress
    ),
    clearTransactions: useTransactionStore((state) => state.clearTransactions),
    clearOldTransactions: useTransactionStore(
      (state) => state.clearOldTransactions
    ),
  };
}

/**
 * Utility: Format transaction for display
 */
export function formatTransaction(tx: Transaction) {
  const typeLabels: Record<TransactionType, string> = {
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    approve: 'Approve Token',
    registerProtocol: 'Register Protocol',
    lockCollateral: 'Lock Collateral',
    unlockCollateral: 'Unlock Collateral',
  };

  const statusLabels: Record<TransactionStatus, string> = {
    pending: 'Pending',
    confirming: 'Confirming',
    confirmed: 'Confirmed',
    failed: 'Failed',
    rejected: 'Rejected',
  };

  return {
    ...tx,
    typeLabel: typeLabels[tx.type],
    statusLabel: statusLabels[tx.status],
  };
}

/**
 * Utility: Get explorer URL for transaction
 */
export function getExplorerUrl(hash: `0x${string}`) {
  // Polkadot testnet explorer
  return `https://explorer.polkadot.io/tx/${hash}`;
}
