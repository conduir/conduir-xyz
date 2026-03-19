# Conduir Protocol — Smart Contract

> A simple DeFi protocol that provides **Impermanent Loss (IL) protection** to Liquidity Providers (LP) facilitated by Protocols/Projects in need of liquidity.

---

## Table of Contents

1. [What is Conduir?](#what-is-conduir)
2. [How it Works in a Nutshell](#how-it-works-in-a-nutshell)
3. [Contract Architecture](#contract-architecture)
4. [Contract Explanations](#contract-explanations)
5. [Protocol Side Flow](#protocol-side-flow)
6. [LP Side Flow](#lp-side-flow)
7. [How to Deploy & Setup](#how-to-deploy--setup)
8. [Running Tests](#running-tests)
9. [Unit Test & Integration Test Coverage](#unit-test--integration-test-coverage)
10. [Mock Status — What Needs Replacing Before Mainnet](#mock-status--what-needs-replacing-before-mainnet)

## Deployed Contracts (Polkadot Testnet)

Below are the smart contract addresses that have been deployed and verified on the Polkadot Testnet:
- **Block Explorer (Blockscout):** [https://blockscout-testnet.polkadot.io/](https://blockscout-testnet.polkadot.io/)
- **Alternative Explorer (RouteScan):** [https://polkadot.testnet.routescan.io/](https://polkadot.testnet.routescan.io/) (Use this if you want to interact with the contracts directly on the explorer)

| Contract | Address |
|---|---|
| Mock USDC (Listing Token) | `0x3186e53cdd421a032ac18bbb0540a35e4cd57413` |
| CollateralManager | `0xd27dbb83cfc71614ae1b90b8374d0513eabcb8cb` |
| OracleAdapter | `0x6fa61b1ebae12d0b6c77d7aaa45ef3cc3675ed4d` |
| Router | `0x17e25f1f032161f6a3438ee01b91be756ec3a6e9` |
| Mock Token A | `0xb40f8d939251377c1b84a833c3be6113b28560d3` |
| Mock Token B | `0x024b24bd9689ef58a24ebf28491536321f853fc6` |
| ILVault | `0x68dc51f53857343ee09feb44b86772de4c9e89c9` |
| ILVoucher | `0x03a55a333889eacf39a7f92840e8a3153b8d9943` |
| ConstantAMM | `0x1508b920fee8dc674ce15b835d95e73166125c81` |

---

## What is Conduir?

Conduir is a system where:
- **Protocols** (other DeFi projects) pay collateral to Conduir so that LPs are willing to provide liquidity to their pools.
- **LPs** deposit assets into AMM pools through Conduir and receive a guarantee: **if the price moves and they incur a loss (IL), that loss will be compensated by the Protocol** from the collateral they deposited.

This system is mutually beneficial: LPs are protected, and Protocols gain liquidity.

---

## How it Works in a Nutshell

```
[Protocol] -- pay listing fee + collateral --> [Router] --> [CollateralManager]
[LP]       -- deposit tokenA + tokenB -------> [Router] --> [ConstantAMM] (get LP Token)
                                                          --> [ILVault]    (record position, mint Voucher to Protocol)
[LP]       -- withdraw after lock expires ----> [Router] --> [ILVault.settleIL()] --> [CollateralManager] --> pay IL to LP
                                                          --> [ConstantAMM.removeLiquidity()] --> return assets to LP
```

---

## Contract Architecture

```
contracts/src/
├── Router.sol             -- Main entry point. All user interactions go through here.
├── ConstantAMM.sol        -- AMM liquidity pool (x * y = k). Also an ERC-20 (LP Token).
├── ILVault.sol            -- The "brain" of IL protection. Records positions and calculates IL.
├── ILVoucher.sol          -- ERC-20 token as proof of IL obligation from Protocol to LP.
├── CollateralManager.sol  -- The Protocol's collateral "bank". Stores and releases collateral.
├── OracleAdapter.sol      -- Provider of token prices and volatility data.
└── interface/             -- Interface definitions for each of the contracts above.
```

---

## Contract Explanations

### 1. `Router.sol` — Main Entry Point

The Router is the only contract that users (both Protocols and LPs) should interact with directly. There is no business logic here—the Router only validates input and forwards commands to the appropriate contract.

**Core Functions:**

| Function | Caller | Description |
|---|---|---|
| `setCoreDependencies()` | Admin (once after deployment) | Connects the Router to ILVault, CollateralManager, and OracleAdapter |
| `addPool()` | Admin | Registers a new AMM pool to the system |
| `removePool()` | Admin | Deactivates a pool (new deposits are blocked, withdrawals are still allowed) |
| `replacePool()` | Admin | Replaces the AMM contract of a problematic pool |
| `registerProtocol()` | Protocol | Registers with Conduir, paying listing fee + collateral |
| `deposit()` | LP | Deposits assets into a pool with IL protection |
| `withdraw()` | LP | Withdraws assets from the pool + receives IL payment if applicable |
| `collectAccruedFee()` | Admin | Collects monthly fees from Protocol collateral |
| `pause()` / `unpause()` | Admin | Emergency stop for the entire system |

---

### 2. `ConstantAMM.sol` — Liquidity Pool

An AMM pool using the **constant product formula (x × y = k)**. This contract is also an **ERC-20 token**—the minted tokens are **LP Receipt Tokens** serving as proof of LP ownership in the pool.

**Core Functions:**

| Function | Description |
|---|---|
| `initialize()` | Sets the token pair and Router. Can only be called once. |
| `addLiquidity()` | Receives tokenA & tokenB, mints LP Tokens to the LP. Can only be called by the Router. |
| `removeLiquidity()` | Burns LP Tokens, returns tokenA & tokenB to the LP. Can only be called by the Router. |
| `swap()` | Swaps one token for another using the constant product formula. |
| `getPrice()` | Returns the price of tokenA in terms of tokenB based on the pool reserve ratio. |

---

### 3. `ILVault.sol` — Position Recorder & IL Calculator

This is the "heart" of the entire system. ILVault records full data for every LP position upon entry, and when an LP exits, ILVault calculates the loss (IL) to be paid.

**IL Formula used:**
```
P         = current_price / entry_price
IL%       = (2 * sqrt(P) / (1 + P)) - 1
ILAmount  = deposit_amount * |IL%|
```

**Core Functions:**

| Function | Description |
|---|---|
| `setAddresses()` | Connects ILVault to ILVoucher, ConstantAMM, Oracle, and CollateralManager. Can only be called by the Router. |
| `recordPosition()` | Records a new LP position during deposit. Mints an IL Voucher to the Protocol. Can only be called by the Router. |
| `settleIL()` | Calculates IL when an LP wants to withdraw. If IL exists, it takes from the Protocol's collateral and sends it to the LP. Can only be called by the Router. |
| `getPosition()` | Retrieves full data for a position based on positionId. |

**Position Status:**
- `ACTIVE` — LP has deposited, position is ongoing.
- `SETTLED` — LP has withdrawn, IL calculated and paid.
- `EXPIRED` — LP has withdrawn, price did not move, hence IL = 0.

---

### 4. `ILVoucher.sol` — Proof of IL Obligation Token

A standard ERC-20 token minted to the Protocol whenever an LP joins their pool. This voucher represents the **Protocol's obligation to cover the IL** for the corresponding LP position. When the LP withdraws and the IL is settled, this voucher is burned.

> **Important Note:** As this is a standard ERC-20, vouchers are transferable. If a Protocol sells a voucher to another party, that Protocol **can no longer settle** the LP position because it lacks the voucher balance to burn.

**Core Functions:**

| Function | Description |
|---|---|
| `mint()` | Mints a voucher to the Protocol when an LP deposits. Can only be called by ILVault. |
| `burn()` | Burns the voucher from the current holder during settlement. Can only be called by ILVault. |

---

### 5. `CollateralManager.sol` — Protocol Collateral Bank

Stores all collateral deposited by Protocols. Responsible for three things: receiving collateral, determining if Protocol collateral is still "healthy," and releasing collateral to pay IL to LPs or fees to the treasury.

**Health Ratio Concept:**
```
minimumRequired = matchedTVL * 15% (maximum IL estimation)
healthRatio      = (collateralBalance / minimumRequired) * 100%
```
- `>= 150%` (≥ 15000 BPS): **HEALTHY** — can accept new LPs.
- `100–149%`: **WARNING** — cannot accept new LPs.
- `< 100%`: **CRITICAL** — matching activity blocked.

**Core Functions:**

| Function | Description |
|---|---|
| `setAuthorizedCallers()` | Sets who (Router and ILVault) is authorized to call sensitive functions. Can only be done once. |
| `registerProtocol()` | Records a new Protocol and its initial collateral. Called by the Router. |
| `depositCollateral()` | Protocol collateral top-up. Called by the Router. |
| `deductCollateral()` | Reduces collateral and transfers it to the recipient (LP or treasury). Called by ILVault or Router. |
| `updateMatchedTVL()` | Updates the total value of LP assets covered by the Protocol. Called by the Router. |
| `getCollateralHealth()` | Returns the current health ratio of the Protocol. |

---

### 6. `OracleAdapter.sol` — Price Provider

Provides token prices and volatility data for other contracts. In this MVP, prices are set manually by the admin. The architecture is designed so it can be replaced with Chainlink or Pyth in the future without changing other contracts.

**Core Functions:**

| Function | Description |
|---|---|
| `setPrice()` | Sets the price of a token, 1e18 scale. Owner only. |
| `setVolatility()` | Sets the annual volatility for a token pair. Owner only. |
| `getPrice()` | Returns the token price and its update timestamp. |
| `getVolatility()` | Returns the token pair volatility. |

---

### 7. `ILVoucher.sol` — ERC-20 LP Receipt Token

Already explained above in number 4.

---

## Protocol Side Flow

Below are the steps for a DeFi Project wishing to offer IL protection for its LPs:

### Explanation of Fund Flow (Fee vs Collateral)

Before registering, Protocols must understand there are two types of fund flows charged to them:

1. **Listing Fee (Registration Fee)**
   - Type: **One-time fee**
   - Purpose: Payment goes directly to the **Conduir Treasury** (as platform revenue).
   - Usage: This money is not held by the system and cannot be withdrawn.
   
2. **Initial Collateral**
   - Type: **Deposit / Collateral Deposit**
   - Purpose: Payment is entrusted and stored within the **CollateralManager**.
   - Usage: This collateral fund will be gradually deducted for two things:
     - Given to the LP as compensation if Impermanent Loss occurs.
     - Deducted by the system (Admin) as a **Monthly Fee** collection every epoch (30 days). This Monthly Fee is deducted from the Collateral and sent to the Conduir Treasury.

---

### Registration Steps

**Step 1: Approve Token**
```solidity
// Approve Router to take the listing fee + initial collateral
IERC20(feeToken).approve(address(router), listingFeeAmount + initialCollateral);
```

**Step 2: Registration**
```solidity
// poolId is the ID of the AMM pool you want to associate with this Protocol
router.registerProtocol(poolId, initialCollateral);
```

After this:
- Listing fee sent to the Conduir treasury.
- Initial collateral safely stored in `CollateralManager`.
- The Protocol receives a **tier** (TIER_1/TIER_2/TIER_3) based on the volatility of the pool assets retrieved from the Oracle.

**Step 3: Receive LP (Automatic)**
Whenever an LP deposits into a pool associated with this Protocol, the Protocol automatically receives **IL Vouchers** equal to the amount of tokenA deposited by the LP. This happens automatically; the Protocol doesn't need to do anything.

**Step 4: Pay Monthly Fee (Automatic)**
Every 30 days, the Conduir Admin can collect a monthly fee from the Protocol's collateral. The Protocol doesn't need to do anything as long as its collateral is sufficient.

---

## LP Side Flow

Below are the steps an LP takes to deposit and protect themselves from IL:

**Step 1: Approve Token**
```solidity
// Approve Router to take tokenA and tokenB for deposit
IERC20(tokenA).approve(address(router), amountA);
IERC20(tokenB).approve(address(router), amountB);
```

**Step 2: Deposit to Pool**
```solidity
// lockDuration in seconds (min 7 days, max 365 days)
router.deposit(poolId, protocolAddress, amountA, amountB, lockDuration);
```

After this, the LP receives:
- **LP Tokens** from `ConstantAMM` as proof of ownership in the pool.
- The position is recorded in `ILVault` with the `entryPrice` saved.

**Step 3: Wait for Lock Period to Expire**
The LP cannot withdraw their assets before the lock time expires. The lock period can be any duration within the 7–365 days range.

**Step 4: Withdraw**
```solidity
// positionIndex is the order of the position in the LP's position array (starting from 0)
// lpAmount is the amount of LP tokens to redeem
IERC20(lpToken).approve(address(router), lpAmount); // approve LP token to Router first
router.withdraw(positionIndex, lpAmount);
```

After this, the LP receives:
- **TokenA + TokenB** returned from the pool.
- **Additional IL payment** (if the price moves) in collateral tokens taken from the Protocol's collateral.

---

## How to Deploy & Setup

The deployment sequence is **critical** and must be performed in the following order:

```bash
# 1. Deploy CollateralManager (no parameters)
CollateralManager cm = new CollateralManager();

# 2. Deploy OracleAdapter (requires owner address)
OracleAdapter oracle = new OracleAdapter(ownerAddress);

# 3. Deploy Router (requires: owner, treasury, feeToken, listingFee, monthlyFee)
Router router = new Router(owner, treasury, feeToken, 100e18, 10e18);

# 4. Deploy ILVault (requires router address)
ILVault vault = new ILVault(address(router));

# 5. Deploy ILVoucher (requires ilVault address - immutable!)
ILVoucher voucher = new ILVoucher(address(vault));

# 6. Deploy one or more ConstantAMM
ConstantAMM amm = new ConstantAMM();
amm.initialize(address(tokenA), address(tokenB), address(router));

# 7. Link all contracts (MUST BE RUN AFTER ALL DEPLOYMENTS ARE COMPLETE)

# 7a. Notify CollateralManager who the Router and ILVault are
cm.setAuthorizedCallers(address(router), address(vault));

# 7b. Notify the Router of the ILVault, CollateralManager, and Oracle addresses
router.setCoreDependencies(address(vault), address(cm), address(oracle));

# 7c. Notify ILVault of all its dependencies (can only be called by the Router!)
# Call as the Router using the Foundry cheatcode vm.prank() or via a script
vault.setAddresses(address(voucher), address(amm), address(oracle), address(cm));

# 7d. Register the AMM pool with the Router
router.addPool(address(amm), address(tokenA), address(tokenB));

# 8. Setup Oracle (mandatory before any Protocol registers)
oracle.setPrice(address(tokenA), price_in_1e18);
oracle.setPrice(address(tokenB), price_in_1e18);
oracle.setVolatility(address(tokenA), address(tokenB), volatility_in_1e18);
```

---

## Running Tests

This project uses **Foundry** as the testing framework.

```bash
# Run all tests at once
forge test -vv

# Run only unit tests for ConstantAMM
forge test --match-path test/ConstantAMM.t.sol -vv

# Run only unit tests for ILVault
forge test --match-path test/ILVault.t.sol -vv

# Run only unit tests for Router
forge test --match-path test/Router.t.sol -vv

# Run only integration tests
forge test --match-path test/IntegrationTest.t.sol -vv

# Run with more detailed output (trace every function)
forge test -vvvv
```

---

## Unit Test & Integration Test Coverage

### Unit Test

Each main contract has its own unit test file.

#### `test/ConstantAMM.t.sol`
| Scenario | Description |
|---|---|
| ✅ Deploy & Initialize | Pool can be deployed and initialized correctly |
| ✅ Add Liquidity | LP can deposit and receive LP Tokens |
| ✅ Remove Liquidity | LP can withdraw assets and LP Tokens are burned |
| ✅ Swap | Token swap succeeds with the constant product formula |
| ✅ Slippage Protection | Swap rejected if output is below minimum |
| ❌ Not Router | All write functions revert if called by non-Router |
| ❌ Double Initialize | `initialize()` cannot be called twice |

#### `test/ILVault.t.sol`
| Scenario | Description |
|---|---|
| ✅ Record Position | LP position recorded correctly, Voucher minted to Protocol |
| ✅ Settle IL — IL Exists | Price moves, IL is calculated and paid from collateral |
| ✅ Settle IL — No IL | Price is the same, no payment, status becomes EXPIRED |
| ❌ Already Settled | Already settled position cannot be settled again |
| ❌ Not Router | Write functions revert if called by non-Router |

#### `test/Router.t.sol`
| Scenario | Description |
|---|---|
| ✅ Register Protocol | Protocol can register, listing fee + collateral sent |
| ✅ LP Deposit | LP can deposit, position recorded, Voucher minted |
| ✅ LP Withdraw | LP can withdraw after lock, IL paid if applicable |
| ✅ Admin Fee Collection | Admin can collect fees after one epoch (30 days) |
| ✅ Add/Remove Pool | Pool can be added and deactivated by admin |
| ❌ Double Registration | Protocol cannot register twice |
| ❌ Withdraw Before Lock | LP cannot withdraw before lock ends |
| ❌ Deposit to Inactive Pool | LP cannot deposit to a removed pool |
| ❌ Missing Dependencies | All major functions revert if setup is incomplete |

---

### Integration Test

The `test/IntegrationTest.t.sol` file uses real contracts (not mocks) and tests full end-to-end scenarios.

#### Success Scenarios (Happy Path)
| # | Test | Description |
|---|---|---|
| 1 | `test_Protocol_Register_Success` | Protocol registers, listing fee to treasury, collateral to CollateralManager, tier assigned |
| 2 | `test_LP_Deposit_Success` | LP deposits, LP Token received, IL Voucher to Protocol, position recorded |
| 3 | `test_LP_Withdraw_NoIL_Success` | LP withdraws without IL (price unchanged), assets returned, Voucher burned |
| 4 | `test_LP_Withdraw_WithIL_Success` | LP withdraws with IL (price up 2x), Protocol pays IL from collateral |
| 5 | `test_MultiLP_SamePool_Success` | Two different LPs in the same pool, positions and Vouchers are independent |

#### Failure Scenarios (Sad Path)
| # | Test | Description |
|---|---|---|
| 6 | `test_Fail_Protocol_Register_Twice` | Already registered Protocol cannot register again |
| 7 | `test_Fail_LP_Deposit_UnregisteredProtocol` | LP cannot deposit into an unregistered Protocol |
| 8 | `test_Fail_LP_Withdraw_BeforeLockExpiry` | LP cannot withdraw before the lock period expires |
| 9 | `test_Fail_LP_Deposit_InvalidLockDuration` | Lock duration out of bounds (< 7 days or > 365 days) is rejected |
| 10 | `test_Fail_Protocol_Register_InsufficientFee` | Approving fewer tokens than needed causes a revert |
| 11 | `test_Fail_CollectFee_EpochNotOver` | Admin cannot collect fee before 30 days have passed |
| 12 | `test_Fail_LP_Deposit_InsufficientCollateralHealth` | LP is rejected if Protocol health ratio is below 150% |

#### Surprise Scenarios (Edge Cases)
| # | Test | Description |
|---|---|---|
| 13 | `test_Surprise_WithdrawFromRemovedPool` | LP can withdraw from a pool removed by the Admin |
| 14 | `test_Surprise_MultiEpochFeeCollection` | Admin can collect fees from 3+ overdue epochs at once |
| 15 | `test_Surprise_VoucherTransferredToSecondaryBuyer` | Voucher transferred → Protocol cannot settle (design consideration) |
| 16 | `test_Surprise_EmergencyPause` | Emergency pause blocks deposit/register, unpause restores everything |
| 17 | `test_Surprise_ShortLock_PriceDropped` | LP with 7-day lock + 50% price drop, IL is correctly paid |
| 18 | `test_Surprise_PoolReplaced_LPCannotWithdrawFromNewPool` | LP cannot withdraw after pool is replaced (migration edge case) |
| 19 | `test_Surprise_MultiPool_SameProtocol_DifferentPools` | LP deposits into two different pools from the same Protocol |

---

## Mock Status — What Needs to be Replaced Before Mainnet

Several contracts and components in this project are currently in an **MVP/mock** state—meaning their functionality is basic and not yet suitable for use on a public network (mainnet). Here are the details:

---

### 🔴 `OracleAdapter.sol` — **Must be Replaced**

**Current status:** Price and volatility are set **manually** by the admin via `setPrice()` and `setVolatility()`.

**Problem:** Manually set prices are highly vulnerable to admin manipulation. On mainnet, this means users must **fully trust** the admin to determine the amount of IL to be paid.

**What needs to be done:**
Replace the `OracleAdapter.sol` implementation with an integration to a decentralized on-chain oracle. Recommended options:

| Oracle | Description |
|---|---|
| **Chainlink Price Feeds** | Industry standard, available on many chains. Suitable for popular token prices. |
| **Pyth Network** | Faster price updates (~400ms), suitable for more volatile assets. |
| **Uniswap V3 TWAP** | Uses the average price from Uniswap pools as a source that's harder to manipulate. |

> **Note:** The `IOracleAdapter` interface is designed to be swappable without changing other contracts. Simply deploy a new implementation that satisfies the same interface, then call `setCoreDependencies()` on the Router with the new address.

> ⚠️ Since `setCoreDependencies()` can only be called **once**, replacing the Oracle in production requires a full Router upgrade or adding a specific setter for the Oracle only.

---

### 🟡 `ConstantAMM.sol` — **Should be Considered**

**Current status:** Simple AMM pool using the `x * y = k` formula without swap fees.

**Problem:** This AMM does not generate swap fees for LPs, meaning the only LP incentive is Conduir's IL protection. In the real world, LPs typically expect fees from every swap transaction.

**What needs to be done (optional):**
- Add a **swap fee** (e.g., 0.3%) distributed to LPs as an additional incentive.
- Or replace it with an existing AMM integration on the target network (e.g., Uniswap V3, Curve, etc.) to be integrated with Conduir.

---

### 🟢 `MockERC20.sol` in `test/mocks/` folder — **Specifically for Testing**

**Status:** Files in the `test/mocks/` folder (such as `MockERC20.sol`) are used **only** for testing purposes and **will not be deployed** to mainnet.

On mainnet, the tokens used will be existing standard ERC-20 tokens (e.g., USDC, WETH, or the project's own governance token).

---

### Contract Status Summary

| Contract | Status | Deployable to Mainnet? |
|---|---|---|
| `Router.sol` | ✅ Production-ready | Yes, noting the one-time setup functions |
| `ConstantAMM.sol` | 🟡 MVP — without swap fees | With consideration |
| `ILVault.sol` | ✅ Production-ready | Yes |
| `ILVoucher.sol` | ✅ Production-ready | Yes |
| `CollateralManager.sol` | ✅ Production-ready | Yes |
| `OracleAdapter.sol` | 🔴 Mock — manual pricing | **No**, must be replaced with an on-chain oracle |
| `test/mocks/MockERC20.sol` | 🔴 Only for test | **No** |

---

## Important Information for Developers

### Token Approval Rules

Before calling any function involving token transfers, users **MUST approve first**:

| Who | Function | Approval Required |
|---|---|---|
| Protocol | `registerProtocol()` | `feeToken.approve(router, listingFee + collateral)` |
| LP | `deposit()` | `tokenA.approve(router, amountA)` and `tokenB.approve(router, amountB)` |
| LP | `withdraw()` | `lpToken.approve(router, lpAmount)` |

---

### Price & Volatility Scale

All prices and volatility use a **1e18 scale**:
- Price $2500 → `2500e18`
- Volatilitas 30% → `0.3e18`

---

### Protocol Tier Thresholds

Tiers are determined automatically during `registerProtocol()` based on the token pair's volatility:

| Volatility | Tier | Impact |
|---|---|---|
| `< 30%` (`< 0.3e18`) | TIER_1 | Lowest collateral requirement |
| `30% - 60%` | TIER_2 | Medium collateral requirement |
| `>= 60%` (`>= 0.6e18`) | TIER_3 | Highest collateral requirement |

---

### LP Lock Duration Limits

- **Minimum:** 7 days (`7 days`)
- **Maximum:** 365 days (`365 days`)

---

### One-Time Functions (Cannot be Modified After Calling)

Several setup functions can only be called **once** and cannot be changed afterwards:

| Contract | Function | Description |
|---|---|---|
| `CollateralManager` | `setAuthorizedCallers()` | Set Router and ILVault — once only |
| `Router` | `setCoreDependencies()` | Set ILVault, CollateralManager, Oracle — once only |
| `ConstantAMM` | `initialize()` | Set token pair and Router — once only |
| `ILVoucher` | Constructor | `ilVault` address is `immutable` — cannot be changed at all |

---

### Warning: replacePool() Can Trap LPs

If the Admin calls `replacePool()` while there are still active LPs in the old pool:
- Those LPs **will not be able to withdraw** because the Router now points to the new AMM contract, while their LP Tokens are from the old AMM.
- Perform manual LP migration before replacing the pool contract.

---

### Warning: IL Voucher is Transferable

The IL Voucher is a standard ERC-20 token. If a Protocol transfers/sells its voucher:
- When an LP wishes to withdraw, the system will attempt to burn the voucher from the original Protocol address.
- Since the Protocol no longer holds the voucher, the transaction will **revert** and the LP will be unable to withdraw.

---

### Solidity Version & Tools

- **Solidity:** `0.8.27`
- **Framework:** [Foundry](https://getfoundry.sh/)
- **Library:** OpenZeppelin Contracts (via `lib/`)

---

*This document was created to help developers thoroughly understand the flow and limitations of the Conduir Protocol system.*
