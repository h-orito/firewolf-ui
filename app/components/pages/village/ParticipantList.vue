<template>
  <div class="participant-list">
    <!-- 生存者リスト -->
    <div v-if="isProgress && aliveParticipants.length > 0" class="mb-4 sm:mb-6">
      <h3
        class="mb-2 px-2 text-xs font-semibold text-gray-600 sm:mb-3 sm:text-sm dark:text-gray-400"
      >
        生存（{{ aliveParticipants.length }}人）
      </h3>
      <div class="space-y-1 sm:space-y-2">
        <UCard
          v-for="participant in aliveParticipants"
          :key="participant.id"
          class="participant-card"
        >
          <div class="flex items-start gap-3">
            <!-- キャラクター画像 -->
            <div class="flex-shrink-0">
              <CharaImage :chara="participant.chara" :is-small="true" />
            </div>

            <!-- 参加者情報 -->
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <!-- キャラクター名 -->
                  <h4 class="truncate text-xs font-medium sm:text-sm">
                    {{ truncatedName(participant) }}
                  </h4>

                  <!-- CO情報 -->
                  <div v-if="getComingOut(participant)" class="mt-1">
                    <UBadge color="info" variant="soft" size="xs">
                      {{ getComingOut(participant) }}
                    </UBadge>
                  </div>
                </div>

                <!-- アクション -->
                <div class="flex items-center gap-2">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    :aria-label="`${truncatedName(participant)}の発言を抽出`"
                    @click="handleFilter(participant.id)"
                  >
                    抽出
                  </UButton>
                </div>
              </div>

              <!-- 発言回数 -->
              <div
                class="mt-1 text-xs text-gray-500 sm:mt-2 dark:text-gray-400"
              >
                <span class="hidden sm:inline"
                  >{{ getSayCount(participant.id) }}回発言</span
                >
                <span class="sm:hidden"
                  >{{ getSayCount(participant.id) }}回</span
                >
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- 死亡者リスト -->
    <div v-if="isProgress && deadParticipants.length > 0" class="mb-4 sm:mb-6">
      <h3
        class="mb-2 px-2 text-xs font-semibold text-gray-600 sm:mb-3 sm:text-sm dark:text-gray-400"
      >
        死亡（{{ deadParticipants.length }}人）
      </h3>
      <div class="space-y-1 sm:space-y-2">
        <UCard
          v-for="participant in deadParticipants"
          :key="participant.id"
          class="participant-card opacity-75"
        >
          <div class="flex items-start gap-3">
            <!-- キャラクター画像 -->
            <div class="flex-shrink-0">
              <CharaImage :chara="participant.chara" :is-small="true" />
            </div>

            <!-- 参加者情報 -->
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <!-- キャラクター名 -->
                  <h4 class="truncate text-xs font-medium sm:text-sm">
                    {{ truncatedName(participant) }}
                  </h4>

                  <!-- CO情報 -->
                  <div v-if="getComingOut(participant)" class="mt-1">
                    <UBadge color="info" variant="soft" size="xs">
                      {{ getComingOut(participant) }}
                    </UBadge>
                  </div>
                </div>

                <!-- アクション -->
                <div class="flex items-center gap-2">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    :aria-label="`${truncatedName(participant)}の発言を抽出`"
                    @click="handleFilter(participant.id)"
                  >
                    抽出
                  </UButton>
                </div>
              </div>

              <!-- 死亡情報・発言回数 -->
              <div class="mt-2 flex justify-between text-xs">
                <span :class="getDeadStatusClass(participant.dead!.reason)">
                  {{ getDeadStatus(participant) }}
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                  {{ getSayCount(participant.id) }}回発言
                </span>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- 見学者リスト -->
    <div v-if="spectators.length > 0" class="mb-6">
      <h3
        class="mb-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400"
      >
        見学（{{ spectators.length }}人）
      </h3>
      <div class="space-y-2">
        <UCard
          v-for="participant in spectators"
          :key="participant.id"
          class="participant-card"
        >
          <div class="flex items-start gap-3">
            <!-- キャラクター画像 -->
            <div class="flex-shrink-0">
              <CharaImage :chara="participant.chara" :is-small="true" />
            </div>

            <!-- 参加者情報 -->
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <!-- キャラクター名 -->
                  <h4 class="truncate text-xs font-medium sm:text-sm">
                    {{ truncatedName(participant) }}
                  </h4>
                </div>

                <!-- アクション -->
                <div class="flex items-center gap-2">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    :aria-label="`${truncatedName(participant)}の発言を抽出`"
                    @click="handleFilter(participant.id)"
                  >
                    抽出
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- プロローグ時の全参加者リスト -->
    <div v-if="!isProgress && allParticipants.length > 0">
      <h3
        class="mb-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400"
      >
        参加者（{{ allParticipants.length }}人）
      </h3>
      <div class="space-y-2">
        <UCard
          v-for="participant in allParticipants"
          :key="participant.id"
          class="participant-card"
        >
          <div class="flex items-start gap-3">
            <!-- キャラクター画像 -->
            <div class="flex-shrink-0">
              <CharaImage :chara="participant.chara" :is-small="true" />
            </div>

            <!-- 参加者情報 -->
            <div class="min-w-0 flex-1">
              <h4 class="truncate text-sm font-medium">
                {{ truncatedName(participant) }}
              </h4>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VillageParticipantView } from '~/lib/api/types'
