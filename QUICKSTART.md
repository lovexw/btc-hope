# 快速开始指南

## 🚀 5分钟部署到 Cloudflare Pages

### 前提条件
- 一个 GitHub 账号
- 一个 Cloudflare 账号（免费）

### 步骤 1: 推送代码到 GitHub

```bash
# 如果还没有 Git 仓库
git init
git add .
git commit -m "Initial commit: BTC strategy backtest tool"

# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 步骤 2: 连接 Cloudflare Pages

1. 访问 https://dash.cloudflare.com/
2. 登录你的账号
3. 点击左侧菜单的 **Workers & Pages**
4. 点击 **Create application**
5. 选择 **Pages** 标签
6. 点击 **Connect to Git**

### 步骤 3: 选择仓库

1. 授权 Cloudflare 访问你的 GitHub
2. 选择刚才推送的仓库
3. 点击 **Begin setup**

### 步骤 4: 配置项目

```
项目名称: btc-strategy-backtest（或自定义）
生产分支: main
构建设置:
  - Framework preset: None
  - Build command: (留空)
  - Build output directory: /
```

### 步骤 5: 部署

1. 点击 **Save and Deploy**
2. 等待约 30 秒
3. 完成！你会得到一个 `*.pages.dev` 域名

### 步骤 6: 访问网站

部署完成后，Cloudflare 会提供一个链接，例如：
```
https://btc-strategy-backtest.pages.dev
```

点击访问，开始使用你的比特币投资策略回测工具！

## 🖥️ 本地预览

如果想在本地测试：

```bash
# 方法 1: Python
python3 -m http.server 8000

# 方法 2: Node.js
npx http-server -p 8000

# 方法 3: PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 📱 使用指南

### 1. 设置基本参数

- **初始投资金额**: 例如 $10,000
- **开始日期**: 例如 2020-01-01
- **结束日期**: 例如 2025-12-04
- **定投金额**: 例如 $500/月（用于定投策略）

### 2. 选择策略

勾选你想要对比的策略：
- ✅ HODL 持有策略
- ✅ 定投策略 (DCA)
- ✅ 高抛策略
- ✅ 低吸策略
- ✅ 网格交易
- ✅ 均线交叉

### 3. 运行回测

点击 **"开始回测分析"** 按钮

### 4. 查看结果

系统会展示：
- 每个策略的详细收益数据
- 资产增长曲线对比图
- BTC 价格历史走势图
- 最优策略推荐

### 5. 自定义目标分析（可选）

- 设置投资年限（1-10年）
- 设置目标年化收益率（10%-100%）
- 点击 **"分析可行性"**
- 查看目标是否现实可达

## 🎯 使用示例

### 示例 1: 长期持有 vs 定投

**场景**: 对比 2018 年初到 2025 年末的收益

```
初始投资: $10,000
开始日期: 2018-01-01
结束日期: 2025-12-04
定投金额: $500

选择策略:
✅ HODL 持有策略
✅ 定投策略 (DCA)
```

**结果**: 查看哪种策略在长期中表现更好

### 示例 2: 牛市中的高抛策略

**场景**: 2020-2021 牛市期间

```
初始投资: $5,000
开始日期: 2020-03-01
结束日期: 2021-12-31
定投金额: $0

选择策略:
✅ HODL 持有策略
✅ 高抛策略
```

**结果**: 查看及时获利能否提升收益

### 示例 3: 震荡市中的网格交易

**场景**: 横盘震荡期间

```
初始投资: $10,000
开始日期: 2021-01-01
结束日期: 2023-12-31
定投金额: $0

选择策略:
✅ HODL 持有策略
✅ 网格交易
```

**结果**: 对比网格交易在震荡市的优势

## 💡 小贴士

### 获得更准确的分析

1. **选择合适的时间段**
   - 牛市、熊市、震荡市表现不同
   - 可以分段测试

2. **调整参数**
   - 修改 `strategies.js` 中的参数
   - 例如调整网格间距、止盈比例等

3. **多次对比**
   - 测试不同时间段
   - 测试不同资金量
   - 找到最适合自己的策略

### 常见问题

**Q: 为什么定投策略收益比 HODL 低？**
A: 在单边上涨的牛市中，一次性投入收益最高。定投适合震荡或下跌后的市场。

**Q: 网格交易需要手续费吗？**
A: 本工具暂未计算手续费。实际交易中，频繁交易会产生可观的手续费。

**Q: 可以添加更多策略吗？**
A: 可以！编辑 `strategies.js` 添加自定义策略，在 `index.html` 和 `app.js` 中注册即可。

**Q: 数据可以更新吗？**
A: 可以！替换 `btc-price 2015-2025.csv` 文件，保持相同的格式（date, btc price）。

## 🔧 自定义配置

### 修改策略参数

编辑 `strategies.js`：

```javascript
// 修改高抛策略的参数
const sellThreshold = 0.30;  // 改为 0.20 表示涨 20% 就卖
const sellPercentage = 0.50; // 改为 0.30 表示卖出 30% 仓位

// 修改网格交易参数
const gridPercentage = 0.10; // 改为 0.05 表示 5% 网格间距
```

### 修改样式

编辑 `styles.css`：

```css
/* 修改主题色 */
:root {
    --primary-color: #f7931a;  /* 比特币橙 */
    --secondary-color: #4a90e2; /* 改为你喜欢的颜色 */
}
```

### 添加新策略

1. 在 `strategies.js` 中添加新方法
2. 在 `index.html` 中添加复选框
3. 在 `app.js` 的 `runBacktest()` 中注册

## 📊 数据格式

CSV 文件格式：
```csv
date,btc price
2025-12-04,92574
2025-12-03,91499
...
```

要求：
- 第一列：日期 (YYYY-MM-DD)
- 第二列：价格 (数字)
- 第一行：标题行

## 🌐 域名绑定

部署后想用自己的域名？

1. 在 Cloudflare Pages 项目中点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入域名（如 `btc.yourdomain.com`）
4. 添加 CNAME 记录指向 `*.pages.dev`
5. 等待 SSL 证书自动配置（几分钟）

## 🎉 完成！

恭喜！你现在有了一个专业的比特币投资策略回测工具。

如有问题，请查看：
- 📖 [README.md](README.md) - 项目介绍
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - 详细部署指南
- ✨ [FEATURES.md](FEATURES.md) - 功能详解

---

**祝你投资顺利！** 🚀💰

记住：理性投资，风险自担！
