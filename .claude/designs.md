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

#### フォント設定

- **村のメッセージ内容**: 等幅フォント（monospace）を使用
  - アスキーアートや整形されたテキストの表示を維持するため
  - `font-mono` クラスまたは `font-family: monospace` を適用

### 2.4 認証

- **Firebase Authentication** - 既存システムとの互換性維持

### 2.5 フォームバリデーション

- **React Hook Form** - パフォーマンスの良いフォーム管理
- **Zod** - スキーマベースのバリデーション

### 2.6 その他の主要ライブラリ

- **date-fns** - 日付処理（dayjs の代替）
- **recharts** - グラフ表示（Chart.js の代替）
- **PWA 対応** - next-pwa
- **Font Awesome** - アイコン表示用ライブラリ

### 2.7 コード生成ツール

- **openapi-typescript** - OpenAPI 定義から TypeScript 型を生成
- **openapi-fetch** または **orval** - 型安全な API クライアントの生成

## 3. ディレクトリ構造

```
v2/
├── app/                          # App Router
│   ├── (auth)/                   # 認証が必要なルート
│   │   ├── village/
│   │   │   └── create/
│   │   │       └── page.tsx     # 村作成画面
│   │   └── setting/
│   │       └── page.tsx
│   ├── (public)/                 # 公開ルート
│   │   ├── page.tsx              # トップページ
│   │   ├── village/
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # 村画面（認証不要）
│   │   │       └── layout.tsx
│   │   ├── player-record/
│   │   │   └── [id]/
│   │   │       └── page.tsx     # プレイヤー戦績（認証不要）
│   │   ├── charachip-list/
│   │   │   └── page.tsx         # キャラチップ一覧
│   │   ├── charachip/
│   │   │   └── [id]/
│   │   │       └── page.tsx     # キャラチップ詳細
│   │   ├── terms/
│   │   │   └── page.tsx         # 利用規約
│   │   ├── privacy/
│   │   │   └── page.tsx         # プライバシーポリシー
│   │   ├── about/
│   │   ├── rule/
│   │   └── faq/
│   ├── layout.tsx                # ルートレイアウト
│   └── globals.css               # グローバルスタイル
├── components/                   # 共有コンポーネント
│   ├── ui/                       # 基本UIコンポーネント（ボタン、インプット等）
│   ├── layout/                   # レイアウト関連（ヘッダー、フッター、サイドバー等）
│   ├── navigation/               # ナビゲーション関連（メニュー、パンくず等）
│   ├── forms/                    # フォーム関連（バリデーション付きインプット等）
│   ├── feedback/                 # フィードバック系（通知、ローディング、エラー表示等）
│   ├── auth/                     # 認証関連（ログインフォーム、ユーザーメニュー等）
│   ├── village/                  # 村関連コンポーネント
│   ├── charachip/                # キャラチップ関連コンポーネント
│   └── providers/                # コンテキストプロバイダー
├── hooks/                        # カスタムフック
├── lib/                          # ユーティリティ関数
│   ├── api/                      # API関連
│   ├── auth/                     # 認証関連
│   └── utils/                    # その他ユーティリティ
├── stores/                       # Zustand ストア
│   ├── auth.ts
│   ├── village.ts
│   └── settings.ts
├── types/                        # TypeScript型定義
├── public/                       # 静的ファイル
└── tests/                        # テストファイル
```

## 4. 主要機能の実装方針

### 4.1 認証システム

```typescript
// lib/auth/firebase.ts
export const firebaseAuth = {
  signInWithGoogle: async () => {
    /* ... */
  },
  signInWithTwitter: async () => {
    /* ... */
  },
  signOut: async () => {
    /* ... */
  },
  getCurrentUser: () => {
    /* ... */
  },
};

// hooks/useAuth.ts
export const useAuth = () => {
  const { user, setUser } = useAuthStore();
  // 認証状態の管理ロジック
};
```

### 4.2 状態管理

Zustand を使用した状態管理の例：

```typescript
// stores/auth.ts - 認証状態（グローバルで必要）
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (provider: "google" | "twitter") => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  // 実装
}));

// stores/village.ts - 村データ（オプション：参照しやすさのため）
// TanStack Queryでキャッシュ管理する場合は不要
interface VillageStore {
  village: Village | null;
  messages: Message[];
  // 必要に応じて実装
}
```

