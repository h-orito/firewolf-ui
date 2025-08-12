'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { apiClient } from '../../../../lib/api/client'
import { handleApiError } from '../../../../lib/api/error-handler'
import type { CharachipView } from '../../../../types/charachip'
import { VillageConfirmData, VillageRegisterResponse } from '../../../../types/village-register'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'

interface VillageCreateConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  villageData: VillageConfirmData
  charachips: CharachipView[]
}

export default function VillageCreateConfirmModal({
  isOpen,
  onClose,
  villageData,
  charachips,
}: VillageCreateConfirmModalProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  // 実際の村作成API呼び出し
  const createMutation = useMutation({
    mutationFn: async () => {
      setIsCreating(true)
      const response = await apiClient.POST('/village', {
        body: villageData,
      })
      return response.data
    },
    onSuccess: (data) => {
      if (data && typeof data === 'object' && 'village_id' in data) {
        const villageResponse = data as VillageRegisterResponse
        router.push(`/village/${villageResponse.village_id}`)
        return
      }
      console.error('予期しないAPIレスポンス構造:', data)
    },
    onError: (error) => {
      setIsCreating(false)
      handleApiError(error)
    },
    onSettled: () => {
      setIsCreating(false)
    },
  })

  const handleConfirm = () => {
    createMutation.mutate()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="村作成の確認"
      className="!max-w-4xl !max-h-[95vh]"
    >
      <div className="p-3 md:p-6">
        <p className="text-gray-600 mb-4 md:mb-6">以下の設定で村を作成します。よろしいですか？</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-8 max-h-[65vh] md:max-h-[60vh] overflow-y-auto">
          {/* 左カラム */}
          <div className="space-y-3 md:space-y-4">
            {/* 基本設定 */}
            <Card>
              <div className="p-3 md:p-4">
                <h3 className="font-bold mb-3 text-blue-700">基本設定</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">村名:</span>
                    <span className="text-gray-700">{villageData.village_name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">最小人数:</span>
                    <span className="text-gray-700">
                      {(() => {
                        const org = villageData.setting?.organization?.organization || ''
                        const lines = org.split('\n').filter((line: string) => line.trim())
                        if (lines.length === 0) return '未設定'
                        const minLength = Math.min(...lines.map((line) => line.length))
                        return `${minLength}名`
                      })()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">定員:</span>
                    <span className="text-gray-700">
                      {(() => {
                        const org = villageData.setting?.organization?.organization || ''
                        const lines = org.split('\n').filter((line: string) => line.trim())
                        if (lines.length === 0) return '未設定'
                        const maxLength = Math.max(...lines.map((line) => line.length))
                        return `${maxLength}名`
                      })()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">役欠け有無:</span>
                    <span
                      className={`text-sm ${
                        villageData.setting.rule.available_dummy_skill
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {villageData.setting.rule.available_dummy_skill ? 'あり' : 'なし'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 時間設定 */}
            <Card>
              <div className="p-3 md:p-4">
                <h3 className="font-bold mb-3 text-blue-700">時間設定</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">開始日時:</span>
                    <span className="text-gray-700 text-sm">
                      {new Date(villageData.setting.time.start_datetime).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">沈黙時間:</span>
                    <span className="text-gray-700">
                      {villageData.setting.time.silent_hours || 0}時間
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* キャラチップ設定 */}
            <Card>
              <div className="p-3 md:p-4">
                <h3 className="font-bold mb-3 text-blue-700">キャラチップ設定</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">キャラチップ:</span>
                    <span className="text-gray-700 text-sm">
                      {(() => {
                        const selectedIds = villageData.setting.charachip.charachip_ids || []
                        if (selectedIds.length === 0) return '未選択'
                        const selectedNames = selectedIds
                          .map((id) => {
                            const charachip = charachips.find((c) => c.id === id)
                            return charachip?.name || `ID:${id}`
                          })
                          .join('、')
                        return selectedNames
                      })()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">ダミーキャラ:</span>
                    <span className="text-gray-700 text-sm">
                      [{villageData.setting.charachip.dummy_chara_short_name}]{' '}
                      {villageData.setting.charachip.dummy_chara_name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">プロローグ発言:</span>
                    <span className="text-gray-700 text-xs">
                      {villageData.setting.charachip.dummy_chara_day0_message}
                    </span>
                  </div>
                  {villageData.setting.charachip.dummy_chara_day1_message && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">1日目発言:</span>
                      <span className="text-gray-700 text-xs">
                        {villageData.setting.charachip.dummy_chara_day1_message}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 発言制限設定 */}
            <Card>
              <div className="p-3 md:p-4">
                <h3 className="font-bold mb-3 text-blue-700">発言制限設定</h3>
                <div className="space-y-1">
                  {villageData.setting.rule.restrict_list?.map((restrict: any, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-2 text-xs">
                      <span className="font-medium">
                        {restrict.type === 'NORMAL_SAY' && '通常発言'}
                        {restrict.type === 'WEREWOLF_SAY' && '人狼の囁き'}
                        {restrict.type === 'SYMPATHIZE_SAY' && '共鳴発言'}
                        {restrict.type === 'GRAVE_SAY' && '死者の呻き'}
                        {restrict.type === 'MONOLOGUE_SAY' && '独り言'}
                        {restrict.type === 'SPECTATE_SAY' && '見学発言'}
                        {restrict.type === 'ACTION' && 'アクション発言'}:
                      </span>
                      <span className="text-gray-700">
                        {restrict.count}回/日 • {restrict.length}文字/回
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 右カラム */}
          <div className="space-y-3 md:space-y-4">
            {/* 編成設定 */}
            <Card>
              <div className="p-3 md:p-4">
                <h3 className="font-bold mb-3 text-blue-700">編成設定</h3>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                  {villageData.setting.organization.organization}
                </pre>
              </div>
            </Card>

            {/* ルール設定 */}
            <Card>
              <div className="p-3 md:p-4">
                <h3 className="font-bold mb-3 text-blue-700">ルール設定</h3>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex justify-between">
                    <span>記名投票:</span>
                    <span
                      className={
                        villageData.setting.rule.open_vote ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {villageData.setting.rule.open_vote ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>役職希望可能:</span>
                    <span
                      className={
                        villageData.setting.rule.available_skill_request
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {villageData.setting.rule.available_skill_request ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>見学可能:</span>
                    <span
                      className={
                        villageData.setting.rule.available_spectate
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {villageData.setting.rule.available_spectate ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>墓下役職公開:</span>
                    <span
                      className={
                        villageData.setting.rule.open_skill_in_grave
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {villageData.setting.rule.open_skill_in_grave ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>突然死あり:</span>
                    <span
                      className={
                        villageData.setting.rule.available_suddenly_death
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {villageData.setting.rule.available_suddenly_death ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>時短希望可能:</span>
                    <span
                      className={
                        villageData.setting.rule.available_commit
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {villageData.setting.rule.available_commit ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ダミー役欠け:</span>
                    <span
                      className={
                        villageData.setting.rule.available_dummy_skill
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {villageData.setting.rule.available_dummy_skill ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>連続護衛:</span>
                    <span
                      className={
                        villageData.setting.rule.available_guard_same_target
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {villageData.setting.rule.available_guard_same_target ? 'あり' : 'なし'}
                    </span>
                  </div>
                  {/* 墓下見学会話公開は現在のAPIスキーマには存在しないためコメントアウト
                  <div className="flex justify-between">
                    <span>墓下見学会話公開:</span>
                    <span
                      className={
                        villageData.setting.rule.open_grave_spectate_message
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {villageData.setting.rule.open_grave_spectate_message ? 'あり' : 'なし'}
                    </span>
                  </div>
                  */}
                </div>
              </div>
            </Card>

            {/* 参加パスワード・RP・タグ設定 */}
            <div className="space-y-3 md:space-y-4">
              {/* 参加パスワード */}
              <Card>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold mb-3 text-blue-700">参加パスワード</h3>
                  <p className="text-gray-700 text-sm">
                    {villageData.setting.rule.join_password ? '設定済み' : '設定なし'}
                  </p>
                </div>
              </Card>

              {/* RP設定 */}
              <Card>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold mb-3 text-blue-700">RP設定</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>年齢制限:</span>
                      <span className="text-gray-700">
                        {villageData.setting.tags?.list?.find(
                          (tag: string) => tag === 'R15' || tag === 'R18'
                        ) || '全年齢'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>墓下見学会話公開:</span>
                      <span
                        className={`text-gray-700 ${
                          villageData.setting.rule.visible_grave_message
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {villageData.setting.rule.visible_grave_message ? 'あり' : 'なし'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>アクション発言:</span>
                      <span
                        className={`text-gray-700 ${
                          villageData.setting.rule.available_action
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {villageData.setting.rule.available_action ? 'あり' : 'なし'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>アクション発言制限:</span>
                      <span className="text-gray-700">
                        {villageData.setting.rule.restrict_list?.find(
                          (r: any) => r.type === 'ACTION'
                        )?.count || 0}
                        回/日 •
                        {villageData.setting.rule.restrict_list?.find(
                          (r: any) => r.type === 'ACTION'
                        )?.length || 0}
                        文字/回
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* タグ設定 */}
              {villageData.setting.tags?.list && villageData.setting.tags.list.length > 0 && (
                <Card>
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold mb-3 text-blue-700">タグ設定</h3>
                    <div className="flex flex-wrap gap-2">
                      {villageData.setting.tags.list.map((tag: string, index: number) => (
                        <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isCreating}
            className="flex-1"
          >
            戻る
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={isCreating}
            className="flex-1"
          >
            {isCreating ? '作成中...' : '村を作成'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
