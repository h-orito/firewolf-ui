<template>
  <section class="py-8">
    <div class="container mx-auto max-w-4xl px-4">
      <!-- 戻るボタン -->
      <NuxtLink
        :to="{ path: '/village', query: { id: villageId } }"
        class="mb-4 inline-flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
      >
        <Icon name="i-heroicons-chevron-left-20-solid" class="h-4 w-4" />
        戻る
      </NuxtLink>

      <h1 class="mb-8 text-2xl font-bold">村の設定を変更する</h1>

      <!-- 参加パスワード警告 -->
      <Alert type="warning" class="mb-6">
        参加パスワードが毎回空になるのでご注意ください。
      </Alert>

      <!-- ローディング表示 -->
      <div v-if="isLoadingVillage" class="flex justify-center py-8">
        <LoadingSpinner />
      </div>

      <!-- エラー表示 -->
      <Alert v-if="errors" type="error" class="mb-6" @close="errors = null">
        {{ errors }}
      </Alert>

      <!-- フォームセクション -->
      <form
        v-if="!isLoadingVillage"
        class="space-y-8"
        @submit.prevent="handleSubmit"
      >
        <!-- 基本情報セクション -->
        <BasicInfoSection
          :form-data="formData"
          :errors="visibleErrors"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- キャラチップセクション（読み取り専用） -->
        <CharachipSection
          :form-data="formData"
          :errors="visibleErrors"
          :readonly-mode="true"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- ダミーキャラ発言設定（プロローグ発言は読み取り専用） -->
        <DummyMessageSection
          :form-data="formData"
          :selected-chara="selectedDummyChara"
          :errors="visibleErrors"
          :day0-readonly="true"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- 編成設定セクション -->
        <OrganizationSection
          :form-data="formData"
          :errors="visibleErrors"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- 詳細ルール設定 -->
        <RuleSection
          :form-data="formData"
          :errors="visibleErrors"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- 発言制限設定 -->
        <MessageRestrictionSection
          :form-data="formData"
          :errors="visibleErrors"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- 参加パスワード設定 -->
        <JoinPasswordSection
          :form-data="formData"
          :errors="visibleErrors"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- RP設定 -->
        <RpSection
          :form-data="formData"
          :errors="visibleErrors"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- 送信ボタン -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            :disabled="isConfirming || !meta.valid"
            class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
            @click="handleConfirm"
          >
            <span v-if="isConfirming">確認中...</span>
            <span v-else>確認画面へ</span>
          </button>
        </div>
      </form>

      <!-- プレビューモーダル -->
      <PreviewModal
        :is-open="isPreviewModalOpen"
        :form-data="formData"
        :charachip-name="selectedCharachipName"
        :dummy-chara="selectedDummyChara"
        :is-submitting="isLoading"
        save-label="設定を変更する"
        @close="closePreviewModal"
        @create="handleSubmit"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import type {
  VillageRegisterBody,
  VillageSettingRegisterBody,
  VillageTimeCreateBody,
  VillageOrganizationCreateBody,
  VillageCharachipCreateBody,
  VillageRuleCreateBody,
  VillageTagCreateBody,
  VillageMessageRestrictCreateBody,
  Chara,
  VillageView,
  SituationAsParticipantView
} from '~/lib/api/types'
import type { CreateVillageFormData } from '~/components/pages/create-village/types'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'
import { useVillageFormValidation } from '~/components/pages/create-village/useVillageFormValidation'
import BasicInfoSection from '~/components/pages/create-village/BasicInfoSection.vue'
import CharachipSection from '~/components/pages/create-village/CharachipSection.vue'
import DummyMessageSection from '~/components/pages/create-village/DummyMessageSection.vue'
import OrganizationSection from '~/components/pages/create-village/OrganizationSection.vue'
import RuleSection from '~/components/pages/create-village/RuleSection.vue'
import MessageRestrictionSection from '~/components/pages/create-village/MessageRestrictionSection.vue'
import JoinPasswordSection from '~/components/pages/create-village/JoinPasswordSection.vue'
import RpSection from '~/components/pages/create-village/RpSection.vue'
import Alert from '~/components/ui/feedback/Alert.vue'
import LoadingSpinner from '~/components/ui/feedback/LoadingSpinner.vue'
import Icon from '~/components/ui/icon/Icon.vue'

