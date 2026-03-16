/**
 * Deployed Contract Addresses on Polkadot Testnet
 *
 * These addresses are used to interact with the deployed Conduir Protocol smart contracts.
 */

export const CONTRACT_ADDRESSES = {
  /**
   * Router - Main entry point for LP deposits and protocol registration
   */
  router: '0x17e25f1f032161f6a3438ee01b91be756ec3a6e9' as const,

  /**
   * CollateralManager - Manages protocol collateral
   */
  collateralManager: '0xd27dbb83cfc71614ae1b90b8374d0513eabcb8cb' as const,

  /**
   * ILVault - Impermanent Loss Vault for position management
   */
  ilVault: '0x68dc51f53857343ee09feb44b86772de4c9e89c9' as const,

  /**
   * ILVoucher - IL Voucher ERC721 contract
   */
  ilVoucher: '0x03a55a333889eacf39a7f92840e8a3153b8d9943' as const,

  /**
   * ConstantAMM - Constant Product AMM for price reference
   */
  constantAMM: '0x1508b920fee8dc674ce15b835d95e73166125c81' as const,

  /**
   * Mock USDC - Test token for deposits
   */
  mockUsdc: '0x3186e53cdd421a032ac18bbb0540a35e4cd57413' as const,
} as const;

/**
 * Get contract address by name
 */
export function getContractAddress(
  key: keyof typeof CONTRACT_ADDRESSES
): `0x${string}` {
  const address = CONTRACT_ADDRESSES[key];
  if (!address) {
    throw new Error(`Contract address not found for key: ${key}`);
  }
  return address as `0x${string}`;
}

/**
 * Get all contract addresses
 */
export function getAllContractAddresses() {
  return CONTRACT_ADDRESSES;
}
