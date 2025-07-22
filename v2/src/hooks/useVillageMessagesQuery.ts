import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/types/generated/api'

type MessagesView = components['schemas']['MessagesView']
type VillageMessageForm = components['schemas']['VillageMessageForm']

export const useVillageMessagesQuery = (
  villageId: string,
  day: number,
  noonnight: string,
  form?: VillageMessageForm,
  villageStatus?: components['schemas']['VillageStatus']
) => {
  // 村の状態に応じてポーリング間隔を調整
  const getRefetchInterval = () => {
    if (!villageStatus) return false // 村情報がない場合はポーリングしない
    if (villageStatus.isFinished || villageStatus.isCanceled) return false // 終了した村はポーリングしない
    if (villageStatus.isPrologue) return 60000 // プロローグ中は60秒
    if (villageStatus.isProgress) return 20000 // 進行中は20秒
    if (villageStatus.isEpilogue) return 30000 // エピローグ中は30秒
    return false
  }

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
    staleTime: 1000 * 10, // 10秒間はキャッシュを利用
    refetchInterval: getRefetchInterval(),
    refetchIntervalInBackground: false, // バックグラウンドでは更新しない
  })
}
