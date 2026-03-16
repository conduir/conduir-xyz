import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import predictionsRouter from './routes/predictions.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/predictions', predictionsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Conduir AI Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      predictions: {
        getYield: 'GET /api/predictions/yield?vaults=[...]',
        postYield: 'POST /api/predictions/yield',
        health: 'GET /api/predictions/health',
        clearCache: 'DELETE /api/predictions/cache',
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  Conduir AI Server                                     ║
║  Version: 1.0.0                                        ║
║  Port: ${PORT}                                            ║
║  Environment: ${process.env.NODE_ENV || 'development'}                              ║
╠════════════════════════════════════════════════════════╣
║  AI Services:                                          ║
║    OpenAI: ${process.env.OPENAI_API_KEY ? '✓ Configured' : '✗ Not configured'}                        ║
║    Anthropic: ${process.env.ANTHROPIC_API_KEY ? '✓ Configured' : '✗ Not configured'}                    ║
╚════════════════════════════════════════════════════════╝
  `);
});
