'use client'

import { BasicSettingsSection } from '@/components/pages/village/create/BasicSettingsSection'
import { CharachipSettingsSection } from '@/components/pages/village/create/CharachipSettingsSection'
import { DummyCharacterModal } from '@/components/pages/village/create/DummyCharacterModal'
import { MessageRestrictSettingsSection } from '@/components/pages/village/create/MessageRestrictSettingsSection'
import { OrganizationSection } from '@/components/pages/village/create/OrganizationSection'
import { ParticipationPasswordSection } from '@/components/pages/village/create/ParticipationPasswordSection'
import {
  RPSettingsSection,
  type RPSettings,
} from '@/components/pages/village/create/RpSettingsSection'
import { RuleSettingsSection } from '@/components/pages/village/create/RuleSettingsSection'
import { TimeSettingsSection } from '@/components/pages/village/create/TimeSettingsSection'
import VillageCreateConfirmModal from '@/components/pages/village/create/VillageCreateConfirmModal'
import { Button } from '@/components/ui/Button'
import { useCharachipListQuery } from '@/hooks/use-charachip-list-query'
import { useCharasQuery } from '@/hooks/use-charas-query'
import { apiClient } from '@/lib/api/client'
import { handleApiError } from '@/lib/api/error-handler'
import { skillApi } from '@/lib/api/skill'
import { VillageRegisterRequest } from '@/types/village-register'
import {
  basicCompositionPattern,
  generateV1StyleCompositions,
} from '@/lib/utils/skill-composition-generator'
import type { Chara, CharachipView, CharachipsView, Charas } from '@/types/charachip'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function VillageCreatePage() {
  const router = useRouter()
  const [isDummyCharaModalOpen, setIsDummyCharaModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmVillageData, setConfirmVillageData] = useState<VillageRegisterRequest | null>(null)

  // キャラチップ一覧を取得
  const {
    data: charachipListData,
    error: charachipError,
    isLoading: charachipLoading,
  } = useCharachipListQuery()
  const charachips: CharachipView[] = useMemo(
    () => (charachipListData?.data as CharachipsView)?.list || [],
    [charachipListData]
  )

  // 役職一覧を取得
  const { data: skillsData } = useQuery({
    queryKey: ['skills'],
    queryFn: skillApi.getSkills,
  })
  const skills = useMemo(() => skillsData?.data?.list || [], [skillsData])

  // 7日後の0時を計算（ローカルタイムゾーン）
  const getDefault7DaysLaterMidnight = () => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    date.setHours(0, 0, 0, 0)

    // ローカルタイムゾーンでのISO文字列を生成
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const [formData, setFormData] = useState({
    villageName: '',
    // 時間設定
    start_datetime: getDefault7DaysLaterMidnight(),
    silentHours: 0,
    // 編成設定
    organization: '',
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
    availableSpectate: false, // 初期値を「なし」に変更
    openSkillInGrave: false,
    availableSuddenlyDeath: true, // 初期値を「あり」に変更
    availableCommit: true,
    availableDummySkill: false,
    availableGuardSameTarget: true, // 初期値を「あり」に変更
    joinPassword: '',
    // タグ
    tags: [] as string[],
    // 発言制限設定
    messageRestrict: {
      normalSay: { maxCount: 20, maxLength: 200 },
      werewolfSay: { maxCount: 40, maxLength: 200 },
      sympathizeSay: { maxCount: 40, maxLength: 200 },
      graveSay: { maxCount: 40, maxLength: 200 },
      monologueSay: { maxCount: 100, maxLength: 200 },
      spectateSay: { maxCount: 40, maxLength: 200 },
    },
    // RP設定
    rpSettings: {
      ageRestriction: '',
      isOpenGraveSpectateMessage: false,
      isAvailableActionMessage: false,
      actionMessageRestrict: {
        maxCount: 40,
        maxLength: 200,
      },
    } as RPSettings,
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
  const charas: Chara[] = useMemo(() => (charasData?.data as Charas)?.list || [], [charasData])

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

  // 役職データが読み込まれた時に初期編成を生成
  useEffect(() => {
    if (skills && skills.length > 0 && !formData.organization) {
      try {
        const initialOrganization = generateV1StyleCompositions(
          formData.minParticipants,
          formData.maxParticipants,
          basicCompositionPattern,
          skills
        )
        setFormData((prev) => ({
          ...prev,
          organization: initialOrganization,
        }))
      } catch (error) {
        console.error('初期編成生成エラー:', error)
      }
    }
  }, [skills, formData.organization, formData.minParticipants, formData.maxParticipants])

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

  // 村作成データを生成する関数
  const buildVillageData = (): VillageRegisterRequest => {
    const startDateTime = new Date(formData.start_datetime).toISOString()

    return {
      village_name: formData.villageName,
      setting: {
        time: {
          start_datetime: startDateTime,
          silent_hours: formData.silentHours > 0 ? formData.silentHours : undefined,
        },
        organization: {
          organization: formData.organization.replace(/^\d+人：/gm, ''),
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
          visible_grave_message: formData.rpSettings.isOpenGraveSpectateMessage,
          available_suddenly_death: formData.availableSuddenlyDeath,
          available_commit: formData.availableCommit,
          available_dummy_skill: formData.availableDummySkill,
          available_action: formData.rpSettings.isAvailableActionMessage,
          available_secret_say: false, // 「独り言可能」機能は削除、常にfalseに設定
          available_guard_same_target: formData.availableGuardSameTarget,
          restrict_list: [
            {
              type: 'NORMAL_SAY',
              count: formData.messageRestrict.normalSay.maxCount,
              length: formData.messageRestrict.normalSay.maxLength,
            },
            {
              type: 'WEREWOLF_SAY',
              count: formData.messageRestrict.werewolfSay.maxCount,
              length: formData.messageRestrict.werewolfSay.maxLength,
            },
            {
              type: 'SYMPATHIZE_SAY',
              count: formData.messageRestrict.sympathizeSay.maxCount,
              length: formData.messageRestrict.sympathizeSay.maxLength,
            },
            {
              type: 'GRAVE_SAY',
              count: formData.messageRestrict.graveSay.maxCount,
              length: formData.messageRestrict.graveSay.maxLength,
            },
            {
              type: 'MONOLOGUE_SAY',
              count: formData.messageRestrict.monologueSay.maxCount,
              length: formData.messageRestrict.monologueSay.maxLength,
            },
            {
              type: 'SPECTATE_SAY',
              count: formData.messageRestrict.spectateSay.maxCount,
              length: formData.messageRestrict.spectateSay.maxLength,
            },
            {
              type: 'ACTION',
              count: formData.rpSettings.actionMessageRestrict.maxCount,
              length: formData.rpSettings.actionMessageRestrict.maxLength,
            },
          ],
          join_password: formData.joinPassword || undefined,
        },
        tags: {
          list: [
            ...formData.tags,
            ...(formData.rpSettings.ageRestriction !== ''
              ? [formData.rpSettings.ageRestriction]
              : []),
          ],
        },
      },
    }
  }

  // 村作成確認のミューテーション
  const confirmMutation = useMutation({
    mutationFn: async () => {
      const villageData = buildVillageData()

      // 確認APIを呼び出し
      await apiClient.POST('/village/confirm', {
        body: villageData,
      })

      return villageData
    },
    onSuccess: (villageData) => {
      // 確認APIが成功したら、確認モーダルを表示
      setConfirmVillageData(villageData)
      setIsConfirmModalOpen(true)
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

    // 範囲チェックのみ
    if (selectedDate < now || selectedDate > maxDate) return false

    return true
  }

  // 日時バリデーション（エラーメッセージ付き）
  const getDateTimeValidation = (datetime: string): { isValid: boolean; error?: string } => {
    if (!datetime) return { isValid: false, error: '開始日時を入力してください。' }

    const selectedDate = new Date(datetime)
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setDate(maxDate.getDate() + 14)

    if (selectedDate < now) {
      return { isValid: false, error: '開始日時は現在時刻以降で設定してください。' }
    }

    if (selectedDate > maxDate) {
      return { isValid: false, error: '開始日時は14日後までで設定してください。' }
    }

    return { isValid: true }
  }

  // 参加パスワードバリデーション関数
  const validateParticipationPassword = (password: string): boolean => {
    return password.length <= 50
  }

  // RP設定バリデーション関数
  const validateRPSettings = (rpSettings: RPSettings): boolean => {
    const { actionMessageRestrict } = rpSettings
    return (
      actionMessageRestrict.maxCount >= 1 &&
      actionMessageRestrict.maxCount <= 1000 &&
      actionMessageRestrict.maxLength >= 1 &&
      actionMessageRestrict.maxLength <= 1000
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 提出前の最終バリデーション
    if (!validateDateTime(formData.start_datetime)) {
      alert('開始日時は今日から14日後までで設定してください。')
      return
    }

    if (!validateParticipationPassword(formData.joinPassword)) {
      alert('参加パスワードは50文字以内で入力してください。')
      return
    }

    if (!validateRPSettings(formData.rpSettings)) {
      alert('アクション発言制限の回数・文字数は1〜1000の範囲で入力してください。')
      return
    }

    confirmMutation.mutate()
  }

  const canSubmit =
    formData.villageName.trim().length > 0 &&
    formData.villageName.trim().length <= 40 &&
    validateDateTime(formData.start_datetime) &&
    formData.organization &&
    formData.dummyCharaName.trim().length > 0 &&
    formData.dummyCharaShortName.trim().length === 1 &&
    formData.dummyCharaDay0Message.trim().length > 0 &&
    formData.charachipIds.length > 0 &&
    validateParticipationPassword(formData.joinPassword) &&
    validateRPSettings(formData.rpSettings)

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
            isStartDateTimeValid={getDateTimeValidation(formData.start_datetime).isValid}
            startDateTimeError={getDateTimeValidation(formData.start_datetime).error}
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
            skills={skills}
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
            availableCommit={formData.availableCommit}
            availableSuddenlyDeath={formData.availableSuddenlyDeath}
            availableGuardSameTarget={formData.availableGuardSameTarget}
            onOpenVoteChange={(checked) => setFormData((prev) => ({ ...prev, open_vote: checked }))}
            onAvailableSkillRequestChange={(checked) =>
              setFormData((prev) => ({ ...prev, availableSkillRequest: checked }))
            }
            onAvailableSpectateChange={(checked) =>
              setFormData((prev) => ({ ...prev, availableSpectate: checked }))
            }
            onAvailableCommitChange={(checked) =>
              setFormData((prev) => ({ ...prev, availableCommit: checked }))
            }
            onAvailableSuddenlyDeathChange={(checked) =>
              setFormData((prev) => ({ ...prev, availableSuddenlyDeath: checked }))
            }
            onAvailableGuardSameTargetChange={(checked) =>
              setFormData((prev) => ({ ...prev, availableGuardSameTarget: checked }))
            }
          />

          {/* 発言制限設定 */}
          <MessageRestrictSettingsSection
            normalSay={formData.messageRestrict.normalSay}
            werewolfSay={formData.messageRestrict.werewolfSay}
            sympathizeSay={formData.messageRestrict.sympathizeSay}
            graveSay={formData.messageRestrict.graveSay}
            monologueSay={formData.messageRestrict.monologueSay}
            spectateSay={formData.messageRestrict.spectateSay}
            onNormalSayChange={(setting) =>
              setFormData((prev) => ({
                ...prev,
                messageRestrict: { ...prev.messageRestrict, normalSay: setting },
              }))
            }
            onWerewolfSayChange={(setting) =>
              setFormData((prev) => ({
                ...prev,
                messageRestrict: { ...prev.messageRestrict, werewolfSay: setting },
              }))
            }
            onSympathizeSayChange={(setting) =>
              setFormData((prev) => ({
                ...prev,
                messageRestrict: { ...prev.messageRestrict, sympathizeSay: setting },
              }))
            }
            onGraveSayChange={(setting) =>
              setFormData((prev) => ({
                ...prev,
                messageRestrict: { ...prev.messageRestrict, graveSay: setting },
              }))
            }
            onMonologueSayChange={(setting) =>
              setFormData((prev) => ({
                ...prev,
                messageRestrict: { ...prev.messageRestrict, monologueSay: setting },
              }))
            }
            onSpectateSayChange={(setting) =>
              setFormData((prev) => ({
                ...prev,
                messageRestrict: { ...prev.messageRestrict, spectateSay: setting },
              }))
            }
          />

          {/* 参加パスワード */}
          <ParticipationPasswordSection
            password={formData.joinPassword}
            onChange={(password) => setFormData((prev) => ({ ...prev, joinPassword: password }))}
          />

          {/* RP設定 */}
          <RPSettingsSection
            settings={formData.rpSettings}
            onChange={(rpSettings) => setFormData((prev) => ({ ...prev, rpSettings }))}
          />

          {/* 送信ボタン */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={!canSubmit || confirmMutation.isPending}
              className="px-8 py-2"
            >
              {confirmMutation.isPending ? '確認中...' : '村作成確認へ'}
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

        {/* 村作成確認モーダル */}
        {confirmVillageData && (
          <VillageCreateConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => {
              setIsConfirmModalOpen(false)
              setConfirmVillageData(null)
            }}
            villageData={confirmVillageData}
            charachips={charachips}
          />
        )}
      </div>
    </div>
  )
}