import CharaImage from './CharaImage.vue'

interface Props {
  participants: VillageParticipantView[]
  spectators?: VillageParticipantView[]
  isProgress?: boolean
  messageCountMap?: Record<number, number>
}

const props = withDefaults(defineProps<Props>(), {
  spectators: () => [],
  isProgress: false,
  messageCountMap: () => ({})
})

const emit = defineEmits<{
  filter: [participantId: number]
}>()

// 計算プロパティ
const allParticipants = computed(() =>
  props.participants.filter((p) => !p.spectator)
)

const aliveParticipants = computed(() =>
  allParticipants.value.filter((p) => !p.dead)
)

const deadParticipants = computed(() =>
  allParticipants.value
    .filter((p) => p.dead)
    .sort((a, b) => {
      if (!a.dead || !b.dead) return 0

      // 死亡日でソート
      const dayDiff = a.dead.village_day.day - b.dead.village_day.day
      if (dayDiff !== 0) return dayDiff

      // 同日の場合は死因でソート（突然→処刑→その他）
      const aPriority = getDeadReasonPriority(a.dead.reason)
      const bPriority = getDeadReasonPriority(b.dead.reason)
      return bPriority - aPriority
    })
)

const spectators = computed(() => props.spectators.filter((p) => p.spectator))

// メソッド
const truncatedName = (participant: VillageParticipantView): string => {
  const name = participant.chara_name.name
  return name.length > 20 ? name.substring(0, 20) + '...' : name
}

const getComingOut = (participant: VillageParticipantView): string | null => {
  const coList = participant.comming_outs?.list || []
  if (coList.length === 0) return null
  return coList.map((co) => co.skill.short_name).join(',') + 'CO'
}

const getSayCount = (participantId: number): number => {
  return props.messageCountMap[participantId] || 0
}

const getDeadStatus = (participant: VillageParticipantView): string => {
  if (!participant.dead) return ''
  const day = participant.dead.village_day.day
  const reason = participant.dead.reason
  return `${day}d${reason}`
}

const getDeadStatusClass = (reason: string): string => {
  if (reason === '突然' || reason === '処刑') {
    return 'text-blue-600 dark:text-blue-400'
  }
  return 'text-red-600 dark:text-red-400'
}

const getDeadReasonPriority = (reason: string): number => {
  if (reason === '突然') return 2
  if (reason === '処刑') return 1
  return 0
}

const handleFilter = (participantId: number) => {
  emit('filter', participantId)
}
</script>

<style scoped>
.participant-card:hover {
  background-color: rgba(249, 250, 251, 1);
}

@media (prefers-color-scheme: dark) {
  .participant-card:hover {
    background-color: rgba(31, 41, 55, 0.5);
  }
}

.participant-card {
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
