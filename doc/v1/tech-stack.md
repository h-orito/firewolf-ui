# v1 技術スタック

## コア技術

### フレームワーク
- **Nuxt.js 2.15.1** - Vue.jsベースのフルスタックフレームワーク（SPAモード）
- **Vue.js 2.x** - プログレッシブJavaScriptフレームワーク
- **TypeScript** - 型安全な開発環境

### UIフレームワーク
- **Buefy 0.9.21** - BulmaベースのVueコンポーネントライブラリ
- **Bulma** - モダンCSSフレームワーク

### 状態管理
- **Vuex 3.x** - Vue.js用の状態管理ライブラリ
- **Vuexfire 3.2.4** - VuexとFirebaseの統合

### 認証
- **Firebase 10.14.0** - 認証とリアルタイムデータベース
  - Google認証
  - Twitter認証

### HTTP通信
- **@nuxtjs/axios 5.13.1** - HTTPクライアント
- **qs** - URLパラメータのシリアライズ

### フォーム・バリデーション
- **VeeValidate 3.3.8** - Vue.js用バリデーションライブラリ
- **vue-datetime 1.0.0-beta.10** - 日時選択コンポーネント

### スタイリング
- **SASS/SCSS** - CSS拡張言語
- **node-sass 4.14.1** - SASSコンパイラ
- **@fortawesome/fontawesome-free-webfonts** - アイコンフォント

### ユーティリティ
- **dayjs 1.8.32** - 軽量な日付操作ライブラリ
- **luxon 1.28.1** - 日付・時刻の高度な操作
- **weekstart 1.0.1** - 週の開始日の管理

### グラフ・チャート
- **Chart.js 2.9.3** - グラフ描画ライブラリ
- **vue-chartjs 3.5.0** - Chart.jsのVueラッパー

### その他
- **nuxt-clipboard2 0.2.1** - クリップボード操作
- **vue-scrollto 2.18.2** - スムーズスクロール
- **cookie-universal-nuxt 2.0.18** - Cookie管理

## 開発ツール

### TypeScript
- **@nuxt/typescript-build 1.0.3** - TypeScriptビルド設定
- **@nuxt/typescript-runtime 2.0.1** - TypeScriptランタイム
- **@nuxt/types 2.14.1** - Nuxt.js TypeScript型定義

### リンター・フォーマッター
- **ESLint 6.8.0** - JavaScriptリンター
- **@nuxtjs/eslint-config-typescript 1.0.2** - TypeScript用ESLint設定
- **Prettier 1.19.1** - コードフォーマッター

### PWA・SEO
- **@nuxtjs/pwa 3.0.0-beta.20** - PWA対応
- **@nuxtjs/sitemap 2.4.0** - サイトマップ生成
- **@nuxtjs/google-analytics 2.4.0** - Google Analytics統合

## デコレーター
- **nuxt-property-decorator 2.7.2** - クラスベースコンポーネント用デコレーター
- **vue-property-decorator 8.2.2** - Vue.js用プロパティデコレーター