<template>
  <div class="village-footer">
    <!-- メニューボタン (モバイルのみ) -->
    <UButton
      v-if="isMobile"
      color="neutral"
      variant="solid"
      icon="i-heroicons-bars-3-20-solid"
      class="village-footer-item border-r"
      aria-label="サイドバーを開く"
      @click="toggleSlider"
    />

    <!-- 更新ボタン -->
    <UButton
      color="neutral"
      variant="solid"
      class="village-footer-item border-r"
      :class="{ 'wide-item': !isMobile }"
      aria-label="発言を更新"
      @click="handleRefresh"
    >
      <UIcon
        name="i-heroicons-arrow-path-20-solid"
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
      class="village-footer-item flex-1"
      aria-label="最下部にスクロール"
      @click="toBottom"
    >
      <UIcon
        name="i-heroicons-arrow-down-20-solid"
        class="mb-0.5 h-5 w-5 border-b border-white text-white"
      />
    </UButton>

    <!-- 抽出ボタン / 抽出解除ボタン -->
    <UButton
      color="neutral"
      variant="solid"
      icon="i-heroicons-magnifying-glass-20-solid"
      class="village-footer-item border-l"
      :class="{
        'wide-item': !isMobile,
        'text-blue-400': isFiltering,
        'text-white': !isFiltering
      }"
      aria-label="発言を抽出"
      @click="openFilterModalOrReset"
    >
      <span v-if="isFiltering" class="text-sm text-blue-400">解除</span>
    </UButton>

    <!-- 残り時間表示 -->
    <div class="village-footer-item footer-timer border-l text-white">
      <p>{{ props.timer }}</p>
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
import { useWindowResize } from '~/composables/useWindowResize'
import ModalFilter from '~/components/pages/village/footer/ModalFilter.vue'

// Props
interface Props {
  timer: string
}

const props = defineProps<Props>()

// Composables
const { scrollToBottom } = useVillageNavigation()
const { isFiltering, resetFilter } = useVillageMessageFilter()
const { existsNewMessages } = useVillagePolling()
const { toggle: toggleSlider } = useVillageSlider()
const { refresh } = useVillageRefresh()
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
</script>

<style scoped>
.village-footer {
  @apply z-10 flex h-full w-full;
}

.village-footer-item {
  @apply flex h-full cursor-pointer items-center justify-center rounded-none border-0 bg-gray-900;
  min-width: 60px;
}

.wide-item {
  width: 120px;
}

.footer-timer {
  @apply cursor-default;
  width: 80px;
}

.footer-timer p {
  line-height: 40px;
}

/* 区切り線のスタイル */
.border-r {
  @apply border-r border-gray-700;
}

.border-l {
  @apply border-l border-gray-700;
}

/* アニメーション */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 2s linear infinite;
}
</style>
