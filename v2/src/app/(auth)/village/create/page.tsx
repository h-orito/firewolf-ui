'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { apiClient } from '@/lib/api/client'
import { handleApiError } from '@/lib/api/error-handler'
import type { components } from '@/types/generated/api'

export default function VillageCreatePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    villageName: '',
    // 時間設定
    start_datetime: '',
    silentHours: 6,
    // 役職構成
    organization: '8人村',
    // キャラチップ設定
    dummy_chara_id: 1,
    dummyCharaName: 'ダミー',
    dummyCharaShortName: 'ダ',
    dummyCharaDay0Message: 'まだ誰もいない... この静けさが、嵐の前の静けさでなければいいのだが。',
    dummyCharaDay1Message: '',
    charachipIds: [1] as number[],
    // ルール設定
    open_vote: false,
    availableSkillRequest: true,
    availableSpectate: true,
    openSkillInGrave: false,
    visibleGraveMessage: true,
    availableSuddenlyDeath: false,
    availableCommit: true,
    availableDummySkill: false,
    availableAction: false,
    availableSecretSay: true,
    availableGuardSameTarget: false,
    joinPassword: '',
    // タグ
    tags: [] as string[],
    // メッセージ制限
    restrictList: [
      { type: 'NORMAL_SAY', count: 20, length: 200 },
      { type: 'WHISPER', count: 10, length: 200 },
    ],
  })

  // 村作成のミューテーション
  const createMutation = useMutation({
    mutationFn: async () => {
      const startDateTime = new Date(formData.start_datetime).toISOString()

      const { data } = await apiClient.POST('/village', {
        body: {
          village_name: formData.villageName,
          setting: {
            time: {
              start_datetime: startDateTime,
              silent_hours: formData.silentHours > 0 ? formData.silentHours : undefined,
            },
            organization: {
              organization: formData.organization,
            },
            charachip: {
              dummy_chara_id: formData.dummy_chara_id,
              dummy_chara_name: formData.dummyCharaName,
              dummy_chara_short_name: formData.dummyCharaShortName,
              dummy_chara_day0_message: formData.dummyCharaDay0Message,
              dummy_chara_day1_message: formData.dummyCharaDay1Message || undefined,
              charachip_ids: formData.charachipIds,
            },
            rule: {
              open_vote: formData.open_vote,
              available_skill_request: formData.availableSkillRequest,
              available_spectate: formData.availableSpectate,
              open_skill_in_grave: formData.openSkillInGrave,
              visible_grave_message: formData.visibleGraveMessage,
              available_suddenly_death: formData.availableSuddenlyDeath,
              available_commit: formData.availableCommit,
              available_dummy_skill: formData.availableDummySkill,
              available_action: formData.availableAction,
              available_secret_say: formData.availableSecretSay,
              available_guard_same_target: formData.availableGuardSameTarget,
              restrict_list: formData.restrictList,
              join_password: formData.joinPassword || undefined,
            },
            tags: {
              list: formData.tags,
            },
          },
        },
      })
      return data
    },
    onSuccess: (data) => {
      if (data && typeof data === 'object' && '*/*' in data) {
        const content = data['*/*'] as { villageId: number }
        if (content && typeof content.villageId === 'number') {
          router.push(`/village/${content.villageId}`)
        }
      }
    },
    onError: handleApiError,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate()
  }

  const canSubmit =
    formData.villageName.trim().length > 0 &&
    formData.villageName.trim().length <= 40 &&
    formData.start_datetime &&
    formData.organization &&
    formData.dummyCharaName.trim().length > 0 &&
    formData.dummyCharaShortName.trim().length === 1 &&
    formData.dummyCharaDay0Message.trim().length > 0 &&
    formData.charachipIds.length > 0

  return (
    <div className="container mx-auto px-6 py-8">
      <Card className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">村作成</h1>
            <p className="text-gray-600">新しい人狼村を作成します</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本設定 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">基本設定</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium">村名</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.villageName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, villageName: e.target.value }))
                  }
                  maxLength={40}
                  required
                />
                <p className="text-xs text-gray-500">{formData.villageName.length}/40文字</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">開始日時</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.start_datetime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, start_datetime: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">沈黙時間（時間）</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.silentHours}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, silentHours: parseInt(e.target.value) }))
                  }
                />
                <p className="text-xs text-gray-500">0を指定すると沈黙時間なしになります</p>
              </div>
            </div>

            {/* 役職構成 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">役職構成</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium">構成</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, organization: e.target.value }))
                  }
                  required
                >
                  <option value="8人村">8人村</option>
                  <option value="11人村">11人村</option>
                  <option value="15人村">15人村</option>
                  <option value="17人村">17人村</option>
                  <option value="22人村">22人村</option>
                </select>
              </div>
            </div>

            {/* キャラチップ設定 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">キャラチップ設定</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ダミーキャラ名</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.dummyCharaName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, dummyCharaName: e.target.value }))
                    }
                    maxLength={40}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ダミーキャラ略称</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.dummyCharaShortName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, dummyCharaShortName: e.target.value }))
                    }
                    maxLength={1}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">プロローグメッセージ</label>
                <Textarea
                  value={formData.dummyCharaDay0Message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dummyCharaDay0Message: e.target.value }))
                  }
                  placeholder="プロローグでのダミーキャラクターのメッセージ"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">1日目メッセージ（任意）</label>
                <Textarea
                  value={formData.dummyCharaDay1Message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dummyCharaDay1Message: e.target.value }))
                  }
                  placeholder="1日目でのダミーキャラクターのメッセージ（空の場合は発言なし）"
                  rows={2}
                />
              </div>
            </div>

            {/* ルール設定 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">ルール設定</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.open_vote}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, open_vote: e.target.checked }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">投票公開</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.availableSkillRequest}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, availableSkillRequest: e.target.checked }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">役職希望可能</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.availableSpectate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, availableSpectate: e.target.checked }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">見学可能</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.visibleGraveMessage}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, visibleGraveMessage: e.target.checked }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">墓下発言表示</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.availableCommit}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, availableCommit: e.target.checked }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">コミット可能</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.availableSecretSay}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, availableSecretSay: e.target.checked }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">独り言可能</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">入村パスワード（任意）</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.joinPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, joinPassword: e.target.value }))
                  }
                />
                <p className="text-xs text-gray-500">
                  設定すると、入村にパスワードが必要になります
                </p>
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={!canSubmit || createMutation.isPending}
                className="px-8 py-2"
              >
                {createMutation.isPending ? '作成中...' : '村を作成する'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
