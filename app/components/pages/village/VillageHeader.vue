<template>
  <div class="z-10 flex h-8 w-full">
    <!-- 前日ボタン -->
    <UButton
      color="neutral"
      variant="solid"
      icon="i-heroicons-chevron-left-20-solid"
      :disabled="!existPrevDay"
      class="flex h-full cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636] text-xs"
      aria-label="前日へ移動"
      @click="toPrevDay"
    >
      前日
    </UButton>

    <!-- 最上部スクロールボタン -->
    <UButton
      color="neutral"
      variant="solid"
      icon="i-heroicons-arrow-up-20-solid"
      class="flex h-full flex-1 cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636]"
      aria-label="最上部にスクロール"
      @click="toTop"
    />

    <!-- 翌日ボタン -->
    <UButton
      color="neutral"
      variant="solid"
      icon="i-heroicons-chevron-right-20-solid"
      trailing
      :disabled="!existNextDay"
      class="flex h-full cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636] text-xs"
      aria-label="翌日へ移動"
      @click="toNextDay"
    >
      翌日
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { useVillage } from '~/composables/village/useVillage'
import { useVillageNavigation } from '~/composables/village/useVillageNavigation'

// Composables
const { existPrevDay, existNextDay, toPrevDay, toNextDay } = useVillage()
const { scrollToTop } = useVillageNavigation()

// Methods
const toTop = () => {
  scrollToTop()
}
</script>
