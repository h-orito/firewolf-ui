# FIREWOLF 開発環境セットアップ

## 前提条件

- Node.js 22 LTS以上
- pnpm 9.0以上 (推奨) または npm 10以上
- Git 2.40以上
- VSCode (推奨エディタ)

## 1. プロジェクトセットアップ

```bash
# リポジトリをクローン
git clone [repository-url]
cd firewolf-ui

# 依存関係インストール
pnpm install

# 環境変数設定（.env.exampleをコピーして編集）
cp .env.example .env
```

## 2. 環境変数設定

`.env`ファイルに以下の環境変数を設定：

```bash
# Firebase設定（必須）
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# API設定
API_BASE_URL=http://localhost:8080
```

## 3. 開発コマンド

```bash
# 開発サーバー起動（http://localhost:3011）
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview

# 静的サイト生成
pnpm generate
```

## 4. コード品質管理

```bash
# リント実行
pnpm lint

# 自動修正付きリント
pnpm lint --fix

# フォーマット実行
pnpm format

# 型チェック
pnpm type-check

# API型定義生成
pnpm generate:api-types
```

### コミット前の必須チェック

```bash
# 以下のコマンドをすべて実行してエラーがないことを確認
pnpm lint && pnpm format && pnpm type-check
```

## 5. VSCode推奨設定

### 必須拡張機能

- Vue - Official
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- EditorConfig for VS Code

### 設定ファイル

プロジェクトルートの`.vscode/settings.json`が自動的に適用されます。

## 6. トラブルシューティング

### ポート3011が使用中

```bash
# プロセスを確認
lsof -i :3011

# 該当プロセスを終了
kill -9 [PID]
```

### 依存関係の問題

```bash
# クリーンインストール
rm -rf node_modules .nuxt
pnpm install
```

## 7. 関連ドキュメント

- コードスタイル: `doc/guidelines/code-style-guidelines.md`
- API型定義: `doc/guidelines/api-types-guidelines.md`
- コンポーネント配置: `doc/guidelines/component-guidelines.md`
- 実装ガイドライン: `doc/guidelines/implementation-guidelines.md`
