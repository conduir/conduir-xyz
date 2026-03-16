import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { useWalletConnection } from '../web3/hooks/useWalletConnection';
import { useUserTransactions } from '../web3/stores/transactions';
import { getContractAddress } from '../web3/contracts/addresses';
import type { Address } from 'viem';

export interface FeeEntry {
  id: string;
  hash: `0x${string}`;
  type: 'Listing Fee' | 'Trading Fee' | 'Residual';
  amount: number;
  timestamp: Date;
  vault: string;
  status: 'pending' | 'distributed' | 'refunded';
  breakdown?: FeeBreakdown;
}

export interface FeeBreakdown {
  upfront: number;
  accrued: number;
  total: number;
}

export interface FeeSnapshot {
  period: string;
  upfrontFees: number;
  accruedFees: number;
  tradingFees: number;
  totalDistributed: number;
  residualsReturned: number;
}

export interface FeeState {
  selectedEntry: FeeEntry | null;
  timeRange: '7d' | '30d' | '90d' | 'all';
  view: 'overview' | 'breakdown' | 'history';
}

// Mock historical data for snapshots
const mockSnapshots: FeeSnapshot[] = [
  {
    period: 'Oct',
    upfrontFees: 5000,
    accruedFees: 3200,
    tradingFees: 12000,
    totalDistributed: 8500,
    residualsReturned: 0,
  },
  {
    period: 'Nov',
    upfrontFees: 7500,
    accruedFees: 4800,
    tradingFees: 15500,
    totalDistributed: 12300,
    residualsReturned: 200,
  },
  {
    period: 'Dec',
    upfrontFees: 6000,
    accruedFees: 5200,
    tradingFees: 18200,
    totalDistributed: 11200,
    residualsReturned: 350,
  },
  {
    period: 'Jan',
    upfrontFees: 10000,
    accruedFees: 7500,
    tradingFees: 24500,
    totalDistributed: 17500,
    residualsReturned: 0,
  },
  {
    period: 'Feb',
    upfrontFees: 8500,
    accruedFees: 8100,
    tradingFees: 28300,
    totalDistributed: 16600,
    residualsReturned: 500,
  },
  {
    period: 'Mar',
    upfrontFees: 5000,
    accruedFees: 4250,
    tradingFees: 15200,
    totalDistributed: 9250,
    residualsReturned: 0,
  },
];

