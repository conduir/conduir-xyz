/**
 * LaaS (Liquidity as a Service) Module
 *
 * This module provides a lightweight entry point for external protocols
 * to perform swaps using Conduir's liquidity pools.
 *
 * Architecture:
 *   External Protocol → LaaS Helper → useSwap Hook → Constant AMM Contract
 *
 * Usage example:
 *   import { executeSwap, getSwapQuote } from '@/lib/laas';
 *
 *   const quote = await getSwapQuote({
 *     tokenIn: '0x...',
 *     tokenOut: '0x...',
 *     amountIn: '1.5',
 *   });
 *
 *   const txHash = await executeSwap({
 *     tokenIn: '0x...',
 *     tokenOut: '0x...',
 *     amountIn: '1.5',
 *     slippageTolerance: 0.5, // 0.5%
 *   });
 */

import { parseUnits, type Address } from 'viem';
import { getContractAddress } from '../web3/contracts/addresses';
import { CONTRACT_ABIS } from '../web3/contracts/abi';
import { useSwap } from '../web3/hooks/useSwap';

/**
 * LaaS swap parameters interface
 *
 * @property tokenIn - The address of the token to swap from
 * @property tokenOut - The address of the token to swap to
 * @property amountIn - The amount of input tokens (as a decimal string)
 * @property decimalsIn - Decimals of the input token (default: 18)
 * @property slippageTolerance - Slippage tolerance in percentage (default: 0.5)
 * @property recipient - The address to receive the output tokens (default: sender)
 */
export interface LaaSSwapParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: string;
  decimalsIn?: number;
  slippageTolerance?: number; // In percentage (e.g., 0.5 for 0.5%)
  recipient?: Address;
}

/**
 * LaaS swap quote interface
 *
 * @property amountIn - The input amount (as bigint)
 * @property amountOut - The expected output amount (as bigint)
 * @property amountOutMin - The minimum output amount with slippage (as bigint)
 * @property priceImpact - The price impact in percentage
 */
export interface LaaSSwapQuote {
  amountIn: bigint;
  amountOut: bigint;
  amountOutMin: bigint;
  priceImpact: number;
  route: {
    tokenIn: Address;
    tokenOut: Address;
  };
}

/**
 * Default configuration for LaaS
 */
const LaaS_CONFIG = {
  DEFAULT_SLIPPAGE: 0.5, // 0.5%
  DEFAULT_DECIMALS: 18,
  TOKEN_A: getContractAddress('tokenA'),
  TOKEN_B: getContractAddress('tokenB'),
  CONSTANT_AMM: getContractAddress('constantAMM'),
} as const;

/**
 * Validate if a token pair is supported by LaaS
 *
 * @param tokenIn - The input token address
 * @param tokenOut - The output token address
 * @returns true if the pair is supported
 */
export function isSupportedPair(tokenIn: Address, tokenOut: Address): boolean {
  const normalizedTokenIn = tokenIn.toLowerCase();
  const normalizedTokenOut = tokenOut.toLowerCase();
  const normalizedA = LaaS_CONFIG.TOKEN_A.toLowerCase();
  const normalizedB = LaaS_CONFIG.TOKEN_B.toLowerCase();

  return (
    (normalizedTokenIn === normalizedA && normalizedTokenOut === normalizedB) ||
    (normalizedTokenIn === normalizedB && normalizedTokenOut === normalizedA)
  );
}

/**
 * Convert slippage percentage to basis points
 *
 * @param slippage - Slippage in percentage (e.g., 0.5 for 0.5%)
 * @returns Slippage in basis points (e.g., 50 for 0.5%)
 */
function slippageToBps(slippage: number): number {
  return Math.floor(slippage * 100);
}

/**
 * Get a swap quote without executing the transaction
 *
 * This is a read-only operation that calculates the expected output
 * based on current pool reserves using the constant product formula:
 *   amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
 *
 * @param params - The swap parameters
 * @param reserves - Optional current reserves (for client-side calculation)
 * @returns The swap quote or null if unable to calculate
 */
export function getSwapQuote(
  params: LaaSSwapParams,
  reserves?: readonly [bigint, bigint]
): LaaSSwapQuote | null {
  const {
    tokenIn,
    tokenOut,
    amountIn: amountInStr,
    decimalsIn = LaaS_CONFIG.DEFAULT_DECIMALS,
    slippageTolerance = LaaS_CONFIG.DEFAULT_SLIPPAGE,
  } = params;

  // Validate token pair
  if (!isSupportedPair(tokenIn, tokenOut)) {
    throw new Error(`Unsupported token pair: ${tokenIn} -> ${tokenOut}`);
  }

  const amountIn = parseUnits(amountInStr, decimalsIn);
  const slippageBps = slippageToBps(slippageTolerance);

  // If reserves provided, calculate quote locally
  if (reserves) {
    const [reserveA, reserveB] = reserves;
    const isTokenA = tokenIn.toLowerCase() === LaaS_CONFIG.TOKEN_A.toLowerCase();

    const reserveIn = isTokenA ? reserveA : reserveB;
    const reserveOut = isTokenA ? reserveB : reserveA;

    // Validate reserves have liquidity
    if (reserveIn === 0n || reserveOut === 0n) {
      throw new Error('Insufficient liquidity in pool');
    }

    // Constant product formula
    const amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);

    // Apply slippage tolerance
    const slippageMultiplier = BigInt(10000 - slippageBps);
    const amountOutMin = (amountOut * slippageMultiplier) / 10000n;

    // Calculate price impact
    const priceImpact = Number(amountIn * 10000n / (reserveIn + amountIn)) / 100;

    return {
      amountIn,
      amountOut,
      amountOutMin,
      priceImpact,
      route: {
        tokenIn,
        tokenOut,
      },
    };
  }

  // Without reserves, we need to call the contract
  // This would typically be done via the hook
  return null;
}

