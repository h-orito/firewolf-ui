import createClient from 'openapi-fetch'
import type { paths } from '@/types/generated/api'
import { auth } from '@/lib/firebase'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8087/firewolf'

// カスタムクエリシリアライザーを定義して深くネストされたオブジェクトに対応
const customQuerySerializer = (queryObject: Record<string, any>): string => {
  const params = new URLSearchParams()

  const addParams = (obj: any, prefix: string = '') => {
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === null) continue

      const paramKey = prefix ? `${prefix}[${key}]` : key

      if (Array.isArray(obj[key])) {
        obj[key].forEach((item: any, index: number) => {
          if (typeof item === 'object') {
            addParams(item, `${paramKey}[${index}]`)
          } else {
            params.append(`${paramKey}[]`, String(item))
          }
        })
      } else if (typeof obj[key] === 'object') {
        addParams(obj[key], paramKey)
      } else {
        params.append(paramKey, String(obj[key]))
      }
    }
  }

  addParams(queryObject)
  return params.toString()
}

const client = createClient<paths>({
  baseUrl: apiBaseUrl,
  querySerializer: customQuerySerializer,
})

// 認証ヘッダーを自動的に追加するインターセプター
client.use({
  onRequest: async ({ request }) => {
    // Firebase認証のIDトークンを取得
    const user = auth.currentUser
    if (user) {
      try {
        const token = await user.getIdToken()
        request.headers.set('Authorization', `Bearer ${token}`)
      } catch (error) {
        console.error('Failed to get Firebase ID token:', error)
      }
    }
    return request
  },
})

export const apiClient = client
