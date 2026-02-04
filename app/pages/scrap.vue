<template>
  <div :class="{ 'dark-theme': isDarkTheme }">
    <!-- ローディング -->
    <LoadingSpinner v-if="isLoading" message="読み込み中..." fixed />

    <!-- エラー -->
    <div
      v-else-if="hasError"
      class="flex min-h-screen w-full items-center justify-center bg-gray-100"
    >
      <div class="flex flex-col items-center justify-center text-center">
        <Icon
          name="i-heroicons-exclamation-circle"
          class="h-12 w-12 text-red-500"
        />
        <p class="mt-2">読み込みに失敗しました</p>
        <UiButton class="mt-4" @click="handleRetry">再読み込み</UiButton>
      </div>
    </div>

    <!-- メインコンテンツ -->
    <div
      v-else
      class="min-h-screen bg-white p-4 dark:bg-gray-900"
      :class="isDarkTheme ? 'dark' : ''"
    >
      <div class="mx-auto max-w-4xl">
        <!-- 村名 -->
        <h1 class="mb-4 text-left text-lg font-bold">
          {{ villageName }}
        </h1>

        <!-- メッセージリスト -->
        <ScrapMessageList
          :messages="messages"
          :is-progress="isProgress"
          class="mb-4"
        />

        <hr class="my-4 border-gray-300 dark:border-gray-600" />

        <!-- 入力フォーム -->
        <ScrapInputForm
          :is-progress="isProgress"
          :loading="loadingMessage"
          :has-messages="hasMessages"
          @add-scrap="handleAddScrap"
          @delete-scrap="handleDeleteScrap"
          @copy-url="handleCopyUrl"
        />

        <!-- 村へ戻るボタン -->
        <div class="mt-4">
          <UiButton
            as="NuxtLink"
            :to="{ path: '/village', query: { id: villageId } }"
            color="secondary"
            size="sm"
          >
            村へ戻る
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'
import UiButton from '~/components/ui/button/index.vue'
import LoadingSpinner from '~/components/ui/feedback/LoadingSpinner.vue'
import { useAuth } from '~/composables/useAuth'
import { useVillage } from '~/composables/village/useVillage'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useScrap } from '~/composables/scrap/useScrap'
import ScrapMessageList from '~/components/pages/scrap/ScrapMessageList.vue'
import ScrapInputForm from '~/components/pages/scrap/ScrapInputForm.vue'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'

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
  initVillage,
  loading: villageLoading,
  error: villageError
} = useVillage()
const { theme, loadFromCookie } = useUserSettings()
const {
  messages,
  loadingMessage,
  loadFromUrl,
  addScrap,
  deleteAllScrap,
  reset
} = useScrap()

// State
const isInitialized = ref(false)

// ダークテーマ判定
const isDarkTheme = computed(() => theme.value.isDark)

// Computed
const isLoading = computed(() => {
  return !isInitialized.value || villageLoading.value
})

const hasError = computed(() => {
  return !!villageError.value
})

const villageName = computed(() => {
  if (!village.value) return ''
  return village.value.name
})

const isProgress = computed(() => {
  if (!village.value) return false
  return village.value.status.code === VILLAGE_STATUS.IN_PROGRESS
})

const hasMessages = computed(() => {
  return messages.value.length > 0
})

// Methods
const handleRetry = async () => {
  await initialize()
}

const handleAddScrap = async (anchorString: string) => {
  const success = await addScrap(anchorString)
  if (!success) {
    alert('取得できませんでした')
  }
}

const handleDeleteScrap = async () => {
  await deleteAllScrap()
}

const handleCopyUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('URLをコピーしました')
  } catch {
    alert('URLのコピーに失敗しました')
  }
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

    // 3. スクラップストアをリセット
    reset()

    // 4. 村を初期化
    await initVillage(villageId.value)

    // 5. URLからアンカーを読み込み
    await loadFromUrl()

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
  title: computed(() =>
    village.value ? `${village.value.name} - 切り抜き` : '切り抜き'
  )
})
</script>
