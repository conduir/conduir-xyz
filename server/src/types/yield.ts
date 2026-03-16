export interface Vault {
  id: string;
  protocol: string;
  asset: string;
  apy: number;
  capacity: number;
  utilized: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface PriceDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface MarketData {
  asset: string;
  currentPrice: number;
  priceHistory: PriceDataPoint[];
  change24h: number;
  volatility7d: number;
  marketCap?: number;
}

export interface YieldPrediction {
  vaultId: string;
  vault: Vault;
  predictions: {
    days7: number;
    days14: number;
    days30: number;
  };
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
  factors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
  }[];
  generatedAt: string;
}

export interface PredictionRequest {
  vaults: Vault[];
  timeHorizon?: '7d' | '14d' | '30d' | 'all';
}

export interface PredictionResponse {
  predictions: YieldPrediction[];
  topRecommendation?: YieldPrediction;
  marketSummary: {
    overallSentiment: 'bullish' | 'bearish' | 'neutral';
    keyInsights: string[];
  };
  cached: boolean;
}

export interface AIProvider {
  name: 'openai' | 'anthropic';
  model: string;
}

export interface PredictionCacheEntry {
  key: string;
  data: PredictionResponse;
  timestamp: number;
  ttl: number;
}
