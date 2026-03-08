import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Copy, ExternalLink, ArrowRight } from 'lucide-react';

interface SuccessViewProps {
  title: string;
  message: string;
  txHash?: string;
  details?: Array<{ label: string; value: string | React.ReactNode }>;
  onViewDetails?: () => void;
  onNewAction?: () => void;
  actionLabel?: string;
  actionHref?: string;
}

export function SuccessView({
  title,
  message,
  txHash,
  details,
  onViewDetails,
  onNewAction,
  actionLabel = 'View in Explorer',
  actionHref,
}: SuccessViewProps) {
  const copyTxHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </motion.div>

      {/* Title & Message */}
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">{message}</p>

      {/* Transaction Hash */}
      {txHash && (
        <div className="bg-[#0A0B10] border border-white/10 rounded-xl p-4 mb-6 max-w-md mx-auto">
          <div className="text-xs text-slate-500 mb-2">Transaction Hash</div>
          <div className="flex items-center justify-between gap-2">
            <code className="text-sm text-slate-300 truncate flex-1 text-left">
              {txHash}
            </code>
            <button
              onClick={copyTxHash}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4 text-slate-400" />
            </button>
            {actionHref && (
              <a
                href={actionHref}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="View in explorer"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Details */}
      {details && (
        <div className="bg-[#0A0B10] border border-white/10 rounded-xl p-6 mb-8 max-w-md mx-auto text-left">
          <h3 className="text-sm font-semibold text-slate-400 mb-4">Transaction Details</h3>
          <div className="space-y-3">
            {details.map((detail, i) => (
              <div key={i} className="flex justify-between items-start">
                <span className="text-slate-500 text-sm">{detail.label}</span>
                <span className="text-white font-medium text-sm text-right">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
          >
            View Details
          </button>
        )}
        {onNewAction && (
          <button
            onClick={onNewAction}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E6007A] hover:bg-[#C20066] text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            {actionLabel === 'View in Explorer' ? 'New Transaction' : actionLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {actionHref && !onNewAction && (
          <a
            href={actionHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E6007A] hover:bg-[#C20066] text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            {actionLabel}
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
