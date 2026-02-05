<template>
  <div>
    <!-- セクションタイトル -->
    <h3 class="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
      エピローグ延長
    </h3>

    <!-- エラーメッセージ -->
    <div
      v-if="extendError"
      class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ extendError }}
    </div>

    <!-- 延長ボタン -->
    <div class="flex justify-end">
      <UiButton
        :disabled="submitting"
        :loading="submitting"
        size="sm"
        color="primary"
        @click="handleExtendConfirm"
      >
        エピローグ延長
      </UiButton>
    </div>

    <!-- 確認モーダル -->
    <Modal v-model="showConfirmModal" title="エピローグ延長確認">
      <p class="text-sm text-gray-700 dark:text-gray-300">1日延長しますか?</p>

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
          color="primary"
          @click="handleExtend"
        >
          延長する
        </UiButton>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'
import Modal from '~/components/ui/modal/Modal.vue'
import { useExtendEpilogue } from '~/composables/village/action/useExtendEpilogue'
import { useActionReset } from '~/composables/village/action/useActionReset'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const {
  submitting,
  error: extendError,
  extendEpilogue,
  clearError
} = useExtendEpilogue()
const { onReset } = useActionReset()

// リアクティブデータ
const showConfirmModal = ref(false)

/**
 * 確認ボタンのハンドラ
 * 確認モーダルを開く
 */
const handleExtendConfirm = () => {
  if (submitting.value) return
  clearError()
  showConfirmModal.value = true
}

/**
 * 確認モーダルで「延長する」を押した時のハンドラ
 */
const handleExtend = async () => {
  if (submitting.value) return

  const success = await extendEpilogue()

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
