// Position status enum matching the contract
export const POSITION_STATUS = { ACTIVE: 0, SETTLED: 1, EXPIRED: 2 } as const;

export const ROUTER_ABI = [
  {
    type: 'function', name: 'registerProtocol', stateMutability: 'nonpayable',
    inputs: [
      { name: 'poolId', type: 'uint256' },
      { name: 'initialCollateral', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function', name: 'deposit', stateMutability: 'nonpayable',
    inputs: [
      { name: 'poolId', type: 'uint256' },
      { name: 'protocolAddress', type: 'address' },
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
      { name: 'lockDuration', type: 'uint256' },
    ],
    outputs: [{ name: 'positionId', type: 'uint256' }],
  },
  {
    type: 'function', name: 'withdraw', stateMutability: 'nonpayable',
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
  {
    type: 'event', name: 'Deposit',
    inputs: [
      { name: 'positionId', type: 'uint256', indexed: true },
      { name: 'lp', type: 'address', indexed: true },
      { name: 'poolId', type: 'uint256', indexed: true },
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
    ],
  },
  {
    type: 'event', name: 'Withdrawal',
    inputs: [
      { name: 'positionId', type: 'uint256', indexed: true },
      { name: 'lp', type: 'address', indexed: true },
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
      { name: 'ilPayout', type: 'uint256' },
    ],
  },
] as const;

export const IL_VAULT_ABI = [
  {
    // Returns: owner, poolId, protocolAddress, amountA, amountB, entryPrice, lockStart, lockDuration, lpAmount, status
    type: 'function', name: 'getPosition', stateMutability: 'view',
    inputs: [{ name: 'positionId', type: 'uint256' }],
    outputs: [
      { name: 'owner', type: 'address' },
      { name: 'poolId', type: 'uint256' },
      { name: 'protocolAddress', type: 'address' },
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
      { name: 'entryPrice', type: 'uint256' },
      { name: 'lockStart', type: 'uint256' },
      { name: 'lockDuration', type: 'uint256' },
      { name: 'lpAmount', type: 'uint256' },
      { name: 'status', type: 'uint8' },
    ],
  },
] as const;

export const ORACLE_ADAPTER_ABI = [
  {
    type: 'function', name: 'getPrice', stateMutability: 'view',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [
      { name: 'price', type: 'uint256' },
      { name: 'updatedAt', type: 'uint256' },
    ],
  },
] as const;

export const CONSTANT_AMM_ABI = [
  {
    type: 'function', name: 'getReserves', stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'reserveA', type: 'uint256' },
      { name: 'reserveB', type: 'uint256' },
    ],
  },
  {
    type: 'function', name: 'getPrice', stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'price', type: 'uint256' }],
  },
  {
    type: 'function', name: 'swap', stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'recipient', type: 'address' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
  {
    type: 'function', name: 'quote', stateMutability: 'view',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
  // Swap event for tracking
  {
    type: 'event', name: 'Swap',
    inputs: [
      { name: 'tokenIn', type: 'address', indexed: true },
      { name: 'tokenOut', type: 'address', indexed: true },
      { name: 'amountIn', type: 'uint256', indexed: false },
      { name: 'amountOut', type: 'uint256', indexed: false },
      { name: 'recipient', type: 'address', indexed: true },
    ],
  },
  // ERC-20 LP token functions
  {
    type: 'function', name: 'balanceOf', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    type: 'function', name: 'approve', stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
  },
  {
    type: 'function', name: 'allowance', stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: 'remaining', type: 'uint256' }],
  },
  {
    type: 'function', name: 'totalSupply', stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'supply', type: 'uint256' }],
  },
] as const;

export const ERC20_ABI = [
  {
    type: 'function', name: 'approve', stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ name: 'success', type: 'bool' }],
  },
  {
    type: 'function', name: 'allowance', stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ name: 'remaining', type: 'uint256' }],
  },
  {
    type: 'function', name: 'balanceOf', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    type: 'function', name: 'decimals', stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'decimals', type: 'uint8' }],
  },
  {
    type: 'function', name: 'symbol', stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'symbol', type: 'string' }],
  },
  {
    type: 'function', name: 'name', stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'name', type: 'string' }],
  },
] as const;

export const CONTRACT_ABIS = {
  router: ROUTER_ABI,
  ilVault: IL_VAULT_ABI,
  oracleAdapter: ORACLE_ADAPTER_ABI,
  constantAMM: CONSTANT_AMM_ABI,
  erc20: ERC20_ABI,
} as const;
