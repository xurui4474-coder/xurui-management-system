# Supabase 配置说明

## 1. 创建 Supabase 项目

进入 Supabase 控制台，新建项目。

## 2. 执行数据库脚本

打开 Supabase 项目的 SQL Editor，复制并执行：

```text
supabase/schema.sql
```

脚本会创建：

- `tasks`
- `products`
- `weekly_reviews`
- `metrics`

并启用 RLS、登录用户读写权限、Realtime 数据订阅。

## 3. 开启邮箱密码登录

在 Supabase 后台进入：

```text
Authentication -> Providers -> Email
```

确认 Email 登录已启用。

## 4. 配置前端环境变量

复制 `.env.example` 为 `.env`：

```bash
copy .env.example .env
```

填入 Supabase 项目参数：

```text
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

参数位置：

```text
Project Settings -> API
```

## 5. 运行项目

```bash
npm install
npm run dev
```

浏览器打开：

```text
http://localhost:5173
```

## 6. 给老板开账号

可以在登录页创建账号，也可以在 Supabase 后台进入：

```text
Authentication -> Users -> Add user
```

创建你和老板的邮箱账号后，两边登录即可同时查看和编辑数据。
