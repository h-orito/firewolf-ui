# FIREWOLF UI v2 タスク管理

## タスク一覧

### Phase 1: 基本セットアップとコアコンポーネント

#### 1.1 プロジェクト初期設定
- [x] Next.js 15プロジェクトの作成（App Router使用）
- [x] TypeScript 5の設定
- [x] ESLint/Prettierの設定
- [x] Tailwind CSSの設定
- [x] 基本的なディレクトリ構造の作成

#### 1.2 開発環境設定
- [x] pnpmのセットアップ
- [x] 環境変数の設定（.env.local）
- [x] Gitignoreの更新
- [x] package.jsonのスクリプト設定（dev, build, lint, format, type-check）

#### 1.3 OpenAPI連携
- [x] openapi-typescriptとopenapi-fetch（またはorval）のセットアップ
- [x] API型生成スクリプトの作成（pnpm generate:api）
- [x] 生成された型の動作確認

#### 1.4 基本UIコンポーネント
- [x] shadcn/uiのセットアップ
- [x] 基本的なUIコンポーネントの追加（Button, Input, Card等）
- [x] 等幅フォントの設定（村メッセージ用）

#### 1.5 認証システム
- [x] Firebase Authenticationの設定
- [x] 認証用のZustandストア作成（stores/auth.ts）
- [x] useAuthフックの実装
- [x] Google/Twitter認証の実装
- [x] 認証状態の永続化

### Phase 2: 主要画面の実装

#### 2.1 レイアウトコンポーネント
- [x] ルートレイアウト（app/layout.tsx）の実装
- [x] ヘッダーコンポーネント（components/layout/header.tsx）
- [x] フッターコンポーネント（components/layout/footer.tsx）
- [x] ナビゲーションコンポーネント（components/navigation/）

#### 2.2 トップページ
- [x] app/(public)/page.tsxの実装
- [x] 村一覧の表示
- [x] ユーザー情報の表示（ログイン時）
- [x] お知らせ表示

#### 2.3 村一覧画面
- [x] 村一覧API連携（TanStack Query使用）
- [x] フィルタリング機能
- [x] ページネーション（クライアントサイド実装完了）
- [x] 村カードコンポーネント

#### 2.4 村画面（表示のみ）
- [x] app/(public)/village/[id]/page.tsxの実装
- [x] 村情報の取得と表示
- [x] メッセージ一覧の表示（等幅フォント適用）
- [x] 参加者一覧の表示
- [x] 村の状態表示（プロローグ、進行中、エピローグ等）

#### 2.5 プレイヤー戦績画面
- [ ] app/(public)/player-record/[id]/page.tsxの実装
- [ ] プレイヤー情報の取得と表示
- [ ] 戦績統計の表示
- [ ] グラフ表示（recharts使用）

### Phase 3: インタラクティブ機能

#### 3.1 メッセージ投稿機能
- [ ] メッセージ投稿フォームコンポーネント
- [ ] 発言種別の切り替え（通常発言、独り言等）
- [ ] 文字数カウント
- [ ] メッセージのリアルタイム更新（ポーリング）

#### 3.2 アクション実行機能
- [ ] 投票機能の実装
- [ ] 能力実行（占い、護衛等）の実装
- [ ] コミット機能
- [ ] アクション実行時のバリデーション

#### 3.3 参加・退村機能
- [ ] 村への参加フォーム
- [ ] キャラクター選択
- [ ] 役職希望の設定
- [ ] 退村処理

#### 3.4 村内設定
- [ ] 文字サイズ設定
- [ ] 表示設定（日時表示、発言者名表示等）
- [ ] フィルタリング設定
- [ ] 設定の永続化（localStorage）

### Phase 4: 管理機能とその他の画面

#### 4.1 村作成機能
- [ ] app/(auth)/village/create/page.tsxの実装
- [ ] 村作成フォーム（React Hook Form + Zod）
- [ ] キャラチップ選択
- [ ] 役職構成設定
- [ ] ルール設定

#### 4.2 設定画面
- [ ] app/(auth)/setting/page.tsxの実装
- [ ] プロフィール設定
- [ ] 通知設定
- [ ] その他の個人設定

#### 4.3 静的ページ
- [ ] ルール説明ページ（app/(public)/rule/page.tsx）
- [ ] FAQ（app/(public)/faq/page.tsx）
- [ ] About（app/(public)/about/page.tsx）

#### 4.4 エラー処理
- [ ] エラーページ（error.tsx）
- [ ] 404ページ（not-found.tsx）
- [ ] グローバルエラーハンドリング

### Phase 5: 最終調整とドキュメント

#### 5.1 パフォーマンス最適化
- [ ] 画像最適化（next/image）
- [ ] フォント最適化（next/font）
- [ ] バンドルサイズの確認と最適化

#### 5.2 PWA対応
- [ ] next-pwaの設定
- [ ] マニフェストファイルの作成
- [ ] Service Workerの設定

#### 5.3 テスト
- [ ] ユニットテストの作成（重要なロジック）
- [ ] 統合テストの作成（主要な機能）
- [ ] E2Eテストの作成（主要なユーザーフロー）

#### 5.4 ドキュメント作成
- [ ] doc/v2/README.mdの作成
- [ ] doc/v2/setup.mdの作成
- [ ] doc/v2/architecture.mdの作成
- [ ] doc/v2/migration-guide.mdの作成
- [ ] その他必要なドキュメントの作成

#### 5.5 デプロイ準備
- [ ] Netlify設定ファイルの作成
- [ ] 環境変数の設定
- [ ] ビルドコマンドの確認
- [ ] デプロイテスト

## 優先順位

1. **最優先**: Phase 1（基本セットアップ）
2. **高**: Phase 2（主要画面）、Phase 3.1（メッセージ投稿）
3. **中**: Phase 3（その他のインタラクティブ機能）、Phase 4.1（村作成）
4. **低**: Phase 4（その他の管理機能）、Phase 5（最終調整）

## 注意事項

- 各タスクは適切な粒度でコミットする
- 実装後は必ずlint、format、type-checkを実行
- APIの型は自動生成されたものを使用
- ドキュメントは実装と並行して更新
- v1との互換性を意識（URL構造、API形式等）