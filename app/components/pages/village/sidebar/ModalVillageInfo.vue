<template>
  <UModal v-model="isModalOpen">
    <UCard class="max-w-4xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">村の設定</h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="close"
          />
        </div>
      </template>

      <div class="p-4">
        <p class="text-gray-500">村の設定情報を表示（後続タスクで実装予定）</p>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { CharachipView } from '~/lib/api/types'

// Props
interface Props {
  isOpen: boolean
  // TODO: 後続タスクで村の設定情報表示時に使用予定
  charachips: CharachipView[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// State
const isModalOpen = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  }
})

// Methods
const close = () => {
  emit('close')
}
</script>
