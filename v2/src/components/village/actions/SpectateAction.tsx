/**
 * 見学アクションコンポーネント
 */

'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'

// 動的インポートでコード分割
const CharacterSelectModal = dynamic(
  () => import('../CharacterSelectModal').then((mod) => ({ default: mod.CharacterSelectModal })),
  {
    ssr: false,
    loading: () => <div className="animate-pulse">読み込み中...</div>,
  }
)
import { apiClient } from '@/lib/api/client'
import { useQueryClient } from '@tanstack/react-query'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']
type Chara = components['schemas']['Chara']

interface SpectateActionProps {
  /** 村情報 */
  village: VillageView
  /** ユーザー情報 */
  user: any
  /** 見学開始時のコールバック */
  onSpectated?: () => void
}

/**
 * 見学アクション
 *
 * キャラクター選択と見学発言を含む
 * 見学処理を実装
 */
export const SpectateAction: React.FC<SpectateActionProps> = ({ village, user, onSpectated }) => {
  const queryClient = useQueryClient()

  // モーダル表示状態
  const [showCharacterSelectModal, setShowCharacterSelectModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // 選択状態
  const [selectedCharacter, setSelectedCharacter] = useState<Chara | null>(null)
  const [spectateMessage, setSpectateMessage] = useState('')
  const [isSpectating, setIsSpectating] = useState(false)

  // 見学ボタンのハンドラー
  const handleSpectateClick = () => {
    setShowCharacterSelectModal(true)
  }

  // キャラクター選択完了後の処理
  const handleCharacterSelected = (character: Chara) => {
    setSelectedCharacter(character)
    setShowCharacterSelectModal(false)
    setShowConfirmDialog(true)
  }

  // 見学開始処理
  const handleSpectateConfirmed = async () => {
    if (!selectedCharacter) return

    setIsSpectating(true)

    try {
      // 見学API（現在は未実装のため、仮のメッセージ表示）
      // TODO: 実際の見学APIエンドポイントが実装されたら置き換える
      console.log('見学API呼び出し（未実装）', {
        villageId: village.id,
        characterId: selectedCharacter.id,
        spectateMessage: spectateMessage,
      })

      // 仮の成功処理
      alert('見学機能は現在開発中です。')
      setIsSpectating(false)
      handleCancel()
      return

      // 成功時の処理
      // 村情報を再取得
      await queryClient.invalidateQueries({ queryKey: ['village', village.id] })
      await queryClient.invalidateQueries({ queryKey: ['village-participants', village.id] })

      // 状態をリセット
      setSelectedCharacter(null)
      setSpectateMessage('')
      setShowConfirmDialog(false)

      // コールバック実行
      onSpectated?.()
    } catch (error) {
      console.error('見学エラー:', error)
      alert('見学処理中にエラーが発生しました。')
    } finally {
      setIsSpectating(false)
    }
  }

  // キャンセル処理
  const handleCancel = () => {
    setSelectedCharacter(null)
    setSpectateMessage('')
    setShowCharacterSelectModal(false)
    setShowConfirmDialog(false)
  }

  // 既に参加している場合は表示しない
  const isAlreadyParticipant =
    user && village.participant?.member_list?.some((p) => p.player?.id === user.uid)
  const isAlreadySpectator =
    user && village.spectator?.member_list?.some((s) => s.player?.id === user.uid)

  if (isAlreadyParticipant || isAlreadySpectator) {
    return null
  }

  return (
    <>
      <div className="space-y-4">
        {/* 見学前のUI */}
        {selectedCharacter && showConfirmDialog && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900">見学設定</h4>

            {/* 選択したキャラクター表示 */}
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-700">
                選択キャラクター: [{selectedCharacter.chara_name.short_name}]{' '}
                {selectedCharacter.chara_name.name}
              </div>
              <button
                onClick={() => {
                  setShowConfirmDialog(false)
                  setShowCharacterSelectModal(true)
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                変更
              </button>
            </div>

            {/* 見学発言入力 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">見学発言（任意）</label>
              <textarea
                value={spectateMessage}
                onChange={(e) => setSpectateMessage(e.target.value)}
                placeholder="見学させていただきます"
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={200}
              />
              <div className="text-xs text-gray-500 text-right">
                {spectateMessage.length}/200文字
              </div>
            </div>

            {/* 確認メッセージ */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                見学者は村の進行を観戦できますが、ゲームには参加できません。
              </p>
            </div>

            {/* アクションボタン */}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                キャンセル
              </Button>
              <Button
                onClick={handleSpectateConfirmed}
                className="flex-1"
                disabled={!selectedCharacter || isSpectating}
              >
                {isSpectating ? '見学開始中...' : '見学を開始'}
              </Button>
            </div>
          </div>
        )}

        {/* 初期状態の見学ボタン */}
        {!selectedCharacter && (
          <Button
            variant="outline"
            onClick={handleSpectateClick}
            disabled={isSpectating}
            className="w-full"
          >
            {isSpectating ? '見学処理中...' : '見学する'}
          </Button>
        )}

        {/* 見学者数表示 */}
        <div className="text-xs text-gray-500 text-center">
          見学者: {village.spectator?.count || 0}人
        </div>
      </div>

      {/* キャラクター選択モーダル */}
      <CharacterSelectModal
        isOpen={showCharacterSelectModal}
        onClose={() => setShowCharacterSelectModal(false)}
        onSelect={handleCharacterSelected}
        village={village}
        selectedCharacterId={selectedCharacter?.id}
      />
    </>
  )
}
