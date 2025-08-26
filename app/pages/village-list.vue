<template>
  <div>
    <section class="bg-gray-100 py-8 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <h1 class="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
          終了した村一覧
        </h1>

        <!-- フィルター -->
        <div class="mb-6 flex justify-center">
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <input
              v-model="includeCancelVillage"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              @change="handleIncludeCancelChange"
            />
            <span class="text-gray-700 dark:text-gray-300">廃村も表示する</span>
          </label>
        </div>

        <!-- ローディング -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="text-center">
            <Icon
              name="i-heroicons-arrow-path"
              class="h-8 w-8 animate-spin text-gray-500"
            />
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              村一覧を読み込み中...
            </p>
          </div>
        </div>

        <!-- テーブル -->
        <div
          v-if="!loading && tableVillages.length > 0"
          class="overflow-x-auto"
        >
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  村名
                </th>
                <th
                  class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                >
                  人数
                </th>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  編成
                </th>
                <th
                  class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                >
                  勝利
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="village in tableVillages" :key="village.village_id">
                <td class="p-2 text-sm whitespace-nowrap text-gray-900">
                  <NuxtLink
                    :to="`/village?id=${village.village_id}`"
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ village.village_name }}
                  </NuxtLink>
                </td>
                <td
                  class="p-2 text-center text-sm whitespace-nowrap text-gray-900"
                >
                  {{ village.participant_count }}
                </td>
                <td class="p-2 text-left text-sm text-gray-900">
                  {{ village.organization }}
                </td>
                <td
                  class="p-2 text-center text-sm whitespace-nowrap text-gray-900"
                >
                  {{ village.win_camp }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 空の状態 -->
        <div
          v-else-if="!loading && tableVillages.length === 0"
          class="rounded-lg bg-white p-12 shadow-md dark:bg-gray-800"
        >
          <div class="text-center text-gray-500 dark:text-gray-400">
            <p>終了した村はありません</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { VillagesView, SimpleVillageView } from '~/lib/api/types'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { createSeoMeta } from '~/utils/seo'

// メタデータ
useSeoMeta(
  createSeoMeta({
    title: '終了した村一覧',
    description: 'FIREWOLFで終了した人狼ゲーム村の一覧を表示します。'
  })
)

// 状態
const villages = ref<SimpleVillageView[]>([])
const loading = ref(false)
const includeCancelVillage = ref(false)

// テーブル用のデータ変換
const tableVillages = computed(() => {
  return villages.value.map((village) => ({
    village_id: village.id,
    village_name: village.name,
    participant_count: `${village.participant.count}人`,
    organization:
      village.status.code === VILLAGE_STATUS.CANCEL
        ? village.setting.organizations.organization[
            village.setting.capacity.max
          ]
        : village.setting.organizations.organization[village.participant.count],
    win_camp: village.win_camp?.name || '廃村'
  }))
})

// メソッド
const loadVillages = async () => {
  loading.value = true
  try {
    const { apiCall } = useApi()

    // VillageListFormの村ステータス配列を構築
    const villageStatusList = [VILLAGE_STATUS.COMPLETED] as string[]
    if (includeCancelVillage.value) {
      villageStatusList.push(VILLAGE_STATUS.CANCEL)
    }

    const response = await apiCall<VillagesView>('/village/list', {
      params: {
        village_status: villageStatusList
      }
    })

    villages.value = response.list
  } catch (error) {
    console.error('Failed to fetch villages:', error)
  } finally {
    loading.value = false
  }
}

const handleIncludeCancelChange = async () => {
  await loadVillages()
}

// 初期データ取得
onMounted(async () => {
  await loadVillages()
})
</script>
