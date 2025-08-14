import { apiClient } from './client'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

/**
 * 村情報を取得する
 */
export async function getVillageData(villageId: number): Promise<VillageView | null> {
  try {
    const { data, error } = await apiClient.GET('/village/{villageId}', {
      params: {
        path: {
          villageId,
        },
      },
    })

    // 成功時の処理（エラーハンドリングは上位で実行済み）
    return data || null
  } catch (error) {
    console.error('Failed to fetch village data:', error)
    return null
  }
}
