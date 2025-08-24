import type { FetchError } from 'ofetch'

// 認証付きAPI呼び出し用composable（Nuxt 4推奨パターン）
export const useApi = () => {
  const { getAuthToken } = useAuthStore()

  // 認証ヘッダー付きAPI呼び出し
  const apiCall = async <T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const config = useRuntimeConfig()

    try {
      // 認証トークンを取得
      const token = await getAuthToken()

      // リクエストオプションの構築（ofetch互換の型）
      const fetchOptions = {
        baseURL: config.public.apiBaseUrl,
        headers: {
          ...(options?.headers || {}),
          ...(token && { Authorization: `Bearer ${token}` })
        },
        ...options
      }

      return await $fetch<T>(url, fetchOptions)
    } catch (error: unknown) {
      // ofetchのFetchErrorを適切にハンドリング
      const fetchError = error as FetchError<{ status?: number }>
      const status = fetchError.status || fetchError.statusCode

      if (status === 404 && fetchError.data?.status === 499) {
        // Business errorは個別にハンドリングするので再スロー
        throw error
      }

      // その他のエラーはログ出力（本来はToast表示）
      console.error('API接続エラー:', error)
      throw error
    }
  }

  return {
    apiCall
  }
}
