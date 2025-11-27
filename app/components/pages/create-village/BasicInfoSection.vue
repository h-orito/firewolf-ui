<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">基本情報</h2>

    <!-- 村名 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        村名 <span class="text-red-500">*</span>
      </label>
      <FormInput
        :model-value="formData.villageName"
        placeholder="村の名前を入力"
        size="md"
        :maxlength="40"
        required
        class="w-full"
        :error="!!errors?.villageName"
        @update:model-value="updateField('villageName', $event)"
        @blur="validateField('villageName')"
      />
      <p v-if="errors?.villageName" class="mt-1 text-xs text-red-600">
        {{ errors.villageName }}
      </p>
      <p v-else class="mt-1 text-xs text-gray-500">
        最大40文字まで入力できます
      </p>
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
          :value="startDatetimeLocal"
          type="datetime-local"
          :min="minDatetimeLocal"
          :max="maxDatetimeLocal"
          class="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          :class="errors?.startDatetime ? 'border-red-500' : 'border-gray-300'"
          required
          @input="handleDatetimeChange"
          @blur="validateField('startDatetime')"
        />
        <p v-if="errors?.startDatetime" class="mt-1 text-xs text-red-600">
          {{ errors.startDatetime }}
        </p>
      </div>

      <!-- 沈黙時間 -->
      <div>
        <label class="mb-2 block text-center text-sm font-medium text-gray-700">
          沈黙時間（時間）
        </label>
        <FormNumberInput
          :model-value="formData.silentHours"
          :min="0"
          :max="23"
          size="md"
          class="mx-auto w-32"
          :error="!!errors?.silentHours"
          @update:model-value="updateField('silentHours', $event)"
          @blur="validateField('silentHours')"
        />
        <p v-if="errors?.silentHours" class="mt-1 text-center text-xs text-red-600">
          {{ errors.silentHours }}
        </p>
        <p v-else class="mt-1 text-center text-xs text-gray-500">
          0〜23の範囲で設定できます。設定した時間の間は発言できなくなります。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from './types'
import Alert from '~/components/ui/feedback/Alert.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import FormNumberInput from '~/components/ui/form/FormNumberInput.vue'

interface Props {
  formData: CreateVillageFormData
  errors?: Partial<Record<string, string | undefined>>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:field': [
    field: keyof CreateVillageFormData,
    value: CreateVillageFormData[keyof CreateVillageFormData]
  ]
  'validate:field': [field: keyof CreateVillageFormData]
}>()

// フィールド更新
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

// 開始日時のフォーマット変換
const startDatetimeLocal = computed(() => {
  const dateValue = props.formData.startDatetime || new Date()
  const date = new Date(dateValue)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
})

// 日時変更ハンドラー
const handleDatetimeChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  updateField('startDatetime', new Date(input.value))
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
