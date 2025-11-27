<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">参加パスワード設定</h2>

    <div>
      <label class="mb-2 block text-sm font-medium text-gray-700">
        参加パスワード
      </label>
      <FormInput
        v-model="joinPassword"
        type="text"
        placeholder="パスワードを入力（任意）"
        :maxlength="12"
        size="md"
        class="w-full max-w-xs"
        :error="!!props.errors?.joinPassword"
        @blur="validateField('joinPassword')"
      />
      <p v-if="props.errors?.joinPassword" class="mt-1 text-xs text-red-600">
        {{ props.errors.joinPassword }}
      </p>
      <p v-else class="mt-1 text-xs text-gray-500">
        設定すると、パスワードを知っている人のみ参加できます（最大12文字）
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from './types'
import FormInput from '~/components/ui/form/FormInput.vue'

// Props & Emits
const props = defineProps<{
  formData: CreateVillageFormData
  errors?: Record<string, string | undefined>
}>()

const emit = defineEmits<{
  'update:formData': [value: CreateVillageFormData]
  'update:field': [
    field: keyof CreateVillageFormData,
    value: CreateVillageFormData[keyof CreateVillageFormData]
  ]
  'validate:field': [field: keyof CreateVillageFormData]
}>()

// フィールド更新処理
const updateField = <K extends keyof CreateVillageFormData>(
  field: K,
  value: CreateVillageFormData[K]
) => {
  emit('update:field', field, value)
}

// フィールドバリデーション
const validateField = (field: keyof CreateVillageFormData) => {
  emit('validate:field', field)
}

// 参加パスワード
const joinPassword = computed({
  get: () => props.formData.joinPassword,
  set: (value: string) => {
    updateField('joinPassword', value)
  }
})
</script>
