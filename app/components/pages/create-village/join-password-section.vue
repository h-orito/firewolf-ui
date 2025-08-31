<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">参加パスワード設定</h2>

    <div>
      <label class="mb-2 block text-sm font-medium text-gray-700">
        参加パスワード
      </label>
      <UInput
        v-model="joinPassword"
        type="text"
        placeholder="パスワードを入力（任意）"
        :maxlength="12"
        size="md"
        class="w-full max-w-xs"
      />
      <p class="mt-1 text-xs text-gray-500">
        設定すると、パスワードを知っている人のみ参加できます（最大12文字）
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from './types'

// Props & Emits
const props = defineProps<{
  formData: CreateVillageFormData
}>()

const emit = defineEmits<{
  'update:formData': [value: CreateVillageFormData]
}>()

// 参加パスワード
const joinPassword = computed({
  get: () => props.formData.joinPassword,
  set: (value: string) => {
    emit('update:formData', { ...props.formData, joinPassword: value })
  }
})
</script>
