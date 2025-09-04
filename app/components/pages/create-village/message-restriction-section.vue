<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">発言制限</h2>

    <Alert
      type="default"
      icon="mdi:information"
      description="回数は0〜1000（通常発言は1〜1000）、文字数は1〜1000で設定できます。"
      class="mb-4"
    />

    <div class="space-y-6">
      <!-- 通常発言 -->
      <div class="rounded-lg border border-gray-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-gray-700">通常発言</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              回数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="normalCount"
              type="number"
              :min="1"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.normalCount ? 'error' : undefined"
              required
              @blur="validateField('normalCount')"
            />
            <p
              v-if="props.errors?.normalCount"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.normalCount }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文字数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="normalLength"
              type="number"
              :min="1"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.normalLength ? 'error' : undefined"
              required
              @blur="validateField('normalLength')"
            />
            <p
              v-if="props.errors?.normalLength"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.normalLength }}
            </p>
          </div>
        </div>
      </div>

      <!-- 人狼の囁き -->
      <div class="rounded-lg border border-gray-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-gray-700">人狼の囁き</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              回数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="whisperCount"
              type="number"
              :min="0"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.whisperCount ? 'error' : undefined"
              required
              @blur="validateField('whisperCount')"
            />
            <p
              v-if="props.errors?.whisperCount"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.whisperCount }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文字数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="whisperLength"
              type="number"
              :min="1"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.whisperLength ? 'error' : undefined"
              required
              @blur="validateField('whisperLength')"
            />
            <p
              v-if="props.errors?.whisperLength"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.whisperLength }}
            </p>
          </div>
        </div>
      </div>

      <!-- 共鳴発言 -->
      <div class="rounded-lg border border-gray-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-gray-700">共鳴発言</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              回数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="sympathizeCount"
              type="number"
              :min="0"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.sympathizeCount ? 'error' : undefined"
              required
              @blur="validateField('sympathizeCount')"
            />
            <p
              v-if="props.errors?.sympathizeCount"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.sympathizeCount }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文字数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="sympathizeLength"
              type="number"
              :min="1"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.sympathizeLength ? 'error' : undefined"
              required
              @blur="validateField('sympathizeLength')"
            />
            <p
              v-if="props.errors?.sympathizeLength"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.sympathizeLength }}
            </p>
          </div>
        </div>
      </div>

      <!-- 恋人発言 -->
      <div class="rounded-lg border border-gray-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-gray-700">恋人発言</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              回数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="loversCount"
              type="number"
              :min="0"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.loversCount ? 'error' : undefined"
              required
              @blur="validateField('loversCount')"
            />
            <p
              v-if="props.errors?.loversCount"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.loversCount }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文字数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="loversLength"
              type="number"
              :min="1"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.loversLength ? 'error' : undefined"
              required
              @blur="validateField('loversLength')"
            />
            <p
              v-if="props.errors?.loversLength"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.loversLength }}
            </p>
          </div>
        </div>
      </div>

      <!-- 死者の呻き -->
      <div class="rounded-lg border border-gray-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-gray-700">死者の呻き</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              回数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="graveCount"
              type="number"
              :min="0"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.graveCount ? 'error' : undefined"
              required
              @blur="validateField('graveCount')"
            />
            <p
              v-if="props.errors?.graveCount"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.graveCount }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文字数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="graveLength"
              type="number"
              :min="1"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.graveLength ? 'error' : undefined"
              required
              @blur="validateField('graveLength')"
            />
            <p
              v-if="props.errors?.graveLength"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.graveLength }}
            </p>
          </div>
        </div>
      </div>

      <!-- 独り言 -->
      <div class="rounded-lg border border-gray-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-gray-700">独り言</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              回数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="monologueCount"
              type="number"
              :min="0"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.monologueCount ? 'error' : undefined"
              required
              @blur="validateField('monologueCount')"
            />
            <p
              v-if="props.errors?.monologueCount"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.monologueCount }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文字数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="monologueLength"
              type="number"
              :min="1"
              :max="1000"
              size="md"
              class="w-full"
              :color="props.errors?.monologueLength ? 'error' : undefined"
              required
              @blur="validateField('monologueLength')"
            />
            <p
              v-if="props.errors?.monologueLength"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.monologueLength }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from './types'
import Alert from '~/components/ui/feedback/Alert.vue'
import FormNumberInput from '~/components/ui/form/FormNumberInput.vue'

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

// 各発言制限の設定
const normalCount = computed({
  get: () => props.formData.normalCount,
  set: (value: number) => {
    updateField('normalCount', value)
  }
})

const normalLength = computed({
  get: () => props.formData.normalLength,
  set: (value: number) => {
    updateField('normalLength', value)
  }
})

const whisperCount = computed({
  get: () => props.formData.whisperCount,
  set: (value: number) => {
    updateField('whisperCount', value)
  }
})

const whisperLength = computed({
  get: () => props.formData.whisperLength,
  set: (value: number) => {
    updateField('whisperLength', value)
  }
})

const sympathizeCount = computed({
  get: () => props.formData.sympathizeCount,
  set: (value: number) => {
    updateField('sympathizeCount', value)
  }
})

const sympathizeLength = computed({
  get: () => props.formData.sympathizeLength,
  set: (value: number) => {
    updateField('sympathizeLength', value)
  }
})

const loversCount = computed({
  get: () => props.formData.loversCount,
  set: (value: number) => {
    updateField('loversCount', value)
  }
})

const loversLength = computed({
  get: () => props.formData.loversLength,
  set: (value: number) => {
    updateField('loversLength', value)
  }
})

const graveCount = computed({
  get: () => props.formData.graveCount,
  set: (value: number) => {
    updateField('graveCount', value)
  }
})

const graveLength = computed({
  get: () => props.formData.graveLength,
  set: (value: number) => {
    updateField('graveLength', value)
  }
})

const monologueCount = computed({
  get: () => props.formData.monologueCount,
  set: (value: number) => {
    updateField('monologueCount', value)
  }
})

const monologueLength = computed({
  get: () => props.formData.monologueLength,
  set: (value: number) => {
    updateField('monologueLength', value)
  }
})
</script>
