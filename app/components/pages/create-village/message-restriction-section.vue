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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from './types'
import FormNumberInput from '~/components/ui/form/FormNumberInput.vue'

// Props & Emits
const props = defineProps<{
  formData: CreateVillageFormData
}>()

const emit = defineEmits<{
  'update:formData': [value: CreateVillageFormData]
}>()

// 各発言制限の設定
const normalCount = computed({
  get: () => props.formData.normalCount,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, normalCount: value })
  }
})

const normalLength = computed({
  get: () => props.formData.normalLength,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, normalLength: value })
  }
})

const whisperCount = computed({
  get: () => props.formData.whisperCount,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, whisperCount: value })
  }
})

const whisperLength = computed({
  get: () => props.formData.whisperLength,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, whisperLength: value })
  }
})

const sympathizeCount = computed({
  get: () => props.formData.sympathizeCount,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, sympathizeCount: value })
  }
})

const sympathizeLength = computed({
  get: () => props.formData.sympathizeLength,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, sympathizeLength: value })
  }
})

const loversCount = computed({
  get: () => props.formData.loversCount,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, loversCount: value })
  }
})

const loversLength = computed({
  get: () => props.formData.loversLength,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, loversLength: value })
  }
})

const graveCount = computed({
  get: () => props.formData.graveCount,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, graveCount: value })
  }
})

const graveLength = computed({
  get: () => props.formData.graveLength,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, graveLength: value })
  }
})

const monologueCount = computed({
  get: () => props.formData.monologueCount,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, monologueCount: value })
  }
})

const monologueLength = computed({
  get: () => props.formData.monologueLength,
  set: (value: number) => {
    emit('update:formData', { ...props.formData, monologueLength: value })
  }
})
</script>
