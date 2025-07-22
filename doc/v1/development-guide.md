# v1 開発ガイド

## コンポーネント開発パターン

### クラスベースコンポーネント

v1では `nuxt-property-decorator` を使用したクラスベースのコンポーネント開発を採用しています。

```typescript
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import ChildComponent from '~/components/common/child-component.vue'

@Component({
  name: 'ComponentName',
  components: {
    ChildComponent
  }
})
export default class ComponentName extends Vue {
  // プロパティ
  @Prop({ type: String, required: true })
  private title!: string

  // データプロパティ
  private isLoading: boolean = false
  private items: Item[] = []
  
  // 算出プロパティ
  private get filteredItems(): Item[] {
    return this.items.filter(item => item.active)
  }
  
  // ライフサイクルフック
  private async mounted(): Promise<void> {
    await this.fetchData()
  }
  
  // メソッド
  private async fetchData(): Promise<void> {
    this.isLoading = true
    try {
      // データ取得処理
    } finally {
      this.isLoading = false
    }
  }
}
```

## 開発時の重要事項

### 1. 型定義
新しい機能を追加する際は、必ず `v1/components/type/` に型定義を追加してください。

```typescript
// v1/components/type/village.ts
export interface Village {
  id: number
  name: string
  status: VillageStatus
  // ...
}
```

### 2. コンポーネント配置
既存のコンポーネントパターンに従い、適切なディレクトリに配置してください。

- 共通コンポーネント → `components/common/`
- 村関連 → `components/village/`
- 機能別に細分化されたディレクトリ構造を維持

### 3. スタイル記述
SCSSを使用し、コンポーネントごとにスコープドスタイルを記述してください。

```vue
<style lang="scss" scoped>
.component-name {
  // Bulmaの変数を使用可能
  background-color: $primary;
  
  &__title {
    font-size: 1.5rem;
  }
}
</style>
```

### 4. バリデーション
フォームバリデーションはVeeValidateを使用し、共通のバリデーションルールを利用してください。

```vue
<template>
  <validation-provider
    v-slot="{ errors }"
    rules="required|max:100"
    name="村名"
  >
    <b-field :type="{ 'is-danger': errors[0] }" :message="errors">
      <b-input v-model="villageName" />
    </b-field>
  </validation-provider>
</template>
```

## ベストプラクティス

### 非同期処理
- async/awaitパターンを使用
- try-catchでエラーハンドリング
- ローディング状態の管理

### 状態管理
- ローカル状態は極力コンポーネント内で管理
- グローバル状態のみVuexストアで管理
- gettersを通じてストアのデータにアクセス

### パフォーマンス
- 大量のデータを扱う場合は仮想スクロールを検討
- 重い計算処理は算出プロパティでキャッシュ
- v-ifとv-showを適切に使い分ける