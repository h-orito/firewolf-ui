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
