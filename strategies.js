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
            description: '📍 策略逻辑：在开始日期一次性投入全部资金购买比特币，然后持有到结束日期，期间不做任何操作。💰 获利方式：完全依靠比特币价格上涨获利，适合长期看好比特币的投资者。这是最简单也是最经典的策略，历史数据显示长期持有往往能获得可观收益。'
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
            description: `📍 策略逻辑：初始投入后，每月固定时间投入 ${this.dcaAmount.toFixed(0)}（无论价格高低）继续购买比特币，通过时间分散降低市场波动风险。💰 获利方式：通过定期买入平滑成本，降低一次性投资的择时风险。在熊市时能以较低价格积累更多币，在牛市时享受持续上涨带来的收益。适合工薪族长期定投，无需择时。`
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
            description: `📍 策略逻辑：初始买入后，当价格相比上次买入价上涨 ${sellThreshold * 100}% 时，自动卖出 ${sellPercentage * 100}% 的持仓锁定部分利润，然后继续持有剩余部分。💰 获利方式：在价格大幅上涨时及时止盈，将部分利润转为现金，避免后续回调时收益全部回吐。适合波动较大的牛市行情，既能享受上涨收益，又能锁定部分利润降低风险。`
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
            description: `📍 策略逻辑：开始时持有全部现金，当价格从历史高点回落超过 ${dipThreshold * 100}% 时（即出现明显回调），使用 ${buyPercentage * 100}% 的可用现金抄底买入，等待反弹。💰 获利方式：在恐慌性下跌时勇敢买入，以更低的价格积累筹码，待价格反弹后获得收益。这是典型的"别人恐惧我贪婪"策略，适合有一定风险承受能力且能把握市场恐慌时机的投资者。`
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
            description: `📍 策略逻辑：初始时一半现金、一半比特币持仓，设定 ${gridPercentage * 100}% 的价格网格。价格每上涨 ${gridPercentage * 100}% 就卖出 ${tradePercentage * 100}% 持仓；价格每下跌 ${gridPercentage * 100}% 就买入相应金额。💰 获利方式：通过高抛低吸赚取价格波动的差价，不预测趋势，只赚取震荡收益。交易频率高，适合波动较大的横盘或震荡市场，能够充分利用价格来回波动赚取利润。`
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
            description: `📍 策略逻辑：开始时持有全部现金，使用 ${shortPeriod} 日短期均线和 ${longPeriod} 日长期均线判断趋势。当短期均线上穿长期均线（金叉）时全仓买入，当短期均线下穿长期均线（死叉）时全部卖出。💰 获利方式：通过均线交叉捕捉中长期趋势，在上涨趋势中持有获利，在下跌趋势中空仓避险。适合趋势明显的单边市场，能够有效避开大级别回调，但在震荡市可能频繁交易产生损耗。`
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
