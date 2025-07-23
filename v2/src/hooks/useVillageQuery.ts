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
    refetchInterval: (query) => {
      // 村の状態に応じてポーリング間隔を調整
      if (!query.state.data) return 60000 // データがない場合は60秒
      const data = query.state.data
      if (data.status.is_finished || data.status.is_canceled) return false // 終了した村はポーリングしない
      if (data.status.is_prologue) return 120000 // プロローグ中は2分
      if (data.status.is_progress) return 60000 // 進行中は1分
      if (data.status.is_epilogue) return 120000 // エピローグ中は2分
      return false
    },
    refetchIntervalInBackground: false, // バックグラウンドでは更新しない
  })
}
