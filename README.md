<div align="center">

# Conduir

**Institutional liquidity infrastructure for the Polkadot Hub**

Separating Impermanent Loss risk from liquidity provision — enabling DAO Treasuries to earn protected yield and protocols to secure stable, non-mercenary liquidity.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

</div>

## Overview

Conduir is a DeFi liquidity protocol that introduces a novel approach to liquidity provision by decoupling Impermanent Loss (IL) risk from the underlying liquidity. This architecture allows:

- **DAO Treasuries** to earn yield on their assets without exposure to IL risk
- **Protocols** to secure stable, long-term liquidity without mercenary capital dynamics
- **Market Makers** to underwrite IL risk in exchange for predictable premiums

## Key Features

### DAO Treasury Vaults
Permissionless vaults where DAOs can deposit assets to earn yield from LP fees while IL risk is transferred to underwriters via IL Vouchers.

### Protocol Underwriting
Protocols and market makers can underwrite IL risk by purchasing IL Vouchers, earning premium yields in exchange for bearing calibrated risk exposures.

### IL Vouchers
Tokenized risk instruments that represent the right to claim impermanent loss from liquidity positions. These create a secondary market for IL risk.

## Protocol Flows

### Flow 1: LP Deposit & Vault Matching

The DAO Treasury deposit flow enables capital providers to earn yield without IL exposure.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LP Deposit & Vault Matching                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. DAO Treasury Action                                                       │
│     ┌──────────────────┐                                                      │
│     │ Deposit Single-  │ → Single-asset (e.g., DOT) or dual-asset deposit    │
│     │ Sided Liquidity  │   via Vault Router                                  │
│     └──────────────────┘                                                      │
│            ↓                                                                  │
│  2. Matching Engine                                                           │
│     ┌──────────────────┐                                                      │
│     │ Route to Protocol │ → Algorithmically matches to highest-APY vault     │
│     │ Vault with APY   │   with available capacity                           │
│     └──────────────────┘                                                      │
│            ↓                                                                  │
│  3. Receipt Tokens                                                            │
│     ┌──────────────────┐                                                      │
│     │ Mint Vault       │ → DAO receives ERC-20 receipt tokens representing   │
│     │ Receipt Tokens   │   their claim on liquidity + yield                  │
│     └──────────────────┘                                                      │
│            ↓                                                                  │
│  4. IL Protection                                                             │
│     ┌──────────────────┐                                                      │
│     │ IL Covered by    │ → Any IL incurred is covered by protocol collateral │
│     │ Protocol ILV     │   (not the LP)                                      │
│     └──────────────────┘                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Mechanics:**
- Vault Router automatically routes deposits to vaults with the best yield/capacity ratio
- Receipt tokens are minted 1:1 with deposited value
- IL protection is enforced at the smart contract level—LPs cannot bear IL risk

---

### Flow 2: IL Voucher Lifecycle

The IL Voucher (ILV) is the core risk transfer instrument that enables protocols to underwrite IL.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           IL Voucher Lifecycle                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Protocol Registration                                                     │
│     ┌──────────────────┐                                                      │
│     │ Register Vault & │ → Protocol selects target pair (e.g., DOT/USDC)    │
│     │ Pay Listing Fee  │   and pays listing fee to Fee Splitter             │
│     └──────────────────┘                                                      │
│            ↓                                                                  │
│  2. Collateral Deposit                                                        │
│     ┌──────────────────┐                                                      │
│     │ Deposit Native   │ → Protocol locks native tokens as collateral for    │
│     │ Token Collateral │   potential IL payouts                              │
│     └──────────────────┘                                                      │
│            ↓                                                                  │
│  3. IL Voucher Minting                                                        │
│     ┌──────────────────┐                                                      │
│     │ Mint ERC-20 ILV  │ → Conduir mints ILV tokens representing the         │
│     │ Tokens           │   underwritten risk exposure                        │
│     └──────────────────┘                                                      │
│            ↓                                                                  │
│  4. Voucher States                                                            │
│     ┌──────────────────┐                                                      │
│     │ • Active         │ → Currently covering IL for an active vault         │
│     │ • Redeemed       │ → IL occurred, voucher used to claim collateral     │
│     │ • Expired        │ → Vault period ended, no IL occurred                │
│     │ • Traded         │ → Sold on secondary market to another underwriter   │
│     └──────────────────┘                                                      │
│            ↓                                                                  │
│  5. IL Event & Settlement                                                     │
│     ┌──────────────────┐                                                      │
│     │ Oracle Reports IL │ → Price oracle (Chainlink/Pyth) reports IL amount  │
│     │ → Burn ILV       │ → Corresponding ILV tokens are burned              │
│     │ → Payout to LP   │ → Collateral is transferred to cover LP's IL        │
│     └──────────────────┘                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Mechanics:**
- ILV tokens are ERC-20 compliant and can be traded on secondary markets
- Collateral requirements are calculated based on historical IL volatility
- Price oracles (Chainlink, Pyth) provide tamper-proof IL calculations

