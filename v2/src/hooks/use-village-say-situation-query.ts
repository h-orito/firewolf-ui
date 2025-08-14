import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/types/generated/api'
import { useAuth } from '@/hooks/useAuth'

type SituationAsParticipantView = components['schemas']['SituationAsParticipantView']
type VillageSaySituationView = components['schemas']['VillageSaySituationView']

export const useVillageSaySituationQuery = (villageId: string) => {
  const { isAuthenticated } = useAuth()

  return useQuery<VillageSaySituationView | null>({
    queryKey: ['village-say-situation', villageId],
    queryFn: async () => {
      if (!isAuthenticated) {
        return null
      }

      const { data, error } = await apiClient.GET('/village/{villageId}/situation', {
        params: {
          path: { villageId: Number(villageId) },
        },
      })

      // エラーはより上位でハンドリング済み

      return data?.say ?? null
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30秒間はキャッシュを利用
    refetchInterval: 1000 * 60, // 1分ごとに自動更新
  })
}
