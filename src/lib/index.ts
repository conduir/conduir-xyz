/**
 * Conduir Library Module
 *
 * Exports LaaS (Liquidity as a Service) helpers for external protocols.
 */

// LaaS exports
export {
  useLaaS,
  useSwap,
  getSwapQuote,
  calculateSwapQuote,
  isSupportedPair,
  LaaS_CONTRACTS,
  LaaS_ABIS,
} from './laas';

// Re-export types
export type { LaaSSwapParams, LaaSSwapQuote } from './laas';
