# 跨境电商项目管理后台上线部署说明

## 目标

项目部署到 Vercel 后，正式访问使用 Vercel 网址：

```text
https://xxx.vercel.app
```

正式网站不依赖 VS Code、不依赖 `localhost`、不需要运行 `npm run dev`，也不需要本地电脑开机。

## 本地开发

本地调试仍然使用：

```bash
npm install
npm run dev
```

本地地址仅用于开发测试：

```text
http://localhost:5173
```

## 1. 创建 GitHub 仓库

1. 打开 GitHub。
2. 点击 `New repository`。
3. 输入仓库名称，例如 `cross-border-dashboard`。
4. 选择 `Private` 或 `Public`。
5. 不要勾选自动创建 README、.gitignore、license。
6. 点击 `Create repository`。

## 2. 上传代码到 GitHub

在项目根目录执行：

```bash
git init
git add .
git commit -m "deploy cross border dashboard"
git branch -M main
git remote add origin 仓库地址
git push -u origin main
```

将 `仓库地址` 替换为 GitHub 页面给出的 HTTPS 或 SSH 地址。

## 3. 连接 Vercel

1. 登录 Vercel。
2. 点击 `Add New`。
3. 选择 `Project`。
4. 选择刚上传到 GitHub 的仓库。
5. 点击 `Import`。

## 4. Vercel 构建配置

在 Vercel 导入项目页面填写：

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## 5. 配置环境变量

进入 Vercel 项目：

```text
Settings -> Environment Variables
```

添加：

```text
VITE_SUPABASE_URL=https://gxxgmaebynizhoxuyjqv.supabase.co
VITE_SUPABASE_ANON_KEY=你的 Supabase anon public key
```

Supabase key 查看位置：

```text
Supabase -> Project Settings -> API
```

注意：

- 不要把真实 key 写入代码。
- 不要提交 `.env` 到 GitHub。
- `.env.example` 只保留占位变量，用于说明需要哪些配置。

## 6. 部署

配置完成后点击 Vercel 的 `Deploy`。

部署成功后，Vercel 会显示正式访问地址，例如：

```text
https://cross-border-dashboard.vercel.app
```

这个地址就是正式网站地址。徐瑞、老板、HR、财务、产品部都通过该地址访问。

## 7. 重新部署

后续修改代码后执行：

```bash
git add .
git commit -m "update dashboard"
git push
```

Vercel 会自动检测 GitHub `main` 分支更新，并自动重新部署。

## 8. React 刷新不 404

项目根目录包含 `vercel.json`：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

该配置会让所有路由回到 `index.html`，避免 React 单页应用刷新后出现 404。