**注意**: 村データ（village, messages 等）は TanStack Query でキャッシュ管理されるため、Zustand での管理は必須ではありません。参照しやすさや特定のユースケースのために必要な場合のみ実装してください。

### 4.3 API 通信

#### OpenAPI 定義からの自動生成

バックエンド API の OpenAPI 定義（http://localhost:8087/firewolf/v3/api-docs）から型定義と API クライアントを自動生成します。

```bash
# OpenAPI定義から型とAPIクライアントを生成
pnpm generate:api
```

生成されるファイル：

- `lib/api/generated/types.ts` - API 型定義
- `lib/api/generated/client.ts` - API クライアント

**重要な方針：**

- 自動生成された型定義を最大限尊重し、設計に無理がない限りそのまま使用する
- カスタム型を作成する場合は、自動生成された型を拡張する形で実装
- API レスポンスの型は自動生成されたものを使用し、手動で型定義を作成しない

```typescript
// lib/api/client.ts
import { generatedApiClient } from "./generated/client";
import type { Village, Message, Participant } from "./generated/types";

// 自動生成されたクライアントをラップ
export const apiClient = {
  ...generatedApiClient,
  // 必要に応じて追加のメソッドや処理
};

// hooks/useVillageQuery.ts
import type { Village } from "~/lib/api/generated/types";

export const useVillageQuery = (id: string) => {
  return useQuery({
    queryKey: ["village", id],
    queryFn: () => apiClient.villages.getVillageById(id),
  });
};
```

### 4.4 リアルタイム機能

```typescript
// hooks/useVillagePolling.ts
export const useVillagePolling = (villageId: string) => {
  const { refetch } = useVillageQuery(villageId);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // 5秒ごとに更新

    return () => clearInterval(interval);
  }, [villageId, refetch]);
};
```

### 4.5 Server Components 活用

```typescript
// app/village/[id]/page.tsx
export default async function VillagePage({
  params,
}: {
  params: { id: string };
}) {
  // サーバーサイドでデータ取得
  const village = await fetchVillage(params.id);

  return (
    <VillageProvider initialData={village}>
      <VillageContent />
    </VillageProvider>
  );
}
```

### 4.6 UI/UXデザイン方針

#### トップページ
- **ビジュアル**: v1のトップページ画像を継続使用
  - 既存ユーザーへの親しみやすさを維持
  - ブランドイメージの継続性を確保
  - 画像は横いっぱいに表示（`width: 100%`）
  
- **紹介文**: 「FIREWOLFは長期人狼が無料で遊べるサービスです」
  - 明確で理解しやすい説明文
  - サービス内容を端的に表現
  - 「チャット形式で気軽に人狼ゲームを楽しめます。初心者からエキスパートまで、誰でも参加できる多彩な村が開催中です。」の文章は削除
  
- **画像上のサイト名表示**:
  - トップページ画像の右側にサイト名（FIREWOLF）を重ねて表示
  - 赤茶系（#dc2626や#b91c1c等）のtext-shadowを適用
  - 視認性を保ちつつブランドカラーと調和させる
  - 画像の邪魔にならない位置とサイズで配置

- **村一覧表示**:
  - 表示する村の状態をプロローグ、進行中、エピローグに固定
  - 他の状態の村は表示しない

#### トップページ村一覧セクションの改善

- **フィルター機能の削除**:
  - 現在実装されている村の状態選択チェックボックスを削除
  - プロローグ、進行中、エピローグの村のみを固定表示
  - ユーザーが選択できる設定をなくしてシンプルなUIを提供

- **固定表示の実装**:
  - `VillageListSection`コンポーネントで`initialStatuses={['PROLOGUE', 'PROGRESS', 'EPILOGUE']}`を固定設定
  - `VillageList`コンポーネントから状態選択UIを削除
  - APIクエリパラメータも固定値で送信

#### 村カード情報の拡充

- **表示項目の追加**:
  - 更新時刻: `day[day.length - 1].day_change_datetime`を使用して「更新 {日時}」として表示
  - 発言可能時間: `sayable_start`、`sayable_end`、`silent_hours`から計算
  - ダミー役欠け: `setting.rules.available_dummy_skill`の真偽値で「あり」「なし」を表示
  - 年齢制限: `setting.tags.list`からR指定タグを検出して表示

