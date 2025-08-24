# Code Style & Conventions

## TypeScript Configuration
- Target: ES2018
- Module: ESNext
- Strict mode: true (ただしnoImplicitAny: false)
- Experimental decorators: true
- Path aliases: `~/*` と `@/*` でプロジェクトルートを参照

## Code Formatting
- **Prettier設定**:
  - セミコロン: なし (`semi: false`)
  - シングルクォート使用 (`singleQuote: true`)
  - インデント: スペース2つ

## ESLint Rules
- Vue.js + Nuxt.js + TypeScript用の設定
- `@nuxtjs/eslint-config-typescript`を継承
- Prettierとの統合
- 特殊ルール:
  - `vue/no-v-html`: off (エスケープ処理は自前で実装)
  - `camelcase`: off
  - 未使用変数の警告はoff
  - production環境でのconsole/debuggerはエラー

## Vue Component Style
- Single File Components (.vue)を使用
- TypeScriptサポート (`<script lang="ts">`)
- SCSSサポート (`<style lang="scss">`)
- Class-based components (vue-property-decorator使用)

## Directory Structure
- `components/`: 再利用可能なVueコンポーネント
- `pages/`: Nuxt.jsのルーティング用ページコンポーネント
- `store/`: Vuex store modules
- `middleware/`: Nuxt.jsミドルウェア
- `plugins/`: Nuxt.jsプラグイン
- `assets/`: スタイルシートや画像
- `static/`: 静的ファイル