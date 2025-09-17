// backend/routes/api.js
const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Network stats endpoints
router.get('/network', asyncHandler(async (req, res) => {
  const stats = await dataService.getLatestNetworkStats();
  if (!stats) {
    return res.status(404).json({ error: 'No network stats available' });
  }
  res.json(stats);
}));

router.get('/network/history', asyncHandler(async (req, res) => {
  const hours = parseInt(req.query.hours) || 24;
  const history = await dataService.getNetworkStatsHistory(hours);
  res.json(history);
}));

// Transactions endpoints
router.get('/transactions', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const transactions = await dataService.getRecentTransactions(limit);
  res.json(transactions);
}));

// Validators endpoints
router.get('/validators', asyncHandler(async (req, res) => {
  const validators = await dataService.getAllValidators();
  res.json(validators);
}));

// DApps endpoints
router.get('/dapps', asyncHandler(async (req, res) => {
  const dapps = await dataService.getAllDapps();
  res.json(dapps);
}));

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Dashboard summary endpoint
router.get('/dashboard', asyncHandler(async (req, res) => {
  const [networkStats, recentTransactions, validators, dapps] = await Promise.all([
    dataService.getLatestNetworkStats(),
    dataService.getRecentTransactions(10),
    dataService.getAllValidators(),
    dataService.getAllDapps()
  ]);

  const summary = {
    network: networkStats,
    recentTransactions,
    topValidators: validators.slice(0, 5),
    topDapps: dapps.slice(0, 5),
    metrics: {
      totalValidators: validators.length,
      totalDapps: dapps.length,
      totalTvl: dapps.reduce((sum, dapp) => sum + dapp.tvl, 0),
      total24hVolume: dapps.reduce((sum, dapp) => sum + dapp.volume24h, 0)
    }
  };

  res.json(summary);
}));

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;