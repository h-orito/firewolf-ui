/**
 * カミングアウトアクションコンポーネント
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

interface ComingoutActionProps {
  /** 村情報 */
  village: VillageView
  /** ユーザー情報 */
  user: any
  /** 参加者としての状況 */
  situation: SituationAsParticipantView
  /** カミングアウト完了時のコールバック */
  onComingOutChanged?: () => void
}

/**
 * カミングアウトアクション
 *
 * 最大2つまでの役職をカミングアウトする機能
 */
export const ComingoutAction: React.FC<ComingoutActionProps> = ({
  village,
  user,
  situation,
  onComingOutChanged,
}) => {
  const queryClient = useQueryClient()

  // フォーム状態
  const [firstComingOut, setFirstComingOut] = useState<Skill | null>(null)
  const [secondComingOut, setSecondComingOut] = useState<Skill | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // カミングアウトが可能かどうかの確認
  const canComingOut = situation.coming_out?.available_coming_out || false
  const selectableSkills = useMemo(
    () => situation.coming_out?.selectable_skill_list || [],
    [situation.coming_out?.selectable_skill_list]
  )
  const currentComingOuts = useMemo(
    () => situation.coming_out?.current_coming_outs?.list || [],
    [situation.coming_out?.current_coming_outs?.list]
  )

  // 現在のカミングアウトを初期値として設定
  useEffect(() => {
    if (currentComingOuts.length > 0 && selectableSkills.length > 0) {
      const firstSkill = currentComingOuts[0]
        ? selectableSkills.find((skill) => skill.code === currentComingOuts[0].skill.code) || null
        : null
      const secondSkill = currentComingOuts[1]
        ? selectableSkills.find((skill) => skill.code === currentComingOuts[1].skill.code) || null
        : null

      setFirstComingOut(firstSkill)
      setSecondComingOut(secondSkill)
    }
  }, [currentComingOuts, selectableSkills])

  // カミングアウトが利用できない場合は表示しない
  if (!canComingOut || selectableSkills.length === 0) {
    return null
  }

  // カミングアウト処理
  const handleSubmitComingOut = async () => {
    setIsSubmitting(true)

    try {
      // カミングアウトAPIを呼び出し（暫定：実際のエンドポイントに応じて調整）
      const response = await fetch(`/api/village/${village.id}/coming-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skill_code: [firstComingOut?.code, secondComingOut?.code].filter(Boolean), // nullやundefinedを除外
        }),
      })

      if (!response.ok) {
        throw new Error('API呼び出しに失敗しました')
      }

      const data = await response.json()

      // 成功時の処理
      console.log('カミングアウト成功:', data)

      // 村情報のキャッシュを無効化（最新の状況を反映）
      queryClient.invalidateQueries({
        queryKey: ['village', village.id],
      })

      // コールバック実行
      onComingOutChanged?.()

      alert('カミングアウトを更新しました。')
    } catch (error) {
      console.error('カミングアウトエラー:', error)
      alert('カミングアウトの更新に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 役職選択肢を生成（「取り消し」オプションを含む）
  const skillOptions = [
    { value: '', label: '取り消し' },
    ...selectableSkills.map((skill) => ({
      value: skill.code,
      label: skill.name,
    })),
  ]

  // 現在の選択が変更されているかどうかを確認
  const hasChanges =
    firstComingOut?.code !== (currentComingOuts[0]?.skill.code || '') ||
    secondComingOut?.code !== (currentComingOuts[1]?.skill.code || '')

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-green-50 border-green-200">
      <h4 className="font-medium text-green-900">カミングアウト</h4>

      {/* 現在のカミングアウト表示 */}
      <div className="text-sm text-green-700 bg-white p-3 rounded border">
        <div className="font-medium mb-2">現在のカミングアウト:</div>
        {currentComingOuts.length > 0 ? (
          <div className="space-y-1">
            {currentComingOuts.map((comingOut, index) => (
              <div key={index}>
                CO{index + 1}: {comingOut.skill.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">カミングアウトしていません</div>
        )}
      </div>

      {/* カミングアウト選択フォーム */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-green-900 mb-2">CO1</label>
          <select
            value={firstComingOut?.code || ''}
            onChange={(e) => {
              const skill = selectableSkills.find((s) => s.code === e.target.value) || null
              setFirstComingOut(skill)
            }}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {skillOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-900 mb-2">CO2</label>
          <select
            value={secondComingOut?.code || ''}
            onChange={(e) => {
              const skill = selectableSkills.find((s) => s.code === e.target.value) || null
              setSecondComingOut(skill)
            }}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {skillOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 更新ボタン */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmitComingOut}
          disabled={!hasChanges || isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isSubmitting ? '更新中...' : 'カミングアウト更新'}
        </Button>
      </div>

      {/* 注意事項 */}
      <div className="text-xs text-green-600 bg-white p-2 rounded border">
        ※ 最大2つまでの役職をカミングアウトできます。同じ役職を重複して選択することはできません。
      </div>
    </div>
  )
}
