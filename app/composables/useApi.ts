import type { FetchError } from 'ofetch'

// 認証付きAPI呼び出し用composable（Nuxt 4推奨パターン）
export const useApi = () => {
  const { getAuthToken } = useAuthStore()

  // 認証ヘッダー付きAPI呼び出し（リクエスト・レスポンスインターセプター機能含む）
  const apiCall = async <T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const config = useRuntimeConfig()

    try {
      // リクエストインターセプター: 認証トークンを取得・設定
      const token = await getAuthToken()

      // リクエストインターセプター: 共通ヘッダーの設定
      const fetchOptions = {
        baseURL: config.public.apiBaseUrl,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
          ...(token && { Authorization: `Bearer ${token}` })
        },
        ...options
      }

      // API呼び出し実行
      const response = await $fetch<T>(url, fetchOptions)

      // レスポンスインターセプター: 成功時の共通処理
      // 現在は特別な処理なし（必要に応じてログ記録、データ変換等を追加可能）

      return response as T
    } catch (error: unknown) {
      // レスポンスインターセプター: エラー時の共通処理
      const fetchError = error as FetchError<{ status?: number }>
      const status = fetchError.status || fetchError.statusCode

      if (
        (status === 400 || status === 404) &&
        fetchError.data?.status === 499
      ) {
        // Business errorは個別にハンドリングするので再スロー
        throw error
      }

      // その他のエラーはログ出力（将来的にToast表示機能を追加予定）
      console.error('API接続エラー:', {
        url,
        status,
        error: fetchError.data || fetchError.message
      })
      throw error
    }
  }

  return {
    apiCall
  }
}
