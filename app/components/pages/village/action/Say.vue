<template>
  <ActionPanel title="発言" panel-key="say">
    <!-- 参加者情報 -->
    <div v-if="myself" class="mb-4 text-sm">
      <span class="font-bold"
        >[{{ myself.chara_name.short_name }}] {{ myself.chara_name.name }}</span
      >
      <span v-if="myself.skill" class="ml-2 text-gray-600 dark:text-gray-400">
        （{{ myself.skill.name }}）
      </span>
    </div>

    <!-- エラーメッセージ -->
    <div
      v-if="sayError"
      class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ sayError }}
    </div>

    <!-- メッセージ種別選択 -->
    <div v-if="availableMessageTypes.length > 1" class="mb-4">
      <FormRadioGroup
        v-model="selectedMessageType"
        :options="messageTypeOptions"
      />
    </div>

    <!-- 秘話対象選択 -->
    <div v-if="isSecretSay" class="mb-4">
      <FormGroup label="秘話相手">
        <FormSelect
          v-model="targetParticipantId"
          :options="secretTargetOptions"
          placeholder="秘話相手を選択してください"
        />
      </FormGroup>
    </div>

    <!-- 文字装飾ボタン -->
    <MessageDecorators v-model="messageText" :textarea-ref="textareaRef" />

    <!-- キャラクター表情選択 + メッセージ入力 -->
    <div class="mb-4 flex items-start gap-2">
      <div class="shrink-0">
        <button
          type="button"
          class="focus:ring-primary-500 cursor-pointer rounded focus:ring-2 focus:outline-none"
          :aria-label="`現在の表情: ${selectedFaceType}。クリックして表情を変更`"
          @click="openFaceModal"
        >
          <CharaImage
            v-if="chara"
            :chara="chara"
            :face-type="selectedFaceType"
            :is-large="false"
            :is-small="false"
          />
        </button>
      </div>

      <!-- メッセージ入力エリア -->
      <div class="min-w-0 flex-1">
        <FormGroup>
          <FormTextarea
            ref="formTextareaRef"
            v-model="messageText"
            :maxlength="maxMessageLength"
            :rows="10"
            :class="textareaStyleClass"
          />
          <template #help>
            <div class="text-right text-sm">
              <span v-if="maxMessageCount != null"
                >残り回数: {{ remainingMessageCount }}/{{ maxMessageCount }},
              </span>
              <span
                >行数: {{ currentLineCount }}/{{ maxLineCount }}, 文字数:
                {{ currentCharCount }}/{{ maxMessageLength }}</span
              >
            </div>
          </template>
        </FormGroup>
      </div>
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

    <!-- 返信対象メッセージ表示 -->
    <div v-if="replyTargetMessage" class="mt-4">
      <div class="rounded-lg border-2 border-blue-500 p-3">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-bold text-blue-600 dark:text-blue-400"
            >返信対象</span
          >
          <button
            type="button"
            class="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="clearReplyTarget"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
        <SayMessage
          :message="replyTargetMessage"
          :is-img-large="false"
          :is-large-text="false"
          :can-reply="false"
          :can-secret="false"
        />
      </div>
    </div>

    <!-- 発言確認モーダル -->
    <SayConfirmModal
      v-model="showConfirmModal"
      :preview-message="previewMessage"
      :submitting="submitting"
      @confirm="handleSay"
    />

    <!-- 表情選択モーダル -->
    <Modal v-model="showFaceModal" title="表情を選択">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <button
          v-for="face in chara?.face_list || []"
          :key="face.type"
          type="button"
          class="cursor-pointer rounded border p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{
            'ring-primary-500 ring-2': selectedFaceType === face.type
          }"
          @click="selectFace(face.type)"
        >
          <CharaImage
            v-if="chara"
            :chara="chara"
            :face-type="face.type"
            :is-small="true"
          />
          <p class="mt-1 text-center text-xs">{{ face.name }}</p>
        </button>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="outline" @click="showFaceModal = false"
            >キャンセル</UiButton
          >
        </div>
      </template>
    </Modal>
  </ActionPanel>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import ActionPanel from './ActionPanel.vue'
import SayConfirmModal from './say/SayConfirmModal.vue'
import SayMessage from '../message/SayMessage.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import FormRadioGroup from '~/components/ui/form/FormRadioGroup.vue'
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'
import CharaImage from '../CharaImage.vue'
import MessageDecorators from './decorator/MessageDecorators.vue'
import { useSay } from '~/composables/village/action/useSay'
import { useActionReset } from '~/composables/village/action/useActionReset'
import { useSituation } from '~/composables/village/useSituation'
import { useSayInputRegister } from '~/composables/village/useSayInput'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { onReset } = useActionReset()
const { submitting, error: sayError, say, sayConfirm, clearError } = useSay()
const { situation } = useSituation()