- **実装方針**:
  - `VillageCard`コンポーネントに新しい表示項目を追加
  - 日時処理は既存の`utils/datetime.ts`を活用
  - v1の実装を参考にしてロジックを移植
  - 年齢制限は該当する場合のみ表示（条件付き表示）
  
#### トップページお知らせ機能の設計

- **お知らせ表示の実装**:
  - AnnouncementSectionコンポーネントでお知らせを表示
  - 最新のお知らせのみトップページに表示
  - 過去のお知らせは「もっと見る」リンクで`/release-note`ページに誘導
  
- **データ構造**:
  - v1からお知らせ内容を移行（日付、タイトル、内容）
  - 静的データまたはCMSとして管理
  - リリースノートページで過去のお知らせを一覧表示

#### UIテーマカラーの設計

- **カラーパレットの統一**:
  - **Primary（青系）**: `bg-blue-600 hover:bg-blue-700` - 基本操作、メインCTA
  - **Danger（赤系）**: `bg-red-600 hover:bg-red-700` - 削除、危険な操作
  - **Success（緑系）**: `bg-green-600 hover:bg-green-700` - 成功、完了、作成
  - **Warning（黄色系）**: `bg-yellow-600 hover:bg-yellow-700` - 注意、警告
  
- **適用箇所**:
  - ボタンコンポーネント（Button.tsx）にvariant propを追加
  - 各種フォームの送信ボタン
  - 村作成、参加、退出等のアクションボタン
  - アラート・通知コンポーネント
  - 過去のお知らせは`/release-note`ページで表示
  - お知らせ内容の管理と表示機能を実装
  
#### 環境表示
- **本番環境想定**: テストサーバー警告文は表示しない
  - 本番環境での運用を前提とした実装
  - 開発環境でのみ必要に応じて環境識別表示を行う

#### 共通ヘッダーUIの改善
- **FIREWOLFタイトルの中央揃え**:
  - 現在の実装で少し右にずれているタイトル位置を修正
  - `justify-center` または適切な中央揃えクラスを使用
  - レスポンシブ対応で各画面サイズでの中央配置を確保
  
- **ログインボタンの視認性改善**:
  - Google ログイン、Twitter ログインボタンの背景色・文字色を調整
  - 現在の白い背景で文字が読めない問題を解決
  - ブランドカラーに沿った適切なコントラスト比を確保
  - `bg-blue-600 text-white`（Google）、`bg-sky-500 text-white`（Twitter）等の適用

- **Font Awesome アイコンの実装**:
  - アイコン表示にFont Awesome Free版を使用
  - 既存のアイコンをFont Awesomeに置換
  - パフォーマンスを考慮したツリーシェイキング対応

#### 共通フッターUIの改善
- **紹介文の削除**:
  - 現在の冗長な紹介文「人狼ゲームが無料で遊べるWebサービスです。オンラインで手軽に人狼ゲームを楽しむことができます。」を削除
  - よりシンプルで簡潔なフッターデザインに変更
  
- **SNSリンクの更新**:
  - TwitterリンクをX（旧Twitter）の新URL `https://x.com/ort_dev` に変更
  - アイコンはFont AwesomeのTwitterアイコンを継続使用（デザイン的統一性のため）
  
- **著作権表記の更新**:
  - 著作権表記を「© 2020- h-orito」に変更
  - 開始年を2020年に統一し、現在進行形であることを示す

#### 利用規約・プライバシーポリシーページの実装
- **v1からの内容移行**:
  - v1の利用規約・プライバシーポリシーの内容をv2に移行
  - 同じ内容をNext.jsのページコンポーネントとして実装
  - `/terms`、`/privacy` のルートで適切にアクセス可能にする
  
- **ページ構成**:
  - `src/app/(public)/terms/page.tsx` で利用規約を表示
  - `src/app/(public)/privacy/page.tsx` でプライバシーポリシーを表示
  - 共通レイアウト（ヘッダー・フッター）を継承

## 5. 移行戦略

### 5.1 段階的移行

1. **Phase 1**: 基本セットアップとコアコンポーネントの移行

   - Next.js 環境構築
   - 認証システムの移行
   - 基本的な UI コンポーネントの作成

2. **Phase 2**: 主要画面の移行

   - トップページ
   - 村一覧画面
   - 村画面（表示のみ）

3. **Phase 3**: インタラクティブ機能の移行

   - メッセージ投稿
   - アクション実行
   - リアルタイム更新

