import { useState, useCallback } from 'react';

export type VoucherStatus = 'Active' | 'Redeemed' | 'Expired' | 'Traded';

export interface Voucher {
  id: string;
  pool: string;
  amount: number;
  status: VoucherStatus;
  oracle: 'Chainlink' | 'Pyth';
  change24h: string;
  collateralDeposited: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface ProtocolRegistration {
  targetPair: string;
  collateralToken: string;
  collateralAmount: string;
  listingFee: string;
  feeSplit: { upfront: number; accrued: number };
}

export interface VoucherState {
  step: 'list' | 'register' | 'collateral' | 'confirm' | 'success' | 'details';
  selectedVoucher: Voucher | null;
  registration: ProtocolRegistration | null;
  isSubmitting: boolean;
  error: string | null;
  txHash: string | null;
}

const mockVouchers: Voucher[] = [
  {
    id: 'ILV-DOT-USDC',
    pool: 'DOT / USDC',
    amount: 450,
    status: 'Active',
    oracle: 'Chainlink',
    change24h: '+5.2%',
    collateralDeposited: 500000,
    createdAt: new Date('2026-01-15'),
    expiresAt: new Date('2026-06-15'),
  },
  {
    id: 'ILV-ASTR-DOT',
    pool: 'ASTR / DOT',
    amount: 1200,
    status: 'Traded',
    oracle: 'Pyth',
    change24h: '-1.4%',
    collateralDeposited: 750000,
    createdAt: new Date('2025-12-01'),
    expiresAt: new Date('2026-06-01'),
  },
  {
    id: 'ILV-GLMR-USDC',
    pool: 'GLMR / USDC',
    amount: 850,
    status: 'Redeemed',
    oracle: 'Chainlink',
    change24h: '0.0%',
    collateralDeposited: 425000,
    createdAt: new Date('2025-10-01'),
    expiresAt: new Date('2026-04-01'),
  },
];

const targetPairs = [
  'DOT / USDC',
  'ASTR / DOT',
  'GLMR / USDC',
  'ETH / USDT',
  'USDT / USDC',
];

const collateralTokens = [
  { symbol: 'DOT', name: 'Polkadot', balance: '1000000' },
  { symbol: 'ASTR', name: 'Astar', balance: '5000000' },
  { symbol: 'GLMR', name: 'Moonbeam', balance: '2500000' },
];

export function useVoucherFlow() {
  const [state, setState] = useState<VoucherState>({
    step: 'list',
    selectedVoucher: null,
    registration: null,
    isSubmitting: false,
    error: null,
    txHash: null,
  });

  const reset = useCallback(() => {
    setState({
      step: 'list',
      selectedVoucher: null,
      registration: null,
      isSubmitting: false,
      error: null,
      txHash: null,
    });
  }, []);

  const goToStep = useCallback((step: VoucherState['step']) => {
    setState(prev => ({ ...prev, step, error: null }));
  }, []);

  const selectVoucher = useCallback((voucher: Voucher) => {
    setState(prev => ({ ...prev, selectedVoucher: voucher, step: 'details', error: null }));
  }, []);

  const startRegistration = useCallback(() => {
    setState(prev => ({ ...prev, step: 'register', registration: {
      targetPair: '',
      collateralToken: '',
      collateralAmount: '',
      listingFee: '2500',
      feeSplit: { upfront: 0.4, accrued: 0.6 },
    }, error: null }));
  }, []);

  const updateRegistration = useCallback((
    field: keyof ProtocolRegistration,
    value: string | { upfront: number; accrued: number }
  ) => {
    setState(prev => ({
      ...prev,
      registration: prev.registration ? { ...prev.registration, [field]: value } : null,
      error: null,
    }));
  }, []);

  const validateRegistration = useCallback((): boolean => {
    if (!state.registration) {
      setState(prev => ({ ...prev, error: 'Registration not initialized' }));
      return false;
    }
    if (!state.registration.targetPair) {
      setState(prev => ({ ...prev, error: 'Please select a target pair' }));
      return false;
    }
    if (!state.registration.collateralToken) {
      setState(prev => ({ ...prev, error: 'Please select a collateral token' }));
      return false;
    }
    if (!state.registration.collateralAmount || parseFloat(state.registration.collateralAmount) <= 0) {
      setState(prev => ({ ...prev, error: 'Please enter a valid collateral amount' }));
      return false;
    }
    return true;
  }, [state.registration]);

  const calculateVouchersToMint = useCallback((): number => {
    if (!state.registration?.collateralAmount) return 0;
    const collateral = parseFloat(state.registration.collateralAmount);
    return Math.floor(collateral * 0.45); // 1 ILV per ~2.22 collateral
  }, [state.registration?.collateralAmount]);

  const confirmRegistration = useCallback(async () => {
    if (!validateRegistration()) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2500));

    const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    setState(prev => ({
      ...prev,
      step: 'success',
      isSubmitting: false,
      txHash: mockTxHash,
    }));
  }, [validateRegistration]);

  const getVouchers = useCallback((): Voucher[] => {
    return mockVouchers;
  }, []);

  const getVouchersByStatus = useCallback((status: VoucherStatus): Voucher[] => {
    return mockVouchers.filter(v => v.status === status);
  }, []);

  const getTargetPairs = useCallback((): string[] => {
    return targetPairs;
  }, []);

  const getCollateralTokens = useCallback((): typeof collateralTokens => {
    return collateralTokens;
  }, []);

  const getTotalCollateralDeposited = useCallback((): number => {
    return mockVouchers.reduce((sum, v) => sum + v.collateralDeposited, 0);
  }, []);

  const getActiveVouchersCount = useCallback((): number => {
    return mockVouchers.filter(v => v.status === 'Active').length;
  }, []);

  return {
    state,
    actions: {
      reset,
      goToStep,
      selectVoucher,
      startRegistration,
      updateRegistration,
      confirmRegistration,
      getVouchers,
      getVouchersByStatus,
      getTargetPairs,
      getCollateralTokens,
      getTotalCollateralDeposited,
      getActiveVouchersCount,
      calculateVouchersToMint,
    },
  };
}