/**
 * Calculate swap quote using the constant product formula
 *
 * This is a pure function that can be used server-side or client-side
 * without any React hooks or wallet connection.
 *
 * @param params - The swap parameters
 * @param reserveA - Reserve of Token A in the pool
 * @param reserveB - Reserve of Token B in the pool
 * @returns The swap quote
 */
export function calculateSwapQuote(
  params: LaaSSwapParams,
  reserveA: bigint,
  reserveB: bigint
): LaaSSwapQuote {
  const {
    tokenIn,
    tokenOut,
    amountIn: amountInStr,
    decimalsIn = LaaS_CONFIG.DEFAULT_DECIMALS,
    slippageTolerance = LaaS_CONFIG.DEFAULT_SLIPPAGE,
  } = params;

  if (!isSupportedPair(tokenIn, tokenOut)) {
    throw new Error(`Unsupported token pair: ${tokenIn} -> ${tokenOut}`);
  }

  const amountIn = parseUnits(amountInStr, decimalsIn);
  const slippageBps = slippageToBps(slippageTolerance);

  const isTokenA = tokenIn.toLowerCase() === LaaS_CONFIG.TOKEN_A.toLowerCase();
  const reserveIn = isTokenA ? reserveA : reserveB;
  const reserveOut = isTokenA ? reserveB : reserveA;

  if (reserveIn === 0n || reserveOut === 0n) {
    throw new Error('Insufficient liquidity in pool');
  }

  // Constant product formula: x * y = k
  // amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
  const amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);

  // Apply slippage
  const slippageMultiplier = BigInt(10000 - slippageBps);
  const amountOutMin = (amountOut * slippageMultiplier) / 10000n;

  // Price impact: how much the price moves due to this trade
  const priceImpact = Number(amountIn * 10000n / (reserveIn + amountIn)) / 100;

  return {
    amountIn,
    amountOut,
    amountOutMin,
    priceImpact,
    route: {
      tokenIn,
      tokenOut,
    },
  };
}

/**
 * LaaS Hook for React components
 *
 * Provides access to swap functionality for external protocols
 * building on top of Conduir.
 *
 * @example
 * ```tsx
 * function ExternalProtocolSwap() {
 *   const { getQuote, executeSwap, isPending, error } = useLaaS();
 *
 *   const handleSwap = async () => {
 *     const quote = getQuote({
 *       tokenIn: tokenAAddress,
 *       tokenOut: tokenBAddress,
 *       amountIn: '100',
 *     });
 *
 *     if (quote) {
 *       const txHash = await executeSwap({
 *         tokenIn: tokenAAddress,
 *         tokenOut: tokenBAddress,
 *         amountIn: '100',
 *       });
 *     }
 *   };
 * }
 * ```
 */
export function useLaaS() {
  const swapHook = useSwap();

  /**
   * Get a swap quote
   */
  const getQuote = (params: LaaSSwapParams): LaaSSwapQuote | null => {
    return swapHook.getSwapQuote({
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      amountIn: params.amountIn,
      decimalsIn: params.decimalsIn ?? 18,
      slippageTolerance: params.slippageTolerance
        ? slippageToBps(params.slippageTolerance)
        : 50,
    });
  };

  /**
   * Execute a swap transaction
   */
  const executeSwapWrapper = async (
    params: LaaSSwapParams
  ): Promise<`0x${string}`> => {
    return swapHook.executeSwap({
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      amountIn: params.amountIn,
      decimalsIn: params.decimalsIn ?? 18,
      slippageTolerance: params.slippageTolerance
        ? slippageToBps(params.slippageTolerance)
        : 50,
      recipient: params.recipient,
    });
  };

  return {
    getQuote,
    executeSwap: executeSwapWrapper,
    isSupportedPair,
    isPending: swapHook.isPending,
    error: swapHook.error,
    reserves: swapHook.reserves,
  };
}

/**
 * Re-export the swap hook for direct use if needed
 */
export { useSwap };

/**
 * Contract addresses for external protocols
 */
export const LaaS_CONTRACTS = {
  CONSTANT_AMM: LaaS_CONFIG.CONSTANT_AMM,
  TOKEN_A: LaaS_CONFIG.TOKEN_A,
  TOKEN_B: LaaS_CONFIG.TOKEN_B,
  ROUTER: getContractAddress('router'),
} as const;

/**
 * Contract ABIs for external protocols
 */
export const LaaS_ABIS = {
  constantAMM: CONTRACT_ABIS.constantAMM,
  erc20: CONTRACT_ABIS.erc20,
} as const;
