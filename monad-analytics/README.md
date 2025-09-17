# Monad Analytics Dashboard

A comprehensive full-stack analytics dashboard for the Monad blockchain ecosystem, providing real-time insights into network performance, validator statistics, transaction flows, and dApp analytics.

![Monad Analytics Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=Monad+Analytics+Dashboard)

## 🚀 Features

### 📊 Real-time Analytics
- Live network monitoring and performance metrics
- Real-time transaction tracking and analysis
- Dynamic validator performance monitoring
- dApp ecosystem insights and TVL tracking

### 📈 Interactive Visualizations
- Network TPS and performance charts
- Gas price trends and block production metrics
- Validator stake distribution and commission rates
- dApp TVL and volume analytics

### 🔍 Advanced Search & Filtering
- Transaction search by hash or address
- Validator filtering and sorting
- dApp categorization and filtering
- Historical data analysis

### 📱 Responsive Design
- Mobile-first responsive layout
- Dark theme with modern UI
- Professional Monad branding
- Accessible and user-friendly interface

## 🏗 Architecture

### Backend (Node.js + Express + MongoDB)
- RESTful API endpoints for all data
- MongoDB with Mongoose for data persistence
- Automated data collection with cron jobs
- Error handling and request validation
- Rate limiting and security middleware

### Frontend (HTML + CSS + JavaScript)
- Pure vanilla JavaScript (no React/Vue)
- Chart.js for interactive visualizations
- Responsive CSS Grid and Flexbox layouts
- Progressive Web App capabilities

### Database Schema
- `NetworkStats`: Network performance metrics
- `Transactions`: Transaction data and history
- `Validators`: Validator information and performance
- `Dapps`: dApp metrics and analytics

## 📋 Requirements

- Node.js 16+ 
- MongoDB 4.4+
- Modern web browser with ES6+ support

## 🛠 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/monad-analytics.git
cd monad-analytics
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas connection string in .env
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/monad_analytics
```

### 4. Start the Application
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 🚀 Deployment

### Deploy to Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Deploy to Render
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

### Deploy to Vercel (Frontend + Serverless Functions)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project root
3. Configure serverless functions for API routes

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Get connection string
3. Add to MONGODB_URI environment variable
4. Configure network access and database user

## 🔧 Configuration

### Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/monad_analytics

# Server
PORT=3000
NODE_ENV=production

# Monad RPC (replace with actual endpoints)
MONAD_RPC_URL=https://rpc.mainnet.monad.xyz
MONAD_WSS_URL=wss://rpc.mainnet.monad.xyz
```

### API Endpoints
- `GET /api/network` - Current network statistics
- `GET /api/network/history` - Historical network data
- `GET /api/transactions` - Recent transactions
- `GET /api/validators` - Validator information
- `GET /api/dapps` - dApp analytics
- `GET /api/dashboard` - Dashboard summary data
- `GET /api/health` - Health check

## 📊 Data Sources

Currently using mock data generators for development. In production, replace with:
- Monad RPC endpoints for network data
- Blockchain indexer for transaction data
- Validator APIs for staking information
- dApp protocols for TVL and volume data

### Integrating Real Data
Replace mock data in `backend/services/dataService.js`:
```javascript
// Replace generateMockNetworkStats() with:
async getNetworkStats() {
  const response = await axios.post(process.env.MONAD_RPC_URL, {
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 1
  });
  // Process real RPC response
}
```

## 🎨 Customization

### Branding
- Update logo in `frontend/assets/`
- Modify color scheme in `frontend/css/style.css`
- Update branding text throughout the application

### Adding New Metrics
1. Update database models in `backend/models/`
2. Add data collection in `backend/services/dataService.js`
3. Create new API endpoints in `backend/routes/api.js`
4. Update frontend to display new data

## 🔐 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting on API endpoints
- Input validation and sanitization
- Environment variable protection

## 📱 Progressive Web App

The dashboard includes PWA features:
- Offline capability with service worker
- Mobile app-like experience
- Push notifications for alerts
- Background sync for data updates

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Integration tests
npm run test:integration
```

## 📈 Performance Optimization

- MongoDB indexing for fast queries
- API response caching
- Frontend asset optimization
- Lazy loading for large datasets
- WebSocket connections for real-time updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Create an issue on GitHub
- Join our Discord community
- Email: support@monad-analytics.com

## 🗺 Roadmap

- [ ] WebSocket real-time updates
- [ ] Advanced analytics and insights
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced validator metrics
- [ ] Portfolio tracking features
- [ ] Alert system and notifications
- [ ] API documentation and SDKs

## 🏆 Acknowledgments

- Monad blockchain team for the amazing L1
- Chart.js for visualization library
- MongoDB team for the database
- Express.js community
- All contributors and supporters

---

**Built with ❤️ for the Monad community**