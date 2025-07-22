import createClient from 'openapi-fetch'
import type { paths } from '@/types/generated/api'

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

export const apiClient = createClient<paths>({
  baseUrl: apiBaseUrl,
  querySerializer: customQuerySerializer,
})
