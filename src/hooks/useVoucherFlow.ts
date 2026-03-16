import { useState, useCallback, useEffect } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useWalletConnection } from '../web3/hooks/useWalletConnection';
import { useRouter } from '../web3/hooks/useRouter';
import { useVoucher, useVoucherBalance } from '../web3/hooks/useVoucher';
import { useCollateral, useRequiredCollateral } from '../web3/hooks/useCollateral';
import { useTokenBalance, useTokenAllowance, useTokenApproval } from '../web3/hooks/useToken';
import { useTransactionActions } from '../web3/stores/transactions';
import { getContractAddress } from '../web3/contracts/addresses';
import type { Address } from 'viem';

export type VoucherStatus = 'Active' | 'Redeemed' | 'Expired' | 'Traded';

export interface Voucher {
  id: string;
  voucherId: bigint;
  pool: string;
  poolId: bigint;
  amount: number;
  status: VoucherStatus;
  oracle: 'Chainlink' | 'Pyth';
  change24h: string;
  collateralDeposited: number;
  createdAt: Date;
  expiresAt: Date;
  protocol: Address;
}

export interface ProtocolRegistration {
  targetPair: string;
  poolId: bigint;
  collateralToken: Address;
  collateralAmount: string;
  collateralDecimals: number;
  listingFee: string;
  feeSplit: { upfront: number; accrued: number };
}

export interface VoucherState {
  step: 'list' | 'register' | 'collateral' | 'approve' | 'confirm' | 'success' | 'details';
  selectedVoucher: Voucher | null;
  registration: ProtocolRegistration | null;
  isSubmitting: boolean;
  error: string | null;
  txHash: string | null;
  approvalPending: boolean;
  needsApproval: boolean;
}

const targetPairs = [
  { id: 'DOT/USDC', label: 'DOT / USDC', poolId: 0n },
  { id: 'ASTR/DOT', label: 'ASTR / DOT', poolId: 1n },
  { id: 'GLMR/USDC', label: 'GLMR / USDC', poolId: 2n },
  { id: 'ETH/USDT', label: 'ETH / USDT', poolId: 3n },
];

const collateralTokens = [
  { address: '0x3186e53cdd421a032ac18bbb0540a35e4cd57413' as Address, symbol: 'USDC', name: 'USD Coin', decimals: 6, balance: '1000000' },
  { address: '0x0000000000000000000000000000000000000001' as Address, symbol: 'DOT', name: 'Polkadot', decimals: 10, balance: '5000000' },
  { address: '0x0000000000000000000000000000000000000002' as Address, symbol: 'ASTR', name: 'Astar', decimals: 18, balance: '2500000' },
];