// 遅延ローディング: プレビューモーダルは確認ボタン押下時まで不要
const PreviewModal = defineAsyncComponent(
  () => import('~/components/pages/create-village/PreviewModal.vue')
)

// SEO設定
useHead({
  title: '村設定変更'
})

// Router
const router = useRouter()
const route = useRoute()

// API
const { apiCall } = useApi()

// クエリパラメータからvillageIdを取得
const villageId = computed(() => {
  const id = route.query.id
  if (typeof id === 'string') {
    return parseInt(id, 10)
  }
  return 0
})

// API呼び出し用のステート
const isLoading = ref(false)
const isLoadingVillage = ref(false)
const errors = ref<string | null>(null)

// プレビューモーダルの状態
const isPreviewModalOpen = ref(false)
const isConfirming = ref(false)
const selectedCharachipName = ref('')
const selectedDummyChara = ref<Chara | null>(null)

// vee-validate設定
const { validationSchema, loadSkills } = useVillageFormValidation()

// touched状態の管理
const touchedFields = ref<Set<string>>(new Set())
const isSubmitted = ref(false)

// vee-validateフォーム初期化
const {
  values: formData,
  errors: fieldErrors,
  meta,
  handleSubmit: veeHandleSubmit,
  setFieldValue,
  setFieldTouched
} = useForm<CreateVillageFormData>({
  validationSchema: toTypedSchema(validationSchema),
  initialValues: {
    // 基本情報
    villageName: '',

    // 時間設定（デフォルト: 7日後の0時）
    startDatetime: (() => {
      const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      date.setHours(0, 0, 0, 0)
      return date
    })(),
    silentHours: 0,

    // キャラチップ設定
    charachipIds: [1],
    dummyCharaId: 0,
    dummyCharaName: '',
    dummyCharaShortName: '',

    // ダミーキャラ発言
    day0Message: '',
    day1Message: '',

    // 編成
    capacityMin: 10,
    capacityMax: 16,
    organization: '',
    availableDummySkill: false,

    // 詳細ルール（デフォルト値）
    openVote: false,
    availableSkillRequest: true,
    availableSpectate: false,
    openSkillInGrave: false,
    visibleGraveMessage: false,
    availableSuddenlyDeath: true,
    availableCommit: false,
    availableAction: false,
    availableSecretSay: false,
    availableGuardSameTarget: true,

    // 発言制限（デフォルト値）
    normalCount: 20,
    normalLength: 200,
    whisperCount: 40,
    whisperLength: 200,
    sympathizeCount: 40,
    sympathizeLength: 200,
    loversCount: 40,
    loversLength: 200,
    graveCount: 40,
    graveLength: 200,
    monologueCount: 100,
    monologueLength: 200,
    spectateCount: 40,
    spectateLength: 200,
    actionCount: 40,
    actionLength: 200,

    // 参加パスワード
    joinPassword: '',

    // RP設定
    ageLimit: 'ALL' as const
  }
})

// 権限チェック（設定変更可能かどうか）
const checkPermission = async (): Promise<boolean> => {
  try {
    const situation = await apiCall<SituationAsParticipantView>(
      `/village/${villageId.value}/situation`
    )
    if (!situation?.creator?.available_modify_setting) {
      errors.value = '設定を変更する権限がありません'
      await router.push(`/village?id=${villageId.value}`)
      return false
    }
    return true
  } catch (error) {
    console.error('Failed to check permission:', error)
    errors.value = '権限の確認に失敗しました'
    return false
  }
}

