'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function usePlayerRecordQuery(playerId: number) {
  return useQuery({
    queryKey: ['playerRecord', playerId],
    queryFn: async () => {
      const response = await apiClient.GET('/player/{playerId}/record', {
        params: { path: { playerId } },
      })
      if (response.error) {
        throw new Error('プレイヤー戦績データの取得に失敗しました')
      }
      return response.data
    },
  })
}
