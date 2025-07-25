'use client'

import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BasicSettingsSection } from '@/components/pages/village/create/basic-settings-section'
import { TimeSettingsSection } from '@/components/pages/village/create/time-settings-section'
import { OrganizationSection } from '@/components/pages/village/create/organization-section'
import { CharachipSettingsSection } from '@/components/pages/village/create/charachip-settings-section'
import { RuleSettingsSection } from '@/components/pages/village/create/rule-settings-section'
import { apiClient } from '@/lib/api/client'
import { handleApiError } from '@/lib/api/error-handler'
import { useCharachipListQuery } from '@/hooks/useCharachipListQuery'
import { useCharasQuery } from '@/hooks/useCharasQuery'
import { DummyCharacterModal } from '@/components/pages/village/create/dummy-character-modal'
import type { components } from '@/types/generated/api'
import type { CharachipView, CharachipsView, Chara, Charas } from '@/types/charachip'

export default function VillageCreatePage() {
  const router = useRouter()
  const [isDummyCharaModalOpen, setIsDummyCharaModalOpen] = useState(false)

  // キャラチップ一覧を取得
  const {
    data: charachipListData,
    error: charachipError,
    isLoading: charachipLoading,
  } = useCharachipListQuery()
  const charachips: CharachipView[] = (charachipListData?.data as CharachipsView)?.list || []

  // 7日後のJST0時を計算
  const getDefault7DaysLaterMidnight = () => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    date.setHours(0, 0, 0, 0)

    // JST（UTC+9）に調整
    const jstOffset = 9 * 60 * 60 * 1000 // 9時間をミリ秒で
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000
    const jstTime = new Date(utcTime + jstOffset)

    return jstTime.toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM形式
  }

  const [formData, setFormData] = useState({
    villageName: '',
    // 時間設定
    start_datetime: getDefault7DaysLaterMidnight(),
    silentHours: 0,
    // 編成設定
    organization: '8人村',
    minParticipants: 10,
    maxParticipants: 16,
    isDummySkillMissing: false,
    // キャラチップ設定
    dummy_chara_id: 1,
    dummyCharaName: 'ダミー',
    dummyCharaShortName: 'ダ',
    dummyCharaDay0Message: 'まだ誰もいない... この静けさが、嵐の前の静けさでなければいいのだが。',
    dummyCharaDay1Message: '',
    charachipIds: [] as number[],
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

  // キャラチップが読み込まれた時に1つ目を初期選択
  useEffect(() => {
    if (charachips.length > 0 && formData.charachipIds.length === 0) {
      setFormData((prev) => ({
        ...prev,
        charachipIds: [charachips[0].id],
      }))
    }
  }, [charachips, formData.charachipIds.length])

  // 選択されたキャラチップのキャラ一覧を取得
  const { data: charasData } = useCharasQuery(formData.charachipIds)
  const charas: Chara[] = (charasData?.data as Charas)?.list || []

  // キャラが読み込まれた時に1つ目を初期選択（ダミーキャラ）
  useEffect(() => {
    if (charas.length > 0 && formData.dummy_chara_id === 1) {
      const firstChara = charas[0]
      setFormData((prev) => ({
        ...prev,
        dummy_chara_id: firstChara.id,
        dummyCharaName: firstChara.chara_name.name,
        dummyCharaShortName: firstChara.chara_name.short_name,
        ...(firstChara.default_message?.join_message && {
          dummyCharaDay0Message: firstChara.default_message.join_message,
        }),
        ...(firstChara.default_message?.first_day_message && {
          dummyCharaDay1Message: firstChara.default_message.first_day_message,
        }),
      }))
    }
  }, [charas, formData.dummy_chara_id])

  // ダミーキャラ選択時の処理
  const handleSelectDummyChara = (chara: Chara) => {
    setFormData((prev) => ({
      ...prev,
      dummy_chara_id: chara.id,
      dummyCharaName: chara.chara_name.name,
      dummyCharaShortName: chara.chara_name.short_name,
      ...(chara.default_message?.join_message && {
        dummyCharaDay0Message: chara.default_message.join_message,
      }),
      ...(chara.default_message?.first_day_message && {
        dummyCharaDay1Message: chara.default_message.first_day_message,
      }),
    }))
  }

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

  // 日時バリデーション関数
  const validateDateTime = (datetime: string): boolean => {
    if (!datetime) return false

    const selectedDate = new Date(datetime)
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setDate(maxDate.getDate() + 14)

    // 範囲チェック
    if (selectedDate < now || selectedDate > maxDate) return false

    // 30分刻みチェック
    const minutes = selectedDate.getMinutes()
    if (minutes !== 0 && minutes !== 30) return false

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 提出前の最終バリデーション
    if (!validateDateTime(formData.start_datetime)) {
      alert('開始日時は今日から14日後まで、30分刻みで設定してください。')
      return
    }

    createMutation.mutate()
  }

  const canSubmit =
    formData.villageName.trim().length > 0 &&
    formData.villageName.trim().length <= 40 &&
    validateDateTime(formData.start_datetime) &&
    formData.organization &&
    formData.dummyCharaName.trim().length > 0 &&
    formData.dummyCharaShortName.trim().length === 1 &&
    formData.dummyCharaDay0Message.trim().length > 0 &&
    formData.charachipIds.length > 0

  return (
    <div className="container mx-auto px-3 md:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">村作成</h1>
          <p className="text-gray-600">新しい人狼村を作成します</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本設定 */}
          <BasicSettingsSection
            villageName={formData.villageName}
            onVillageNameChange={(name) => setFormData((prev) => ({ ...prev, villageName: name }))}
          />

          {/* 時間設定 */}
          <TimeSettingsSection
            startDateTime={formData.start_datetime}
            silentHours={formData.silentHours}
            onStartDateTimeChange={(datetime) =>
              setFormData((prev) => ({ ...prev, start_datetime: datetime }))
            }
            onSilentHoursChange={(hours) =>
              setFormData((prev) => ({ ...prev, silentHours: hours }))
            }
          />

          {/* キャラチップ設定 */}
          <CharachipSettingsSection
            charachips={charachips}
            charachipLoading={charachipLoading}
            charachipError={charachipError}
            charachipIds={formData.charachipIds}
            onCharachipIdsChange={(ids) => setFormData((prev) => ({ ...prev, charachipIds: ids }))}
            charas={charas}
            dummyCharaId={formData.dummy_chara_id}
            dummyCharaName={formData.dummyCharaName}
            dummyCharaShortName={formData.dummyCharaShortName}
            dummyCharaDay0Message={formData.dummyCharaDay0Message}
            dummyCharaDay1Message={formData.dummyCharaDay1Message}
            onDummyCharaChange={handleSelectDummyChara}
            onDummyCharaNameChange={(name) =>
              setFormData((prev) => ({ ...prev, dummyCharaName: name }))
            }
            onDummyCharaShortNameChange={(shortName) =>
              setFormData((prev) => ({ ...prev, dummyCharaShortName: shortName }))
            }
            onDummyCharaDay0MessageChange={(message) =>
              setFormData((prev) => ({ ...prev, dummyCharaDay0Message: message }))
            }
            onDummyCharaDay1MessageChange={(message) =>
              setFormData((prev) => ({ ...prev, dummyCharaDay1Message: message }))
            }
            onOpenDummyCharaModal={() => setIsDummyCharaModalOpen(true)}
          />

          {/* 編成 */}
          <OrganizationSection
            organization={formData.organization}
            minParticipants={formData.minParticipants}
            maxParticipants={formData.maxParticipants}
            isDummySkillMissing={formData.isDummySkillMissing}
            onOrganizationChange={(organization) =>
              setFormData((prev) => ({ ...prev, organization }))
            }
            onMinParticipantsChange={(min) =>
              setFormData((prev) => ({ ...prev, minParticipants: min }))
            }
            onMaxParticipantsChange={(max) =>
              setFormData((prev) => ({ ...prev, maxParticipants: max }))
            }
            onIsDummySkillMissingChange={(isDummySkillMissing) =>
              setFormData((prev) => ({ ...prev, isDummySkillMissing }))
            }
          />

          {/* ルール設定 */}
          <RuleSettingsSection
            openVote={formData.open_vote}
            availableSkillRequest={formData.availableSkillRequest}
            availableSpectate={formData.availableSpectate}
            visibleGraveMessage={formData.visibleGraveMessage}
            availableCommit={formData.availableCommit}
            availableSecretSay={formData.availableSecretSay}
            joinPassword={formData.joinPassword}
            onOpenVoteChange={(checked) => setFormData((prev) => ({ ...prev, open_vote: checked }))}
            onAvailableSkillRequestChange={(checked) =>
              setFormData((prev) => ({ ...prev, availableSkillRequest: checked }))
            }
            onAvailableSpectateChange={(checked) =>
              setFormData((prev) => ({ ...prev, availableSpectate: checked }))
            }
            onVisibleGraveMessageChange={(checked) =>
              setFormData((prev) => ({ ...prev, visibleGraveMessage: checked }))
            }
            onAvailableCommitChange={(checked) =>
              setFormData((prev) => ({ ...prev, availableCommit: checked }))
            }
            onAvailableSecretSayChange={(checked) =>
              setFormData((prev) => ({ ...prev, availableSecretSay: checked }))
            }
            onJoinPasswordChange={(password) =>
              setFormData((prev) => ({ ...prev, joinPassword: password }))
            }
          />

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

        {/* ダミーキャラ選択モーダル */}
        <DummyCharacterModal
          isOpen={isDummyCharaModalOpen}
          onClose={() => setIsDummyCharaModalOpen(false)}
          charas={charas}
          selectedCharaId={formData.dummy_chara_id}
          onSelectChara={handleSelectDummyChara}
        />
      </div>
    </div>
  )
}
