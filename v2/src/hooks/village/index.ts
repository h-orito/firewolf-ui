/**
 * 村画面のAPI統合エントリーポイント
 *
 * 村画面で使用するすべてのAPI関連フックをエクスポート
 * 統合された機能の提供とAPI使用の簡素化
 */

// 基本的な村情報取得
export { useVillageQuery } from '../use-village-query'

// 参加者情報取得
export {
  useVillageParticipantsQuery,
  useVillageParticipantQuery,
} from './use-village-participants-query'

// メッセージ関連
export {
  useVillageMessagesInfiniteQuery,
  useVillageMessagesFlat,
  useVillageLatestMessagesQuery,
} from './use-village-messages-infinite-query'

// メッセージ投稿
export {
  usePostVillageMessageMutation,
  useConfirmVillageMessageMutation,
  useSubmitVillageMessageMutation,
} from './use-post-village-message-mutation'

// 投票機能
export { useVoteMutation } from './use-vote-mutation'

// 能力行使機能
export { useAbilityMutation } from './use-ability-mutation'

// リアルタイム更新
export {
  useVillageRealTimeQueries,
  formatRemainingTime,
  useVillageRealTimeStats,
} from './use-village-real-time-queries'

// エラーハンドリング
export { useVillageErrorHandler } from './use-village-error-handler'

// 既存のフックも re-export
export { useVillageMessagesQuery } from '../use-village-messages-query'
export { useVillageSaySituationQuery } from '../use-village-say-situation-query'

// 統合されたカスタムフックの提供
import { useVillageQuery } from '../use-village-query'
import { useVillageParticipantsQuery } from './use-village-participants-query'
import { useVillageRealTimeQueries } from './use-village-real-time-queries'
import { useVillageErrorHandler } from './use-village-error-handler'

/**
 * 村画面の全体的な状態を統合管理するフック
 *
 * 村画面で必要な基本的な情報をまとめて取得・管理
 */
export const useVillageState = (
  villageId: string,
  currentDay: number = 1,
  currentNoonnight: string = '昼'
) => {
  // 基本情報の取得
  const villageQuery = useVillageQuery(villageId)
  const participantsQuery = useVillageParticipantsQuery(villageId)

  // リアルタイム更新
  const realTimeQueries = useVillageRealTimeQueries({
    villageId,
    currentDay,
    currentNoonnight,
  })

  // エラーハンドリング
  const errorHandler = useVillageErrorHandler(villageId)

  const isLoading =
    villageQuery.isLoading || participantsQuery.isLoading || realTimeQueries.isLoading
  const hasError = villageQuery.isError || participantsQuery.isError || realTimeQueries.hasError

  return {
    // 基本データ
    village: villageQuery.data,
    participants: participantsQuery.participants,
    activeParticipants: participantsQuery.activeParticipants,
    spectators: participantsQuery.spectators,
    aliveParticipants: participantsQuery.aliveParticipants,
    deadParticipants: participantsQuery.deadParticipants,

    // 統計情報
    participantCounts: {
      total: participantsQuery.totalCount,
      active: participantsQuery.activeCount,
      spectator: participantsQuery.spectatorCount,
      alive: participantsQuery.aliveCount,
      dead: participantsQuery.deadCount,
    },

    // リアルタイム情報
    remainingTime: realTimeQueries.remainingTime,
    hasNewMessages: realTimeQueries.hasNewMessages,
    villageInfoChanged: realTimeQueries.villageInfoChanged,

    // 状態
    isLoading,
    hasError,

    // エラー情報
    errors: {
      village: villageQuery.error,
      participants: participantsQuery.error,
      realTime: realTimeQueries.villageError || realTimeQueries.messagesError,
    },

    // 制御機能
    refetch: {
      village: villageQuery.refetch,
      participants: participantsQuery.refetch,
      realTime: realTimeQueries.forceRefresh,
      all: () => {
        villageQuery.refetch()
        participantsQuery.refetch()
        realTimeQueries.forceRefresh()
      },
    },

    // エラーハンドリング
    errorHandler,

    // リアルタイム制御
    realTimeControl: {
      pause: realTimeQueries.pauseRealTimeUpdates,
      resume: realTimeQueries.resumeRealTimeUpdates,
      isPaused: realTimeQueries.isPaused,
      forceRefresh: realTimeQueries.forceRefresh,
    },
  }
}

/**
 * 村画面の基本的なメタ情報を取得するフック
 * パフォーマンスを重視した軽量版
 */
export const useVillageMeta = (villageId: string) => {
  const villageQuery = useVillageQuery(villageId)

  return {
    villageId: Number(villageId),
    villageName: villageQuery.data?.name,
    villageStatus: villageQuery.data?.status,
    isLoading: villageQuery.isLoading,
    isError: villageQuery.isError,
    error: villageQuery.error,
  }
}
