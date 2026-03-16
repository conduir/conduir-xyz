/**
 * Contract ABIs for Conduir Protocol
 *
 * These ABIs are used to interact with the deployed smart contracts.
 */

/**
 * Router Contract ABI
 * Main entry point for LP deposits and protocol registration
 */
export const ROUTER_ABI = [
  // Deposit function for LPs
  {
    type: 'function',
    name: 'deposit',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'poolId', type: 'uint256' },
      { name: 'protocolAddress', type: 'address' },
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
      { name: 'lockDuration', type: 'uint256' },
    ],
    outputs: [{ name: 'positionId', type: 'uint256' }],
  },
  // Withdraw function for LPs
  {
    type: 'function',
    name: 'withdraw',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'positionIndex', type: 'uint256' },
      { name: 'lpAmount', type: 'uint256' },
    ],
    outputs: [
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
      { name: 'ilPayout', type: 'uint256' },
    ],
  },
  // Protocol registration
  {
    type: 'function',
    name: 'registerProtocol',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'poolId', type: 'uint256' },
      { name: 'initialCollateral', type: 'uint256' },
    ],
    outputs: [{ name: 'voucherId', type: 'uint256' }],
  },
  // Get position details
  {
    type: 'function',
    name: 'getPosition',
    stateMutability: 'view',
    inputs: [{ name: 'positionId', type: 'uint256' }],
    outputs: [
      { name: 'owner', type: 'address' },
      { name: 'poolId', type: 'uint256' },
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
      { name: 'lockStart', type: 'uint256' },
      { name: 'lockDuration', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
    ],
  },
  // Get listing fee
  {
    type: 'function',
    name: 'getListingFee',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'fee', type: 'uint256' }],
  },
  // Get supported pools
  {
    type: 'function',
    name: 'getSupportedPools',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: 'pools',
        type: 'tuple[]',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'tokenA', type: 'address' },
          { name: 'tokenB', type: 'address' },
          { name: 'feeRate', type: 'uint256' },
        ],
      },
    ],
  },
  // Events
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      { name: 'positionId', type: 'uint256', indexed: true },
      { name: 'lp', type: 'address', indexed: true },
      { name: 'poolId', type: 'uint256', indexed: true },
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'Withdrawal',
    inputs: [
      { name: 'positionId', type: 'uint256', indexed: true },
      { name: 'lp', type: 'address', indexed: true },
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
      { name: 'ilPayout', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'ProtocolRegistered',
    inputs: [
      { name: 'voucherId', type: 'uint256', indexed: true },
      { name: 'protocol', type: 'address', indexed: true },
      { name: 'poolId', type: 'uint256', indexed: true },
      { name: 'collateral', type: 'uint256' },
    ],
  },
] as const;

/**
 * ILVault Contract ABI
 */
export const IL_VAULT_ABI = [
  {
    type: 'function',
    name: 'getPosition',
    stateMutability: 'view',
    inputs: [{ name: 'positionId', type: 'uint256' }],
    outputs: [
      { name: 'owner', type: 'address' },
      { name: 'poolId', type: 'uint256' },
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
      { name: 'lockStart', type: 'uint256' },
      { name: 'lockDuration', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'ilAccrued', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'settleIL',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'positionId', type: 'uint256' }],
    outputs: [{ name: 'ilPayout', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getTotalILAccrued',
    stateMutability: 'view',
    inputs: [{ name: 'poolId', type: 'uint256' }],
    outputs: [{ name: 'totalIL', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'ILSettled',
    inputs: [
      { name: 'positionId', type: 'uint256', indexed: true },
      { name: 'ilPayout', type: 'uint256' },
    ],
  },
] as const;

/**
 * ILVoucher (ERC721) Contract ABI
 */
export const IL_VOUCHER_ABI = [
  // ERC721 Standard
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'owner', type: 'address' }],
  },
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
  },
  // Voucher-specific
  {
    type: 'function',
    name: 'getVoucher',
    stateMutability: 'view',
    inputs: [{ name: 'voucherId', type: 'uint256' }],
    outputs: [
      { name: 'poolId', type: 'uint256' },
      { name: 'protocol', type: 'address' },
      { name: 'collateral', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'createdAt', type: 'uint256' },
      { name: 'expiresAt', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getActiveVouchers',
    stateMutability: 'view',
    inputs: [{ name: 'protocol', type: 'address' }],
    outputs: [
      {
        name: 'voucherIds',
        type: 'uint256[]',
      },
    ],
  },
  {
    type: 'event',
    name: 'VoucherMinted',
    inputs: [
      { name: 'voucherId', type: 'uint256', indexed: true },
      { name: 'protocol', type: 'address', indexed: true },
      { name: 'poolId', type: 'uint256', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'VoucherRedeemed',
    inputs: [
      { name: 'voucherId', type: 'uint256', indexed: true },
      { name: 'protocol', type: 'address', indexed: true },
    ],
  },
] as const;

/**
 * CollateralManager Contract ABI
 */
export const COLLATERAL_MANAGER_ABI = [
  {
    type: 'function',
    name: 'getCollateral',
    stateMutability: 'view',
    inputs: [{ name: 'protocol', type: 'address' }],
    outputs: [
      { name: 'totalDeposited', type: 'uint256' },
      { name: 'totalLocked', type: 'uint256' },
      { name: 'available', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'lockCollateral',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'protocol', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'unlockCollateral',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'protocol', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getRequiredCollateral',
    stateMutability: 'view',
    inputs: [{ name: 'poolId', type: 'uint256' }],
    outputs: [{ name: 'required', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'CollateralLocked',
    inputs: [
      { name: 'protocol', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'CollateralUnlocked',
    inputs: [
      { name: 'protocol', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256' },
    ],
  },
] as const;

/**
 * ConstantAMM Contract ABI
 */
export const CONSTANT_AMM_ABI = [
  {
    type: 'function',
    name: 'getReserves',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'reserveA', type: 'uint256' },
      { name: 'reserveB', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getAmountOut',
    stateMutability: 'view',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'tokenIn', type: 'address' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'quote',
    stateMutability: 'view',
    inputs: [
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
    ],
    outputs: [
      { name: 'liquidity', type: 'uint256' },
    ],
  },
] as const;

/**
 * ERC20 Token ABI
 */
export const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: 'remaining', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'decimals', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'symbol', type: 'string' }],
  },
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'name', type: 'string' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'supply', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256' },
    ],
  },
] as const;

/**
 * Combined exports
 */
export const CONTRACT_ABIS = {
  router: ROUTER_ABI,
  ilVault: IL_VAULT_ABI,
  ilVoucher: IL_VOUCHER_ABI,
  collateralManager: COLLATERAL_MANAGER_ABI,
  constantAMM: CONSTANT_AMM_ABI,
  erc20: ERC20_ABI,
} as const;
