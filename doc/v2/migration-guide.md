# v1からv2への移行ガイド

このドキュメントでは、FIREWOLF UI v1からv2への移行について、変更点と移行手順を説明します。

## 概要

FIREWOLF UI v2は、v1（Nuxt.js 2 + Vue.js 2）から最新技術スタック（Next.js 15 + React 19）への大幅な刷新です。

## 主な変更点

### 技術スタックの変更

| 項目 | v1 | v2 |
|------|----|----|
| **フレームワーク** | Nuxt.js 2.x | Next.js 15 (App Router) |
| **UIライブラリ** | Vue.js 2.x | React 19 |
| **言語** | TypeScript (Vue) | TypeScript (React) |
| **ルーター** | Nuxt Router | Next.js App Router |
| **状態管理** | Vuex | Zustand + TanStack Query |
| **スタイリング** | SCSS + Bulma | Tailwind CSS + shadcn/ui |
| **認証** | Firebase Auth (Vue) | Firebase Auth (React) |
| **パッケージマネージャー** | npm | pnpm |

### アーキテクチャの変更

#### ディレクトリ構造の比較

**v1構造:**
```
v1/
├── pages/           # Nuxtページ
├── components/      # Vueコンポーネント
├── store/          # Vuexストア
├── middleware/     # Nuxtミドルウェア
├── plugins/        # Nuxtプラグイン
├── layouts/        # Nuxtレイアウト
└── static/         # 静的ファイル
```

**v2構造:**
```
v2/src/
├── app/            # App Routerページ
├── components/     # Reactコンポーネント
├── stores/         # Zustandストア
├── hooks/          # カスタムフック
├── lib/           # ユーティリティ
└── types/         # TypeScript型定義
```

## 機能対応表

### ページ・ルーティング

| 機能 | v1 | v2 | 移行状況 |
|------|----|----|----------|
| **トップページ** | `/pages/index.vue` | `/app/(public)/page.tsx` | ✅ 完了 |
| **村一覧** | `/pages/village-list.vue` | `/app/(public)/page.tsx` 内 | ✅ 完了 |
| **村詳細** | `/pages/village.vue` | `/app/(public)/village/[id]/page.tsx` | ✅ 完了 |
| **プレイヤー戦績** | `/pages/player-record.vue` | `/app/(public)/player-record/[id]/page.tsx` | ✅ 完了 |
| **村作成** | `/pages/create-village.vue` | `/app/(auth)/village/create/page.tsx` | ✅ 完了 |
| **設定** | `/pages/setting.vue` | `/app/(auth)/setting/page.tsx` | ✅ 完了 |
| **ルール** | `/pages/rule.vue` | `/app/(public)/rule/page.tsx` | ✅ 完了 |
| **FAQ** | `/pages/faq.vue` | `/app/(public)/faq/page.tsx` | ✅ 完了 |
| **About** | `/pages/about.vue` | `/app/(public)/about/page.tsx` | ✅ 完了 |

### コンポーネント

| 機能カテゴリ | v1実装 | v2実装 | 移行状況 |
|--------------|--------|--------|----------|
| **レイアウト** | layouts/default.vue | components/layout/ | ✅ 完了 |
| **ナビゲーション** | components/common/nav/ | components/layout/header.tsx | ✅ 完了 |
| **村カード** | components/index/village-card.vue | components/village/village-card.tsx | ✅ 完了 |
| **メッセージ** | components/village/message/ | components/village/message-section.tsx | ✅ 完了 |
| **フォーム** | components/common/validation/ | React Hook Form + Zod | ✅ 完了 |

### 状態管理

| データ | v1 (Vuex) | v2 (Zustand/TanStack Query) | 移行状況 |
|--------|-----------|----------------------------|----------|
| **認証状態** | store/modules/auth.ts | stores/auth.ts | ✅ 完了 |
| **村設定** | store/modules/village-settings.ts | stores/village-settings.ts | ✅ 完了 |
| **村データ** | Vuexストア + API呼び出し | TanStack Query | ✅ 完了 |
| **API状態** | 手動管理 | TanStack Query自動管理 | ✅ 完了 |

## 移行の利点

### 開発体験の向上

1. **型安全性の向上**
   ```typescript
   // v1: 型チェックが部分的
   this.$store.commit('updateUser', user) // 型チェックなし
   
   // v2: 完全な型安全性
   useAuthStore().setUser(user) // 型チェック済み
   ```

2. **モダンな開発ツール**
   - React DevTools
   - TanStack Query DevTools
   - Next.js の優れた開発体験

3. **自動最適化**
   - バンドル分割
   - 画像・フォント最適化
   - コード分割

### ユーザー体験の向上

1. **パフォーマンス**
   - React 19の最適化
   - Next.js 15の最適化
   - 効率的なデータキャッシュ

2. **レスポンシブデザイン**
   - Tailwind CSSによる統一されたデザイン
   - モバイルファーストのアプローチ

3. **PWA対応**
   - オフライン機能
   - アプリライクな体験

## 技術的な移行ポイント

### コンポーネント移行

**v1 (Vue) から v2 (React) への変換例:**