// 村情報を取得してフォームに展開
const loadVillageSettings = async () => {
  if (!villageId.value) return

  isLoadingVillage.value = true
  errors.value = null

  try {
    // 権限チェック
    const hasPermission = await checkPermission()
    if (!hasPermission) {
      return
    }

    const village = await apiCall<VillageView>(`/village/${villageId.value}`)

    if (village) {
      // 村名
      setFieldValue('villageName', village.name)

      // 時間設定
      setFieldValue(
        'startDatetime',
        new Date(village.setting.time.start_datetime)
      )
      setFieldValue('silentHours', village.setting.time.silent_hours || 0)

      // キャラチップ設定（読み取り専用）
      setFieldValue('charachipIds', village.setting.charachip.charachip_ids)
      setFieldValue('dummyCharaId', village.setting.charachip.dummy_chara_id)
      setFieldValue(
        'dummyCharaName',
        village.setting.charachip.dummy_chara_name
      )
      setFieldValue(
        'dummyCharaShortName',
        village.setting.charachip.dummy_chara_short_name
      )
      setFieldValue(
        'day0Message',
        village.setting.charachip.dummy_chara_day0_message || ''
      )
      setFieldValue(
        'day1Message',
        village.setting.charachip.dummy_chara_day1_message || ''
      )

      // 編成設定
      const organizationEntries = Object.entries(
        village.setting.organizations.organization
      )
      const orgString = organizationEntries
        .map(([count, skills]) => `${count}人：${skills}`)
        .join('\n')
      setFieldValue('organization', orgString)

      // 編成から最小・最大人数を計算
      const counts = organizationEntries.map(([count]) => parseInt(count, 10))
      if (counts.length > 0) {
        setFieldValue('capacityMin', Math.min(...counts))
        setFieldValue('capacityMax', Math.max(...counts))
      }

      // ルール設定
      const rules = village.setting.rules
      setFieldValue('availableDummySkill', rules.available_dummy_skill)
      setFieldValue('openVote', rules.open_vote)
      setFieldValue('availableSkillRequest', rules.available_skill_request)
      setFieldValue('availableSpectate', rules.available_spectate)
      setFieldValue('openSkillInGrave', rules.open_skill_in_grave)
      setFieldValue('visibleGraveMessage', rules.visible_grave_message)
      setFieldValue('availableSuddenlyDeath', rules.available_suddenly_death)
      setFieldValue('availableCommit', rules.available_commit)
      setFieldValue('availableAction', rules.available_action)
      setFieldValue('availableSecretSay', rules.available_secret_say)
      setFieldValue(
        'availableGuardSameTarget',
        rules.available_guard_same_target
      )

      // 発言制限設定
      const restricts = rules.message_restrict.restrict_list
      const findRestrict = (type: string) =>
        restricts.find((r) => r.type.code === type)

      const normalRestrict = findRestrict(MESSAGE_TYPE.NORMAL_SAY)
      if (normalRestrict) {
        setFieldValue('normalCount', normalRestrict.count)
        setFieldValue('normalLength', normalRestrict.length)
      }

      const whisperRestrict = findRestrict(MESSAGE_TYPE.WEREWOLF_SAY)
      if (whisperRestrict) {
        setFieldValue('whisperCount', whisperRestrict.count)
        setFieldValue('whisperLength', whisperRestrict.length)
      }

      const sympathizeRestrict = findRestrict(MESSAGE_TYPE.SYMPATHIZE_SAY)
      if (sympathizeRestrict) {
        setFieldValue('sympathizeCount', sympathizeRestrict.count)
        setFieldValue('sympathizeLength', sympathizeRestrict.length)
      }

      const loversRestrict = findRestrict(MESSAGE_TYPE.LOVERS_SAY)
      if (loversRestrict) {
        setFieldValue('loversCount', loversRestrict.count)
        setFieldValue('loversLength', loversRestrict.length)
      }

      const graveRestrict = findRestrict(MESSAGE_TYPE.GRAVE_SAY)
      if (graveRestrict) {
        setFieldValue('graveCount', graveRestrict.count)
        setFieldValue('graveLength', graveRestrict.length)
      }

      const monologueRestrict = findRestrict(MESSAGE_TYPE.MONOLOGUE_SAY)
      if (monologueRestrict) {
        setFieldValue('monologueCount', monologueRestrict.count)
        setFieldValue('monologueLength', monologueRestrict.length)
      }

      const spectateRestrict = findRestrict(MESSAGE_TYPE.SPECTATE_SAY)
      if (spectateRestrict) {
        setFieldValue('spectateCount', spectateRestrict.count)
        setFieldValue('spectateLength', spectateRestrict.length)
      }

      const actionRestrict = findRestrict(MESSAGE_TYPE.ACTION)
      if (actionRestrict) {
        setFieldValue('actionCount', actionRestrict.count)
        setFieldValue('actionLength', actionRestrict.length)
      }

      // 年齢制限（タグから取得）
      const ageTag = village.setting.tags.list.find((t) => t.startsWith('R'))
      setFieldValue('ageLimit', ageTag || 'ALL')

      // パスワードは毎回空
      setFieldValue('joinPassword', '')

      // ダミーキャラ情報を取得
      await loadDummyCharaInfo()

      // キャラチップ名を取得
      await loadCharachipName()
    }
  } catch (error) {
    console.error('Failed to load village settings:', error)
    errors.value = '村情報の取得に失敗しました'
  } finally {
    isLoadingVillage.value = false
  }
}

