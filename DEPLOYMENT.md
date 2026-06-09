# 部署指南

本项目支持部署到 Vercel 和 Cloudflare Pages 两个平台。

## 🚀 Vercel 部署

### 方法一：通过 Vercel Dashboard（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测到这是一个 Next.js 项目
5. 构建命令会自动设置为 `npm run build:vercel`
6. 点击 "Deploy" 开始部署

### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel --prod
```

### 环境变量设置

在 Vercel Dashboard 的项目设置中，添加以下环境变量（如果需要）：
- `NODE_ENV=production`

## 🐳 Docker 部署

本项目支持两种 Docker 部署方式：

### 方式一：Next.js Server 镜像（推荐通用容器平台）

适用于 Docker、Docker Compose、云服务器、Coolify、Dokploy、1Panel、Portainer 等需要运行 Node.js 服务的场景。该模式使用 Next.js `standalone` 输出，生产镜像体积更小，运行时不需要完整开发依赖。

```bash
# 构建镜像
npm run docker:build

# 启动容器
npm run docker:run
```

等价 Docker 命令：

```bash
docker build -t white-noise:latest .
docker run --rm -p 3000:3000 white-noise:latest
```

访问：

```txt
http://localhost:3000
```

### 方式二：静态 Nginx 镜像（适合纯静态部署）

适用于只需要托管静态文件的场景。该模式会执行 `npm run build:static`，并用 Nginx 托管 `out/` 目录。

```bash
# 构建静态镜像
npm run docker:build:static

# 启动静态容器
npm run docker:run:static
```

等价 Docker 命令：

```bash
docker build -f Dockerfile.static -t white-noise:static .
docker run --rm -p 8080:80 white-noise:static
```

访问：

```txt
http://localhost:8080
```

### Docker Compose

默认启动 Next.js Server 模式：

```bash
docker compose up -d --build app
```

启动静态 Nginx 模式：

```bash
docker compose --profile static up -d --build static
```

### Docker 文件说明

| 文件 | 作用 |
|------|------|
| `Dockerfile` | 构建并运行 Next.js Server 版本 |
| `Dockerfile.static` | 构建静态导出版本并用 Nginx 托管 |
| `nginx.conf` | 静态资源缓存、gzip、路由 fallback 配置 |
| `.dockerignore` | 排除 `node_modules`、`.next`、`out`、备份目录等，减小构建上下文 |
| `docker-compose.yml` | 提供 Server / Static 两种 compose 服务 |

## ☁️ Cloudflare Pages 部署

### 方法一：通过 Cloudflare Dashboard（推荐）

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 "Pages" 部分
3. 点击 "Create a project"
4. 连接你的 GitHub 仓库
5. 设置构建配置：
   - **框架预设**: `Next.js (Static HTML Export)`
   - **构建命令**: `npm run build:cloudflare`
   - **构建输出目录**: `out`
   - **Node.js 版本**: `18`
6. 点击 "Save and Deploy"

### 方法二：通过 Wrangler CLI

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build:cloudflare

# 部署到 Cloudflare Pages
wrangler pages deploy out --project-name=white-noise
```

## 🔧 自动部署设置

项目已配置 GitHub Actions 自动部署工作流。要启用自动部署，需要在 GitHub 仓库的 Settings > Secrets 中添加以下密钥：

### Vercel 自动部署密钥

1. `VERCEL_TOKEN`: 在 Vercel Dashboard > Settings > Tokens 中创建
2. `VERCEL_ORG_ID`: 在 Vercel 项目设置中找到
3. `VERCEL_PROJECT_ID`: 在 Vercel 项目设置中找到

### Cloudflare Pages 自动部署密钥

1. `CLOUDFLARE_API_TOKEN`: 在 Cloudflare Dashboard > My Profile > API Tokens 中创建
2. `CLOUDFLARE_ACCOUNT_ID`: 在 Cloudflare Dashboard 右侧边栏中找到

## 📁 构建输出说明

- **Vercel 部署**: 使用 `npm run build:vercel`，输出到 `.next` 目录，支持服务端渲染
- **Cloudflare Pages 部署**: 使用 `npm run build:static`，输出到 `out` 目录，纯静态文件

## 🎵 音频文件处理

项目包含多个音频文件，部署时需要注意：

1. 音频文件会被自动包含在构建输出中
2. 已配置适当的缓存头部以优化加载性能
3. 支持的音频格式：MP3, WAV, MP4

## 🔍 故障排除

### 常见问题

1. **Vercel 部署错误：Function Runtimes must have a valid version**
   - 这是 vercel.json 配置问题，已在最新版本中修复
   - 确保使用简化的 vercel.json 配置
   - 删除不必要的 functions 和 buildCommand 配置

2. **Cloudflare Pages 部署错误：Files up to 25 MiB in size**
   - 单个文件不能超过 25MB
   - 运行 `npm run optimize-assets` 检查和处理大文件
   - 使用音频压缩工具减小文件大小
   - 考虑使用外部 CDN 托管大文件

3. **Node.js 内置模块警告**
   - 在 webpack 配置中添加了 fallback 设置
   - 这些警告不会影响部署，但已通过配置优化解决

4. **音频文件无法播放**
   - 检查浏览器控制台是否有 CORS 错误
   - 确认音频文件路径正确

5. **构建失败**
   - 检查 Node.js 版本是否为 18+
   - 确认所有依赖都已正确安装

6. **静态导出问题**
   - 确保没有使用服务端特有的 API
   - 检查是否有动态路由需要预渲染

### 本地测试

```bash
# 测试 Vercel 构建
npm run build:vercel
npm start

# 测试静态构建
npm run build:static
npx serve out
```

## 📊 性能优化

项目已包含以下优化：

- 音频文件缓存策略
- 图片优化配置
- 适当的 HTTP 头部设置
- 静态资源压缩

## 🌐 域名配置

部署完成后，你可以：

1. **Vercel**: 在项目设置中添加自定义域名
2. **Cloudflare Pages**: 在 Pages 项目设置中配置自定义域名

---

如有问题，请查看各平台的官方文档或提交 Issue。