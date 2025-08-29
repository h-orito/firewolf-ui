# API通信パターン分析

## 概要

現行システム（Nuxt 2 + axios）で使用されているAPI通信の詳細な分析結果です。
$fetchベースのAPI clientへの移行時に参照する通信パターンとエラーハンドリングを記録します。

## Axios設定

### 基本設定 (nuxt.config.ts)

```typescript
axios: {
  baseURL: process.env.FIREWOLF_API_BASEURL || 'http://localhost:8087/firewolf'
}
```

### プラグイン設定 (plugins/axios.js)

#### リクエストインターセプター

```javascript
$axios.onRequest(async (config) => {
  let token = app.$cookies.get('id-token')
  const user = store.state.auth.user
  if (token && user) {
    token = await refreshTokenIfNeeded(token, app, user)
    config.headers.common.Authorization = 'Bearer ' + token
  }
  return config
})
```

**機能**:

- Firebase ID Token を Authorization header に自動付与
- トークン有効期限チェック・自動更新
- 50分後に再取得する有効期限管理

#### エラーハンドリング

```javascript
$axios.onError((error) => {
  const code = parseInt(error.response && error.response.status)
  if (code === 404 && error.response.data.status === 499) {
    return // business errorは個別にハンドリング
  }
  Toast.open({
    type: 'is-danger',
    message: 'サーバとの接続でエラーが発生しました。',
    position: 'is-top',
    duration: 5000,
    queue: false
  })
})
```

**機能**:

- ビジネスエラー（status: 499）は個別処理
- その他のエラーはToast通知で表示
- Buefyの ToastProgrammatic 使用

#### トークン更新処理

```javascript
async function refreshTokenIfNeeded(token, app, user) {
  const expired = new Date(app.$cookies.get('id-token-check-date'))
  if (new Date().getTime() < expired.getTime()) {
    return token // 有効期限内
  }
  // Firebase から新しいトークン取得
  return await user.getIdToken(true).then((newIdToken) => {
    // Cookie更新処理
    app.$cookies.set('id-token', newIdToken, ...)
    app.$cookies.set('id-token-check-date', newExpired, ...)
    return newIdToken
  })
}
```

## API エンドポイント一覧

### 1. 認証関連API

```typescript
// プレイヤー情報取得
GET / my - player
```

- **用途**: ログイン後のプレイヤー情報取得
- **認証**: 必須 (Bearer Token)
- **実装**: store/modules/auth.ts

### 2. 村関連API

#### 村情報取得

```typescript
// 村詳細情報取得
GET / village / { villageId }

// デバッグ村情報取得
GET / village / { villageId } / debug
```

#### メッセージ関連

```typescript
// メッセージ一覧取得
GET /village/{villageId}/day/{day}/time/{noonnight}/message-list

// パラメータ例:
{
  message_type_list: string[],       // メッセージタイプフィルタ
  participant_id_list: number[],     // 参加者IDフィルタ
  to_participant_id_list: number[],  // 宛先参加者IDフィルタ
  keyword: string,                   // キーワードフィルタ
  page_size: number,                 // ページサイズ
  page_num: number,                  // ページ番号
  is_disp_latest: boolean           // 最新表示フラグ
}
```

### 3. 参加者関連API

```typescript
// 参加者状況取得
GET / village / { villageId } / situation
```

## API Client実装パターン

### 1. village-api.ts パターン

```typescript
const api = {
  fetchVillage(app: Vue, villageId: number): Promise<Village> {
    return app.$axios.$get(`/village/${villageId}`)
  },

  fetchMessageList(
    app: Vue,
    villageId: number,
    displayDay: VillageDay | null
    // ... その他のパラメータ
  ): Promise<Messages> {
    const params = {
      message_type_list: messageTypeFilter
      // ... その他のパラメータ
    }
    return app.$axios.$get(
      `/village/${villageId}/day/${displayDay!.day}/time/${displayDay!.noonnight}/message-list`,
      {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' })
      }
    )
  }
}
```

### 2. Store内でのAPI呼び出し

```typescript
// auth store
const myPlayer = await self.$axios.$get('/my-player')

// village store
const village = await api.fetchVillage(<any>this, state.villageId)
```

## パラメータシリアライゼーション

### Query String構築

```typescript
import qs from 'qs'

// 配列パラメータをrepeat形式で送信
paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })

// 結果例: ?message_type_list=SAY&message_type_list=WEREWOLF_SAY
```

## エラーハンドリングパターン

### 1. ビジネスエラー (status: 499)

```typescript
// 個別のコンポーネントで処理
if (error.response.status === 404 && error.response.data.status === 499) {
  // ビジネスロジック固有エラー処理
}
```

### 2. システムエラー

```typescript
// axios pluginで自動的にToast表示
Toast.open({
  type: 'is-danger',
  message: 'サーバとの接続でエラーが発生しました。',
  position: 'is-top',
  duration: 5000,
  queue: false
})
```

## $fetch移行計画

### 1. 基本的な置き換え

```typescript
// 現行
app.$axios.$get('/my-player')

// 移行後
$fetch('/my-player', {
  baseURL: useRuntimeConfig().public.apiBaseUrl
})
```

### 2. インターセプター相当の実装

```typescript
// composable: useApiClient.ts
export const useApiClient = () => {
  const { $fetch } = useNuxtApp()
  const authStore = useAuthStore()

  return $fetch.create({
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    onRequest({ request, options }) {
      // Authorization header 付与
      const token = await getValidToken()
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      }
    },
    onResponseError({ response, error }) {
      // エラーハンドリング
      if (response.status === 404 && response._data?.status === 499) {
        return // ビジネスエラー
      }
      // Toast表示
      useNuxtApp().$toast.error('サーバとの接続でエラーが発生しました。')
    }
  })
}
```

### 3. パラメータシリアライゼーション

```typescript
// URLSearchParamsまたはqs.stringifyを継続使用
const params = new URLSearchParams()
messageTypeList.forEach((type) => params.append('message_type_list', type))

// または
import qs from 'qs'
const queryString = qs.stringify(params, { arrayFormat: 'repeat' })
```

## 移行時の注意点

### 1. Firebase認証との統合

- ID Token取得・更新ロジックの移行
- Cookie管理の Nuxt 3 対応 (`useCookie()`)

### 2. エラーハンドリング

- Buefy Toast → @nuxt/ui Toast 対応
- ビジネスエラー判定ロジックの継続

### 3. 型安全性

- API レスポンスの型定義継続
- $fetch の型推論活用

### 4. パフォーマンス

- SSR対応時のAPI呼び出し最適化
- キャッシュ戦略の検討

### 5. 開発・本番環境

- 環境変数の Nuxt 3 対応
- `useRuntimeConfig()` の活用

---

**作成日**: 2025-01-24  
**更新者**: Claude Code  
**調査基準**: .old-nuxt2 の plugins/axios.js, village-api.ts, store modules
