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

export interface YieldPredictions {
  days7: number;
  days14: number;
  days30: number;
}

export interface PredictionFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
}

export interface YieldPrediction {
  vaultId: string;
  vault: Vault;
  predictions: YieldPredictions;
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
  factors: PredictionFactor[];
  generatedAt: string;
}

export interface MarketSummary {
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  keyInsights: string[];
}

export interface PredictionResponse {
  predictions: YieldPrediction[];
  topRecommendation?: YieldPrediction;
  marketSummary: MarketSummary;
  cached: boolean;
}

export interface AIPredictionState {
  data: PredictionResponse | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

export interface ChartDataPoint {
  label: string;
  current?: number;
  predicted?: number;
  [key: string]: any;
}
