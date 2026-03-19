import { useCallback } from 'react';
import { formatUnits } from 'viem';
import { getContractAddress } from '../contracts/addresses';
import { useTokenPrice } from './useOracle';
import type { Position } from './useILVault';

export interface SettlementEstimate {
  amountA: bigint;
  amountB: bigint;
  ilPayout: bigint;
  ilPercentage: number;  // e.g., -0.025 for 2.5% loss
  formatted: {
    amountA: string;
    amountB: string;
    ilPayout: string;
  };
  canSettle: boolean;
  isDemoMode: boolean;
}

export function useSettleIL(position: Position | null) {
  const { price: currentPrice, isDemoMode, isFetched } = useTokenPrice(
    position ? getContractAddress('tokenA') : '0x0000000000000000000000000000000000000000' as const
  );

  // Calculate IL percentage using the formula from smart contract guide:
  // IL% = (2 * sqrt(P) / (1 + P)) - 1, where P = currentPrice / entryPrice
  const ilPercentage = position && currentPrice > 0n
    ? (2 * Math.sqrt(Number(currentPrice) / Number(position.entryPrice))) /
        (1 + Number(currentPrice) / Number(position.entryPrice)) - 1
    : 0;

  // Estimate settlement amounts (client-side estimation)
  const estimate = useCallback((): SettlementEstimate | null => {
    if (!position || !isFetched) return null;

    // If price is mocked (demo mode), show that in the estimate
    const isDemo = isDemoMode;

    // Calculate IL amount based on position's Token A amount
    const ilAmount = Math.abs(ilPercentage) * Number(formatUnits(position.amountA, 18));

    // For estimation, we approximate:
    // - amountA/B returned ≈ position amounts (proportional to LP being burned)
    // - ilPayout = IL amount covered by protocol
    const amountA = position.amountA;  // Simplified - actual contract calc may differ
    const amountB = position.amountB;
    const ilPayout = BigInt(Math.floor(ilAmount * 1e18));

    // Check if lock period has expired
    const now = Math.floor(Date.now() / 1000);
    const canSettle = Number(position.lockStart) + Number(position.lockDuration) <= now;

    return {
      amountA,
      amountB,
      ilPayout,
      ilPercentage,
      formatted: {
        amountA: parseFloat(formatUnits(amountA, 18)).toFixed(4),
        amountB: parseFloat(formatUnits(amountB, 18)).toFixed(4),
        ilPayout: parseFloat(formatUnits(ilPayout, 18)).toFixed(4),
      },
      canSettle,
      isDemoMode: isDemo,
    };
  }, [position, isFetched, isDemoMode, ilPercentage]);

  return {
    estimate,
    currentPrice,
    isDemoMode,
    isFetched,
    ilPercentage: ilPercentage * 100,  // as percentage
  };
}
