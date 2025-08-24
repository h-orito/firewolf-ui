# Task Completion Checklist

タスク完了時には以下のコマンドを実行して、コードの品質を確認してください：

## 必須チェック項目

### 1. Linting

```bash
npm run lint
```

- ESLintによるコード検証を実行
- TypeScript、JavaScript、Vueファイルをチェック
- エラーがある場合は修正が必要

### 2. TypeScript型チェック

- ビルド時に自動的に型チェックが実行される
- `npm run build`でビルドが成功することを確認

### 3. 開発サーバーでの動作確認

```bash
npm run dev
```

- http://localhost:3000 で正常に動作することを確認
- コンソールにエラーがないことを確認

## 推奨事項

- 新機能追加時は、既存のコードスタイルに従う
- コンポーネントは`components/`の適切なサブディレクトリに配置
- Prettierの設定に従ったフォーマット（セミコロンなし、シングルクォート）
- 環境変数が必要な場合は.envファイルに追加
