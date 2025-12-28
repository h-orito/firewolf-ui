<template>
  <ActionPanel title="アクション" panel-key="action-say">
    <!-- 警告メッセージ（死亡者向け） -->
    <div
      v-if="!isAlive"
      class="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    >
      アクションは生存者も参照できるため、推理発言しないよう注意ください。
    </div>

    <!-- エラーメッセージ -->
    <div
      v-if="error"
      class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- キャラ名表示 -->
    <div class="mb-4 text-sm">{{ myselfText }}</div>

    <!-- 対象者選択 -->
    <FormGroup label="対象" class="mb-4">
      <FormSelect v-model="target" :options="targetOptions" />
    </FormGroup>

    <!-- メッセージ入力 -->
    <FormGroup class="mb-4">
      <FormInput v-model="message" />
      <template #help>
        <div class="text-right text-sm">
          <span
            v-if="maxCount != null"
            :class="{ 'text-red-600 dark:text-red-400': isCountExceeded }"
            >残り回数: {{ remainingCount }}/{{ maxCount }},
          </span>
          <span :class="{ 'text-red-600 dark:text-red-400': isCharExceeded }"
            >文字数: {{ charCount }}/{{ maxLength }}</span
          >
        </div>
      </template>
    </FormGroup>

    <!-- 実行ボタン -->
    <UiButton
      :disabled="!canSubmit"
      :loading="submitting"
      color="primary"
      block
      @click="handleConfirm"
    >
      アクション発言する
    </UiButton>

    <!-- 確認モーダル -->
    <ActionTypeSayConfirmModal
      v-model="showConfirmModal"
      :preview-message="previewMessage"
      :submitting="submitting"
      :message-type-options="messageTypeOptions"
      @confirm="handleActionSay"
    />
  </ActionPanel>
</template>

<script setup lang="ts">
import type { MessageView } from '~/lib/api/types'
import ActionPanel from './ActionPanel.vue'
import ActionTypeSayConfirmModal from './action-type-say/ActionTypeSayConfirmModal.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useActionSay } from '~/composables/village/action/useActionSay'
import { useSituation } from '~/composables/village/useSituation'
import { useVillage } from '~/composables/village/useVillage'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { submitting, error, actionSay, actionSayConfirm, clearError } =
  useActionSay()
const { situation } = useSituation()
const { allParticipants } = useVillage()

// リアクティブデータ
const target = ref('')
const message = ref('')
const showConfirmModal = ref(false)
const previewMessage = ref<MessageView | null>(null)

// 自分の参加者情報
const myself = computed(() => situation.value?.participate.myself)

// キャラ名表示テキスト
const myselfText = computed(() => {
  if (!myself.value) return ''
  return `${myself.value.name}は、`
})

// 生存状態
const isAlive = computed(() => myself.value?.dead == null)

// 対象者選択肢
const targetOptions = computed(() => {
  const options = [
    { value: '', label: '選択しない' },
    { value: '全員', label: '全員' }
  ]

  // 自分以外の参加者を追加
  const otherParticipants = allParticipants.value.filter(
    (p) => p.id !== myself.value?.id
  )
  otherParticipants.forEach((p) => {
    options.push({ value: p.name, label: p.name })
  })

  return options
})

// 発言可能な全メッセージ種別リスト
const availableMessageTypes = computed(() => {
  return situation.value?.say.selectable_message_type_list ?? []
})

// 発言種別選択肢（誤爆防止用）
const messageTypeOptions = computed(() => {
  return availableMessageTypes.value.map((m) => ({
    value: m.message_type.code,
    label: m.message_type.name
  }))
})

// アクション発言の制限情報を取得
const currentRestrict = computed(() => {
  const actionType = availableMessageTypes.value.find(
    (m) => m.message_type.code === MESSAGE_TYPE.ACTION
  )
  return actionType?.restrict ?? null
})

// 最大発言回数
const maxCount = computed(() => currentRestrict.value?.max_count ?? null)

// 残り発言回数
const remainingCount = computed(
  () => currentRestrict.value?.remaining_count ?? null
)

// 最大文字数
const maxLength = computed(() => currentRestrict.value?.max_length ?? 200)

// 現在の文字数
const charCount = computed(() => message.value.length)

// 制限超過判定
const isCountExceeded = computed(
  () => remainingCount.value != null && remainingCount.value <= 0
)
const isCharExceeded = computed(() => charCount.value > maxLength.value)

// 送信可否
const canSubmit = computed(() => {
  if (!message.value.trim()) return false
  if (submitting.value) return false
  if (isCharExceeded.value) return false
  if (isCountExceeded.value) return false
  return true
})

/**
 * アクション発言リクエストボディを生成
 */
const createActionSayBody = () => ({
  myself: `${myself.value?.name ?? ''}は、`,
  target: target.value !== '' ? target.value : undefined,
  message: message.value
})

/**
 * 確認ボタンのハンドラ
 */
const handleConfirm = async () => {
  if (!canSubmit.value) return

  const preview = await actionSayConfirm(createActionSayBody())

  if (preview) {
    previewMessage.value = preview
    showConfirmModal.value = true
  }
}

/**
 * アクション発言実行
 */
const handleActionSay = async () => {
  if (!canSubmit.value) return

  const success = await actionSay(createActionSayBody())

  if (success) {
    resetForm()
    showConfirmModal.value = false
    previewMessage.value = null
    emit('complete')
  }
}

/**
 * フォームリセット
 */
const resetForm = () => {
  target.value = ''
  message.value = ''
  clearError()
}
</script>
