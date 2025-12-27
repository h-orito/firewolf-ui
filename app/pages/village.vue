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
          id="village-article-wrapper"
          class="flex-1 shrink-0 overflow-y-scroll bg-white p-2.5"
          :class="{ 'dark-theme': isDarkTheme }"
          :style="mainWrapperStyle"
        >
          <!-- 村名 -->
          <h1 class="mx-1.5 my-2.5 text-left text-xs">
            {{ villageName }}
          </h1>

          <!-- 日付リスト（上部） -->
          <VillageDayList v-if="village && currentVillageDay" />

          <!-- 発言リスト -->
          <MessageList v-if="isInitialized" />

          <!-- 日付リスト（下部） -->
          <VillageDayList v-if="village && currentVillageDay" />

          <!-- スクロール用アンカー -->
          <div id="message-bottom" />

          <!-- アクションコンテナ -->
          <ActionContainer v-if="isInitialized" />
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
import Icon from '~/components/ui/icon/Icon.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useAuth } from '~/composables/useAuth'
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import { useSituation } from '~/composables/village/useSituation'
import { useVillagePolling } from '~/composables/village/useVillagePolling'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useVillageMessageFilter } from '~/composables/village/useVillageMessageFilter'
import { useWindowResize } from '~/composables/useWindowResize'
import VillageHeader from '~/components/pages/village/VillageHeader.vue'
import VillageFooter from '~/components/pages/village/VillageFooter.vue'
import VillageSidebar from '~/components/pages/village/VillageSidebar.vue'
import VillageDayList from '~/components/pages/village/VillageDayList.vue'
import MessageList from '~/components/pages/village/message/MessageList.vue'
import ActionContainer from '~/components/pages/village/action/ActionContainer.vue'
import LoadingSpinner from '~/components/ui/feedback/LoadingSpinner.vue'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'

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

// URL クエリパラメータからfilterIdを取得
const filterId = computed(() => {
  const id = route.query.filterId
  return id ? Number(id) : null
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
const { loadMessages, error: messageError } = useMessage()
const { loadSituation, error: situationError } = useSituation()
const { startPolling } = useVillagePolling()
const { updateVillageLatest } = useVillageRefresh()
const {
  theme,
  hasFixedPanel,
  isFixedPanelOpen,
  loadFromCookie
} = useUserSettings()
const { filterByParticipant } = useVillageMessageFilter()
const { isMobile } = useWindowResize()

// State
const isInitialized = ref(false)
const isDarkTheme = theme.value.isDark

// Computed
const isLoading = computed(() => {
  return !isInitialized.value || villageLoading.value
})

const hasError = computed(() => {
  return !!villageError.value || !!messageError.value || !!situationError.value
})

const villageName = computed(() => {
  if (!village.value) return ''
  const status = village.value.status
  if (!currentVillageDay.value || status.code !== VILLAGE_STATUS.IN_PROGRESS) {
    return `${village.value.name} - ${status.name}`
  }
  const day = currentVillageDay.value.day
  return `${village.value.name} - ${status.name} - ${day}日目`
})

const mainWrapperStyle = computed(() => {
  const maxWidth = isMobile.value ? '100vw' : 'calc(100vw - 280px)'

  // 固定パネルがない場合
  if (!hasFixedPanel.value) {
    return `max-width: ${maxWidth};`
  }

  // 固定パネルが開いているかどうかでパディングを変える
  const paddingBottom = isFixedPanelOpen.value ? '30vh' : '48px'
  return `max-width: ${maxWidth}; padding-bottom: ${paddingBottom};`
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

    // 2. ユーザ設定をCookieから読み込み
    loadFromCookie()

    // 3. 村を初期化（村IDの設定、村情報の読み込み、最新日の設定）
    await initVillage(villageId.value)

    // 4. URLパラメータでfilterIdが指定されている場合は抽出を適用
    if (filterId.value) {
      filterByParticipant(filterId.value)
    }

    // 5. 発言と参加状況を並列で読み込み
    await Promise.all([loadMessages(), loadSituation()])

    // 6. 最新情報を保存
    await updateVillageLatest()

    // 7. ポーリングを開始
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
  title: computed(() => (village.value ? village.value.name : ''))
})
</script>

<style scoped>
/* ダークモード（カスタム実装） */
.dark-theme {
  background-color: #111827;
  color: white;
}
</style>
