import { useState, useCallback, useEffect } from 'react';
import type { PredictionResponse, YieldPrediction } from '../types/ai';

export interface Asset {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
}

export interface Vault {
  id: string;
  protocol: string;
  asset: string;
  apy: number;
  capacity: number;
  utilized: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface DepositState {
  step: 'select' | 'amount' | 'confirm' | 'success';
  selectedAsset: Asset | null;
  selectedVault: Vault | null;
  amount: string;
  isSubmitting: boolean;
  error: string | null;
  receiptTxHash: string | null;
}

const mockAssets: Asset[] = [
  { symbol: 'DOT', name: 'Polkadot', balance: '50000', decimals: 10 },
  { symbol: 'USDT', name: 'Tether', balance: '1000000', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin', balance: '500000', decimals: 6 },
  { symbol: 'ETH', name: 'Ethereum', balance: '250', decimals: 18 },
];

const mockVaults: Vault[] = [
  { id: 'hydra-dot-usdc', protocol: 'HydraDX', asset: 'DOT', apy: 14.2, capacity: 15000000, utilized: 12400000, riskLevel: 'Low' },
  { id: 'arthswap-usdt', protocol: 'ArthSwap', asset: 'USDT', apy: 18.5, capacity: 5000000, utilized: 4200000, riskLevel: 'Medium' },
  { id: 'stellaswap-eth', protocol: 'StellaSwap', asset: 'ETH', apy: 16.8, capacity: 10000000, utilized: 8100000, riskLevel: 'Low' },
];

export function useDepositFlow() {
  const [state, setState] = useState<DepositState>({
    step: 'select',
    selectedAsset: null,
    selectedVault: null,
    amount: '',
    isSubmitting: false,
    error: null,
    receiptTxHash: null,
  });

  // AI predictions state
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Fetch AI predictions for available vaults
  const fetchAIPredictions = useCallback(async (assetVaults?: Vault[]) => {
    setPredictionsLoading(true);
    setAiError(null);

    try {
      const vaultsToFetch = assetVaults || mockVaults;
      const response = await fetch(`${API_BASE_URL}/api/predictions/yield`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaults: vaultsToFetch }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      setPredictions(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch AI predictions';
      setAiError(message);
      console.error('AI predictions fetch error:', err);
    } finally {
      setPredictionsLoading(false);
    }
  }, [API_BASE_URL]);

  // Get AI recommendation for a specific vault
  const getVaultPrediction = useCallback((vaultId: string): YieldPrediction | undefined => {
    return predictions?.predictions.find(p => p.vaultId === vaultId);
  }, [predictions]);

  // Get top recommended vault for an asset
  const getTopVaultForAsset = useCallback((assetSymbol: string): Vault | null => {
    const assetVaults = mockVaults.filter(v => v.asset === assetSymbol);
    if (!predictions?.predictions) return assetVaults[0] || null;

    const assetPredictions = predictions.predictions.filter(p =>
      assetVaults.some(v => v.id === p.vaultId)
    );

    if (assetPredictions.length === 0) return assetVaults[0] || null;

    const topPrediction = assetPredictions
      .filter(p => p.confidence === 'High' || p.confidence === 'Medium')
      .sort((a, b) => b.predictions.days30 - a.predictions.days30)[0];

    return topPrediction?.vault || assetVaults[0] || null;
  }, [predictions]);

  // Auto-fetch predictions on mount
  useEffect(() => {
    fetchAIPredictions();
  }, [fetchAIPredictions]);

  const reset = useCallback(() => {
    setState({
      step: 'select',
      selectedAsset: null,
      selectedVault: null,
      amount: '',
      isSubmitting: false,
      error: null,
      receiptTxHash: null,
    });
  }, []);

  const selectAsset = useCallback((asset: Asset) => {
    setState(prev => ({ ...prev, selectedAsset: asset, step: 'amount', error: null }));
  }, []);

  const selectVault = useCallback((vault: Vault) => {
    setState(prev => ({ ...prev, selectedVault: vault, error: null }));
  }, []);

  const setAmount = useCallback((amount: string) => {
    setState(prev => ({ ...prev, amount, error: null }));
  }, []);

  const setMaxAmount = useCallback(() => {
    setState(prev => ({
      ...prev,
      amount: prev.selectedAsset?.balance || '0',
      error: null,
    }));
  }, []);

  const goToStep = useCallback((step: DepositState['step']) => {
    setState(prev => ({ ...prev, step, error: null }));
  }, []);

  const validateAmount = useCallback((): boolean => {
    if (!state.amount || parseFloat(state.amount) <= 0) {
      setState(prev => ({ ...prev, error: 'Please enter a valid amount' }));
      return false;
    }
    if (!state.selectedAsset) {
      setState(prev => ({ ...prev, error: 'Please select an asset' }));
      return false;
    }
    if (parseFloat(state.amount) > parseFloat(state.selectedAsset.balance)) {
      setState(prev => ({ ...prev, error: 'Insufficient balance' }));
      return false;
    }
    if (!state.selectedVault) {
      setState(prev => ({ ...prev, error: 'Please select a vault' }));
      return false;
    }
    const remainingCapacity = state.selectedVault.capacity - state.selectedVault.utilized;
    if (parseFloat(state.amount) > remainingCapacity) {
      setState(prev => ({ ...prev, error: `Exceeds vault capacity. Available: $${(remainingCapacity / 1000000).toFixed(2)}M` }));
      return false;
    }
    return true;
  }, [state.amount, state.selectedAsset, state.selectedVault]);

  const confirmDeposit = useCallback(async () => {
    if (!validateAmount()) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    setState(prev => ({
      ...prev,
      step: 'success',
      isSubmitting: false,
      receiptTxHash: mockTxHash,
    }));
  }, [validateAmount]);

  const getAvailableVaults = useCallback((assetSymbol: string): Vault[] => {
    return mockVaults.filter(v => v.asset === assetSymbol);
  }, []);

  const getAssets = useCallback((): Asset[] => {
    return mockAssets;
  }, []);

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
      confirmDeposit,
      getAvailableVaults,
      getAssets,
      getEstimatedYield,
      fetchAIPredictions,
      getVaultPrediction,
      getTopVaultForAsset,
    },
    ai: {
      predictions,
      predictionsLoading,
      aiError,
    },
  };
}
