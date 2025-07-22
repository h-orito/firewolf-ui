import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/types/generated/api'

type MessagesView = components['schemas']['MessagesView']
type VillageMessageForm = components['schemas']['VillageMessageForm']

export const useVillageMessagesQuery = (
  villageId: string,
  day: number,
  noonnight: string,
  form?: VillageMessageForm
) => {
  return useQuery<MessagesView>({
    queryKey: ['villageMessages', villageId, day, noonnight, form],
    queryFn: async () => {
      const { data, error } = await apiClient.GET(
        '/village/{villageId}/day/{day}/time/{noonnight}/message-list',
        {
          params: {
            path: {
              villageId: Number(villageId),
              day: Number(day),
              noonnight: noonnight,
            },
            query: { form: form ?? {} },
          },
        }
      )

      if (error) {
        throw new Error(`Failed to fetch messages for village ${villageId}`)
      }

      return data
    },
    staleTime: 1000 * 15, // 15秒間はキャッシュを利用
    refetchInterval: 1000 * 30, // 30秒ごとに自動更新
  })
}
