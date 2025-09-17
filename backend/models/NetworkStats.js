// backend/models/NetworkStats.js
const mongoose = require('mongoose');

const NetworkStatsSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  blockHeight: {
    type: Number,
    required: true
  },
  tps: {
    type: Number,
    required: true
  },
  avgBlockTime: {
    type: Number,
    required: true
  },
  totalTransactions: {
    type: Number,
    required: true
  },
  activeValidators: {
    type: Number,
    required: true
  },
  networkHashrate: {
    type: String,
    required: true
  },
  gasPrice: {
    type: Number,
    required: true
  },
  totalSupply: {
    type: String,
    required: true
  }
});

// Keep only last 7 days of data
NetworkStatsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('NetworkStats', NetworkStatsSchema);