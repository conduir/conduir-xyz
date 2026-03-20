import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits, numberToHex, hexToNumber } from 'viem';
import { getContractAddress } from '../contracts/addresses';
import { IL_VAULT_ABI, POSITION_STATUS } from '../contracts/abi';
import { polkadotTestnet } from '../config/chains';
import { useUserLPPositions } from './useRouter';
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

  const d = data as any;
  const lockExpiry = new Date(Number(d.lockExpiry || d[6]) * 1000);
  const position: Position = {
    positionId,
    positionIndex: hexToNumber(positionId) - 1,
    owner: d.lp || d[0],
    poolId: d.poolId || d[1],
    protocolAddress: d.protocol || d[2],
    amountA: d.amountA || d[3] || 0n,
    amountB: d.amountB || d[4] || 0n,
    entryPrice: d.entryPrice || d[5] || 0n,
    lockStart: d.depositTime || d[7] || 0n,
    lockDuration: (d.lockExpiry && d.depositTime) ? (d.lockExpiry - d.depositTime) : (d.lockExpiry || d[6] || 0n),
    lpAmount: d.voucherAmount || d[8] || 0n,
    status: parseStatus(Number(d.status || d[9] || 0)),
    lockExpiry,
    isLockExpired: lockExpiry < new Date(),
  };

  return { position, isLoading, refetch };
}

// Reads up to `maxPositions` positions for a user by scanning positionIds
// The contract assigns sequential positionIds starting from 1.
// We scan IDs 1..maxPositions and filter by owner.
export function useUserPositions(userAddress?: Address) {
  const ilVaultAddress = getContractAddress('ilVault');
  const { data: lpPositions, isLoading: lpLoading, refetch: refetchLP } = useUserLPPositions(userAddress);

  const contracts = (lpPositions || []).map((pos: any) => ({
    address: ilVaultAddress,
    abi: IL_VAULT_ABI,
    functionName: 'getPosition' as const,
    args: [pos.positionId] as const,
    chainId: polkadotTestnet.id,
  }));

  const { data, isLoading: detailsLoading, refetch: refetchDetails } = useReadContracts({
    contracts,
    query: { enabled: !!userAddress && contracts.length > 0 },
  });

  const positions: Position[] = [];

  if (data && lpPositions) {
    (data as any[]).forEach((result, i) => {
      if (result.status !== 'success' || !result.result) return;
      const d = result.result as any;
      const originalPos = (lpPositions as any[])[i];

      // Filter: Only include ACTIVE positions as seen by both Router and ILVault
      // This hides settled/empty positions from the "Active Deposits" list
      const isActive = originalPos.active && (Number(d.status || d[9] || 0) === 0);
      // Filter: Show position if it is active IN BOTH router and ilVault,
      // OR if it has a non-zero balance remaining (e.g. after a partial withdraw).
      const isActiveInRouter = originalPos.active;
      const isActiveInVault = (Number(d.status || d[9] || 0) === 0);
      const isNotEmpty = (d.amountA || d[3] || 0n) > 0n || (d.amountB || d[4] || 0n) > 0n;

      if (!isNotEmpty) return; // If empty, we don't show it as an "Active Deposit"

      const lockExpiry = new Date(Number(d.lockExpiry || d[6]) * 1000);
      positions.push({
        positionId: originalPos.positionId,
        // CRITICAL: use `i` — the original index in the LP positions array from the contract.
        // The contract's withdraw() expects this exact integer index, NOT a filtered counter.
        positionIndex: i,
        owner: d.lp || d[0],
        poolId: originalPos.poolId || d.poolId || d[1],
        protocolAddress: d.protocol || d[2],
        amountA: d.amountA || d[3] || 0n,
        amountB: d.amountB || d[4] || 0n,
        entryPrice: d.entryPrice || d[5] || 0n,
        lockStart: d.depositTime || d[7] || 0n,
        lockDuration: (d.lockExpiry && d.depositTime) ? (d.lockExpiry - d.depositTime) : (d.lockExpiry || d[6] || 0n),
        lpAmount: d.voucherAmount || d[8] || 0n,
        status: (isActiveInRouter && isActiveInVault) ? 'ACTIVE' : 'SETTLED',
        lockExpiry,
        isLockExpired: lockExpiry < new Date(),
      });
    });
  }

  const refetch = async () => {
    await refetchLP();
    await refetchDetails();
  };

  return { 
    positions, 
    isLoading: lpLoading || detailsLoading, 
    refetch 
  };
}

export function calcIL(entryPrice: bigint, currentPrice: bigint): number {
  if (entryPrice === 0n || currentPrice === 0n) return 0;
  const P = Number(currentPrice) / Number(entryPrice);
  return (2 * Math.sqrt(P)) / (1 + P) - 1; // negative = loss
}

export function formatAmount(amount: bigint | undefined | null, decimals = 6): string {
  if (amount === undefined || amount === null) return '0,00';
  try {
    return parseFloat(formatUnits(amount, decimals)).toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (e) {
    console.error('Error formatting amount:', e, amount);
    return '0,00';
  }
}
