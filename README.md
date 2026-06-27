# 1688 Sourcing Copilot — Web App

Vercel 部署的落地页 + 聊天界面 + Dify API 代理。

## 文件结构

```
1688-sourcing-copilot-web/
├── index.html         # 落地页(营销主页)
├── chat.html          # 聊天界面
├── api/
│   └── chat.js        # Dify API 代理(隐藏 API key)
├── package.json       # Vercel 项目配置
├── vercel.json        # Vercel 部署配置
└── README.md          # 部署指南
```

## 部署步骤(10 分钟)

### 1. 准备 GitHub 仓库

```bash
# 在项目根目录
cd C:\Users\Lenovo\.minimax-agent-cn\projects\1688-sourcing-copilot-web

git init
git add .
git commit -m "Initial: 1688 Sourcing Copilot web app"

# 在 GitHub 上创建新仓库:1688-sourcing-copilot-web
# 然后:
git remote add origin https://github.com/YOUR-USERNAME/1688-sourcing-copilot-web.git
git branch -M main
git push -u origin main
```

### 2. Vercel 部署

1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 点 **"Add New Project"**
4. 选 `1688-sourcing-copilot-web` 仓库
5. **环境变量**:
   - Key: `DIFY_API_KEY`
   - Value: `app-xxxxx` (你的 Dify API key,完整粘贴)
6. 点 **Deploy**

### 3. 验证

部署成功后,访问 `https://your-project-name.vercel.app/`

- 落地页 → 看到 hero + 6 场景卡片
- 点 "Try Free" → 跳到 `/chat.html`
- 输入测试 query → 应该看到流式输出

### 4. 接 Lemon Squeezy 收钱

#### 4.1 创建 Lemon Squeezy 账号

1. 访问 https://lemonsqueezy.com
2. 注册 + 验证邮箱
3. 完成商店设置(store name: "1688 Sourcing Copilot")

#### 4.2 创建产品

1. Dashboard → **Products** → **+ New Product**
2. Product name: `1688 Sourcing Copilot Pro`
3. Pricing: `$9.9/month` (recurring)
4. 完成产品信息
5. 点 **"Share / Embed"** 找 **Buy Button URL**
6. 复制 URL

#### 4.3 替换落地页的支付链接

打开 `index.html`,找到:
```html
<a href="https://YOUR-LEMONSQUEEZY-URL.lemonsqueezy.com/buy/..." ...
```

把 `https://YOUR-LEMONSQUEEZY-URL...` 替换成你的真实 buy URL。

提交:
```bash
git add index.html
git commit -m "Add Lemon Squeezy payment link"
git push
```

Vercel 自动部署。

#### 4.4 (可选) Webhook 升级用户

Lemon Squeezy → Settings → Webhooks → Add Endpoint
- URL: `https://your-domain.vercel.app/api/webhook`
- Events: `subscription_created`, `subscription_cancelled`

创建 `api/webhook.js` 处理订阅事件 → 写入用户标识 → 落地页读取解锁 Pro。

(MVP 阶段可跳过,先用 buy button)

## 域名(可选)

- Vercel 提供免费 `*.vercel.app` 子域名
- 绑定自定义域名:Vercel Project → Settings → Domains → Add

## 监控

- Vercel Dashboard → 部署历史 + 函数日志
- Dify Cloud → 日志与标注 → 看每次对话的 token 消耗

## 成本估算

| 项目 | 成本 |
|------|------|
| Vercel Hobby | $0/月 |
| Dify Cloud | 免费版 200 次/月(测试够) |
| DeepSeek API | ¥0.002/对话(¥6/月 @ 100 用户 × 1 次/天) |
| Lemon Squeezy | 5% + $0.50/笔(从用户付的 $9.9 里扣) |
| **净收入** | **$9.9 × 95% = $9.41/月/用户** |

**100 Pro 用户 = $941/月净利润** 🎉

## 下一步

1. ✅ 部署到 Vercel
2. ✅ 替换 Lemon Squeezy 链接
3. → 上 Product Hunt
4. → 写 Twitter / Reddit launch posts
5. → 找 10 个种子用户试用 + 收集反馈
