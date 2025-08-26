<template>
  <div class="space-y-8 p-8">
    <h1 class="text-2xl font-bold">バリデーション修正テスト</h1>

    <!-- 基本的なフォームバリデーション -->
    <div class="space-y-6">
      <h2 class="text-lg font-semibold">
        基本フォーム要素 + vee-validate 修正版
      </h2>

      <form class="max-w-lg space-y-4" @submit.prevent="onSubmit">
        <!-- 必須テキスト入力 -->
        <div class="space-y-2">
          <UFormField
            label="名前（必須）"
            name="name"
            :error="nameField.errorMessage.value"
          >
            <UInput
              v-model="nameField.value.value as string"
              placeholder="お名前を入力してください"
            />
          </UFormField>
        </div>

        <!-- メール -->
        <div class="space-y-2">
          <UFormField
            label="メールアドレス（必須）"
            name="email"
            :error="emailField.errorMessage.value"
          >
            <UInput
              v-model="emailField.value.value as string"
              type="email"
              placeholder="email@example.com"
            />
          </UFormField>
        </div>

        <!-- 送信ボタン -->
        <div class="flex gap-2 pt-4">
          <UButton type="submit" color="primary" :loading="isSubmitting">
            登録
          </UButton>
          <UButton type="button" color="neutral" @click="resetFields">
            リセット
          </UButton>
        </div>
      </form>
    </div>

    <!-- デバッグ情報 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">デバッグ情報</h2>

      <div class="rounded-lg bg-blue-50 p-4">
        <h3 class="mb-2 font-medium">フォーム状態:</h3>
        <div class="space-y-2 text-sm">
          <div><strong>name:</strong> "{{ nameField.value.value }}"</div>
          <div><strong>email:</strong> "{{ emailField.value.value }}"</div>
          <div>
            <strong>nameError:</strong> {{ nameField.errorMessage.value }}
          </div>
          <div>
            <strong>emailError:</strong> {{ emailField.errorMessage.value }}
          </div>
          <div><strong>isValid:</strong> {{ isFormValid }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

// バリデーションスキーマ
const schema = yup.object({
  name: yup.string().required('nameは必須です'),
  email: yup
    .string()
    .required('emailは必須です')
    .email('正しいメールアドレスを入力してください')
})

// フォーム設定
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema
})

// フィールド設定
const nameField = useField('name')
const emailField = useField('email')

// フォーム全体の有効性
const isFormValid = computed(() => {
  return (
    !nameField.errorMessage.value &&
    !emailField.errorMessage.value &&
    nameField.value.value &&
    emailField.value.value
  )
})

// 送信処理
const onSubmit = handleSubmit(async (values) => {
  console.log('フォーム送信:', values)
  await new Promise((resolve) => setTimeout(resolve, 2000))
  alert('送信が完了しました！')
})

// リセット処理
const resetFields = () => {
  nameField.resetField()
  emailField.resetField()
}
</script>