// 親からinjectしたSayInputのregisterHandlersを取得
const sayInputRegister = useSayInputRegister()

// リアクティブデータ
const selectedMessageType = ref('')
const messageText = ref('')
const selectedFaceType = ref('NORMAL')
const targetParticipantId = ref('')
const showFaceModal = ref(false)
const showConfirmModal = ref(false)
const previewMessage = ref<import('~/lib/api/types').MessageView | null>(null)
const replyTargetMessage = ref<import('~/lib/api/types').MessageView | null>(
  null
)

// FormTextareaへの参照
const formTextareaRef = ref<InstanceType<typeof FormTextarea> | null>(null)

// HTMLTextAreaElementへの参照（MessageDecoratorsに渡す）
const textareaRef = computed(() => {
  return formTextareaRef.value?.textareaElement ?? null
})

// Situationから取得するデータ（ACTIONは別パネルなので除外）
const availableMessageTypes = computed(() => {
  const list = situation.value?.say.selectable_message_type_list ?? []
  return list.filter((m) => m.message_type.code !== MESSAGE_TYPE.ACTION)
})

// 秘話対象リスト（SECRET_SAYのtarget_listから取得）
const secretTargets = computed(() => {
  const secretSayType = availableMessageTypes.value.find(
    (m) => m.message_type.code === MESSAGE_TYPE.SECRET_SAY
  )
  return secretSayType?.target_list ?? []
})

// 選択中のメッセージタイプの発言制限
const currentRestrict = computed(() => {
  const mt = availableMessageTypes.value.find(
    (m) => m.message_type.code === selectedMessageType.value
  )
  return mt?.restrict ?? null
})

// 最大発言回数
const maxMessageCount = computed(() => currentRestrict.value?.max_count ?? null)

// 残り発言回数
const remainingMessageCount = computed(
  () => currentRestrict.value?.remaining_count ?? null
)

// 最大文字数
const maxMessageLength = computed(
  () => currentRestrict.value?.max_length ?? 200
)

// 最大行数
const maxLineCount = computed(() => currentRestrict.value?.max_line ?? 20)

// 現在の行数
const currentLineCount = computed(() => {
  if (!messageText.value) return 1
  return messageText.value.split('\n').length
})

// 現在の文字数
const currentCharCount = computed(() => messageText.value.length)

// Situationから取得する自分の参加者情報
const myself = computed(() => situation.value?.participate.myself)

// キャラクター情報
const chara = computed(() => myself.value?.chara)

// 計算プロパティ
const messageTypeOptions = computed(() =>
  availableMessageTypes.value.map((mt) => ({
    value: mt.message_type.code,
    label: mt.message_type.name
  }))
)

const secretTargetOptions = computed(() =>
  secretTargets.value.map((p) => ({
    value: p.id.toString(),
    label: p.name
  }))
)

const isSecretSay = computed(
  () => selectedMessageType.value === MESSAGE_TYPE.SECRET_SAY
)

// 発言種別に応じたテキストエリアのスタイルクラス
const textareaStyleClass = computed(() => {
  switch (selectedMessageType.value) {
    case MESSAGE_TYPE.WEREWOLF_SAY:
      return '!bg-[#f2cece] dark:!bg-[#f2aeae] !text-[#0a0a0a]'
    case MESSAGE_TYPE.SYMPATHIZE_SAY:
      return '!bg-[#cef2ce] dark:!bg-[#aef2ae] !text-[#0a0a0a]'
    case MESSAGE_TYPE.LOVERS_SAY:
      return '!bg-[#f2dede] dark:!bg-[#edcece] !text-[#cc2222]'
    case MESSAGE_TYPE.MONOLOGUE_SAY:
      return '!bg-[#dddddd] dark:!bg-[#aaaaaa] !text-[#0a0a0a]'
    case MESSAGE_TYPE.GRAVE_SAY:
      return '!bg-[#ceedf2] dark:!bg-[#a9edf7] !text-[#0a0a0a]'
    case MESSAGE_TYPE.SPECTATE_SAY:
      return '!bg-[#f2f2ce] dark:!bg-[#f2f2ae] !text-[#0a0a0a]'
    case MESSAGE_TYPE.SECRET_SAY:
      return '!bg-[#cecef2] dark:!bg-[#aeaef2] !text-[#0a0a0a]'
    default:
      return ''
  }
})

