import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { VillageError, VillageErrorType } from '@/types/village'

/**
 * 村画面でのエラーハンドリングを統合するフック
 *
 * 特徴：
 * - エラー種別に応じた適切な処理
 * - リトライ戦略の提供
 * - ユーザーフレンドリーなエラーメッセージ
 * - キャッシュ管理との統合
 */
export const useVillageErrorHandler = (villageId: string) => {
  const queryClient = useQueryClient()

  // エラー種別の判定
  const classifyError = useCallback((error: Error): VillageErrorType => {
    const message = error.message.toLowerCase()

    if (message.includes('village not found') || message.includes('404')) {
      return 'VILLAGE_NOT_FOUND'
    }
    if (message.includes('participant not found')) {
      return 'PARTICIPANT_NOT_FOUND'
    }
    if (message.includes('permission denied') || message.includes('403')) {
      return 'PERMISSION_DENIED'
    }
    if (message.includes('message post') || message.includes('post failed')) {
      return 'MESSAGE_POST_FAILED'
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'NETWORK_ERROR'
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return 'VALIDATION_ERROR'
    }
    if (message.includes('server error') || message.includes('500')) {
      return 'SERVER_ERROR'
    }

    return 'SERVER_ERROR' // デフォルト
  }, [])

  // エラーメッセージの取得
  const getErrorMessage = useCallback((errorType: VillageErrorType): string => {
    switch (errorType) {
      case 'VILLAGE_NOT_FOUND':
        return '指定された村が見つかりません。URLを確認するか、村一覧から選択してください。'
      case 'PARTICIPANT_NOT_FOUND':
        return '参加者情報が見つかりません。再ログインをお試しください。'
      case 'PERMISSION_DENIED':
        return 'この操作を実行する権限がありません。'
      case 'MESSAGE_POST_FAILED':
        return '発言の投稿に失敗しました。時間をおいて再試行してください。'
      case 'NETWORK_ERROR':
        return 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
      case 'VALIDATION_ERROR':
        return '入力内容に問題があります。入力内容を確認してください。'
      case 'SERVER_ERROR':
      default:
        return 'サーバーエラーが発生しました。しばらく時間をおいて再試行してください。'
    }
  }, [])

  // 村エラーオブジェクトの作成
  const createVillageError = useCallback(
    (error: Error): VillageError => {
      const errorType = classifyError(error)
      return {
        type: errorType,
        message: getErrorMessage(errorType),
        detail: error.stack,
        timestamp: new Date(),
      }
    },
    [classifyError, getErrorMessage]
  )

  // リトライが可能かどうかの判定
  const canRetry = useCallback((errorType: VillageErrorType): boolean => {
    switch (errorType) {
      case 'NETWORK_ERROR':
      case 'SERVER_ERROR':
        return true
      case 'VILLAGE_NOT_FOUND':
      case 'PARTICIPANT_NOT_FOUND':
      case 'PERMISSION_DENIED':
      case 'VALIDATION_ERROR':
      case 'MESSAGE_POST_FAILED':
        return false
      default:
        return false
    }
  }, [])

  // リトライ実行
  const retryQuery = useCallback(
    (queryKey: string[]) => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.refetchQueries({ queryKey })
    },
    [queryClient]
  )

  // 村関連のクエリをリトライ
  const retryVillageQueries = useCallback(() => {
    retryQuery(['village', villageId])
    retryQuery(['villageMessages', villageId])
    retryQuery(['villageMessagesInfinite', villageId])
    retryQuery(['villageLatestMessages', villageId])
  }, [retryQuery, villageId])

  // エラー状態のリセット
  const resetErrorState = useCallback(() => {
    // エラー状態をリセットするために関連クエリを再実行
    queryClient.resetQueries({ queryKey: ['village', villageId] })
  }, [queryClient, villageId])

  // 標準的なクエリリトライ設定
  const getQueryRetryConfig = useCallback(
    () => ({
      retry: (failureCount: number, error: Error) => {
        const errorType = classifyError(error)

        // リトライ可能でない場合は即座に諦める
        if (!canRetry(errorType)) {
          return false
        }

        // 最大3回までリトライ
        if (failureCount >= 3) {
          return false
        }

        return true
      },
      retryDelay: (attemptIndex: number) => {
        // 指数バックオフ（1秒, 2秒, 4秒...、最大10秒）
        return Math.min(1000 * Math.pow(2, attemptIndex), 10000)
      },
    }),
    [classifyError, canRetry]
  )

  // 標準的なミューテーションリトライ設定
  const getMutationRetryConfig = useCallback(
    () => ({
      retry: (failureCount: number, error: Error) => {
        const errorType = classifyError(error)

        // ネットワークエラーの場合のみ最大2回リトライ
        if (errorType === 'NETWORK_ERROR' && failureCount < 2) {
          return true
        }

        return false
      },
      retryDelay: (attemptIndex: number) => {
        // 線形バックオフ（1秒, 2秒, 3秒...）
        return 1000 * (attemptIndex + 1)
      },
    }),
    [classifyError]
  )

  return {
    // エラー分析
    classifyError,
    getErrorMessage,
    createVillageError,
    canRetry,

    // リトライ機能
    retryQuery,
    retryVillageQueries,
    resetErrorState,

    // 設定
    getQueryRetryConfig,
    getMutationRetryConfig,
  }
}
