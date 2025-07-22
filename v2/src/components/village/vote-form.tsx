'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { apiClient } from '@/lib/api/client'
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
    },
    onError: (error) => {
      console.error('投票に失敗しました:', error)
    },
  })

  const handleVote = async () => {
    if (!selectedTargetId) return
    voteMutation.mutate(selectedTargetId)
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

        <Button
          onClick={handleVote}
          disabled={
            !selectedTargetId || voteMutation.isPending || voteSituation.targetList.length === 0
          }
          className="w-full"
        >
          {voteMutation.isPending ? '投票中...' : '投票する'}
        </Button>

        {voteMutation.isError && (
          <p className="text-sm text-red-600">投票に失敗しました。もう一度お試しください。</p>
        )}

        {voteMutation.isSuccess && <p className="text-sm text-green-600">投票をセットしました</p>}
      </CardContent>
    </Card>
  )
}
