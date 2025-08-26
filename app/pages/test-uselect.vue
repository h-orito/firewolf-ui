<template>
  <div class="space-y-8 p-8">
    <h1 class="text-2xl font-bold">USelect 基本動作テスト</h1>

    <!-- 最もシンプルなUSelect -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">基本的なUSelect</h2>

      <div class="space-y-4">
        <!-- 文字列配列 -->
        <div class="space-y-2">
          <h3 class="font-medium">文字列配列（最もシンプル）</h3>
          <p class="text-sm text-gray-600">選択値: {{ simpleValue }}</p>
          <USelect
            v-model="simpleValue"
            :items="simpleItems"
            placeholder="選択してください"
            class="w-64"
          />
        </div>

        <!-- オブジェクト配列 -->
        <div class="space-y-2">
          <h3 class="font-medium">オブジェクト配列</h3>
          <p class="text-sm text-gray-600">選択値: {{ objectValue }}</p>
          <USelect
            v-model="objectValue"
            :items="objectItems"
            value-key="value"
            label-key="label"
            placeholder="選択してください"
            class="w-64"
          />
        </div>

        <!-- v-bindなし -->
        <div class="space-y-2">
          <h3 class="font-medium">v-bindなし（プロパティ直接指定）</h3>
          <p class="text-sm text-gray-600">選択値: {{ directValue }}</p>
          <USelect
            v-model="directValue"
            :items="simpleItems"
            placeholder="直接指定"
            size="sm"
            variant="outline"
            class="w-64"
          />
        </div>

        <!-- form-patternsを使用 -->
        <div class="space-y-2">
          <h3 class="font-medium">form-patterns使用</h3>
          <p class="text-sm text-gray-600">選択値: {{ patternValue }}</p>
          <USelect
            v-model="patternValue"
            v-bind="selectPatterns.standard"
            :items="simpleItems"
            placeholder="form-patterns使用"
            class="w-64"
          />
        </div>

        <!-- 複数選択 -->
        <div class="space-y-2">
          <h3 class="font-medium">複数選択</h3>
          <p class="text-sm text-gray-600">選択値: {{ multipleValue }}</p>
          <USelect
            v-model="multipleValue"
            :items="simpleItems"
            placeholder="複数選択可能"
            multiple
            class="w-64"
          />
        </div>

        <!-- アイコン付き -->
        <div class="space-y-2">
          <h3 class="font-medium">アイコン付きオプション</h3>
          <p class="text-sm text-gray-600">選択値: {{ iconValue }}</p>
          <USelect
            v-model="iconValue"
            :items="iconItems"
            value-key="value"
            label-key="label"
            placeholder="アイコン付き"
            class="w-64"
          />
        </div>
      </div>
    </div>

    <!-- デバッグ情報 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">デバッグ情報</h2>
      <div class="rounded-lg bg-gray-50 p-4">
        <h3 class="mb-2 font-medium">現在の値:</h3>
        <pre class="text-sm">{{
          JSON.stringify(
            {
              simpleValue,
              objectValue,
              directValue,
              patternValue,
              multipleValue,
              iconValue
            },
            null,
            2
          )
        }}</pre>
      </div>

      <div class="rounded-lg bg-blue-50 p-4">
        <h3 class="mb-2 font-medium">使用中のオプション:</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 class="font-medium">simpleItems:</h4>
            <pre class="text-sm">{{
              JSON.stringify(simpleItems, null, 2)
            }}</pre>
          </div>
          <div>
            <h4 class="font-medium">objectItems:</h4>
            <pre class="text-sm">{{
              JSON.stringify(objectItems, null, 2)
            }}</pre>
          </div>
          <div>
            <h4 class="font-medium">iconItems:</h4>
            <pre class="text-sm">{{ JSON.stringify(iconItems, null, 2) }}</pre>
          </div>
          <div>
            <h4 class="font-medium">selectPatterns.standard:</h4>
            <pre class="text-sm">{{
              JSON.stringify(selectPatterns.standard, null, 2)
            }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 動作確認ボタン -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">動作確認</h2>
      <div class="flex gap-2">
        <UButton @click="resetValues">すべての値をリセット</UButton>
        <UButton color="primary" @click="setDefaultValues"
          >デフォルト値を設定</UButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { selectPatterns } from '~/utils/form-patterns'

// リアクティブな値（初期値をundefinedに変更してプレースホルダーを表示）
const simpleValue = ref<string | undefined>(undefined)
const objectValue = ref<string | undefined>(undefined)
const directValue = ref<string | undefined>(undefined)
const patternValue = ref<string | undefined>(undefined)
const multipleValue = ref<string[]>([])
const iconValue = ref<string | undefined>(undefined)

// オプションデータ
const simpleItems = ['オプション1', 'オプション2', 'オプション3', 'オプション4']

const objectItems = [
  { label: 'ラベル1', value: 'value1' },
  { label: 'ラベル2', value: 'value2' },
  { label: 'ラベル3', value: 'value3' },
  { label: 'ラベル4', value: 'value4' }
]

const iconItems = [
  { label: 'ホーム', value: 'home', icon: 'i-lucide-home' },
  { label: 'ユーザー', value: 'user', icon: 'i-lucide-user' },
  { label: '設定', value: 'settings', icon: 'i-lucide-settings' },
  { label: 'ヘルプ', value: 'help', icon: 'i-lucide-help-circle' }
]

// 値をリセット
const resetValues = () => {
  simpleValue.value = undefined
  objectValue.value = undefined
  directValue.value = undefined
  patternValue.value = undefined
  multipleValue.value = []
  iconValue.value = undefined
}

// デフォルト値を設定
const setDefaultValues = () => {
  simpleValue.value = 'オプション2'
  objectValue.value = 'value2'
  directValue.value = 'オプション3'
  patternValue.value = 'オプション1'
  multipleValue.value = ['オプション1', 'オプション3']
  iconValue.value = 'user'
}

// コンソールで値の変化を監視
watch(
  [
    simpleValue,
    objectValue,
    directValue,
    patternValue,
    multipleValue,
    iconValue
  ],
  (newValues, oldValues) => {
    console.log('USelect values changed:', {
      newValues: {
        simpleValue: newValues[0],
        objectValue: newValues[1],
        directValue: newValues[2],
        patternValue: newValues[3],
        multipleValue: newValues[4],
        iconValue: newValues[5]
      },
      oldValues: {
        simpleValue: oldValues?.[0],
        objectValue: oldValues?.[1],
        directValue: oldValues?.[2],
        patternValue: oldValues?.[3],
        multipleValue: oldValues?.[4],
        iconValue: oldValues?.[5]
      }
    })
  }
)
</script>
