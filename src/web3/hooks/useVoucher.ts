// useVoucher.ts — minimal ERC-20 voucher balance hook
import { useReadContract } from 'wagmi';
import { getContractAddress } from '../contracts/addresses';
import { ERC20_ABI } from '../contracts/abi';
import { polkadotTestnet } from '../config/chains';
import type { Address } from 'viem';

export function useVoucherBalance(owner?: Address) {
  const voucherAddress = getContractAddress('ilVoucher');
  const { data: balance, refetch } = useReadContract({
    address: voucherAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    chainId: polkadotTestnet.id,
    query: { enabled: !!owner },
  });
  return { balance: balance ?? 0n, count: Number(balance ?? 0n), refetch };
}
