# 比特币投资策略回测分析工具

基于 2013-2025 年真实 BTC 价格数据的投资策略回测分析平台。

## 功能特性

### 📊 预设投资策略

1. **HODL 持有策略** - 一次性买入并长期持有
2. **定投策略 (DCA)** - 每月固定金额定期买入
3. **高抛策略** - 涨幅达到设定比例时卖出部分仓位
4. **低吸策略** - 跌幅超过设定比例时抄底买入
5. **网格交易** - 在价格波动中低买高卖获取收益
6. **均线交叉** - 基于移动平均线的技术分析策略

### 🎯 自定义收益目标分析

- 设定投资年限（1-10年）
- 设定目标年化收益率（10%-100%）
- 智能分析目标可行性
- 对比历史数据给出投资建议

### 📈 可视化展示

- 多策略资产增长曲线对比
- BTC 历史价格走势图（对数坐标）
- 详细的收益指标展示
- 响应式设计，支持移动端

### 📊 交易历史追踪 🆕

每个策略都提供完整的交易历史记录：

- **可视化标记**：在图表上显示所有买入/卖出点
  - 🔺 绿色三角 = 买入
  - 🔶 红色菱形 = 卖出
  
- **详细交易表格**：展开查看每笔交易
  - 交易日期和价格
  - 买入/卖出数量
  - 交易原因说明
  - 组合价值变化
  
- **交易统计**：
  - 买入/卖出次数
  - 平均买入/卖出价格
  - 帮助理解策略如何在历史跌幅中操作

**用途**：清楚看到策略在过往市场中的具体操作，学习如何在跌幅中找到高胜率的投资时机。

## 部署到 Cloudflare Pages

### 方法一：通过 Git 仓库部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Pages** 菜单
4. 点击 **Create a project**
5. 连接你的 GitHub 仓库
6. 配置构建设置：
   - **Build command**: 留空（纯静态站点）
   - **Build output directory**: `/`（根目录）
7. 点击 **Save and Deploy**

### 方法二：使用 Wrangler CLI 直接部署

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署项目
wrangler pages deploy . --project-name=btc-strategy-backtest
```

### 方法三：拖拽部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** 菜单
3. 点击 **Upload assets**
4. 将以下文件拖拽到上传区域：
   - `index.html`
   - `styles.css`
   - `app.js`
   - `strategies.js`
   - `btc-price 2015-2025.csv`
5. 点击 **Deploy site**

## 本地开发

由于使用了 `fetch` API 读取 CSV 文件，需要通过 HTTP 服务器运行：

```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000

# 或使用 PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 技术栈

- **纯静态网站** - HTML + CSS + JavaScript
- **Chart.js** - 数据可视化
- **响应式设计** - 支持各种设备
- **现代化 UI** - 玻璃态效果、渐变色、流畅动画

## 数据说明

- 数据来源：`btc-price 2015-2025.csv`
- 时间范围：2013年4月 - 2025年12月
- 数据频率：每日收盘价
- 格式：CSV (日期, 价格)

## 使用说明

1. **设置投资参数**：初始投资金额、开始/结束日期、定投金额
2. **选择策略**：勾选想要对比的投资策略
3. **运行回测**：点击"开始回测分析"按钮
4. **查看结果**：对比不同策略的收益表现
5. **自定义分析**：设置目标收益率，分析可行性

## 免责声明

⚠️ **重要提示**：

- 本工具仅用于教育和研究目的
- 历史数据回测不代表未来收益
- 加密货币投资具有高风险
- 请根据自身情况做出投资决策
- 不构成任何投资建议

## License

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
