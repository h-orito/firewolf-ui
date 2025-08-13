/**
 * 能力行使機能用のカスタムフック
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { components } from '@/types/generated/api'

type VillageAbilityBody = components['schemas']['VillageAbilityBody']

interface AbilityParams {
  villageId: number
  myselfId?: number
  targetId?: number
  abilityType: string
}

/**
 * 能力行使APIを呼び出すカスタムフック
 */
export const useAbilityMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ villageId, myselfId, targetId, abilityType }: AbilityParams) => {
      const response = await fetch(`/api/village/${villageId}/ability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          myself_id: myselfId,
          target_id: targetId,
          ability_type: abilityType,
        } as VillageAbilityBody),
      })

      if (!response.ok) {
        throw new Error('能力行使に失敗しました')
      }

      return response
    },
    onSuccess: (_, { villageId }) => {
      // 能力行使後は村情報と参加者情報を再取得
      queryClient.invalidateQueries({ queryKey: ['village', villageId] })
      queryClient.invalidateQueries({ queryKey: ['village-participants', villageId] })
    },
    onError: (error) => {
      console.error('能力行使エラー:', error)
    },
  })
}
