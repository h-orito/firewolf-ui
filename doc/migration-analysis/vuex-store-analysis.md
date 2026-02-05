# Vuex Store 構造分析

## 概要

現行システム（Nuxt 2 + Vuex）で使用されている状態管理構造の詳細な分析結果です。
Pinia への移行時に参照するstore設計とデータフローを記録します。

## Store構成

### 1. ルートStore (store/index.ts)

```typescript
modules: {
  ;(auth, // 認証・ユーザー情報
    village, // 村データ・メッセージ・状況
    villageSettings) // ユーザー設定
}
```

### 2. Action Types (store/action-types.ts)

```typescript
// 認証関連
LOGINOUT = 'LOGINOUT'

// 村関連
INIT_VILLAGE = 'INIT_VILLAGE'
LOAD_VILLAGE = 'LOAD_VILLAGE'
STORE_VILLAGE = 'STORE_VILLAGE'
STORE_MESSAGES = 'STORE_MESSAGES'
STORE_SITUATION = 'STORE_SITUATION'
STORE_FILTERING = 'STORE_FILTERING'
LOAD_DEBUGVILLAGE = 'LOAD_DEBUGVILLAGE'

// ユーザー設定関連
INIT_VILLAGE_SETTINGS = 'INIT_VILLAGE_SETTINGS'
```

## 各Store詳細分析

### 1. Auth Store (store/modules/auth.ts)

#### State

```typescript
{
  authenticated: boolean,  // 認証状態
  player: Player | null,   // プレイヤー情報
  user: FirebaseUser | null // Firebase ユーザー情報
}
```

#### Mutations

- `login(state, { player, user })` - ログイン状態更新
- `logout(state)` - ログアウト処理

#### Actions

- `LOGINOUT({ commit }, { user })` - Firebase認証処理
  - ID Token取得・Cookie保存
  - プレイヤー情報API取得 (`/my-player`)
  - トークン有効期限管理（50分後再取得）

#### Getters

- `isAuthenticated` - 認証済みかどうか
- `getPlayer` - プレイヤー情報取得
- `isLogin` - ログイン状態
- `getUser` - Firebase ユーザー情報取得

#### 🚨注意点

- `logout` mutationでバグあり：`authenticated: true` になっている（正しくは `false`）

### 2. Village Store (store/modules/village.ts)

#### State

```typescript
{
  villageId: number | null,                    // 村ID
  village: Village | null,                     // 村情報
  latestDay: VillageDay | null,               // 最新日情報
  restrictCountMap: Map<string, number> | null, // 発言制限マップ
  messages: Messages | null,                   // メッセージ一覧
  situation: SituationAsParticipant | null,   // 参加者状況
  isFiltering: boolean,                       // フィルタリング状態
  debugVillage: DebugVillage | null           // デバッグ村情報
}
```

#### Mutations

- `init(state, { villageId })` - 村データ初期化
- `saveVillage(state, { village })` - 村情報保存
  - `latestDay`の自動算出
  - `restrictCountMap`の自動生成
- `saveMessages(state, { messages })` - メッセージ保存
- `saveSituation(state, { situation })` - 状況保存
- `saveFiltering(state, { isFiltering })` - フィルタ状態保存
- `saveDebugVillage(state, { debugVillage })` - デバッグ情報保存

#### Actions

- `INIT_VILLAGE` - 村初期化
- `LOAD_VILLAGE` - 村情報読み込み
- `STORE_MESSAGES` - メッセージ保存（null→データの2段階）
- `STORE_SITUATION` - 状況保存
- `STORE_FILTERING` - フィルタ状態保存
- `LOAD_DEBUGVILLAGE` - デバッグ村読み込み

#### API連携

`village-api.ts`を通じてAPIアクセス:

- `fetchVillage(villageId)` - 村情報取得
- `fetchDebugVillage(villageId)` - デバッグ情報取得

### 3. Village Settings Store (store/modules/village-settings.ts)

#### State

```typescript
{
  settings: VillageUserSettings | null // ユーザー設定
}
```

#### Mutations

- `initSettings(state, { settings })` - 設定初期化

#### Actions

- `INIT_VILLAGE_SETTINGS` - 設定読み込み
  - Cookie作成・読み込み処理
  - `villageUserSettings.createCookieIfNeeded()`
  - `villageUserSettings.getCookie()`

#### Getters

- `getVillageUserSettings` - ユーザー設定取得
- `isDarkTheme` - ダークテーマ判定

## データフロー

### 1. 認証フロー

```
Firebase Auth → Auth Store → Cookie保存 → API認証
```

### 2. 村データフロー

```
API (village-api) → Village Store → Components
```

### 3. ユーザー設定フロー

```
Cookie → Village Settings Store → Components
```

## 型定義

### 主要な型ファイル

- `Village` - 村の完全情報
- `VillageDay` - 日別情報
- `Messages` - メッセージ一覧
- `SituationAsParticipant` - 参加者視点の状況
- `VillageUserSettings` - ユーザー設定

### インポート構造

```typescript
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
// etc...
```

## Pinia移行計画

### 1. Auth Store → useAuthStore()

```typescript
// 現行
this.$store.getters.isLogin
this.$store.dispatch('LOGINOUT', { user })

// 移行後
const authStore = useAuthStore()
authStore.isLogin
authStore.loginOut(user)
```

### 2. Village Store → useVillageStore()

```typescript
// 現行
this.$store.getters.getVillage
this.$store.dispatch('LOAD_VILLAGE')

// 移行後
const villageStore = useVillageStore()
villageStore.village
villageStore.loadVillage()
```

### 3. Settings Store → useVillageSettingsStore()

```typescript
// 現行
this.$store.getters.getVillageUserSettings

// 移行後
const settingsStore = useVillageSettingsStore()
settingsStore.settings
```

## 移行時の注意点

### 1. Cookie管理

- `this.$cookies` → `useCookie()` (Nuxt 3)
- トークン有効期限管理の継続

### 2. API呼び出し

- `this.$axios` → `$fetch` (Nuxt 3)
- エラーハンドリングの継続

### 3. リアクティブ性

- Map型データの適切なリアクティブ化
- 複雑なオブジェクトの深いリアクティブ性

### 4. TypeScript対応

- Pinia での型安全性向上
- Composition API でのストア利用

### 5. バグ修正

- Auth store の logout バグ修正
- その他の潜在的な問題の修正

---

**作成日**: 2025-01-24  
**更新者**: Claude Code  
**調査基準**: .old-nuxt2/store ディレクトリの全ファイル
