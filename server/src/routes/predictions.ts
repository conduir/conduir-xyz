import express from 'express';
import type { PredictionRequest, PredictionResponse, Vault } from '../types/yield.js';
import { generatePredictionResponse } from '../services/yieldPredictor.js';
import { predictionCache } from '../services/predictionCache.js';

const router = express.Router();

/**
 * GET /api/predictions/yield
 * Generate yield predictions for given vaults
 */
router.get('/yield', async (req, res) => {
  try {
    // Parse query parameters or use default vaults
    const vaultsParam = req.query.vaults as string;
    const timeHorizon = (req.query.horizon as string) || 'all';

    let vaults: Vault[];

    if (vaultsParam) {
      try {
        vaults = JSON.parse(vaultsParam);
      } catch {
        return res.status(400).json({ error: 'Invalid vaults JSON format' });
      }
    } else {
      // Default mock vaults for testing
      vaults = [
        { id: 'hydra-dot-usdc', protocol: 'HydraDX', asset: 'DOT', apy: 14.2, capacity: 15000000, utilized: 12400000, riskLevel: 'Low' },
        { id: 'arthswap-usdt', protocol: 'ArthSwap', asset: 'USDT', apy: 18.5, capacity: 5000000, utilized: 4200000, riskLevel: 'Medium' },
        { id: 'stellaswap-eth', protocol: 'StellaSwap', asset: 'ETH', apy: 16.8, capacity: 10000000, utilized: 8100000, riskLevel: 'Low' },
      ];
    }

    // Check cache
    const vaultIds = vaults.map(v => v.id);
    const cached = predictionCache.get(vaultIds, timeHorizon);

    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Generate predictions
    const response: PredictionResponse = await generatePredictionResponse(vaults, timeHorizon);

    // Cache the response
    predictionCache.set(vaultIds, response, timeHorizon);

    res.json(response);
  } catch (error) {
    console.error('Prediction generation error:', error);
    res.status(500).json({
      error: 'Failed to generate predictions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/predictions/yield
 * Generate yield predictions with custom vault data
 */
router.post('/yield', async (req, res) => {
  try {
    const { vaults, timeHorizon = 'all' }: PredictionRequest = req.body;

    if (!vaults || !Array.isArray(vaults) || vaults.length === 0) {
      return res.status(400).json({ error: 'Invalid vaults data' });
    }

    // Validate vault structure
    const validVaults = vaults.filter((v: any) =>
      v.id && v.protocol && v.asset && typeof v.apy === 'number'
    );

    if (validVaults.length === 0) {
      return res.status(400).json({ error: 'No valid vaults provided' });
    }

    // Check cache
    const vaultIds = validVaults.map((v: Vault) => v.id);
    const cached = predictionCache.get(vaultIds, timeHorizon);

    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Generate predictions
    const response: PredictionResponse = await generatePredictionResponse(validVaults, timeHorizon);

    // Cache the response
    predictionCache.set(vaultIds, response, timeHorizon);

    res.json(response);
  } catch (error) {
    console.error('Prediction generation error:', error);
    res.status(500).json({
      error: 'Failed to generate predictions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/predictions/health
 * Check if AI services are available
 */
router.get('/health', (req, res) => {
  const { isAIAvailable } = require('../services/yieldPredictor.js');
  const aiStatus = isAIAvailable();

  res.json({
    status: 'ok',
    ai: {
      openai: aiStatus.openai ? 'connected' : 'not_configured',
      anthropic: aiStatus.anthropic ? 'connected' : 'not_configured',
      mode: aiStatus.anthropic ? 'anthropic' : aiStatus.openai ? 'openai' : 'mock',
    },
    cache: predictionCache.getStats(),
  });
});

/**
 * DELETE /api/predictions/cache
 * Clear prediction cache
 */
router.delete('/cache', (req, res) => {
  const vaults = req.query.vaults as string;

  if (vaults) {
    try {
      const vaultIds = JSON.parse(vaults);
      predictionCache.invalidate(vaultIds);
      res.json({ message: 'Cache invalidated for specified vaults' });
    } catch {
      res.status(400).json({ error: 'Invalid vaults JSON format' });
    }
  } else {
    predictionCache.clear();
    res.json({ message: 'Entire cache cleared' });
  }
});

export default router;
