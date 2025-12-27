<template>
  <ActionPanel title="退村" panel-key="leave">
    <!-- エラーメッセージ -->
    <div
      v-if="leaveError"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ leaveError }}
    </div>

    <!-- 退村ボタン -->
    <div class="flex justify-end">
      <UiButton color="error" size="sm" @click="openConfirmModal">
        退村する
      </UiButton>
    </div>

    <!-- 確認モーダル -->
    <LeaveConfirmModal
      v-model="isConfirmModalOpen"
      :submitting="submitting"
      @leave="handleLeave"
    />
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from './ActionPanel.vue'
import UiButton from '~/components/ui/button/index.vue'
import LeaveConfirmModal from './leave/LeaveConfirmModal.vue'
import { useLeave } from '~/composables/village/action/useLeave'
import { useActionReset } from '~/composables/village/action/useActionReset'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { onReset } = useActionReset()
const { submitting, error: leaveError, leave, clearError } = useLeave()

// UI状態
const isConfirmModalOpen = ref(false)

// 確認モーダルを開く
const openConfirmModal = () => {
  isConfirmModalOpen.value = true
}

// 退村実行
const handleLeave = async () => {
  const success = await leave()
  if (success) {
    isConfirmModalOpen.value = false
    emit('complete')
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
})
</script>
