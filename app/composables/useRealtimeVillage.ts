import { ref, onUnmounted } from 'vue'
import { useVillageStore } from '~/stores/village'

// 既存システムに合わせた単純なリアルタイム更新（30秒間隔）
export const useRealtimeVillage = (_villageId: number) => {
  const villageStore = useVillageStore()
  const updateInterval = ref<NodeJS.Timeout | null>(null)

  // 30秒間隔での自動更新（既存システムと同じ）
  const startPolling = () => {
    if (updateInterval.value) {
      clearInterval(updateInterval.value)
    }

    updateInterval.value = setInterval(async () => {
      try {
        await villageStore.loadVillage()
      } catch (error) {
        console.error('Village update failed:', error)
      }
    }, 30 * 1000) // 30秒間隔
  }

  const stopPolling = () => {
    if (updateInterval.value) {
      clearInterval(updateInterval.value)
      updateInterval.value = null
    }
  }

  // コンポーネント破棄時のクリーンアップ
  onUnmounted(() => {
    stopPolling()
  })

  return {
    startPolling,
    stopPolling
  }
}
