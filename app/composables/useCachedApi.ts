import type { AsyncDataOptions } from '#app'
import type { FetchError } from 'ofetch'

/**
 * キャッシュ戦略を適用したAPI呼び出しを提供するcomposable
 *
 * 主な機能:
 * - useAsyncData + getCachedData によるSWR (Stale-While-Revalidate) パターン
 * - マスターデータなど頻繁に変わらないデータのキャッシュ
 * - メモリキャッシュとキャッシュ有効期限の管理
 *
 * 注意:
 * - リアルタイム性が必要なデータ（村の状態、メッセージ等）には使用しない
 * - 認証が必要なAPIには useApi を使用する
 */

// キャッシュエントリの型定義
interface CacheEntry<T> {
  data: T
  fetchedAt: number
}

// メモリキャッシュストア
const cacheStore = new Map<string, CacheEntry<unknown>>()

// デフォルトのキャッシュ有効期限（ミリ秒）
const DEFAULT_CACHE_MAX_AGE = 5 * 60 * 1000 // 5分
const MASTER_DATA_CACHE_MAX_AGE = 30 * 60 * 1000 // 30分（マスターデータ用）

export const useCachedApi = () => {
  const config = useRuntimeConfig()
  const { getAuthToken } = useAuth()

  /**
   * キャッシュからデータを取得
   * getCachedData オプションで使用
   */
  const getCachedData = <T>(
    key: string,
    maxAge: number = DEFAULT_CACHE_MAX_AGE
  ): T | undefined => {
    const cached = cacheStore.get(key) as CacheEntry<T> | undefined
    if (!cached) return undefined

    const isExpired = Date.now() - cached.fetchedAt > maxAge
    if (isExpired) {
      cacheStore.delete(key)
      return undefined
    }

    return cached.data
  }

  /**
   * キャッシュにデータを保存
   */
  const setCacheData = <T>(key: string, data: T): void => {
    cacheStore.set(key, {
      data,
      fetchedAt: Date.now()
    })
  }

  /**
   * キャッシュを無効化
   */
  const invalidateCache = (keyPattern?: string): void => {
    if (keyPattern) {
      // パターンにマッチするキーを削除
      for (const key of cacheStore.keys()) {
        if (key.includes(keyPattern)) {
          cacheStore.delete(key)
        }
      }
    } else {
      // 全キャッシュをクリア
      cacheStore.clear()
    }
  }

  /**
   * キャッシュ付きAPI呼び出し（useAsyncData wrapper）
   *
   * @param key キャッシュキー（一意である必要あり）
   * @param url APIエンドポイント
   * @param options AsyncDataOptions + カスタムオプション
   */
  const cachedFetch = async <T>(
    key: string,
    url: string,
    options: {
      /** キャッシュの有効期限（ミリ秒） */
      maxAge?: number
      /** 認証ヘッダーを含めるか */
      withAuth?: boolean
      /** 追加のfetchオプション */
      fetchOptions?: Parameters<typeof $fetch>[1]
      /** useAsyncDataオプション */
      asyncDataOptions?: AsyncDataOptions<T>
    } = {}
  ) => {
    const {
      maxAge = DEFAULT_CACHE_MAX_AGE,
      withAuth = false,
      fetchOptions = {},
      asyncDataOptions = {}
    } = options

    return useAsyncData<T>(
      key,
      async (): Promise<T> => {
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(fetchOptions.headers as Record<string, string>)
          }

          if (withAuth) {
            const token = await getAuthToken()
            if (token) {
              headers['Authorization'] = `Bearer ${token}`
            }
          }

          const response = (await $fetch(url, {
            baseURL: config.public.apiBaseUrl,
            headers,
            ...fetchOptions
          })) as T

          // キャッシュに保存
          setCacheData(key, response)

          return response
        } catch (error: unknown) {
          const fetchError = error as FetchError<{ status?: number }>
          console.error('Cached API Error:', {
            url,
            status: fetchError.status || fetchError.statusCode,
            error: fetchError.data || fetchError.message
          })
          throw error
        }
      },
      {
        ...asyncDataOptions,
        getCachedData: () => getCachedData<T>(key, maxAge)
      }
    )
  }

  /**
   * マスターデータ用キャッシュ付きAPI呼び出し
   * 長期キャッシュ（30分）を適用
   */
  const cachedMasterFetch = async <T>(
    key: string,
    url: string,
    options: Omit<Parameters<typeof cachedFetch>[2], 'maxAge'> = {}
  ) => {
    return cachedFetch<T>(key, url, {
      ...options,
      maxAge: MASTER_DATA_CACHE_MAX_AGE
    })
  }

  /**
   * シンプルなキャッシュ付きAPI呼び出し（onMounted等で使用可能）
   *
   * useAsyncDataを使用せず、直接$fetchを呼び出す
   * キャッシュがあればそれを返し、なければAPIを呼び出してキャッシュする
   *
   * @param key キャッシュキー
   * @param url APIエンドポイント
   * @param options オプション
   */
  const fetchWithCache = async <T>(
    key: string,
    url: string,
    options: {
      /** キャッシュの有効期限（ミリ秒） */
      maxAge?: number
      /** 認証ヘッダーを含めるか */
      withAuth?: boolean
      /** 追加のfetchオプション */
      fetchOptions?: Parameters<typeof $fetch>[1]
    } = {}
  ): Promise<T> => {
    const {
      maxAge = DEFAULT_CACHE_MAX_AGE,
      withAuth = false,
      fetchOptions = {}
    } = options

    // キャッシュをチェック
    const cached = getCachedData<T>(key, maxAge)
    if (cached !== undefined) {
      return cached
    }

    // キャッシュがない場合はAPIを呼び出す
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>)
      }

      if (withAuth) {
        const token = await getAuthToken()
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
      }

      const response = (await $fetch(url, {
        baseURL: config.public.apiBaseUrl,
        headers,
        ...fetchOptions
      })) as T

      // キャッシュに保存
      setCacheData(key, response)

      return response
    } catch (error: unknown) {
      const fetchError = error as FetchError<{ status?: number }>
      console.error('Cached API Error:', {
        url,
        status: fetchError.status || fetchError.statusCode,
        error: fetchError.data || fetchError.message
      })
      throw error
    }
  }

  /**
   * マスターデータ用のシンプルなキャッシュ付きAPI呼び出し
   * 長期キャッシュ（30分）を適用
   */
  const fetchMasterWithCache = async <T>(
    key: string,
    url: string,
    options: Omit<Parameters<typeof fetchWithCache>[2], 'maxAge'> = {}
  ): Promise<T> => {
    return fetchWithCache<T>(key, url, {
      ...options,
      maxAge: MASTER_DATA_CACHE_MAX_AGE
    })
  }

  return {
    cachedFetch,
    cachedMasterFetch,
    fetchWithCache,
    fetchMasterWithCache,
    getCachedData,
    setCacheData,
    invalidateCache,
    // キャッシュ有効期限の定数をエクスポート
    CACHE_MAX_AGE: {
      DEFAULT: DEFAULT_CACHE_MAX_AGE,
      MASTER_DATA: MASTER_DATA_CACHE_MAX_AGE
    }
  }
}
