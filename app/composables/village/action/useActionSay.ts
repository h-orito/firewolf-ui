import type { VillageActionBody, MessageView } from '~/lib/api/types'
import { useVillage } from '~/composables/village/useVillage'

/**
 * アクション発言処理のAPI呼び出しロジック
 */
export const useActionSay = () => {
  const { apiCall } = useApi()
  const { villageId } = useVillage()

  // State
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * アクション発言実行API
   * POST /village/{villageId}/action
   * @param body アクション発言リクエストボディ
   * @returns 成功時true、失敗時false
   */
  const actionSay = async (body: VillageActionBody): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/village/${villageId.value}/action`, {
        method: 'POST',
        body
      })
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      submitting.value = false
    }
  }

  /**
   * アクション発言確認API（プレビュー用）
   * POST /village/{villageId}/action-confirm
   * @param body アクション発言リクエストボディ
   * @returns 成功時MessageView、失敗時null
   */
  const actionSayConfirm = async (
    body: VillageActionBody
  ): Promise<MessageView | null> => {
    submitting.value = true
    error.value = null

    try {
      const response = await apiCall<MessageView>(
        `/village/${villageId.value}/action-confirm`,
        {
          method: 'POST',
          body
        }
      )
      return response
    } catch (err) {
      handleApiError(err)
      return null
    } finally {
      submitting.value = false
    }
  }

  /**
   * APIエラーをハンドリング
   */
  const handleApiError = (err: unknown) => {
    if (err instanceof Error) {
      // FetchErrorの場合、レスポンスからエラーメッセージを取得
      const fetchError = err as Error & {
        data?: { message?: string; status?: number }
        statusCode?: number
      }

      // ビジネスエラー (499) の場合
      if (fetchError.statusCode === 499 || fetchError.data?.status === 499) {
        error.value = fetchError.data?.message ?? 'エラーが発生しました'
      } else {
        error.value = err.message
      }
    } else {
      error.value = 'エラーが発生しました'
    }
    console.error('ActionSay API error:', err)
  }

  /**
   * エラーをクリア
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    submitting: readonly(submitting),
    error: readonly(error),

    // Methods
    actionSay,
    actionSayConfirm,
    clearError
  }
}
