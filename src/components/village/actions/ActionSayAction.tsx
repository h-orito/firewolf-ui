'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { MessageConfirmModal } from '@/components/village/MessageConfirmModal'
import { usePostVillageMessageMutation } from '@/hooks/village/use-post-village-message-mutation'
import { VillageView } from '@/types/generated/api'
import { User } from 'firebase/auth'

interface ActionSayActionProps {
  village: VillageView
  user: User
  onMessagePosted?: () => void
}

export const ActionSayAction: React.FC<ActionSayActionProps> = ({
  village,
  user,
  onMessagePosted,
}) => {
  const [messageContent, setMessageContent] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const postMessageMutation = usePostVillageMessageMutation()

  // 参加者として村にいるかどうかの確認
  const participant = village.participant?.member_list?.find((p) => p.player?.id === user.uid)
  const isParticipant = !!participant

  // アクション発言が利用可能かどうかの確認
  const situationAsParticipant = participant?.situation
  const canUseActionSay = situationAsParticipant?.availableSayTypes?.includes('ACTION_SAY') || false

  // アクション発言が利用可能でない場合は表示しない
  if (!isParticipant || !canUseActionSay) {
    return null
  }

  // 発言送信処理
  const handleSubmitMessage = () => {
    if (!messageContent.trim()) return
    setShowConfirmModal(true)
  }

  // 確認モーダルでの確認完了処理
  const handleConfirmed = async () => {
    if (!messageContent.trim()) return

    setIsSubmitting(true)
    try {
      await postMessageMutation.mutateAsync({
        villageId: village.id,
        messageType: 'ACTION_SAY',
        content: messageContent.trim(),
      })

      // 成功時の処理
      setMessageContent('')
      setShowConfirmModal(false)
      onMessagePosted?.()
    } catch (error) {
      console.error('アクション発言投稿エラー:', error)
      alert('アクション発言の投稿に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  // キャンセル処理
  const handleCancel = () => {
    setShowConfirmModal(false)
  }

  // デコレーション挿入処理
  const handleDecorationClick = (tag: string) => {
    const textArea = document.querySelector(
      'textarea[data-action-say="true"]'
    ) as HTMLTextAreaElement
    if (!textArea) return

    const start = textArea.selectionStart
    const end = textArea.selectionEnd
    const selectedText = textArea.value.substring(start, end)

    let insertText = ''
    if (tag === 'ruby') {
      // ルビ専用の処理
      insertText = `[[ruby]]${selectedText || 'テキスト'}[[rt]]よみがな[[/rt]][[/ruby]]`
    } else {
      // 通常の装飾タグ
      insertText = `[[${tag}]]${selectedText || 'テキスト'}[[/${tag}]]`
    }

    const newText = textArea.value.substring(0, start) + insertText + textArea.value.substring(end)
    setMessageContent(newText)

    // カーソル位置を調整
    setTimeout(() => {
      if (selectedText) {
        textArea.setSelectionRange(start + insertText.length, start + insertText.length)
      } else {
        const newStart = tag === 'ruby' ? start + `[[ruby]]`.length : start + `[[${tag}]]`.length
        const newEnd = tag === 'ruby' ? newStart + 'テキスト'.length : newStart + 'テキスト'.length
        textArea.setSelectionRange(newStart, newEnd)
      }
      textArea.focus()
    }, 0)
  }

  // 現在のユーザー情報を取得（プレビュー用）
  const getCurrentUser = () => {
    return {
      characterName: participant?.chara?.chara_name?.name || 'キャラクター',
      characterImageUrl: '',
      playerName: participant?.player?.nickname || 'あなた',
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-orange-50 border-orange-200">
      <h4 className="font-medium text-orange-900">アクション発言</h4>
      <div className="text-sm text-orange-700 mb-3">
        ※ RP向けの機能です。推理発言として利用しないよう注意してください。
      </div>

      {/* デコレーションツールバー */}
      <div className="flex flex-wrap gap-2 p-2 bg-white rounded border">
        <div className="text-xs text-gray-600 mr-2">装飾:</div>
        {[
          { tag: 'b', label: '太字' },
          { tag: 'i', label: '斜体' },
          { tag: 'u', label: '下線' },
          { tag: 's', label: '取消' },
          { tag: 'large', label: '大' },
          { tag: 'small', label: '小' },
          { tag: 'ruby', label: 'ルビ' },
        ].map(({ tag, label }) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleDecorationClick(tag)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
          >
            {label}
          </button>
        ))}
      </div>

      {/* メッセージ入力 */}
      <div className="space-y-2">
        <Textarea
          data-action-say="true"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="アクション発言を入力してください..."
          rows={4}
          className="w-full"
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {messageContent.length} / 400文字
          </div>
          <Button
            onClick={handleSubmitMessage}
            disabled={!messageContent.trim() || isSubmitting}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isSubmitting ? '投稿中...' : 'アクション発言'}
          </Button>
        </div>
      </div>

      {/* 確認モーダル */}
      {showConfirmModal && (
        <MessageConfirmModal
          isOpen={showConfirmModal}
          onClose={handleCancel}
          onConfirm={handleConfirmed}
          messageType="ACTION_SAY"
          content={messageContent}
          user={getCurrentUser()}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}