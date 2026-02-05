<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">詳細ルール</h2>

    <div class="space-y-4">
      <!-- 記名投票 -->
      <FormSwitch
        v-model="openVote"
        label="記名投票"
        description="投票結果に誰が誰に投票したかが表示されます"
      />

      <!-- 役職希望 -->
      <FormSwitch
        v-model="availableSkillRequest"
        label="役職希望"
        description="参加者が希望する役職を選択できます"
      />

      <!-- 突然死 -->
      <FormSwitch
        v-model="availableSuddenlyDeath"
        label="突然死あり"
        description="投票や能力を行使しなかったプレイヤーが突然死します"
      />

      <!-- 時短希望 -->
      <FormSwitch
        v-model="availableCommit"
        label="時短希望可能"
        description="全員が時短希望をすると日付が早く進みます"
      />

      <!-- 連続護衛 -->
      <FormSwitch
        v-model="availableGuardSameTarget"
        label="連続護衛可能"
        description="狩人が同じ対象を連続で護衛できます"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from './types'
import FormSwitch from '~/components/ui/form/FormSwitch.vue'

// Props & Emits
const props = defineProps<{
  formData: CreateVillageFormData
  errors?: Partial<Record<string, string | undefined>>
}>()

const emit = defineEmits<{
  'update:field': [
    field: keyof CreateVillageFormData,
    value: CreateVillageFormData[keyof CreateVillageFormData]
  ]
  'validate:field': [field: keyof CreateVillageFormData]
}>()

// 各種ルール設定
const openVote = computed({
  get: () => props.formData.openVote,
  set: (value: boolean) => {
    emit('update:field', 'openVote', value)
  }
})

const availableSkillRequest = computed({
  get: () => props.formData.availableSkillRequest,
  set: (value: boolean) => {
    emit('update:field', 'availableSkillRequest', value)
  }
})

const availableSuddenlyDeath = computed({
  get: () => props.formData.availableSuddenlyDeath,
  set: (value: boolean) => {
    emit('update:field', 'availableSuddenlyDeath', value)
  }
})

const availableCommit = computed({
  get: () => props.formData.availableCommit,
  set: (value: boolean) => {
    emit('update:field', 'availableCommit', value)
  }
})

const availableGuardSameTarget = computed({
  get: () => props.formData.availableGuardSameTarget,
  set: (value: boolean) => {
    emit('update:field', 'availableGuardSameTarget', value)
  }
})
</script>
