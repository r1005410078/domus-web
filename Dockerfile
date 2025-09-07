# ---------- Base builder ----------
FROM node:22-alpine AS base
WORKDIR /app

# 安装 pnpm 和 turbo
RUN npm install -g pnpm@10.15.1 turbo

# ---------- Prune 阶段 ----------
FROM base AS pruner
ARG APP=admin

WORKDIR /app
COPY . .
RUN turbo prune --scope=${APP} --docker

# ---------- Build 阶段 ----------
FROM base AS builder
ARG APP=admin
WORKDIR /app

# 复制裁剪后的依赖定义
COPY --from=pruner /app/out/full/ ./

COPY --from=pruner /app/out/pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 构建指定应用
RUN pnpm turbo run build --filter=${APP}...

# ---------- Runner 阶段 ----------
FROM node:22-alpine AS runner
ARG APP=admin
WORKDIR /app

# 复制构建产物和必要文件
COPY --from=builder /app/apps/${APP}/.next ./.next
COPY --from=builder /app/apps/${APP}/public ./public
COPY --from=builder /app/apps/${APP}/package.json ./package.json
COPY --from=builder /app/apps/${APP}/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]


