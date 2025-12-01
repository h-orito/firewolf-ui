<template>
  <ul class="my-1.5 flex flex-wrap gap-1 px-1.5 text-left text-xs">
    <li v-for="(day, idx) in dayList" :key="day.id" class="inline">
      <span v-if="idx !== 0" class="text-gray-400"> &gt; </span>
      <a
        v-if="day.id !== currentDayId"
        href="javascript:void(0);"
        class="text-blue-600 hover:underline dark:text-blue-400"
        @click="handleChangeDay(day)"
      >
        {{ dayName(day) }}
      </a>
      <span v-else>{{ dayName(day) }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { VillageDayView } from '~/lib/api/types'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { useVillage } from '~/composables/village/useVillage'

const { village, currentVillageDay, changeCurrentVillageDay } = useVillage()

const dayList = computed(() => village?.day.day_list ?? [])

const currentDayId = computed(() => currentVillageDay?.id ?? null)

const latestDay = computed(() => dayList.value.slice(-1)[0])

const dayName = (day: VillageDayView): string => {
  const status = village?.status.code

  // 終了済み: 最終日は「終了」、その前は「エピローグ」
  if (status === VILLAGE_STATUS.COMPLETED) {
    if (latestDay.value?.id === day.id) return '終了'
    if (dayList.value.slice(-2)[0]?.id === day.id) return 'エピローグ'
  }

  // エピローグ中: 最終日は「エピローグ」
  if (status === VILLAGE_STATUS.EPILOGUE && latestDay.value?.id === day.id) {
    return 'エピローグ'
  }

  // 通常: 0日目は「プロローグ」、それ以外は「N日目」
  return day.day === 0 ? 'プロローグ' : `${day.day}日目`
}

const handleChangeDay = (villageDay: VillageDayView) => {
  changeCurrentVillageDay(villageDay)
}
</script>
