# セットアップガイド

このドキュメントでは、FIREWOLF UI v2の開発環境セットアップ手順を説明します。

## システム要件

### 必須要件
- **Node.js**: 18.17.0以上（推奨: 22.x LTS）
- **pnpm**: 9.0.0以上（推奨: 最新版）
- **Git**: 2.0以上

### 推奨環境
- **OS**: macOS, Linux, Windows（WSL2推奨）
- **エディタ**: VS Code
- **ブラウザ**: Chrome, Firefox, Safari（最新版）

## 開発環境セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/h-orito/firewolf-ui.git
cd firewolf-ui/v2
```

### 2. pnpmのインストール

Node.jsが既にインストールされている場合：

```bash
npm install -g pnpm@latest
```

または、Node.jsごとインストールする場合は[公式サイト](https://nodejs.org/)からダウンロードしてください。

### 3. 依存関係のインストール

```bash
pnpm install
```

### 4. 環境変数の設定

#### 4.1 環境変数ファイルの作成

```bash
cp .env.example .env.local
```

#### 4.2 Firebase設定

`.env.local`ファイルを編集し、Firebase設定を記入します：

```env
# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# API設定
NEXT_PUBLIC_API_BASE_URL=http://localhost:8087/firewolf
```

Firebase設定は[Firebase Console](https://console.firebase.google.com/)から取得できます。

#### 4.3 その他の設定（必要に応じて）

```env
# 開発環境固有の設定
NODE_ENV=development

# PWA設定（本番環境でのみ有効）
NEXT_PUBLIC_PWA_ENABLED=false
```

### 5. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで http://localhost:3000 にアクセスして、正常に動作することを確認してください。

## VS Code設定

### 推奨拡張機能

以下の拡張機能をインストールすることを推奨します：

- **必須**
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
  - Tailwind CSS IntelliSense

- **推奨**
  - Auto Rename Tag
  - Bracket Pair Colorizer
  - GitLens
  - Thunder Client（API テスト用）

### VS Code設定ファイル

プロジェクトルートに`.vscode/settings.json`を作成：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## API サーバーの設定

### ローカルAPI開発

開発環境では、FIREWOLF APIのローカルインスタンスが必要です。

1. **APIリポジトリのクローン**
   ```bash
   git clone https://github.com/h-orito/firewolf-api.git
   cd firewolf-api
   ```

2. **APIサーバーの起動**
   
   APIサーバーのREADMEに従ってセットアップし、ポート8087で起動してください。

3. **API型の生成**
   
   APIサーバーが起動した状態で：
   ```bash
   cd firewolf-ui/v2
   pnpm generate:api
   ```

### モックAPI使用

API開発が不要な場合、モックデータでの開発も可能です。詳細は開発チームにお問い合わせください。

## テスト環境の設定

### 単体テスト

```bash
# テスト実行
pnpm test

# ウォッチモード
pnpm test:watch

# カバレッジ測定
pnpm test:coverage
```

### E2Eテスト

```bash
# Playwrightブラウザのインストール
pnpm exec playwright install

# E2Eテスト実行
pnpm test:e2e

# UI付きでテスト実行
pnpm test:e2e:ui
```

## よくあるトラブル

### pnpm install でエラーが発生する

**症状**: 依存関係のインストール時にエラーが発生

**解決方法**:
1. Node.js のバージョンを確認（18.17.0以上、推奨: 22.x）
2. pnpm キャッシュをクリア: `pnpm store prune`
3. node_modules を削除して再インストール:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

### 開発サーバーが起動しない

**症状**: `pnpm dev` でエラーが発生

**解決方法**:
1. ポート3000が使用されていないか確認
2. `.env.local` の設定を確認
3. next-pwa関連のエラーの場合:
   ```bash
   pnpm add next-pwa
   ```

### TypeScript エラー

**症状**: 型チェックでエラーが発生

**解決方法**:
1. API型を再生成: `pnpm generate:api`
2. TypeScript の言語サーバーを再起動（VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"）

### Firebase認証が動作しない

**症状**: ログイン・ログアウトができない

**解決方法**:
1. `.env.local` のFirebase設定を確認
2. Firebase Console でドメイン設定を確認
3. ブラウザの開発者ツールでエラーログを確認

## 開発フロー

1. **ブランチ作成**
   ```bash
   git checkout master
   git pull origin master
   git checkout -b feature/your-feature-name
   ```

2. **実装**
   - コードを実装
   - 適宜テストを作成・実行

3. **品質チェック**
   ```bash
   pnpm lint      # リント
   pnpm format    # フォーマット
   pnpm type-check # 型チェック
   pnpm test      # テスト
   ```

4. **コミット**
   ```bash
   git add .
   git commit -m "feat: 新機能の実装"
   ```

5. **プッシュ・プルリクエスト**
   ```bash
   git push origin feature/your-feature-name
   # GitHubでプルリクエストを作成
   ```

## パフォーマンス最適化

### 開発時

- **Fast Refresh**: React Fast Refreshが有効
- **TypeScript増分コンパイル**: tsconfig.jsonで設定済み
- **キャッシュ**: Next.jsの.nextキャッシュを活用

### 本番ビルド

```bash
# 本番ビルド
pnpm build

# ビルド結果の確認
pnpm start
```

## トラブルシューティング

問題が解決しない場合は、以下を試してください：

1. **クリーンインストール**
   ```bash
   rm -rf node_modules .next pnpm-lock.yaml
   pnpm install
   ```

2. **キャッシュクリア**
   ```bash
   pnpm store prune
   ```

3. **エラーログの確認**
   - ブラウザの開発者ツール
   - ターミナルの出力
   - `.next/build-manifest.json` の内容

問題が継続する場合は、開発チームまでお問い合わせください。