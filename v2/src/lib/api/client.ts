import createClient from 'openapi-fetch'
import type { paths } from '@/types/generated/api'
import { auth } from '@/lib/firebase'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8087/firewolf'

// カスタムクエリシリアライザーを修正（シンプルなkey=value形式に）
const customQuerySerializer = (queryObject: Record<string, any>): string => {
  const params = new URLSearchParams()

  const addParams = (obj: any) => {
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === null) continue

      if (Array.isArray(obj[key])) {
        obj[key].forEach((item: any) => {
          if (typeof item === 'object') {
            // ネストされたオブジェクトの場合は展開
            addParams(item)
          } else {
            // 配列の場合は同じキーで複数の値を追加
            params.append(key, String(item))
          }
        })
      } else if (typeof obj[key] === 'object') {
        // オブジェクトの場合は中身を展開
        addParams(obj[key])
      } else {
        params.append(key, String(obj[key]))
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
