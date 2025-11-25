<template>
  <div>
    <!-- サイドバー本体 -->
    <div
      class="fixed top-0 left-0 z-20 h-[calc(100vh-2rem)] overflow-x-hidden overflow-y-auto bg-[#363636] text-white transition-all duration-200 md:static md:h-full md:max-h-screen md:w-[280px] md:p-2.5"
      :class="{ 'w-[280px] p-2.5': isOpen, 'w-0': !isOpen }"
    >
      <!-- 村名 -->
      <h1 class="mb-4 text-left text-base font-bold text-white">
        {{ village?.name ?? '' }}
      </h1>

      <!-- メニュー項目 -->
      <div class="text-left">
        <!-- 村の設定 -->
        <button
          class="flex cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
          @click="openVillageInfoModal"
          @keydown.enter="openVillageInfoModal"
        >
          <Icon name="i-heroicons-information-circle" class="h-4 w-4" />
          <span class="ml-2">村の設定</span>
        </button>

        <!-- 参加者リスト -->
        <UAccordion
          :items="[
            {
              label: `参加者（${personCount}人）`,
              slot: 'participants',
              defaultOpen: false,
              icon: 'i-heroicons-users'
            }
          ]"
        >
          <template #participants>
            <ParticipantList />
          </template>
        </UAccordion>

        <!-- メモ -->
        <button
          class="flex cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
          @click="openMemoModal"
          @keydown.enter="openMemoModal"
        >
          <Icon name="i-heroicons-document-text" class="h-4 w-4" />
          <span class="ml-2">メモ</span>
        </button>

        <!-- ユーザ設定 -->
        <button
          class="flex cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
          @click="openUserSettingsModal"
          @keydown.enter="openUserSettingsModal"
        >
          <Icon name="i-heroicons-cog-6-tooth" class="h-4 w-4" />
          <span class="ml-2">ユーザ設定</span>
        </button>

        <!-- トップページ -->
        <NuxtLink
          :to="{ path: '/' }"
          class="flex cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
        >
          <Icon name="i-heroicons-home" class="h-4 w-4" />
          <span class="ml-2">トップページ</span>
        </NuxtLink>
      </div>

      <!-- モバイル用閉じるボタン -->
      <div v-if="isMobile" class="absolute top-1 right-1">
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
      class="fixed top-0 right-0 z-20 h-screen w-[calc(100%-280px)] bg-gray-900/40"
      :class="{ block: isOpen, hidden: !isOpen }"
      @click="close"
    ></div>

    <!-- モーダル（仮実装） -->
    <ModalVillageInfo
      :is-open="isOpenVillageInfoModal"
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
import { useVillage } from '~/composables/village/useVillage'
import { useVillageSlider } from '~/composables/village/useVillageSlider'
import { useWindowResize } from '~/composables/useWindowResize'
import ParticipantList from '~/components/pages/village/sidebar/ParticipantList.vue'
import ModalVillageInfo from '~/components/pages/village/sidebar/ModalVillageInfo.vue'
import ModalUserSettings from '~/components/pages/village/sidebar/ModalUserSettings.vue'
import ModalMemo from '~/components/pages/village/sidebar/ModalMemo.vue'

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
  if (!village) return '0'
  const participantCount = village.participant.count
  const spectatorCount = village.spectator.count
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
