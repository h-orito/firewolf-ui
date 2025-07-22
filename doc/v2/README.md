# FIREWOLF UI v2

FIREWOLF UI v2は、人狼ゲームが無料で遊べるWebサービスのフロントエンドプロジェクトの新バージョンです。

## プロジェクト概要

v2では、v1（Nuxt.js 2.x + Vue.js 2.x）から最新のNext.js 15 + React 19に移行し、モダンなWeb開発技術を採用して大幅に刷新されています。

## 主な特徴

- **モダンな技術スタック**: Next.js 15（App Router）+ React 19 + TypeScript 5
- **デザインシステム**: Tailwind CSS + shadcn/ui
- **状態管理**: Zustand + TanStack Query
- **認証**: Firebase Authentication
- **開発体験**: pnpm + ESLint + Prettier + Jest + Playwright
- **PWA対応**: next-pwaによるProgressive Web App機能

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 15 (App Router)
- **UIライブラリ**: React 19
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **バンドラー**: Webpack（Next.js内蔵）

### 状態管理・データフェッチング
- **グローバル状態**: Zustand
- **サーバー状態**: TanStack Query
- **フォーム**: React Hook Form + Zod

### API・認証
- **API通信**: openapi-fetch
- **型生成**: openapi-typescript
- **認証**: Firebase Authentication

### 開発・テスト
- **パッケージマネージャー**: pnpm
- **リンター**: ESLint
- **フォーマッター**: Prettier
- **単体テスト**: Jest + Testing Library
- **E2Eテスト**: Playwright

### PWA・デプロイ
- **PWA**: next-pwa
- **デプロイ**: Netlify

## ディレクトリ構成

```
v2/
├── src/
│   ├── app/                    # App Routerのページ
│   │   ├── (public)/          # 認証不要のページ
│   │   ├── (auth)/            # 認証必要のページ
│   │   ├── layout.tsx         # ルートレイアウト
│   │   └── globals.css        # グローバルスタイル
│   ├── components/            # Reactコンポーネント
│   │   ├── ui/               # 基本UIコンポーネント
│   │   ├── layout/           # レイアウトコンポーネント
│   │   ├── village/          # 村関連コンポーネント
│   │   └── ...
│   ├── hooks/                # カスタムフック
│   ├── lib/                  # ユーティリティ・設定
│   ├── stores/               # Zustandストア
│   └── types/                # TypeScript型定義
├── public/                   # 静的アセット
├── tests/                    # E2Eテスト
└── ...設定ファイル
```

## クイックスタート

### 前提条件
- Node.js 18以上
- pnpm

### セットアップ
```bash
# リポジトリをクローン
git clone <repository-url>
cd firewolf-ui/v2

# 依存関係をインストール
pnpm install

# 環境変数を設定
cp .env.example .env.local
# .env.localを編集してFirebase設定等を記入

# 開発サーバー起動
pnpm dev
```

詳細なセットアップ手順は [setup.md](./setup.md) を参照してください。

## 開発ガイド

### 基本的な開発フロー
1. **実装前の確認**
   - `.claude/bugs.md` で不具合報告を確認（最優先）
   - `.claude/tasks.md` でタスクの優先順位と依存関係を確認
   - `.claude/designs.md` で設計方針を確認

2. **実装**
   - TypeScript の型定義を必ず記述
   - コンポーネントは関数コンポーネントで実装
   - カスタムフックでロジックを分離

3. **品質チェック**
   ```bash
   pnpm lint      # ESLintでコードの品質をチェック
   pnpm format    # Prettierでコードをフォーマット
   pnpm type-check # TypeScriptの型チェック
   ```

4. **テスト**
   ```bash
   pnpm test          # 単体テスト実行
   pnpm test:coverage # カバレッジ付きテスト実行
   pnpm test:e2e      # E2Eテスト実行
   ```

5. **コミット**
   - 適切な単位（機能単位、ファイル単位）でコミット
   - 日本語のコミットメッセージ（絵文字は使用しない）
   - プレフィックスを使用（feat:, fix:, refactor:等）

### コーディング規約
- **TypeScript**: 型定義を必ず記述、any型の使用を避ける
- **React**: 関数コンポーネントのみ使用、カスタムフックでロジック分離
- **スタイリング**: Tailwind CSSを使用、shadcn/uiコンポーネントを優先
- **状態管理**: グローバル状態はZustand、サーバー状態はTanStack Query
- **フォーム**: React Hook Form + Zodでバリデーション

## ドキュメント

- [セットアップガイド](./setup.md) - 開発環境のセットアップ手順
- [アーキテクチャ](./architecture.md) - システム設計と技術選定の詳細
- [v1からの移行ガイド](./migration-guide.md) - v1からv2への変更点と移行方法

## 主要な機能

### 実装済み機能
- ✅ ユーザー認証（Google/Twitter）
- ✅ 村一覧・村詳細表示
- ✅ プレイヤー戦績表示
- ✅ メッセージ投稿・リアルタイム更新
- ✅ 村への参加・退村
- ✅ 投票・能力実行等のアクション機能
- ✅ 村作成機能
- ✅ 個人設定・村内設定
- ✅ レスポンシブデザイン
- ✅ PWA対応

### v1からの主な改善点
- **パフォーマンス**: React 19とNext.js 15による高速化
- **開発体験**: TypeScript強化、モダンなツールチェーン
- **保守性**: コンポーネント設計の改善、テスト充実
- **ユーザー体験**: レスポンシブデザイン、PWA対応

## ライセンス

MIT License