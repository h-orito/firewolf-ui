<template>
  <div class="action-form-container">
    <!-- メッセージ種別選択 -->
    <div v-if="availableMessageTypes.length > 1" class="mb-4">
      <URadioGroup
        v-model="selectedMessageType"
        :options="messageTypeOptions"
        class="flex flex-wrap gap-2"
      />
    </div>

    <!-- 秘話対象選択 -->
    <div v-if="isSecretSay" class="mb-4">
      <UFormGroup label="秘話相手">
        <USelect
          v-model="targetParticipantId"
          :options="secretTargetOptions"
          placeholder="秘話相手を選択してください"
        />
      </UFormGroup>
    </div>

    <!-- キャラクター表情選択 -->
    <div class="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
      <div class="flex-shrink-0">
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
      <div class="flex-1">
        <UFormGroup :label="messageTypeLabel">
          <UTextarea
            v-model="messageText"
            :placeholder="messagePlaceholder"
            :maxlength="maxMessageLength"
            :rows="4"
            resize
          />
          <template #help>
            <div class="flex justify-between text-sm">
              <span>{{ remainingCount }}/{{ maxMessageLength }}</span>
              <span v-if="currentMessageCount"
                >現在 {{ currentMessageCount }} 回発言</span
              >
            </div>
          </template>
        </UFormGroup>

        <!-- アクションボタン -->
        <div class="mt-4 flex flex-col gap-2 sm:flex-row">
          <UButton
            :disabled="!canSubmit"
            :loading="isSubmitting"
            color="primary"
            block
            @click="submitAction"
          >
            {{ submitButtonText }}
          </UButton>
        </div>
      </div>
    </div>

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
          <UButton variant="ghost" @click="showFaceModal = false"
            >キャンセル</UButton
          >
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import type { CharaView, VillageParticipantView } from '~/lib/api/types'
import Modal from '~/components/ui/modal/Modal.vue'
import CharaImage from './CharaImage.vue'

interface MessageTypeSituation {
  message_type: {
    code: string
    name: string
  }
  count?: number
  max_count?: number
}

interface Props {
  chara?: CharaView
  availableMessageTypes?: MessageTypeSituation[]
  secretTargets?: VillageParticipantView[]
  currentMessageCount?: number
  maxMessageLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  chara: undefined,
  availableMessageTypes: () => [
    {
      message_type: { code: 'NORMAL_SAY', name: '通常発言' }
    }
  ],
  secretTargets: () => [],
  currentMessageCount: 0,
  maxMessageLength: 200
})

const emit = defineEmits<{
  submit: [
    data: {
      messageType: string
      message: string
      faceType: string
      targetParticipantId?: string
    }
  ]
}>()

// リアクティブデータ
const selectedMessageType = ref('NORMAL_SAY')
const messageText = ref('')
const selectedFaceType = ref('NORMAL')
const targetParticipantId = ref('')
const showFaceModal = ref(false)
const isSubmitting = ref(false)

// 計算プロパティ
const messageTypeOptions = computed(() =>
  props.availableMessageTypes.map((mt) => ({
    value: mt.message_type.code,
    label: mt.message_type.name
  }))
)

const secretTargetOptions = computed(() =>
  props.secretTargets.map((p) => ({
    value: p.id.toString(),
    label: p.name
  }))
)

const isSecretSay = computed(() => selectedMessageType.value === 'SECRET_SAY')

const messageTypeLabel = computed(() => {
  const mt = props.availableMessageTypes.find(
    (mt) => mt.message_type.code === selectedMessageType.value
  )
  return mt?.message_type.name || '発言'
})

const messagePlaceholder = computed(() => {
  switch (selectedMessageType.value) {
    case 'WEREWOLF_SAY':
      return '人狼同士の会話を入力...'
    case 'SPECTATE_SAY':
      return '見学者発言を入力...'
    case 'SECRET_SAY':
      return '秘話を入力...'
    default:
      return 'メッセージを入力してください...'
  }
})

const remainingCount = computed(
  () => props.maxMessageLength - messageText.value.length
)

const canSubmit = computed(() => {
  if (!messageText.value.trim()) return false
  if (isSecretSay.value && !targetParticipantId.value) return false
  if (isSubmitting.value) return false
  return true
})

const submitButtonText = computed(() => {
  if (isSubmitting.value) return '送信中...'
  return selectedMessageType.value === 'SECRET_SAY' ? '秘話' : '発言'
})

// メソッド
const openFaceModal = () => {
  if (props.chara?.face_list?.length) {
    showFaceModal.value = true
  }
}

const selectFace = (faceType: string) => {
  selectedFaceType.value = faceType
  showFaceModal.value = false
}

const submitAction = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true

  try {
    emit('submit', {
      messageType: selectedMessageType.value,
      message: messageText.value,
      faceType: selectedFaceType.value,
      targetParticipantId: isSecretSay.value
        ? targetParticipantId.value
        : undefined
    })

    // 送信成功後、メッセージをクリア
    messageText.value = ''
  } finally {
    isSubmitting.value = false
  }
}

// 初期化
onMounted(() => {
  if (props.availableMessageTypes.length > 0) {
    const firstMessageType = props.availableMessageTypes[0]
    if (firstMessageType) {
      selectedMessageType.value = firstMessageType.message_type.code
    }
  }
  if (props.chara?.face_list && props.chara.face_list.length > 0) {
    const firstFace = props.chara.face_list[0]
    if (firstFace) {
      selectedFaceType.value = firstFace.type
    }
  }
})
</script>
