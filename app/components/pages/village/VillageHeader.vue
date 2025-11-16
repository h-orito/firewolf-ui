<template>
  <div class="village-header">
    <!-- 前日ボタン -->
    <UButton
      color="neutral"
      variant="solid"
      icon="i-heroicons-chevron-left-20-solid"
      :disabled="!existPrevDay"
      class="village-header-item text-sm"
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
      class="village-header-item flex-1"
      aria-label="最上部にスクロール"
      @click="toTop"
    >
      <UIcon
        name="i-heroicons-arrow-up-20-solid"
        class="mt-0.5 h-5 w-5 border-t border-white text-white"
      />
    </UButton>

    <!-- 翌日ボタン -->
    <UButton
      color="neutral"
      variant="solid"
      icon="i-heroicons-chevron-right-20-solid"
      trailing
      :disabled="!existNextDay"
      class="village-header-item text-sm"
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

<style scoped>
.village-header {
  @apply z-10 flex h-full w-full;
}

.village-header-item {
  @apply flex h-full cursor-pointer items-center justify-center rounded-none border-0 bg-gray-900;
}
</style>
