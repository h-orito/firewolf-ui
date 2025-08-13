/**
 * 村建て専用アクションコンポーネント
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { useSubmitCreatorSayMutation, useCreatorActionMutation } from '@/hooks/village'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface CreatorActionsProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
}

/**
 * 村建て専用アクション
 *
 * 村建て発言、村設定変更、強制退村、廃村、エピローグ延長などの機能を提供
 */
export const CreatorActions: React.FC<CreatorActionsProps> = ({ village, user }) => {
  const [creatorMessage, setCreatorMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [actionType, setActionType] = useState<
    'message' | 'force_leave' | 'destroy' | 'extend_epilogue'
  >('message')
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)

  // API mutation hooks
  const creatorSayMutation = useSubmitCreatorSayMutation()
  const creatorActionMutation = useCreatorActionMutation()

  // 村建て権限チェック
  const isCreator = user && village.creator_player?.id === user.uid

  // 文字数制限（最大40行400文字）
  const maxLength = 400
  const maxLines = 40
  const currentLines = creatorMessage.split('\n').length

  // ローディング状態
  const isLoading = creatorSayMutation.isPending || creatorActionMutation.isPending

  const handleCreatorMessage = () => {
    if (!creatorMessage.trim()) return
    if (creatorMessage.length > maxLength) return
    if (currentLines > maxLines) return

    setActionType('message')
    setShowConfirmDialog(true)
  }

  const handleForceLeave = (playerId: number) => {
    setSelectedPlayerId(playerId)
    setActionType('force_leave')
    setShowConfirmDialog(true)
  }

  const handleDestroyVillage = () => {
    setActionType('destroy')
    setShowConfirmDialog(true)
  }

  const handleExtendEpilogue = () => {
    setActionType('extend_epilogue')
    setShowConfirmDialog(true)
  }

  const executeAction = async () => {
    try {
      switch (actionType) {
        case 'message':
          // 村建て発言API呼び出し
          const sayResult = await creatorSayMutation.mutateAsync({
            villageId: village.id,
            message: creatorMessage,
          })
          if (sayResult.success) {
            setCreatorMessage('')
          } else {
            alert(`村建て発言に失敗しました: ${sayResult.error?.message || '不明なエラー'}`)
          }
          break
        case 'force_leave':
          if (!selectedPlayerId) return
          // 強制退村API呼び出し
          const forceLeaveResult = await creatorActionMutation.mutateAsync({
            villageId: village.id,
            actionType: 'force_leave',
            targetPlayerId: selectedPlayerId,
          })
          if (!forceLeaveResult.success) {
            alert(`強制退村に失敗しました: ${forceLeaveResult.error?.message || '不明なエラー'}`)
          }
          break
        case 'destroy':
          // 廃村API呼び出し
          const destroyResult = await creatorActionMutation.mutateAsync({
            villageId: village.id,
            actionType: 'destroy',
          })
          if (!destroyResult.success) {
            alert(`廃村に失敗しました: ${destroyResult.error?.message || '不明なエラー'}`)
          }
          break
        case 'extend_epilogue':
          // エピローグ延長API呼び出し
          const extendResult = await creatorActionMutation.mutateAsync({
            villageId: village.id,
            actionType: 'extend_epilogue',
          })
          if (!extendResult.success) {
            alert(`エピローグ延長に失敗しました: ${extendResult.error?.message || '不明なエラー'}`)
          }
          break
      }
    } catch (error) {
      console.error('アクション実行エラー:', error)
      alert(
        `アクション実行中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`
      )
    } finally {
      setShowConfirmDialog(false)
      setSelectedPlayerId(null)
    }
  }

  const getConfirmMessage = () => {
    switch (actionType) {
      case 'message':
        return `以下の村建て発言を投稿しますか？\n\n${creatorMessage}`
      case 'force_leave':
        const player = village.participant?.member_list?.find(
          (p) => p.player?.id === selectedPlayerId
        )
        return `${player?.player?.nickname || '不明なプレイヤー'}を強制退村させますか？`
      case 'destroy':
        return '本当に村を廃村しますか？この操作は取り消せません。'
      case 'extend_epilogue':
        return 'エピローグを延長しますか？'
      default:
        return '実行しますか？'
    }
  }

  if (!isCreator) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* 村建て発言 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">村建て発言</h4>
        <div className="space-y-2">
          <Textarea
            value={creatorMessage}
            onChange={(e) => setCreatorMessage(e.target.value)}
            placeholder="村建て発言を入力してください..."
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-between items-center text-sm">
            <span
              className={`${creatorMessage.length > maxLength ? 'text-red-500' : 'text-gray-500'}`}
            >
              {creatorMessage.length}/{maxLength}文字
            </span>
            <span className={`${currentLines > maxLines ? 'text-red-500' : 'text-gray-500'}`}>
              {currentLines}/{maxLines}行
            </span>
          </div>
          <Button
            onClick={handleCreatorMessage}
            disabled={
              !creatorMessage.trim() ||
              creatorMessage.length > maxLength ||
              currentLines > maxLines ||
              isLoading
            }
            className="w-full"
          >
            {isLoading ? '投稿中...' : '村建て発言を投稿'}
          </Button>
        </div>
      </div>

      {/* 村設定変更 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">村設定</h4>
        <Button
          onClick={() => {
            // 村設定変更ページへのリンク
            window.open(`/village/create?edit=${village.id}`, '_blank')
          }}
          variant="outline"
          className="w-full"
        >
          村設定を変更
        </Button>
      </div>

      {/* 参加者管理 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">参加者管理</h4>
        <div className="space-y-2">
          {village.participant?.member_list?.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{participant.chara?.chara_name?.name}</span>
                <span className="text-xs text-gray-500">({participant.player?.nickname})</span>
              </div>
              <Button
                onClick={() => handleForceLeave(participant.player?.id || 0)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                disabled={isLoading}
              >
                {isLoading ? '処理中...' : '強制退村'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 村管理 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">村管理</h4>
        <div className="space-y-2">
          <Button
            onClick={handleExtendEpilogue}
            variant="outline"
            className="w-full"
            disabled={village.status?.code !== 'EPILOGUE' || isLoading}
          >
            {isLoading ? '処理中...' : 'エピローグ延長'}
          </Button>
          <Button
            onClick={handleDestroyVillage}
            variant="outline"
            className="w-full text-red-600 hover:text-red-700 border-red-300"
            disabled={isLoading}
          >
            {isLoading ? '処理中...' : '村を廃村'}
          </Button>
        </div>
      </div>

      {/* 確認ダイアログ */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 whitespace-pre-line">{getConfirmMessage()}</p>
            <div className="flex space-x-2 justify-end">
              <Button onClick={() => setShowConfirmDialog(false)} variant="outline">
                キャンセル
              </Button>
              <Button
                onClick={executeAction}
                className={actionType === 'destroy' ? 'bg-red-600 hover:bg-red-700' : ''}
                disabled={isLoading}
              >
                {isLoading ? '実行中...' : '実行'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
