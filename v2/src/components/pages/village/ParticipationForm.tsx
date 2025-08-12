'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
// Select コンポーネントを削除
import { apiClient } from '@/lib/api/client'
import { handleApiError } from '@/lib/api/error-handler'
import type { components } from '@/types/generated/api'

type Village = components['schemas']['VillageView']
type VillageParticipateSituation = components['schemas']['VillageParticipateSituationView']
type VillageSkillRequestSituation = components['schemas']['VillageSkillRequestSituation']

interface ParticipationFormProps {
  village: Village
  participateSituation: VillageParticipateSituation
  skillRequestSituation: VillageSkillRequestSituation
}

export function ParticipationForm({
  village,
  participateSituation,
  skillRequestSituation,
}: ParticipationFormProps) {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    charaId: '',
    charaName: '',
    charaShortName: '',
    firstRequestSkill: skillRequestSituation.selectable_skill_list[0]?.code || 'LEFTOVER',
    secondRequestSkill: skillRequestSituation.selectable_skill_list[0]?.code || 'LEFTOVER',
    joinMessage: '',
    joinPassword: '',
    spectator: false,
  })

  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState<components['schemas']['MessageView'] | null>(
    null
  )

  // キャラクター変更時の処理
  const handleCharacterChange = (charaId: string) => {
    const selectedChara = participateSituation.selectable_chara_list.find(
      (chara) => chara.id.toString() === charaId
    )
    if (selectedChara) {
      setFormData((prev) => ({
        ...prev,
        charaId,
        charaName: selectedChara.chara_name.name,
        charaShortName: selectedChara.chara_name.short_name,
      }))
    }
  }

  // 参加確認のミューテーション
  const confirmMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.POST('/village/{villageId}/participate-confirm', {
        params: { path: { villageId: village.id } },
        body: {
          chara_id: parseInt(formData.charaId),
          chara_name: formData.charaName,
          chara_short_name: formData.charaShortName,
          first_request_skill: formData.firstRequestSkill,
          second_request_skill: formData.secondRequestSkill,
          join_message: formData.joinMessage,
          join_password: formData.joinPassword || undefined,
          spectator: formData.spectator,
        },
      })
      return data
    },
    onSuccess: (data) => {
      setConfirmMessage(data as components['schemas']['MessageView'])
      setIsConfirming(true)
    },
    onError: handleApiError,
  })

  // 参加実行のミューテーション
  const participateMutation = useMutation({
    mutationFn: async () => {
      await apiClient.POST('/village/{villageId}/participate', {
        params: { path: { villageId: village.id } },
        body: {
          chara_id: parseInt(formData.charaId),
          chara_name: formData.charaName,
          chara_short_name: formData.charaShortName,
          first_request_skill: formData.firstRequestSkill,
          second_request_skill: formData.secondRequestSkill,
          join_message: formData.joinMessage,
          join_password: formData.joinPassword || undefined,
          spectator: formData.spectator,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['village', village.id.toString()] })
      queryClient.invalidateQueries({ queryKey: ['participate-situation', village.id.toString()] })
      setIsConfirming(false)
      setConfirmMessage(null)
    },
    onError: handleApiError,
  })

  const canSubmit =
    formData.charaId &&
    formData.charaName.length > 0 &&
    formData.charaName.length <= 40 &&
    formData.charaShortName.length === 1 &&
    formData.joinMessage.length > 0 &&
    (!village.setting.password.join_password_required || formData.joinPassword)

  if (isConfirming && confirmMessage) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">入村確認</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">以下の内容で入村します：</p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">キャラクター:</span> {formData.charaName}
              </p>
              <p>
                <span className="font-medium">第1希望役職:</span>{' '}
                {
                  skillRequestSituation.selectable_skill_list.find(
                    (s) => s.code === formData.firstRequestSkill
                  )?.name
                }
              </p>
              <p>
                <span className="font-medium">第2希望役職:</span>{' '}
                {
                  skillRequestSituation.selectable_skill_list.find(
                    (s) => s.code === formData.secondRequestSkill
                  )?.name
                }
              </p>
            </div>
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="text-sm font-medium mb-1">入村発言:</p>
              <p className="text-sm">{confirmMessage.content.text}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => participateMutation.mutate()}
              disabled={participateMutation.isPending}
              className="flex-1"
            >
              {participateMutation.isPending ? '入村中...' : '入村する'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirming(false)
                setConfirmMessage(null)
              }}
              disabled={participateMutation.isPending}
            >
              戻る
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">入村</h3>

        {/* キャラクター選択 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">キャラクター</label>
          <select
            value={formData.charaId}
            onChange={(e) => handleCharacterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">キャラクターを選択してください</option>
            {participateSituation.selectable_chara_list.map((chara) => (
              <option key={chara.id} value={chara.id.toString()}>
                {chara.chara_name.name}
              </option>
            ))}
          </select>
        </div>

        {/* キャラクター名の編集 */}
        {formData.charaId && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">キャラクター名</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.charaName}
                onChange={(e) => setFormData((prev) => ({ ...prev, charaName: e.target.value }))}
                maxLength={40}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">キャラクター名1文字略称</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.charaShortName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, charaShortName: e.target.value }))
                }
                maxLength={1}
              />
            </div>
          </>
        )}

        {/* 役職希望 */}
        {skillRequestSituation.available_skill_request && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">役職第1希望</label>
              <select
                value={formData.firstRequestSkill}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstRequestSkill: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {skillRequestSituation.selectable_skill_list.map((skill) => (
                  <option key={skill.code} value={skill.code}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">役職第2希望</label>
              <select
                value={formData.secondRequestSkill}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, secondRequestSkill: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {skillRequestSituation.selectable_skill_list.map((skill) => (
                  <option key={skill.code} value={skill.code}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* 入村発言 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">入村発言</label>
          <Textarea
            value={formData.joinMessage}
            onChange={(e) => setFormData((prev) => ({ ...prev, joinMessage: e.target.value }))}
            placeholder="入村時のメッセージを入力してください"
            rows={3}
          />
        </div>

        {/* 入村パスワード */}
        {village.setting.password.join_password_required && (
          <div className="space-y-2">
            <label className="text-sm font-medium">入村パスワード</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.joinPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, joinPassword: e.target.value }))}
            />
          </div>
        )}

        <Button
          onClick={() => confirmMutation.mutate()}
          disabled={!canSubmit || confirmMutation.isPending}
          className="w-full"
        >
          {confirmMutation.isPending ? '確認中...' : '入村確認'}
        </Button>
      </div>
    </Card>
  )
}
