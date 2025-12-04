class StrategyBacktest {
    constructor(priceData, initialInvestment, dcaAmount, startDate, endDate) {
        this.priceData = priceData;
        this.initialInvestment = initialInvestment;
        this.dcaAmount = dcaAmount;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        
        this.filteredData = this.filterDataByDateRange();
    }

    filterDataByDateRange() {
        return this.priceData.filter(item => {
            const date = new Date(item.date);
            return date >= this.startDate && date <= this.endDate;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    hodlStrategy() {
        if (this.filteredData.length === 0) return null;
        
        const startPrice = this.filteredData[0].price;
        const endPrice = this.filteredData[this.filteredData.length - 1].price;
        const btcAmount = this.initialInvestment / startPrice;
        const finalValue = btcAmount * endPrice;
        const profit = finalValue - this.initialInvestment;
        const profitPercent = ((finalValue / this.initialInvestment - 1) * 100);
        
        const history = this.filteredData.map(item => ({
            date: item.date,
            value: btcAmount * item.price
        }));
        
        return {
            name: 'HODL 持有策略',
            finalValue,
            profit,
            profitPercent,
            totalInvested: this.initialInvestment,
            btcAmount,
            history,
            trades: 1,
            description: '一次性买入并持有到结束'
        };
    }

    dcaStrategy() {
        if (this.filteredData.length === 0) return null;
        
        let totalInvested = this.initialInvestment;
        let btcAmount = this.initialInvestment / this.filteredData[0].price;
        let lastBuyMonth = new Date(this.filteredData[0].date).getMonth();
        let trades = 1;
        
        const history = [];
        
        for (let i = 0; i < this.filteredData.length; i++) {
            const item = this.filteredData[i];
            const currentDate = new Date(item.date);
            const currentMonth = currentDate.getMonth();
            
            if (currentMonth !== lastBuyMonth && this.dcaAmount > 0) {
                btcAmount += this.dcaAmount / item.price;
                totalInvested += this.dcaAmount;
                lastBuyMonth = currentMonth;
                trades++;
            }
            
            history.push({
                date: item.date,
                value: btcAmount * item.price
            });
        }
        
        const endPrice = this.filteredData[this.filteredData.length - 1].price;
        const finalValue = btcAmount * endPrice;
        const profit = finalValue - totalInvested;
        const profitPercent = ((finalValue / totalInvested - 1) * 100);
        
        return {
            name: '定投策略 (DCA)',
            finalValue,
            profit,
            profitPercent,
            totalInvested,
            btcAmount,
            history,
            trades,
            description: `每月定投 $${this.dcaAmount.toFixed(0)}`
        };
    }

    sellHighStrategy() {
        if (this.filteredData.length === 0) return null;
        
        let cash = 0;
        let btcAmount = this.initialInvestment / this.filteredData[0].price;
        let totalInvested = this.initialInvestment;
        let lastBuyPrice = this.filteredData[0].price;
        let trades = 1;
        
        const sellThreshold = 0.30;
        const sellPercentage = 0.50;
        
        const history = [];
        
        for (let i = 1; i < this.filteredData.length; i++) {
            const item = this.filteredData[i];
            const priceChange = (item.price - lastBuyPrice) / lastBuyPrice;
            
            if (priceChange >= sellThreshold && btcAmount > 0) {
                const sellAmount = btcAmount * sellPercentage;
                cash += sellAmount * item.price;
                btcAmount -= sellAmount;
                trades++;
            }
            
            history.push({
                date: item.date,
                value: btcAmount * item.price + cash
            });
        }
        
        const endPrice = this.filteredData[this.filteredData.length - 1].price;
        const finalValue = btcAmount * endPrice + cash;
        const profit = finalValue - totalInvested;
        const profitPercent = ((finalValue / totalInvested - 1) * 100);
        
        return {
            name: '高抛策略',
            finalValue,
            profit,
            profitPercent,
            totalInvested,
            btcAmount,
            cash,
            history,
            trades,
            description: `涨幅 ${sellThreshold * 100}% 时卖出 ${sellPercentage * 100}%`
        };
    }

    buyDipStrategy() {
        if (this.filteredData.length === 0) return null;
        
        let cash = this.initialInvestment;
        let btcAmount = 0;
        let totalInvested = this.initialInvestment;
        let highestPrice = this.filteredData[0].price;
        let trades = 0;
        
        const dipThreshold = 0.20;
        const buyPercentage = 0.30;
        
        const history = [];
        
        for (let i = 0; i < this.filteredData.length; i++) {
            const item = this.filteredData[i];
            
            if (item.price > highestPrice) {
                highestPrice = item.price;
            }
            
            const priceChange = (item.price - highestPrice) / highestPrice;
            
            if (priceChange <= -dipThreshold && cash > 0) {
                const buyAmount = cash * buyPercentage;
                btcAmount += buyAmount / item.price;
                cash -= buyAmount;
                trades++;
            }
            
            history.push({
                date: item.date,
                value: btcAmount * item.price + cash
            });
        }
        
        const endPrice = this.filteredData[this.filteredData.length - 1].price;
        const finalValue = btcAmount * endPrice + cash;
        const profit = finalValue - totalInvested;
        const profitPercent = ((finalValue / totalInvested - 1) * 100);
        
        return {
            name: '低吸策略',
            finalValue,
            profit,
            profitPercent,
            totalInvested,
            btcAmount,
            cash,
            history,
            trades,
            description: `跌幅 ${dipThreshold * 100}% 时买入 ${buyPercentage * 100}% 仓位`
        };
    }

    gridTradingStrategy() {
        if (this.filteredData.length === 0) return null;
        
        let cash = this.initialInvestment * 0.5;
        let btcAmount = (this.initialInvestment * 0.5) / this.filteredData[0].price;
        let totalInvested = this.initialInvestment;
        let lastActionPrice = this.filteredData[0].price;
        let trades = 1;
        
        const gridPercentage = 0.10;
        const tradePercentage = 0.20;
        
        const history = [];
        
        for (let i = 1; i < this.filteredData.length; i++) {
            const item = this.filteredData[i];
            const priceChange = (item.price - lastActionPrice) / lastActionPrice;
            
            if (priceChange >= gridPercentage && btcAmount > 0) {
                const sellAmount = btcAmount * tradePercentage;
                cash += sellAmount * item.price;
                btcAmount -= sellAmount;
                lastActionPrice = item.price;
                trades++;
            } else if (priceChange <= -gridPercentage && cash > 0) {
                const buyAmount = cash * tradePercentage;
                btcAmount += buyAmount / item.price;
                cash -= buyAmount;
                lastActionPrice = item.price;
                trades++;
            }
            
            history.push({
                date: item.date,
                value: btcAmount * item.price + cash
            });
        }
        
        const endPrice = this.filteredData[this.filteredData.length - 1].price;
        const finalValue = btcAmount * endPrice + cash;
        const profit = finalValue - totalInvested;
        const profitPercent = ((finalValue / totalInvested - 1) * 100);
        
        return {
            name: '网格交易',
            finalValue,
            profit,
            profitPercent,
            totalInvested,
            btcAmount,
            cash,
            history,
            trades,
            description: `涨跌 ${gridPercentage * 100}% 时交易 ${tradePercentage * 100}% 仓位`
        };
    }

    movingAverageCrossStrategy() {
        if (this.filteredData.length < 30) return null;
        
        let cash = this.initialInvestment;
        let btcAmount = 0;
        let totalInvested = this.initialInvestment;
        let trades = 0;
        let isHolding = false;
        
        const shortPeriod = 7;
        const longPeriod = 30;
        
        const history = [];
        
        for (let i = longPeriod; i < this.filteredData.length; i++) {
            const item = this.filteredData[i];
            
            const shortMA = this.calculateMovingAverage(i, shortPeriod);
            const longMA = this.calculateMovingAverage(i, longPeriod);
            
            const prevShortMA = this.calculateMovingAverage(i - 1, shortPeriod);
            const prevLongMA = this.calculateMovingAverage(i - 1, longPeriod);
            
            if (prevShortMA <= prevLongMA && shortMA > longMA && !isHolding && cash > 0) {
                btcAmount = cash / item.price;
                cash = 0;
                isHolding = true;
                trades++;
            } else if (prevShortMA >= prevLongMA && shortMA < longMA && isHolding && btcAmount > 0) {
                cash = btcAmount * item.price;
                btcAmount = 0;
                isHolding = false;
                trades++;
            }
            
            history.push({
                date: item.date,
                value: btcAmount * item.price + cash
            });
        }
        
        const endPrice = this.filteredData[this.filteredData.length - 1].price;
        const finalValue = btcAmount * endPrice + cash;
        const profit = finalValue - totalInvested;
        const profitPercent = ((finalValue / totalInvested - 1) * 100);
        
        return {
            name: '均线交叉',
            finalValue,
            profit,
            profitPercent,
            totalInvested,
            btcAmount,
            cash,
            history,
            trades,
            description: `${shortPeriod}日均线与${longPeriod}日均线交叉策略`
        };
    }

    calculateMovingAverage(endIndex, period) {
        let sum = 0;
        for (let i = endIndex - period + 1; i <= endIndex; i++) {
            sum += this.filteredData[i].price;
        }
        return sum / period;
    }

    analyzeCustomTarget(targetYears, targetReturn) {
        if (this.filteredData.length === 0) return null;
        
        const startPrice = this.filteredData[0].price;
        const targetMultiplier = Math.pow(1 + targetReturn / 100, targetYears);
        const targetFinalValue = this.initialInvestment * targetMultiplier;
        const requiredEndPrice = (targetFinalValue / this.initialInvestment) * startPrice;
        
        const actualYears = (this.endDate - this.startDate) / (365.25 * 24 * 60 * 60 * 1000);
        const endPrice = this.filteredData[this.filteredData.length - 1].price;
        
        const actualMultiplier = endPrice / startPrice;
        const actualAnnualReturn = (Math.pow(actualMultiplier, 1 / actualYears) - 1) * 100;
        
        const highestPrice = Math.max(...this.filteredData.map(d => d.price));
        const bestMultiplier = highestPrice / startPrice;
        const bestAnnualReturn = (Math.pow(bestMultiplier, 1 / actualYears) - 1) * 100;
        
        let feasibility = 'low';
        let feasibilityText = '较低';
        
        if (targetReturn <= actualAnnualReturn) {
            feasibility = 'high';
            feasibilityText = '高';
        } else if (targetReturn <= bestAnnualReturn) {
            feasibility = 'medium';
            feasibilityText = '中等';
        }
        
        return {
            targetYears,
            targetReturn,
            targetFinalValue,
            requiredEndPrice,
            actualAnnualReturn,
            bestAnnualReturn,
            feasibility,
            feasibilityText,
            actualYears,
            startPrice,
            endPrice,
            highestPrice
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StrategyBacktest;
}
