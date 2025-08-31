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
        />
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
            />
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
            />
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
            />
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
            />
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
}>()

const emit = defineEmits<{
  'update:formData': [value: CreateVillageFormData]
}>()

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
    emit('update:formData', { ...props.formData, ageLimit: value })
  }
})

// 見学可能
const availableSpectate = computed({
  get: () => props.formData.availableSpectate,
  set: (value: boolean) => {
    emit('update:formData', { ...props.formData, availableSpectate: value })
  }
})

// 見学発言回数
const spectateCountLimit = computed({
  get: () => props.formData.spectateCount.toString(),
  set: (value: string) => {
    emit('update:formData', {
      ...props.formData,
      spectateCount: parseInt(value) || 40
    })
  }
})

// 見学発言文字数
const spectateCharacterLimit = computed({
  get: () => props.formData.spectateLength.toString(),
  set: (value: string) => {
    emit('update:formData', {
      ...props.formData,
      spectateLength: parseInt(value) || 200
    })
  }
})

// 墓下見学会話公開
const visibleGraveMessage = computed({
  get: () => props.formData.visibleGraveMessage,
  set: (value: boolean) => {
    emit('update:formData', { ...props.formData, visibleGraveMessage: value })
  }
})

// 秘話可能
const availableSecretSay = computed({
  get: () => props.formData.availableSecretSay,
  set: (value: boolean) => {
    emit('update:formData', { ...props.formData, availableSecretSay: value })
  }
})

// アクション可能
const availableAction = computed({
  get: () => props.formData.availableAction,
  set: (value: boolean) => {
    emit('update:formData', { ...props.formData, availableAction: value })
  }
})

// アクション回数制限
const actionCountLimit = computed({
  get: () => props.formData.actionCountLimit,
  set: (value: string) => {
    emit('update:formData', { ...props.formData, actionCountLimit: value })
  }
})

// アクション文字数
const actionCharacterLimit = computed({
  get: () => props.formData.actionCharacterLimit,
  set: (value: string) => {
    emit('update:formData', { ...props.formData, actionCharacterLimit: value })
  }
})
</script>