export function useVoucherFlow() {
  const [state, setState] = useState<VoucherState>({
    step: 'list',
    selectedVoucher: null,
    registration: null,
    isSubmitting: false,
    error: null,
    txHash: null,
    approvalPending: false,
    needsApproval: false,
  });

  const [{ address, isConnected }] = useWalletConnection();
  const { address: accountAddress } = useAccount();
  const connectedAddress = address || accountAddress;

  const routerAddress = getContractAddress('router');
  const collateralManagerAddress = getContractAddress('collateralManager');
  const usdcAddress = getContractAddress('mockUsdc');

  // Router hooks
  const { listingFee, registerProtocol } = useRouter();

  // Voucher hooks
  const { getActiveVouchers, getBalance } = useVoucher();
  const { balance: voucherBalance } = useVoucherBalance(connectedAddress);

  // Collateral hooks
  const { lockCollateral } = useCollateral();
  const { required: requiredCollateral } = useRequiredCollateral(
    state.registration?.poolId || 0n
  );

  // Token hooks
  const { balance: collateralBalance, decimals: collateralDecimals } =
    useTokenBalance(
      state.registration?.collateralToken || usdcAddress,
      connectedAddress
    );

  const { allowance, refetch: refetchAllowance } = useTokenAllowance(
    state.registration?.collateralToken || usdcAddress,
    connectedAddress,
    routerAddress
  );

  // Transaction tracking
  const { addTransaction, updateTransaction } = useTransactionActions();

  // Check if approval is needed
  useEffect(() => {
    if (
      state.registration?.collateralAmount &&
      allowance &&
      state.registration.collateralDecimals
    ) {
      const amountBigInt = parseUnits(
        state.registration.collateralAmount,
        state.registration.collateralDecimals
      );
      const needsApproval = allowance < amountBigInt;
      setState((prev) => ({ ...prev, needsApproval }));
    }
  }, [allowance, state.registration]);

  // Format voucher list from contract data
  const vouchers: Voucher[] = [];

  const reset = useCallback(() => {
    setState({
      step: 'list',
      selectedVoucher: null,
      registration: null,
      isSubmitting: false,
      error: null,
      txHash: null,
      approvalPending: false,
      needsApproval: false,
    });
  }, []);

  const goToStep = useCallback((step: VoucherState['step']) => {
    setState((prev) => ({ ...prev, step, error: null }));
  }, []);

  const selectVoucher = useCallback((voucher: Voucher) => {
    setState((prev) => ({
      ...prev,
      selectedVoucher: voucher,
      step: 'details',
      error: null,
    }));
  }, []);

  const startRegistration = useCallback(() => {
    const listingFeeValue = listingFee ? formatUnits(listingFee, 18) : '2500';

    setState((prev) => ({
      ...prev,
      step: 'register',
      registration: {
        targetPair: '',
        poolId: 0n,
        collateralToken: usdcAddress,
        collateralAmount: '',
        collateralDecimals: 6,
        listingFee: listingFeeValue,
        feeSplit: { upfront: 0.4, accrued: 0.6 },
      },
      error: null,
    }));
  }, [listingFee, usdcAddress]);

  const updateRegistration = useCallback((
    field: keyof ProtocolRegistration,
    value: string | bigint | { upfront: number; accrued: number }
  ) => {
    setState((prev) => ({
      ...prev,
      registration: prev.registration
        ? { ...prev.registration, [field]: value }
        : null,
      error: null,
    }));
  }, []);

  const validateRegistration = useCallback((): boolean => {
    if (!state.registration) {
      setState((prev) => ({ ...prev, error: 'Registration not initialized' }));
      return false;
    }
    if (!state.registration.targetPair) {
      setState((prev) => ({ ...prev, error: 'Please select a target pair' }));
      return false;
    }
    if (!state.registration.collateralToken) {
      setState((prev) => ({ ...prev, error: 'Please select a collateral token' }));
      return false;
    }
    if (
      !state.registration.collateralAmount ||
      parseFloat(state.registration.collateralAmount) <= 0
    ) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter a valid collateral amount',
      }));
      return false;
    }
    if (!connectedAddress) {
      setState((prev) => ({ ...prev, error: 'Please connect your wallet' }));
      return false;
    }

    // Check balance
    if (collateralBalance && state.registration.collateralDecimals) {
      const amountBigInt = parseUnits(
        state.registration.collateralAmount,
        state.registration.collateralDecimals
      );
      if (amountBigInt > collateralBalance) {
        setState((prev) => ({
          ...prev,
          error: 'Insufficient collateral token balance',
        }));
        return false;
      }
    }

    return true;
  }, [
    state.registration,
    connectedAddress,
    collateralBalance,
  ]);

  const calculateVouchersToMint = useCallback((): number => {
    if (!state.registration?.collateralAmount) return 0;
    const collateral = parseFloat(state.registration.collateralAmount);
    return Math.floor(collateral * 0.45); // 1 ILV per ~2.22 collateral
  }, [state.registration?.collateralAmount]);

  const approveCollateral = useCallback(async () => {
    if (!state.registration || !connectedAddress) {
      setState((prev) => ({ ...prev, error: 'Please connect your wallet' }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const { useTokenApproval } = await import('../web3/hooks/useToken');
      const { approve } = useTokenApproval(state.registration.collateralToken);

      const hash = await approve(
        routerAddress,
        state.registration.collateralAmount,
        state.registration.collateralDecimals,
        true
      );

      addTransaction(hash, 'approve', connectedAddress, {
        tokenSymbol: 'USDC',
      });

      setState((prev) => ({
        ...prev,
        approvalPending: true,
        isSubmitting: false,
      }));

      setTimeout(() => {
        refetchAllowance();
        setState((prev) => ({
          ...prev,
          approvalPending: false,
          step: 'confirm',
        }));
      }, 3000);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error?.message || 'Approval failed',
      }));
    }
  }, [state.registration, connectedAddress, routerAddress, addTransaction, refetchAllowance]);

  const confirmRegistration = useCallback(async () => {
    if (!validateRegistration()) return;

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      if (!state.registration || !connectedAddress) {
        throw new Error('Missing required information');
      }

      const collateralAmount = parseUnits(
        state.registration.collateralAmount,
        state.registration.collateralDecimals
      );

      const hash = await registerProtocol(
        state.registration.poolId,
        collateralAmount
      );

      addTransaction(hash, 'registerProtocol', connectedAddress, {
        poolId: state.registration.poolId,
        amountA: collateralAmount,
        tokenSymbol: 'USDC',
      });

      setState((prev) => ({
        ...prev,
        step: 'success',
        isSubmitting: false,
        txHash: hash,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error?.message || 'Registration failed',
      }));
    }
  }, [validateRegistration, state.registration, connectedAddress, registerProtocol, addTransaction]);

  const getVouchers = useCallback((): Voucher[] => {
    return vouchers;
  }, [vouchers]);

  const getVouchersByStatus = useCallback((status: VoucherStatus): Voucher[] => {
    return vouchers.filter((v) => v.status === status);
  }, [vouchers]);

  const getTargetPairs = useCallback((): string[] => {
    return targetPairs.map((p) => p.label);
  }, []);

  const getCollateralTokens = useCallback((): typeof collateralTokens => {
    return collateralTokens;
  }, []);

  const getTotalCollateralDeposited = useCallback((): number => {
    return vouchers.reduce((sum, v) => sum + v.collateralDeposited, 0);
  }, [vouchers]);

  const getActiveVouchersCount = useCallback((): number => {
    return vouchers.filter((v) => v.status === 'Active').length;
  }, [vouchers]);

  const getPoolIdForPair = useCallback((pair: string): bigint => {
    const found = targetPairs.find((p) => p.label === pair);
    return found?.poolId || 0n;
  }, []);

  return {
    state,
    actions: {
      reset,
      goToStep,
      selectVoucher,
      startRegistration,
      updateRegistration,
      approveCollateral,
      confirmRegistration,
      getVouchers,
      getVouchersByStatus,
      getTargetPairs,
      getCollateralTokens,
      getTotalCollateralDeposited,
      getActiveVouchersCount,
      calculateVouchersToMint,
      getPoolIdForPair,
    },
  };
}
