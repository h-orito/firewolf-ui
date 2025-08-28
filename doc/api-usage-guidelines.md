# API使用ガイドライン

## 重要: API呼び出しの方法

### ❌ 使用禁止

```typescript
// $fetchを直接使用しない
const response = await $fetch<ResponseType>('/api/endpoint')
const response = await $fetch<ResponseType>(
  `${config.public.apiBaseUrl}/endpoint`
)
```

### ✅ 正しい使用方法

```typescript
// 必ずuseApiコンポーザブルを使用する
const { data, error, pending } = await useApi<ResponseType>('/endpoint')

// データの取得
if (data.value) {
  // データを処理
  myData.value = data.value
}
```

## useApiの利点

1. **自動的なベースURL設定**: `useRuntimeConfig()`の設定を自動的に使用
2. **エラーハンドリング**: 統一されたエラー処理
3. **認証ヘッダー**: 必要に応じて自動的にトークンを付与
4. **型安全性**: TypeScriptの型推論が効く

## 使用例

### 基本的な使用例

```typescript
// ページコンポーネントでの使用
const { data } = await useApi<CharachipsView>('/charachip/list')
if (data.value) {
  charachips.value = data.value.list || []
}
```

### エラーハンドリング付きの例

```typescript
const { data, error } = await useApi<VillageView>('/village/1')
if (error.value) {
  console.error('データ取得エラー:', error.value)
  // エラー処理
} else if (data.value) {
  // 正常処理
}
```

### ローディング状態付きの例

```typescript
const { data, pending } = await useApi<PlayerView>('/player/me')
// pending.valueでローディング状態を管理
```

## 注意事項

- API呼び出しは必ず`useApi`コンポーザブルを使用すること
- `$fetch`は内部実装でのみ使用され、コンポーネントやページでは直接使用しない
- APIのベースURLは`nuxt.config.ts`で設定され、`useApi`が自動的に適用する
