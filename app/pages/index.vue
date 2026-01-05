<template>
  <div class="menu-wrap">
    <!-- スポットライト -->
    <Spotlight />

    <!-- イントロ -->
    <Intro />

    <!-- プレイヤー統計 -->
    <PlayerStats
      :user="auth.myselfPlayer.value"
      :is-loading="loadingAuth"
      @signin-with-twitter="signinWithTwitter"
      @signin-with-google="signinWithGoogle"
      @link-with-twitter="linkWithTwitter"
      @link-with-google="linkWithGoogle"
      @logout="logout"
    />

    <!-- 村一覧 -->
    <div class="menu-area">
      <div v-if="isLoadingVillages" class="flex justify-center py-8">
        <Icon name="spinner" class="animate-spin text-4xl" />
      </div>
      <div v-else-if="villages">
        <h2 class="spotlight-shadow mb-8 text-2xl font-semibold">開催中の村</h2>
        <div
          v-if="villages.list?.length > 0"
          class="mb-8 grid gap-4 md:grid-cols-2"
        >
          <VillageCard
            v-for="village in villages.list"
            :key="village.id"
            :village="village"
          />
        </div>
        <p v-else class="mb-8 text-gray-400">現在開催中の村はありません</p>

        <!-- ボタンエリア -->
        <div class="grid gap-4 md:grid-cols-2">
          <SpotlightButton v-if="canCreateVillage" to="/create-village">
            村を作成
          </SpotlightButton>
          <SpotlightButton to="/village-list"> 終了した村 </SpotlightButton>
        </div>
      </div>
    </div>

    <!-- キャラチップ -->
    <Charachip />

    <!-- フッター -->
    <IndexFooter />
  </div>
</template>

<script setup lang="ts">
import type { VillagesView } from '~/lib/api/types'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import Icon from '~/components/ui/icon/Icon.vue'
import VillageCard from '~/components/pages/index/VillageCard.vue'
import Spotlight from '~/components/pages/index/Spotlight.vue'
import Intro from '~/components/pages/index/Intro.vue'
import PlayerStats from '~/components/pages/index/PlayerStats.vue'
import Charachip from '~/components/pages/index/Charachip.vue'
import IndexFooter from '~/components/pages/index/IndexFooter.vue'
import SpotlightButton from '~/components/pages/index/SpotlightButton.vue'
import {
  createSeoMeta,
  createStructuredData,
  DEFAULT_SITE_URL,
  DEFAULT_SITE_DESCRIPTION
} from '~/utils/seo'

// メタデータを設定
// SEO設定
useSeoMeta(
  createSeoMeta({
    description:
      'FIREWOLFで長期人狼ゲームを無料でプレイ。新しい村の作成、進行中の村への参加、過去の村の閲覧ができます。',
    keywords: 'FIREWOLF,人狼,長期人狼,オンライン人狼,無料,ゲーム,werewolf'
  })
)

// 構造化データ
// トップページはtitleTemplateを無効化して「FIREWOLF」のみ表示
useHead({
  title: 'FIREWOLF',
  titleTemplate: '',
  script: [
    createStructuredData('WebSite', {
      name: 'FIREWOLF',
      url: DEFAULT_SITE_URL,
      description: DEFAULT_SITE_DESCRIPTION
    })
  ]
})

const { apiCall } = useApi()

// State
const isLoadingVillages = ref(false)
const error = ref<string | null>(null)
const villages = ref<VillagesView | null>(null)
const loadingAuth = ref(true)

// 村データ取得
const fetchVillages = async () => {
  isLoadingVillages.value = true
  error.value = null

  try {
    // 村一覧を取得
    const response = await apiCall<VillagesView>('/village/list', {
      params: {
        village_status: [
          VILLAGE_STATUS.PROLOGUE,
          VILLAGE_STATUS.IN_PROGRESS,
          VILLAGE_STATUS.EPILOGUE
        ],
        is_auto_generate: true
      }
    })

    villages.value = response
  } catch (err) {
    console.error('Failed to fetch villages:', err)
    error.value =
      err instanceof Error ? err.message : 'データの取得に失敗しました'
  } finally {
    isLoadingVillages.value = false
  }
}

// 認証処理
const auth = useAuth()

// 村作成可能かどうか
const canCreateVillage = computed(() => {
  return auth.myselfPlayer.value?.available_create_village ?? false
})

const signinWithTwitter = async () => {
  try {
    const result = await auth.signInWithTwitter()
    if (result?.user) {
      await auth.registerUserIfNeeded(result)
      await auth.refreshAuth()
      window.location.reload()
    }
  } catch (err) {
    console.error('Twitter sign in failed:', err)
  }
}

const signinWithGoogle = async () => {
  try {
    const result = await auth.signInWithGoogle()
    if (result?.user) {
      await auth.registerUserIfNeeded(result)
      await auth.refreshAuth()
      window.location.reload()
    }
  } catch (err) {
    console.error('Google sign in failed:', err)
  }
}

const linkWithTwitter = async () => {
  try {
    const result = await auth.linkWithTwitter()
    if (result) {
      await auth.refreshAuth()
      window.location.reload()
    }
  } catch (err) {
    console.error('Twitter link failed:', err)
  }
}

const linkWithGoogle = async () => {
  try {
    const result = await auth.linkWithGoogle()
    if (result) {
      await auth.refreshAuth()
      window.location.reload()
    }
  } catch (err) {
    console.error('Google link failed:', err)
  }
}

const logout = async () => {
  try {
    await auth.logout()
    window.location.reload()
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

// 初期データ取得
onMounted(async () => {
  // 認証を初期化して待機
  auth.initializeAuth()
  const firebaseUser = await auth.waitForAuth()

  // 認証済みの場合、プレイヤー情報を取得
  if (firebaseUser) {
    await auth.refreshAuth()
  }

  loadingAuth.value = false

  // 村一覧取得
  await fetchVillages()
})
</script>

<style scoped>
.menu-wrap {
  background-color: #0a0a1a;
}

.menu-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: white;
  padding: 30px;
  margin-bottom: 50px;
}

.menu-area:last-child {
  margin-bottom: 0;
}
</style>

<style>
.spotlight-shadow {
  text-shadow:
    2px 2px 5px rgba(97, 69, 69, 1),
    -2px 2px 5px rgba(97, 69, 69, 1),
    2px -2px 5px rgba(97, 69, 69, 1),
    -2px -2px 5px rgba(97, 69, 69, 1);
}
</style>
