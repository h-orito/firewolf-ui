# FIREWOLF UI v2 タスク管理

## タスク一覧

### Phase 1: 基本セットアップとコアコンポーネント

#### 1.1 プロジェクト初期設定

- [x] Next.js 15 プロジェクトの作成（App Router 使用）
- [x] TypeScript 5 の設定
- [x] ESLint/Prettier の設定
- [x] Tailwind CSS の設定
- [x] 基本的なディレクトリ構造の作成

#### 1.2 開発環境設定

- [x] pnpm のセットアップ
- [x] 環境変数の設定（.env.local）
- [x] Gitignore の更新
- [x] package.json のスクリプト設定（dev, build, lint, format, type-check）

#### 1.3 OpenAPI 連携

- [x] openapi-typescript と openapi-fetch（または orval）のセットアップ
- [x] API 型生成スクリプトの作成（pnpm generate:api）
- [x] 生成された型の動作確認

#### 1.4 基本 UI コンポーネント

- [x] shadcn/ui のセットアップ
- [x] 基本的な UI コンポーネントの追加（Button, Input, Card 等）
- [x] 等幅フォントの設定（村メッセージ用）

#### 1.5 認証システム

- [x] Firebase Authentication の設定
- [x] 認証用の Zustand ストア作成（stores/auth.ts）
- [x] useAuth フックの実装
- [x] Google/Twitter 認証の実装
- [x] 認証状態の永続化

### Phase 2: 主要画面の実装

#### 2.1 レイアウトコンポーネント

- [x] ルートレイアウト（app/layout.tsx）の実装
- [x] ヘッダーコンポーネント（components/layout/header.tsx）
- [x] フッターコンポーネント（components/layout/footer.tsx）
- [x] ナビゲーションコンポーネント（components/navigation/）

#### 2.2 トップページ

- [x] app/(public)/page.tsx の実装
- [x] 村一覧の表示
- [x] ユーザー情報の表示（ログイン時）
- [x] お知らせ表示
- [x] v1 のトップページ画像の移行と表示
- [x] トップページの紹介文を「FIREWOLFは長期人狼が無料で遊べるサービスです」に変更
- [x] トップページ画像の右側に赤茶系のtext-shadowでサイト名（FIREWOLF）を表示
- [x] トップページに表示する村をプロローグ、進行中、エピローグのもので固定化
- [x] 不要な紹介文「チャット形式で気軽に人狼ゲームを楽しめます。初心者からエキスパートまで、誰でも参加できる多彩な村が開催中です。」を削除
- [x] トップページ画像を横いっぱいに表示するよう調整
- [x] お知らせ表示機能の実装（v1からコピー）
- [x] リリースノートページ（/release-note）の作成

#### 2.3 村一覧画面

- [x] 村一覧 API 連携（TanStack Query 使用）
- [x] フィルタリング機能
- [x] ページネーション（クライアントサイド実装完了）
- [x] 村カードコンポーネント

#### 2.4 村画面（表示のみ）

- [x] app/(public)/village/[id]/page.tsx の実装
- [x] 村情報の取得と表示
- [x] メッセージ一覧の表示（等幅フォント適用）
- [x] 参加者一覧の表示
- [x] 村の状態表示（プロローグ、進行中、エピローグ等）

#### 2.5 プレイヤー戦績画面

- [x] app/(public)/player-record/[id]/page.tsx の実装
- [x] プレイヤー情報の取得と表示
- [x] 戦績統計の表示
- [x] グラフ表示（recharts 使用）

### Phase 3: インタラクティブ機能

#### 3.1 メッセージ投稿機能

- [x] メッセージ投稿フォームコンポーネント
- [x] 発言種別の切り替え（通常発言、独り言等）
- [x] 文字数カウント
- [x] メッセージのリアルタイム更新（ポーリング）

#### 3.2 アクション実行機能

- [x] 投票機能の実装
- [x] 能力実行（占い、護衛等）の実装
- [x] コミット機能
- [x] アクション実行時のバリデーション

#### 3.3 参加・退村機能

- [x] 村への参加フォーム
- [x] キャラクター選択
- [x] 役職希望の設定
- [x] 退村処理

#### 3.4 村内設定

- [x] 文字サイズ設定
- [x] 表示設定（日時表示、発言者名表示等）
- [x] フィルタリング設定
- [x] 設定の永続化（localStorage）

### Phase 4: 管理機能とその他の画面

#### 4.1 村作成機能

- [x] app/(auth)/village/create/page.tsx の実装
- [x] 村作成フォーム（React Hook Form + Zod）
- [x] キャラチップ選択
- [x] 役職構成設定
- [x] ルール設定

#### 4.2 設定画面

- [x] app/(auth)/setting/page.tsx の実装
- [x] プロフィール設定
- [x] 通知設定
- [x] その他の個人設定

#### 4.3 静的ページ

- [x] ルール説明ページ（app/(public)/rule/page.tsx）
- [x] FAQ（app/(public)/faq/page.tsx）
- [x] About（app/(public)/about/page.tsx）
- [x] キャラチップ一覧ページ（app/(public)/charachip-list/page.tsx）
- [x] キャラチップ詳細ページ（app/(public)/charachip/[id]/page.tsx）
- [x] 利用規約ページ（app/(public)/terms/page.tsx）
- [x] プライバシーポリシーページ（app/(public)/privacy/page.tsx）

#### 4.4 エラー処理

- [x] エラーページ（error.tsx）
- [x] 404 ページ（not-found.tsx）
- [x] グローバルエラーハンドリング

### Phase 5: 最終調整とドキュメント

#### 5.1 パフォーマンス最適化

- [x] 画像最適化（next/image）※現時点で画像未使用
- [x] フォント最適化（next/font）
- [x] バンドルサイズの確認と最適化

#### 5.2 PWA 対応

- [x] next-pwa の設定
- [x] マニフェストファイルの作成
- [x] Service Worker の設定

#### 5.3 テスト

- [x] ユニットテストの作成（重要なロジック）
- [x] 統合テストの作成（主要な機能）
- [x] E2E テストの作成（主要なユーザーフロー）

#### 5.4 ドキュメント作成

- [x] doc/v2/README.md の作成
- [x] doc/v2/setup.md の作成
- [x] doc/v2/architecture.md の作成
- [x] doc/v2/migration-guide.md の作成
- [x] その他必要なドキュメントの作成

#### 5.5 デプロイ準備

- [x] Dockerfile の作成（マルチステージビルド、Node.js 22 Debian 系ベース - k8s 環境対応）
- [x] .dockerignore ファイルの作成
- [x] GitHub Actions 設定（Docker build/push、master ブランチ対象）
- [x] 環境変数の設定（GitHub Secrets）
- [x] ヘルスチェックエンドポイント（/api/health）の実装
- [x] ビルドコマンドの確認
- [x] Docker イメージのビルドテスト

## 優先順位

1. **最優先**: Phase 1（基本セットアップ）
2. **高**: Phase 2（主要画面）、Phase 3.1（メッセージ投稿）
3. **中**: Phase 3（その他のインタラクティブ機能）、Phase 4.1（村作成）
4. **低**: Phase 4（その他の管理機能）、Phase 5（最終調整）

## 注意事項

- 各タスクは適切な粒度でコミットする
- 実装後は必ず lint、format、type-check を実行
- API の型は自動生成されたものを使用
- ドキュメントは実装と並行して更新
- v1 との互換性を意識（URL 構造、API 形式等）
