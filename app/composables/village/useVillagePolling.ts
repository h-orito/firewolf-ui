import type { VillageLatestView } from '~/lib/api/types'

/**
 * 村の最新情報を定期的にポーリング
 */
export const useVillagePolling = () => {
  // Store
  const villageStore = useVillageStore()

  // State
  const pollingInterval = ref<NodeJS.Timeout | null>(null)
  const existsNewMessages = ref<boolean>(false)

  // API
  const { apiCall } = useApi()

  // クリーンアップ: アンマウント時にポーリングを停止
  onUnmounted(() => {
    stopPolling()
  })

  /**
   * ポーリングを開始
   */
  const startPolling = (
    villageId: number,
    onNewMessage?: () => void,
    onDayChange?: () => void
  ) => {
    // 既存のポーリングがあれば停止
    stopPolling()

    // 30秒ごとにチェック
    pollingInterval.value = setInterval(async () => {
      await checkLatest(villageId, onNewMessage, onDayChange)
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
  const checkLatest = async (
    villageId: number,
    onNewMessage?: () => void,
    onDayChange?: () => void
  ) => {
    try {
      const currentLatest = villageStore.villageLatest
      const currentUnixTimeMilli = currentLatest?.unix_time_milli ?? 0
      const url = `/village/${villageId}/latest?from=${currentUnixTimeMilli}`
      const latest = await apiCall<VillageLatestView>(url)

      // 初回(storeがnull)の場合は保存のみ
      if (!currentLatest) {
        villageStore.saveVillageLatest(latest)
        return
      }

      // 日付変更をチェック
      if (latest.village_day_id !== currentLatest.village_day_id) {
        existsNewMessages.value = true
        if (onDayChange) {
          onDayChange()
        }
        villageStore.saveVillageLatest(latest)
        return
      }

      // 新着発言をチェック
      if (latest.unix_time_milli > currentLatest.unix_time_milli) {
        existsNewMessages.value = true
        if (onNewMessage) {
          onNewMessage()
        }
        villageStore.saveVillageLatest(latest)
      }
    } catch (error) {
      console.error('最新情報の取得に失敗しました:', error)
    }
  }

  /**
   * 最新情報を更新
   */
  const updateVillageLatest = (latest: VillageLatestView) => {
    const currentUnixTimeMilli =
      villageStore.villageLatest?.unix_time_milli ?? 0
    if (currentUnixTimeMilli < latest.unix_time_milli) {
      villageStore.saveVillageLatest(latest)
    }
  }

  /**
   * 新着メッセージフラグをリセット
   */
  const resetNewMessagesFlag = () => {
    existsNewMessages.value = false
  }

  return {
    // State (from store)
    villageLatest: computed(() => villageStore.villageLatest),
    existsNewMessages: readonly(existsNewMessages),

    // Methods
    startPolling,
    stopPolling,
    checkLatest,
    updateVillageLatest,
    resetNewMessagesFlag
  }
}
