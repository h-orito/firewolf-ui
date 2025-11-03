<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">RP設定</h2>

    <div class="space-y-4">
      <!-- 年齢制限 -->
      <div>
        <label class="mb-2 block text-center text-sm font-medium text-gray-700">
          年齢制限
        </label>
        <USelect
          v-model="ageLimit"
          :items="ageLimitOptions"
          option-attribute="label"
          value-attribute="value"
          placeholder="年齢制限を選択"
          class="mx-auto w-full max-w-xs"
          :color="props.errors?.ageLimit ? 'error' : undefined"
          @blur="validateField('ageLimit')"
        />
        <p
          v-if="props.errors?.ageLimit"
          class="mt-1 text-center text-xs text-red-600"
        >
          {{ props.errors.ageLimit }}
        </p>
      </div>

      <!-- 見学 -->
      <FormSwitch
        v-model="availableSpectate"
        label="見学可能"
        description="ゲームに参加せず見学することができます"
      />

      <!-- 見学発言制限 -->
      <div
        v-if="availableSpectate"
        class="rounded-lg border border-gray-200 p-4"
      >
        <h3 class="mb-3 text-sm font-semibold text-gray-700">見学発言</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              回数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="spectateCountLimit"
              :min="0"
              :max="1000"
              size="md"
              placeholder="40"
              required
              class="w-full"
              :color="props.errors?.spectateCount ? 'error' : undefined"
              @blur="validateField('spectateCount')"
            />
            <p
              v-if="props.errors?.spectateCount"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.spectateCount }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文字数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="spectateCharacterLimit"
              :min="1"
              :max="1000"
              size="md"
              placeholder="200"
              required
              class="w-full"
              :color="props.errors?.spectateLength ? 'error' : undefined"
              @blur="validateField('spectateLength')"
            />
            <p
              v-if="props.errors?.spectateLength"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.spectateLength }}
            </p>
          </div>
        </div>
      </div>

      <!-- 墓下見学会話公開 -->
      <FormSwitch
        v-model="visibleGraveMessage"
        label="墓下見学会話公開"
        description="墓下や見学者の発言を生存者が見ることができます"
      />

      <!-- 秘話 -->
      <FormSwitch
        v-model="availableSecretSay"
        label="秘話可能"
        description="特定のプレイヤーにのみ見える秘話を使用できます"
      />

      <!-- アクション -->
      <FormSwitch
        v-model="availableAction"
        label="アクション可能"
        description="アクション発言（RP用の動作描写）を使用できます"
      />

      <!-- アクション設定 -->
      <div v-if="availableAction" class="rounded-lg border border-gray-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-gray-700">アクション</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              回数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="actionCountLimit"
              :min="0"
              :max="1000"
              size="md"
              placeholder="40"
              required
              class="w-full"
              :color="props.errors?.actionCount ? 'error' : undefined"
              @blur="validateField('actionCount')"
            />
            <p
              v-if="props.errors?.actionCount"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.actionCount }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              文字数 <span class="text-red-500">*</span>
            </label>
            <FormNumberInput
              v-model="actionCharacterLimit"
              :min="1"
              :max="1000"
              size="md"
              placeholder="200"
              required
              class="w-full"
              :color="props.errors?.actionLength ? 'error' : undefined"
              @blur="validateField('actionLength')"
            />
            <p
              v-if="props.errors?.actionLength"
              class="mt-1 text-xs text-red-600"
            >
              {{ props.errors.actionLength }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from './types'
import FormSwitch from '~/components/ui/form/FormSwitch.vue'
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

// 年齢制限の選択肢
const ageLimitOptions = [
  { label: '全年齢', value: 'ALL' },
  { label: 'R15', value: 'R15' },
  { label: 'R18', value: 'R18' }
]

// 年齢制限
const ageLimit = computed({
  get: () => props.formData.ageLimit,
  set: (value: string) => {
    updateField('ageLimit', value)
  }
})

// 見学可能
const availableSpectate = computed({
  get: () => props.formData.availableSpectate,
  set: (value: boolean) => {
    updateField('availableSpectate', value)
  }
})

// 見学発言回数
const spectateCountLimit = computed({
  get: () => props.formData.spectateCount,
  set: (value: number | string) => {
    updateField('spectateCount', value === '' ? 0 : Number(value))
  }
})

// 見学発言文字数
const spectateCharacterLimit = computed({
  get: () => props.formData.spectateLength,
  set: (value: number | string) => {
    updateField('spectateLength', value === '' ? 0 : Number(value))
  }
})

// 墓下見学会話公開
const visibleGraveMessage = computed({
  get: () => props.formData.visibleGraveMessage,
  set: (value: boolean) => {
    updateField('visibleGraveMessage', value)
  }
})

// 秘話可能
const availableSecretSay = computed({
  get: () => props.formData.availableSecretSay,
  set: (value: boolean) => {
    updateField('availableSecretSay', value)
  }
})

// アクション可能
const availableAction = computed({
  get: () => props.formData.availableAction,
  set: (value: boolean) => {
    updateField('availableAction', value)
  }
})

// アクション回数制限
const actionCountLimit = computed({
  get: () => props.formData.actionCount,
  set: (value: number | string) => {
    updateField('actionCount', value === '' ? 0 : Number(value))
  }
})

// アクション文字数
const actionCharacterLimit = computed({
  get: () => props.formData.actionLength,
  set: (value: number | string) => {
    updateField('actionLength', value === '' ? 0 : Number(value))
  }
})
</script>
