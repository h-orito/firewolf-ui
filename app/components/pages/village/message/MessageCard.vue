<template>
  <div :id="`mc-${message.time.unix_time_milli}`" class="font-normal">
    <!-- 発言系メッセージ -->
    <SayMessage
      v-if="isSayType"
      :message="message"
      :is-img-large="isImgLarge"
      :is-disp-date="isDispDate"
      :is-large-text="isLargeText"
      :is-anchor-message="isAnchorMessage"
      :is-progress="isProgress"
      :can-reply="canReply"
      :can-secret="canSecret"
    />

    <!-- システムメッセージ -->
    <SystemMessage
      v-else-if="isSystemType"
      :message="message"
      :is-large-text="isLargeText"
    />

    <!-- アクションメッセージ -->
    <ActionMessage
      v-else-if="isActionType"
      :message="message"
      :is-disp-date="isDispDate"
      :is-large-text="isLargeText"
      :is-anchor-message="isAnchorMessage"
      :is-progress="isProgress"
    />

    <!-- 参加者一覧メッセージ -->
    <ParticipantsMessage
      v-else-if="isParticipantsType"
      :message="message"
      :is-large-text="isLargeText"
    />
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
  isDispDate?: boolean
  isLargeText?: boolean
  isAnchorMessage?: boolean
  isProgress?: boolean
  canReply?: boolean
  canSecret?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isImgLarge: false,
  isDispDate: false,
  isLargeText: false,
  isAnchorMessage: false,
  isProgress: false,
  canReply: true,
  canSecret: true
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
