import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { VillageErrorType } from '@/types/village'

interface CreatorSayParams {
  villageId: number
  message: string
  isConfirm: boolean
}

interface CreatorActionParams {
  villageId: number
  actionType: 'force_leave' | 'destroy' | 'extend_epilogue'
  targetPlayerId?: number
}

interface CreatorActionResult {
  success: boolean
  data?: any
  error?: {
    type: VillageErrorType
    message: string
    detail?: string
  }
}

/**
 * 村建て発言を行うミューテーション
 */
export const useCreatorSayMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<CreatorActionResult, Error, CreatorSayParams>({
    mutationFn: async ({ villageId, message, isConfirm }) => {
      try {
        const endpoint = isConfirm
          ? '/creator/village/{villageId}/say-confirm'
          : '/creator/village/{villageId}/say'

        const { data, error } = await apiClient.POST(endpoint as any, {
          params: {
            path: { villageId },
          },
          body: {
            message: message.trim(),
          },
        })

        if (error) {
          throw new Error((error as any)?.detail || 'API エラーが発生しました')
        }

        return {
          success: true,
          data,
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '予期しないエラーが発生しました'

        return {
          success: false,
          error: {
            type: 'API_ERROR' as VillageErrorType,
            message: errorMessage,
            detail: error instanceof Error ? error.stack : undefined,
          },
        }
      }
    },
    onSuccess: (result, { villageId }) => {
      if (result.success) {
        // 村情報とメッセージリストのキャッシュを無効化
        queryClient.invalidateQueries({ queryKey: ['village', villageId] })
        queryClient.invalidateQueries({ queryKey: ['village-messages', villageId] })
      }
    },
    retry: (failureCount, error) => {
      // ネットワークエラーの場合のみリトライ
      return failureCount < 2 && (error?.message?.includes('fetch') ?? false)
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * 村建て専用アクション（強制退村、廃村、エピローグ延長）を行うミューテーション
 */
export const useCreatorActionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<CreatorActionResult, Error, CreatorActionParams>({
    mutationFn: async ({ villageId, actionType, targetPlayerId }) => {
      try {
        let endpoint: string
        let body: any = {}

        switch (actionType) {
          case 'force_leave':
            endpoint = '/creator/village/{villageId}/kick'
            body = { target_player_id: targetPlayerId }
            break
          case 'destroy':
            endpoint = '/creator/village/{villageId}/cancel'
            break
          case 'extend_epilogue':
            endpoint = '/creator/village/{villageId}/extend-epilogue'
            break
          default:
            throw new Error(`不明なアクションタイプ: ${actionType}`)
        }

        const { data, error } = await apiClient.POST(endpoint as any, {
          params: {
            path: { villageId },
          },
          body,
        })

        if (error) {
          throw new Error((error as any)?.detail || 'API エラーが発生しました')
        }

        return {
          success: true,
          data,
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '予期しないエラーが発生しました'

        return {
          success: false,
          error: {
            type: 'API_ERROR' as VillageErrorType,
            message: errorMessage,
            detail: error instanceof Error ? error.stack : undefined,
          },
        }
      }
    },
    onSuccess: (result, { villageId, actionType }) => {
      if (result.success) {
        // 村情報のキャッシュを無効化
        queryClient.invalidateQueries({ queryKey: ['village', villageId] })

        if (actionType === 'force_leave') {
          // 参加者リストも更新
          queryClient.invalidateQueries({ queryKey: ['village-participants', villageId] })
        }

        if (actionType === 'destroy') {
          // 廃村の場合は村リストも更新
          queryClient.invalidateQueries({ queryKey: ['village-list'] })
        }
      }
    },
    retry: (failureCount, error) => {
      // ネットワークエラーの場合のみリトライ
      return failureCount < 2 && (error?.message?.includes('fetch') ?? false)
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * 村建て発言確認用のミューテーション
 */
export const useConfirmCreatorSayMutation = () => {
  const baseMutation = useCreatorSayMutation()

  return {
    ...baseMutation,
    mutateAsync: async (params: Omit<CreatorSayParams, 'isConfirm'>) => {
      return baseMutation.mutateAsync({ ...params, isConfirm: true })
    },
  }
}

/**
 * 村建て発言投稿用のミューテーション
 */
export const useSubmitCreatorSayMutation = () => {
  const baseMutation = useCreatorSayMutation()

  return {
    ...baseMutation,
    mutateAsync: async (params: Omit<CreatorSayParams, 'isConfirm'>) => {
      return baseMutation.mutateAsync({ ...params, isConfirm: false })
    },
  }
}
