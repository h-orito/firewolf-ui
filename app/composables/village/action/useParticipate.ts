import type { MessageView, VillageParticipateBody } from '~/lib/api/types'

export interface ParticipateForm {
  charaId: number
  charaName: string
  charaShortName: string
  firstRequestSkill: string
  secondRequestSkill: string
  joinMessage: string
  joinPassword: string
  spectator: boolean
}

/**
 * 入村・見学参加のAPI呼び出しロジック
 */
export const useParticipate = () => {
  const { apiCall } = useApi()
  const villageStore = useVillageStore()

  // State
  const confirming = ref(false)
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * フォームをAPIリクエストボディに変換
   */
  const toRequestBody = (form: ParticipateForm): VillageParticipateBody => {
    return {
      chara_id: form.charaId,
      chara_name: form.charaName,
      chara_short_name: form.charaShortName,
      first_request_skill: form.firstRequestSkill,
      second_request_skill: form.secondRequestSkill,
      join_message: form.joinMessage,
      join_password: form.joinPassword || undefined,
      spectator: form.spectator
    }
  }

  /**
   * 入村確認API
   * POST /village/{villageId}/participate-confirm
   * @returns 確認用メッセージ（プレビュー用）、エラー時はnull
   */
  const confirmParticipate = async (
    form: ParticipateForm
  ): Promise<MessageView | null> => {
    confirming.value = true
    error.value = null

    try {
      const response = await apiCall<MessageView>(
        `/village/${villageStore.villageId}/participate-confirm`,
        {
          method: 'POST',
          body: toRequestBody(form)
        }
      )
      return response
    } catch (err) {
      handleApiError(err)
      return null
    } finally {
      confirming.value = false
    }
  }

  /**
   * 入村実行API
   * POST /village/{villageId}/participate
   * @returns 成功時true、失敗時false
   */
  const participate = async (form: ParticipateForm): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/village/${villageStore.villageId}/participate`, {
        method: 'POST',
        body: toRequestBody(form)
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
    console.error('Participate API error:', err)
  }

  /**
   * エラーをクリア
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    confirming: readonly(confirming),
    submitting: readonly(submitting),
    error: readonly(error),

    // Methods
    confirmParticipate,
    participate,
    clearError
  }
}
