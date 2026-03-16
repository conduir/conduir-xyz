import { useCallback, useMemo } from 'react';
import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
  useWatchContractEvent,
} from 'wagmi';
import { getContractAddress } from '../contracts/addresses';
import { CONTRACT_ABIS } from '../contracts/abi';
import { useTransactionReceipt } from './useContract';
import type { Address } from 'viem';

/**
 * Voucher information interface
 */
export interface VoucherInfo {
  voucherId: bigint;
  poolId: bigint;
  protocol: Address;
  collateral: bigint;
  isActive: boolean;
  createdAt: bigint;
  expiresAt: bigint;
}

/**
 * Hook for ILVoucher contract interactions
 */
export function useVoucher() {
  const voucherAddress = getContractAddress('ilVoucher');

  /**
   * Get voucher details
   */
  const getVoucher = useCallback(
    (voucherId: bigint) => {
      return useReadContract({
        address: voucherAddress,
        abi: CONTRACT_ABIS.ilVoucher,
        functionName: 'getVoucher',
        args: [voucherId],
      });
    },
    [voucherAddress]
  );

  /**
   * Get active vouchers for a protocol
   */
  const getActiveVouchers = useCallback(
    (protocol: Address) => {
      return useReadContract({
        address: voucherAddress,
        abi: CONTRACT_ABIS.ilVoucher,
        functionName: 'getActiveVouchers',
        args: [protocol],
        query: {
          enabled: !!protocol,
        },
      });
    },
    [voucherAddress]
  );

  /**
   * Get voucher balance
   */
  const getBalance = useCallback(
    (owner: Address) => {
      return useReadContract({
        address: voucherAddress,
        abi: CONTRACT_ABIS.ilVoucher,
        functionName: 'balanceOf',
        args: [owner],
        query: {
          enabled: !!owner,
        },
      });
    },
    [voucherAddress]
  );

  /**
   * Get voucher owner
   */
  const getOwner = useCallback(
    (voucherId: bigint) => {
      return useReadContract({
        address: voucherAddress,
        abi: CONTRACT_ABIS.ilVoucher,
        functionName: 'ownerOf',
        args: [voucherId],
        query: {
          enabled: voucherId > 0n,
        },
      });
    },
    [voucherAddress]
  );

  /**
   * Get token URI
   */
  const getTokenURI = useCallback(
    (voucherId: bigint) => {
      return useReadContract({
        address: voucherAddress,
        abi: CONTRACT_ABIS.ilVoucher,
        functionName: 'tokenURI',
        args: [voucherId],
        query: {
          enabled: voucherId > 0n,
        },
      });
    },
    [voucherAddress]
  );

  return {
    getVoucher,
    getActiveVouchers,
    getBalance,
    getOwner,
    getTokenURI,
    address: voucherAddress,
  };
}

/**
 * Hook for a specific voucher
 */
export function useVoucherDetails(voucherId: bigint) {
  const voucherAddress = getContractAddress('ilVoucher');

  const { data: voucher, isLoading, refetch } = useReadContract({
    address: voucherAddress,
    abi: CONTRACT_ABIS.ilVoucher,
    functionName: 'getVoucher',
    args: [voucherId],
    query: {
      enabled: voucherId > 0n,
    },
  });

  const { data: owner } = useReadContract({
    address: voucherAddress,
    abi: CONTRACT_ABIS.ilVoucher,
    functionName: 'ownerOf',
    args: [voucherId],
    query: {
      enabled: voucherId > 0n,
    },
  });

  const { data: tokenURI } = useReadContract({
    address: voucherAddress,
    abi: CONTRACT_ABIS.ilVoucher,
    functionName: 'tokenURI',
    args: [voucherId],
    query: {
      enabled: voucherId > 0n,
    },
  });

  const voucherInfo: VoucherInfo | null = useMemo(() => {
    if (!voucher) return null;
    return {
      voucherId,
      poolId: voucher[0],
      protocol: voucher[1],
      collateral: voucher[2],
      isActive: voucher[3],
      createdAt: voucher[4],
      expiresAt: voucher[5],
    };
  }, [voucher, voucherId]);

  return {
    voucher: voucherInfo,
    owner,
    tokenURI,
    isLoading,
    refetch,
  };
}

/**
 * Hook for protocol vouchers
 */
export function useProtocolVouchers(protocol: Address) {
  const voucherAddress = getContractAddress('ilVoucher');

  const { data: voucherIds, refetch } = useReadContract({
    address: voucherAddress,
    abi: CONTRACT_ABIS.ilVoucher,
    functionName: 'getActiveVouchers',
    args: [protocol],
    query: {
      enabled: !!protocol,
    },
  });

  const { data: balance } = useReadContract({
    address: voucherAddress,
    abi: CONTRACT_ABIS.ilVoucher,
    functionName: 'balanceOf',
    args: [protocol],
    query: {
      enabled: !!protocol,
    },
  });

  return {
    voucherIds: voucherIds || [],
    balance: balance || 0n,
    refetch,
  };
}

/**
 * Hook for voucher balance
 */
export function useVoucherBalance(owner?: Address) {
  const voucherAddress = getContractAddress('ilVoucher');

  const { data: balance, refetch } = useReadContract({
    address: voucherAddress,
    abi: CONTRACT_ABIS.ilVoucher,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    query: {
      enabled: !!owner,
    },
  });

  return {
    balance: balance || 0n,
    count: Number(balance || 0n),
    refetch,
  };
}

/**
 * Hook for watching voucher events
 */
export function useVoucherEvents(
  eventName: 'VoucherMinted' | 'VoucherRedeemed',
  callback: (logs: any[]) => void,
  enabled = true
) {
  const voucherAddress = getContractAddress('ilVoucher');

  useWatchContractEvent({
    address: voucherAddress,
    abi: CONTRACT_ABIS.ilVoucher,
    eventName,
    onLogs: callback,
    enabled,
  });
}

/**
 * Hook to get all vouchers for a protocol with details
 */
export function useProtocolVoucherDetails(protocol: Address) {
  const { voucherIds, refetch: refetchIds } = useProtocolVouchers(protocol);

  // This would need multicall in production
  // For now, we return the IDs and let the component fetch details as needed
  return {
    voucherIds,
    refetch: refetchIds,
  };
}
