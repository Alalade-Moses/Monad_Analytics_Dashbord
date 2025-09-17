// backend/services/dataService.js
const NetworkStats = require('../models/NetworkStats');
const Transaction = require('../models/Transaction');
const Validator = require('../models/Validator');
const Dapp = require('../models/Dapp');

class DataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }

  // Mock data generators (replace with real RPC calls)
  generateMockNetworkStats() {
    return {
      blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
      tps: Math.floor(Math.random() * 1000) + 100,
      avgBlockTime: (Math.random() * 2 + 1).toFixed(2),
      totalTransactions: Math.floor(Math.random() * 10000000) + 50000000,
      activeValidators: Math.floor(Math.random() * 50) + 100,
      networkHashrate: (Math.random() * 1000 + 500).toFixed(2) + ' TH/s',
      gasPrice: Math.floor(Math.random() * 20) + 5,
      totalSupply: (Math.random() * 100000000 + 1000000000).toFixed(0)
    };
  }

  generateMockTransaction() {
    const isSuccess = Math.random() > 0.1;
    return {
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      blockNumber: Math.floor(Math.random() * 1000) + 5000000,
      from: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      to: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      value: (Math.random() * 1000).toFixed(6),
      gasUsed: Math.floor(Math.random() * 100000) + 21000,
      gasPrice: Math.floor(Math.random() * 50) + 10,
      fee: (Math.random() * 0.01).toFixed(6),
      status: isSuccess ? 'success' : 'failed',
      type: Math.random() > 0.7 ? 'contract' : 'transfer'
    };
  }

  generateMockValidators() {
    const validators = [];
    const names = ['MonadNode1', 'StakePool Alpha', 'Validator Pro', 'ChainGuard', 'BlockMaster', 'CryptoStake', 'NodeRunner', 'ValidatorX'];
    
    for (let i = 0; i < 8; i++) {
      validators.push({
        address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        name: names[i] || `Validator${i+1}`,
        stake: (Math.random() * 10000000 + 1000000).toFixed(0),
        commission: (Math.random() * 10 + 2).toFixed(1),
        uptime: (Math.random() * 5 + 95).toFixed(2),
        blocksProposed: Math.floor(Math.random() * 1000) + 100,
        blocksValidated: Math.floor(Math.random() * 5000) + 1000,
        delegators: Math.floor(Math.random() * 500) + 50,
        apr: (Math.random() * 15 + 5).toFixed(2)
      });
    }
    return validators;
  }

  generateMockDapps() {
    const dapps = [
      { name: 'MonadSwap', category: 'DeFi', description: 'Leading DEX on Monad' },
      { name: 'MonadLend', category: 'DeFi', description: 'Lending and borrowing protocol' },
      { name: 'CryptoQuest', category: 'Gaming', description: 'Adventure RPG game' },
      { name: 'MonadNFTs', category: 'NFT', description: 'NFT marketplace' },
      { name: 'SocialMON', category: 'Social', description: 'Decentralized social platform' }
    ];

    return dapps.map(dapp => ({
      ...dapp,
      contractAddress: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      tvl: Math.floor(Math.random() * 50000000) + 1000000,
      volume24h: Math.floor(Math.random() * 10000000) + 100000,
      users24h: Math.floor(Math.random() * 5000) + 500,
      transactions24h: Math.floor(Math.random() * 50000) + 1000,
      website: `https://${dapp.name.toLowerCase()}.monad.xyz`,
      logo: `/assets/${dapp.name.toLowerCase()}-logo.png`
    }));
  }

  async updateNetworkStats() {
    try {
      const mockData = this.generateMockNetworkStats();
      const networkStats = new NetworkStats(mockData);
      await networkStats.save();
      console.log('Network stats updated');
    } catch (error) {
      console.error('Error updating network stats:', error);
    }
  }

  async addMockTransactions() {
    try {
      const transactions = [];
      for (let i = 0; i < 10; i++) {
        transactions.push(this.generateMockTransaction());
      }
      await Transaction.insertMany(transactions);
      console.log(`Added ${transactions.length} mock transactions`);
    } catch (error) {
      console.error('Error adding transactions:', error);
    }
  }

  async updateValidators() {
    try {
      await Validator.deleteMany({});
      const validators = this.generateMockValidators();
      await Validator.insertMany(validators);
      console.log('Validators updated');
    } catch (error) {
      console.error('Error updating validators:', error);
    }
  }

  async updateDapps() {
    try {
      await Dapp.deleteMany({});
      const dapps = this.generateMockDapps();
      await Dapp.insertMany(dapps);
      console.log('DApps updated');
    } catch (error) {
      console.error('Error updating dapps:', error);
    }
  }

  async getLatestNetworkStats() {
    const cacheKey = 'latest_network_stats';
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const stats = await NetworkStats.findOne().sort({ timestamp: -1 });
      this.cache.set(cacheKey, { data: stats, timestamp: Date.now() });
      return stats;
    } catch (error) {
      console.error('Error fetching network stats:', error);
      throw error;
    }
  }

  async getRecentTransactions(limit = 20) {
    try {
      return await Transaction.find()
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async getAllValidators() {
    try {
      return await Validator.find({ isActive: true })
        .sort({ stake: -1 });
    } catch (error) {
      console.error('Error fetching validators:', error);
      throw error;
    }
  }

  async getAllDapps() {
    try {
      return await Dapp.find({ isActive: true })
        .sort({ tvl: -1 });
    } catch (error) {
      console.error('Error fetching dapps:', error);
      throw error;
    }
  }

  async getNetworkStatsHistory(hours = 24) {
    try {
      const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
      return await NetworkStats.find({ 
        timestamp: { $gte: startTime } 
      }).sort({ timestamp: 1 });
    } catch (error) {
      console.error('Error fetching network stats history:', error);
      throw error;
    }
  }
}

module.exports = new DataService();