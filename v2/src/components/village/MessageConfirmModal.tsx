'use client'

import { useState, useEffect, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { MessageContent } from './main/MessageContent'
import { CharacterIcon } from '@/components/common/CharacterIcon'
import { useSubmitVillageMessageMutation } from '@/hooks/village/use-post-village-message-mutation'
import { useUserSettingsStore } from '@/stores/village/user-settings-store'
import { MESSAGE_TYPE_CODE, type MessageTypeCode } from '@/types/village'
import type { components } from '@/types/generated/api'

type MessageType = components['schemas']['MessageType']

type VillageView = components['schemas']['VillageView']

interface MessagePreview {
  content: string
  messageType: MessageTypeCode
  characterName: string
  characterImageUrl?: string
  playerName: string
}

interface MessageConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmed: () => void
  village: VillageView
  preview: MessagePreview
}

export const MessageConfirmModal: React.FC<MessageConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmed,
  village,
  preview,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ユーザー設定から確認ダイアログ表示設定を取得
  const { operation } = useUserSettingsStore()

  // 発言投稿ミューテーション
  const submitMessageMutation = useSubmitVillageMessageMutation()

  // 発言種別の表示名とスタイリング
  const messageTypeInfo = useMemo(() => {
    const typeMap: Record<
      MessageTypeCode,
      { label: string; icon: string; bgColor: string; borderColor: string }
    > = {
      NORMAL_SAY: {
        label: '通常発言',
        icon: 'fa-comment',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      },
      WEREWOLF_SAY: {
        label: '人狼の囁き',
        icon: 'fa-paw',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      },
      SYMPATHIZE_SAY: {
        label: '共鳴発言',
        icon: 'fa-wave-square',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
      },
      GRAVE_SAY: {
        label: '死者の呻き',
        icon: 'fa-skull',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-200',
      },
      MONOLOGUE_SAY: {
        label: '独り言',
        icon: 'fa-comment-dots',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      },
      SPECTATE_SAY: {
        label: '見学発言',
        icon: 'fa-eye',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
      },
      ACTION_SAY: {
        label: 'アクション発言',
        icon: 'fa-theater-masks',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
      },
      SYSTEM_MESSAGE: {
        label: 'システム',
        icon: 'fa-cog',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      },
      PRIVATE_SYSTEM: {
        label: 'プライベート',
        icon: 'fa-lock',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      },
      PARTICIPANTS: {
        label: '参加者',
        icon: 'fa-users',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      },
      PSYCHIC_MESSAGE: {
        label: '占い結果',
        icon: 'fa-crystal-ball',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
      },
      HUNTER_MESSAGE: {
        label: '狩人結果',
        icon: 'fa-shield-alt',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      },
    }
    return typeMap[preview.messageType]
  }, [preview.messageType])

  // メッセージ制限を確認
  const messageLimit = useMemo(() => {
    // 暫定実装：デフォルト値を使用
    // 実際のAPIからの制限値取得は将来的な実装で対応
    switch (preview.messageType) {
      case MESSAGE_TYPE_CODE.NORMAL_SAY:
        return { maxLength: 400, maxLengthPerDay: 2000 }
      case MESSAGE_TYPE_CODE.WEREWOLF_SAY:
        return { maxLength: 400, maxLengthPerDay: 1600 }
      case MESSAGE_TYPE_CODE.SYMPATHIZE_SAY:
        return { maxLength: 400, maxLengthPerDay: 1600 }
      case MESSAGE_TYPE_CODE.GRAVE_SAY:
        return { maxLength: 400, maxLengthPerDay: 1600 }
      case MESSAGE_TYPE_CODE.MONOLOGUE_SAY:
        return { maxLength: 200, maxLengthPerDay: 1000 }
      case MESSAGE_TYPE_CODE.SPECTATE_SAY:
        return { maxLength: 200, maxLengthPerDay: 1000 }
      default:
        return { maxLength: 400, maxLengthPerDay: 2000 }
    }
  }, [preview.messageType])

  // 文字数チェック
  const contentLength = preview.content.length
  const isOverLimit = contentLength > messageLimit.maxLength
  const isNearLimit = contentLength > messageLimit.maxLength * 0.9

  // 確認設定に応じてモーダル表示をスキップする場合の処理
  useEffect(() => {
    if (isOpen && !operation.showConfirmDialog && !isOverLimit) {
      // 確認ダイアログ無効 & 文字数制限内の場合は即座に送信
      handleConfirm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, operation.showConfirmDialog, isOverLimit])

  // 送信処理
  const handleConfirm = async () => {
    if (isOverLimit) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitMessageMutation.mutateAsync({
        villageId: village.id!,
        message: preview.content,
        messageType: preview.messageType,
        faceType: 'NORMAL', // 仮の固定値
      })

      if (result.success) {
        onConfirmed()
        onClose()
      } else {
        setError(result.error?.message || '発言の投稿に失敗しました')
      }
    } catch (err) {
      setError('発言の投稿に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  // キャンセル処理
  const handleCancel = () => {
    if (!isSubmitting) {
      setError(null)
      onClose()
    }
  }

  // ESCキーでのキャンセル処理
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        handleCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isSubmitting])

  // モーダル非表示時は何も表示しない
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="発言内容の確認" className="!max-w-4xl">
      <div className="space-y-6">
        {/* 発言種別表示 */}
        <div
          className={`p-3 rounded-lg ${messageTypeInfo.bgColor} ${messageTypeInfo.borderColor} border`}
        >
          <div className="flex items-center space-x-2">
            <i className={`fas ${messageTypeInfo.icon} text-lg`}></i>
            <span className="text-sm font-medium text-gray-700">{messageTypeInfo.label}</span>
          </div>
        </div>

        {/* プレビュー表示 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">発言プレビュー</h3>

          {/* メッセージカード */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            {/* キャラクター情報 */}
            <div className="flex items-start space-x-3 mb-3">
              <CharacterIcon
                characterName={{
                  name: preview.characterName,
                  short_name: preview.characterName,
                  full_name: preview.characterName,
                }}
                size={0.375}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{preview.characterName}</div>
                <div className="text-xs text-gray-500">{preview.playerName}</div>
              </div>
            </div>

            {/* メッセージ内容（デコレーション適用済み） */}
            <div className="text-sm text-gray-800">
              <MessageContent
                text={preview.content}
                villageId={village.id!}
                onAnchorClick={() => {}}
              />
            </div>
          </div>
        </div>

        {/* 文字数情報 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">文字数</span>
            <span
              className={`${
                isOverLimit
                  ? 'text-red-600 font-medium'
                  : isNearLimit
                    ? 'text-amber-600'
                    : 'text-gray-600'
              }`}
            >
              {contentLength} / {messageLimit.maxLength}
            </span>
          </div>

          {isOverLimit && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
              <i className="fas fa-exclamation-triangle text-red-500 mr-1"></i>
              文字数制限を超えています。内容を短くしてください。
            </div>
          )}

          {isNearLimit && !isOverLimit && (
            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              <i className="fas fa-exclamation-triangle text-yellow-500 mr-1"></i>
              文字数制限に近づいています。
            </div>
          )}
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* 操作ボタン */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isOverLimit || isSubmitting}
            className="min-w-24"
          >
            {isSubmitting ? '送信中...' : '発言する'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