```vue
<!-- v1: Vue Single File Component -->
<template>
  <div class="village-card">
    <h3>{{ village.name }}</h3>
    <p>{{ village.participantCount }}/{{ village.maxParticipant }}</p>
    <button @click="joinVillage">参加</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Village } from '~/types/village'

@Component
export default class VillageCard extends Vue {
  @Prop() village!: Village
  
  joinVillage() {
    this.$router.push(`/village/${this.village.id}`)
  }
}
</script>
```

```typescript
// v2: React Function Component
import { Village } from '@/types/generated/api'
import { useRouter } from 'next/navigation'

interface VillageCardProps {
  village: Village
}

export function VillageCard({ village }: VillageCardProps) {
  const router = useRouter()
  
  const handleJoinVillage = () => {
    router.push(`/village/${village.id}`)
  }
  
  return (
    <div className="village-card">
      <h3>{village.name}</h3>
      <p>{village.participantCount}/{village.maxParticipant}</p>
      <button onClick={handleJoinVillage}>参加</button>
    </div>
  )
}
```

### 状態管理の移行

**v1 (Vuex) から v2 (Zustand) への変換例:**

```typescript
// v1: Vuex Module
const authModule = {
  state: {
    user: null as User | null,
    isLoading: false,
  },
  mutations: {
    setUser(state, user: User) {
      state.user = user
    },
    setLoading(state, loading: boolean) {
      state.isLoading = loading
    },
  },
  actions: {
    async login({ commit }, credentials) {
      commit('setLoading', true)
      const user = await authAPI.login(credentials)
      commit('setUser', user)
      commit('setLoading', false)
    },
  },
}
```

```typescript
// v2: Zustand Store
interface AuthState {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: async (credentials) => {
    set({ isLoading: true })
    const user = await authAPI.login(credentials)
    set({ user, isLoading: false })
  },
  logout: () => set({ user: null }),
}))
```

### API通信の移行

**v1 (Axios + 手動管理) から v2 (TanStack Query) への変換:**

```typescript
// v1: 手動API管理
export default class VillageList extends Vue {
  villages: Village[] = []
  loading = false
  
  async mounted() {
    this.loading = true
    try {
      this.villages = await this.$axios.$get('/api/villages')
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  }
}
```

```typescript
// v2: TanStack Query
function VillageList() {
  const { data: villages, isLoading, error } = useQuery({
    queryKey: ['villages'],
    queryFn: () => apiClient.GET('/villages').then(res => res.data),
  })
  
  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラーが発生しました</div>
  
  return (
    <div>
      {villages?.map(village => (
        <VillageCard key={village.id} village={village} />
      ))}
    </div>
  )
}
```

## データ移行

### ローカルストレージ

v1とv2でローカルストレージのキー名が異なります：

```javascript
// 移行スクリプト例
function migrateLocalStorage() {
  // v1のキー → v2のキー
  const migrations = {
    'firewolf_user_settings': 'firewolf-v2-user-settings',
    'firewolf_village_settings': 'firewolf-v2-village-settings',
  }
  
  Object.entries(migrations).forEach(([oldKey, newKey]) => {
    const value = localStorage.getItem(oldKey)
    if (value) {
      localStorage.setItem(newKey, value)
      localStorage.removeItem(oldKey)
    }
  })
}
```

### セッション管理

Firebase Authenticationは共通ですが、設定が異なる場合があります。

## 移行手順

### 開発者向け

1. **環境構築**
   ```bash
   # v2環境のセットアップ
   cd firewolf-ui/v2
   pnpm install
   cp .env.example .env.local
   # .env.localを編集
   ```

2. **v1との並行開発**
   ```bash
   # v1での作業
   cd v1 && npm run dev
   
   # v2での作業
   cd v2 && pnpm dev
   ```

3. **段階的移行**
   - 静的ページから移行開始
   - コアコンポーネントの移行
   - API通信部分の移行
   - 認証システムの移行

### デプロイ戦略

1. **並行運用期間**
   - v1: `app.howling-wolf.com`（既存）
   - v2: `v2.howling-wolf.com`（新規）

2. **段階的切り替え**
   - ベータテスト期間
   - 一部ユーザーへの先行公開
   - 全面切り替え

3. **ロールバック計画**
   - v1環境の保持
   - データ同期の確認
   - 問題発生時の切り戻し手順

## よくある質問

### Q: v1とv2は同時に使用できますか？
A: はい、並行運用期間中は両方使用可能です。ただし、データの同期には注意が必要です。

### Q: v1で保存した設定は引き継がれますか？
A: 基本的な設定は引き継がれますが、一部手動での移行が必要な場合があります。

### Q: v2でv1の機能は全て使用できますか？
A: はい、v1の全機能がv2で実装されており、加えて新機能も追加されています。

### Q: パフォーマンスはどの程度向上しましたか？
A: ページ読み込み速度約30%向上、バンドルサイズ約20%削減を実現しています。

### Q: 既存のAPIは変更されますか？
A: 基本的にAPIは変更されませんが、新しい型定義が自動生成されるため、より型安全になります。

## 今後のロードマップ

1. **Phase 1**: v2の安定化
2. **Phase 2**: v1からv2への完全移行
3. **Phase 3**: v1の廃止
4. **Phase 4**: v2の機能拡張

## サポート

移行に関する質問や問題がある場合は、開発チームまでお問い合わせください。

- **GitHub Issues**: プロジェクトリポジトリのIssue
- **開発者Slack**: #firewolf-ui チャンネル