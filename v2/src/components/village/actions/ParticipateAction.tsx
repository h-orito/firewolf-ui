/**
 * 入村アクションコンポーネント
 */

'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { ParticipateConfirmModal } from '../ParticipateConfirmModal'

// 動的インポートでコード分割
const CharacterSelectModal = dynamic(
  () => import('../CharacterSelectModal').then((mod) => ({ default: mod.CharacterSelectModal })),
  {
    ssr: false,
    loading: () => <div className="animate-pulse">読み込み中...</div>,
  }
)
import { useSkillsQuery } from '@/hooks/use-skills-query'
import { apiClient } from '@/lib/api/client'
import { useQueryClient } from '@tanstack/react-query'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']
type Chara = components['schemas']['Chara']
type Skill = components['schemas']['Skill']

interface ParticipateActionProps {
  /** 村情報 */
  village: VillageView
  /** ユーザー情報 */
  user: any
  /** 参加完了時のコールバック */
  onParticipated?: () => void
}

/**
 * 入村アクション
 *
 * キャラクター選択、役職希望選択、入村発言を含む
 * 入村処理を実装
 */
export const ParticipateAction: React.FC<ParticipateActionProps> = ({
  village,
  user,
  onParticipated,
}) => {
  const queryClient = useQueryClient()

  // モーダル表示状態
  const [showCharacterSelectModal, setShowCharacterSelectModal] = useState(false)
  const [showParticipateConfirmModal, setShowParticipateConfirmModal] = useState(false)

  // 選択状態
  const [selectedCharacter, setSelectedCharacter] = useState<Chara | null>(null)
  const [firstRequestSkill, setFirstRequestSkill] = useState<Skill | null>(null)
  const [secondRequestSkill, setSecondRequestSkill] = useState<Skill | null>(null)
  const [participateMessage, setParticipateMessage] = useState('')
  const [isParticipating, setIsParticipating] = useState(false)

  // スキル一覧を取得
  const { data: skillsData } = useSkillsQuery()
  const skills = skillsData?.list || []

  // 参加ボタンのハンドラー
  const handleJoinClick = () => {
    setShowCharacterSelectModal(true)
  }

  // キャラクター選択完了後の処理
  const handleCharacterSelected = (character: Chara) => {
    setSelectedCharacter(character)
    setShowCharacterSelectModal(false)

    // ここで役職希望選択や入村発言入力のUIを表示するか、
    // 直接確認モーダルを表示
    setShowParticipateConfirmModal(true)
  }

  // 入村確認完了後の処理
  const handleParticipateConfirmed = async () => {
    if (!selectedCharacter) return

    setIsParticipating(true)

    try {
      // 入村APIを呼び出し
      const { data, error } = await apiClient.POST('/village/{villageId}/participate', {
        params: {
          path: {
            villageId: village.id,
          },
        },
        body: {
          chara_id: selectedCharacter.id,
          chara_short_name: selectedCharacter.chara_name.short_name,
          chara_name: selectedCharacter.chara_name.name,
          first_request_skill: firstRequestSkill?.code || '',
          second_request_skill: secondRequestSkill?.code || '',
          join_message: participateMessage || '',
        },
      })

      // 成功時の処理（エラーハンドリングは上位で実行済み）

      // 成功時の処理
      // 村情報を再取得
      await queryClient.invalidateQueries({ queryKey: ['village', village.id] })
      await queryClient.invalidateQueries({ queryKey: ['village-participants', village.id] })

      // 状態をリセット
      setSelectedCharacter(null)
      setFirstRequestSkill(null)
      setSecondRequestSkill(null)
      setParticipateMessage('')
      setShowParticipateConfirmModal(false)

      // コールバック実行
      onParticipated?.()
    } catch (error) {
      console.error('入村エラー:', error)
      alert('入村処理中にエラーが発生しました。')
    } finally {
      setIsParticipating(false)
    }
  }

  // キャンセル処理
  const handleCancel = () => {
    setSelectedCharacter(null)
    setFirstRequestSkill(null)
    setSecondRequestSkill(null)
    setParticipateMessage('')
    setShowCharacterSelectModal(false)
    setShowParticipateConfirmModal(false)
  }

  // 既に参加している場合は表示しない
  const isAlreadyParticipant =
    user && village.participant.member_list.some((p) => p.player?.id === user.uid)
  const isAlreadySpectator =
    user && village.spectator.member_list.some((s) => s.player?.id === user.uid)

  if (isAlreadyParticipant || isAlreadySpectator) {
    return null
  }

  // 村が満員の場合
  const isFull = village.participant.count >= village.setting.capacity.max

  return (
    <>
      <div className="space-y-4">
        {/* 入村前のUI（役職希望選択など） */}
        {selectedCharacter && !showParticipateConfirmModal && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900">入村設定</h4>

            {/* 選択したキャラクター表示 */}
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-700">
                選択キャラクター: [{selectedCharacter.chara_name.short_name}]{' '}
                {selectedCharacter.chara_name.name}
              </div>
              <button
                onClick={() => setShowCharacterSelectModal(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                変更
              </button>
            </div>

            {/* 役職希望選択 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">第1希望役職</label>
              <select
                value={firstRequestSkill?.code || ''}
                onChange={(e) => {
                  const skill = skills.find((s) => s.code === e.target.value)
                  setFirstRequestSkill(skill || null)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択しない</option>
                {skills.map((skill) => (
                  <option key={skill.code} value={skill.code}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">第2希望役職</label>
              <select
                value={secondRequestSkill?.code || ''}
                onChange={(e) => {
                  const skill = skills.find((s) => s.code === e.target.value)
                  setSecondRequestSkill(skill || null)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!firstRequestSkill}
              >
                <option value="">選択しない</option>
                {skills
                  .filter((s) => s.code !== firstRequestSkill?.code)
                  .map((skill) => (
                    <option key={skill.code} value={skill.code}>
                      {skill.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* 入村発言入力 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">入村発言（任意）</label>
              <textarea
                value={participateMessage}
                onChange={(e) => setParticipateMessage(e.target.value)}
                placeholder="よろしくお願いします！"
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={200}
              />
              <div className="text-xs text-gray-500 text-right">
                {participateMessage.length}/200文字
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                キャンセル
              </Button>
              <Button
                onClick={() => setShowParticipateConfirmModal(true)}
                className="flex-1"
                disabled={!selectedCharacter}
              >
                入村確認へ
              </Button>
            </div>
          </div>
        )}

        {/* 初期状態の入村ボタン */}
        {!selectedCharacter && (
          <Button onClick={handleJoinClick} disabled={isFull || isParticipating} className="w-full">
            {isParticipating ? '入村処理中...' : isFull ? '村は満員です' : '村に参加する'}
          </Button>
        )}

        {/* 参加者数表示 */}
        <div className="text-xs text-gray-500 text-center">
          参加者: {village.participant.count} / {village.setting.capacity.max}
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

      {/* 入村確認モーダル */}
      {selectedCharacter && (
        <ParticipateConfirmModal
          isOpen={showParticipateConfirmModal}
          onClose={() => setShowParticipateConfirmModal(false)}
          onConfirmed={handleParticipateConfirmed}
          village={village}
          selectedCharacter={selectedCharacter}
          firstRequestSkill={firstRequestSkill || undefined}
          secondRequestSkill={secondRequestSkill || undefined}
          participateMessage={participateMessage}
        />
      )}
    </>
  )
}
