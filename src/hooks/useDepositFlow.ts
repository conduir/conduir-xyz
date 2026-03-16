import { useState, useCallback, useEffect } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { useWalletConnection } from '../web3/hooks/useWalletConnection';
import { useTokenBalance, useTokenAllowance, useTokenApproval } from '../web3/hooks/useToken';
import { useRouter } from '../web3/hooks/useRouter';
import { useTransactionActions } from '../web3/stores/transactions';
import { getContractAddress } from '../web3/contracts/addresses';
import type { Address } from 'viem';

export interface Asset {
  address: Address;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
}

export interface Vault {
  id: string;
  poolId: bigint;
  protocol: string;
  asset: string;
  apy: number;
  capacity: number;
  utilized: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  tokenA: Address;
  tokenB: Address;
}

export interface DepositState {
  step: 'select' | 'amount' | 'approve' | 'confirm' | 'success';
  selectedAsset: Asset | null;
  selectedVault: Vault | null;
  amount: string;
  amountA: string;
  amountB: string;
  isSubmitting: boolean;
  error: string | null;
  receiptTxHash: string | null;
  approvalPending: boolean;
  needsApproval: boolean;
}

const mockVaults: Vault[] = [
  {
    id: 'pool-0',
    poolId: 0n,
    protocol: 'HydraDX',
    asset: 'DOT',
    apy: 14.2,
    capacity: 15000000,
    utilized: 12400000,
    riskLevel: 'Low',
    tokenA: '0x0000000000000000000000000000000000000000' as Address,
    tokenB: '0x3186e53cdd421a032ac18bbb0540a35e4cd57413' as Address, // Mock USDC
  },
  {
    id: 'pool-1',
    poolId: 1n,
    protocol: 'AstarSwap',
    asset: 'ASTR',
    apy: 18.5,
    capacity: 5000000,
    utilized: 4200000,
    riskLevel: 'Medium',
    tokenA: '0x0000000000000000000000000000000000000001' as Address,
    tokenB: '0x3186e53cdd421a032ac18bbb0540a35e4cd57413' as Address,
  },
];

