# FIREWOLF Nuxt4移行 開発環境構築手順書

## 概要

本資料では、FIREWOLF Nuxt4移行プロジェクトの開発環境構築手順を詳しく説明します。

## 前提条件

### 必要なソフトウェア
- Node.js 22 LTS以上
- pnpm 9.0以上 (推奨) または npm 10以上
- Git 2.40以上
- VSCode (推奨エディタ)

### 推奨システム要件
- OS: macOS 13以上 / Windows 11 / Ubuntu 22.04以上
- RAM: 16GB以上
- ストレージ: 空き容量 10GB以上

## 1. Node.js環境設定

### 1.1 Node.js 22インストール

#### macOS (Homebrew使用)
```bash
# Homebrewがない場合は先にインストール
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 22インストール
brew install node@22
brew link node@22

# バージョン確認
node --version  # v22.x.x が表示されることを確認
npm --version   # 10.x.x 以上が表示されることを確認
```

#### Windows (nvm-windows使用)
```powershell
# nvm-windowsをGitHubから入手してインストール
# https://github.com/coreybutler/nvm-windows/releases

# PowerShellを管理者権限で実行
nvm install 22
nvm use 22

# バージョン確認
node --version
npm --version
```

#### Ubuntu
```bash
# NodeSourceリポジトリ追加
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Node.js 22インストール
sudo apt-get install -y nodejs

# バージョン確認
node --version
npm --version
```

### 1.2 pnpm インストール (推奨)
```bash
# pnpm インストール
npm install -g pnpm@latest

# バージョン確認
pnpm --version  # 9.0以上が表示されることを確認
```

## 2. プロジェクト初期化

### 2.1 Nuxt 4プロジェクト作成
```bash
# Nuxtプロジェクト作成
npx nuxi@latest init firewolf-ui-v4

# ディレクトリ移動
cd firewolf-ui-v4

# 依存関係インストール
pnpm install

# 開発サーバー起動テスト
pnpm dev
```

### 2.2 TypeScript設定
```bash
# TypeScript追加
pnpm add -D typescript @nuxt/typescript-build

# tsconfig.json作成（Nuxt 4では自動生成される）
```

### 2.3 Gitリポジトリ初期化
```bash
# Git初期化
git init

# .gitignoreファイル作成（Nuxtプロジェクトに含まれる）

# 初回コミット
git add .
git commit -m "feat: initial Nuxt 4 project setup"
```

## 3. @nuxt/ui導入

### 3.1 @nuxt/uiインストール
```bash
# @nuxt/ui とその依存関係をインストール
pnpm add @nuxt/ui

# Tailwind CSSが自動で含まれることを確認
```

### 3.2 Nuxt設定
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui'
  ],
  
  // TypeScript設定
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // CSS設定
  css: [],
  
  // 環境変数
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      // 他のFirebase設定...
    }
  }
})
```

### 3.3 動作確認
```vue
<!-- app.vue -->
<template>
  <div>
    <UButton>Hello Nuxt UI!</UButton>
  </div>
</template>
```

## 4. 開発ツール設定

### 4.1 ESLint設定
```bash
# ESLint関連パッケージインストール
pnpm add -D @nuxt/eslint-config eslint prettier
```

```javascript
// eslint.config.js
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    stylistic: true,
  },
})
```

### 4.2 Prettier設定
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 120,
  "endOfLine": "auto"
}
```

### 4.3 package.json スクリプト
```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "type-check": "nuxt typecheck"
  }
}
```

## 5. VSCode設定

### 5.1 必須拡張機能
以下の拡張機能をインストール：

```json
// .vscode/extensions.json
{
  "recommendations": [
    "Vue.volar",
    "antfu.iconify",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 5.2 VSCode設定
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.associations": {
    "*.vue": "vue"
  },
  "emmet.includeLanguages": {
    "vue-html": "html"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.inlayHints.missingProps": true,
  "vue.inlayHints.inlineHandlerLeading": true
}
```

