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

  if (abilitySituations.list.length === 0) {
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
  const [selectedAttackerId, setSelectedAttackerId] = useState<number | undefined>(
    ability.attacker?.id
  )
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
          myself_id: selectedAttackerId,
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
  const currentAttackerName = ability.attacker?.name || 'なし'
  const hasTargetList = ability.target_list.length > 0
  const hasAttackerList = ability.attacker_list.length > 0
  const isAttackAbility = ability.type.code === 'ATTACK' || ability.type.code === 'BITE'

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{ability.type.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 襲撃担当者設定（人狼系の襲撃能力のみ） */}
        {isAttackAbility && hasAttackerList && (
          <>
            <div>
              <p className="text-sm text-gray-600">現在の襲撃担当者: {currentAttackerName}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">襲撃担当者</label>
              <Select
                value={selectedAttackerId?.toString() || ''}
                onChange={(e) => setSelectedAttackerId(Number(e.target.value))}
              >
                <option value="" disabled>
                  襲撃担当者を選択してください
                </option>
                {ability.attacker_list.map((participant) => (
                  <option key={participant.id} value={participant.id.toString()}>
                    {participant.name}
                  </option>
                ))}
              </Select>
            </div>
          </>
        )}

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
          <>
            <p className="text-sm text-green-600">{ability.type.name}をセットしました</p>
            {isAttackAbility && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <span className="text-sm text-red-800 font-medium">
                    襲撃を実行しました。対象が死亡する可能性があります。
                  </span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  ※ 護衛や特殊能力により、襲撃が失敗する場合があります。
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
