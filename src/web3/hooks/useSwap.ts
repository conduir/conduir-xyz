import { useCallback, useMemo } from 'react';
import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ABIS } from '../contracts/abi';
import { getContractAddress } from '../contracts/addresses';
import type { Address } from 'viem';

/**
 * Swap quote interface
 */
export interface SwapQuote {
  amountIn: bigint;
  amountOut: bigint;
  amountOutMin: bigint; // With slippage applied
  priceImpact: number; // Percentage
  route: {
    tokenIn: Address;
    tokenOut: Address;
  };
}

/**
 * Swap parameters interface
 */
export interface SwapParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: string;
  decimalsIn: number;
  slippageTolerance?: number; // In basis points (e.g., 50 = 0.5%)
  recipient?: Address;
}

/**
 * Hook for swap operations using Constant AMM
 *
 * Uses the constant product formula: amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
 */
export function useSwap() {
  const constantAMMAddress = getContractAddress('constantAMM');
  const tokenAAddress = getContractAddress('tokenA');
  const tokenBAddress = getContractAddress('tokenB');

  const { writeContractAsync, isPending, error } = useWriteContract();

  /**
   * Get current reserves from the AMM
   */
  const { data: reserves, refetch: refetchReserves } = useReadContract({
    address: constantAMMAddress,
    abi: CONTRACT_ABIS.constantAMM,
    functionName: 'getReserves',
  });

  /**
   * Calculate swap quote using constant product formula
   *
   * Formula: amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
   */
  const calculateQuote = useCallback(
    (
      tokenIn: Address,
      amountIn: bigint,
      slippageBps: number = 50 // Default 0.5%
    ): SwapQuote | null => {
      if (!reserves) return null;

      const [reserveA, reserveB] = reserves;
      const isTokenA = tokenIn.toLowerCase() === tokenAAddress.toLowerCase();

      const reserveIn = isTokenA ? reserveA : reserveB;
      const reserveOut = isTokenA ? reserveB : reserveA;
      const tokenOut = isTokenA ? tokenBAddress : tokenAAddress;

      // Validate reserves have liquidity
      if (reserveIn === 0n || reserveOut === 0n) {
        return null;
      }

      // Constant product formula: amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
      const amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);

      // Apply slippage tolerance to get minimum output
      // slippageBps is in basis points (e.g., 50 = 0.5%)
      const slippageMultiplier = BigInt(10000 - slippageBps);
      const amountOutMin = (amountOut * slippageMultiplier) / 10000n;

      // Calculate price impact
      // Price impact = 1 - (outputPrice / inputPrice)
      // For constant product: priceImpact = amountIn / (reserveIn + amountIn)
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
    },
    [reserves, tokenAAddress, tokenBAddress]
  );

  /**
   * Get a swap quote for display purposes
   */
  const getSwapQuote = useCallback(
    (params: SwapParams): SwapQuote | null => {
      const amountIn = parseUnits(params.amountIn, params.decimalsIn);
      return calculateQuote(
        params.tokenIn,
        amountIn,
        params.slippageTolerance ?? 50
      );
    },
    [calculateQuote]
  );

  /**
   * Simulate swap transaction
   */
  const simulateSwap = useCallback(
    (params: SwapParams) => {
      const quote = getSwapQuote(params);
      if (!quote) return null;

      return useSimulateContract({
        address: constantAMMAddress,
        abi: CONTRACT_ABIS.constantAMM,
        functionName: 'swap',
        args: [
          params.tokenIn,
          quote.amountIn,
          quote.amountOutMin,
          params.recipient ?? params.tokenIn, // Default to sender as recipient
        ],
      });
    },
    [getSwapQuote, constantAMMAddress]
  );

  /**
   * Execute swap transaction
   */
  const executeSwap = useCallback(
    async (params: SwapParams): Promise<`0x${string}`> => {
      const quote = getSwapQuote(params);
      if (!quote) {
        throw new Error('Unable to calculate swap quote. Check reserves and try again.');
      }

      // @ts-expect-error - wagmi types are complex and work at runtime
      return writeContractAsync({
        address: constantAMMAddress,
        abi: CONTRACT_ABIS.constantAMM,
        functionName: 'swap',
        args: [
          params.tokenIn,
          quote.amountIn,
          quote.amountOutMin,
          params.recipient ?? params.tokenIn,
        ],
      });
    },
    [getSwapQuote, writeContractAsync, constantAMMAddress]
  );

  /**
   * Format quote for display
   */
  const formatQuote = useCallback(
    (quote: SwapQuote, decimalsOut: number) => {
      return {
        amountIn: formatUnits(quote.amountIn, decimalsOut),
        amountOut: formatUnits(quote.amountOut, decimalsOut),
        amountOutMin: formatUnits(quote.amountOutMin, decimalsOut),
        priceImpact: quote.priceImpact,
        route: quote.route,
      };
    },
    []
  );

  /**
   * Check if a token pair is supported
   */
  const isSupportedPair = useCallback(
    (tokenIn: Address, tokenOut: Address): boolean => {
      const normalizedTokenIn = tokenIn.toLowerCase();
      const normalizedTokenOut = tokenOut.toLowerCase();
      const normalizedA = tokenAAddress.toLowerCase();
      const normalizedB = tokenBAddress.toLowerCase();

      return (
        (normalizedTokenIn === normalizedA && normalizedTokenOut === normalizedB) ||
        (normalizedTokenIn === normalizedB && normalizedTokenOut === normalizedA)
      );
    },
    [tokenAAddress, tokenBAddress]
  );

  return {
    // State
    reserves,
    isPending,
    error,

    // Methods
    getSwapQuote,
    executeSwap,
    simulateSwap,
    refetchReserves,

    // Utilities
    formatQuote,
    isSupportedPair,
    calculateQuote,
  };
}

/**
 * Hook for swap approval
 * Checks if the input token needs approval for the AMM
 */
export function useSwapApproval(tokenIn: Address, owner?: Address) {
  const constantAMMAddress = getContractAddress('constantAMM');

  const { data: allowance, refetch } = useReadContract({
    address: tokenIn,
    abi: CONTRACT_ABIS.erc20,
    functionName: 'allowance',
    args: owner && tokenIn ? [owner, constantAMMAddress] : undefined,
    query: {
      enabled: !!owner && !!tokenIn,
    },
  });

  const needsApproval = (amount: bigint): boolean => {
    return !allowance || allowance < amount;
  };

  return {
    allowance,
    needsApproval,
    refetch,
  };
}
