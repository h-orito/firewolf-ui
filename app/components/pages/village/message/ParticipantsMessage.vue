<template>
  <div
    class="participants-message rounded border border-gray-300 p-2 sm:p-3 dark:border-gray-600"
  >
    <div class="mb-2 text-xs font-bold sm:mb-3 sm:text-sm">参加者一覧</div>
    <!-- 参加者一覧の表示 -->
    <div class="space-y-1 sm:space-y-2">
      <div
        v-for="participant in sortedParticipants"
        :key="participant.id"
        class="flex items-start gap-2 border-t border-gray-200 pt-1 first:border-t-0 first:pt-0 sm:gap-3 sm:pt-2 dark:border-gray-700"
      >
        <!-- キャラクター画像 -->
        <div class="flex-shrink-0">
          <CharaImage
            v-if="participant.chara"
            :chara="participant.chara"
            :face-type="'NORMAL'"
            :is-large="false"
            :is-small="true"
          />
        </div>

        <!-- 名前・プレイヤー情報エリア -->
        <div class="flex-1 text-xs">
          <!-- キャラクター名とプレイヤー情報 -->
          <div class="mb-1 flex flex-wrap items-center gap-1">
            <span class="font-medium">{{ getCharaName(participant) }}</span>
            <span class="text-gray-600 dark:text-gray-400">
              {{ participant.player?.nickname }}
            </span>
            <a
              v-if="participant.player?.twitter_user_name"
              :href="`https://twitter.com/${participant.player.twitter_user_name}`"
              target="_blank"
              class="text-blue-500 hover:text-blue-700 dark:text-blue-400"
            >
              @{{ participant.player.twitter_user_name }}
            </a>
            <span
              class="ml-auto text-xs"
              :class="getCharaStatusClass(participant)"
            >
              {{ getCharaStatus(participant) }}
            </span>
          </div>

          <!-- 役職・勝敗情報 -->
          <div class="flex flex-wrap items-center gap-1">
            <span class="font-medium">{{ getSkillName(participant) }}</span>
            <span class="text-gray-600 dark:text-gray-400">{{
              getSkillRequest(participant)
            }}</span>
            <span
              v-if="!participant.spectator"
              class="ml-auto text-xs"
              :class="getWinStatusClass(participant)"
            >
              {{ getWinStatus(participant) }}
            </span>
          </div>
        </div>

        <!-- 戦績ボタン -->
        <div v-if="participant.player" class="flex-shrink-0">
          <UButton
            :to="{
              path: '/player-record',
              query: { id: participant.player.id }
            }"
            target="_blank"
            size="xs"
            variant="outline"
            icon="i-heroicons-chart-bar"
            :aria-label="`${participant.player.nickname}の戦績を見る`"
          />
        </div>
      </div>
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

const props = withDefaults(defineProps<Props>(), {
  participants: () => []
})

// 参加者の並び順（旧コンポーネントの論理を踏襲）
const sortedParticipants = computed(() => {
  const participantList = [...props.participants]
  const members = participantList.filter((p) => !p.spectator)
  const spectators = participantList.filter((p) => p.spectator)

  // メンバーをソート（死亡者が先、同じ死亡状況なら日付順、同日なら死因順）
  members.sort((vp1, vp2) => compareParticipant(vp1, vp2))

  // メンバー + 見学者の順
  return [...members, ...spectators]
})

// 参加者の比較関数
const compareParticipant = (
  vp1: VillageParticipantView,
  vp2: VillageParticipantView
): number => {
  // 死亡している人が先
  const vp1isDead = !!vp1.dead
  const vp2isDead = !!vp2.dead
  if (vp1isDead && !vp2isDead) return -1
  if (!vp1isDead && vp2isDead) return 1
  // どちらも死亡していなければ等価
  if (!vp1isDead && !vp2isDead) return 0
  // どちらも死亡している場合は日付が早い順
  const vp1DeadDay = vp1.dead!.village_day.day
  const vp2DeadDay = vp2.dead!.village_day.day
  if (vp1DeadDay !== vp2DeadDay) return vp1DeadDay - vp2DeadDay
  // 日付も同じ場合は凸->処刑->他
  const vp1DeadReason = vp1.dead!.reason
  const vp2DeadReason = vp2.dead!.reason
  return deadReasonPriority(vp2DeadReason) - deadReasonPriority(vp1DeadReason)
}

// 死因の優先度
const deadReasonPriority = (reason: string): number => {
  if (reason === '突然') return 2
  if (reason === '処刑') return 1
  if (reason === '後追') return -1
  return 0
}

// キャラクター名（長い場合は省略）
const getCharaName = (participant: VillageParticipantView): string => {
  const fullName = participant.name
  if (fullName.length < 20) return fullName
  return fullName.substring(0, 20) + '...'
}

// キャラクターの状態（生存/死亡情報）
const getCharaStatus = (participant: VillageParticipantView): string => {
  if (participant.spectator) return ''
  if (!participant.dead) return '生存'
  const day = participant.dead.village_day.day
  const reason = participant.dead.reason
  return `${day}d${reason}`
}

// キャラクター状態のスタイルクラス
const getCharaStatusClass = (participant: VillageParticipantView): string => {
  if (participant.spectator || !participant.dead) return ''
  const reason = participant.dead.reason
  if (reason === '突然' || reason === '処刑')
    return 'text-blue-500 dark:text-blue-400'
  return 'text-red-500 dark:text-red-400'
}

// 勝敗状態
const getWinStatus = (participant: VillageParticipantView): string => {
  if (participant.spectator) return ''
  return participant.win ? '勝利' : '敗北'
}

// 勝敗状態のスタイルクラス
const getWinStatusClass = (participant: VillageParticipantView): string => {
  if (participant.spectator) return ''
  return participant.win
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-500 dark:text-red-400'
}

// 役職名（恋絆考慮）
const getSkillName = (participant: VillageParticipantView): string => {
  if (participant.spectator) return '見物人'
  const skillName = participant.skill?.name || '不明'
  if (
    participant.status.lover_id_list &&
    participant.status.lover_id_list.length > 0
  )
    return `${skillName}（恋絆）`
  return skillName
}

// 希望役職
const getSkillRequest = (participant: VillageParticipantView): string => {
  if (participant.spectator) return ''
  if (!participant.skill_request) return ''
  const req1 = participant.skill_request.first?.name || '？'
  const req2 = participant.skill_request.second?.name || '？'
  return `（${req1}/${req2}希望）`
}
</script>
