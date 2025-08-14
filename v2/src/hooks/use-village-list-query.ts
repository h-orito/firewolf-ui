import { apiClient } from '@/lib/api/client'
import type { components } from '@/types/generated/api'
import { useQuery } from '@tanstack/react-query'

type VillageListForm = components['schemas']['VillageListForm']
type VillagesView = components['schemas']['VillagesView']

export const useVillageListQuery = (form?: VillageListForm) => {
  return useQuery<VillagesView | undefined>({
    queryKey: ['villageList', form],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/village/list', {
        params: {
          query: { form: form ?? {} },
        },
      })

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (error) {
        throw new Error('Failed to fetch villages')
      }

      return data
    },
    staleTime: 1000 * 60 * 5, // 5分間はキャッシュを利用
    refetchInterval: 1000 * 30, // 30秒ごとに自動更新
  })
}
