// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const axios = require('axios');
const cron = require('node-cron');
const path = require('path');

const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');
const dataService = require('./services/dataService');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api', apiRoutes);

// Serve frontend routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.get('/transactions', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/transactions.html'));
});

app.get('/validators', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/validators.html'));
});

app.get('/dapps', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dapps.html'));
});

app.get('/network', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/network.html'));
});

// 404 handler
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Initialize data and start cron jobs
const initializeData = async () => {
  console.log('Initializing data...');
  await dataService.updateNetworkStats();
  await dataService.addMockTransactions();
  await dataService.updateValidators();
  await dataService.updateDapps();
  console.log('Initial data loaded');
};

// Schedule periodic data updates
const setupCronJobs = () => {
  // Update network stats every 10 seconds
  cron.schedule('*/10 * * * * *', async () => {
    await dataService.updateNetworkStats();
  });

  // Add new transactions every 5 seconds
  cron.schedule('*/5 * * * * *', async () => {
    await dataService.addMockTransactions();
  });

  // Update validators every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    await dataService.updateValidators();
  });

  // Update dapps every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    await dataService.updateDapps();
  });

  console.log('Cron jobs scheduled');
};

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Monad Analytics Server running on port ${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}`);
  
  // Initialize data after server starts
  setTimeout(async () => {
    await initializeData();
    setupCronJobs();
  }, 2000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;