const canSubmit = computed(() => {
  if (!messageText.value.trim()) return false
  if (isSecretSay.value && !targetParticipantId.value) return false
  if (submitting.value) return false
  return true
})

const submitButtonText = computed(() => {
  if (submitting.value) return '送信中...'
  return '発言確認へ'
})

// メソッド
const openFaceModal = () => {
  if (chara.value?.face_list?.length) {
    showFaceModal.value = true
  }
}

const selectFace = (faceType: string) => {
  selectedFaceType.value = faceType
  showFaceModal.value = false
}

/**
 * 発言リクエストボディを生成
 */
const createSayBody = () => ({
  message_type: selectedMessageType.value,
  message: messageText.value,
  face_type: selectedFaceType.value,
  target_id: isSecretSay.value ? parseInt(targetParticipantId.value) : undefined
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
    replyTargetMessage.value = null
    emit('complete')
  }
}

/**
 * 返信対象をクリア
 */
const clearReplyTarget = () => {
  replyTargetMessage.value = null
}

/**
 * アンカー文字列を発言欄に挿入
 */
const insertAnchor = (anchorString: string) => {
  const textarea = textareaRef.value
  if (!textarea) {
    // テキストエリアがない場合は末尾に追加
    messageText.value += anchorString
    return
  }

  const currentText = messageText.value
  const selectionStart = textarea.selectionStart
  const selectionEnd = textarea.selectionEnd

  // カーソル位置にアンカーを挿入
  messageText.value =
    currentText.slice(0, selectionStart) +
    anchorString +
    currentText.slice(selectionEnd)

  // カーソル位置を挿入後の位置に移動
  nextTick(() => {
    const newPosition = selectionStart + anchorString.length
    textarea.focus()
    textarea.setSelectionRange(newPosition, newPosition)
  })
}

/**
 * 秘話モードに切り替え、対象を設定
 */
const switchToSecret = (targetId: number) => {
  // 秘話が選択可能か確認
  const hasSecretType = availableMessageTypes.value.some(
    (m) => m.message_type.code === MESSAGE_TYPE.SECRET_SAY
  )
  if (!hasSecretType) return

  // 対象が秘話対象リストにあるか確認
  const targetExists = secretTargets.value.some((t) => t.id === targetId)
  if (!targetExists) return

  // 秘話モードに切り替え
  selectedMessageType.value = MESSAGE_TYPE.SECRET_SAY
  targetParticipantId.value = targetId.toString()
}

// フォームリセット
const resetForm = () => {
  messageText.value = ''
  targetParticipantId.value = ''
  clearError()
}

// 初期化
const initializeForm = () => {
  // 最初のメッセージタイプを選択
  if (availableMessageTypes.value.length > 0) {
    const firstMessageType = availableMessageTypes.value[0]
    if (firstMessageType) {
      selectedMessageType.value = firstMessageType.message_type.code
    }
  }
  // 最初の表情を選択
  if (chara.value?.face_list && chara.value.face_list.length > 0) {
    const firstFace = chara.value.face_list[0]
    if (firstFace) {
      selectedFaceType.value = firstFace.type
    }
  }
}

// リセット処理を登録
onReset(() => {
  resetForm()
})

// マウント時に初期化
onMounted(() => {
  initializeForm()
})

// situation/villageの変更を監視して初期化
watch(
  () => [availableMessageTypes.value, chara.value],
  () => {
    // メッセージタイプが未選択または選択不可になった場合は再初期化
    if (
      !selectedMessageType.value ||
      !availableMessageTypes.value.some(
        (m) => m.message_type.code === selectedMessageType.value
      )
    ) {
      initializeForm()
    }
  },
  { deep: true }
)

// SayInputにハンドラを登録（親がprovideしている場合）
// Note: 親でuseSayInputProviderが呼ばれていない場合はsayInputRegisterがundefinedになる
// その場合でもコンポーネントは正常に動作する（アンカー挿入機能が無効になるだけ）
onMounted(() => {
  if (sayInputRegister) {
    sayInputRegister.registerHandlers({
      insertAnchor,
      switchToSecret,
      setReplyTarget: (message) => {
        replyTargetMessage.value = message
      }
    })
  }
})

onUnmounted(() => {
  if (sayInputRegister) {
    sayInputRegister.unregisterHandlers()
  }
})
</script>
