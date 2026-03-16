# Conduir AI Server

AI-powered backend server for the Conduir DeFi protocol, providing yield prediction APIs using OpenAI GPT-4 or Anthropic Claude.

## Features

- **Yield Prediction API**: Generate APY forecasts for DeFi vaults using AI models
- **Market Data Integration**: Fetch price history from Coingecko API
- **Intelligent Caching**: Reduce API costs with built-in prediction caching
- **Multi-Provider Support**: Works with OpenAI, Anthropic, or mock predictions

## Installation

```bash
cd server
npm install
```

## Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# AI API Keys (optional - server will use mock predictions if not provided)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### GET /api/predictions/yield

Generate yield predictions for default mock vaults.

```bash
curl http://localhost:3001/api/predictions/yield
```

### POST /api/predictions/yield

Generate yield predictions for custom vaults.

```bash
curl -X POST http://localhost:3001/api/predictions/yield \
  -H "Content-Type: application/json" \
  -d '{
    "vaults": [
      {
        "id": "hydra-dot-usdc",
        "protocol": "HydraDX",
        "asset": "DOT",
        "apy": 14.2,
        "capacity": 15000000,
        "utilized": 12400000,
        "riskLevel": "Low"
      }
    ],
    "timeHorizon": "all"
  }'
```

### GET /api/predictions/health

Check AI service status and cache statistics.

```bash
curl http://localhost:3001/api/predictions/health
```

### DELETE /api/predictions/cache

Clear prediction cache.

```bash
# Clear all cache
curl -X DELETE http://localhost:3001/api/predictions/cache

# Clear specific vaults
curl -X DELETE "http://localhost:3001/api/predictions/cache?vaults=[\"hydra-dot-usdc\"]"
```

## Response Format

```json
{
  "predictions": [
    {
      "vaultId": "hydra-dot-usdc",
      "vault": { ... },
      "predictions": {
        "days7": 15.5,
        "days14": 16.2,
        "days30": 17.8
      },
      "confidence": "High",
      "reasoning": "Based on high utilization driving fee generation...",
      "factors": [
        { "factor": "High utilization", "impact": "positive", "weight": 0.3 },
        { "factor": "Low market volatility", "impact": "positive", "weight": 0.25 }
      ],
      "generatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "topRecommendation": { ... },
  "marketSummary": {
    "overallSentiment": "bullish",
    "keyInsights": [
      "Market showing positive momentum across most assets",
      "HydraDX (DOT) shows strongest 30-day outlook at 17.8% predicted APY"
    ]
  },
  "cached": false
}
```

## AI Providers

### OpenAI (GPT-4o)

Uses the `gpt-4o` model for predictions. Requires `OPENAI_API_KEY` environment variable.

### Anthropic (Claude)

Uses the `claude-3-5-sonnet-20241022` model for predictions. Requires `ANTHROPIC_API_KEY` environment variable.

### Mock Mode

When no API keys are provided, the server generates predictions based on:
- Current vault utilization rates
- Historical price volatility
- Market trends from Coingecko data

## Cache Strategy

- Predictions are cached for 5 minutes by default
- Cache is automatically cleaned every 10 minutes
- Manual cache invalidation available via API

## Development

The server is built with:
- Node.js + Express
- TypeScript
- OpenAI SDK / Anthropic SDK
- Coingecko API

## License

MIT
