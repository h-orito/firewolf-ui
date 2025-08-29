<template>
  <section class="py-8">
    <div class="container mx-auto px-4">
      <Loading
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
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- 総合戦績 -->
          <div>
            <h2 class="mb-4 text-lg font-semibold">総合戦績</h2>
            <div class="rounded-lg bg-white p-4 shadow">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-800">
                  {{ wholeResult }}
                </p>
                <div class="mt-4 flex justify-center gap-4">
                  <div class="text-sm">
                    <span class="font-semibold text-blue-600">勝利:</span>
                    {{ playerRecords.whole_record.win_count }}
                  </div>
                  <div class="text-sm">
                    <span class="font-semibold text-red-600">敗北:</span>
                    {{ wholeLoseCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 陣営戦績 -->
          <div>
            <h2 class="mb-4 text-lg font-semibold">陣営戦績</h2>
            <div class="space-y-2">
              <div
                v-for="campRecord in playerRecords.camp_record_list"
                :key="campRecord.camp.code"
                class="rounded-lg bg-white p-3 shadow"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">
                    {{ campRecord.camp.name }}
                  </span>
                  <span class="text-sm text-gray-600">
                    {{ campResult(campRecord) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 役職戦績 -->
        <div class="mt-8">
          <h2 class="mb-4 text-lg font-semibold">役職戦績</h2>
          <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div
              v-for="skillRecord in playerRecords.skill_record_list"
              :key="skillRecord.skill.code"
              class="rounded-lg bg-white p-3 shadow"
            >
              <div class="mb-1 text-sm font-medium">
                {{ skillRecord.skill.name }}
              </div>
              <div class="text-xs text-gray-600">
                {{ skillResult(skillRecord) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 参加した村 -->
        <div class="mt-8">
          <h2 class="mb-4 text-xl font-semibold">参加した村</h2>
          <div class="overflow-hidden rounded-lg bg-white shadow">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    村名
                  </th>
                  <th
                    class="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    日数
                  </th>
                  <th
                    class="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    役職
                  </th>
                  <th
                    class="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    結果
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="pv in playerRecords.participate_village_list"
                  :key="pv.village.id"
                >
                  <td class="px-3 py-2 text-sm">
                    <NuxtLink
                      :to="`/village?id=${pv.village.id}&day=latest&tab=info`"
                      class="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {{ pv.village.name }}
                    </NuxtLink>
                  </td>
                  <td class="px-3 py-2 text-sm text-gray-900">
                    {{ pv.village.day.day_list.length }}日
                  </td>
                  <td class="px-3 py-2 text-sm text-gray-900">
                    {{ pv.participant.skill ? pv.participant.skill.name : '-' }}
                  </td>
                  <td class="px-3 py-2 text-sm">
                    <span
                      v-if="pv.participant.win"
                      class="font-medium text-blue-600"
                    >
                      勝利
                    </span>
                    <span v-else class="font-medium text-red-600"> 敗北 </span>
                  </td>
                </tr>
              </tbody>
            </table>
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
  </section>
</template>

<script setup lang="ts">
import type {
  PlayerRecordsView,
  CampRecord,
  SkillRecord
} from '~/lib/api/types'

// ルートパラメータ
const route = useRoute()
const playerId = computed(() => route.query.id as string | undefined)

// SEO設定
useHead({
  title: 'ユーザ戦績'
})

// データ
const playerRecords = ref<PlayerRecordsView | null>(null)
const loadingRecords = ref(false)

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

// データ取得
onMounted(async () => {
  if (!playerId.value) {
    console.error('プレイヤーIDが指定されていません')
    return
  }

  loadingRecords.value = true
  try {
    const { apiCall } = useApi()
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
})
</script>
