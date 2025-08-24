# Project Structure

## ディレクトリ構成

### /components
- 再利用可能なVueコンポーネント
- サブディレクトリ:
  - `common/`: 共通コンポーネント
  - `village/`: 村関連のコンポーネント  
  - `create-village/`: 村作成関連
  - `player-record/`: プレイヤー記録関連
  - `rule/`: ルール表示関連
  - `index/`: トップページ関連
  - `scrap/`: スクラップ機能関連
  - `type/`: 型定義関連
  - `const/`: 定数定義

### /pages
- Nuxt.jsの自動ルーティング用ページコンポーネント
- 主要ページ:
  - `index.vue`: トップページ
  - `village.vue`: 村ページ
  - `village-list.vue`: 村一覧
  - `create-village.vue`: 村作成
  - `player-record.vue`: プレイヤー記録
  - `setting.vue`: 設定
  - `rule.vue`: ルール説明
  - その他ドキュメント系ページ

### /store
- Vuexストア
- `modules/`: ストアモジュール
- `action-types.ts`: アクションタイプ定義
- `index.ts`: ストアのエントリーポイント

### /middleware
- Nuxt.jsミドルウェア
- 認証、バージョン管理、広告表示など

### /plugins
- Nuxt.jsプラグイン
- axios、バリデーション、日付処理など

### /assets
- SASS/SCSSスタイルシート
- CSSファイル
- 画像やフォントなどの静的リソース

### /static
- 直接配信される静的ファイル
- 画像、HTML、アイコンなど