# v1 API通信

## API通信の実装パターン

### 中央集約型API管理

全てのAPIコールは `v1/components/village/village-api.ts` に集約されています。

```typescript
// API呼び出し例
const response = await api.postVillageAction(
  this,
  villageId,
  myselfId,
  actionBody
)
```

### Axiosインターセプター

`v1/plugins/axios.js` でAxiosのインターセプターを設定しています。

#### リクエストインターセプター
- JWTトークンの自動付与
- 認証ヘッダーの設定

```javascript
// リクエスト時の処理
$axios.onRequest(config => {
  const token = await getIdToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
})
```

#### レスポンスインターセプター
- エラーハンドリング
- トークンのリフレッシュ処理
- Toast通知による エラー表示

```javascript
// エラー時の処理
$axios.onError(error => {
  if (error.response?.status === 401) {
    // トークンリフレッシュ処理
  }
  // エラー通知
  toast.open({
    message: 'エラーが発生しました',
    type: 'is-danger'
  })
})
```

### APIエンドポイントの管理

環境変数で管理：
```
# .env
API_BASE_URL=http://localhost:8080
```

### パラメータシリアライゼーション

`qs` ライブラリを使用してパラメータをシリアライズ：

```typescript
import qs from 'qs'

const params = {
  villageId: 1,
  messageType: ['NORMAL_SAY', 'WEREWOLF_SAY']
}

const queryString = qs.stringify(params, {
  arrayFormat: 'repeat' // messageType=NORMAL_SAY&messageType=WEREWOLF_SAY
})
```

## 主要なAPIエンドポイント

### 村関連
- `GET /api/villages` - 村一覧取得
- `GET /api/villages/{id}` - 村詳細取得
- `POST /api/villages` - 村作成
- `POST /api/villages/{id}/action` - アクション実行

### メッセージ関連
- `GET /api/villages/{id}/messages` - メッセージ一覧取得
- `POST /api/villages/{id}/say` - 発言投稿

### 参加者関連
- `GET /api/villages/{id}/participants` - 参加者一覧取得
- `POST /api/villages/{id}/participate` - 村に参加
- `POST /api/villages/{id}/leave` - 村から退村

## エラーハンドリング

### HTTPステータスコード別の処理
- `401 Unauthorized` - 認証エラー、トークンリフレッシュ
- `403 Forbidden` - 権限エラー
- `404 Not Found` - リソースが見つからない
- `500 Internal Server Error` - サーバーエラー

### エラー通知
Buefyのtoast機能を使用してユーザーに通知：

```typescript
this.$buefy.toast.open({
  message: error.response?.data?.message || 'エラーが発生しました',
  type: 'is-danger',
  position: 'is-top'
})
```