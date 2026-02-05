<template>
  <Modal v-model="isOpen" title="画像から選択">
    <div class="flex flex-wrap justify-center gap-3">
      <button
        v-for="participant in participantList"
        :key="participant.id"
        type="button"
        class="hover:border-primary-500 dark:hover:border-primary-400 flex w-36 cursor-pointer flex-col items-center rounded-2xl border border-gray-300 p-2 hover:font-bold dark:border-gray-600"
        @click="selectParticipant(participant.id)"
      >
        <CharaImage :chara="participant.chara" />
        <p class="mt-1 text-center text-xs">{{ participant.name }}</p>
      </button>
    </div>
    <template #footer>
      <UiButton variant="outline" color="secondary" @click="close">
        キャンセル
      </UiButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import type {
  VillageParticipantView,
  CharaView,
  CharaName,
  CharaSize,
  CharaFace,
  CharaDefaultMessage
} from '~/lib/api/types'
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'
import CharaImage from '../../CharaImage.vue'

// APIから返却されるdeep readonly な型も受け入れる
type ReadonlyDeepCharaView = {
  readonly id: number
  readonly chara_name: Readonly<CharaName>
  readonly charachip_id: number
  readonly default_message: Readonly<CharaDefaultMessage>
  readonly display: Readonly<CharaSize>
  readonly face_list: readonly Readonly<CharaFace>[]
}

type ReadonlyDeepParticipant = {
  readonly id: number
  readonly name: string
  readonly chara: CharaView | ReadonlyDeepCharaView
  // 他のプロパティは使用しないため省略
  [key: string]: unknown
}

interface Props {
  modelValue: boolean
  participantList: readonly (VillageParticipantView | ReadonlyDeepParticipant)[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', participantId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const selectParticipant = (participantId: number) => {
  emit('select', participantId)
  isOpen.value = false
}

const close = () => {
  isOpen.value = false
}
</script>
