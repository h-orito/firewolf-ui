'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api/client'
import { handleApiError } from '@/lib/api/error-handler'
import type { components } from '@/types/generated/api'

type Village = components['schemas']['VillageView']
type VillageParticipateSituation = components['schemas']['VillageParticipateSituationView']

interface LeaveFormProps {
  village: Village
  participateSituation: VillageParticipateSituation
}

export function LeaveForm({ village, participateSituation }: LeaveFormProps) {
  const queryClient = useQueryClient()
  const [showConfirm, setShowConfirm] = useState(false)

  // 退村実行のミューテーション
  const leaveMutation = useMutation({
    mutationFn: async () => {
      await apiClient.POST('/village/{villageId}/leave', {
        params: { path: { villageId: village.id } },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['village', village.id.toString()] })
      queryClient.invalidateQueries({ queryKey: ['participate-situation', village.id.toString()] })
      setShowConfirm(false)
    },
    onError: handleApiError,
  })

  if (!participateSituation.available_leave) {
    return null
  }

  if (showConfirm) {
    return (
      <Card className="p-6 border-red-200">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-600">退村確認</h3>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700 mb-2">
              <strong>注意:</strong> 一度退村すると、再度この村に参加することはできません。
            </p>
            <p className="text-sm text-red-600">本当に退村しますか？</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={() => leaveMutation.mutate()}
              disabled={leaveMutation.isPending}
              className="flex-1"
            >
              {leaveMutation.isPending ? '退村中...' : '退村する'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={leaveMutation.isPending}
            >
              キャンセル
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-red-200">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">退村</h3>
        <p className="text-sm text-gray-600">
          この村から退村します。一度退村すると再参加はできません。
        </p>
        <Button variant="danger" onClick={() => setShowConfirm(true)} className="w-full">
          退村する
        </Button>
      </div>
    </Card>
  )
}
