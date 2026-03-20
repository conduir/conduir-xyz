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
