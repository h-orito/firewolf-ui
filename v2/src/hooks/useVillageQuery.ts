import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

export const useVillageQuery = (villageId: string) => {
  return useQuery<VillageView>({
    queryKey: ['village', villageId],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/village/{villageId}', {
        params: {
          path: { villageId: Number(villageId) },
        },
      })

      if (error) {
        throw new Error(`Failed to fetch village ${villageId}`)
      }

      return data
    },
    staleTime: 1000 * 30, // 30秒間はキャッシュを利用
    refetchInterval: 1000 * 60, // 1分ごとに自動更新
  })
}
