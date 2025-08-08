# 推奨コマンド一覧

## 基本開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 本番ビルドのプレビュー
pnpm start
```

## 品質チェック（必須実行）

```bash
# ESLintによるコードの品質チェック
pnpm lint

# Prettierによるコードフォーマット
pnpm format

# TypeScriptの型チェック
pnpm type-check
```

## テスト

```bash
# 単体テスト実行
pnpm test

# ウォッチモードでテスト実行
pnpm test:watch

# カバレッジ測定
pnpm test:coverage

# E2Eテスト実行
pnpm test:e2e

# UI付きでE2Eテスト実行
pnpm test:e2e:ui
```

## API型生成

```bash
# OpenAPI仕様からTypeScript型を生成
pnpm generate:api
```

## システムコマンド（Darwin）

```bash
# ディレクトリ一覧表示
ls -la

# ファイル検索
find . -name "*.tsx"

# 文字列検索
grep -r "useState" src/

# プロセス確認
ps aux | grep node

# ポート確認
lsof -i :3000
```

## 開発フロー必須手順

1. 実装前: `.claude/bugs.md`, `.claude/features.md`, `.claude/tasks.md` 確認
2. 実装後: `pnpm lint && pnpm format && pnpm type-check` 実行
3. テスト: `pnpm test` 実行
4. コミット前: 全ての品質チェックとテストをパス
