<template>
  <div>
    <!-- サイドバー本体 -->
    <div class="village-sidebar" :class="{ 'is-active': isOpen }">
      <!-- 村名 -->
      <h1 class="mb-4 text-left text-base font-bold text-white">
        {{ village?.name ?? '' }}
      </h1>

      <!-- メニュー項目 -->
      <div class="text-left">
        <!-- 村の設定 -->
        <button
          class="sidebar-item"
          @click="openVillageInfoModal"
          @keydown.enter="openVillageInfoModal"
        >
          <UIcon name="i-heroicons-information-circle" class="h-4 w-4" />
          <span class="ml-2">村の設定</span>
        </button>

        <!-- 参加者リスト -->
        <UAccordion
          :items="[
            {
              label: `参加者（${personCount}人）`,
              slot: 'participants',
              defaultOpen: false
            }
          ]"
        >
          <template #participants>
            <ParticipantList />
          </template>
        </UAccordion>

        <!-- メモ -->
        <button
          class="sidebar-item"
          @click="openMemoModal"
          @keydown.enter="openMemoModal"
        >
          <UIcon name="i-heroicons-document-text" class="h-4 w-4" />
          <span class="ml-2">メモ</span>
        </button>

        <!-- ユーザ設定 -->
        <button
          class="sidebar-item"
          @click="openUserSettingsModal"
          @keydown.enter="openUserSettingsModal"
        >
          <UIcon name="i-heroicons-cog-6-tooth" class="h-4 w-4" />
          <span class="ml-2">ユーザ設定</span>
        </button>

        <!-- トップページ -->
        <NuxtLink :to="{ path: '/' }" class="sidebar-item">
          <UIcon name="i-heroicons-home" class="h-4 w-4" />
          <span class="ml-2">トップページ</span>
        </NuxtLink>
      </div>

      <!-- モバイル用閉じるボタン -->
      <div v-if="isMobile" class="close-icon">
        <UButton
          color="neutral"
          variant="solid"
          icon="i-heroicons-x-mark-20-solid"
          @click="close"
        />
      </div>
    </div>

    <!-- サイドバー外側の背景（モバイルのみ） -->
    <div
      class="village-sidebar-outside"
      :class="{ 'is-active': isOpen }"
      @click="close"
    ></div>

    <!-- モーダル（仮実装） -->
    <ModalVillageInfo
      :is-open="isOpenVillageInfoModal"
      :charachips="charachips"
      @close="closeVillageInfoModal"
    />
    <ModalUserSettings
      :is-open="isOpenUserSettingsModal"
      @close="closeUserSettingsModal"
    />
    <ModalMemo :is-open="isOpenMemoModal" @close="closeMemoModal" />
  </div>
</template>

<script setup lang="ts">
import type { CharachipView } from '~/lib/api/types'
import { useVillage } from '~/composables/village/useVillage'
import { useVillageSlider } from '~/composables/village/useVillageSlider'
import { useWindowResize } from '~/composables/useWindowResize'
import ParticipantList from '~/components/pages/village/sidebar/ParticipantList.vue'
import ModalVillageInfo from '~/components/pages/village/sidebar/ModalVillageInfo.vue'
import ModalUserSettings from '~/components/pages/village/sidebar/ModalUserSettings.vue'
import ModalMemo from '~/components/pages/village/sidebar/ModalMemo.vue'

// Props
interface Props {
  charachips: CharachipView[]
}

defineProps<Props>()

// Composables
const { village } = useVillage()
const { isOpen, close } = useVillageSlider()
const { isMobile } = useWindowResize()

// State
const isOpenVillageInfoModal = ref(false)
const isOpenUserSettingsModal = ref(false)
const isOpenMemoModal = ref(false)

// Computed
const personCount = computed(() => {
  if (!village.value) return '0'
  const participantCount = village.value.participant.count
  const spectatorCount = village.value.spectator.count
  if (spectatorCount > 0) {
    return `${participantCount}+${spectatorCount}`
  }
  return `${participantCount}`
})

// Methods
const openVillageInfoModal = () => {
  isOpenVillageInfoModal.value = true
}

const closeVillageInfoModal = () => {
  isOpenVillageInfoModal.value = false
}

const openUserSettingsModal = () => {
  isOpenUserSettingsModal.value = true
}

const closeUserSettingsModal = () => {
  isOpenUserSettingsModal.value = false
}

const openMemoModal = () => {
  isOpenMemoModal.value = true
}

const closeMemoModal = () => {
  isOpenMemoModal.value = false
}
</script>

<style scoped>
.village-sidebar {
  @apply overflow-x-hidden overflow-y-auto bg-gray-900 text-white;
}

.sidebar-item {
  @apply flex cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400;
}

/* モバイル */
@media screen and (max-width: 767px) {
  .village-sidebar {
    @apply fixed top-0 left-0 z-20 w-0 transition-all duration-200;
    height: calc(100vh - 40px - 40px); /* ヘッダー・フッター分を引く */
    top: 40px; /* ヘッダー高さ */
  }

  .village-sidebar.is-active {
    @apply w-[280px] p-2.5;
  }

  .close-icon {
    @apply absolute top-1 right-1;
  }

  .village-sidebar-outside {
    @apply fixed top-0 right-0 hidden h-screen bg-gray-900/40;
    width: calc(100% - 280px);
  }

  .village-sidebar-outside.is-active {
    @apply z-20 block;
  }
}

/* PC */
@media screen and (min-width: 768px) {
  .village-sidebar {
    @apply h-full max-h-screen w-[280px] p-2.5;
  }
}
</style>
