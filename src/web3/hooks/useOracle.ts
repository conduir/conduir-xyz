import { useReadContract } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { getContractAddress } from '../contracts/addresses';
import { ORACLE_ADAPTER_ABI } from '../contracts/abi';
import type { Address } from 'viem';

export interface TokenPriceResult {
  price: bigint;
  formattedPrice: string;
  updatedAt: Date | null;
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
  isDemoMode: boolean;
  refetch: () => void;
}

export function useTokenPrice(tokenAddress: Address): TokenPriceResult {
  const { data, isLoading, isFetched, error, refetch } = useReadContract({
    address: getContractAddress('oracleAdapter'),
    abi: ORACLE_ADAPTER_ABI,
    functionName: 'getPrice',
    args: [tokenAddress],
    query: {
      refetchInterval: 30_000,
      enabled: !!tokenAddress,
    },
  });

  // Conduir uses 1e18 scale as per docs
  const rawPrice = data?.[0] ?? 0n;
  const timestamp = data?.[1] ? Number(data[1]) : 0;
  const updatedAt = timestamp > 0 ? new Date(timestamp * 1000) : null;

  // CRITICAL: Mock BOTH BigInt and formatted price for IL calculation consistency
  // If we only mock formattedPrice, IL math breaks (division by zero)
  const isDemoMode = isFetched && rawPrice === 0n;
  const price = isDemoMode ? parseUnits('1.2345', 18) : rawPrice;

  const formattedPrice = (isFetched && rawPrice > 0n)
    ? parseFloat(formatUnits(rawPrice, 18)).toLocaleString(undefined, {
        maximumFractionDigits: 4,
      })
    : (isDemoMode ? '1.2345' : '—');

  return { price, formattedPrice, updatedAt, isLoading, isFetched, error, isDemoMode, refetch };
}
