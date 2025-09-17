// frontend/js/api.js
class API {
    constructor() {
        this.baseURL = window.location.origin + '/api';
        this.cache = new Map();
        this.cacheTimeout = 30000; // 30 seconds
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    async cachedRequest(endpoint, cacheKey = null) {
        const key = cacheKey || endpoint;
        
        if (this.cache.has(key)) {
            const cached = this.cache.get(key);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const data = await this.request(endpoint);
            this.cache.set(key, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            // Return cached data if available, even if expired
            if (this.cache.has(key)) {
                console.warn('Using expired cache due to API error');
                return this.cache.get(key).data;
            }
            throw error;
        }
    }

    // Network endpoints
    async getNetworkStats() {
        return this.cachedRequest('/network');
    }

    async getNetworkHistory(hours = 24) {
        return this.cachedRequest(`/network/history?hours=${hours}`);
    }

    // Transaction endpoints
    async getTransactions(limit = 20) {
        return this.cachedRequest(`/transactions?limit=${limit}`);
    }

    // Validator endpoints
    async getValidators() {
        return this.cachedRequest('/validators');
    }

    // DApp endpoints
    async getDapps() {
        return this.cachedRequest('/dapps');
    }

    // Dashboard endpoint
    async getDashboardData() {
        return this.cachedRequest('/dashboard');
    }

    // Health check
    async getHealth() {
        return this.request('/health');
    }

    // Utility methods
    formatNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatHash(hash, startLength = 6, endLength = 4) {
        if (!hash || hash.length <= startLength + endLength) return hash;
        return `${hash.substring(0, startLength)}...${hash.slice(-endLength)}`;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // less than 1 minute
            return 'just now';
        }
        if (diff < 3600000) { // less than 1 hour
            return `${Math.floor(diff / 60000)}m ago`;
        }
        if (diff < 86400000) { // less than 1 day
            return `${Math.floor(diff / 3600000)}h ago`;
        }
        
        return date.toLocaleDateString();
    }

    // Error handling utility
    handleError(error, containerSelector, message = 'Failed to load data') {
        console.error('Error:', error);
        const container = document.querySelector(containerSelector);
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }

    // Loading state utility
    showLoading(containerSelector, message = 'Loading...') {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    ${message}
                </div>
            `;
        }
    }

    // Auto refresh utility
    setupAutoRefresh(callback, interval = 30000) {
        // Initial call
        callback();
        
        // Set up interval
        return setInterval(callback, interval);
    }

    // WebSocket connection (for future real-time updates)
    initWebSocket() {
        // Placeholder for WebSocket implementation
        console.log('WebSocket initialization placeholder');
    }
}

// Create global API instance
const api = new API();

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}