4. **Phase 4**: 管理機能の移行
   - 村作成
   - 設定画面
   - その他の画面

### 5.2 データ構造の互換性維持

- 既存の API レスポンス形式を維持
- 型定義は既存のものを基に作成
- 段階的にリファクタリング

## 6. パフォーマンス最適化

### 6.1 Next.js 最適化

- **Image Optimization**: next/image の活用
- **Font Optimization**: next/font の活用
- **Bundle Splitting**: 自動的なコード分割
- **ISR/SSG**: 静的ページの事前生成
- **Turbopack**: より高速な開発環境（Next.js 15 の新機能）
- **Partial Prerendering**: 動的コンテンツと静的コンテンツの最適化

### 6.2 React 最適化

- **React.memo**: 不要な再レンダリング防止
- **useMemo/useCallback**: 計算結果のメモ化
- **Suspense**: ローディング状態の改善

## 7. テスト戦略

### 7.1 テストツール

- **Jest**: ユニットテスト
- **React Testing Library**: コンポーネントテスト
- **Playwright**: E2E テスト

### 7.2 テスト範囲

- コアロジックのユニットテスト
- 重要なコンポーネントの統合テスト
- 主要なユーザーフローの E2E テスト

## 8. 開発環境

### 8.1 必要なツール

- Node.js 22.x LTS（Next.js 15 推奨）
- pnpm（パッケージマネージャー）
- VS Code + 推奨拡張機能

### 8.2 開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
pnpm dev --turbo

# 開発サーバー起動（Webpack使用）
pnpm dev

# ビルド
pnpm build

# プロダクション起動
pnpm start

# 型チェック
pnpm type-check

# リント
pnpm lint

# テスト
pnpm test

# API型とクライアントの生成
pnpm generate:api
```

## 9. セキュリティ考慮事項

- XSS 対策（React 標準で対応）
- 環境変数の適切な管理
- API キーの秘匿

## 10. 今後の拡張性

- **ダークモード**: Tailwind CSS のダークモード機能
- **WebSocket**: リアルタイム通信の改善
- **GraphQL**: REST API からの移行（将来的）

## 11. 移行時の注意点

### 11.1 破壊的変更を避ける

- URL パスは可能な限り維持
- API エンドポイントの互換性維持
- ユーザーデータの移行不要
- 全環境で `/firewolf` をベースパスとして設定（Next.jsのbasePath）

### 11.2 Docker/Kubernetes でのリリース戦略

- **Dockerイメージ戦略**:
  - マルチステージビルドで本番用の最小イメージを作成
  - Node.js 22（Debian系）ベース - k8s環境での互換性と安定性を重視
  - ビルド時の依存関係と実行時の依存関係を分離
  
- **GitHub Container Registry (ghcr.io)**:
  - masterブランチへのpush時に自動でDockerイメージをビルド
  - `ghcr.io/[org]/firewolf-ui:latest` および `ghcr.io/[org]/firewolf-ui:[commit-sha]` でタグ付け
  
- **CI/CD パイプライン (GitHub Actions)**:
  - ビルド → テスト → Dockerイメージ作成 → ghcr.ioへpush
  - masterブランチのみ本番用イメージをpush
  
- **Kubernetes デプロイメント**:
  - マニフェストは別リポジトリで管理（GitOps）
  - ローリングアップデートによる無停止デプロイ
  - 問題時は以前のイメージタグに即座にロールバック可能

### 11.3 コンテナ設計

- **ベースイメージ**: `node:22-bookworm-slim` (Debian 12ベース)
  - k8s環境での互換性を考慮してDebian系を採用
  - slimイメージで軽量化を維持
- **ポート**: 3000（Next.jsデフォルト）
- **ヘルスチェック**: `/api/health` エンドポイント
- **環境変数**: ConfigMapとSecretで管理
- **リソース要求/制限**: 適切なCPU/メモリ制限を設定

### 11.4 Next.js設定

全環境で以下の設定を使用：

```javascript
// next.config.js
const nextConfig = {
  basePath: '/firewolf',
  // その他の設定...
}
```

**basePath設定の影響**:
- すべての内部リンクは自動的に `/firewolf` プレフィックスが付与される
- 静的アセットも `/firewolf/_next/...` のパスで配信される
- APIルートも `/firewolf/api/...` となる
- 開発環境でも `http://localhost:3000/firewolf` でアクセス
