import { useVillage } from './useVillage'
import { useMessage } from './useMessage'
import { useSituation } from './useSituation'
import { useVillagePolling } from './useVillagePolling'

/**
 * 村ページの更新処理を統合管理
 */
export const useVillageRefresh = () => {
  const { loadVillage, villageId, latestDay, changeCurrentVillageDay } =
    useVillage()
  const { loadMessages, isDispLatest, setDispLatest } = useMessage()
  const { loadSituation } = useSituation()
  const { updateVillageLatest, resetNewMessagesFlag } = useVillagePolling()

  /**
   * 村情報、発言、参加状況を一括更新
   */
  const refresh = async () => {
    if (!villageId.value) return
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
    resetNewMessagesFlag()
  }

  return {
    refresh
  }
}
