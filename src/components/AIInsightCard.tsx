import React from 'react';
import { motion } from 'motion/react';
import { Brain, TrendingUp, TrendingDown, Minus, Info, ChevronDown, ChevronUp } from 'lucide-react';
import type { MarketSummary, PredictionFactor, YieldPrediction } from '../types/ai';
import { useState } from 'react';

interface AIInsightCardProps {
  marketSummary?: MarketSummary;
  topRecommendation?: YieldPrediction;
  predictions?: YieldPrediction[];
  compact?: boolean;
}

function FactorBadge({ factor }: { factor: PredictionFactor }) {
  const getImpactIcon = () => {
    switch (factor.impact) {
      case 'positive':
        return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case 'negative':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const getImpactColor = () => {
    switch (factor.impact) {
      case 'positive':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'negative':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg border ${getImpactColor()}`}>
      {getImpactIcon()}
      <span className="text-xs">{factor.factor}</span>
      <span className="text-xs text-slate-500">({Math.round(factor.weight * 100)}%)</span>
    </div>
  );
}

export function AIInsightCard({
  marketSummary,
  topRecommendation,
  predictions = [],
  compact = false,
}: AIInsightCardProps) {
  const [expanded, setExpanded] = useState(!compact);

  if (!marketSummary && !topRecommendation) {
    return null;
  }

  const getSentimentColor = () => {
    switch (marketSummary?.overallSentiment) {
      case 'bullish':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'bearish':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  const getSentimentIcon = () => {
    switch (marketSummary?.overallSentiment) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#13141C] border border-white/10 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white">AI Insights</h3>
            <p className="text-xs text-slate-500">Yield prediction analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {marketSummary && (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 ${getSentimentColor()}`}>
              {getSentimentIcon()}
              {marketSummary.overallSentiment}
            </span>
          )}
          {expanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/10 p-4 space-y-4"
        >
          {/* Key Insights */}
          {marketSummary?.keyInsights && marketSummary.keyInsights.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Key Insights
              </h4>
              <ul className="space-y-2">
                {marketSummary.keyInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top Recommendation */}
          {topRecommendation && (
            <div className="bg-[#0A0B10] rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Top Pick</h4>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">
                    {topRecommendation.vault.protocol} ({topRecommendation.vault.asset})
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {topRecommendation.vault.riskLevel} Risk • {topRecommendation.confidence} Confidence
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#E6007A]">
                    {topRecommendation.predictions.days30}%
                  </div>
                  <div className="text-xs text-slate-500">Predicted 30d APY</div>
                </div>
              </div>

              {/* Factors */}
              {topRecommendation.factors && topRecommendation.factors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {topRecommendation.factors
                      .sort((a, b) => b.weight - a.weight)
                      .slice(0, 4)
                      .map((factor, i) => (
                        <FactorBadge key={i} factor={factor} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reasoning */}
          {topRecommendation?.reasoning && (
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
              <p className="text-sm text-slate-300 italic">&ldquo;{topRecommendation.reasoning}&rdquo;</p>
            </div>
          )}

          {/* All Predictions Summary */}
          {predictions.length > 1 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">All Vault Predictions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {predictions.map((prediction) => {
                  const change = prediction.predictions.days30 - prediction.vault.apy;
                  return (
                    <div
                      key={prediction.vaultId}
                      className="bg-[#0A0B10] rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-sm">{prediction.vault.protocol}</div>
                        <div className="text-xs text-slate-500">{prediction.vault.asset}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{prediction.predictions.days30}%</div>
                        <div className={`text-xs ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
