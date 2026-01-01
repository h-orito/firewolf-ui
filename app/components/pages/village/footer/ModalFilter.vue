<template>
  <Modal v-model="isModalOpen" title="発言抽出">
    <!-- コンテンツ -->
    <div v-if="village" class="space-y-6 text-left">
      <!-- 発言種別 -->
      <section>
        <p class="mb-2 font-bold">発言種別</p>
        <div class="mb-2 flex gap-2 text-sm">
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleAllMessageTypeOn"
          >
            全てON
          </UiButton>
          <span>/</span>
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleAllMessageTypeOff"
          >
            全てOFF
          </UiButton>
          <span>/</span>
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleReverseMessageType"
          >
            反転
          </UiButton>
        </div>

        <!-- 発言種別チェックボックス -->
        <div class="space-y-2">
          <FormCheckGroup
            :model-value="selectedMessageTypeGroups"
            :options="messageTypeOptionsRow1"
            @update:model-value="selectedMessageTypeGroups = $event"
          />
          <FormCheckGroup
            :model-value="selectedMessageTypeGroups"
            :options="messageTypeOptionsRow2"
            @update:model-value="selectedMessageTypeGroups = $event"
          />
          <FormCheckGroup
            :model-value="selectedMessageTypeGroups"
            :options="messageTypeOptionsRow3"
            @update:model-value="selectedMessageTypeGroups = $event"
          />
        </div>
      </section>

      <!-- 発言者 -->
      <section>
        <p class="mb-2 font-bold">発言者</p>
        <div class="mb-2 flex gap-2 text-sm">
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleAllParticipantOn"
          >
            全てON
          </UiButton>
          <span>/</span>
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleAllParticipantOff"
          >
            全てOFF
          </UiButton>
          <span>/</span>
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleReverseParticipant"
          >
            反転
          </UiButton>
        </div>

        <!-- 参加者リスト -->
        <div class="grid grid-cols-1 gap-0 sm:grid-cols-2">
          <div
            v-for="participant in participantList"
            :key="participant.id"
            class="border-t border-gray-300 py-1 dark:border-gray-600"
          >
            <FormCheckbox
              :model-value="isParticipantSelected(participant.id)"
              @update:model-value="toggleParticipant(participant.id, $event)"
            >
              <div class="flex items-center gap-2">
                <CharaImage :chara="participant.chara" :is-small="true" />
                <span class="text-xs">{{ participant.name }}</span>
              </div>
            </FormCheckbox>
          </div>
        </div>
      </section>

      <!-- キーワード -->
      <section>
        <p class="mb-2 font-bold">キーワード</p>
        <FormInput
          :model-value="keyword ?? ''"
          size="sm"
          placeholder="スペース区切り"
          class="w-full"
          @update:model-value="keyword = $event || null"
        />
      </section>

      <!-- 宛先 -->
      <section>
        <p class="mb-2 font-bold">宛先</p>
        <div class="mb-2 flex gap-2 text-sm">
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleAllToParticipantOn"
          >
            全てON
          </UiButton>
          <span>/</span>
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleAllToParticipantOff"
          >
            全てOFF
          </UiButton>
          <span>/</span>
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleReverseToParticipant"
          >
            反転
          </UiButton>
          <template v-if="myself">
            <span>/</span>
            <UiButton
              size="xs"
              variant="link"
              class="p-0"
              @click="handleToMyParticipant"
            >
              自分宛
            </UiButton>
          </template>
        </div>

        <!-- 宛先参加者リスト -->
        <div class="grid grid-cols-1 gap-0 sm:grid-cols-2">
          <div
            v-for="participant in participantList"
            :key="participant.id"
            class="border-t border-gray-300 py-1 dark:border-gray-600"
          >
            <FormCheckbox
              :model-value="isToParticipantSelected(participant.id)"
              @update:model-value="toggleToParticipant(participant.id, $event)"
            >
              <div class="flex items-center gap-2">
                <CharaImage :chara="participant.chara" :is-small="true" />
                <span class="text-xs">{{ participant.name }}</span>
              </div>
            </FormCheckbox>
          </div>
        </div>
      </section>
    </div>

    <!-- フッター -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <UiButton color="secondary" variant="outline" @click="handleClose">
          キャンセル
        </UiButton>
        <UiButton color="primary" :disabled="!canFilter" @click="handleFilter">
          抽出する
        </UiButton>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  MESSAGE_TYPE_GROUP,
  ALL_MESSAGE_TYPE_GROUPS,
  type MessageTypeGroup
} from '~/lib/api/message-constants'
import { useVillageMessageFilter } from '~/composables/village/useVillageMessageFilter'
import { useVillage } from '~/composables/village/useVillage'
import { useSituation } from '~/composables/village/useSituation'
import { useMessage } from '~/composables/village/useMessage'
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import FormCheckbox from '~/components/ui/form/FormCheckbox.vue'
import FormCheckGroup from '~/components/ui/form/FormCheckGroup.vue'
import CharaImage from '../CharaImage.vue'