## 6. Tailwind CSS カスタマイズ

### 6.1 現行色の移植
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // FIREWOLF固有色
        'primary': '#3991f4',
        'primary-dark': 'rgb(20, 180, 255)',
        
        // 人狼ゲーム発言色
        'werewolf-say': '#f2cece',
        'werewolf-say-dark': '#f2aeae',
        'sympathize-say': '#cef2ce',
        'sympathize-say-dark': '#aef2ae',
        'lovers-say': '#f2dede',
        'lovers-say-text': '#cc2222',
        'monologue-say': '#ddd',
        'grave-say': '#ceedf2',
        'spectate-say': '#f2f2ce',
        'action-say': '#dfdfc9',
        'secret-say': '#cecef2',
        
        // システムメッセージ色
        'private-system': '#eee',
        'seer-system': '#efe',
        'psychic-system': '#eef',
        'werewolf-system': '#fee',
        'mason-system': '#fec',
        'lovers-system': '#fef',
        'fox-system': '#ffc',
        'creator-say': '#fef',
        
        // ダークモード色
        'primary-dark-bg': '#404040',
        'werewolf-dark-bg': '#403333',
        'seer-dark-bg': '#334033',
        'psychic-dark-bg': '#333340',
        'mason-dark-bg': '#404033',
        'fox-dark-bg': '#404033',
        'creator-dark-bg': '#403340'
      }
    }
  }
}
```

## 7. Firebase設定

### 7.1 Firebase SDK インストール
```bash
pnpm add firebase @vuefire/nuxt
```

### 7.2 環境変数設定
```bash
# .env ファイル作成
cp .env.example .env

# 以下の環境変数を設定
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

### 7.3 Firebase設定
```typescript
// nuxt.config.ts に追加
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@vuefire/nuxt'
  ],
  
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    }
  }
})
```

## 8. 状態管理設定

### 8.1 Pinia インストール
```bash
pnpm add @pinia/nuxt pinia
```

### 8.2 Pinia設定
```typescript
// nuxt.config.ts に追加
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@vuefire/nuxt',
    '@pinia/nuxt'
  ]
})
```

## 9. テスト環境設定

### 9.1 Vitest インストール
```bash
pnpm add -D vitest @vue/test-utils jsdom @vitejs/plugin-vue
```

### 9.2 Playwright インストール
```bash
pnpm add -D @playwright/test
npx playwright install
```

### 9.3 テスト設定
```javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

## 10. 開発フロー確認

### 10.1 基本動作確認
```bash
# 開発サーバー起動
pnpm dev

# TypeScriptチェック
pnpm type-check

# リント実行
pnpm lint

# フォーマット実行
pnpm format
```

### 10.2 動作確認項目
- [ ] 開発サーバーが http://localhost:3000 で起動する
- [ ] @nuxt/uiコンポーネントが表示される
- [ ] Tailwind CSSが適用される
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] Hot Reloadが動作する

## トラブルシューティング

### よくある問題と解決策

#### Node.js バージョン問題
```bash
# .nvmrcファイル作成
echo "22" > .nvmrc

# nvm使用時
nvm use
```

#### pnpm vs npm 混在問題
```bash
# node_modules削除
rm -rf node_modules

# lockファイル削除
rm package-lock.json yarn.lock pnpm-lock.yaml

# pnpmで再インストール
pnpm install
```

#### VSCode TypeScript認識問題
1. VSCode再起動
2. TypeScript拡張機能の無効化・有効化
3. `cmd + shift + p` → "TypeScript: Restart TS Server"

#### Tailwind CSS適用されない
1. `tailwind.config.js`の設定確認
2. CSS importの確認
3. ブラウザキャッシュクリア

これで開発環境の構築が完了です。問題が発生した場合は、各ツールの公式ドキュメントを参照するか、チームに相談してください。