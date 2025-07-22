# v1 アーキテクチャ

## ディレクトリ構造

```
v1/
├── components/           # Vueコンポーネント（機能ごとに階層化）
│   ├── common/          # 共通コンポーネント
│   │   ├── footer/      # フッター
│   │   ├── loading/     # ローディング表示
│   │   ├── navbar/      # ナビゲーションバー
│   │   └── validation/  # バリデーション関連
│   ├── create-village/  # 村作成関連コンポーネント
│   ├── index/          # トップページ関連
│   ├── player-record/  # プレイヤー戦績関連
│   ├── rule/           # ルール説明関連
│   ├── scrap/          # スクラップ機能関連
│   ├── type/           # TypeScript型定義
│   └── village/        # 村（ゲーム）関連コンポーネント
│       ├── action/     # アクション実行
│       ├── footer/     # 村画面フッター
│       ├── message/    # メッセージ表示・投稿
│       ├── participate-form/ # 参加フォーム
│       ├── slider/     # スライダーUI
│       └── user-settings/ # ユーザー設定
├── pages/              # ルーティング用ページコンポーネント
├── layouts/            # レイアウトテンプレート
├── store/              # Vuexストア
│   ├── auth.js        # 認証モジュール
│   ├── village.js     # 村データモジュール
│   └── village-settings.js # 村設定モジュール
├── plugins/            # Nuxtプラグイン
│   ├── axios.js       # HTTPクライアント設定
│   ├── firebase.js    # Firebase初期化
│   ├── dayjs.js       # 日付処理
│   └── vee-validate.js # フォームバリデーション
├── middleware/         # ミドルウェア
│   ├── authenticated.js # 認証チェック
│   ├── version.js     # バージョン管理
│   └── google-ads.js  # 広告処理
├── assets/            # CSS/SASSファイル
├── static/            # 静的ファイル（画像、favicon等）
└── nuxt.config.ts     # Nuxt設定ファイル
```

## アーキテクチャの特徴

### コンポーネント設計
- 機能別にディレクトリを分割し、関連するコンポーネントをグループ化
- 共通コンポーネントは `common/` に配置
- 各コンポーネントは単一責任の原則に従って設計

### 状態管理
- Vuexによるグローバル状態管理
- モジュール分割による責務の明確化
- アクションタイプを定数として管理

### ルーティング
- Nuxt.jsの自動ルーティング機能を活用
- ページコンポーネントは `pages/` ディレクトリに配置

### 非同期処理
- axiosによるAPI通信
- async/awaitパターンの使用
- エラーハンドリングの一元化