export function useFeeFlow() {
  const [state, setState] = useState<FeeState>({
    selectedEntry: null,
    timeRange: '30d',
    view: 'overview',
  });

  const [{ address }] = useWalletConnection();
  const { address: accountAddress } = useAccount();
  const connectedAddress = address || accountAddress;

  // Get user transactions from the store
  const userTransactions = useUserTransactions(connectedAddress);

  const routerAddress = getContractAddress('router');

  // Watch for fee-related contract events
  useWatchContractEvent({
    address: routerAddress,
    abi: [
      {
        type: 'event',
        name: 'ProtocolRegistered',
        inputs: [
          { name: 'voucherId', type: 'uint256', indexed: true },
          { name: 'protocol', type: 'address', indexed: true },
          { name: 'poolId', type: 'uint256', indexed: true },
          { name: 'collateral', type: 'uint256' },
        ],
      },
    ],
    eventName: 'ProtocolRegistered',
    onLogs: (logs) => {
      console.log('ProtocolRegistered event:', logs);
    },
  });

  // Convert transactions to fee entries
  const feeEntries: FeeEntry[] = userTransactions.map((tx) => {
    const isListingFee = tx.type === 'registerProtocol';
    const isDeposit = tx.type === 'deposit';
    const isWithdraw = tx.type === 'withdraw';

    let feeType: FeeEntry['type'] = 'Trading Fee';
    if (isListingFee) feeType = 'Listing Fee';
    if (isWithdraw && tx.metadata?.amountA) feeType = 'Residual';

    return {
      id: tx.id,
      hash: tx.hash,
      type: feeType,
      amount: tx.metadata?.amountA
        ? Number(tx.metadata.amountA) / 1e6
        : 0,
      timestamp: new Date(tx.timestamp),
      vault: tx.metadata?.tokenSymbol
        ? `${tx.metadata.tokenSymbol}/USDC`
        : 'Unknown',
      status: tx.status === 'confirmed'
        ? 'distributed'
        : tx.status === 'failed'
        ? 'refunded'
        : 'pending',
      breakdown:
        feeType === 'Listing Fee'
          ? {
              upfront: 0,
              accrued: 0,
              total: tx.metadata?.amountA
                ? Number(tx.metadata.amountA) / 1e6
                : 0,
            }
          : undefined,
    };
  });

  const setView = useCallback((view: FeeState['view']) => {
    setState((prev) => ({ ...prev, view }));
  }, []);

  const setTimeRange = useCallback((timeRange: FeeState['timeRange']) => {
    setState((prev) => ({ ...prev, timeRange }));
  }, []);

  const selectEntry = useCallback((entry: FeeEntry | null) => {
    setState((prev) => ({ ...prev, selectedEntry: entry }));
  }, []);

  const getFeeEntries = useCallback((): FeeEntry[] => {
    const now = new Date();
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, 'all': 365 * 10 };
    const cutoff =
      new Date(now.getTime() - daysMap[state.timeRange] * 24 * 60 * 60 * 1000);

    return feeEntries.filter((e) => e.timestamp >= cutoff);
  }, [feeEntries, state.timeRange]);

  const getTotalFees = useCallback((): {
    upfront: number;
    accrued: number;
    trading: number;
    total: number;
  } => {
    const entries = getFeeEntries();
    let upfront = 0,
      accrued = 0,
      trading = 0;

    entries.forEach((e) => {
      if (e.type === 'Listing Fee' && e.breakdown) {
        upfront += e.breakdown.upfront;
        accrued += e.breakdown.accrued;
      } else if (e.type === 'Trading Fee') {
        trading += e.amount;
        accrued += e.amount;
      }
    });

    return { upfront, accrued, trading, total: upfront + accrued + trading };
  }, [getFeeEntries]);

  const getSnapshots = useCallback((): FeeSnapshot[] => {
    return mockSnapshots;
  }, []);

  const getFeeDistribution = useCallback((): {
    label: string;
    value: number;
    color: string;
  }[] => {
    const totals = getTotalFees();
    return [
      { label: 'Upfront Fees', value: totals.upfront, color: '#E6007A' },
      { label: 'Accrued Fees', value: totals.accrued, color: '#3b82f6' },
      { label: 'Trading Fees', value: totals.trading, color: '#10b981' },
    ];
  }, [getTotalFees]);

  const simulateFeeCalculation = useCallback((listingFee: number): FeeBreakdown => {
    const upfront = listingFee * 0.4;
    const accrued = listingFee * 0.6;
    return { upfront, accrued, total: listingFee };
  }, []);

  const getProjectedRevenue = useCallback((): {
    daily: number;
    weekly: number;
    monthly: number;
  } => {
    const totals = getTotalFees();
    const dailyRate = totals.total / 30;
    return {
      daily: dailyRate,
      weekly: dailyRate * 7,
      monthly: dailyRate * 30,
    };
  }, [getTotalFees]);

  const getUnclaimedFees = useCallback((): number => {
    return feeEntries
      .filter((e) => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [feeEntries]);

  const getResidualsThisMonth = useCallback((): number => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return feeEntries
      .filter((e) => e.type === 'Residual' && e.timestamp >= startOfMonth)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [feeEntries]);

  // Refresh transaction data from contract events
  const refreshFees = useCallback(() => {
    // This would trigger a refetch of contract events
    console.log('Refreshing fee data...');
  }, []);

  return {
    state,
    actions: {
      setView,
      setTimeRange,
      selectEntry,
      getFeeEntries,
      getTotalFees,
      getSnapshots,
      getFeeDistribution,
      simulateFeeCalculation,
      getProjectedRevenue,
      getUnclaimedFees,
      getResidualsThisMonth,
      refreshFees,
    },
  };
}
