'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { apiClient } from '@/lib/api/client'
import { validateCommit } from '@/lib/validation/action-validation'
import { parseCommitError } from '@/lib/api/error-handler'
import type { components } from '@/types/generated/api'

type VillageCommitSituation = components['schemas']['VillageCommitSituation']

interface CommitFormProps {
  villageId: number
  commitSituation: VillageCommitSituation
}

export function CommitForm({ villageId, commitSituation }: CommitFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [apiError, setApiError] = useState<string>('')
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
      // 成功時はAPIエラーをクリア
      setApiError('')
    },
    onError: (error) => {
      console.error('コミット処理に失敗しました:', error)
      setApiError(parseCommitError(error))
    },
  })

  const handleCommit = async (commit: boolean) => {
    // バリデーション実行
    const validation = validateCommit(commitSituation)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    // バリデーション成功時はエラーをクリア
    setValidationErrors([])
    setApiError('')

    commitMutation.mutate(commit)
  }

  if (!commitSituation.available_commit) {
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

        {apiError && <p className="text-sm text-red-600">{apiError}</p>}

        {commitMutation.isSuccess && (
          <p className="text-sm text-green-600">コミット状態を更新しました</p>
        )}
      </CardContent>
    </Card>
  )
}
