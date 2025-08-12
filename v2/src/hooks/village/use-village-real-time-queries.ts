import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useVillageQuery } from '../useVillageQuery'
import { useVillageLatestMessagesQuery } from './useVillageMessagesInfiniteQuery'
import type { components } from '@/types/generated/api'
import type { RealtimeUpdateIntervals, RemainingTime } from '@/types/village'

type VillageStatus = components['schemas']['VillageStatus']

interface UseVillageRealTimeQueriesOptions {
  villageId: string
  currentDay: number
  currentNoonnight: string
  enabled?: boolean
}

/**
 * 村のリアルタイム更新を統合管理するフック
 *
 * 仕様に基づく更新間隔：
 * - 残り時間: 1秒間隔
 * - 新着発言確認: 30秒間隔
 * - 村情報: 60秒間隔
 *
 * サーバー負荷軽減を最優先に設計
 */
export const useVillageRealTimeQueries = ({
  villageId,
  currentDay,
  currentNoonnight,
  enabled = true,
}: UseVillageRealTimeQueriesOptions) => {
  const queryClient = useQueryClient()

  // 村情報の取得（60秒間隔）
  const villageQuery = useVillageQuery(villageId)

  // 村の状態を取得
  const villageStatus = villageQuery.data?.status

  // 更新間隔の設定
  const intervals = useMemo(
    (): RealtimeUpdateIntervals => ({
      remainingTime: 1, // 1秒（仕様準拠）
      newMessages: 30, // 30秒（仕様準拠）
      villageInfo: 60, // 60秒（仕様準拠）
    }),
    []
  )

  // 最新メッセージの監視（30秒間隔）
  const latestMessagesQuery = useVillageLatestMessagesQuery({
    villageId,
    day: currentDay,
    noonnight: currentNoonnight,
    villageStatus,
    enabled:
      enabled && Boolean(villageStatus && !villageStatus.is_finished && !villageStatus.is_canceled),
  })

  // 残り時間の計算と監視（1秒間隔）
  const [remainingTime, setRemainingTime] = useState<RemainingTime | null>(null)

  useEffect(() => {
    if (!enabled || !villageStatus || villageStatus.is_finished || villageStatus.is_canceled) {
      return
    }

    // 村情報から時間情報を取得
    const updateRemainingTime = () => {
      if (!villageQuery.data?.day?.day_list) return

      const currentDayData = villageQuery.data.day.day_list.find((d) => d.day === currentDay)
      if (!currentDayData?.day_change_datetime) return

      const dayChangeTime = new Date(currentDayData.day_change_datetime)
      const now = new Date()
      const diffMs = dayChangeTime.getTime() - now.getTime()

      // 既に日付変更時刻を過ぎている場合
      if (diffMs <= 0) {
        setRemainingTime({
          untilNextDay: 0,
          updatedAt: now,
        })
        return
      }

      const untilNextDay = Math.floor(diffMs / 1000)

      setRemainingTime({
        untilNextDay,
        updatedAt: now,
      })
    }

    // 初回実行
    updateRemainingTime()

    // 1秒間隔で更新
    const timer = setInterval(updateRemainingTime, intervals.remainingTime * 1000)

    return () => clearInterval(timer)
  }, [enabled, villageStatus, villageQuery.data, currentDay, intervals.remainingTime])

  // 新着メッセージの通知
  const [hasNewMessages, setHasNewMessages] = useState(false)

  useEffect(() => {
    if (latestMessagesQuery.data?.pages?.[0]?.list?.length) {
      // 新着メッセージがある場合にフラグを立てる
      // （実際の判定は前回チェック時との比較が必要だが、ここでは簡略化）
      setHasNewMessages(true)

      // 一定時間後にフラグをリセット
      const timer = setTimeout(() => setHasNewMessages(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [latestMessagesQuery.data])

  // 村情報の変更検知
  const [villageInfoChanged, setVillageInfoChanged] = useState(false)

  useEffect(() => {
    // 村情報が更新された際の処理
    if (villageQuery.dataUpdatedAt) {
      setVillageInfoChanged(true)

      // 一定時間後にフラグをリセット
      const timer = setTimeout(() => setVillageInfoChanged(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [villageQuery.dataUpdatedAt])

  // 手動更新機能
  const forceRefresh = () => {
    // 全ての関連クエリを強制リフレッシュ
    queryClient.invalidateQueries({ queryKey: ['village', villageId] })
    queryClient.invalidateQueries({ queryKey: ['villageMessages', villageId] })
    queryClient.invalidateQueries({ queryKey: ['villageMessagesInfinite', villageId] })
    queryClient.invalidateQueries({ queryKey: ['villageLatestMessages', villageId] })
  }

  // 自動更新の一時停止/再開
  const [isPaused, setIsPaused] = useState(false)

  const pauseRealTimeUpdates = () => setIsPaused(true)
  const resumeRealTimeUpdates = () => setIsPaused(false)

  return {
    // クエリ結果
    village: villageQuery.data,
    villageStatus,
    latestMessages: latestMessagesQuery.data?.pages?.[0]?.list ?? [],

    // ロード状態
    isVillageLoading: villageQuery.isLoading,
    isMessagesLoading: latestMessagesQuery.isLoading,
    isLoading: villageQuery.isLoading || latestMessagesQuery.isLoading,

    // エラー状態
    villageError: villageQuery.error,
    messagesError: latestMessagesQuery.error,
    hasError: villageQuery.isError || latestMessagesQuery.isError,

    // リアルタイム情報
    remainingTime,
    hasNewMessages,
    villageInfoChanged,

    // 設定
    intervals,
    isPaused,

    // 制御機能
    forceRefresh,
    pauseRealTimeUpdates,
    resumeRealTimeUpdates,

    // クエリ制御
    refetchVillage: villageQuery.refetch,
    refetchMessages: latestMessagesQuery.refetch,
  }
}

/**
 * 残り時間のフォーマット用ヘルパー関数
 */
export const formatRemainingTime = (remainingTime: RemainingTime | null): string => {
  if (!remainingTime || remainingTime.untilNextDay <= 0) {
    return '00:00:00'
  }

  const hours = Math.floor(remainingTime.untilNextDay / 3600)
  const minutes = Math.floor((remainingTime.untilNextDay % 3600) / 60)
  const seconds = remainingTime.untilNextDay % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * リアルタイム更新の統計情報を取得
 */
export const useVillageRealTimeStats = (villageId: string) => {
  const queryClient = useQueryClient()

  return useMemo(() => {
    const villageQueries = queryClient.getQueriesData({ queryKey: ['village', villageId] })
    const messageQueries = queryClient.getQueriesData({ queryKey: ['villageMessages', villageId] })

    return {
      villageQueryCount: villageQueries.length,
      messageQueryCount: messageQueries.length,
      totalQueries: villageQueries.length + messageQueries.length,
      lastVillageUpdate: villageQueries[0]?.[1] ? new Date() : null,
    }
  }, [queryClient, villageId])
}
