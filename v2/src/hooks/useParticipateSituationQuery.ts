'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useParticipateSituationQuery(villageId: string) {
  return useQuery({
    queryKey: ['participate-situation', villageId],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/village/{villageId}/situation', {
        params: {
          path: { villageId: parseInt(villageId) },
        },
      })

      if (error) {
        throw new Error('参加者状況の取得に失敗しました')
      }

      return data
    },
    enabled: !!villageId,
  })
}
