<template>
  <div class="h-screen w-full overflow-hidden">
    <!-- ローディング -->
    <LoadingSpinner v-if="isLoading" message="村情報を読み込み中..." fixed />

    <!-- エラー -->
    <div
      v-else-if="hasError"
      class="flex h-screen w-full items-center justify-center bg-gray-100"
    >
      <div class="flex flex-col items-center justify-center text-center">
        <Icon
          name="i-heroicons-exclamation-circle"
          class="h-12 w-12 text-red-500"
        />
        <p class="mt-2">村情報の読み込みに失敗しました</p>
        <UiButton class="mt-4" @click="handleRetry">再読み込み</UiButton>
      </div>
    </div>

    <!-- メインコンテンツ -->
    <div
      v-else
      class="flex h-screen w-full shrink-0 justify-between"
      :class="{ 'dark-theme': isDarkTheme }"
    >
      <!-- サイドバー (PC: 左固定 / Mobile: オーバーレイ) -->
      <div v-if="!isMobile" class="h-screen bg-[#363636]">
        <VillageSidebar />
      </div>

      <!-- 右側エリア (ヘッダー・メイン・フッター) -->
      <div class="flex h-screen flex-1 shrink-0 flex-col justify-between">
        <!-- ヘッダー -->
        <VillageHeader />

        <!-- メインエリア -->
        <div
          class="flex flex-1 shrink-0 flex-col justify-between overflow-y-auto bg-white"
          :class="{ 'dark-theme': isDarkTheme }"
          :style="mainWrapperStyle"
        >
          <!-- 村名 -->
          <div class="flex-1 overflow-y-scroll p-2.5">
            <h1 class="mx-1.5 my-2.5 text-left text-lg font-bold">
              {{ villageName }}
            </h1>

            <!-- プレースホルダー: Phase 2以降で実装 -->
            <div class="mx-auto max-w-4xl py-8">
              <UCard>
                <template #header>
                  <h2 class="text-lg font-semibold">村ページ (Phase 1)</h2>
                </template>
                <div class="space-y-4">
                  <p>基本的なレイアウトと初期化処理が実装されています。</p>
                  <div class="text-sm">
                    <p><strong>村ID:</strong> {{ villageId }}</p>
                    <p v-if="village">
                      <strong>村名:</strong> {{ village.name }}
                    </p>
                    <p v-if="currentVillageDay">
                      <strong>表示中の日:</strong>
                      {{ currentVillageDay.day }}日目
                      {{ currentVillageDay.noonnight }}
                    </p>
                  </div>
                  <UAlert
                    color="info"
                    variant="subtle"
                    title="Phase 2以降で実装予定"
                    description="発言表示、アクション機能、モーダル等は次のフェーズで実装されます。"
                  />
                </div>
              </UCard>
            </div>

            <!-- スクロール用アンカー -->
            <div id="message-bottom" />
          </div>
        </div>

        <!-- フッター -->
        <VillageFooter />

        <!-- サイドバー (モバイルのみ: オーバーレイ) -->
        <VillageSidebar v-if="isMobile" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'
import { useAuth } from '~/composables/useAuth'
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import { useSituation } from '~/composables/village/useSituation'
import { useVillagePolling } from '~/composables/village/useVillagePolling'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useWindowResize } from '~/composables/useWindowResize'
import VillageHeader from '~/components/pages/village/VillageHeader.vue'
import VillageFooter from '~/components/pages/village/VillageFooter.vue'
import VillageSidebar from '~/components/pages/village/VillageSidebar.vue'
import LoadingSpinner from '~/components/ui/feedback/LoadingSpinner.vue'

// Layout設定
definePageMeta({
  layout: 'village'
})

// URL クエリパラメータから村IDを取得
const route = useRoute()
const villageId = computed(() => {
  const id = route.query.id
  return id ? Number(id) : 0
})

// Composables
const { waitForAuth } = useAuth()
const {
  village,
  currentVillageDay,
  initVillage,
  loading: villageLoading,
  error: villageError
} = useVillage()
const { error: messageError } = useMessage()
const { loadSituation, error: situationError } = useSituation()
const { startPolling } = useVillagePolling()
const { updateVillageLatest } = useVillageRefresh()
const { initializeIfNeeded: initUserSettings, getTheme } = useUserSettings()
const { isMobile } = useWindowResize()

// State
const isInitialized = ref(false)
const isDarkTheme = getTheme().isDark

// Computed
const isLoading = computed(() => {
  return !isInitialized.value || villageLoading.value
})

const hasError = computed(() => {
  return !!villageError.value || !!messageError.value || !!situationError.value
})

const villageName = computed(() => {
  if (!village) return ''
  const status = village.status
  if (!currentVillageDay) {
    return `${village.name} - ${status.name}`
  }
  const day = currentVillageDay.day
  return `${village.name} - ${status.name} - ${day}日目`
})

const mainWrapperStyle = computed(() => {
  return isMobile.value
    ? 'max-width: 100vw;'
    : 'max-width: calc(100vw - 280px);'
})

// Methods
const handleRetry = async () => {
  await initialize()
}

/**
 * 初期化処理
 */
const initialize = async () => {
  if (!villageId.value) {
    console.error('村IDが指定されていません')
    return
  }

  try {
    // 1. 認証状態を待機
    await waitForAuth()

    // 2. ユーザ設定を初期化
    initUserSettings()

    // 3. 村を初期化（村IDの設定、村情報の読み込み、最新日の設定）
    await initVillage(villageId.value)

    // 4. 参加状況を読み込み
    await loadSituation()

    // 5. 最新情報を保存
    await updateVillageLatest()

    // 6. ポーリングを開始
    if (village) {
      startPolling()
    }

    isInitialized.value = true
  } catch (error) {
    console.error('初期化に失敗しました:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await initialize()
})

// Head設定
useHead({
  title: computed(() => (village ? village.name : ''))
})
</script>

<style scoped>
/* ダークモード（カスタム実装） */
.dark-theme {
  background-color: #111827;
  color: white;
}
</style>
