'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { apiClient } from '@/lib/api/client'
import { validateVote } from '@/lib/validation/action-validation'
import { parseVoteError } from '@/lib/api/error-handler'
import type { components } from '@/types/generated/api'

type VillageVoteSituation = components['schemas']['VillageVoteSituationView']

interface VoteFormProps {
  villageId: number
  voteSituation: VillageVoteSituation
}

export function VoteForm({ villageId, voteSituation }: VoteFormProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<number | undefined>(
    voteSituation.target?.id
  )
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [apiError, setApiError] = useState<string>('')
  const queryClient = useQueryClient()

  const voteMutation = useMutation({
    mutationFn: async (targetId: number) => {
      const { data } = await apiClient.POST('/village/{villageId}/vote', {
        params: {
          path: { villageId },
        },
        body: {
          targetId,
        },
      })
      return data
    },
    onSuccess: () => {
      // 村情報を再取得
      queryClient.invalidateQueries({ queryKey: ['village', villageId] })
      // 成功時はAPIエラーをクリア
      setApiError('')
    },
    onError: (error) => {
      console.error('投票に失敗しました:', error)
      setApiError(parseVoteError(error))
    },
  })

  const handleVote = async () => {
    // バリデーション実行
    const validation = validateVote(voteSituation, selectedTargetId)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    // バリデーション成功時はエラーをクリア
    setValidationErrors([])
    setApiError('')

    if (selectedTargetId) {
      voteMutation.mutate(selectedTargetId)
    }
  }

  if (!voteSituation.availableVote) {
    return null
  }

  const currentTargetName = voteSituation.target?.name || 'なし'

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>投票</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">現在のセット先: {currentTargetName}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">対象</label>
          <Select
            value={selectedTargetId?.toString() || ''}
            onChange={(e) => setSelectedTargetId(Number(e.target.value))}
            disabled={voteSituation.targetList.length === 0}
          >
            <option value="" disabled>
              投票先を選択してください
            </option>
            {voteSituation.targetList.map((participant) => (
              <option key={participant.id} value={participant.id.toString()}>
                {participant.name}
              </option>
            ))}
          </Select>
        </div>

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

        <Button onClick={handleVote} disabled={voteMutation.isPending} className="w-full">
          {voteMutation.isPending ? '投票中...' : '投票する'}
        </Button>

        {apiError && <p className="text-sm text-red-600">{apiError}</p>}

        {voteMutation.isSuccess && <p className="text-sm text-green-600">投票をセットしました</p>}
      </CardContent>
    </Card>
  )
}
