<template>
  <div class="z-10 flex h-8 w-full">
    <!-- 前日ボタン -->
    <UiButton
      color="secondary"
      variant="solid"
      icon="i-heroicons-chevron-left-20-solid"
      :disabled="!existPrevDay"
      class="flex h-full cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636] text-xs"
      aria-label="前日へ移動"
      @click="handlePrevDay"
    >
      前日
    </UiButton>

    <!-- 最上部スクロールボタン -->
    <UiButton
      color="secondary"
      variant="solid"
      icon="i-heroicons-arrow-up-20-solid"
      class="flex h-full flex-1 cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636]"
      aria-label="最上部にスクロール"
      @click="toTop"
    />

    <!-- 翌日ボタン -->
    <UiButton
      color="secondary"
      variant="solid"
      icon="i-heroicons-chevron-right-20-solid"
      trailing
      :disabled="!existNextDay"
      class="flex h-full cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636] text-xs"
      aria-label="翌日へ移動"
      @click="handleNextDay"
    >
      翌日
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import { useVillageNavigation } from '~/composables/village/useVillageNavigation'
import UiButton from '~/components/ui/button/index.vue'

// Composables
const {
  existPrevDay,
  existNextDay,
  toPrevDay,
  toNextDay,
  nextDayId,
  latestDay
} = useVillage()
const { resetPaging } = useMessage()
const { scrollToTop } = useVillageNavigation()

// Methods
const handlePrevDay = () => {
  toPrevDay()
  resetPaging(false) // 前日は必ず最新日ではない
  scrollToTop()
}

const handleNextDay = () => {
  // 日付変更前に遷移先が最新日かどうかを判定
  const isLatest = nextDayId.value === latestDay.value?.id

  toNextDay()
  resetPaging(isLatest)
  scrollToTop()
}

const toTop = () => {
  scrollToTop()
}
</script>
