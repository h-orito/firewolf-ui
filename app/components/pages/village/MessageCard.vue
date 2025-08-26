<template>
  <div :id="`mc-${message.time.unix_time_milli}`">
    <UCard class="border-0 bg-transparent p-1 shadow-none sm:p-2">
      <!-- 発言系メッセージ -->
      <SayMessage
        v-if="isSayType"
        :message="message"
        :is-img-large="isImgLarge"
      />

      <!-- システムメッセージ -->
      <SystemMessage v-else-if="isSystemType" :message="message" />

      <!-- アクションメッセージ -->
      <ActionMessage v-else-if="isActionType" :message="message" />

      <!-- 参加者一覧メッセージ -->
      <ParticipantsMessage
        v-else-if="isParticipantsType"
        :message="message"
        :participants="participants"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { MessageView, VillageParticipantView } from '~/lib/api/types'
import SayMessage from './message/SayMessage.vue'
import SystemMessage from './message/SystemMessage.vue'
import ActionMessage from './message/ActionMessage.vue'
import ParticipantsMessage from './message/ParticipantsMessage.vue'

interface Props {
  message: MessageView
  isImgLarge?: boolean
  participants?: VillageParticipantView[]
}

const props = withDefaults(defineProps<Props>(), {
  isImgLarge: false,
  participants: () => []
})

// メッセージタイプの判定
const isSayType = computed(() => {
  const sayTypeCodes = [
    'NORMAL_SAY',
    'WEREWOLF_SAY',
    'GRAVE_SAY',
    'SPECTATE_SAY',
    'MONOLOGUE_SAY',
    'SYMPATHIZE_SAY',
    'LOVERS_SAY',
    'SECRET_SAY'
  ]
  return sayTypeCodes.includes(props.message.content.type.code)
})

const isSystemType = computed(() => {
  const systemTypeCodes = [
    'PUBLIC_SYSTEM',
    'PRIVATE_SYSTEM',
    'PRIVATE_ABILITY',
    'PRIVATE_SEER',
    'PRIVATE_WISE',
    'PRIVATE_PSYCHIC',
    'PRIVATE_GURU',
    'PRIVATE_CORONER',
    'PRIVATE_WEREWOLF',
    'PRIVATE_FANATIC',
    'PRIVATE_MASON',
    'PRIVATE_LOVERS',
    'PRIVATE_FOX',
    'PRIVATE_SYMPATHIZER',
    'CREATOR_SAY'
  ]
  return systemTypeCodes.includes(props.message.content.type.code)
})

const isActionType = computed(() => {
  return props.message.content.type.code === 'ACTION'
})

// 参加者一覧メッセージかどうか
const isParticipantsType = computed(
  () => props.message.content.type.code === 'PARTICIPANTS'
)
</script>
