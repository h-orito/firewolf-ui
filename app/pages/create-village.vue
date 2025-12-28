<template>
  <section class="py-8">
    <div class="container mx-auto max-w-4xl px-4">
      <h1 class="mb-8 text-2xl font-bold">村を作成</h1>

      <!-- エラー表示 -->
      <Alert v-if="errors" type="error" class="mb-6" @close="errors = null">
        {{ errors }}
      </Alert>

      <!-- フォームセクション -->
      <form class="space-y-8" @submit.prevent="handleSubmit">
        <!-- 基本情報セクション -->
        <BasicInfoSection
          :form-data="formData"
          :errors="visibleErrors"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- キャラチップセクション -->
        <CharachipSection
          :form-data="formData"
          :errors="visibleErrors"
          @update:field="setFieldValue"
          @validate:field="markFieldAsTouched"
        />

        <!-- ダミーキャラ発言設定 -->
        <DummyMessageSection
          :form-data="formData"
          :selected-chara="selectedDummyChara"
          :errors="visibleErrors"
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
  Chara
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
import PreviewModal from '~/components/pages/create-village/PreviewModal.vue'
import Alert from '~/components/ui/feedback/Alert.vue'

// SEO設定
useHead({
  title: '村作成'
})

// Router
const router = useRouter()

// API呼び出し用のステート
const isLoading = ref(false)
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

// 日時をローカル形式(YYYY-MM-DDTHH:mm:ss)にフォーマット
// サーバー側がLocalDateTimeで受け取っているため、タイムゾーン情報なしで送信
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
  // startDatetimeをJSTのローカル日時形式に変換（タイムゾーン情報なし）
  const formattedStartDatetime = formatLocalDateTime(formData.startDatetime)

  // 発言制限配列を作成
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

  // 編成データから人数部分を除去（例: "10人：狼狼占霊狩狂村村村村" → "狼狼占霊狩狂村村村村"）
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
    const { apiCall } = useApi()
    const response = await apiCall<{ village_id: number }>('/village', {
      method: 'POST',
      body: requestBody
    })

    // 成功時は村ページにリダイレクト
    await router.push(`/village?id=${response?.village_id}`)
  } catch (error) {
    console.error('Failed to create village:', error)
    errors.value =
      error instanceof Error ? error.message : '村の作成に失敗しました'
  } finally {
    isLoading.value = false
  }
})

// フィールドをtouchedにする
const markFieldAsTouched = (fieldName: string) => {
  touchedFields.value.add(fieldName)
  // vee-validateのsetFieldTouchedは文字列を受け付けるため、型アサーションが必要
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

  // 全フィールドをtouchedにする
  markAllFieldsAsTouched()

  try {
    // バリデーションチェック
    const isValid = await meta.value.valid
    if (!isValid) {
      errors.value = '入力内容に誤りがあります。各項目を確認してください。'
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // サーバー側バリデーションチェック
    const requestBody = createRequestBody()
    const { apiCall } = useApi()
    await apiCall('/village/confirm', {
      method: 'POST',
      body: requestBody
    })

    // キャラチップ名を取得
    await loadCharachipName()

    // ダミーキャラ情報を取得
    await loadDummyCharaInfo()

    // プレビューモーダルを開く
    isPreviewModalOpen.value = true
  } catch (error) {
    console.error('Failed to confirm village settings:', error)
    // FetchErrorからビジネスエラーメッセージを取得
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

        // フォームデータにも反映（まだ入力されていない場合）
        if (!formData.dummyCharaName) {
          setFieldValue('dummyCharaName', response.chara_name.name)
        }
        if (!formData.dummyCharaShortName) {
          setFieldValue('dummyCharaShortName', response.chara_name.short_name)
        }
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

// ダミーキャラIDが変更されたら情報を取得
watch(
  () => formData.dummyCharaId,
  async (newId) => {
    if (newId) {
      await loadDummyCharaInfo()
    } else {
      selectedDummyChara.value = null
    }
  }
)

// 初期化時に役職情報を取得
onMounted(() => {
  loadSkills()
})
</script>
