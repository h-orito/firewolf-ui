<template>
  <Modal
    :model-value="modelValue"
    title="発言確認"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="previewMessage" class="space-y-4">
      <!-- プレビュー表示（後続タスクで実装） -->
      <div class="rounded border p-4">
        <p class="text-sm text-gray-500">
          発言プレビュー（後続タスクで実装予定）
        </p>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UiButton
          color="secondary"
          variant="outline"
          @click="$emit('update:modelValue', false)"
        >
          キャンセル
        </UiButton>
        <UiButton
          color="primary"
          :loading="submitting"
          @click="$emit('confirm')"
        >
          発言する
        </UiButton>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import type { MessageView } from '~/lib/api/types'
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'

interface Props {
  modelValue: boolean
  previewMessage: MessageView | null
  submitting: boolean
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>
