<template>
  <NuxtLink :to="`/village?id=${village.id}`" class="spotlight-shadow block">
    <div class="card village-card">
      <header class="card-header village-card-header">
        <p class="card-header-title village-card-header-title text-left">
          {{ village.name }}
        </p>
      </header>
      <div class="card-content">
        <div class="content text-left text-sm">
          <p>状態: {{ status }}</p>
          <p>参加人数: {{ participantStatus }}</p>
          <p v-if="daychangeDatetime">更新: {{ daychangeDatetime }}</p>
          <p>編成: {{ organization }}</p>
          <p>発言可能時間: {{ sayableTime }}</p>
          <p>ダミー役欠け: {{ dummySkill }}</p>
          <p v-if="ageLimit">年齢制限: {{ ageLimit }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { SimpleVillageView } from '~/lib/api/types'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'

const props = defineProps<{
  village: SimpleVillageView
}>()

// 状態表示
const status = computed(() => {
  const villageStatus = props.village.status?.name || ''
  if (props.village.status?.code !== VILLAGE_STATUS.IN_PROGRESS) {
    return villageStatus
  }
  return `${villageStatus} ${nowDate.value}`
})

// 最新日
const latestday = computed(() => {
  const dayList = props.village.day?.day_list || []
  return dayList[dayList.length - 1]
})

// 現在の日付
const nowDate = computed(() => {
  if (props.village.status?.code !== VILLAGE_STATUS.IN_PROGRESS) return null
  return latestday.value ? `${latestday.value.day}日目` : null
})

// 更新日時
const daychangeDatetime = computed(() => {
  const statusCode = props.village.status?.code
  if (
    statusCode === VILLAGE_STATUS.COMPLETED ||
    statusCode === VILLAGE_STATUS.CANCEL
  ) {
    return null
  }
  const datetime = latestday.value?.day_change_datetime
  return datetime ? datetime.substring(0, 16) : null
})

// 参加者数表示
const participantStatus = computed(() => {
  const participantCount = props.village.participant?.count || 0
  const spectatorCount = props.village.spectator?.count || 0
  const maxCapacity = props.village.setting?.capacity?.max || 0

  if (props.village.status?.code === VILLAGE_STATUS.PROLOGUE) {
    return (
      `${participantCount}` +
      `/${maxCapacity}` +
      `${spectatorCount === 0 ? '' : '+' + spectatorCount}`
    )
  } else {
    return (
      `${participantCount}` +
      `${spectatorCount === 0 ? '' : '+' + spectatorCount}`
    )
  }
})

// 発言可能時間
const sayableTime = computed(() => {
  const timeSetting = props.village.setting?.time
  const silentHours = timeSetting?.silent_hours

  if (!silentHours) return '24時間'

  // sayable_startとsayable_endは時刻オブジェクト
  const start = timeSetting?.sayable_start
  const end = timeSetting?.sayable_end

  if (!start || !end) return '24時間'

  const startStr = `${String(start.hour || 0).padStart(2, '0')}:${String(start.minute || 0).padStart(2, '0')}`
  const endStr = `${String(end.hour || 0).padStart(2, '0')}:${String(end.minute || 0).padStart(2, '0')}`

  if (startStr === endStr) return '24時間'

  return `${startStr} - ${endStr}（${24 - silentHours}時間）`
})

// 編成
const organization = computed(() => {
  const maxCapacity = props.village.setting?.capacity?.max
  if (!maxCapacity || !props.village.setting?.organizations?.organization) {
    return '不明'
  }

  const org = props.village.setting.organizations.organization[maxCapacity]
  if (!org) return '不明'

  return Array.isArray(org) ? `${org.length}人: ${org.join(', ')}` : org
})

// ダミー役欠け
const dummySkill = computed(() => {
  return props.village.setting?.rules?.available_dummy_skill ? 'あり' : 'なし'
})

// 年齢制限
const ageLimit = computed(() => {
  const tags = props.village.setting?.tags?.list || []
  return tags.find((t: string) => t.startsWith('R')) || null
})
</script>

<style scoped>
.village-card {
  background-image: url('/image/top-bg.jpg');
  background-size: cover;
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.village-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.card-header {
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid white;
  padding: 0.75rem 1rem;
}

.village-card-header-title {
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}

.card-content {
  padding: 1rem;
  /* background: rgba(0, 0, 0, 0.2); */
}

.content p {
  margin: 0.25rem 0;
  color: white;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-top: 5px;
  padding-bottom: 5px;
}

.spotlight-shadow {
  text-decoration: none;
  display: block;
}
</style>
