<template>
  <div class="p-8 space-y-8">
    <h1 class="text-2xl font-bold">バリデーション統合テスト</h1>

    <!-- 基本的なフォームバリデーション -->
    <div class="space-y-6">
      <h2 class="text-lg font-semibold">基本フォーム要素 + vee-validate</h2>

      <form class="space-y-4 max-w-lg" @submit="onSubmit">
        <!-- 必須テキスト入力 -->
        <div class="space-y-2">
          <UFormField label="名前（必須）" name="name" :error="errors.name">
            <UInput
              v-model="nameField.value.value as string"
              v-bind="inputPatterns.text"
              placeholder="お名前を入力してください"
            />
          </UFormField>
        </div>

        <!-- メール -->
        <div class="space-y-2">
          <UFormField
            label="メールアドレス（必須）"
            name="email"
            :error="errors.email"
          >
            <UInput
              v-model="emailField.value.value as string"
              v-bind="inputPatterns.email"
              placeholder="email@example.com"
            />
          </UFormField>
        </div>

        <!-- パスワード -->
        <div class="space-y-2">
          <UFormField
            label="パスワード（必須・8文字以上）"
            name="password"
            :error="errors.password"
          >
            <UInput
              v-model="passwordField.value.value as string"
              v-bind="inputPatterns.password"
              placeholder="パスワードを入力"
            />
          </UFormField>
        </div>

        <!-- セレクト -->
        <div class="space-y-2">
          <UFormField label="性別（必須）" name="gender" :error="errors.gender">
            <USelect
              v-model="genderField.value.value as string"
              v-bind="selectPatterns.standard"
              :items="commonFormOptions.gender()"
              placeholder="性別を選択してください"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- 複数選択セレクト -->
        <div class="space-y-2">
          <UFormField
            label="興味のある分野（複数選択可）"
            name="interests"
            :error="errors.interests"
          >
            <USelect
              v-model="interestsField.value.value as string[]"
              v-bind="selectPatterns.multiple"
              :items="interestOptions"
              value-key="value"
              label-key="label"
              placeholder="興味のある分野を選択"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- テキストエリア -->
        <div class="space-y-2">
          <UFormField
            label="自己紹介（任意・500文字以内）"
            name="introduction"
            :error="errors.introduction"
          >
            <UTextarea
              v-model="introductionField.value.value as string"
              v-bind="textareaPatterns.standard"
              placeholder="自己紹介を入力してください"
            />
          </UFormField>
        </div>

        <!-- チェックボックス -->
        <div class="space-y-2">
          <UFormField name="agreedToTerms" :error="errors.agreedToTerms">
            <UCheckbox
              v-model="agreedToTermsField.value.value as boolean"
              v-bind="checkboxPatterns.required"
              label="利用規約に同意する（必須）"
            />
          </UFormField>
        </div>

        <!-- スイッチ -->
        <div class="space-y-2">
          <UCheckbox
            v-model="newsletterField.value.value as boolean"
            v-bind="checkboxPatterns.standard"
            label="ニュースレターを受け取る"
          />
        </div>

        <!-- 送信ボタン -->
        <div class="flex gap-2 pt-4">
          <UButton type="submit" color="primary" :loading="isSubmitting">
            登録
          </UButton>
          <UButton type="button" color="neutral" @click="() => resetForm()">
            リセット
          </UButton>
        </div>
      </form>
    </div>

    <!-- 人狼ゲーム固有のバリデーション -->
    <div class="space-y-6">
      <h2 class="text-lg font-semibold">人狼ゲーム固有フォーム</h2>

      <form class="space-y-4 max-w-lg" @submit="onFirewolfSubmit">
        <!-- 村名 -->
        <div class="space-y-2">
          <UFormField
            label="村名（1-40文字）"
            name="villageName"
            :error="firewolfErrors.villageName"
          >
            <UInput
              v-model="villageNameField.value.value as string"
              v-bind="inputPatterns.text"
              placeholder="村の名前を入力してください"
            />
          </UFormField>
        </div>

        <!-- キャラクター名 -->
        <div class="space-y-2">
          <UFormField
            label="キャラクター名（1-8文字）"
            name="characterName"
            :error="firewolfErrors.characterName"
          >
            <UInput
              v-model="characterNameField.value.value as string"
              v-bind="inputPatterns.text"
              placeholder="キャラクター名"
            />
          </UFormField>
        </div>

        <!-- 参加人数 -->
        <div class="space-y-2">
          <UFormField
            label="参加人数（4-16人）"
            name="personCapacity"
            :error="firewolfErrors.personCapacity"
          >
            <UInput
              v-model="personCapacityField.value.value as number"
              v-bind="inputPatterns.number"
              placeholder="8"
            />
          </UFormField>
        </div>

        <!-- 更新時間 -->
        <div class="space-y-2">
          <UFormField
            label="更新時間（30-1440分）"
            name="dayTimeMinutes"
            :error="firewolfErrors.dayTimeMinutes"
          >
            <UInput
              v-model="dayTimeMinutesField.value.value as number"
              v-bind="inputPatterns.number"
              placeholder="1440"
            />
          </UFormField>
        </div>

        <!-- 発言 -->
        <div class="space-y-2">
          <UFormField
            label="発言（1000文字以内）"
            name="sayMessage"
            :error="firewolfErrors.sayMessage"
          >
            <UTextarea
              v-model="sayMessageField.value.value as string"
              v-bind="textareaPatterns.standard"
              placeholder="発言を入力してください"
            />
          </UFormField>
        </div>

        <!-- 送信ボタン -->
        <div class="flex gap-2 pt-4">
          <UButton
            type="submit"
            color="primary"
            :loading="isFirewolfSubmitting"
          >
            作成
          </UButton>
          <UButton
            type="button"
            color="neutral"
            @click="() => resetFirewolfForm()"
          >
            リセット
          </UButton>
        </div>
      </form>
    </div>

    <!-- デバッグ情報 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">デバッグ情報</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 基本フォームの状態 -->
        <div class="p-4 bg-blue-50 rounded-lg">
          <h3 class="font-medium mb-2">基本フォーム状態:</h3>
          <div class="space-y-2 text-sm">
            <div><strong>isValid:</strong> {{ isValid }}</div>
            <div><strong>isDirty:</strong> {{ isDirty }}</div>
            <div><strong>isSubmitting:</strong> {{ isSubmitting }}</div>
            <div><strong>submitCount:</strong> {{ submitCount }}</div>
          </div>
          <h4 class="font-medium mt-4 mb-2">フォーム値:</h4>
          <pre class="text-xs bg-white p-2 rounded">{{
            JSON.stringify(values, null, 2)
          }}</pre>
          <h4 class="font-medium mt-4 mb-2">エラー:</h4>
          <pre class="text-xs bg-white p-2 rounded">{{
            JSON.stringify(errors, null, 2)
          }}</pre>
        </div>

        <!-- 人狼フォームの状態 -->
        <div class="p-4 bg-green-50 rounded-lg">
          <h3 class="font-medium mb-2">人狼フォーム状態:</h3>
          <div class="space-y-2 text-sm">
            <div><strong>isFirewolfValid:</strong> {{ isFirewolfValid }}</div>
            <div><strong>isFirewolfDirty:</strong> {{ isFirewolfDirty }}</div>
            <div>
              <strong>isFirewolfSubmitting:</strong> {{ isFirewolfSubmitting }}
            </div>
            <div>
              <strong>firewolfSubmitCount:</strong> {{ firewolfSubmitCount }}
            </div>
          </div>
          <h4 class="font-medium mt-4 mb-2">フォーム値:</h4>
          <pre class="text-xs bg-white p-2 rounded">{{
            JSON.stringify(firewolfValues, null, 2)
          }}</pre>
          <h4 class="font-medium mt-4 mb-2">エラー:</h4>
          <pre class="text-xs bg-white p-2 rounded">{{
            JSON.stringify(firewolfErrors, null, 2)
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  inputPatterns,
  selectPatterns,
  textareaPatterns,
  checkboxPatterns,
  commonFormOptions
} from '~/utils/form-patterns'
import {
  firewolfValidationRules,
  validationRules
} from '~/utils/validation-rules'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

// 基本フォーム専用スキーマ
const basicFormSchema = yup.object({
  name: validationRules.required,
  email: validationRules.email,
  password: validationRules.password,
  gender: validationRules.selectRequired,
  interests: yup.array().of(yup.string().required()).optional(),
  introduction: yup.string().max(500).optional(),
  agreedToTerms: validationRules.checkboxRequired,
  newsletter: yup.boolean().default(false)
})

// 基本フォームの設定
const { handleSubmit, isSubmitting, submitCount } = useForm({
  validationSchema: basicFormSchema
})

// 基本フォームのフィールド
const nameField = useField('name')
const emailField = useField('email')
const passwordField = useField('password')
const genderField = useField('gender')
const interestsField = useField('interests', undefined, { initialValue: [] })
const introductionField = useField('introduction')
const agreedToTermsField = useField('agreedToTerms')
const newsletterField = useField('newsletter')

// 基本フォームの便利プロパティ
const values = computed(() => ({
  name: nameField.value.value,
  email: emailField.value.value,
  password: passwordField.value.value,
  gender: genderField.value.value,
  interests: interestsField.value.value,
  introduction: introductionField.value.value,
  agreedToTerms: agreedToTermsField.value.value,
  newsletter: newsletterField.value.value
}))

const errors = computed(() => ({
  name: nameField.errorMessage.value,
  email: emailField.errorMessage.value,
  password: passwordField.errorMessage.value,
  gender: genderField.errorMessage.value,
  interests: interestsField.errorMessage.value,
  introduction: introductionField.errorMessage.value,
  agreedToTerms: agreedToTermsField.errorMessage.value,
  newsletter: newsletterField.errorMessage.value
}))

const isValid = computed(() => {
  return (
    !nameField.errorMessage.value &&
    !emailField.errorMessage.value &&
    !passwordField.errorMessage.value &&
    !genderField.errorMessage.value &&
    !agreedToTermsField.errorMessage.value
  )
})

const isDirty = computed(() => {
  return (
    nameField.meta.dirty ||
    emailField.meta.dirty ||
    passwordField.meta.dirty ||
    genderField.meta.dirty ||
    interestsField.meta.dirty ||
    introductionField.meta.dirty ||
    agreedToTermsField.meta.dirty ||
    newsletterField.meta.dirty
  )
})

// 人狼フォーム専用スキーマ
const firewolfFormSchema = yup.object({
  villageName: firewolfValidationRules.villageName,
  characterName: firewolfValidationRules.characterName,
  personCapacity: firewolfValidationRules.personCapacity,
  dayTimeMinutes: firewolfValidationRules.dayTimeMinutes,
  sayMessage: firewolfValidationRules.sayMessage
})

// 人狼フォームの設定
const {
  handleSubmit: handleFirewolfSubmit,
  isSubmitting: isFirewolfSubmitting,
  submitCount: firewolfSubmitCount
} = useForm({
  validationSchema: firewolfFormSchema
})

// 人狼フォームのフィールド
const villageNameField = useField('villageName')
const characterNameField = useField('characterName')
const personCapacityField = useField('personCapacity', undefined, {
  initialValue: 8
})
const dayTimeMinutesField = useField('dayTimeMinutes', undefined, {
  initialValue: 1440
})
const sayMessageField = useField('sayMessage')

// 人狼フォームの便利プロパティ
const firewolfValues = computed(() => ({
  villageName: villageNameField.value.value,
  characterName: characterNameField.value.value,
  personCapacity: personCapacityField.value.value,
  dayTimeMinutes: dayTimeMinutesField.value.value,
  sayMessage: sayMessageField.value.value
}))

const firewolfErrors = computed(() => ({
  villageName: villageNameField.errorMessage.value,
  characterName: characterNameField.errorMessage.value,
  personCapacity: personCapacityField.errorMessage.value,
  dayTimeMinutes: dayTimeMinutesField.errorMessage.value,
  sayMessage: sayMessageField.errorMessage.value
}))

const isFirewolfValid = computed(() => {
  return (
    !villageNameField.errorMessage.value &&
    !characterNameField.errorMessage.value &&
    !sayMessageField.errorMessage.value
  )
})

const isFirewolfDirty = computed(() => {
  return (
    villageNameField.meta.dirty ||
    characterNameField.meta.dirty ||
    personCapacityField.meta.dirty ||
    dayTimeMinutesField.meta.dirty ||
    sayMessageField.meta.dirty
  )
})

// 興味分野のオプション
const interestOptions = [
  { label: 'プログラミング', value: 'programming' },
  { label: 'デザイン', value: 'design' },
  { label: 'ゲーム', value: 'gaming' },
  { label: '読書', value: 'reading' },
  { label: '映画', value: 'movies' },
  { label: '音楽', value: 'music' },
  { label: 'スポーツ', value: 'sports' },
  { label: '旅行', value: 'travel' }
]

// リセット関数
const resetForm = () => {
  nameField.resetField()
  emailField.resetField()
  passwordField.resetField()
  genderField.resetField()
  interestsField.resetField()
  introductionField.resetField()
  agreedToTermsField.resetField()
  newsletterField.resetField()
}

const resetFirewolfForm = () => {
  villageNameField.resetField()
  characterNameField.resetField()
  personCapacityField.resetField()
  dayTimeMinutesField.resetField()
  sayMessageField.resetField()
}

// 基本フォーム送信処理
const onSubmit = handleSubmit(async (formValues) => {
  console.log('基本フォーム送信:', formValues)
  await new Promise((resolve) => setTimeout(resolve, 2000))
  alert('基本フォームの送信が完了しました！')
})

// 人狼フォーム送信処理
const onFirewolfSubmit = handleFirewolfSubmit(async (formValues) => {
  console.log('人狼フォーム送信:', formValues)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  alert('人狼フォームの送信が完了しました！')
})

// リアクティブな値の変化を監視
watch(
  [values, firewolfValues],
  ([newBasicValues, newFirewolfValues]) => {
    console.log('フォーム値変化:', {
      basic: newBasicValues,
      firewolf: newFirewolfValues
    })
  },
  { deep: true }
)

// エラーの変化を監視
watch(
  [errors, firewolfErrors],
  ([newBasicErrors, newFirewolfErrors]) => {
    console.log('エラー状態変化:', {
      basic: newBasicErrors,
      firewolf: newFirewolfErrors
    })
  },
  { deep: true }
)
</script>
