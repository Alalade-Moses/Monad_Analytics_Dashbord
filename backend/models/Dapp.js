// backend/models/Dapp.js
const mongoose = require('mongoose');

const DappSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['DeFi', 'Gaming', 'NFT', 'Infrastructure', 'Social', 'Other']
  },
  contractAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  tvl: {
    type: Number,
    default: 0
  },
  volume24h: {
    type: Number,
    default: 0
  },
  users24h: {
    type: Number,
    default: 0
  },
  transactions24h: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Dapp', DappSchema);