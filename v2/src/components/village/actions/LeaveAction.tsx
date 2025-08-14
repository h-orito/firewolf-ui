/**
 * 退村アクションコンポーネント
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { apiClient } from '@/lib/api/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParticipateSituationQuery } from '@/hooks/use-participate-situation-query'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface LeaveActionProps {
  /** 村情報 */
  village: VillageView
  /** ユーザー情報 */
  user: any
  /** 退村完了時のコールバック */
  onLeft?: () => void
}

/**
 * 退村アクション
 *
 * 確認ダイアログを表示してから退村処理を実行
 */
export const LeaveAction: React.FC<LeaveActionProps> = ({ village, user, onLeft }) => {
  const queryClient = useQueryClient()

  // モーダル表示状態
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  // 参加状況を取得
  const { data: participateSituation } = useParticipateSituationQuery(village.id.toString())

  // 退村処理
  const handleLeave = async () => {
    setIsLeaving(true)

    try {
      // 退村APIを呼び出し
      const { data, error } = await apiClient.POST('/village/{villageId}/leave', {
        params: {
          path: {
            villageId: village.id,
          },
        },
      })

      // 成功時の処理（エラーハンドリングは上位で実行済み）

      // 成功時の処理
      // 村情報を再取得
      await queryClient.invalidateQueries({ queryKey: ['village', village.id] })
      await queryClient.invalidateQueries({ queryKey: ['village-participants', village.id] })

      // モーダルを閉じる
      setShowConfirmDialog(false)

      // コールバック実行
      onLeft?.()
    } catch (error) {
      console.error('退村エラー:', error)
      alert('退村処理中にエラーが発生しました。')
    } finally {
      setIsLeaving(false)
    }
  }

  // 退村可能かどうかを確認
  const isParticipant =
    user && village.participant.member_list.some((p) => p.player?.id === user.uid)
  const canLeave = participateSituation?.participate.available_leave

  // 参加状況がロード中、参加者でない、または退村不可能な場合は表示しない
  if (!participateSituation || !isParticipant || !canLeave) {
    return null
  }

  return (
    <>
      {/* 退村ボタン */}
      <Button
        variant="outline"
        onClick={() => setShowConfirmDialog(true)}
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        disabled={isLeaving}
      >
        {isLeaving ? '退村処理中...' : '村から退村する'}
      </Button>

      {/* 確認ダイアログ */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>退村の確認</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                <strong>{village.name}</strong> から退村しますか？
              </p>
              <p className="text-red-600 text-sm">
                ⚠️ 退村すると、この村での発言や投票などの行動はすべて失われます。
              </p>
              <p className="text-red-600 text-sm">この操作は取り消すことができません。</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLeaving}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleLeave}
              disabled={isLeaving}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLeaving ? '退村処理中...' : '退村する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