---

### Flow 3: Fee Collection Mechanism (Hybrid)

Conduir employs a hybrid fee model to align protocol sustainability with DAO affordability.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Fee Collection Mechanism (Hybrid)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Listing Fee Breakdown                                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Total Fee: 2,500 USDC (example)                                     │   │
│  │                                                                       │   │
│  │  ┌─────────────────┐  ┌─────────────────┐                            │   │
│  │  │   40% Upfront   │  │   60% Accrued   │                            │   │
│  │  │    1,000 USDC   │  │    1,500 USDC   │                            │   │
│  │  └─────────────────┘  └─────────────────┘                            │   │
│  │        ↓                    ↓                                       │   │
│  │  Immediate to DAO    Earned over time                            │   │
│  │  treasury             via trading fees                            │   │
│  │                        (vested linearly)                          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Fee Distribution Flow                                                        │
│                                                                              │
│  Protocol Pays Listing Fee                                                    │
│       ↓                                                                      │
│  ┌─────────────────┐                                                         │
│  │ Fee Splitter    │                                                         │
│  │ Smart Contract  │                                                         │
│  └─────────────────┘                                                         │
│       ↓                                                                      │
│  ┌────────────────┬────────────────┐                                         │
│  ▼                ▼                ▼                                         │
│ 40%              60%               Residual                                   │
│ Upfront          Accrued           (returned to                              │
│                                   protocol after vault                         │
│ Distributed      Vested            expiration)                                │
│ to DAO                                                      │
│ treasury                                                                 │
│                                                                              │
│  Trading Fee Revenue (Ongoing)                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  LP Trading Fees Generated ─→ Fee Splitter ──→ DAO Treasury          │    │
│  │                                                                       │    │
│  │  • LPs receive 100% of trading fees                                   │    │
│  │  • Protocol's 60% accrued portion is subtracted from this flow       │    │
│  │  • Net effect: DAO earns ~40% of gross trading fees                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Fee Structure:**

| Fee Type | Amount | Timing | Recipient |
|----------|--------|--------|-----------|
| Upfront | 40% of listing fee | Immediate | DAO Treasury |
| Accrued | 60% of listing fee | Linear vesting | DAO Treasury (from trading fees) |
| Trading Fees | 100% of AMM fees | Continuous | LPs (then 60% diverted to DAO until accrued) |
| Residual | Remaining accrued | At vault expiry | Returned to Protocol |

**Key Mechanics:**
- The 40/60 split balances immediate DAO revenue with long-term protocol alignment
- If the vault closes without IL events, the protocol receives residual collateral
- Fee Splitter contract enforces transparent, auditable distribution

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **Backend:** Express with better-sqlite3

## Project Structure

```
conduir-xyz/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # External library integrations
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript type definitions
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# No environment variables required
```

### Running Locally

```bash
# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript type checking
npm run lint

# Clean build artifacts
npm run clean
```

The app will be available at `http://localhost:3000`

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clear, concise commit messages
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure TypeScript builds without errors

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## About Conduir

Conduir is built for the Polkadot Hub ecosystem, bringing institutional-grade liquidity infrastructure to decentralized finance. By separating yield from risk, we enable new economic arrangements that benefit all participants in the liquidity ecosystem.

---

**Built with ❤️ for the Polkadot ecosystem**
