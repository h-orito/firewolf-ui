<template>
  <div>
    <section class="bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <h1 class="mb-4 text-xl font-semibold">キャラチップ一覧</h1>
        <div class="text-sm">
          <!-- ローディング表示 -->
          <LoadingSpinner
            v-if="loadingCharachips"
            :message="'キャラチップ一覧を読み込み中...'"
          />

          <!-- テーブル表示 -->
          <div
            v-else-if="displayCharachips.length > 0"
            class="overflow-hidden rounded-lg bg-white shadow"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    キャラチップ名
                  </th>
                  <th
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    作者
                  </th>
                  <th
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    例
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="charachip in displayCharachips" :key="charachip.id">
                  <td
                    class="p-2 text-left text-sm whitespace-nowrap text-gray-900"
                  >
                    <NuxtLink
                      :to="`/charachip?id=${charachip.id}`"
                      class="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {{ charachip.name }}
                    </NuxtLink>
                  </td>
                  <td
                    class="p-2 text-left text-sm whitespace-nowrap text-gray-900"
                  >
                    {{ charachip.designer.name }}
                  </td>
                  <td class="p-2 whitespace-nowrap">
                    <VillageCharaImage :chara="charachip.chara_list[0]!" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 空の状態 -->
          <div v-else class="rounded-lg bg-white p-8 shadow">
            <div class="text-center text-gray-500">
              <p>キャラチップがありません</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '~/components/ui/feedback/LoadingSpinner.vue'
import type { CharachipsView, CharachipView } from '~/lib/api/types'
import VillageCharaImage from '~/components/pages/village/CharaImage.vue'

// SEO設定
useHead({
  title: 'キャラチップ一覧'
})

// データ
const charachips = ref<CharachipView[]>([])
const loadingCharachips = ref(false)

// キャラが存在するキャラチップのみ表示
const displayCharachips = computed(() => {
  return charachips.value.filter(
    (charachip) => charachip.chara_list && charachip.chara_list.length > 0
  )
})

// データ取得
onMounted(async () => {
  loadingCharachips.value = true
  try {
    const { apiCall } = useApi()
    const response = await apiCall<CharachipsView>('/charachip/list')
    charachips.value = response.list || []
  } catch (error) {
    console.error('キャラチップ一覧の取得に失敗しました:', error)
    charachips.value = []
  } finally {
    loadingCharachips.value = false
  }
})
</script>
