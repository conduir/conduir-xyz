import type { MarketData, PriceDataPoint } from '../types/yield.js';

// Asset ID mapping for Coingecko API
const ASSET_IDS: Record<string, string> = {
  DOT: 'polkadot',
  USDT: 'tether',
  USDC: 'usd-coin',
  ETH: 'ethereum',
  ASTR: 'astar',
  GLMR: 'moonbeam',
};

// In-memory cache for price data
const priceCache = new Map<string, { data: MarketData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Calculate volatility from price history
 */
function calculateVolatility(priceHistory: PriceDataPoint[]): number {
  if (priceHistory.length < 2) return 0;

  const returns: number[] = [];
  for (let i = 1; i < priceHistory.length; i++) {
    const returnRate = (priceHistory[i].price - priceHistory[i - 1].price) / priceHistory[i - 1].price;
    returns.push(returnRate);
  }

  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;

  // Return annualized volatility as a percentage
  return Math.sqrt(variance) * Math.sqrt(365) * 100;
}

/**
 * Fetch price data from Coingecko API
 */
export async function fetchPriceData(asset: string): Promise<MarketData> {
  const assetId = ASSET_IDS[asset];
  if (!assetId) {
    throw new Error(`Unsupported asset: ${asset}`);
  }

  // Check cache
  const cached = priceCache.get(asset);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Fetch from Coingecko API
  const [priceResponse, historyResponse, marketResponse] = await Promise.all([
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${assetId}&vs_currencies=usd&include_24hr_change=true`),
    fetch(`https://api.coingecko.com/api/v3/coins/${assetId}/market_chart?vs_currency=usd&days=30&interval=daily`),
    fetch(`https://api.coingecko.com/api/v3/coins/${assetId}?localization=false&tickers=false&community_data=false&developer_data=false`)
  ].map(p => p.catch(() => null)));

  if (!priceResponse?.ok) {
    throw new Error(`Failed to fetch price data for ${asset}`);
  }

  const priceData = await priceResponse.json() as Record<string, { usd: number; usd_24h_change: number }>;
  const currentPrice = priceData[assetId]?.usd || 0;
  const change24h = priceData[assetId]?.usd_24h_change || 0;

  // Parse price history
  const priceHistory: PriceDataPoint[] = [];
  if (historyResponse?.ok) {
    const historyData = await historyResponse.json() as { prices: [number, number][] };
    priceHistory.push(
      ...historyData.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price,
      }))
    );
  }

  // Parse market cap
  let marketCap: number | undefined;
  if (marketResponse?.ok) {
    const marketData = await marketResponse.json() as { market_data?: { market_cap?: { usd?: number } } };
    marketCap = marketData.market_data?.market_cap?.usd;
  }

  const result: MarketData = {
    asset,
    currentPrice,
    priceHistory,
    change24h,
    volatility7d: calculateVolatility(priceHistory.slice(-7)),
    marketCap,
  };

  // Cache the result
  priceCache.set(asset, { data: result, timestamp: Date.now() });

  return result;
}

/**
 * Fetch multiple assets at once
 */
export async function fetchMultipleAssets(assets: string[]): Promise<MarketData[]> {
  const results = await Promise.allSettled(
    assets.map(asset => fetchPriceData(asset))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    // Return mock data on failure
    return {
      asset: assets[index],
      currentPrice: 0,
      priceHistory: [],
      change24h: 0,
      volatility7d: 0,
    };
  });
}

/**
 * Get mock price data for fallback/testing
 */
export function getMockPriceData(asset: string): MarketData {
  const basePrice: Record<string, number> = {
    DOT: 7.5,
    USDT: 1,
    USDC: 1,
    ETH: 3500,
    ASTR: 0.15,
    GLMR: 0.8,
  };

  const price = basePrice[asset] || 1;
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const priceHistory: PriceDataPoint[] = [];
  for (let i = 30; i >= 0; i--) {
    const randomVariation = 1 + (Math.random() - 0.5) * 0.1; // ±5% variation
    priceHistory.push({
      timestamp: now - i * day,
      price: price * randomVariation,
    });
  }

  return {
    asset,
    currentPrice: price,
    priceHistory,
    change24h: (Math.random() - 0.5) * 10,
    volatility7d: 15 + Math.random() * 20,
  };
}

/**
 * Clear the price cache
 */
export function clearPriceCache(): void {
  priceCache.clear();
}
