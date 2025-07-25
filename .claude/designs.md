# FIREWOLF UI v2 設計書

## 1. 概要

本設計書は、FIREWOLF UI を Nuxt.js 2.x から Next.js 15（App Router）へ移行し、今後の保守開発をやりやすくするための設計方針を定めたものです。

## 2. 技術選定

### 2.1 コアフレームワーク

- **Next.js 15 (App Router)** - 最新の React Server Components 対応、Turbopack 対応
- **React 19** - 最新の機能とパフォーマンス改善
- **TypeScript 5** - より強力な型システム

### 2.2 状態管理

- **Zustand** - シンプルで型安全な状態管理（Vuex の代替）
- **TanStack Query (React Query)** - サーバー状態の管理とキャッシュ

### 2.3 スタイリング

- **Tailwind CSS** - ユーティリティファースト CSS
- **shadcn/ui** - カスタマイズ可能な UI コンポーネントライブラリ
- **CSS Modules** - コンポーネントスコープのスタイル（必要に応じて）

### 2.4 その他の主要ライブラリ

- **Firebase Authentication** - 既存システムとの互換性維持
- **React Hook Form + Zod** - フォーム管理とバリデーション
- **date-fns** - 日付処理（dayjs の代替）
- **recharts** - グラフ表示（Chart.js の代替）
- **Font Awesome** - アイコン表示用ライブラリ
- **next-pwa** - PWA 対応
- **openapi-typescript + openapi-fetch** - 型安全な API クライアントの生成

## 3. ディレクトリ構造

```
v2/
├── app/                          # App Router
│   ├── (auth)/                   # 認証が必要なルート
│   │   ├── village/create/       # 村作成画面
│   │   └── setting/              # 設定画面
│   ├── (public)/                 # 公開ルート
│   │   ├── page.tsx              # トップページ
│   │   ├── village/[id]/         # 村画面（認証不要）
│   │   ├── player-record/[id]/   # プレイヤー戦績
│   │   ├── charachip-list/       # キャラチップ一覧
│   │   ├── charachip/[id]/       # キャラチップ詳細
│   │   ├── terms/                # 利用規約
│   │   ├── privacy/              # プライバシーポリシー
│   │   ├── about/ rule/ faq/     # その他静的ページ
│   ├── layout.tsx                # ルートレイアウト
│   └── globals.css               # グローバルスタイル
├── components/                   # 共有コンポーネント
│   ├── ui/                       # 基本UIコンポーネント
│   ├── layout/                   # レイアウト関連
│   ├── pages/                    # 各ページ専用コンポーネント
│   ├── auth/                     # 認証関連
│   └── providers/                # コンテキストプロバイダー
├── hooks/                        # カスタムフック
├── lib/                          # ユーティリティ関数
│   ├── api/                      # API関連
│   ├── auth/                     # 認証関連
│   └── utils/                    # その他ユーティリティ
├── stores/                       # Zustand ストア
├── types/                        # TypeScript型定義
├── public/                       # 静的ファイル
└── tests/                        # テストファイル
```

## 4. 主要機能の実装方針

### 4.1 認証システム

Firebase Authentication を使用し、既存システムとの互換性を維持します。

### 4.2 状態管理

- **Zustand**: 認証状態などのグローバル状態管理
- **TanStack Query**: サーバーデータのキャッシュと同期

### 4.3 API 通信

OpenAPI 定義（`http://localhost:8087/firewolf/v3/api-docs`）から型定義と API クライアントを自動生成し、型安全性を確保します。

### 4.4 Server Components 活用

Next.js 15 の Server Components を活用し、初期表示パフォーマンスを向上させます。

## 5. UI/UX設計方針

### 5.1 デザインテーマ

#### カラーパレット
- **Primary（青系）**: `bg-blue-600 hover:bg-blue-700` - 基本操作、メインCTA
- **Danger（赤系）**: `bg-red-600 hover:bg-red-700` - 削除、危険な操作
- **Success（緑系）**: `bg-green-600 hover:bg-green-700` - 成功、完了、作成
- **Warning（黄色系）**: `bg-yellow-600 hover:bg-yellow-700` - 注意、警告

#### フォント設定
- **村のメッセージ内容**: 等幅フォント（monospace）を使用

### 5.2 レイアウト・コンポーネント設計