// Props
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

// Composables
const {
  applyFilter,
  messageTypeGroups: storeMessageTypeGroups,
  participantIds: storeParticipantIds,
  toParticipantIds: storeToParticipantIds,
  keyword: storeKeyword
} = useVillageMessageFilter()
const { village, allParticipants, allParticipantIds } = useVillage()
const { situation } = useSituation()
const { loadMessages } = useMessage()

// State - モーダルの開閉状態
const isModalOpen = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  }
})

// State - フィルタ条件
const selectedMessageTypeGroups = ref<MessageTypeGroup[]>([
  ...ALL_MESSAGE_TYPE_GROUPS
])
const selectedParticipantIds = ref<number[]>([])
const selectedToParticipantIds = ref<number[]>([])
const keyword = ref<string | null>(null)

// Computed
const myself = computed(() => situation.value?.participate.myself ?? null)

const participantList = computed(() => {
  if (!village.value) return []
  return allParticipants.value.toSorted((a, b) => a.id - b.id)
})

// メッセージタイプのオプション (3行に分割)
const messageTypeOptionsRow1 = [
  { value: MESSAGE_TYPE_GROUP.NORMAL_SAY, label: '通常' },
  { value: MESSAGE_TYPE_GROUP.MONOLOGUE_SAY, label: '独り言' },
  { value: MESSAGE_TYPE_GROUP.SECRET_SAY, label: '秘話' },
  { value: MESSAGE_TYPE_GROUP.CREATOR_SAY, label: '村建て' }
]

const messageTypeOptionsRow2 = [
  { value: MESSAGE_TYPE_GROUP.WEREWOLF_SAY, label: '囁き' },
  { value: MESSAGE_TYPE_GROUP.SYMPATHIZE_SAY, label: '共鳴' },
  { value: MESSAGE_TYPE_GROUP.LOVERS_SAY, label: '恋人' },
  { value: MESSAGE_TYPE_GROUP.GRAVE_SAY, label: '墓下見学' }
]

const messageTypeOptionsRow3 = [
  { value: MESSAGE_TYPE_GROUP.ACTION, label: 'アクション' },
  { value: MESSAGE_TYPE_GROUP.SYSTEM, label: '公開システム' },
  { value: MESSAGE_TYPE_GROUP.PRIVATE_SYSTEM, label: '非公開システム' }
]

const canFilter = computed(() => {
  return (
    selectedMessageTypeGroups.value.length > 0 &&
    selectedParticipantIds.value.length > 0
  )
})

// モーダルが開かれたときにフィルタ状態を初期化
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      initializeFilter()
    }
  }
)

