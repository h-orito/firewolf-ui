<template>
  <div :id="`mc-${message.time.unix_time_milli}`">
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
    <ParticipantsMessage v-else-if="isParticipantsType" :message="message" />
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView } from '~/lib/api/types'
import {
  isSayType as checkSayType,
  isSystemType as checkSystemType,
  isActionType as checkActionType,
  isParticipantsType as checkParticipantsType
} from '~/lib/api/message-constants'
import SayMessage from './SayMessage.vue'
import SystemMessage from './SystemMessage.vue'
import ActionMessage from './ActionMessage.vue'
import ParticipantsMessage from './ParticipantsMessage.vue'

interface Props {
  message: DeepReadonly<MessageView> | MessageView
  isImgLarge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isImgLarge: false
})

// メッセージタイプの判定
const isSayType = computed(() => checkSayType(props.message.content.type.code))
const isSystemType = computed(() =>
  checkSystemType(props.message.content.type.code)
)
const isActionType = computed(() =>
  checkActionType(props.message.content.type.code)
)
const isParticipantsType = computed(() =>
  checkParticipantsType(props.message.content.type.code)
)
</script>
