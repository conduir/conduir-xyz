import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits, numberToHex, hexToNumber } from 'viem';
import { getContractAddress } from '../contracts/addresses';
import { IL_VAULT_ABI, POSITION_STATUS } from '../contracts/abi';
import { polkadotTestnet } from '../config/chains';
import type { Address, Hex } from 'viem';

export type PositionStatus = 'ACTIVE' | 'SETTLED' | 'EXPIRED';

export interface Position {
  positionId: Hex;
  positionIndex: number;
  owner: Address;
  poolId: Hex;
  protocolAddress: Address;
  amountA: bigint;
  amountB: bigint;
  entryPrice: bigint;
  lockStart: bigint;
  lockDuration: bigint;
  lpAmount: bigint;
  status: PositionStatus;
  lockExpiry: Date;
  isLockExpired: boolean;
}

function parseStatus(s: number): PositionStatus {
  if (s === POSITION_STATUS.SETTLED) return 'SETTLED';
  if (s === POSITION_STATUS.EXPIRED) return 'EXPIRED';
  return 'ACTIVE';
}

// Reads a single position by ID
export function usePosition(positionId: Hex) {
  const { data, isLoading, refetch } = useReadContract({
    address: getContractAddress('ilVault'),
    abi: IL_VAULT_ABI,
    functionName: 'getPosition',
    args: [positionId],
    chainId: polkadotTestnet.id,
    query: { enabled: !!positionId && positionId !== '0x0000000000000000000000000000000000000000000000000000000000000000' },
  });

  if (!data) return { position: null, isLoading, refetch };

  const posNum = hexToNumber(positionId);
  const lockExpiry = new Date((Number(data[6]) + Number(data[7])) * 1000);
  const position: Position = {
    positionId,
    positionIndex: posNum - 1, // positionIndex = positionId - 1 (0-based)
    owner: data[0],
    poolId: data[1],
    protocolAddress: data[2],
    amountA: data[3],
    amountB: data[4],
    entryPrice: data[5],
    lockStart: data[6],
    lockDuration: data[7],
    lpAmount: data[8],
    status: parseStatus(data[9]),
    lockExpiry,
    isLockExpired: lockExpiry < new Date(),
  };

  return { position, isLoading, refetch };
}

// Reads up to `maxPositions` positions for a user by scanning positionIds
// The contract assigns sequential positionIds starting from 1.
// We scan IDs 1..maxPositions and filter by owner.
export function useUserPositions(userAddress?: Address, maxPositions = 20) {
  const ilVaultAddress = getContractAddress('ilVault');

  const contracts = Array.from({ length: maxPositions }, (_, i) => ({
    address: ilVaultAddress,
    abi: IL_VAULT_ABI,
    functionName: 'getPosition' as const,
    args: [numberToHex(BigInt(i + 1), { size: 32 })] as const,
    chainId: polkadotTestnet.id,
  }));

  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    query: { enabled: !!userAddress },
  });

  const positions: Position[] = [];

  if (data && userAddress) {
    data.forEach((result, i) => {
      if (result.status !== 'success' || !result.result) return;
      const d = result.result;
      if (d[0].toLowerCase() !== userAddress.toLowerCase()) return;

      const positionId = numberToHex(BigInt(i + 1), { size: 32 });
      const lockExpiry = new Date((Number(d[6]) + Number(d[7])) * 1000);
      positions.push({
        positionId,
        positionIndex: i,
        owner: d[0],
        poolId: d[1],
        protocolAddress: d[2],
        amountA: d[3],
        amountB: d[4],
        entryPrice: d[5],
        lockStart: d[6],
        lockDuration: d[7],
        lpAmount: d[8],
        status: parseStatus(d[9]),
        lockExpiry,
        isLockExpired: lockExpiry < new Date(),
      });
    });
  }

  return { positions, isLoading, refetch };
}

export function calcIL(entryPrice: bigint, currentPrice: bigint): number {
  if (entryPrice === 0n || currentPrice === 0n) return 0;
  const P = Number(currentPrice) / Number(entryPrice);
  return (2 * Math.sqrt(P)) / (1 + P) - 1; // negative = loss
}

export function formatAmount(amount: bigint, decimals = 18): string {
  return parseFloat(formatUnits(amount, decimals)).toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
}
