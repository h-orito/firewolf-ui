import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { VillageErrorType } from '@/types/village'

interface PostMessageParams {
  villageId: number
  message: string
  messageType: string
  faceType: string
  isConfirm: boolean
}

interface PostMessageResult {
  success: boolean
  data?: any
  error?: {
    type: VillageErrorType
    message: string
    detail?: string
  }
}

/**
 * 村への発言投稿を行うミューテーション
 *
 * 特徴：
 * - 確認送信と本送信の両方に対応
 * - エラーハンドリングとユーザーフレンドリーなエラーメッセージ
 * - キャッシュの自動更新
 * - リトライ機能
 */
export const usePostVillageMessageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostMessageResult, Error, PostMessageParams>({
    mutationFn: async ({ villageId, message, messageType, faceType, isConfirm }) => {
      try {
        const endpoint = isConfirm ? '/village/{villageId}/say-confirm' : '/village/{villageId}/say'

        const { data, error } = await apiClient.POST(endpoint, {
          params: {
            path: { villageId },
          },
          body: {
            message: message.trim(),
            message_type: messageType,
            face_type: faceType,
          },
        })

        if (error) {
          // APIエラーを詳細に分類
          let errorType: VillageErrorType = 'MESSAGE_POST_FAILED'
          let errorMessage = 'メッセージの投稿に失敗しました'

          if (error && typeof error === 'object') {
            const errorObj = error as any

            // よくあるエラーパターンの分類
            if (errorObj.message?.includes('validation') || errorObj.message?.includes('invalid')) {
              errorType = 'VALIDATION_ERROR'
              errorMessage = '入力内容に問題があります。内容を確認してください。'
            } else if (
              errorObj.message?.includes('permission') ||
              errorObj.message?.includes('403')
            ) {
              errorType = 'PERMISSION_DENIED'
              errorMessage = 'この操作を実行する権限がありません。'
            } else if (
              errorObj.message?.includes('network') ||
              errorObj.message?.includes('timeout')
            ) {
              errorType = 'NETWORK_ERROR'
              errorMessage = 'ネットワークエラーが発生しました。接続を確認してください。'
            } else if (errorObj.message?.includes('server') || errorObj.message?.includes('500')) {
              errorType = 'SERVER_ERROR'
              errorMessage = 'サーバーエラーが発生しました。時間をおいて再試行してください。'
            }
          }

          return {
            success: false,
            error: {
              type: errorType,
              message: errorMessage,
              detail: JSON.stringify(error),
            },
          }
        }

        return {
          success: true,
          data,
        }
      } catch (err) {
        return {
          success: false,
          error: {
            type: 'NETWORK_ERROR' as VillageErrorType,
            message: 'ネットワークエラーが発生しました。接続を確認してください。',
            detail: err instanceof Error ? err.message : String(err),
          },
        }
      }
    },
    onSuccess: (result, variables) => {
      if (result.success && !variables.isConfirm) {
        // 本送信が成功した場合のみキャッシュを更新
        const { villageId } = variables

        // メッセージリストのキャッシュを無効化して再取得を促す
        queryClient.invalidateQueries({
          queryKey: ['villageMessages', villageId.toString()],
        })
        queryClient.invalidateQueries({
          queryKey: ['villageMessagesInfinite', villageId.toString()],
        })
        queryClient.invalidateQueries({
          queryKey: ['villageLatestMessages', villageId.toString()],
        })

        // 村情報も無効化（発言可能回数などが変更される可能性があるため）
        queryClient.invalidateQueries({
          queryKey: ['village', villageId.toString()],
        })
      }
    },
    // リトライ設定
    retry: (failureCount, error) => {
      // ネットワークエラーの場合のみ最大2回リトライ
      if (failureCount < 2 && error.message.includes('network')) {
        return true
      }
      return false
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // 指数バックオフ
  })
}

/**
 * 発言確認専用のミューテーション
 */
export const useConfirmVillageMessageMutation = () => {
  const baseMutation = usePostVillageMessageMutation()

  return {
    ...baseMutation,
    mutate: (params: Omit<PostMessageParams, 'isConfirm'>) =>
      baseMutation.mutate({ ...params, isConfirm: true }),
    mutateAsync: (params: Omit<PostMessageParams, 'isConfirm'>) =>
      baseMutation.mutateAsync({ ...params, isConfirm: true }),
  }
}

/**
 * 発言送信専用のミューテーション
 */
export const useSubmitVillageMessageMutation = () => {
  const baseMutation = usePostVillageMessageMutation()

  return {
    ...baseMutation,
    mutate: (params: Omit<PostMessageParams, 'isConfirm'>) =>
      baseMutation.mutate({ ...params, isConfirm: false }),
    mutateAsync: (params: Omit<PostMessageParams, 'isConfirm'>) =>
      baseMutation.mutateAsync({ ...params, isConfirm: false }),
  }
}
