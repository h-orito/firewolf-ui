# デプロイメント手順

## 概要

FIREWOLF UI v2は、Dockerコンテナとして構築され、GitHub Container Registry (ghcr.io) を経由してKubernetesクラスタにデプロイされます。

## アーキテクチャ

- **コンテナレジストリ**: GitHub Container Registry (ghcr.io)
- **CI/CD**: GitHub Actions
- **デプロイ環境**: Kubernetes
- **コンテナランタイム**: Docker

## Dockerイメージ

### Dockerfile構成

マルチステージビルドを採用し、本番用の軽量イメージを作成します：

1. **ビルドステージ**: 依存関係のインストールとNext.jsアプリケーションのビルド
2. **実行ステージ**: 本番用の最小限の依存関係のみを含む

### ベースイメージ

- Node.js 20 LTS (Alpine Linux)

## CI/CD パイプライン

### GitHub Actionsワークフロー

masterブランチへのpush時に以下の処理を実行：

1. **品質チェック**
   - Lint実行
   - 型チェック
   - テスト実行

2. **Dockerイメージビルド**
   - マルチステージビルドでイメージ作成
   - タグ付け: `latest` と `commit-sha`

3. **レジストリへのpush**
   - ghcr.ioへイメージをpush

### 必要なGitHub Secrets

以下のSecretsをリポジトリに設定する必要があります：

- `GHCR_TOKEN`: GitHub Container Registryへのアクセストークン
- 環境変数（本番用）:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_API_BASE_URL`

## 環境変数

### ビルド時環境変数（NEXT_PUBLIC_*）

Dockerイメージビルド時に設定：

```dockerfile
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... その他の環境変数
```

### 実行時環境変数

Kubernetesの ConfigMap/Secret で管理：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: firewolf-ui-config
data:
  NODE_ENV: "production"
  PORT: "3000"
```

## ローカルでのビルドテスト

```bash
# Dockerイメージのビルド
docker build -t firewolf-ui:local .

# ローカルでの実行
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=xxx \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx \
  # ... その他の環境変数
  firewolf-ui:local
```

## Kubernetesデプロイメント

### マニフェスト管理

Kubernetesマニフェストは別リポジトリで管理（GitOps）

### デプロイメント戦略

- ローリングアップデート
- レプリカ数: 最小2（高可用性のため）
- ヘルスチェック: `/api/health`
- ReadinessProbe/LivenessProbe設定

### リソース設定（推奨）

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

## 監視とログ

### ヘルスチェック

`/api/health` エンドポイントを実装し、以下を確認：

- アプリケーションの起動状態
- 外部API接続確認（オプション）

### ログ出力

- 標準出力（stdout）にJSON形式で出力
- Kubernetesのログ収集システムで集約

## トラブルシューティング

### Dockerイメージビルドエラー

1. Node.jsバージョンの確認
2. pnpm-lock.yamlの整合性確認
3. ビルドキャッシュのクリア

### デプロイ後の確認事項

1. ポッドの起動確認
   ```bash
   kubectl get pods -l app=firewolf-ui
   ```

2. ログの確認
   ```bash
   kubectl logs -f deployment/firewolf-ui
   ```

3. サービスの疎通確認
   ```bash
   kubectl port-forward svc/firewolf-ui 3000:3000
   ```

### ロールバック

問題が発生した場合、以前のイメージタグを指定してロールバック：

```bash
kubectl set image deployment/firewolf-ui firewolf-ui=ghcr.io/[org]/firewolf-ui:[previous-commit-sha]
```