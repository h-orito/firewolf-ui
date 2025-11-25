<template>
  <div
    class="z-10 flex h-8 w-full"
    :style="{ height: 'calc(2rem + env(safe-area-inset-bottom))' }"
  >
    <!-- メニューボタン (モバイルのみ) -->
    <UButton
      v-if="isMobile"
      color="neutral"
      variant="solid"
      icon="i-heroicons-bars-3-20-solid"
      class="flex h-full min-w-[60px] cursor-pointer items-center justify-center rounded-none border-0 border-r border-gray-700 bg-[#363636]"
      aria-label="サイドバーを開く"
      @click="toggleSlider"
    />

    <!-- 更新ボタン -->
    <UButton
      color="neutral"
      variant="solid"
      class="flex h-full min-w-[60px] cursor-pointer items-center justify-center rounded-none border-0 border-r border-gray-700 bg-[#363636]"
      :class="{ 'w-[120px]': !isMobile }"
      aria-label="発言を更新"
      @click="handleRefresh"
    >
      <Icon
        name="i-heroicons-arrow-path-20-solid"
        class="h-5 w-5"
        :class="{
          'animate-spin text-blue-400': existsNewMessages,
          'text-white': !existsNewMessages
        }"
      />
    </UButton>

    <!-- 最下部スクロールボタン -->
    <UButton
      color="neutral"
      variant="solid"
      class="flex h-full flex-1 cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636]"
      aria-label="最下部にスクロール"
      @click="toBottom"
    >
      <Icon
        name="i-heroicons-arrow-down-20-solid"
        class="h-5 w-5 border-b border-white text-white"
      />
    </UButton>

    <!-- 抽出ボタン / 抽出解除ボタン -->
    <UButton
      color="neutral"
      variant="solid"
      icon="i-heroicons-magnifying-glass-20-solid"
      class="flex h-full min-w-[60px] cursor-pointer items-center justify-center rounded-none border-0 border-l border-gray-700 bg-[#363636]"
      :class="{
        'w-[120px]': !isMobile,
        'text-blue-400': isFiltering,
        'text-white': !isFiltering
      }"
      aria-label="発言を抽出"
      @click="openFilterModalOrReset"
    >
      <span v-if="isFiltering" class="text-sm text-blue-400">解除</span>
    </UButton>

    <!-- 残り時間表示 -->
    <div
      class="flex h-full w-20 cursor-default items-center justify-center border-l border-gray-700 bg-[#363636] text-white"
    >
      <p class="text-xs leading-10">{{ timerText }}</p>
    </div>

    <!-- 抽出モーダル -->
    <ModalFilter :is-open="isOpenFilterModal" @close="closeFilterModal" />
  </div>
</template>

<script setup lang="ts">
import { useVillageNavigation } from '~/composables/village/useVillageNavigation'
import { useVillageMessageFilter } from '~/composables/village/useVillageMessageFilter'
import { useVillagePolling } from '~/composables/village/useVillagePolling'
import { useVillageSlider } from '~/composables/village/useVillageSlider'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { useVillageTimer } from '~/composables/village/useVillageTimer'
import { useWindowResize } from '~/composables/useWindowResize'
import ModalFilter from '~/components/pages/village/footer/ModalFilter.vue'

// Composables
const { scrollToBottom } = useVillageNavigation()
const { isFiltering, resetFilter } = useVillageMessageFilter()
const { existsNewMessages } = useVillagePolling()
const { toggle: toggleSlider } = useVillageSlider()
const { refresh } = useVillageRefresh()
const { timerText, startTimer } = useVillageTimer()
const { isMobile } = useWindowResize()

// State
const isOpenFilterModal = ref(false)

// Methods
const handleRefresh = async () => {
  await refresh()
}

const toBottom = () => {
  scrollToBottom()
}

const openFilterModalOrReset = () => {
  if (isFiltering.value) {
    // 抽出中の場合はフィルタをリセット
    resetFilter()
  } else {
    // 抽出していない場合はモーダルを開く
    isOpenFilterModal.value = true
  }
}

const closeFilterModal = () => {
  isOpenFilterModal.value = false
}

// Lifecycle
onMounted(() => {
  startTimer()
})
</script>
