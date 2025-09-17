document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    
    // Set up auto-refresh every 5 seconds
    setInterval(initDashboard, 5000);
});

async function initDashboard() {
    await updateNetworkStats();
    await updateTransactions();
}

async function updateNetworkStats() {
    const stats = await api.fetchNetworkStats();
    if (stats.length > 0) {
        const latest = stats[0];
        const previous = stats[1] || latest;
        
        // Update stats cards
        document.getElementById('tps-value').textContent = latest.tps.toFixed(2);
        document.getElementById('block-height').textContent = latest.blockHeight.toLocaleString();
        document.getElementById('gas-price').textContent = latest.gasPrice.toFixed(2) + ' Gwei';
        document.getElementById('network-util').textContent = latest.networkUtilization.toFixed(2) + '%';
        
        // Calculate changes
        const tpsChange = ((latest.tps - previous.tps) / previous.tps * 100).toFixed(2);
        const blockChange = latest.blockHeight - previous.blockHeight;
        const gasChange = ((latest.gasPrice - previous.gasPrice) / previous.gasPrice * 100).toFixed(2);
        const utilChange = ((latest.networkUtilization - previous.networkUtilization) / previous.networkUtilization * 100).toFixed(2);
        
        // Update change indicators
        document.getElementById('tps-change').textContent = `${tpsChange >= 0 ? '+' : ''}${tpsChange}%`;
        document.getElementById('tps-change').className = `change ${tpsChange >= 0 ? 'positive' : 'negative'}`;
        
        document.getElementById('block-change').textContent = `+${blockChange}`;
        
        document.getElementById('gas-change').textContent = `${gasChange >= 0 ? '+' : ''}${gasChange}%`;
        document.getElementById('gas-change').className = `change ${gasChange >= 0 ? 'negative' : 'positive'}`;
        
        document.getElementById('util-change').textContent = `${utilChange >= 0 ? '+' : ''}${utilChange}%`;
        document.getElementById('util-change').className = `change ${utilChange >= 0 ? 'positive' : 'negative'}`;
        
        // Prepare chart data
        const recentStats = stats.slice(0, 20).reverse();
        const labels = recentStats.map(stat => {
            const date = new Date(stat.timestamp);
            return date.toLocaleTimeString();
        });
        
        const tpsData = {
            labels: labels,
            values: recentStats.map(stat => stat.tps)
        };
        
        const gasData = {
            labels: labels,
            values: recentStats.map(stat => stat.gasPrice)
        };
        
        // Update charts
        const tpsCtx = document.getElementById('tps-chart').getContext('2d');
        const gasCtx = document.getElementById('gas-chart').getContext('2d');
        
        chartManager.createTPSChart(tpsCtx, tpsData);
        chartManager.createGasChart(gasCtx, gasData);
    }
}

async function updateTransactions() {
    const transactions = await api.fetchTransactions(5);
    const tableBody = document.querySelector('#transactions-table tbody');
    
    tableBody.innerHTML = '';
    
    transactions.forEach(tx => {
        const row = document.createElement('tr');
        
        const hashCell = document.createElement('td');
        hashCell.textContent = `${tx.hash.substring(0, 8)}...${tx.hash.substring(56)}`;
        
        const fromCell = document.createElement('td');
        fromCell.textContent = `${tx.from.substring(0, 8)}...${tx.from.substring(34)}`;
        
        const toCell = document.createElement('td');
        toCell.textContent = `${tx.to.substring(0, 8)}...${tx.to.substring(34)}`;
        
        const valueCell = document.createElement('td');
        valueCell.textContent = tx.value.toFixed(4);
        
        const gasCell = document.createElement('td');
        gasCell.textContent = tx.gas.toLocaleString();
        
        row.appendChild(hashCell);
        row.appendChild(fromCell);
        row.appendChild(toCell);
        row.appendChild(valueCell);
        row.appendChild(gasCell);
        
        tableBody.appendChild(row);
    });
}