// Methods
const initializeFilter = () => {
  // 現在のフィルタ状態をロード
  selectedMessageTypeGroups.value = storeMessageTypeGroups.value
    ? [...storeMessageTypeGroups.value]
    : [...ALL_MESSAGE_TYPE_GROUPS]

  selectedParticipantIds.value = storeParticipantIds.value
    ? [...storeParticipantIds.value]
    : [...allParticipantIds.value]

  selectedToParticipantIds.value = storeToParticipantIds.value
    ? [...storeToParticipantIds.value]
    : [...allParticipantIds.value]

  keyword.value = storeKeyword.value ?? null
}

const handleFilter = () => {
  // 全選択の場合はnullとして扱う
  const messageTypeGroups =
    selectedMessageTypeGroups.value.length === ALL_MESSAGE_TYPE_GROUPS.length
      ? null
      : selectedMessageTypeGroups.value

  const participantIdList =
    selectedParticipantIds.value.length === allParticipantIds.value.length
      ? null
      : selectedParticipantIds.value

  const toParticipantIdList =
    selectedToParticipantIds.value.length === allParticipantIds.value.length
      ? null
      : selectedToParticipantIds.value

  applyFilter(
    messageTypeGroups,
    participantIdList,
    toParticipantIdList,
    keyword.value
  )

  // メッセージを再読み込み
  loadMessages()

  emit('close')
}

const handleClose = () => {
  emit('close')
}

// 発言種別の操作
const handleAllMessageTypeOn = () => {
  selectedMessageTypeGroups.value = [...ALL_MESSAGE_TYPE_GROUPS]
}

const handleAllMessageTypeOff = () => {
  selectedMessageTypeGroups.value = []
}

const handleReverseMessageType = () => {
  selectedMessageTypeGroups.value = ALL_MESSAGE_TYPE_GROUPS.filter(
    (type) => !selectedMessageTypeGroups.value.includes(type)
  )
}

// 発言者の選択状態確認と操作
const isParticipantSelected = (id: number): boolean => {
  return selectedParticipantIds.value.includes(id)
}

const toggleParticipant = (id: number, checked: boolean | string) => {
  const isChecked = typeof checked === 'boolean' ? checked : checked === 'true'
  if (isChecked) {
    if (!selectedParticipantIds.value.includes(id)) {
      selectedParticipantIds.value = [...selectedParticipantIds.value, id]
    }
  } else {
    selectedParticipantIds.value = selectedParticipantIds.value.filter(
      (i) => i !== id
    )
  }
}

const handleAllParticipantOn = () => {
  selectedParticipantIds.value = [...allParticipantIds.value]
}

const handleAllParticipantOff = () => {
  selectedParticipantIds.value = []
}

const handleReverseParticipant = () => {
  selectedParticipantIds.value = allParticipantIds.value.filter(
    (id) => !selectedParticipantIds.value.includes(id)
  )
}

// 宛先の選択状態確認と操作
const isToParticipantSelected = (id: number): boolean => {
  return selectedToParticipantIds.value.includes(id)
}

const toggleToParticipant = (id: number, checked: boolean | string) => {
  const isChecked = typeof checked === 'boolean' ? checked : checked === 'true'
  if (isChecked) {
    if (!selectedToParticipantIds.value.includes(id)) {
      selectedToParticipantIds.value = [...selectedToParticipantIds.value, id]
    }
  } else {
    selectedToParticipantIds.value = selectedToParticipantIds.value.filter(
      (i) => i !== id
    )
  }
}

const handleAllToParticipantOn = () => {
  selectedToParticipantIds.value = [...allParticipantIds.value]
}

const handleAllToParticipantOff = () => {
  selectedToParticipantIds.value = []
}

const handleReverseToParticipant = () => {
  selectedToParticipantIds.value = allParticipantIds.value.filter(
    (id) => !selectedToParticipantIds.value.includes(id)
  )
}

const handleToMyParticipant = () => {
  if (myself.value) {
    selectedToParticipantIds.value = [myself.value.id]
  }
}
</script>

<style scoped>
/* モーダルカードの最大高さを調整 */
:deep(.modal-card) {
  max-height: calc(100vh - 6.5rem);
}
</style>
