# 部署指南 - Cloudflare Pages

本文档详细说明如何将比特币投资策略回测工具部署到 Cloudflare Pages。

## 快速部署（推荐）

### 选项 1: 通过 GitHub + Cloudflare Pages（最简单）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Add BTC strategy backtest tool"
   git push origin main
   ```

2. **连接 Cloudflare Pages**
   - 访问 https://dash.cloudflare.com/
   - 选择你的账户
   - 点击 **Workers & Pages** → **Pages**
   - 点击 **Create a project**
   - 选择 **Connect to Git**
   - 授权并选择你的 GitHub 仓库

3. **配置构建设置**
   - **Project name**: `btc-strategy-backtest` (或自定义)
   - **Production branch**: `main`
   - **Build command**: 留空
   - **Build output directory**: `/`
   - 点击 **Save and Deploy**

4. **完成！** 
   - Cloudflare 会自动部署你的网站
   - 你会得到一个 `*.pages.dev` 域名
   - 可以在 Custom domains 中添加自定义域名

### 选项 2: 使用 Wrangler CLI（适合开发者）

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **部署项目**
   ```bash
   wrangler pages deploy . --project-name=btc-strategy-backtest
   ```

4. **后续更新**
   ```bash
   # 每次更新代码后运行
   wrangler pages deploy .
   ```

### 选项 3: 直接上传（适合测试）

1. 访问 https://dash.cloudflare.com/
2. 进入 **Workers & Pages** → **Pages**
3. 点击 **Upload assets**
4. 创建项目名称
5. 将这些文件拖拽上传：
   - `index.html`
   - `styles.css`
   - `app.js`
   - `strategies.js`
   - `btc-price 2015-2025.csv`
6. 点击 **Deploy site**

## 自定义域名配置

部署完成后，你可以添加自定义域名：

1. 在 Cloudflare Pages 项目中，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名（例如：`btc.yourdomain.com`）
4. 按照提示添加 DNS 记录
5. 等待 SSL 证书自动配置完成

## 项目结构

```
/
├── index.html              # 主页面
├── styles.css             # 样式表
├── app.js                 # 主应用逻辑
├── strategies.js          # 投资策略算法
├── btc-price 2015-2025.csv # 价格数据
├── README.md              # 项目说明
├── DEPLOYMENT.md          # 部署指南（本文档）
├── wrangler.toml          # Cloudflare 配置
└── .gitignore             # Git 忽略文件
```

## 环境要求

- **无需构建工具** - 纯静态网站
- **无需 Node.js 依赖** - 使用 CDN 引入 Chart.js
- **无需服务器端代码** - 所有计算在浏览器中完成
- **即部署即用** - 上传后立即可访问

## 性能优化建议

Cloudflare Pages 默认提供以下优化：

1. ✅ 全球 CDN 加速
2. ✅ 自动 HTTPS
3. ✅ 自动压缩 (Brotli/Gzip)
4. ✅ HTTP/2 和 HTTP/3 支持
5. ✅ 无限带宽

额外优化（可选）：

1. **启用 Cloudflare Analytics**
   - 在项目设置中启用 Web Analytics
   - 获取访问量和性能数据

2. **设置缓存规则**
   - CSV 文件可以缓存更长时间
   - 静态资源建议缓存 1 年

3. **启用 Bot Management**
   - 防止恶意爬虫消耗资源

## 更新网站

### 通过 Git（推荐）
```bash
# 修改代码后
git add .
git commit -m "Update features"
git push origin main

# Cloudflare Pages 会自动重新部署
```

### 通过 Wrangler CLI
```bash
# 直接部署最新版本
wrangler pages deploy .
```

### 通过 Web 界面
1. 进入项目的 Deployments 页面
2. 点击 **Create deployment**
3. 上传更新的文件

## 故障排查

### 问题 1: CSV 文件加载失败
**原因**: MIME 类型不正确

**解决方案**: 在项目根目录创建 `_headers` 文件：
```
/*.csv
  Content-Type: text/csv
```

### 问题 2: 图表不显示
**原因**: Chart.js CDN 加载失败

**解决方案**: 检查网络连接，或下载 Chart.js 本地引入

### 问题 3: 日期选择器不显示正确范围
**原因**: CSV 数据格式问题

**解决方案**: 确保 CSV 第一列是标准日期格式 (YYYY-MM-DD)

## 监控和分析

### 使用 Cloudflare Web Analytics（免费）

1. 在 Cloudflare Dashboard 中启用 Web Analytics
2. 获取 Beacon Token
3. 在 `index.html` 的 `<head>` 中添加：
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
           data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
   ```

### 查看部署日志

1. 进入项目页面
2. 点击 **Deployments** 标签
3. 查看每次部署的详细日志

## 成本

Cloudflare Pages 免费套餐包括：

- ✅ 无限静态请求
- ✅ 无限带宽
- ✅ 500 次构建/月
- ✅ 100 个自定义域名
- ✅ 全球 CDN
- ✅ 自动 HTTPS

**完全免费使用！** 🎉

## 技术支持

如遇到部署问题：

1. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
2. 访问 [Cloudflare Community](https://community.cloudflare.com/)
3. 在本项目提交 Issue

## 安全建议

1. ✅ 已启用 HTTPS（自动）
2. ✅ 设置 CSP (Content Security Policy)
3. ✅ 定期更新依赖（Chart.js CDN）
4. ✅ 不存储用户敏感信息（所有计算在本地）

---

**祝你部署顺利！** 🚀

如有问题，请参考 README.md 或提交 Issue。
