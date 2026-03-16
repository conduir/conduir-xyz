import { useState, useCallback, useEffect } from 'react';
import type { Vault, PredictionResponse, YieldPrediction } from '../types/ai';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const FETCH_COOLDOWN = 30 * 1000; // 30 seconds between fetches

interface UseAIPredictionsOptions {
  autoFetch?: boolean;
  vaults?: Vault[];
  enabled?: boolean;
}

interface UseAIPredictionsReturn {
  data: PredictionResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getTopRecommendation: () => YieldPrediction | undefined;
  getPredictionForVault: (vaultId: string) => YieldPrediction | undefined;
  isAIEnabled: boolean;
}

export function useAIPredictions(options: UseAIPredictionsOptions = {}): UseAIPredictionsReturn {
  const { autoFetch = false, vaults, enabled = true } = options;

  const [data, setData] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  const fetchPredictions = useCallback(async (): Promise<void> => {
    if (!enabled) return;

    // Rate limiting
    if (lastFetch && Date.now() - lastFetch < FETCH_COOLDOWN) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = vaults
        ? `${API_BASE_URL}/api/predictions/yield?vaults=${encodeURIComponent(JSON.stringify(vaults))}`
        : `${API_BASE_URL}/api/predictions/yield`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result: PredictionResponse = await response.json();
      setData(result);
      setLastFetch(Date.now());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch predictions';
      setError(message);
      console.error('AI predictions fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [vaults, enabled, lastFetch]);

  const getTopRecommendation = useCallback((): YieldPrediction | undefined => {
    return data?.topRecommendation;
  }, [data]);

  const getPredictionForVault = useCallback((vaultId: string): YieldPrediction | undefined => {
    return data?.predictions.find(p => p.vaultId === vaultId);
  }, [data]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && enabled) {
      fetchPredictions();
    }
  }, [autoFetch, enabled, fetchPredictions]);

  // Auto-refresh data periodically
  useEffect(() => {
    if (!autoFetch || !enabled) return;

    const interval = setInterval(() => {
      if (lastFetch && Date.now() - lastFetch >= CACHE_TTL) {
        fetchPredictions();
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [autoFetch, enabled, fetchPredictions, lastFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchPredictions,
    getTopRecommendation,
    getPredictionForVault,
    isAIEnabled: enabled,
  };
}

/**
 * Hook to check if AI services are available
 */
export function useAIHealth() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'openai' | 'anthropic' | 'mock'>('mock');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/predictions/health`);
        if (response.ok) {
          const data = await response.json();
          setIsAvailable(true);
          setMode(data.ai?.mode || 'mock');
        }
      } catch {
        setIsAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return { isAvailable, loading, mode };
}
