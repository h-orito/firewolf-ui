/**
 * 投票機能用のカスタムフック
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { components } from '@/types/generated/api'

type VillageVoteBody = components['schemas']['VillageVoteBody']

interface VoteParams {
  villageId: number
  targetId: number
}

/**
 * 投票APIを呼び出すカスタムフック
 */
export const useVoteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ villageId, targetId }: VoteParams) => {
      const response = await fetch(`/api/village/${villageId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_id: targetId,
        } as VillageVoteBody),
      })

      if (!response.ok) {
        throw new Error('投票に失敗しました')
      }

      return response
    },
    onSuccess: (_, { villageId }) => {
      // 投票後は村情報と参加者情報を再取得
      queryClient.invalidateQueries({ queryKey: ['village', villageId] })
      queryClient.invalidateQueries({ queryKey: ['village-participants', villageId] })
    },
    onError: (error) => {
      console.error('投票エラー:', error)
    },
  })
}
