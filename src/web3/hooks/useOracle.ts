import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { getContractAddress } from '../contracts/addresses';
import { ORACLE_ADAPTER_ABI } from '../contracts/abi';
import type { Address } from 'viem';

export function useTokenPrice(tokenAddress: Address) {
  const { data, isLoading, refetch } = useReadContract({
    address: getContractAddress('oracleAdapter'),
    abi: ORACLE_ADAPTER_ABI,
    functionName: 'getPrice',
    args: [tokenAddress],
    query: { refetchInterval: 30_000 },
  });

  const price = data?.[0] ?? 0n;
  const updatedAt = data?.[1] ? new Date(Number(data[1]) * 1000) : null;
  const formattedPrice = price > 0n ? parseFloat(formatUnits(price, 18)).toFixed(4) : '—';

  return { price, formattedPrice, updatedAt, isLoading, refetch };
}
