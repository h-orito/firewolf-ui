<template>
  <div class="space-y-8 p-8">
    <h1 class="text-2xl font-bold">Form 要素コンポーネント群テスト</h1>

    <!-- 基本的なInput要素 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Input 要素</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- テキストInput -->
        <div class="space-y-2">
          <h3 class="font-medium">テキストInput</h3>
          <UInput v-bind="inputPatterns.text" placeholder="テキストを入力" />
        </div>

        <!-- パスワードInput -->
        <div class="space-y-2">
          <h3 class="font-medium">パスワードInput</h3>
          <UInput v-bind="inputPatterns.password" placeholder="パスワード" />
        </div>

        <!-- メールInput -->
        <div class="space-y-2">
          <h3 class="font-medium">メールInput</h3>
          <UInput
            v-bind="inputPatterns.email"
            placeholder="email@example.com"
          />
        </div>

        <!-- 検索Input -->
        <div class="space-y-2">
          <h3 class="font-medium">検索Input</h3>
          <UInput v-bind="inputPatterns.search" placeholder="検索..." />
        </div>

        <!-- 数値Input -->
        <div class="space-y-2">
          <h3 class="font-medium">数値Input</h3>
          <UInput v-bind="inputPatterns.number" placeholder="123" />
        </div>

        <!-- 読み取り専用Input -->
        <div class="space-y-2">
          <h3 class="font-medium">読み取り専用Input</h3>
          <UInput v-bind="inputPatterns.readonly" value="読み取り専用の値" />
        </div>

        <!-- 無効化Input -->
        <div class="space-y-2">
          <h3 class="font-medium">無効化Input</h3>
          <UInput
            v-bind="inputPatterns.disabled"
            placeholder="無効化されています"
          />
        </div>
      </div>
    </div>

    <!-- Inputサイズバリエーション -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Input サイズバリエーション</h2>
      <div class="space-y-2">
        <UInput
          v-bind="{ ...inputPatterns.text, ...formSizePatterns.xs }"
          placeholder="XS サイズ"
        />
        <UInput
          v-bind="{ ...inputPatterns.text, ...formSizePatterns.sm }"
          placeholder="SM サイズ（Buefy is-small相当）"
        />
        <UInput
          v-bind="{ ...inputPatterns.text, ...formSizePatterns.md }"
          placeholder="MD サイズ（デフォルト）"
        />
        <UInput
          v-bind="{ ...inputPatterns.text, ...formSizePatterns.lg }"
          placeholder="LG サイズ"
        />
        <UInput
          v-bind="{ ...inputPatterns.text, ...formSizePatterns.xl }"
          placeholder="XL サイズ"
        />
      </div>
    </div>

    <!-- Select要素 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Select 要素</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- 標準Select -->
        <div class="space-y-2">
          <h3 class="font-medium">標準Select</h3>
          <USelect
            v-model="selectValues.standard"
            v-bind="selectPatterns.standard"
            :items="sampleOptions"
            placeholder="選択してください"
            class="w-64"
          />
        </div>

        <!-- 複数選択Select -->
        <div class="space-y-2">
          <h3 class="font-medium">複数選択Select</h3>
          <USelect
            v-model="selectValues.multiple"
            v-bind="selectPatterns.multiple"
            :items="sampleOptions"
            placeholder="複数選択可能"
            class="w-64"
          />
        </div>

        <!-- オブジェクト形式のSelect -->
        <div class="space-y-2">
          <h3 class="font-medium">オブジェクト形式Select</h3>
          <USelect
            v-model="selectValues.object"
            v-bind="selectPatterns.standard"
            :items="objectOptions"
            value-key="value"
            label-key="label"
            placeholder="オプションを選択"
            class="w-64"
          />
        </div>

        <!-- 無効化Select -->
        <div class="space-y-2">
          <h3 class="font-medium">無効化Select</h3>
          <USelect
            v-model="selectValues.disabled"
            v-bind="selectPatterns.disabled"
            :items="sampleOptions"
            placeholder="無効化されています"
            class="w-64"
          />
        </div>
      </div>
    </div>

    <!-- Checkbox要素 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Checkbox 要素</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- 標準Checkbox -->
        <div class="space-y-2">
          <h3 class="font-medium">標準Checkbox</h3>
          <div class="space-y-2">
            <UCheckbox
              v-model="checkboxValues.standard1"
              v-bind="checkboxPatterns.standard"
              label="オプション1"
            />
            <UCheckbox
              v-model="checkboxValues.standard2"
              v-bind="checkboxPatterns.standard"
              label="オプション2"
            />
            <UCheckbox
              v-model="checkboxValues.standard3"
              v-bind="checkboxPatterns.standard"
              label="オプション3"
            />
          </div>
        </div>

        <!-- 必須Checkbox -->
        <div class="space-y-2">
          <h3 class="font-medium">必須Checkbox</h3>
          <div class="space-y-2">
            <UCheckbox
              v-model="checkboxValues.required1"
              v-bind="checkboxPatterns.required"
              label="必須項目1"
            />
            <UCheckbox
              v-model="checkboxValues.required2"
              v-bind="checkboxPatterns.required"
              label="必須項目2"
            />
          </div>
        </div>

        <!-- カードスタイル -->
        <div class="space-y-2">
          <h3 class="font-medium">カードスタイル</h3>
          <div class="space-y-2">
            <UCheckbox
              v-model="checkboxValues.card1"
              v-bind="checkboxPatterns.card"
              label="カード1"
              description="カード風の表示"
            />
            <UCheckbox
              v-model="checkboxValues.card2"
              v-bind="checkboxPatterns.card"
              label="カード2"
              description="詳細な説明付き"
            />
          </div>
        </div>

        <!-- 無効化Checkbox -->
        <div class="space-y-2">
          <h3 class="font-medium">無効化Checkbox</h3>
          <div class="space-y-2">
            <UCheckbox
              v-model="checkboxValues.disabled1"
              v-bind="checkboxPatterns.disabled"
              label="無効化1"
            />
            <UCheckbox
              v-model="checkboxValues.disabled2"
              v-bind="checkboxPatterns.disabled"
              label="無効化2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Textarea要素 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Textarea 要素</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- 標準Textarea -->
        <div class="space-y-2">
          <h3 class="font-medium">標準Textarea</h3>
          <UTextarea
            v-model="textareaValues.standard"
            v-bind="textareaPatterns.standard"
            placeholder="複数行のテキストを入力"
          />
        </div>

        <!-- 自動リサイズTextarea -->
        <div class="space-y-2">
          <h3 class="font-medium">自動リサイズTextarea</h3>
          <UTextarea
            v-model="textareaValues.autoresize"
            v-bind="textareaPatterns.autoresize"
            placeholder="高さが自動調整されます"
          />
        </div>

        <!-- 大きめTextarea -->
        <div class="space-y-2">
          <h3 class="font-medium">大きめTextarea</h3>
          <UTextarea
            v-model="textareaValues.large"
            v-bind="textareaPatterns.large"
            placeholder="大きなテキストエリア"
          />
        </div>

        <!-- 無効化Textarea -->
        <div class="space-y-2">
          <h3 class="font-medium">無効化Textarea</h3>
          <UTextarea
            v-model="textareaValues.disabled"
            v-bind="textareaPatterns.disabled"
            placeholder="無効化されています"
          />
        </div>
      </div>
    </div>

    <!-- Switch要素 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Switch 要素</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- 標準Switch -->
        <div class="space-y-2">
          <h3 class="font-medium">標準Switch</h3>
          <USwitch
            v-model="switchValues.standard"
            v-bind="switchPatterns.standard"
            label="通知を受け取る"
          />
        </div>

        <!-- サイズバリエーション -->
        <div class="space-y-2">
          <h3 class="font-medium">サイズバリエーション</h3>
          <div class="space-y-2">
            <USwitch
              v-model="switchValues.small"
              v-bind="switchPatterns.small"
              label="小サイズ"
            />
            <USwitch
              v-model="switchValues.medium"
              v-bind="switchPatterns.standard"
              label="中サイズ（標準）"
            />
            <USwitch
              v-model="switchValues.large"
              v-bind="switchPatterns.large"
              label="大サイズ"
            />
          </div>
        </div>

        <!-- 説明付きSwitch -->
        <div class="space-y-2">
          <h3 class="font-medium">説明付きSwitch</h3>
          <USwitch
            v-model="switchValues.email"
            v-bind="switchPatterns.standard"
            label="メール通知"
            description="新しいメッセージが届いたときに通知を受け取ります"
          />
        </div>

        <!-- 読み込み中Switch -->
        <div class="space-y-2">
          <h3 class="font-medium">読み込み中Switch</h3>
          <USwitch
            v-model="switchValues.loading"
            v-bind="switchPatterns.loading"
            label="設定を適用中..."
          />
        </div>

        <!-- 無効化Switch -->
        <div class="space-y-2">
          <h3 class="font-medium">無効化Switch</h3>
          <USwitch
            v-model="switchValues.disabled"
            v-bind="switchPatterns.disabled"
            label="利用不可機能"
          />
        </div>

        <!-- 必須Switch -->
        <div class="space-y-2">
          <h3 class="font-medium">必須Switch</h3>
          <USwitch
            v-model="switchValues.required"
            v-bind="switchPatterns.required"
            label="利用規約に同意する"
          />
        </div>
      </div>
    </div>

    <!-- 共通オプションセットの例 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">共通オプションセット</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- Yes/No選択 -->
        <div class="space-y-2">
          <h3 class="font-medium">Yes/No選択</h3>
          <USelect
            v-model="optionValues.yesNo"
            v-bind="selectPatterns.standard"
            :items="commonFormOptions.yesNo()"
            placeholder="はい/いいえを選択"
            class="w-64"
          />
        </div>

        <!-- 優先度選択 -->
        <div class="space-y-2">
          <h3 class="font-medium">優先度選択</h3>
          <USelect
            v-model="optionValues.priority"
            v-bind="selectPatterns.standard"
            :items="commonFormOptions.priority()"
            placeholder="優先度を選択"
            class="w-64"
          />
        </div>

        <!-- ステータス選択 -->
        <div class="space-y-2">
          <h3 class="font-medium">ステータス選択</h3>
          <USelect
            v-model="optionValues.status"
            v-bind="selectPatterns.standard"
            :items="commonFormOptions.status()"
            placeholder="ステータスを選択"
            class="w-64"
          />
        </div>
      </div>
    </div>

    <!-- 実用的なフォームの例 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">実用的なフォーム例</h2>

      <!-- ユーザー登録フォーム風 -->
      <div class="space-y-4 rounded-lg border p-4">
        <h3 class="font-medium">ユーザー登録フォーム</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UInput v-bind="inputPatterns.text" placeholder="ユーザー名" />
          <UInput v-bind="inputPatterns.email" placeholder="メールアドレス" />
          <UInput v-bind="inputPatterns.password" placeholder="パスワード" />
          <UInput
            v-bind="inputPatterns.password"
            placeholder="パスワード確認"
          />
          <USelect
            v-bind="selectPatterns.standard"
            :items="commonFormOptions.gender()"
            placeholder="性別"
            class="w-full"
          />
          <UInput v-bind="inputPatterns.text" placeholder="電話番号" />
        </div>
        <UTextarea
          v-bind="textareaPatterns.standard"
          placeholder="自己紹介（任意）"
        />
        <div class="space-y-2">
          <UCheckbox
            v-bind="checkboxPatterns.required"
            label="利用規約に同意する"
          />
          <UCheckbox
            v-bind="checkboxPatterns.standard"
            label="ニュースレターを受け取る"
          />
        </div>
        <div class="flex gap-2">
          <UButton color="neutral" variant="outline">キャンセル</UButton>
          <UButton color="primary">登録</UButton>
        </div>
      </div>

      <!-- お問い合わせフォーム風 -->
      <div class="space-y-4 rounded-lg border p-4">
        <h3 class="font-medium">お問い合わせフォーム</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UInput v-bind="inputPatterns.text" placeholder="お名前" />
          <UInput v-bind="inputPatterns.email" placeholder="メールアドレス" />
          <USelect
            v-bind="selectPatterns.standard"
            :items="inquiryTypes"
            value-key="value"
            label-key="label"
            placeholder="お問い合わせ種類"
            class="w-full"
          />
          <USelect
            v-bind="selectPatterns.standard"
            :items="commonFormOptions.priority()"
            placeholder="優先度"
            class="w-full"
          />
        </div>
        <UInput v-bind="inputPatterns.text" placeholder="件名" />
        <UTextarea
          v-bind="textareaPatterns.large"
          placeholder="お問い合わせ内容を詳しくご記入ください"
        />
        <div class="flex gap-2">
          <UButton color="neutral" variant="outline">リセット</UButton>
          <UButton color="primary">送信</UButton>
        </div>
      </div>
    </div>

    <!-- RadioGroup パターンテスト -->
    <div class="rounded-lg border p-4">
      <h2 class="mb-4 text-lg font-semibold">
        RadioGroup Patterns (b-radio-button 風)
      </h2>

      <!-- ボタン風RadioGroup（標準） -->
      <div class="mb-4">
        <h3 class="text-md mb-2 font-medium">Button Style RadioGroup</h3>
        <UFormField label="発言タイプ" class="font-medium">
          <URadioGroup
            v-model="radioValues.messageType"
            v-bind="radioGroupPatterns.buttonStyle"
            :items="[
              { label: '通常発言', value: 'normal' },
              { label: '人狼', value: 'werewolf' },
              { label: '秘話', value: 'secret' },
              { label: '独り言', value: 'monologue' }
            ]"
          />
        </UFormField>
      </div>

      <!-- 小さいボタンスタイル -->
      <div class="mb-4">
        <h3 class="text-md mb-2 font-medium">Small Button Style</h3>
        <UFormField label="優先度" class="font-medium">
          <URadioGroup
            v-model="radioValues.priority"
            v-bind="radioGroupPatterns.smallButton"
            :items="[
              { label: '高', value: 'high' },
              { label: '中', value: 'medium' },
              { label: '低', value: 'low' }
            ]"
          />
        </UFormField>
      </div>

      <!-- 縦並び（小さいサイズ） -->
      <div class="mb-4">
        <h3 class="text-md mb-2 font-medium">Vertical Small</h3>
        <UFormField label="性別" class="font-medium">
          <URadioGroup
            v-model="radioValues.gender"
            v-bind="radioGroupPatterns.verticalSmall"
            :items="[
              { label: '男性', value: 'male' },
              { label: '女性', value: 'female' },
              { label: 'その他', value: 'other' },
              { label: '回答しない', value: 'none' }
            ]"
          />
        </UFormField>
      </div>

      <!-- カードスタイル（横並び） -->
      <div class="mb-4">
        <h3 class="text-md mb-2 font-medium">Card Horizontal</h3>
        <UFormField label="テーマ選択" class="font-medium">
          <URadioGroup
            v-model="radioValues.theme"
            v-bind="radioGroupPatterns.cardHorizontal"
            :items="[
              { label: 'ライト', value: 'light' },
              { label: 'ダーク', value: 'dark' },
              { label: '自動', value: 'auto' }
            ]"
          />
        </UFormField>
      </div>

      <!-- リストスタイル（縦並び） -->
      <div class="mb-4">
        <h3 class="text-md mb-2 font-medium">List Vertical</h3>
        <UFormField label="通知設定" class="font-medium">
          <URadioGroup
            v-model="radioValues.notification"
            v-bind="radioGroupPatterns.listVertical"
            :items="[
              { label: 'すべての通知', value: 'all' },
              { label: '重要な通知のみ', value: 'important' },
              { label: '通知なし', value: 'none' }
            ]"
          />
        </UFormField>
      </div>

      <!-- 無効化RadioGroup -->
      <div class="mb-4">
        <h3 class="text-md mb-2 font-medium">Disabled RadioGroup</h3>
        <UFormField label="利用不可オプション" class="font-medium">
          <URadioGroup
            v-model="radioValues.disabled"
            v-bind="radioGroupPatterns.disabled"
            :items="[
              { label: 'オプション1', value: 'option1' },
              { label: 'オプション2', value: 'option2' },
              { label: 'オプション3', value: 'option3' }
            ]"
          />
        </UFormField>
      </div>

      <!-- 現在の値表示 -->
      <div class="mt-6 rounded bg-gray-50 p-3">
        <h4 class="mb-2 font-medium">Current Values:</h4>
        <pre class="text-sm">{{ JSON.stringify(radioValues, null, 2) }}</pre>
      </div>
    </div>

    <!-- フォーム値の確認 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">入力値の確認</h2>
      <div class="rounded-lg bg-gray-50 p-4">
        <details>
          <summary class="cursor-pointer font-medium">
            入力されたフォーム値を表示
          </summary>
          <pre class="mt-2 text-sm">{{
            JSON.stringify(allFormValues, null, 2)
          }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  inputPatterns,
  selectPatterns,
  checkboxPatterns,
  textareaPatterns,
  switchPatterns,
  radioGroupPatterns,
  formSizePatterns,
  commonFormOptions,
  type FormOption
} from '~/utils/form-patterns'

