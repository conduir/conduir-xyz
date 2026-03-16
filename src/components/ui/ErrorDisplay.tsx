import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
import { IconButton, Button } from './FormInputs';

/**
 * Error types
 */
export type ErrorType =
  | 'network'
  | 'transaction'
  | 'approval'
  | 'balance'
  | 'allowance'
  | 'chain'
  | 'unknown';

/**
 * Error display props
 */
export interface ErrorDisplayProps {
  error: Error | string | null;
  type?: ErrorType;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Get error title and message based on type
 */
function getErrorDetails(
  error: Error | string,
  type: ErrorType
): { title: string; message: string; suggestRetry: boolean } {
  const errorMessage = typeof error === 'string' ? error : error.message;

  // Common error patterns
  if (errorMessage.toLowerCase().includes('user rejected')) {
    return {
      title: 'Transaction Rejected',
      message: 'You rejected the transaction in your wallet.',
      suggestRetry: false,
    };
  }

  if (errorMessage.toLowerCase().includes('insufficient funds')) {
    return {
      title: 'Insufficient Balance',
      message: 'You do not have enough balance to complete this transaction.',
      suggestRetry: false,
    };
  }

  if (errorMessage.toLowerCase().includes('insufficient allowance')) {
    return {
      title: 'Approval Required',
      message: 'Please approve the token spending first.',
      suggestRetry: true,
    };
  }

  if (errorMessage.toLowerCase().includes('network')) {
    return {
      title: 'Network Error',
      message: 'Unable to connect to the network. Please check your connection.',
      suggestRetry: true,
    };
  }

  if (errorMessage.toLowerCase().includes('chain') || errorMessage.toLowerCase().includes('wrong network')) {
    return {
      title: 'Wrong Network',
      message: 'Please switch to Polkadot Asset Hub testnet.',
      suggestRetry: false,
    };
  }

  // Type-specific defaults
  switch (type) {
    case 'network':
      return {
        title: 'Network Error',
        message: errorMessage || 'Unable to connect to the network.',
        suggestRetry: true,
      };
    case 'transaction':
      return {
        title: 'Transaction Failed',
        message: errorMessage || 'The transaction failed to execute.',
        suggestRetry: true,
      };
    case 'approval':
      return {
        title: 'Approval Failed',
        message: errorMessage || 'Failed to approve token spending.',
        suggestRetry: true,
      };
    case 'balance':
      return {
        title: 'Insufficient Balance',
        message: errorMessage || 'You do not have enough balance.',
        suggestRetry: false,
      };
    case 'allowance':
      return {
        title: 'Insufficient Allowance',
        message: errorMessage || 'Please increase your token allowance.',
        suggestRetry: true,
      };
    case 'chain':
      return {
        title: 'Wrong Network',
        message: 'Please switch to the correct network.',
        suggestRetry: false,
      };
    default:
      return {
        title: 'Error',
        message: errorMessage || 'An unknown error occurred.',
        suggestRetry: false,
      };
  }
}

/**
 * Error Display Component
 *
 * Displays user-friendly error messages with retry option
 */
export function ErrorDisplay({
  error,
  type = 'unknown',
  onRetry,
  onDismiss,
  className = '',
}: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  const details = getErrorDetails(error, type);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-red-500/10 border border-red-500/20 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-red-500">
            {details.title}
          </div>
          <div className="text-xs text-red-400/80 mt-1">
            {details.message}
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2">
            {details.suggestRetry && onRetry && (
              <Button
                variant="danger"
                onClick={onRetry}
                size="sm"
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </Button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#E6007A]/50 rounded px-2 py-1"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>

        {onDismiss && (
          <IconButton
            onClick={onDismiss}
            variant="ghost"
            size="sm"
          >
            <X className="w-4 h-4" />
          </IconButton>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Inline error display (smaller version)
 */
export function InlineError({
  error,
  className = '',
}: {
  error: Error | string | null;
  className?: string;
}) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 text-xs text-red-400 ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="truncate">{errorMessage}</span>
    </motion.div>
  );
}

/**
 * Error alert banner (for page-level errors)
 */
export function ErrorBanner({
  error,
  onRetry,
  className = '',
}: {
  error: Error | string | null;
  onRetry?: () => void;
  className?: string;
}) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`bg-red-500/10 border-l-4 border-red-500 p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <div className="text-sm font-medium text-red-500">Error</div>
            <div className="text-xs text-red-400/80 mt-0.5">{errorMessage}</div>
          </div>
        </div>
        {onRetry && (
          <IconButton
            onClick={onRetry}
            variant="ghost"
            size="md"
            className="hover:bg-red-500/20 text-red-500"
            title="Retry"
          >
            <RefreshCw className="w-4 h-4" />
          </IconButton>
        )}
      </div>
    </motion.div>
  );
}

export default ErrorDisplay;
