<template>
  <ActionPanel title="村建て発言" panel-key="creator-say">
    <!-- エラーメッセージ -->
    <div
      v-if="sayError"
      class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ sayError }}
    </div>

    <!-- 文字装飾ボタン -->
    <MessageDecorators v-model="messageText" :textarea-ref="textareaRef" />

    <!-- メッセージ入力エリア -->
    <div class="mb-4">
      <FormGroup>
        <FormTextarea
          ref="formTextareaRef"
          v-model="messageText"
          :rows="10"
          :size="messageDisplay.isCharLarge ? 'md' : 'sm'"
          placeholder="村建て発言を入力してください"
          class="bg-[#fef]! dark:bg-[#403340]!"
        />
        <template #help>
          <div class="text-right text-sm">
            <span :class="{ 'text-red-600 dark:text-red-400': isLineExceeded }"
              >行数: {{ currentLineCount }}/{{ maxLineCount }}</span
            >,
            <span :class="{ 'text-red-600 dark:text-red-400': isCharExceeded }"
              >文字数: {{ currentCharCount }}/{{ maxMessageLength }}</span
            >
          </div>
        </template>
      </FormGroup>
    </div>

    <!-- アクションボタン -->
    <div class="mt-4 flex flex-col gap-2 sm:flex-row">
      <UiButton
        :disabled="!canSubmit"
        :loading="submitting"
        color="primary"
        block
        @click="handleConfirm"
      >
        {{ submitButtonText }}
      </UiButton>
    </div>

    <!-- 発言確認モーダル -->
    <SayConfirmModal
      v-model="showConfirmModal"
      :preview-message="previewMessage"
      :submitting="submitting"
      :selected-message-type="MESSAGE_TYPE.CREATOR_SAY"
      :message-type-options="messageTypeOptions"
      @confirm="handleSay"
    />
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from '../ActionPanel.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import UiButton from '~/components/ui/button/index.vue'
import MessageDecorators from '../decorator/MessageDecorators.vue'
import { useCreatorSay } from '~/composables/village/action/useCreatorSay'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'

// 遅延ローディング: 確認モーダルはボタンクリック時まで不要
const SayConfirmModal = defineAsyncComponent(
  () => import('../say/SayConfirmModal.vue')
)

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { submitting, error: sayError, say, sayConfirm } = useCreatorSay()
const { messageDisplay } = useUserSettings()

// リアクティブデータ
const messageText = ref('')
const showConfirmModal = ref(false)
const previewMessage = ref<import('~/lib/api/types').MessageView | null>(null)

// FormTextareaへの参照
const formTextareaRef = ref<InstanceType<typeof FormTextarea> | null>(null)

// HTMLTextAreaElementへの参照（MessageDecoratorsに渡す）
const textareaRef = computed(() => {
  return formTextareaRef.value?.textareaElement ?? null
})

// 発言制限（村建て発言は固定値）
const maxMessageLength = 400
const maxLineCount = 40

// 現在の行数
const currentLineCount = computed(() => {
  if (!messageText.value) return 1
  return messageText.value.split('\n').length
})

// 現在の文字数
const currentCharCount = computed(() => messageText.value.length)

// 制限超過判定
const isLineExceeded = computed(() => currentLineCount.value > maxLineCount)
const isCharExceeded = computed(() => currentCharCount.value > maxMessageLength)

// 計算プロパティ
const messageTypeOptions = computed(() => [
  {
    value: MESSAGE_TYPE.CREATOR_SAY,
    label: '村建て発言'
  }
])

const canSubmit = computed(() => {
  if (!messageText.value.trim()) return false
  if (submitting.value) return false
  if (isLineExceeded.value) return false
  if (isCharExceeded.value) return false
  return true
})

const submitButtonText = computed(() => {
  if (submitting.value) return '送信中...'
  return '発言確認へ'
})

/**
 * 発言リクエストボディを生成
 */
const createSayBody = () => ({
  message: messageText.value
})

/**
 * 発言確認へボタンのハンドラ
 * say-confirm API を呼び出してプレビューを取得し、確認モーダルを開く
 */
const handleConfirm = async () => {
  if (!canSubmit.value) return

  const preview = await sayConfirm(createSayBody())

  if (preview) {
    previewMessage.value = preview
    showConfirmModal.value = true
  }
}

/**
 * 発言確認モーダルで「発言する」を押した時のハンドラ
 */
const handleSay = async () => {
  if (!canSubmit.value) return

  const success = await say(createSayBody())

  if (success) {
    // 送信成功後、メッセージをクリアしてモーダルを閉じる
    messageText.value = ''
    showConfirmModal.value = false
    previewMessage.value = null
    emit('complete')
  }
}
</script>
