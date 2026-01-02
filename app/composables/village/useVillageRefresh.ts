import type { VillageLatestView } from '~/lib/api/types'
import { useVillage } from './useVillage'
import { useMessage } from './useMessage'
import { useSituation } from './useSituation'
import { useVillageMessageFilter } from './useVillageMessageFilter'
import { useActionReset } from './action/useActionReset'
import { showInfoToast } from '~/utils/toast'

/**
 * 村ページの更新処理を統合管理
 */
export const useVillageRefresh = () => {
  // Store
  const villageStore = useVillageStore()
  // Composables
  const {
    loadVillage,
    villageId,
    latestDay,
    isCurrentVillageDayLatest,
    changeCurrentVillageDay
  } = useVillage()
  const { loadMessages, isDispLatest, isViewingLatestMessages, setDispLatest } =
    useMessage()
  const { loadSituation } = useSituation()
  const { isFiltering } = useVillageMessageFilter()
  const { triggerReset } = useActionReset()

  // API
  const { apiCall } = useApi()

  /**
   * 村情報、発言、参加状況を一括更新
   */
  const refresh = async () => {
    if (!villageId) return
    const currentVillageday = latestDay.value
    const currentIsDispLatest = isDispLatest.value

    // 1. 村情報を取得
    await loadVillage()

    // 2. currentVillageDayを最新の日付に更新
    if (latestDay.value) {
      changeCurrentVillageDay(latestDay.value)
    }

    // 3. isDispLatestをtrueに設定
    setDispLatest(true)

    if (currentIsDispLatest && currentVillageday === latestDay.value) {
      // 日付や最新発言表示などの条件が変わらない場合、自動で発言が再読み込みされないため、手動で取得する
      loadMessages()
    }

    // 4. 参加状況を取得
    loadSituation()

    // 5. 最新情報を更新
    updateVillageLatest()

    // 6. 新着メッセージフラグをリセット
    villageStore.saveExistsNewMessages(false)

    // 7. アクションコンポーネントの状態をリセット
    triggerReset()
  }

  const handleNewMessage = async () => {
    if (!shouldAutoRefresh.value) return
    await loadMessages()
    villageStore.saveExistsNewMessages(false)
    showInfoToast('最新発言を読み込みました')
  }

  const handleDayChange = async () => {
    if (!shouldAutoRefresh.value) return
    await refresh()
    showInfoToast('日付が変わりました')
  }

  const shouldAutoRefresh = computed(() => {
    // 最新日の最新ページを見ていない場合は勝手に更新しない
    if (!isCurrentVillageDayLatest.value) return false
    if (!isViewingLatestMessages.value) return false
    // 発言入力中や発言抽出中は勝手に更新しない
    // TODO: 発言入力中
    if (isFiltering.value) return false
    return true
  })

  /**
   * 最新情報を更新
   */
  const updateVillageLatest = async () => {
    const latest = await loadVillageLatest()
    villageStore.saveVillageLatest(latest)
  }

  const loadVillageLatest = async (): Promise<VillageLatestView> => {
    const currentLatest = villageStore.villageLatest
    const currentUnixTimeMilli = currentLatest?.unix_time_milli ?? 0
    const url = `/village/${villageStore.villageId}/latest?from=${currentUnixTimeMilli}`
    return await apiCall<VillageLatestView>(url)
  }

  return {
    refresh,
    handleDayChange,
    handleNewMessage,
    loadVillageLatest,
    updateVillageLatest
  }
}
