# AI Integration Documentation

## Overview

Conduir's AI integration provides intelligent yield predictions for DeFi vaults, helping treasury users make informed decisions about liquidity provision. The system uses machine learning models to forecast APYs based on market conditions, utilization rates, and historical performance.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React Components                                      │  │
│  │  - AIInsightCard        - PredictedAPYChart           │  │
│  │  - AIRecommendationBadge - DepositFlow enhancements   │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Custom Hooks                                          │  │
│  │  - useAIPredictions    - useAIHealth                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Server                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Express Routes (port 3001)                           │  │
│  │  - GET/POST /api/predictions/yield                    │  │
│  │  - GET     /api/predictions/health                    │  │
│  │  - DELETE  /api/predictions/cache                     │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Services                                              │  │
│  │  - yieldPredictor.ts   (AI integration)              │  │
│  │  - coingecko.ts        (price data)                  │  │
│  │  - predictionCache.ts  (caching layer)               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │ OpenAI   │  │Anthropic │  │Coingecko │
         │   API    │  │   API    │  │   API    │
         └──────────┘  └──────────┘  └──────────┘
```

## Data Flow

1. **Frontend Request**: React component calls `useAIPredictions` hook
2. **API Call**: Request sent to backend `/api/predictions/yield`
3. **Cache Check**: Server checks for cached predictions (5min TTL)
4. **Market Data**: Fetch price history from Coingecko
5. **AI Processing**: Send data to OpenAI/Anthropic for analysis
6. **Response**: Return predictions with confidence scores
7. **Display**: UI components render insights and recommendations

## Frontend Components

### AIInsightCard

Displays AI-generated market insights and recommendations.

```tsx
import { AIInsightCard } from './components/flows';

<AIInsightCard
  marketSummary={aiData.marketSummary}
  topRecommendation={aiData.topRecommendation}
  predictions={aiData.predictions}
/>
```

### PredictedAPYChart

Line chart showing forecasted APY trends over time.

```tsx
import { PredictedAPYChart } from './components/flows';

<PredictedAPYChart
  predictions={aiData.predictions}
  height={220}
/>
```

### AIRecommendationBadge

Visual indicator for AI-recommended vaults.

```tsx
import { AIRecommendationBadge } from './components/flows';

<AIRecommendationBadge
  prediction={aiData.topRecommendation}
  variant="compact"
/>
```

## Hooks

### useAIPredictions

Fetch and manage AI yield predictions.

```tsx
const { data, loading, error, refetch, getTopRecommendation } = useAIPredictions({
  autoFetch: true,
  vaults: mockVaults,
});
```

### useAIHealth

Check if AI services are available.

```tsx
const { isAvailable, loading, mode } = useAIHealth();
```

## Backend Services

### yieldPredictor.ts

Core prediction service handling AI integration.

- `generateYieldPredictions(vaults, marketData)` - Generate predictions
- `generatePredictionResponse(vaults, timeHorizon)` - Full API response
- `isAIAvailable()` - Check AI provider status

### coingecko.ts

Market data service for price history.

- `fetchPriceData(asset)` - Get price data for single asset
- `fetchMultipleAssets(assets)` - Batch fetch for multiple assets
- `calculateVolatility(priceHistory)` - Compute volatility metrics

### predictionCache.ts

In-memory caching layer for predictions.

- `get(vaultIds, timeHorizon)` - Retrieve cached prediction
- `set(vaultIds, data, timeHorizon, ttl)` - Store prediction
- `invalidate(vaultIds)` - Clear specific cache entries

## Configuration

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

### Backend (server/.env)

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## AI Provider Selection

The system automatically selects AI providers based on availability:

1. **Anthropic Claude** (preferred for nuanced analysis)
2. **OpenAI GPT-4o** (fallback)
3. **Mock predictions** (fallback when no API keys)

## Prediction Accuracy

Predictions are based on:

- **Utilization Rate**: Higher utilization → higher fee generation
- **Market Volatility**: Lower volatility → more stable returns
- **Price Momentum**: Positive momentum → increased trading activity
- **Risk Profile**: Lower risk → more conservative predictions

## Caching Strategy

- Default TTL: 5 minutes
- Cache key: Vault IDs + time horizon
- Auto-cleanup: Every 10 minutes
- Manual invalidation via API

## Error Handling

- API failures fall back to mock predictions
- Network errors are logged and don't block UI
- Coingecko failures use mock price data
- AI provider failures gracefully degrade

## Future Enhancements

- **Historical Accuracy Tracking**: Compare predictions vs actual APYs
- **User Feedback**: Allow users to rate prediction quality
- **Custom Models**: Train custom ML models on historical data
- **Real-time Updates**: WebSocket-based price streaming
- **Multi-chain Support**: Extend beyond Polkadot ecosystem

## Security Considerations

- API keys stored in environment variables
- CORS restrictions on API endpoints
- Rate limiting on expensive AI calls
- Input validation on all endpoints
- No sensitive data in cache

## Testing

```bash
# Start backend server
cd server && npm run dev

# Start frontend
npm run dev

# Test health endpoint
curl http://localhost:3001/api/predictions/health

# Test predictions
curl -X POST http://localhost:3001/api/predictions/yield \
  -H "Content-Type: application/json" \
  -d '{"vaults": [{"id": "test", "protocol": "Test", "asset": "DOT", "apy": 10, "capacity": 1000000, "utilized": 500000, "riskLevel": "Low"}]}'
```
