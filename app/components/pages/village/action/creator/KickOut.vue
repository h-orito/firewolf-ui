<template>
  <div>
    <!-- セクションタイトル -->
    <h3 class="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
      強制退村
    </h3>

    <!-- エラーメッセージ -->
    <div
      v-if="kickError"
      class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ kickError }}
    </div>

    <!-- 参加者が0人の場合の警告 -->
    <div
      v-if="participantOptions.length === 0"
      class="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    >
      退村させる参加者がいません
    </div>

    <!-- 参加者選択と確認ボタン -->
    <div
      v-if="participantOptions.length > 0"
      class="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-1"
    >
      <FormGroup label="退村させる参加者" class="flex-1">
        <FormSelect
          v-model="selectedParticipantId"
          :options="participantOptions"
          placeholder="選択してください"
          size="sm"
        />
      </FormGroup>
      <div class="flex justify-end sm:justify-start">
        <UiButton
          :disabled="!canSubmit"
          :loading="submitting"
          size="sm"
          color="error"
          @click="handleKickConfirm"
        >
          強制退村確認
        </UiButton>
      </div>
    </div>

    <!-- 確認モーダル -->
    <Modal v-model="showConfirmModal" title="強制退村確認">
      <p class="text-sm text-gray-700 dark:text-gray-300">
        本当に{{ selectedParticipantName }}を強制退村させますか?
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
          @click="handleKick"
        >
          退村させる
        </UiButton>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import UiButton from '~/components/ui/button/index.vue'
import Modal from '~/components/ui/modal/Modal.vue'
import { useKick } from '~/composables/village/action/useKick'
import { useActionReset } from '~/composables/village/action/useActionReset'
import { useVillage } from '~/composables/village/useVillage'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { submitting, error: kickError, kick, clearError } = useKick()
const { onReset } = useActionReset()
const { allParticipants } = useVillage()

// リアクティブデータ
const selectedParticipantId = ref<number | null>(null)
const showConfirmModal = ref(false)

// 参加者リスト（セレクトボックス用）
const participantOptions = computed(() => {
  return allParticipants.value.map((p) => ({
    label: p.name,
    value: p.id
  }))
})

// 選択された参加者の名前
const selectedParticipantName = computed(() => {
  if (selectedParticipantId.value === null) return ''
  const participant = allParticipants.value.find(
    (p) => p.id === selectedParticipantId.value
  )
  return participant?.name ?? ''
})

// 送信可能かどうか
const canSubmit = computed(() => {
  if (submitting.value) return false
  if (selectedParticipantId.value === null) return false
  return true
})

// 初期値を設定（最初の参加者）
watch(
  participantOptions,
  (options) => {
    if (
      options.length > 0 &&
      selectedParticipantId.value === null &&
      options[0]
    ) {
      selectedParticipantId.value = options[0].value as number
    }
  },
  { immediate: true }
)

/**
 * 確認ボタンのハンドラ
 * 確認モーダルを開く
 */
const handleKickConfirm = () => {
  if (!canSubmit.value) return
  clearError()
  showConfirmModal.value = true
}

/**
 * 確認モーダルで「退村させる」を押した時のハンドラ
 */
const handleKick = async () => {
  if (!canSubmit.value || selectedParticipantId.value === null) return

  const success = await kick(selectedParticipantId.value)

  if (success) {
    showConfirmModal.value = false
    emit('complete')
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
  showConfirmModal.value = false
  // 参加者リストが存在する場合、最初の参加者を選択
  if (participantOptions.value.length > 0 && participantOptions.value[0]) {
    selectedParticipantId.value = participantOptions.value[0].value as number
  } else {
    selectedParticipantId.value = null
  }
})
</script>
