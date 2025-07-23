# Node.js 22 Debian系ベースイメージを使用（k8s環境での互換性を考慮）
FROM node:22-bookworm-slim AS base

# pnpmのインストール
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# 依存関係インストール用ステージ
FROM base AS deps
WORKDIR /app

# package.jsonとpnpm-lock.yamlをコピー
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ビルド用ステージ
FROM base AS builder
WORKDIR /app

# 依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules
# 設定ファイルとソースコードをコピー
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json next.config.js ./
COPY tailwind.config.ts postcss.config.mjs ./
COPY src/ ./src/
COPY public/ ./public/

# 環境変数（ビルド時）
ENV NEXT_TELEMETRY_DISABLED=1
# Firebase環境変数はビルド引数として受け取る
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

# アプリケーションをビルド
RUN pnpm run build

# 本番用ステージ
FROM base AS runner
WORKDIR /app

# セキュリティのため非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 必要なファイルのみコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# ユーザーを切り替え
USER nextjs

# ポート設定
EXPOSE 3000

# 環境変数（実行時）
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/firewolf/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# アプリケーション起動
CMD ["node", "server.js"]