// 日時をローカル形式(YYYY-MM-DDTHH:mm:ss)にフォーマット
const formatLocalDateTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

// API送信用のデータ形式に変換
const createRequestBody = (): VillageRegisterBody => {
  const formattedStartDatetime = formatLocalDateTime(formData.startDatetime)

  const restrictList: VillageMessageRestrictCreateBody[] = [
    {
      type: MESSAGE_TYPE.NORMAL_SAY,
      count: formData.normalCount,
      length: formData.normalLength
    },
    {
      type: MESSAGE_TYPE.WEREWOLF_SAY,
      count: formData.whisperCount,
      length: formData.whisperLength
    },
    {
      type: MESSAGE_TYPE.SYMPATHIZE_SAY,
      count: formData.sympathizeCount,
      length: formData.sympathizeLength
    },
    {
      type: MESSAGE_TYPE.LOVERS_SAY,
      count: formData.loversCount,
      length: formData.loversLength
    },
    {
      type: MESSAGE_TYPE.GRAVE_SAY,
      count: formData.graveCount,
      length: formData.graveLength
    },
    {
      type: MESSAGE_TYPE.MONOLOGUE_SAY,
      count: formData.monologueCount,
      length: formData.monologueLength
    },
    {
      type: MESSAGE_TYPE.SPECTATE_SAY,
      count: formData.spectateCount,
      length: formData.spectateLength
    },
    {
      type: MESSAGE_TYPE.ACTION,
      count: formData.actionCount,
      length: formData.actionLength
    }
  ]

  const formatOrganization = (org: string): string => {
    return org
      .split('\n')
      .map((line) => line.replace(/^\d+人[：:]\s*/, ''))
      .join('\n')
  }

  return {
    village_name: formData.villageName,
    setting: {
      time: {
        start_datetime: formattedStartDatetime,
        silent_hours: formData.silentHours
      } as VillageTimeCreateBody,
      organization: {
        organization: formatOrganization(formData.organization)
      } as VillageOrganizationCreateBody,
      charachip: {
        charachip_ids: formData.charachipIds,
        dummy_chara_id: formData.dummyCharaId,
        dummy_chara_name: formData.dummyCharaName,
        dummy_chara_short_name: formData.dummyCharaShortName,
        dummy_chara_day0_message: formData.day0Message,
        dummy_chara_day1_message:
          formData.day1Message.length > 0 ? formData.day1Message : undefined
      } as VillageCharachipCreateBody,
      rule: {
        open_vote: formData.openVote,
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
        restrict_list: restrictList,
        join_password: formData.joinPassword || undefined
      } as VillageRuleCreateBody,
      tags: {
        list: formData.ageLimit !== 'ALL' ? [formData.ageLimit] : []
      } as VillageTagCreateBody
    } as VillageSettingRegisterBody
  }
}

