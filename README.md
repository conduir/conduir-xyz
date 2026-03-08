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

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **AI Integration:** Google Gemini AI
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
# Copy the example file
cp .env.example .env.local
```

Then add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
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
