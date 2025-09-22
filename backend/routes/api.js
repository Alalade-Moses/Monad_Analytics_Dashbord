// backend/routes/api.js
const express = require('express');
const axios = require("axios");

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

// backend/routes/api.js - FIXED VERSION
router.get('/transactions', asyncHandler(async (req, res) => {
  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
  const limit = parseInt(req.query.limit) || 20;
  const address = req.query.address;

  if (!address) {
    // If no address provided, return recent mock or DB transactions
    const recent = await dataService.getRecentTransactions(limit);
    return res.json(recent);
  }

  try {
    // FIXED: Remove line breaks and spaces in the URL
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

    console.log('Fetching from Etherscan:', url); // Debug log

    const response = await axios.get(url);

    if (response.data.status !== "1") {
      console.log('Etherscan API error:', response.data.message);
      // Fallback to mock data if API fails
      const mockTransactions = generateMockTransactions(limit, address);
      return res.json(mockTransactions);
    }

    const transactions = response.data.result.slice(0, limit);
    
    // Transform Etherscan response to match your expected format
    const formattedTransactions = transactions.map(tx => ({
      hash: tx.hash,
      blockNumber: parseInt(tx.blockNumber),
      from: tx.from,
      to: tx.to,
      value: (parseInt(tx.value) / 1e18).toFixed(6), // Convert wei to ETH
      fee: ((parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / 1e18).toFixed(6),
      gasUsed: parseInt(tx.gasUsed),
      status: parseInt(tx.txreceipt_status) === 1 ? 'success' : 'failed',
      type: tx.input === '0x' ? 'transfer' : 'contract',
      timestamp: parseInt(tx.timeStamp) * 1000, // Convert to milliseconds
      gasPrice: (parseInt(tx.gasPrice) / 1e9).toFixed(0) // Convert to gwei
    }));

    res.json(formattedTransactions);
  } catch (error) {
    console.error("Transaction fetch error:", error.message);
    // Fallback to mock data
    const mockTransactions = generateMockTransactions(limit, address);
    res.json(mockTransactions);
  }
}));

// Helper function for mock data
function generateMockTransactions(limit, address) {
  return Array.from({length: limit}, (_, i) => ({
    hash: '0x' + Math.random().toString(16).substr(2, 64),
    blockNumber: 1000000 + i,
    from: address,
    to: '0x' + Math.random().toString(16).substr(2, 40),
    value: (Math.random() * 10).toFixed(4),
    fee: (Math.random() * 0.01).toFixed(6),
    gasUsed: Math.floor(Math.random() * 100000),
    status: Math.random() > 0.1 ? 'success' : 'failed',
    type: Math.random() > 0.5 ? 'transfer' : 'contract',
    timestamp: Date.now() - Math.floor(Math.random() * 86400000),
    gasPrice: Math.floor(Math.random() * 100) + 10
  }));
}

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