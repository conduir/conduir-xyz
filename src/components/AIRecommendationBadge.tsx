import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp } from 'lucide-react';
import type { YieldPrediction } from '../types/ai';

interface AIRecommendationBadgeProps {
  prediction?: YieldPrediction;
  variant?: 'default' | 'compact' | 'minimal';
  showReasoning?: boolean;
  className?: string;
}

export function AIRecommendationBadge({
  prediction,
  variant = 'default',
  showReasoning = false,
  className = '',
}: AIRecommendationBadgeProps) {
  if (!prediction) return null;

  const getConfidenceColor = () => {
    switch (prediction.confidence) {
      case 'High':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Low':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    }
  };

  const getAPYChangeColor = () => {
    const change = prediction.predictions.days30 - prediction.vault.apy;
    if (change > 2) return 'text-emerald-400';
    if (change < -2) return 'text-red-400';
    return 'text-slate-400';
  };

  const apyChange = prediction.predictions.days30 - prediction.vault.apy;

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border ${getConfidenceColor()}`}>
        <Sparkles className="w-3 h-3" />
        <span className="text-xs font-medium">AI Pick</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getConfidenceColor()} ${className}`}
      >
        <Sparkles className="w-4 h-4" />
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider">AI Recommended</span>
          <span className="text-xs">
            <span className={getAPYChangeColor()}>
              {apyChange >= 0 ? '+' : ''}{apyChange.toFixed(1)}%
            </span>
            <span className="text-slate-500"> predicted APY change</span>
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${getConfidenceColor()} relative overflow-hidden`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 animate-pulse" />

      <div className="relative flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white">AI Recommended Vault</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold ${getConfidenceColor()}`}>
              {prediction.confidence} Confidence
            </span>
          </div>

          <p className="text-sm text-slate-400 mb-3">
            {prediction.vault.protocol} ({prediction.vault.asset}) - Based on AI analysis of market conditions
          </p>

          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Current APY</div>
              <div className="font-bold text-white">{prediction.vault.apy}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Predicted (30d)</div>
              <div className={`font-bold ${getAPYChangeColor()}`}>
                {prediction.predictions.days30}%
                {apyChange >= 0 ? '+' : ''}
                {apyChange.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Risk Level</div>
              <div className={`font-bold ${
                prediction.vault.riskLevel === 'Low' ? 'text-emerald-400' :
                prediction.vault.riskLevel === 'Medium' ? 'text-orange-400' :
                'text-red-400'
              }`}>
                {prediction.vault.riskLevel}
              </div>
            </div>
          </div>

          {showReasoning && prediction.reasoning && (
            <div className="bg-black/20 rounded-lg p-3 text-sm text-slate-300">
              <span className="font-medium">Why this vault:</span> {prediction.reasoning}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