export function useDepositFlow() {
  const [state, setState] = useState<DepositState>({
    step: 'select',
    selectedAsset: null,
    selectedVault: null,
    amount: '',
    amountA: '',
    amountB: '',
    isSubmitting: false,
    error: null,
    receiptTxHash: null,
    approvalPending: false,
    needsApproval: false,
  });

  const [{ address, isConnected }] = useWalletConnection();
  const { address: accountAddress } = useAccount();
  const connectedAddress = address || accountAddress;

  const routerAddress = getContractAddress('router');
  const usdcAddress = getContractAddress('mockUsdc');

  // Get supported tokens (currently using mock USDC)
  const { tokens: supportedTokens } = useSupportedTokensInternal();

  // Get token balance
  const { balance: tokenBalance, decimals } = useTokenBalance(
    state.selectedAsset?.address || usdcAddress,
    connectedAddress
  );

  // Check token allowance
  const { allowance, refetch: refetchAllowance } = useTokenAllowance(
    state.selectedAsset?.address || usdcAddress,
    connectedAddress,
    routerAddress
  );

  // Router contract hooks
  const { deposit, isPending: isDepositPending } = useRouter();

  // Transaction tracking
  const { addTransaction, updateTransaction } = useTransactionActions();

  // Watch for deposit events
  useWatchContractEvent({
    address: routerAddress,
    abi: [
      {
        type: 'event',
        name: 'Deposit',
        inputs: [
          { name: 'positionId', type: 'uint256', indexed: true },
          { name: 'lp', type: 'address', indexed: true },
          { name: 'poolId', type: 'uint256', indexed: true },
          { name: 'amountA', type: 'uint256' },
          { name: 'amountB', type: 'uint256' },
        ],
      },
    ],
    eventName: 'Deposit',
    onLogs: (logs) => {
      console.log('Deposit event:', logs);
    },
  });

  // Format assets from supported tokens
  const assets: Asset[] = supportedTokens.map((token) => ({
    address: token.address,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    balance: tokenBalance?.toString() || '0',
  }));

  // Check if approval is needed
  useEffect(() => {
    if (state.selectedAsset && allowance && state.amount) {
      const amountBigInt = parseUnits(state.amount, state.selectedAsset.decimals);
      const needsApproval = allowance < amountBigInt;
      setState((prev) => ({ ...prev, needsApproval }));
    }
  }, [allowance, state.amount, state.selectedAsset]);

  const reset = useCallback(() => {
    setState({
      step: 'select',
      selectedAsset: null,
      selectedVault: null,
      amount: '',
      amountA: '',
      amountB: '',
      isSubmitting: false,
      error: null,
      receiptTxHash: null,
      approvalPending: false,
      needsApproval: false,
    });
  }, []);

  const selectAsset = useCallback((asset: Asset) => {
    setState((prev) => ({
      ...prev,
      selectedAsset: asset,
      step: 'amount',
      error: null,
      amount: '',
    }));
  }, []);

  const selectVault = useCallback((vault: Vault) => {
    setState((prev) => ({ ...prev, selectedVault: vault, error: null }));
  }, []);

  const setAmount = useCallback((amount: string) => {
    setState((prev) => ({ ...prev, amount, error: null }));
  }, []);

  const setMaxAmount = useCallback(() => {
    if (!tokenBalance || !decimals) return;
    const maxAmount = formatUnits(tokenBalance, decimals);
    setState((prev) => ({
      ...prev,
      amount: maxAmount,
      error: null,
    }));
  }, [tokenBalance, decimals]);

  const goToStep = useCallback((step: DepositState['step']) => {
    setState((prev) => ({ ...prev, step, error: null }));
  }, []);

  const validateAmount = useCallback((): boolean => {
    if (!state.amount || parseFloat(state.amount) <= 0) {
      setState((prev) => ({ ...prev, error: 'Please enter a valid amount' }));
      return false;
    }
    if (!state.selectedAsset) {
      setState((prev) => ({ ...prev, error: 'Please select an asset' }));
      return false;
    }
    if (!connectedAddress) {
      setState((prev) => ({ ...prev, error: 'Please connect your wallet' }));
      return false;
    }
    if (tokenBalance && decimals) {
      const amountBigInt = parseUnits(state.amount, decimals);
      if (amountBigInt > tokenBalance) {
        setState((prev) => ({ ...prev, error: 'Insufficient balance' }));
        return false;
      }
    }
    if (!state.selectedVault) {
      setState((prev) => ({ ...prev, error: 'Please select a vault' }));
      return false;
    }
    const remainingCapacity = state.selectedVault.capacity - state.selectedVault.utilized;
    if (parseFloat(state.amount) > remainingCapacity) {
      setState((prev) => ({
        ...prev,
        error: `Exceeds vault capacity. Available: $${(remainingCapacity / 1000000).toFixed(2)}M`,
      }));
      return false;
    }
    return true;
  }, [state.amount, state.selectedAsset, state.selectedVault, tokenBalance, decimals, connectedAddress]);

  const approveToken = useCallback(async () => {
    if (!state.selectedAsset || !connectedAddress) {
      setState((prev) => ({ ...prev, error: 'Please connect your wallet' }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const { useTokenApproval } = await import('../web3/hooks/useToken');
      const { approve } = useTokenApproval(state.selectedAsset.address);

      const hash = await approve(routerAddress, state.amount, state.selectedAsset.decimals, true);

      addTransaction(hash, 'approve', connectedAddress, {
        tokenSymbol: state.selectedAsset.symbol,
      });

      setState((prev) => ({
        ...prev,
        approvalPending: true,
        isSubmitting: false,
      }));

      // Wait for approval confirmation
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
  }, [state.selectedAsset, connectedAddress, state.amount, routerAddress, addTransaction, refetchAllowance]);

  const confirmDeposit = useCallback(async () => {
    if (!validateAmount()) return;

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      if (!state.selectedVault || !state.selectedAsset || !connectedAddress) {
        throw new Error('Missing required information');
      }

      const amountA = parseUnits(state.amount, state.selectedAsset.decimals);
      const amountB = 0n; // Single-sided deposit for now

      // For demo, using a zero protocol address
      const protocolAddress = '0x0000000000000000000000000000000000000001' as Address;
      const lockDuration = 30n * 24n * 60n * 60n; // 30 days

      const hash = await deposit(
        state.selectedVault.poolId,
        protocolAddress,
        amountA,
        amountB,
        lockDuration
      );

      addTransaction(hash, 'deposit', connectedAddress, {
        poolId: state.selectedVault.poolId,
        amountA,
        amountB,
        tokenSymbol: state.selectedAsset.symbol,
      });

      setState((prev) => ({
        ...prev,
        step: 'success',
        isSubmitting: false,
        receiptTxHash: hash,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error?.message || 'Deposit failed',
      }));
    }
  }, [validateAmount, state.selectedVault, state.selectedAsset, connectedAddress, state.amount, deposit, addTransaction]);

  const getAvailableVaults = useCallback((assetSymbol: string): Vault[] => {
    return mockVaults.filter((v) => v.asset === assetSymbol);
  }, []);

  const getAssets = useCallback((): Asset[] => {
    return assets;
  }, [assets]);

  const getEstimatedYield = useCallback((): number => {
    if (!state.amount || !state.selectedVault) return 0;
    const annualYield = parseFloat(state.amount) * (state.selectedVault.apy / 100);
    return annualYield;
  }, [state.amount, state.selectedVault]);

  return {
    state,
    actions: {
      reset,
      selectAsset,
      selectVault,
      setAmount,
      setMaxAmount,
      goToStep,
      approveToken,
      confirmDeposit,
      getAvailableVaults,
      getAssets,
      getEstimatedYield,
    },
  };
}

// Helper hook to get supported tokens
function useSupportedTokensInternal() {
  const mockUsdcAddress = getContractAddress('mockUsdc');
  return {
    tokens: [
      {
        address: mockUsdcAddress,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
      },
    ],
  };
}
