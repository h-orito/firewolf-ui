import { useVillage } from '~/composables/village/useVillage'

/**
 * 廃村処理のAPI呼び出しロジック
 */
export const useCancelVillage = () => {
  const { apiCall } = useApi()
  const { villageId } = useVillage()

  // State
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * 廃村実行API
   * POST /creator/village/{villageId}/cancel
   * @returns 成功時true、失敗時false
   */
  const cancelVillage = async (): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/creator/village/${villageId.value}/cancel`, {
        method: 'POST'
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
    console.error('Cancel Village API error:', err)
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
    cancelVillage,
    clearError
  }
}
