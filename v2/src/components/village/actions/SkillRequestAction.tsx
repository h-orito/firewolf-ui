/**
 * 役職希望変更アクションコンポーネント
 */

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api/client'
import { useQueryClient } from '@tanstack/react-query'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']
type Skill = components['schemas']['Skill']
type SituationAsParticipantView = components['schemas']['SituationAsParticipantView']

interface SkillRequestActionProps {
  /** 村情報 */
  village: VillageView
  /** ユーザー情報 */
  user: any
  /** 参加者としての状況 */
  situation: SituationAsParticipantView
  /** 変更完了時のコールバック */
  onSkillRequestChanged?: () => void
}

/**
 * 役職希望変更アクション
 *
 * 第1希望、第2希望の役職を選択して変更する機能
 */
export const SkillRequestAction: React.FC<SkillRequestActionProps> = ({
  village,
  user,
  situation,
  onSkillRequestChanged,
}) => {
  const queryClient = useQueryClient()

  // フォーム状態
  const [firstRequestSkill, setFirstRequestSkill] = useState<Skill | null>(null)
  const [secondRequestSkill, setSecondRequestSkill] = useState<Skill | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 役職希望変更が可能かどうかの確認
  const canChangeSkillRequest = situation.skill_request?.available_skill_request || false
  const selectableSkills = useMemo(
    () => situation.skill_request?.selectable_skill_list || [],
    [situation.skill_request?.selectable_skill_list]
  )
  const currentSkillRequest = situation.skill_request?.skill_request

  // 現在の役職希望を初期値として設定
  useEffect(() => {
    if (currentSkillRequest && selectableSkills.length > 0) {
      const firstSkill =
        selectableSkills.find((skill) => skill.code === currentSkillRequest.first.code) || null
      const secondSkill =
        selectableSkills.find((skill) => skill.code === currentSkillRequest.second.code) || null

      setFirstRequestSkill(firstSkill)
      setSecondRequestSkill(secondSkill)
    }
  }, [currentSkillRequest, selectableSkills])

  // 役職希望変更が利用できない場合は表示しない
  if (!canChangeSkillRequest || selectableSkills.length === 0) {
    return null
  }

  // 役職希望変更処理
  const handleSubmitSkillRequest = async () => {
    setIsSubmitting(true)

    try {
      // 役職希望変更APIを呼び出し（暫定：実際のエンドポイントに応じて調整）
      const response = await fetch(`/api/village/${village.id}/skill-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_request_skill: firstRequestSkill?.code || '',
          second_request_skill: secondRequestSkill?.code || '',
        }),
      })

      if (!response.ok) {
        throw new Error('API呼び出しに失敗しました')
      }

      const data = await response.json()

      // 成功時の処理
      console.log('役職希望変更成功:', data)

      // 村情報のキャッシュを無効化（最新の状況を反映）
      queryClient.invalidateQueries({
        queryKey: ['village', village.id],
      })

      // コールバック実行
      onSkillRequestChanged?.()

      alert('役職希望を変更しました。')
    } catch (error) {
      console.error('役職希望変更エラー:', error)
      alert('役職希望の変更に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 役職選択肢を生成（「希望しない」オプションを含む）
  const skillOptions = [
    { value: '', label: '希望しない' },
    ...selectableSkills.map((skill) => ({
      value: skill.code,
      label: skill.name,
    })),
  ]

  // 現在の選択が変更されているかどうかを確認
  const hasChanges =
    firstRequestSkill?.code !== currentSkillRequest?.first.code ||
    secondRequestSkill?.code !== currentSkillRequest?.second.code

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-purple-50 border-purple-200">
      <h4 className="font-medium text-purple-900">役職希望変更</h4>

      {/* 現在の役職希望表示 */}
      {currentSkillRequest && (
        <div className="text-sm text-purple-700 bg-white p-3 rounded border">
          <div className="font-medium mb-2">現在の役職希望:</div>
          <div>
            第1希望:{' '}
            {selectableSkills.find((s) => s.code === currentSkillRequest.first.code)?.name ||
              '希望しない'}
          </div>
          <div>
            第2希望:{' '}
            {selectableSkills.find((s) => s.code === currentSkillRequest.second.code)?.name ||
              '希望しない'}
          </div>
        </div>
      )}

      {/* 役職希望選択フォーム */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2">第1希望</label>
          <select
            value={firstRequestSkill?.code || ''}
            onChange={(e) => {
              const skill = selectableSkills.find((s) => s.code === e.target.value) || null
              setFirstRequestSkill(skill)
            }}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {skillOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2">第2希望</label>
          <select
            value={secondRequestSkill?.code || ''}
            onChange={(e) => {
              const skill = selectableSkills.find((s) => s.code === e.target.value) || null
              setSecondRequestSkill(skill)
            }}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {skillOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 変更ボタン */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmitSkillRequest}
          disabled={!hasChanges || isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isSubmitting ? '変更中...' : '役職希望変更'}
        </Button>
      </div>

      {/* 注意事項 */}
      <div className="text-xs text-purple-600 bg-white p-2 rounded border">
        ※ 役職希望の変更は、村の設定により制限される場合があります。
      </div>
    </div>
  )
}
