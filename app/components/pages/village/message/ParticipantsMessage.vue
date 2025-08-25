<template>
  <div class="participants-message py-2">
    <div class="text-sm font-medium mb-2">{{ message.content.type.name }}</div>
    <!-- 参加者一覧の表示 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      <div
        v-for="participant in participants"
        :key="participant.id"
        class="flex items-center gap-1 text-sm"
      >
        <CharaImage
          v-if="participant.chara"
          :chara="participant.chara"
          :face-type="'NORMAL'"
          :is-large="false"
          :is-small="true"
        />
        <span>{{ participant.chara_name?.name || participant.name }}</span>
      </div>
    </div>
    <div class="mt-2 text-xs text-gray-500">
      {{ formatTime(message.time.datetime) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageView, VillageParticipantView } from '~/lib/api/types'
import CharaImage from '../CharaImage.vue'

interface Props {
  message: MessageView
  participants?: VillageParticipantView[]
}

const _props = withDefaults(defineProps<Props>(), {
  participants: () => []
})

// 時刻フォーマット
const formatTime = (datetime: string) => {
  const date = new Date(datetime)
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}
</script>
