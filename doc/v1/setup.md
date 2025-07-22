# v1 開発環境セットアップ

## 前提条件

- Node.js（最新版推奨）
- npm
- [firewolf-api](https://github.com/h-orito/firewolf-api) のセットアップ

## セットアップ手順

### 1. プロジェクトのクローン

好きな場所にこのプロジェクトをクローンしてください。

### 2. 依存関係のインストール

```bash
cd v1
npm ci
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

開発サーバーは http://localhost:3000/ で起動します。

### 4. バックエンドAPIの起動

[firewolf-api](https://github.com/h-orito/firewolf-api) を起動しておく必要があります。

## 開発コマンド一覧

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# 静的サイト生成
npm run generate

# ESLintの実行
npm run lint
```

## 注意事項

- バックエンドAPIが起動していないと、ほとんどの機能が動作しません
- 初回起動時は依存関係のインストールに時間がかかることがあります