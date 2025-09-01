<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">基本情報</h2>

    <!-- 村名 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        村名 <span class="text-red-500">*</span>
      </label>
      <UInput
        v-model="villageName"
        placeholder="村の名前を入力"
        size="md"
        :maxlength="255"
        required
        class="w-full"
      />
      <p class="mt-1 text-xs text-gray-500">最大255文字まで入力できます</p>
    </div>

    <!-- 時間設定 -->
    <div class="mb-4">
      <!-- 開始日時 -->
      <div class="mb-4">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          開始日時 <span class="text-red-500">*</span>
        </label>
        <Alert
          type="default"
          icon="mdi:information"
          description="1日の長さは24時間固定です。"
          class="mb-3"
        />
        <input
          v-model="startDatetimeLocal"
          type="datetime-local"
          :min="minDatetimeLocal"
          :max="maxDatetimeLocal"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <!-- 沈黙時間 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">
          沈黙時間（時間）
        </label>
        <FormNumberInput
          v-model="silentHours"
          :min="0"
          :max="23"
          size="md"
          class="w-32"
          @input="validateSilentHours"
        />
        <p class="mt-1 text-xs text-gray-500">
          0〜23の範囲で設定できます。設定した時間の間は発言できなくなります。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from './types'
import Alert from '~/components/ui/feedback/Alert.vue'
import FormNumberInput from '~/components/ui/form/FormNumberInput.vue'

const props = defineProps<{
  formData: CreateVillageFormData
}>()

const emit = defineEmits<{
  'update:formData': [value: CreateVillageFormData]
}>()

// 村名のv-model
const villageName = computed({
  get: () => props.formData.villageName,
  set: (value: string) => {
    emit('update:formData', { ...props.formData, villageName: value })
  }
})

// 開始日時のv-model (datetime-local用フォーマット)
const startDatetimeLocal = computed({
  get: () => {
    const date = new Date(props.formData.startDatetime)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  },
  set: (value: string) => {
    emit('update:formData', {
      ...props.formData,
      startDatetime: new Date(value)
    })
  }
})

// 沈黙時間のv-model
const silentHours = computed({
  get: () => props.formData.silentHours,
  set: (value: number) => {
    // 0〜23の範囲に制限
    const clampedValue = Math.max(0, Math.min(23, value))
    emit('update:formData', { ...props.formData, silentHours: clampedValue })
  }
})

// 沈黙時間のバリデーション
const validateSilentHours = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value)
  if (value > 23) {
    input.value = '23'
    silentHours.value = 23
  } else if (value < 0) {
    input.value = '0'
    silentHours.value = 0
  }
}

// 日付制限（今日から2週間後まで）
const minDatetimeLocal = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
})

const maxDatetimeLocal = computed(() => {
  const twoWeeksLater = new Date()
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)
  const year = twoWeeksLater.getFullYear()
  const month = String(twoWeeksLater.getMonth() + 1).padStart(2, '0')
  const day = String(twoWeeksLater.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}T23:59`
})
</script>
