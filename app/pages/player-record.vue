<template>
  <section class="py-8">
    <div class="container mx-auto px-4">
      <LoadingSpinner
        v-if="loadingRecords"
        :message="'戦績を読み込み中...'"
        :fixed="true"
      />
      <div v-if="!loadingRecords && playerRecords">
        <h1 v-if="playerName" class="mb-8 text-xl font-semibold">
          {{ playerName }}
        </h1>

        <!-- 自己紹介 -->
        <div class="mb-8">
          <h2 class="mb-4 text-lg font-semibold">自己紹介</h2>
          <div class="rounded-lg bg-white p-4 shadow">
            <p class="mb-4 text-sm text-gray-700">
              他人狼サイトでのID: {{ otherSiteName || '未登録' }}
            </p>
            <div v-if="introduction" class="text-sm text-gray-700">
              <p
                v-for="(intro, index) in escapeAndSplitMessage(introduction)"
                :key="index"
                class="break-words"
                v-html="intro"
              ></p>
            </div>
            <div v-else class="text-sm text-gray-500">
              自己紹介が登録されていません
            </div>
            <UiButton
              v-if="isMyself"
              class="mt-4"
              color="primary"
              size="sm"
              @click="isModalOpen = true"
            >
              編集する
            </UiButton>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- 総合戦績 -->
          <div>
            <h2 class="mb-4 text-lg font-semibold">総合戦績</h2>
            <div class="rounded-lg bg-white p-4 shadow">
              <div class="flex flex-col items-center">
                <DoughnutChart
                  :win-count="playerRecords.whole_record.win_count"
                  :lose-count="wholeLoseCount"
                  label="全体"
                  :size="120"
                />
                <p class="mt-3 text-sm text-gray-700">{{ wholeResult }}</p>
              </div>
            </div>
          </div>

          <!-- 陣営戦績 -->
          <div>
            <h2 class="mb-4 text-lg font-semibold">陣営戦績</h2>
            <div class="rounded-lg bg-white p-4 shadow">
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="campRecord in playerRecords.camp_record_list"
                  :key="campRecord.camp.code"
                  class="flex flex-col items-center"
                >
                  <DoughnutChart
                    :win-count="campRecord.win_count"
                    :lose-count="campLoseCount(campRecord)"
                    :label="campRecord.camp.name"
                    :size="100"
                  />
                  <p class="mt-2 text-xs text-gray-600">
                    {{ campResult(campRecord) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 役職戦績 -->
        <div class="mt-8">
          <h2 class="mb-4 text-lg font-semibold">役職戦績</h2>
          <div class="rounded-lg bg-white p-4 shadow">
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <div
                v-for="skillRecord in playerRecords.skill_record_list"
                :key="skillRecord.skill.code"
                class="flex flex-col items-center"
              >
                <DoughnutChart
                  :win-count="skillRecord.win_count"
                  :lose-count="skillLoseCount(skillRecord)"
                  :label="skillRecord.skill.name"
                  :size="80"
                />
                <p class="mt-2 text-xs text-gray-600">
                  {{ skillResult(skillRecord) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 参加した村 -->
        <div class="mt-8">
          <h2 class="mb-4 text-xl font-semibold">参加した村</h2>
          <div class="overflow-hidden rounded-lg bg-white shadow">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 text-xs">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-2 py-2 text-left font-semibold text-gray-900">
                      村名
                    </th>
                    <th class="px-2 py-2 text-left font-semibold text-gray-900">
                      人数
                    </th>
                    <th class="px-2 py-2 text-left font-semibold text-gray-900">
                      キャラ
                    </th>
                    <th class="px-2 py-2 text-left font-semibold text-gray-900">
                      役職
                    </th>
                    <th class="px-2 py-2 text-left font-semibold text-gray-900">
                      生死
                    </th>
                    <th class="px-2 py-2 text-left font-semibold text-gray-900">
                      陣営
                    </th>
                    <th class="px-2 py-2 text-left font-semibold text-gray-900">
                      勝敗
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr
                    v-for="pv in playerRecords.participate_village_list"
                    :key="pv.village.id"
                  >
                    <td class="px-2 py-2">
                      <NuxtLink
                        :to="`/village?id=${pv.village.id}`"
                        class="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {{ pv.village.name }}
                      </NuxtLink>
                    </td>
                    <td class="px-2 py-2 whitespace-nowrap text-gray-900">
                      {{ getParticipantCount(pv) }}
                    </td>
                    <td class="px-2 py-2 whitespace-nowrap text-gray-900">
                      {{ pv.participant.name }}
                    </td>
                    <td class="px-2 py-2 whitespace-nowrap text-gray-900">
                      {{ getSkillName(pv) }}
                    </td>
                    <td class="px-2 py-2 whitespace-nowrap text-gray-900">
                      {{ getStatus(pv) }}
                    </td>
                    <td class="px-2 py-2 whitespace-nowrap text-gray-900">
                      {{ getCampName(pv) }}
                    </td>
                    <td class="px-2 py-2 whitespace-nowrap">
                      <span
                        v-if="pv.participant.spectator"
                        class="text-gray-500"
                      >
                        -
                      </span>
                      <span
                        v-else-if="pv.participant.win"
                        class="font-medium text-blue-600"
                      >
                        勝利
                      </span>
                      <span v-else class="font-medium text-red-600">
                        敗北
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- データなし -->
      <div
        v-if="!loadingRecords && !playerRecords"
        class="rounded-lg bg-white p-8 shadow"
      >
        <div class="text-center text-gray-500">
          <p>プレイヤー情報が見つかりませんでした</p>
        </div>
      </div>
    </div>

    <!-- 自己紹介編集モーダル -->
    <ModalIntro
      v-if="playerRecords"
      v-model="isModalOpen"
      :current-nickname="playerRecords.player.nickname"
      :current-other-site-name="playerRecords.player.other_site_name"
      :current-intro="playerRecords.player.introduction"
      @refresh="refresh"
    />
  </section>
</template>

<script setup lang="ts">
import LoadingSpinner from '~/components/ui/feedback/LoadingSpinner.vue'
import UiButton from '~/components/ui/button/index.vue'
import type {
  PlayerRecordsView,
  CampRecord,
  SkillRecord,
  ParticipateVillageView
} from '~/lib/api/types'

// 遅延ローディング: DoughnutChartはChart.jsを使用するため重い
const DoughnutChart = defineAsyncComponent(
  () => import('~/components/pages/player-record/DoughnutChart.vue')
)
// 遅延ローディング: ModalIntroは編集ボタンクリック時まで不要
const ModalIntro = defineAsyncComponent(
  () => import('~/components/pages/player-record/ModalIntro.vue')
)

// ルートパラメータ
const route = useRoute()
const playerId = computed(() => route.query.id as string | undefined)

// API
const { apiCall } = useApi()

// 認証
const { myselfPlayer } = useAuth()

// SEO設定
useHead({
  title: 'ユーザ戦績'
})

// データ
const playerRecords = ref<PlayerRecordsView | null>(null)
const loadingRecords = ref(false)
const isModalOpen = ref(false)

// computed
const playerName = computed(() => {
  if (!playerRecords.value) return ''
  const player = playerRecords.value.player
  if (player.twitter_user_name) {
    return `${player.nickname}@${player.twitter_user_name}`
  }
  return player.nickname
})

const otherSiteName = computed(() => {
  if (!playerRecords.value) return null
  return playerRecords.value.player.other_site_name
})

const introduction = computed(() => {
  if (!playerRecords.value) return null
  return playerRecords.value.player.introduction
})

const wholeLoseCount = computed(() => {
  if (!playerRecords.value) return 0
  const wholeRecord = playerRecords.value.whole_record
  return wholeRecord.participate_count - wholeRecord.win_count
})

const wholeResult = computed(() => {
  if (!playerRecords.value) return ''
  const wholeRecord = playerRecords.value.whole_record
  return titleString(
    wholeRecord.win_count,
    wholeLoseCount.value,
    wholeRecord.win_rate
  )
})

// 自分自身かどうか
const isMyself = computed(() => {
  if (!myselfPlayer.value || !playerRecords.value) return false
  return myselfPlayer.value.id === playerRecords.value.player.id
})

// メソッド
const titleString = (winCount: number, loseCount: number, winRate: number) => {
  return `${winCount}勝${loseCount}負 (${Math.round(winRate * 100)}%)`
}

const campLoseCount = (campRecord: CampRecord) => {
  return campRecord.participate_count - campRecord.win_count
}

const campResult = (campRecord: CampRecord) => {
  return titleString(
    campRecord.win_count,
    campLoseCount(campRecord),
    campRecord.win_rate
  )
}

const skillLoseCount = (skillRecord: SkillRecord) => {
  return skillRecord.participate_count - skillRecord.win_count
}

const skillResult = (skillRecord: SkillRecord) => {
  return titleString(
    skillRecord.win_count,
    skillLoseCount(skillRecord),
    skillRecord.win_rate
  )
}

// 参加した村の表示用ヘルパー関数
const getParticipantCount = (pv: ParticipateVillageView) => {
  const participantCount = pv.village.participant.count
  const spectatorCount = pv.village.spectator.count
  const organization =
    pv.village.setting.organizations.organization[participantCount.toString()]
  const countStr =
    spectatorCount > 0
      ? `${participantCount}+${spectatorCount}人`
      : `${participantCount}人`
  return `${countStr}(${organization})`
}

const getSkillName = (pv: ParticipateVillageView) => {
  if (pv.participant.spectator) return '見物人'
  const skillName = pv.participant.skill?.name ?? '-'
  // 恋絆の場合は表示を追加
  if (
    pv.participant.status?.lover_id_list &&
    pv.participant.status.lover_id_list.length > 0
  ) {
    return `${skillName}（恋絆）`
  }
  return skillName
}

const getStatus = (pv: ParticipateVillageView) => {
  if (pv.participant.spectator) return ''
  if (!pv.participant.dead) return '生存'
  const deadDay = pv.participant.dead.village_day.day
  const reason = pv.participant.dead.reason
  return `${deadDay}d ${reason}死`
}

const getCampName = (pv: ParticipateVillageView) => {
  if (pv.participant.spectator) return ''
  return pv.participant.camp?.name ?? ''
}

const escapeAndSplitMessage = (message: string): string[] => {
  return message
    .replace(/(\r\n|\n|\r)/gm, '<br>')
    .split('<br>')
    .map((item) => {
      item = item
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      return item
    })
}

const loadRecord = async () => {
  if (!playerId.value) {
    console.error('プレイヤーIDが指定されていません')
    return
  }

  loadingRecords.value = true
  try {
    const response = await apiCall<PlayerRecordsView>(
      `/player/${playerId.value}/record`
    )
    playerRecords.value = response
  } catch (error) {
    console.error('プレイヤー戦績の取得に失敗しました:', error)
    playerRecords.value = null
  } finally {
    loadingRecords.value = false
  }
}

const refresh = async () => {
  await loadRecord()
}

// データ取得
onMounted(async () => {
  await loadRecord()
})
</script>
