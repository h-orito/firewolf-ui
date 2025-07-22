# v1 状態管理

## Vuexストア構成

v1ではVuexによるモジュール分割型の状態管理を採用しています。

### ストアモジュール

#### authモジュール
認証状態とユーザー情報の管理

```typescript
// store/auth.js
export const state = () => ({
  user: null,
  isAuthenticated: false
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  }
}

export const actions = {
  async login({ commit }, provider) {
    const user = await firebase.auth().signInWithPopup(provider)
    commit('SET_USER', user)
  }
}

export const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
}
```

#### villageモジュール
現在の村情報、メッセージ、参加状況の管理

```typescript
// store/village.js
export const state = () => ({
  village: null,
  messages: [],
  participants: [],
  situation: null
})

export const actions = {
  async ACTION_FIND_VILLAGE({ commit }, { villageId }) {
    const village = await api.fetchVillage(villageId)
    commit('SET_VILLAGE', village)
  }
}
```

#### village-settingsモジュール
ユーザー設定（文字サイズ、テーマ等）の管理

```typescript
// store/village-settings.js
export const state = () => ({
  messageFontSize: 'normal',
  isDarkTheme: false,
  messageDisplay: {
    isDispDate: true,
    isDispAuthor: true
  }
})
```

## ストア使用パターン

### アクションの呼び出し

```typescript
// コンポーネント内での使用
await this.$store.dispatch('village/ACTION_FIND_VILLAGE', {
  villageId: this.$route.params.id
})
```

### ゲッターの使用

```typescript
// 算出プロパティでの使用
private get village(): Village {
  return this.$store.getters['village/getVillage']
}

// テンプレート内での使用
<template>
  <div v-if="$store.getters['auth/isAuthenticated']">
    ログイン済み
  </div>
</template>
```

### ミューテーションのコミット

直接コミットは避け、アクション経由で状態を更新：

```typescript
// ✗ 悪い例
this.$store.commit('village/SET_MESSAGES', messages)

// ✓ 良い例
await this.$store.dispatch('village/ACTION_FETCH_MESSAGES')
```

## アクションタイプの管理

アクションタイプは定数として `action-types.ts` で管理：

```typescript
// store/action-types.ts
export const VILLAGE = {
  FIND: 'village/ACTION_FIND_VILLAGE',
  FETCH_MESSAGES: 'village/ACTION_FETCH_MESSAGES',
  PARTICIPATE: 'village/ACTION_PARTICIPATE'
}

// 使用例
await this.$store.dispatch(VILLAGE.FIND, { villageId })
```

## 永続化

一部の設定はlocalStorageに永続化：

```typescript
// plugins/persistedstate.js
export default ({ store }) => {
  createPersistedState({
    key: 'firewolf-settings',
    paths: ['village-settings']
  })(store)
}
```

## ベストプラクティス

### 1. 責務の分離
- UIの状態はコンポーネント内で管理
- アプリケーション全体で共有する状態のみストアで管理

### 2. 非同期処理
- アクション内で非同期処理を実行
- async/awaitパターンを使用
- エラーハンドリングを忘れずに

### 3. 型安全性
- TypeScriptの型定義を活用
- ストアの型定義を明確に

### 4. パフォーマンス
- 大きなデータは正規化して管理
- 不要な再計算を避けるためgettersを活用