<template>
  <div class="space-y-2">
    <div v-if="messages.length === 0" class="py-8 text-center text-gray-500">
      切り抜きメッセージがありません
    </div>

    <template v-for="message in messages" :key="message.time.unix_time_milli">
      <MessageCard
        :message="message"
        :is-progress="isProgress"
        :can-reply="false"
        :can-secret="false"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView } from '~/lib/api/types'
import MessageCard from '~/components/pages/village/message/MessageCard.vue'

interface Props {
  messages: DeepReadonly<MessageView[]>
  isProgress?: boolean
}

withDefaults(defineProps<Props>(), {
  isProgress: false
})
</script>