// サンプルオプション
const sampleOptions = [
  'オプション1',
  'オプション2',
  'オプション3',
  'オプション4'
]

const objectOptions: FormOption[] = [
  { label: 'バックログ', value: 'backlog', icon: 'i-lucide-circle-help' },
  { label: '進行中', value: 'progress', icon: 'i-lucide-circle-arrow-up' },
  { label: '完了', value: 'done', icon: 'i-lucide-circle-check' },
  {
    label: '保留',
    value: 'hold',
    icon: 'i-lucide-circle-pause',
    disabled: true
  }
]

const inquiryTypes: FormOption[] = [
  { label: '一般的なお問い合わせ', value: 'general' },
  { label: '技術的なサポート', value: 'technical' },
  { label: 'バグ報告', value: 'bug' },
  { label: '機能要望', value: 'feature' },
  { label: 'その他', value: 'other' }
]

// フォーム値の管理
const selectValues = ref({
  standard: undefined as string | undefined,
  multiple: [] as string[],
  object: undefined as string | undefined,
  disabled: undefined as string | undefined
})

const checkboxValues = ref({
  standard1: false,
  standard2: false,
  standard3: false,
  required1: false,
  required2: false,
  card1: false,
  card2: false,
  disabled1: true,
  disabled2: false
})

const textareaValues = ref({
  standard: '',
  autoresize: '',
  large: '',
  disabled: '無効化されたテキストエリア'
})

const switchValues = ref({
  standard: false,
  small: false,
  medium: false,
  large: true,
  email: false,
  loading: true,
  disabled: true,
  required: false
})

const radioValues = ref({
  messageType: 'normal',
  priority: 'medium',
  gender: 'male',
  theme: 'light',
  notification: 'important',
  disabled: 'option1'
})

const optionValues = ref({
  yesNo: undefined as string | undefined,
  priority: undefined as string | undefined,
  status: undefined as string | undefined
})

// すべてのフォーム値をまとめた computed
const allFormValues = computed(() => ({
  selectValues: selectValues.value,
  checkboxValues: checkboxValues.value,
  textareaValues: textareaValues.value,
  switchValues: switchValues.value,
  radioValues: radioValues.value,
  optionValues: optionValues.value
}))
</script>
