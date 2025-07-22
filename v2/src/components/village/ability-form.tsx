'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/types/generated/api'

type VillageAbilitySituationsView = components['schemas']['VillageAbilitySituationsView']
type VillageAbilitySituationView = components['schemas']['VillageAbilitySituationView']

interface AbilityFormProps {
  villageId: number
  abilitySituations: VillageAbilitySituationsView
}

export function AbilityForm({ villageId, abilitySituations }: AbilityFormProps) {
  const queryClient = useQueryClient()

  if (!abilitySituations.list || abilitySituations.list.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {abilitySituations.list.map((ability, index) => (
        <AbilityCard
          key={`${ability.type.name}-${index}`}
          villageId={villageId}
          ability={ability}
          queryClient={queryClient}
        />
      ))}
    </div>
  )
}

interface AbilityCardProps {
  villageId: number
  ability: VillageAbilitySituationView
  queryClient: any
}

function AbilityCard({ villageId, ability, queryClient }: AbilityCardProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<number | undefined>(ability.target?.id)

  const abilityMutation = useMutation({
    mutationFn: async (targetId?: number) => {
      const { data } = await apiClient.POST('/village/{villageId}/ability', {
        params: {
          path: { villageId },
        },
        body: {
          abilityType: ability.type.name,
          targetId,
        },
      })
      return data
    },
    onSuccess: () => {
      // 村情報を再取得
      queryClient.invalidateQueries({ queryKey: ['village', villageId] })
      queryClient.invalidateQueries({ queryKey: ['participate-situation', villageId.toString()] })
    },
    onError: (error) => {
      console.error('能力実行に失敗しました:', error)
    },
  })

  const handleAbility = async () => {
    if (!ability.usable) return

    if (ability.availableNoTarget) {
      // 対象不要の能力
      abilityMutation.mutate(undefined)
    } else if (selectedTargetId) {
      // 対象が必要な能力
      abilityMutation.mutate(selectedTargetId)
    }
  }

  if (!ability.usable) {
    return null
  }

  const currentTargetName = ability.target?.name || 'なし'
  const hasTargetList = ability.targetList && ability.targetList.length > 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{ability.type.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!ability.availableNoTarget && (
          <>
            <div>
              <p className="text-sm text-gray-600">現在のセット先: {currentTargetName}</p>
            </div>

            {hasTargetList && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">対象</label>
                <Select
                  value={selectedTargetId?.toString() || ''}
                  onChange={(e) => setSelectedTargetId(Number(e.target.value))}
                  disabled={!hasTargetList}
                >
                  <option value="" disabled>
                    対象を選択してください
                  </option>
                  {ability.targetList.map((participant) => (
                    <option key={participant.id} value={participant.id.toString()}>
                      {participant.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </>
        )}

        <Button
          onClick={handleAbility}
          disabled={
            !ability.usable ||
            abilityMutation.isPending ||
            (!ability.availableNoTarget && !selectedTargetId && hasTargetList)
          }
          className="w-full"
        >
          {abilityMutation.isPending ? '実行中...' : `${ability.type.name}を実行`}
        </Button>

        {abilityMutation.isError && (
          <p className="text-sm text-red-600">能力実行に失敗しました。もう一度お試しください。</p>
        )}

        {abilityMutation.isSuccess && (
          <p className="text-sm text-green-600">{ability.type.name}をセットしました</p>
        )}
      </CardContent>
    </Card>
  )
}
