'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/types/generated/api'

type VillageCommitSituation = components['schemas']['VillageCommitSituation']

interface CommitFormProps {
  villageId: number
  commitSituation: VillageCommitSituation
}

export function CommitForm({ villageId, commitSituation }: CommitFormProps) {
  const queryClient = useQueryClient()

  const commitMutation = useMutation({
    mutationFn: async (commit: boolean) => {
      const { data } = await apiClient.POST('/village/{villageId}/commit', {
        params: {
          path: { villageId },
        },
        body: {
          commit,
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
      console.error('コミット処理に失敗しました:', error)
    },
  })

  const handleCommit = async (commit: boolean) => {
    commitMutation.mutate(commit)
  }

  if (!commitSituation.availableCommit) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>コミット</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">
            現在の状態: {commitSituation.committing ? 'コミット中' : 'コミットなし'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => handleCommit(true)}
            disabled={commitMutation.isPending}
            variant={commitSituation.committing ? 'default' : 'outline'}
            className="flex-1"
          >
            {commitMutation.isPending ? '処理中...' : 'コミット'}
          </Button>

          <Button
            onClick={() => handleCommit(false)}
            disabled={commitMutation.isPending}
            variant={!commitSituation.committing ? 'default' : 'outline'}
            className="flex-1"
          >
            {commitMutation.isPending ? '処理中...' : 'コミット解除'}
          </Button>
        </div>

        {commitMutation.isError && (
          <p className="text-sm text-red-600">
            コミット処理に失敗しました。もう一度お試しください。
          </p>
        )}

        {commitMutation.isSuccess && (
          <p className="text-sm text-green-600">コミット状態を更新しました</p>
        )}
      </CardContent>
    </Card>
  )
}
