# Suggested Commands

## Setup & Installation

```bash
# 依存関係のインストール（初回）
npm ci

# 依存関係のインストール（package.jsonを更新した場合）
npm install
```

## Development

```bash
# 開発サーバーの起動 (http://localhost:3000)
npm run dev

# firewolf-apiも別途起動が必要
```

## Build & Production

```bash
# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm run start

# 静的サイト生成
npm run generate
```

## Code Quality & Testing

```bash
# ESLintによるコード検証
npm run lint

# プリコミット時のlint（自動実行）
npm run precommit
```

## Notes

- firewolf-apiを事前にセットアップして起動しておく必要があります
- 環境変数は.envファイルで管理（Firebaseの設定など）
