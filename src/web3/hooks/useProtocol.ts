import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { getContractAddress } from '../contracts/addresses';
import { ROUTER_ABI } from '../contracts/abi';
import { polkadotTestnet } from '../config/chains';
import type { Address } from 'viem';

/**
 * Protocol data structure from Router.getProtocol()
 */
export interface ProtocolData {
  protocolAddress: Address;
  defaultPoolId: `0x${string}`;
  tier: number; // 0=Tier1, 1=Tier2, 2=Tier3
  collateralAmount: bigint;
  lastFeeEpoch: bigint;
  registered: boolean;
}

const TIER_NAMES = ['Tier 1', 'Tier 2', 'Tier 3'] as const;
const TIER_DESCRIPTIONS = [
  'Low volatility pairs',
  'Medium volatility pairs',
  'High volatility pairs',
] as const;

/**
 * Hook to read protocol data from Router
 */
export function useProtocol(protocolAddress?: Address) {
  const routerAddress = getContractAddress('router');

  const { data, isLoading, refetch, error } = useReadContract({
    address: routerAddress,
    abi: ROUTER_ABI,
    functionName: 'getProtocol',
    args: protocolAddress ? [protocolAddress] : undefined,
    chainId: polkadotTestnet.id,
    query: {
      enabled: !!protocolAddress,
      refetchInterval: 30_000,
      staleTime: 10_000,
    },
  });

  // Parse the tuple response from getProtocol
  const protocolData: ProtocolData | null = data
    ? {
        protocolAddress: data[0] as Address,
        defaultPoolId: data[1] as `0x${string}`,
        tier: data[2] as number,
        collateralAmount: data[3] as bigint,
        lastFeeEpoch: data[4] as bigint,
        registered: data[5] as boolean,
      }
    : null;

  const formattedCollateral = protocolData
    ? formatUnits(protocolData.collateralAmount, 18)
    : '0';

  const tierName = protocolData ? TIER_NAMES[protocolData.tier] || 'Unknown' : null;
  const tierDescription = protocolData
    ? TIER_DESCRIPTIONS[protocolData.tier] || ''
    : '';

  return {
    data: protocolData,
    formattedCollateral,
    tierName,
    tierDescription,
    isLoading,
    error,
    refetch,
    isRegistered: protocolData?.registered ?? false,
  };
}

/**
 * Hook to read collateral health from CollateralManager
 */
export function useCollateralHealth(protocolAddress?: Address) {
  const collateralManagerAddress = getContractAddress('collateralManager');

  const COLLATERAL_MANAGER_ABI = [
    {
      inputs: [{ internalType: 'address', name: 'protocol', type: 'address' }],
      name: 'getCollateralHealth',
      outputs: [{ internalType: 'uint256', name: 'healthRatio', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const;

  const { data, isLoading, refetch } = useReadContract({
    address: collateralManagerAddress,
    abi: COLLATERAL_MANAGER_ABI,
    functionName: 'getCollateralHealth',
    args: protocolAddress ? [protocolAddress] : undefined,
    chainId: polkadotTestnet.id,
    query: {
      enabled: !!protocolAddress,
      refetchInterval: 60_000,
      staleTime: 30_000,
    },
  });

  // Health ratio is typically in 1e18 precision (1e18 = 100%)
  const healthRatio = data ?? 0n;
  const healthPercentage = Number(formatUnits(healthRatio || 1n, 18)) * 100;

  return {
    healthRatio,
    healthPercentage,
    isLoading,
    refetch,
    isHealthy: healthRatio > 0n,
  };
}

/**
 * Combined hook for protocol collateral management UI
 */
export function useProtocolCollateral(protocolAddress?: Address) {
  const protocol = useProtocol(protocolAddress);
  const health = useCollateralHealth(protocolAddress);

  // Calculate collateral status
  const collateralStatus = (() => {
    if (!protocol.isRegistered) return 'not_registered';
    if (health.healthPercentage >= 150) return 'excellent';
    if (health.healthPercentage >= 120) return 'good';
    if (health.healthPercentage >= 100) return 'adequate';
    return 'low';
  })();

  return {
    protocol,
    health,
    collateralStatus,
    isLoading: protocol.isLoading || health.isLoading,
    refetchAll: () => {
      protocol.refetch();
      health.refetch();
    },
  };
}
