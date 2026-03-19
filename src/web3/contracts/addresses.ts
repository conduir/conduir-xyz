export const CONTRACT_ADDRESSES = {
  router:             '0x17e25f1f032161f6a3438ee01b91be756ec3a6e9' as const,
  collateralManager:  '0xd27dbb83cfc71614ae1b90b8374d0513eabcb8cb' as const,
  ilVault:            '0x68dc51f53857343ee09feb44b86772de4c9e89c9' as const,
  ilVoucher:          '0x03a55a333889eacf39a7f92840e8a3153b8d9943' as const,
  constantAMM:        '0x1508b920fee8dc674ce15b835d95e73166125c81' as const,
  oracleAdapter:      '0x6fa61b1ebae12d0b6c77d7aaa45ef3cc3675ed4d' as const,
  tokenA:             '0xb40f8d939251377c1b84a833c3be6113b28560d3' as const,
  tokenB:             '0x024b24bd9689ef58a24ebf28491536321f853fc6' as const,
  mockUsdc:           '0x3186e53cdd421a032ac18bbb0540a35e4cd57413' as const,
} as const;

export function getContractAddress(key: keyof typeof CONTRACT_ADDRESSES): `0x${string}` {
  return CONTRACT_ADDRESSES[key] as `0x${string}`;
}
