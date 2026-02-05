<template>
  <div>
    <!-- セクションタイトル -->
    <h3 class="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
      廃村
    </h3>

    <!-- エラーメッセージ -->
    <div
      v-if="cancelError"
      class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ cancelError }}
    </div>

    <!-- 廃村ボタン -->
    <div class="flex justify-end">
      <UiButton
        :disabled="submitting"
        :loading="submitting"
        size="sm"
        color="error"
        @click="handleCancelConfirm"
      >
        廃村確認
      </UiButton>
    </div>

    <!-- 確認モーダル -->
    <Modal v-model="showConfirmModal" title="廃村確認">
      <p class="text-sm text-gray-700 dark:text-gray-300">
        本当に廃村にしますか?
      </p>

      <template #footer>
        <UiButton
          color="secondary"
          variant="outline"
          @click="showConfirmModal = false"
        >
          キャンセル
        </UiButton>
        <UiButton
          :loading="submitting"
          :disabled="submitting"
          color="error"
          @click="handleCancel"
        >
          廃村にする
        </UiButton>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'
import Modal from '~/components/ui/modal/Modal.vue'
import { useCancelVillage } from '~/composables/village/action/useCancelVillage'
import { useActionReset } from '~/composables/village/action/useActionReset'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const {
  submitting,
  error: cancelError,
  cancelVillage,
  clearError
} = useCancelVillage()
const { onReset } = useActionReset()

// リアクティブデータ
const showConfirmModal = ref(false)

/**
 * 確認ボタンのハンドラ
 * 確認モーダルを開く
 */
const handleCancelConfirm = () => {
  if (submitting.value) return
  clearError()
  showConfirmModal.value = true
}

/**
 * 確認モーダルで「廃村にする」を押した時のハンドラ
 */
const handleCancel = async () => {
  if (submitting.value) return

  const success = await cancelVillage()

  if (success) {
    showConfirmModal.value = false
    emit('complete')
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
  showConfirmModal.value = false
})
</script>
