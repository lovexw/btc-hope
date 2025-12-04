let priceData = [];
let portfolioChart = null;
let priceChart = null;

async function loadData() {
    try {
        const response = await fetch('btc-price 2015-2025.csv');
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        priceData = lines.slice(1).map(line => {
            const [date, price] = line.split(',');
            return {
                date: date.trim(),
                price: parseFloat(price)
            };
        }).filter(item => item.date && !isNaN(item.price));
        
        console.log(`Loaded ${priceData.length} data points`);
        initializeDateInputs();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('数据加载失败，请刷新页面重试');
    }
}

function initializeDateInputs() {
    if (priceData.length === 0) return;
    
    const sortedData = [...priceData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const minDate = sortedData[0].date;
    const maxDate = sortedData[sortedData.length - 1].date;
    
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    startDateInput.min = minDate;
    startDateInput.max = maxDate;
    
    endDateInput.min = minDate;
    endDateInput.max = maxDate;
    
    const defaultStart = new Date(maxDate);
    defaultStart.setFullYear(defaultStart.getFullYear() - 5);
    const defaultStartStr = defaultStart.toISOString().split('T')[0];
    
    if (new Date(defaultStartStr) >= new Date(minDate)) {
        startDateInput.value = defaultStartStr;
    } else {
        startDateInput.value = minDate;
    }
    
    endDateInput.value = maxDate;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatPercent(value) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

function formatNumber(value, decimals = 2) {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function createResultCard(result) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const profitClass = result.profit >= 0 ? 'positive' : 'negative';
    
    card.innerHTML = `
        <div class="result-strategy-name">${result.name}</div>
        <div class="result-metrics">
            <div class="result-metric">
                <span class="result-metric-label">初始投资</span>
                <span class="result-metric-value">${formatCurrency(result.totalInvested)}</span>
            </div>
            <div class="result-metric">
                <span class="result-metric-label">最终价值</span>
                <span class="result-metric-value ${profitClass}">${formatCurrency(result.finalValue)}</span>
            </div>
            <div class="result-metric">
                <span class="result-metric-label">收益金额</span>
                <span class="result-metric-value ${profitClass}">${formatCurrency(result.profit)}</span>
            </div>
            <div class="result-metric">
                <span class="result-metric-label">收益率</span>
                <span class="result-metric-value ${profitClass}">${formatPercent(result.profitPercent)}</span>
            </div>
            <div class="result-metric">
                <span class="result-metric-label">持有BTC</span>
                <span class="result-metric-value">${formatNumber(result.btcAmount, 4)}</span>
            </div>
            <div class="result-metric">
                <span class="result-metric-label">交易次数</span>
                <span class="result-metric-value">${result.trades}</span>
            </div>
        </div>
        <p style="margin-top: 12px; color: var(--text-secondary); font-size: 0.9rem;">${result.description}</p>
    `;
    
    return card;
}

function createPortfolioChart(results) {
    const ctx = document.getElementById('portfolioChart');
    
    // Properly destroy existing chart if it exists
    if (portfolioChart) {
        portfolioChart.destroy();
        portfolioChart = null;
    }
    
    const colors = [
        '#f7931a',
        '#4a90e2',
        '#10b981',
        '#f59e0b',
        '#8b5cf6',
        '#ec4899'
    ];
    
    const datasets = results.map((result, index) => ({
        label: result.name,
        data: result.history.map(h => ({
            x: h.date,
            y: h.value
        })),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4
    }));
    
    portfolioChart = new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(247, 147, 26, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'MMM yyyy'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function createPriceChart(data) {
    const ctx = document.getElementById('priceChart');
    
    // Properly destroy existing chart if it exists
    if (priceChart) {
        priceChart.destroy();
        priceChart = null;
    }
    
    const chartData = data.map(item => ({
        x: item.date,
        y: item.price
    }));
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'BTC Price (USD)',
                data: chartData,
                borderColor: '#f7931a',
                backgroundColor: 'rgba(247, 147, 26, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(247, 147, 26, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'Price: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'MMM yyyy'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                },
                y: {
                    type: 'logarithmic',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function runBacktest() {
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const dcaAmount = parseFloat(document.getElementById('dcaAmount').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!initialInvestment || initialInvestment <= 0) {
        alert('请输入有效的初始投资金额');
        return;
    }
    
    if (!startDate || !endDate) {
        alert('请选择开始和结束日期');
        return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
        alert('结束日期必须晚于开始日期');
        return;
    }
    
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    
    setTimeout(() => {
        try {
            const backtest = new StrategyBacktest(
                priceData,
                initialInvestment,
                dcaAmount,
                startDate,
                endDate
            );
            
            const results = [];
            
            if (document.getElementById('strategy-hodl').checked) {
                const result = backtest.hodlStrategy();
                if (result) results.push(result);
            }
            
            if (document.getElementById('strategy-dca').checked) {
                const result = backtest.dcaStrategy();
                if (result) results.push(result);
            }
            
            if (document.getElementById('strategy-sell-high').checked) {
                const result = backtest.sellHighStrategy();
                if (result) results.push(result);
            }
            
            if (document.getElementById('strategy-buy-dip').checked) {
                const result = backtest.buyDipStrategy();
                if (result) results.push(result);
            }
            
            if (document.getElementById('strategy-grid').checked) {
                const result = backtest.gridTradingStrategy();
                if (result) results.push(result);
            }
            
            if (document.getElementById('strategy-ma-cross').checked) {
                const result = backtest.movingAverageCrossStrategy();
                if (result) results.push(result);
            }
            
            if (results.length === 0) {
                alert('请至少选择一个策略');
                document.getElementById('loadingIndicator').style.display = 'none';
                return;
            }
            
            displayResults(results, backtest);
            
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'block';
            
            document.getElementById('resultsSection').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        } catch (error) {
            console.error('Backtest error:', error);
            alert('回测计算出错: ' + error.message);
            document.getElementById('loadingIndicator').style.display = 'none';
        }
    }, 500);
}

function displayResults(results, backtest) {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    
    results.sort((a, b) => b.profitPercent - a.profitPercent);
    
    results.forEach(result => {
        const card = createResultCard(result);
        resultsGrid.appendChild(card);
    });
    
    createPortfolioChart(results);
    createPriceChart(backtest.filteredData);
}

function analyzeCustomTarget() {
    const targetYears = parseInt(document.getElementById('targetYears').value);
    const targetReturn = parseInt(document.getElementById('targetReturn').value);
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!initialInvestment || initialInvestment <= 0) {
        alert('请输入有效的初始投资金额');
        return;
    }
    
    const backtest = new StrategyBacktest(
        priceData,
        initialInvestment,
        0,
        startDate,
        endDate
    );
    
    const analysis = backtest.analyzeCustomTarget(targetYears, targetReturn);
    
    if (!analysis) {
        alert('分析失败，请检查日期范围');
        return;
    }
    
    displayCustomAnalysis(analysis);
    
    document.getElementById('customResults').style.display = 'block';
    document.getElementById('customResults').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function displayCustomAnalysis(analysis) {
    const content = document.getElementById('customAnalysisContent');
    
    const feasibilityEmoji = {
        'high': '✅',
        'medium': '⚠️',
        'low': '❌'
    };
    
    content.innerHTML = `
        <div class="feasibility-indicator ${analysis.feasibility}">
            <span>${feasibilityEmoji[analysis.feasibility]}</span>
            <span>可行性: ${analysis.feasibilityText}</span>
        </div>
        
        <div class="analysis-details">
            <h3>目标设定</h3>
            <p>• 投资年限: ${analysis.targetYears} 年</p>
            <p>• 目标年化收益率: ${analysis.targetReturn}%</p>
            <p>• 初始投资: ${formatCurrency(analysis.targetFinalValue / Math.pow(1 + analysis.targetReturn / 100, analysis.targetYears))}</p>
            <p>• 预期最终价值: ${formatCurrency(analysis.targetFinalValue)}</p>
            <p>• 需要BTC价格达到: ${formatCurrency(analysis.requiredEndPrice)}</p>
        </div>
        
        <div class="analysis-details">
            <h3>历史数据对比 (${analysis.actualYears.toFixed(1)} 年)</h3>
            <p>• 起始价格: ${formatCurrency(analysis.startPrice)}</p>
            <p>• 结束价格: ${formatCurrency(analysis.endPrice)}</p>
            <p>• 期间最高价: ${formatCurrency(analysis.highestPrice)}</p>
            <p>• 实际年化收益率: <strong>${analysis.actualAnnualReturn.toFixed(2)}%</strong></p>
            <p>• 最佳年化收益率 (峰值): <strong>${analysis.bestAnnualReturn.toFixed(2)}%</strong></p>
        </div>
        
        <div class="analysis-details">
            <h3>可行性分析</h3>
            ${getFeasibilityAnalysisText(analysis)}
        </div>
    `;
}

function getFeasibilityAnalysisText(analysis) {
    if (analysis.feasibility === 'high') {
        return `
            <p>✅ <strong>高可行性</strong>：您的目标年化收益率 ${analysis.targetReturn}% 在历史数据中已经实现。</p>
            <p>• 在所选时间段内，实际年化收益率达到了 ${analysis.actualAnnualReturn.toFixed(2)}%，超过了您的目标。</p>
            <p>• 这说明通过简单的持有策略（HODL）就有可能实现您的目标。</p>
            <p>• 建议：可以考虑定投策略来平滑风险，或者设定更激进的目标。</p>
        `;
    } else if (analysis.feasibility === 'medium') {
        return `
            <p>⚠️ <strong>中等可行性</strong>：您的目标具有一定挑战性，但在历史峰值期间曾经达到过。</p>
            <p>• 实际年化收益率为 ${analysis.actualAnnualReturn.toFixed(2)}%，但历史峰值时期达到了 ${analysis.bestAnnualReturn.toFixed(2)}%。</p>
            <p>• 您的目标 ${analysis.targetReturn}% 介于两者之间，需要在合适的时机获利了结。</p>
            <p>• 建议：采用高抛策略，在价格达到目标时分批卖出；或使用网格交易来获取波动收益。</p>
        `;
    } else {
        return `
            <p>❌ <strong>低可行性</strong>：您的目标年化收益率 ${analysis.targetReturn}% 超过了历史最佳表现。</p>
            <p>• 历史最佳年化收益率为 ${analysis.bestAnnualReturn.toFixed(2)}%，您的目标明显更高。</p>
            <p>• 这要求BTC价格达到 ${formatCurrency(analysis.requiredEndPrice)}，这在当前数据范围内未曾出现。</p>
            <p>• 建议：</p>
            <p>&nbsp;&nbsp;1. 调整预期，设定更现实的目标（如 ${Math.floor(analysis.bestAnnualReturn * 0.8)}% - ${Math.floor(analysis.bestAnnualReturn)}%）</p>
            <p>&nbsp;&nbsp;2. 延长投资时间，让复利发挥更大作用</p>
            <p>&nbsp;&nbsp;3. 考虑加入定投来降低平均成本</p>
            <p>&nbsp;&nbsp;4. 接受更高风险，使用杠杆或期货（不推荐新手）</p>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    document.getElementById('calculateBtn').addEventListener('click', runBacktest);
    document.getElementById('analyzeCustom').addEventListener('click', analyzeCustomTarget);
    
    const targetYearsInput = document.getElementById('targetYears');
    const targetYearsValue = document.getElementById('targetYearsValue');
    targetYearsInput.addEventListener('input', (e) => {
        targetYearsValue.textContent = `${e.target.value} 年`;
    });
    
    const targetReturnInput = document.getElementById('targetReturn');
    const targetReturnValue = document.getElementById('targetReturnValue');
    targetReturnInput.addEventListener('input', (e) => {
        targetReturnValue.textContent = `${e.target.value}%`;
    });
});
