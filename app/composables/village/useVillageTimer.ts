import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { useVillage } from './useVillage'

/**
 * 村タイマーの管理(残り時間の計算・表示)
 */
export const useVillageTimer = () => {
  // State
  const timerText = ref<string>('')
  const timerInterval = ref<NodeJS.Timeout | null>(null)

  // 村情報を取得
  const { village } = useVillage()

  // クリーンアップ: アンマウント時にタイマーを停止
  onUnmounted(() => {
    stopTimer()
  })

  /**
   * タイマーを開始
   */
  const startTimer = () => {
    // 既存のタイマーがあれば停止
    stopTimer()

    // 初回実行
    updateTimer()

    // 終了状態の場合はタイマーを開始しない
    const statusCode = village.value?.status.code
    if (
      statusCode === VILLAGE_STATUS.COMPLETED ||
      statusCode === VILLAGE_STATUS.CANCEL
    ) {
      return
    }

    // 1秒ごとに更新
    timerInterval.value = setInterval(() => {
      updateTimer()
    }, 1000)
  }

  /**
   * タイマーを停止
   */
  const stopTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  /**
   * 数値を2桁のゼロパディング文字列に変換
   */
  const padZero = (num: number): string => String(num).padStart(2, '0')

  /**
   * タイマー表示を更新
   */
  const updateTimer = () => {
    if (!village.value) {
      timerText.value = ''
      return
    }

    const statusCode = village.value.status.code

    // 終了状態のチェック
    if (statusCode === VILLAGE_STATUS.COMPLETED) {
      timerText.value = '終了'
      stopTimer()
      return
    } else if (statusCode === VILLAGE_STATUS.CANCEL) {
      timerText.value = '廃村'
      stopTimer()
      return
    }

    // 次の日付更新時刻を取得
    const nextDaychangeDatetime = getNextDaychangeDatetime()
    if (!nextDaychangeDatetime) {
      timerText.value = ''
      return
    }

    // 残り時間を計算
    const left = nextDaychangeDatetime.getTime() - new Date().getTime()
    const hour = Math.floor(left / 3600000)
    const minute = Math.floor((left - 3600000 * hour) / 60000)
    const second = Math.floor((left % 60000) / 1000)

    if (left < 0) {
      timerText.value = '残00:00:00'
    } else if (hour > 99) {
      timerText.value = '残99:59:59'
    } else {
      timerText.value = `残${padZero(hour)}:${padZero(minute)}:${padZero(second)}`
    }
  }

  /**
   * 次の日付更新時刻を取得
   */
  const getNextDaychangeDatetime = (): Date | null => {
    if (!village.value) return null

    const dayList = village.value.day.day_list
    if (!dayList || dayList.length === 0) {
      return null
    }

    const lastDay = dayList[dayList.length - 1]
    if (!lastDay) {
      return null
    }

    const daychangeStr = lastDay.day_change_datetime

    if (!daychangeStr) {
      return null
    }

    return new Date(
      parseInt(daychangeStr.substring(0, 4)), // year
      parseInt(daychangeStr.substring(5, 7)) - 1, // month (0-indexed)
      parseInt(daychangeStr.substring(8, 10)), // date
      parseInt(daychangeStr.substring(11, 13)), // hour
      parseInt(daychangeStr.substring(14, 16)), // minute
      parseInt(daychangeStr.substring(17, 19)) // second
    )
  }

  return {
    // State
    timerText: readonly(timerText),

    // Methods
    startTimer,
    stopTimer,
    updateTimer
  }
}
