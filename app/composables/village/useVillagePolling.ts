import type { VillageLatestView } from '~/lib/api/types'
import { useVillageRefresh } from './useVillageRefresh'

/**
 * 村の最新情報を定期的にポーリング
 */
export const useVillagePolling = () => {
  // Store
  const villageStore = useVillageStore()
  const { handleDayChange, handleNewMessage } = useVillageRefresh()

  // State
  const pollingInterval = ref<NodeJS.Timeout | null>(null)

  // API
  const { apiCall } = useApi()

  // クリーンアップ: アンマウント時にポーリングを停止
  onUnmounted(() => {
    stopPolling()
  })

  /**
   * ポーリングを開始
   */
  const startPolling = () => {
    // 既存のポーリングがあれば停止
    stopPolling()

    // 30秒ごとにチェック
    pollingInterval.value = setInterval(async () => {
      await checkLatest()
    }, 30 * 1000)
  }

  /**
   * ポーリングを停止
   */
  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
      pollingInterval.value = null
    }
  }

  /**
   * 最新情報をチェック
   */
  const checkLatest = async () => {
    try {
      const currentLatest = villageStore.villageLatest
      const latest = await loadVillageLatest()

      // 初回(storeがnull)の場合は保存のみ
      if (!currentLatest) {
        villageStore.saveVillageLatest(latest)
        return
      }

      // 日付変更をチェック
      if (latest.village_day_id !== currentLatest.village_day_id) {
        villageStore.saveExistsNewMessages(true)
        handleDayChange()
        villageStore.saveVillageLatest(latest)
        return
      }

      // 新着発言をチェック
      if (latest.unix_time_milli > currentLatest.unix_time_milli) {
        villageStore.saveExistsNewMessages(true)
        handleNewMessage()
        villageStore.saveVillageLatest(latest)
      }
    } catch (error) {
      console.error('最新情報の取得に失敗しました:', error)
    }
  }

  const loadVillageLatest = async (): Promise<VillageLatestView> => {
    const currentLatest = villageStore.villageLatest
    const currentUnixTimeMilli = currentLatest?.unix_time_milli ?? 0
    const url = `/village/${villageStore.villageId}/latest?from=${currentUnixTimeMilli}`
    return await apiCall<VillageLatestView>(url)
  }

  return {
    // State (from store)
    villageLatest: villageStore.villageLatest,
    existsNewMessages: villageStore.existsNewMessages,

    // Methods
    startPolling,
    stopPolling,
    checkLatest
  }
}
