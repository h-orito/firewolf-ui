/**
 * コミット・時短希望アクションコンポーネント
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api/client'
import { useQueryClient } from '@tanstack/react-query'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']
type SituationAsParticipantView = components['schemas']['SituationAsParticipantView']

interface CommitActionProps {
  /** 村情報 */
  village: VillageView
  /** ユーザー情報 */
  user: any
  /** 参加者としての状況 */
  situation: SituationAsParticipantView
  /** コミット変更完了時のコールバック */
  onCommitChanged?: () => void
}

/**
 * コミット・時短希望アクション
 *
 * 時短希望の設定・解除を行う機能
 */
export const CommitAction: React.FC<CommitActionProps> = ({
  village,
  user,
  situation,
  onCommitChanged,
}) => {
  const queryClient = useQueryClient()

  // フォーム状態
  const [isSubmitting, setIsSubmitting] = useState(false)

  // コミットが可能かどうかの確認
  const canCommit = situation.commit.available_commit || false
  const isCurrentlyCommitting = situation.commit.committing || false

  // コミットが利用できない場合は表示しない
  if (!canCommit) {
    return null
  }

  // コミット切り替え処理
  const handleToggleCommit = async () => {
    setIsSubmitting(true)

    try {
      // コミットAPIを呼び出し（暫定：実際のエンドポイントに応じて調整）
      const response = await fetch(`/api/village/${village.id}/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commit: !isCurrentlyCommitting, // 現在の状態を反転
        }),
      })

      if (!response.ok) {
        throw new Error('API呼び出しに失敗しました')
      }

      const data = await response.json()

      // 成功時の処理
      console.log('コミット更新成功:', data)

      // 村情報のキャッシュを無効化（最新の状況を反映）
      queryClient.invalidateQueries({
        queryKey: ['village', village.id],
      })

      // コールバック実行
      onCommitChanged?.()

      const action = !isCurrentlyCommitting ? '時短希望' : '時短希望取り消し'
      alert(`${action}を設定しました。`)
    } catch (error) {
      console.error('コミットエラー:', error)
      alert('コミット設定の変更に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
      <h4 className="font-medium text-blue-900">コミット（時短希望）</h4>

      {/* 現在のコミット状態表示 */}
      <div className="text-sm text-blue-700 bg-white p-3 rounded border">
        <div className="font-medium mb-2">現在の状態:</div>
        <div
          className={`font-semibold ${isCurrentlyCommitting ? 'text-green-600' : 'text-gray-600'}`}
        >
          {isCurrentlyCommitting ? '時短希望しています' : '時短希望していません'}
        </div>
      </div>

      {/* 切り替えボタン */}
      <div className="flex justify-end">
        <Button
          onClick={handleToggleCommit}
          disabled={isSubmitting}
          className={`${
            isCurrentlyCommitting
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting
            ? '処理中...'
            : isCurrentlyCommitting
              ? '時短希望を取り消す'
              : '時短希望する'}
        </Button>
      </div>

      {/* 説明 */}
      <div className="text-xs text-blue-600 bg-white p-2 rounded border">
        ※ 時短希望をすると、参加者全員が時短希望した場合に日付が早く進行します。
      </div>
    </div>
  )
}