#### ヘッダー
- **デスクトップ**: シンプルなデザイン（「村一覧」「ルール」等のリンクを削除）
- **モバイル**: ハンバーガーメニューでグループ化された構造
  - FIREWOLFグループ（基本情報）
  - ゲームグループ（村一覧、ルール等）
  - ユーザーグループ（村作成、マイページ等、ログイン時のみ）

#### フッター
- 簡潔な構成で冗長な紹介文を削除
- SNSリンクの更新（X: `https://x.com/ort_dev`）
- 著作権表記を「© 2020- h-orito」に統一

### 5.3 主要画面設計

#### トップページ
- **ビジュアル**: v1のトップページ画像を継続使用（横幅100%）
- **サイト名**: 画像右側に「FIREWOLF」を重ね表示（赤茶系shadow）
- **紹介文**: 画像右下に「FIREWOLFは\n長期人狼が無料で遊べるサービスです」
- **村一覧**: プロローグ、進行中、エピローグの村を固定表示（フィルター削除）
- **参加している村セクション**: ログイン時のみ表示、0件時は非表示

#### 村関連画面
- **村カード**: v1スタイルの背景画像上にテキスト重ね表示
- **村詳細**: キャラクター画像の最適化、不要項目削除

#### キャラチップ関連
- **一覧画面**: 代表キャラクター画像表示、素材サイトリンク削除
- **詳細画面**: 画像表示修正、名前変更可否表示、「作者 HP」表記

#### 認証関連
- **ログインモーダル**: 注意文の赤色表示、ボタンの視認性改善
- **アカウント連携**: 他SNS連携モーダルの実装

## 6. 移行戦略

### 6.1 段階的移行

1. **Phase 1**: 基本セットアップとコアコンポーネント
2. **Phase 2**: 主要画面（トップ、村一覧、村画面表示）
3. **Phase 3**: インタラクティブ機能（投稿、アクション）
4. **Phase 4**: 管理機能（村作成、設定画面）

### 6.2 データ構造の互換性維持

- 既存 API レスポンス形式を維持
- 型定義は自動生成されたものを優先
- URL パスの互換性確保

## 7. デプロイメント・インフラ

### 7.1 コンテナ化

- **ベースイメージ**: `node:22-bookworm-slim`
- **ポート**: 3000
- **basePath**: `/firewolf`（全環境統一）

### 7.2 CI/CD

- **GitHub Actions**: ビルド → テスト → ghcr.io push
- **Kubernetes**: ローリングアップデート、GitOps

## 8. 開発環境・ツール

### 8.1 開発コマンド

```bash
pnpm dev --turbo    # 開発サーバー（Turbopack）
pnpm build          # ビルド
pnpm type-check     # 型チェック
pnpm lint           # リント
pnpm format         # フォーマット
pnpm test           # テスト
pnpm generate:api   # API型とクライアント生成
```

### 8.2 品質管理

- TypeScript strict mode
- ESLint + Prettier
- Jest + React Testing Library
- Playwright（E2E）

### 8.3 型定義のルール

- **API自動生成型の使用制限**: `components['schemas']['XXX']` のような自動生成された型定義を直接使用することは禁止
- **型定義の配置**: すべての型定義は `src/types/` ディレクトリに配置
- **型の再エクスポート**: API自動生成型は `src/types/` で適切な名前で再定義・エクスポートしてから使用
- **命名規則**: 
  - API レスポンス型: `XXXResponse`
  - API リクエスト型: `XXXRequest`
  - ドメインモデル型: シンプルな名前（例: `Skill`, `Village`）

## 9. セキュリティ・パフォーマンス

### 9.1 セキュリティ
- XSS 対策（React 標準）
- 環境変数の適切な管理
- API キーの秘匿

### 9.2 パフォーマンス最適化
- Next.js Image/Font Optimization
- React.memo, useMemo/useCallback
- Suspense によるローディング改善
- Bundle splitting

### 5.4 ルールページ設計

#### 役職一覧機能
- **データ取得**: API `/skill/list` から役職情報を取得
- **表示形式**: テーブル形式での役職一覧表示
- **インタラクション**:
  - 役職名クリックで詳細説明（description）をアコーディオン展開
  - 能力リンククリックで該当セクションへスムーズスクロール
- **視覚的強調**:
  - 人狼陣営の関連項目は赤文字（`text-red-600`）で表示
  - 勝敗判定カウントがnullの場合は「-」表示
- **レスポンシブ対応**: モバイル表示での横スクロール対応

## 10. 今後の拡張性

- ダークモード対応（Tailwind CSS）
- WebSocket によるリアルタイム通信改善
- GraphQL への移行（将来的）