// フォーム送信処理
const handleSubmit = veeHandleSubmit(async (_values) => {
  isLoading.value = true
  errors.value = null

  try {
    const requestBody = createRequestBody()
    await apiCall(`/village/${villageId.value}/setting`, {
      method: 'POST',
      body: requestBody
    })

    // 成功時は村ページにリダイレクト
    await router.push(`/village?id=${villageId.value}`)
  } catch (error) {
    console.error('Failed to update village settings:', error)
    const fetchError = error as { data?: { status?: number; message?: string } }
    if (fetchError.data?.status === 499 && fetchError.data?.message) {
      errors.value = fetchError.data.message
    } else {
      errors.value =
        error instanceof Error ? error.message : '村設定の変更に失敗しました'
    }
  } finally {
    isLoading.value = false
  }
})

// フィールドをtouchedにする
const markFieldAsTouched = (fieldName: string) => {
  touchedFields.value.add(fieldName)
  setFieldTouched(fieldName as keyof CreateVillageFormData, true)
}

// 全フィールドをtouchedにする
const markAllFieldsAsTouched = () => {
  const allFieldNames = Object.keys(formData) as Array<
    keyof CreateVillageFormData
  >
  allFieldNames.forEach((fieldName) => {
    setFieldTouched(fieldName, true)
  })
  isSubmitted.value = true
}

// エラーを表示すべきかどうかを判断
const shouldShowError = (fieldName: string): boolean => {
  return isSubmitted.value || touchedFields.value.has(fieldName)
}

// 表示用のエラーオブジェクトを計算
const visibleErrors = computed(() => {
  const result: Record<string, string> = {}
  const errorEntries = Object.entries(fieldErrors.value)
  errorEntries.forEach(([key, value]) => {
    if (shouldShowError(key) && value) {
      result[key] = value as string
    }
  })
  return result
})

// 確認ボタンの処理
const handleConfirm = async () => {
  isConfirming.value = true
  errors.value = null

  markAllFieldsAsTouched()

  try {
    const isValid = await meta.value.valid
    if (!isValid) {
      errors.value = '入力内容に誤りがあります。各項目を確認してください。'
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const requestBody = createRequestBody()
    await apiCall(`/village/${villageId.value}/setting/confirm`, {
      method: 'POST',
      body: requestBody
    })

    await loadCharachipName()
    await loadDummyCharaInfo()

    isPreviewModalOpen.value = true
  } catch (error) {
    console.error('Failed to confirm village settings:', error)
    const fetchError = error as { data?: { status?: number; message?: string } }
    if (fetchError.data?.status === 499 && fetchError.data?.message) {
      errors.value = fetchError.data.message
    } else {
      errors.value =
        error instanceof Error
          ? error.message
          : '入力内容の確認に失敗しました。入力内容を確認してください。'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isConfirming.value = false
  }
}

// キャラチップ名を取得
const loadCharachipName = async () => {
  try {
    const { apiCall } = useApi()
    if (formData.charachipIds && formData.charachipIds.length > 0) {
      const charachipId = formData.charachipIds[0]
      const response = await apiCall<{ name: string }>(
        `/charachips/${charachipId}`,
        { method: 'GET' }
      )
      selectedCharachipName.value = response?.name || ''
    }
  } catch (error) {
    console.error('Failed to load charachip name:', error)
  }
}

// ダミーキャラ情報を取得
const loadDummyCharaInfo = async () => {
  try {
    const { apiCall } = useApi()
    if (formData.dummyCharaId) {
      const response = await apiCall<Chara>(`/chara/${formData.dummyCharaId}`, {
        method: 'GET'
      })

      if (response) {
        selectedDummyChara.value = response
      }
    }
  } catch (error) {
    console.error('Failed to load dummy chara info:', error)
  }
}

// プレビューモーダルを閉じる
const closePreviewModal = () => {
  isPreviewModalOpen.value = false
}

// 初期化時に村情報を取得
onMounted(async () => {
  await loadSkills()
  await loadVillageSettings()
})
</script>
