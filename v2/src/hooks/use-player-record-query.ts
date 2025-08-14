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
      // エラーはより上位でハンドリング済み
      return response.data
    },
  })
}
