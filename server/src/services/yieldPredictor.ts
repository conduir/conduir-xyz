import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { Vault, MarketData, YieldPrediction, PredictionResponse, AIProvider } from '../types/yield.js';
import { getMockPriceData } from './coingecko.js';

// Initialize AI clients
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

// Try to initialize AI clients based on environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
}

if (ANTHROPIC_API_KEY) {
  anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
}

/**
 * Determine which AI provider to use
 */
function getAIProvider(): AIProvider {
  if (anthropicClient) {
    return { name: 'anthropic', model: 'claude-3-5-sonnet-20241022' };
  }
  if (openaiClient) {
    return { name: 'openai', model: 'gpt-4o' };
  }
  return { name: 'openai', model: 'gpt-4o' }; // Default, will fall back to mock
}

/**
 * Generate AI prediction using OpenAI
 */
async function generateWithOpenAI(
  vaults: Vault[],
  marketDataMap: Map<string, MarketData>
): Promise<YieldPrediction[]> {
  if (!openaiClient) {
    return generateMockPredictions(vaults, marketDataMap);
  }

  const prompt = buildPredictionPrompt(vaults, marketDataMap);

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert DeFi yield prediction AI for the Conduir protocol. Analyze vault data and market conditions to predict future APYs.

Return ONLY valid JSON in this exact format:
{
  "predictions": [
    {
      "vaultId": "string",
      "predictions": { "days7": number, "days14": number, "days30": number },
      "confidence": "High" | "Medium" | "Low",
      "reasoning": "string (2-3 sentences)",
      "factors": [
        { "factor": "string", "impact": "positive" | "negative" | "neutral", "weight": number (0-1) }
      ]
    }
  ],
  "marketSummary": {
    "overallSentiment": "bullish" | "bearish" | "neutral",
    "keyInsights": ["string", "string", "string"]
  }
}`
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return generateMockPredictions(vaults, marketDataMap);
    }

    const parsed = JSON.parse(content);
    return parsed.predictions.map((p: any) => ({
      ...p,
      vault: vaults.find((v: Vault) => v.id === p.vaultId)!,
      generatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateMockPredictions(vaults, marketDataMap);
  }
}

/**
 * Generate AI prediction using Anthropic Claude
 */
async function generateWithAnthropic(
  vaults: Vault[],
  marketDataMap: Map<string, MarketData>
): Promise<YieldPrediction[]> {
  if (!anthropicClient) {
    return generateMockPredictions(vaults, marketDataMap);
  }

  const prompt = buildPredictionPrompt(vaults, marketDataMap);

  try {
    const response = await anthropicClient.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: `You are an expert DeFi yield prediction AI for the Conduir protocol. Analyze vault data and market conditions to predict future APYs.

Return ONLY valid JSON in this exact format:
{
  "predictions": [
    {
      "vaultId": "string",
      "predictions": { "days7": number, "days14": number, "days30": number },
      "confidence": "High" | "Medium" | "Low",
      "reasoning": "string (2-3 sentences)",
      "factors": [
        { "factor": "string", "impact": "positive" | "negative" | "neutral", "weight": number (0-1) }
      ]
    }
  ],
  "marketSummary": {
    "overallSentiment": "bullish" | "bearish" | "neutral",
    "keyInsights": ["string", "string", "string"]
  }
}`,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      return generateMockPredictions(vaults, marketDataMap);
    }

    const parsed = JSON.parse(content.text);
    return parsed.predictions.map((p: any) => ({
      ...p,
      vault: vaults.find((v: Vault) => v.id === p.vaultId)!,
      generatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Anthropic API error:', error);
    return generateMockPredictions(vaults, marketDataMap);
  }
}

/**
 * Build the prediction prompt from vault and market data
 */
function buildPredictionPrompt(vaults: Vault[], marketDataMap: Map<string, MarketData>): string {
  let prompt = `Predict the expected APY for the following DeFi vaults over the next 7, 14, and 30 days.\n\n`;

  prompt += `CURRENT VAULT DATA:\n`;
  vaults.forEach((vault, i) => {
    const marketData = marketDataMap.get(vault.asset);
    prompt += `${i + 1}. ${vault.protocol} (${vault.asset})\n`;
    prompt += `   - Current APY: ${vault.apy}%\n`;
    prompt += `   - Capacity: $${(vault.capacity / 1000000).toFixed(1)}M\n`;
    prompt += `   - Utilized: $${(vault.utilized / 1000000).toFixed(1)}M (${((vault.utilized / vault.capacity) * 100).toFixed(0)}%)\n`;
    prompt += `   - Risk Level: ${vault.riskLevel}\n`;

    if (marketData) {
      prompt += `   - Asset Price: $${marketData.currentPrice.toFixed(2)}\n`;
      prompt += `   - 24h Change: ${marketData.change24h.toFixed(2)}%\n`;
      prompt += `   - 7d Volatility: ${marketData.volatility7d.toFixed(1)}%\n`;
    }
    prompt += `\n`;
  });

  prompt += `ANALYSIS GUIDELINES:\n`;
  prompt += `- Higher utilization often correlates with higher APYs due to increased fee generation\n`;
  prompt += `- Lower volatility suggests more stable returns\n`;
  prompt += `- Positive price momentum may increase trading activity and fees\n`;
  prompt += `- Consider the risk level when predicting confidence\n\n`;

  prompt += `Provide predictions for each vault with confidence levels and key factors influencing your forecast.`;

  return prompt;
}

/**
 * Generate mock predictions (fallback when AI APIs are unavailable)
 */
function generateMockPredictions(
  vaults: Vault[],
  marketDataMap: Map<string, MarketData>
): YieldPrediction[] {
  const predictions: YieldPrediction[] = [];

  for (const vault of vaults) {
    const marketData = marketDataMap.get(vault.asset);
    const utilizationRate = vault.utilized / vault.capacity;
    const baseAPY = vault.apy;

    // Calculate predictions based on utilization and market conditions
    const utilizationBonus = utilizationRate > 0.8 ? 1.5 : utilizationRate > 0.5 ? 1.2 : 1;
    const volatilityAdjustment = marketData ? (100 - marketData.volatility7d) / 100 : 1;
    const trendAdjustment = marketData && marketData.change24h > 0 ? 1.1 : marketData && marketData.change24h < 0 ? 0.95 : 1;

    const day7Prediction = baseAPY * utilizationBonus * volatilityAdjustment * trendAdjustment;
    const day14Prediction = day7Prediction * (0.95 + Math.random() * 0.1);
    const day30Prediction = day14Prediction * (0.9 + Math.random() * 0.2);

    // Determine confidence based on data quality
    let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
    if (marketData && marketData.priceHistory.length >= 30 && marketData.volatility7d < 30) {
      confidence = 'High';
    } else if (!marketData || marketData.volatility7d > 50) {
      confidence = 'Low';
    }

    // Generate reasoning
    const reasons: string[] = [];
    const factors: YieldPrediction['factors'] = [];

    if (utilizationRate > 0.8) {
      reasons.push('high utilization driving fee generation');
      factors.push({ factor: 'High utilization', impact: 'positive', weight: 0.3 });
    } else if (utilizationRate < 0.5) {
      reasons.push('moderate utilization limiting fee potential');
      factors.push({ factor: 'Moderate utilization', impact: 'neutral', weight: 0.2 });
    }

    if (marketData) {
      if (marketData.change24h > 2) {
        reasons.push('positive price momentum increasing trading activity');
        factors.push({ factor: 'Positive price momentum', impact: 'positive', weight: 0.25 });
      } else if (marketData.change24h < -2) {
        reasons.push('negative price pressure may reduce yields');
        factors.push({ factor: 'Negative price pressure', impact: 'negative', weight: 0.25 });
      }

      if (marketData.volatility7d < 20) {
        factors.push({ factor: 'Low market volatility', impact: 'positive', weight: 0.15 });
      } else if (marketData.volatility7d > 40) {
        factors.push({ factor: 'High market volatility', impact: 'negative', weight: 0.2 });
      }
    }

    factors.push({ factor: vault.riskLevel + ' risk profile', impact: 'neutral', weight: 0.1 });

    predictions.push({
      vaultId: vault.id,
      vault,
      predictions: {
        days7: Math.max(0, Math.round(day7Prediction * 10) / 10),
        days14: Math.max(0, Math.round(day14Prediction * 10) / 10),
        days30: Math.max(0, Math.round(day30Prediction * 10) / 10),
      },
      confidence,
      reasoning: `Based on ${reasons.join(', ')}. Current ${baseAPY}% APY expected to ${day7Prediction > baseAPY ? 'increase' : 'decrease'} due to market conditions.`,
      factors,
      generatedAt: new Date().toISOString(),
    });
  }

  return predictions;
}

/**
 * Generate yield predictions for vaults
 */
export async function generateYieldPredictions(
  vaults: Vault[],
  marketDataMap?: Map<string, MarketData>
): Promise<YieldPrediction[]> {
  // Fetch market data if not provided
  if (!marketDataMap) {
    const { fetchMultipleAssets } = await import('./coingecko.js');
    const uniqueAssets = [...new Set(vaults.map(v => v.asset))];
    const marketDataArray = await fetchMultipleAssets(uniqueAssets);
    marketDataMap = new Map(marketDataArray.map(md => [md.asset, md]));
  }

  const provider = getAIProvider();

  let predictions: YieldPrediction[];

  if (provider.name === 'anthropic') {
    predictions = await generateWithAnthropic(vaults, marketDataMap);
  } else {
    predictions = await generateWithOpenAI(vaults, marketDataMap);
  }

  return predictions;
}

/**
 * Generate full prediction response with market summary
 */
export async function generatePredictionResponse(
  vaults: Vault[],
  timeHorizon: string = 'all'
): Promise<PredictionResponse> {
  const { fetchMultipleAssets } = await import('./coingecko.js');

  // Fetch market data
  const uniqueAssets = [...new Set(vaults.map(v => v.asset))];
  const marketDataArray = await fetchMultipleAssets(uniqueAssets);
  const marketDataMap = new Map(marketDataArray.map(md => [md.asset, md]));

  // Generate predictions
  const predictions = await generateYieldPredictions(vaults, marketDataMap);

  // Find top recommendation
  const topRecommendation = predictions
    .filter(p => p.confidence === 'High' || p.confidence === 'Medium')
    .sort((a, b) => b.predictions.days30 - a.predictions.days30)[0];

  // Generate market summary
  const avgChange24h = marketDataArray.reduce((sum, md) => sum + md.change24h, 0) / marketDataArray.length;
  const overallSentiment = avgChange24h > 1 ? 'bullish' : avgChange24h < -1 ? 'bearish' : 'neutral';

  const keyInsights: string[] = [];
  if (overallSentiment === 'bullish') {
    keyInsights.push('Market showing positive momentum across most assets');
  } else if (overallSentiment === 'bearish') {
    keyInsights.push('Market experiencing downward pressure, consider cautious positioning');
  }

  const highUtilizationVaults = vaults.filter(v => v.utilized / v.capacity > 0.8);
  if (highUtilizationVaults.length > 0) {
    keyInsights.push(`${highUtilizationVaults.length} vault(s) operating at high utilization - favorable for fee generation`);
  }

  const topVault = predictions.reduce((max, p) =>
    p.predictions.days30 > max.predictions.days30 ? p : max
  );
  keyInsights.push(`${topVault.vault.protocol} (${topVault.vault.asset}) shows strongest 30-day outlook at ${topVault.predictions.days30}% predicted APY`);

  return {
    predictions,
    topRecommendation,
    marketSummary: {
      overallSentiment,
      keyInsights,
    },
    cached: false,
  };
}

/**
 * Check if AI services are available
 */
export function isAIAvailable(): { openai: boolean; anthropic: boolean } {
  return {
    openai: !!openaiClient,
    anthropic: !!anthropicClient,
  };
}
