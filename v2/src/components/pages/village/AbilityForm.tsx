'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { apiClient } from '@/lib/api/client'
import { validateAbility } from '@/lib/validation/action-validation'
import { parseAbilityError } from '@/lib/api/error-handler'
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
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [apiError, setApiError] = useState<string>('')

  const abilityMutation = useMutation({
    mutationFn: async (targetId?: number) => {
      const { data } = await apiClient.POST('/village/{villageId}/ability', {
        params: {
          path: { villageId },
        },
        body: {
          ability_type: ability.type.name,
          target_id: targetId,
        },
      })
      return data
    },
    onSuccess: () => {
      // 村情報を再取得
      queryClient.invalidateQueries({ queryKey: ['village', villageId] })
      queryClient.invalidateQueries({ queryKey: ['participate-situation', villageId.toString()] })
      // 成功時はAPIエラーをクリア
      setApiError('')
    },
    onError: (error) => {
      console.error('能力実行に失敗しました:', error)
      setApiError(parseAbilityError(error))
    },
  })

  const handleAbility = async () => {
    // バリデーション実行
    const validation = validateAbility(ability, selectedTargetId)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    // バリデーション成功時はエラーをクリア
    setValidationErrors([])
    setApiError('')

    if (ability.available_no_target) {
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
  const hasTargetList = ability.target_list && ability.target_list.length > 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{ability.type.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!ability.available_no_target && (
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
                  {ability.target_list.map((participant) => (
                    <option key={participant.id} value={participant.id.toString()}>
                      {participant.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </>
        )}

        {/* バリデーションエラー表示 */}
        {validationErrors.length > 0 && (
          <div className="space-y-1">
            {validationErrors.map((error, index) => (
              <p key={index} className="text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>
        )}

        <Button onClick={handleAbility} disabled={abilityMutation.isPending} className="w-full">
          {abilityMutation.isPending ? '実行中...' : `${ability.type.name}を実行`}
        </Button>

        {apiError && <p className="text-sm text-red-600">{apiError}</p>}

        {abilityMutation.isSuccess && (
          <p className="text-sm text-green-600">{ability.type.name}をセットしました</p>
        )}
      </CardContent>
    </Card>
  )
}
