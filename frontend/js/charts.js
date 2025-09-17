// frontend/js/charts.js
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cbd5e1',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(75, 85, 99, 0.3)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        maxTicksLimit: 10
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(75, 85, 99, 0.3)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af'
                    },
                    beginAtZero: true
                }
            },
            elements: {
                point: {
                    radius: 3,
                    hoverRadius: 6
                },
                line: {
                    tension: 0.4,
                    borderWidth: 2
                }
            }
        };

        this.colors = {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4'
        };
    }

    createLineChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error(`Canvas with id ${canvasId} not found`);
            return null;
        }

        const chartOptions = {
            ...this.defaultOptions,
            ...options,
            type: 'line'
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: chartOptions
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    createBarChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error(`Canvas with id ${canvasId} not found`);
            return null;
        }

        const chartOptions = {
            ...this.defaultOptions,
            ...options,
            type: 'bar'
        };

        const chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: chartOptions
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    createDoughnutChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error(`Canvas with id ${canvasId} not found`);
            return null;
        }

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#cbd5e1',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            ...options
        };

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: chartOptions
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    updateChart(canvasId, newData, newLabels = null) {
        const chart = this.charts.get(canvasId);
        if (!chart) {
            console.error(`Chart with id ${canvasId} not found`);
            return;
        }

        if (newLabels) {
            chart.data.labels = newLabels;
        }

        if (Array.isArray(newData)) {
            // Single dataset
            chart.data.datasets[0].data = newData;
        } else if (newData.datasets) {
            // Multiple datasets
            chart.data.datasets = newData.datasets;
        }

        chart.update();
    }

    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
        }
    }

    destroyAllCharts() {
        this.charts.forEach((chart, canvasId) => {
            chart.destroy();
        });
        this.charts.clear();
    }

    // Utility methods for common chart configurations
    createTpsChart(canvasId, data, labels) {
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'TPS',
                data: data,
                borderColor: this.colors.primary,
                backgroundColor: this.colors.primary + '20',
                fill: true,
                tension: 0.4
            }]
        };

        return this.createLineChart(canvasId, chartData, {
            plugins: {
                legend: { display: false }
            }
        });
    }

    createGasPriceChart(canvasId, data, labels) {
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Gas Price (gwei)',
                data: data,
                borderColor: this.colors.secondary,
                backgroundColor: this.colors.secondary + '20',
                fill: true,
                tension: 0.4
            }]
        };

        return this.createLineChart(canvasId, chartData, {
            plugins: {
                legend: { display: false }
            }
        });
    }

    createValidatorChart(canvasId, names, stakes) {
        const chartData = {
            labels: names,
            datasets: [{
                label: 'Stake Amount',
                data: stakes,
                backgroundColor: [
                    this.colors.primary,
                    this.colors.secondary,
                    this.colors.success,
                    this.colors.warning,
                    this.colors.info
                ]
            }]
        };

        return this.createDoughnutChart(canvasId, chartData);
    }

    createVolumeChart(canvasId, data, labels) {
        const chartData = {
            labels: labels,
            datasets: [{
                label: '24h Volume',
                data: data,
                backgroundColor: this.colors.success + '80',
                borderColor: this.colors.success,
                borderWidth: 1
            }]
        };

        return this.createBarChart(canvasId, chartData, {
            plugins: {
                legend: { display: false }
            }
        });
    }

    createTvlChart(canvasId, data, labels) {
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'TVL ($)',
                data: data,
                borderColor: this.colors.warning,
                backgroundColor: this.colors.warning + '20',
                fill: true,
                tension: 0.4
            }]
        };

        return this.createLineChart(canvasId, chartData, {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    ...this.defaultOptions.scales.y,
                    ticks: {
                        color: '#9ca3af',
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        });
    }

    // Animation helpers
    animateValue(element, start, end, duration = 2000) {
        if (!element) return;

        const startTimestamp = performance.now();
        const step = (timestamp) => {
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }

    // Chart theme configuration
    setDarkTheme() {
        Chart.defaults.color = '#cbd5e1';
        Chart.defaults.borderColor = 'rgba(75, 85, 99, 0.3)';
        Chart.defaults.backgroundColor = 'rgba(99, 102, 241, 0.1)';
    }

    // Export chart as image
    exportChart(canvasId, filename = 'chart.png') {
        const chart = this.charts.get(canvasId);
        if (!chart) {
            console.error(`Chart with id ${canvasId} not found`);
            return;
        }

        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    }
}

// Initialize chart manager
const chartManager = new ChartManager();

// Set dark theme by default
chartManager.setDarkTheme();

// Export for global use
window.chartManager = chartManager;