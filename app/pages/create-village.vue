<template>
  <section class="py-8">
    <div class="container mx-auto max-w-4xl px-4">
      <h1 class="mb-8 text-2xl font-bold">村を作成</h1>

      <!-- フォームセクション -->
      <form class="space-y-8" @submit.prevent="handleSubmit">
        <!-- 基本情報セクション -->
        <BasicInfoSection
          :form-data="formData"
          :errors="fieldErrors"
          @update:field="setFieldValue"
          @validate:field="validateField"
        />

        <!-- キャラチップセクション -->
        <CharachipSection
          :form-data="formData"
          :errors="fieldErrors"
          @update:field="setFieldValue"
          @validate:field="validateField"
        />

        <!-- ダミーキャラ発言設定 -->
        <DummyMessageSection
          :form-data="formData"
          :errors="fieldErrors"
          @update:field="setFieldValue"
          @validate:field="validateField"
        />

        <!-- 編成設定セクション -->
        <OrganizationSection
          :form-data="formData"
          :errors="fieldErrors"
          @update:field="setFieldValue"
          @validate:field="validateField"
        />

        <!-- 詳細ルール設定 -->
        <RuleSection
          :form-data="formData"
          :errors="fieldErrors"
          @update:field="setFieldValue"
          @validate:field="validateField"
        />

        <!-- 発言制限設定 -->
        <MessageRestrictionSection
          :form-data="formData"
          :errors="fieldErrors"
          @update:field="setFieldValue"
          @validate:field="validateField"
        />

        <!-- 参加パスワード設定 -->
        <JoinPasswordSection
          :form-data="formData"
          :errors="fieldErrors"
          @update:field="setFieldValue"
          @validate:field="validateField"
        />

        <!-- RP設定 -->
        <RpSection
          :form-data="formData"
          :errors="fieldErrors"
          @update:field="setFieldValue"
          @validate:field="validateField"
        />

        <!-- 送信ボタン -->
        <div class="flex justify-center gap-4">
          <button
            type="button"
            class="rounded-md bg-gray-300 px-6 py-2 text-white hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
            @click="handleCancel"
          >
            キャンセル
          </button>
          <button
            type="submit"
            :disabled="isLoading || !meta.valid"
            class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <span v-if="isLoading">作成中...</span>
            <span v-else>村を作成する</span>
          </button>
        </div>
      </form>
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
  VillageMessageRestrictCreateBody
} from '~/lib/api/types'
import type { CreateVillageFormData } from '~/components/pages/create-village/types'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'
import { useVillageFormValidation } from '~/components/pages/create-village/useVillageFormValidation'
import BasicInfoSection from '~/components/pages/create-village/basic-info-section.vue'
import CharachipSection from '~/components/pages/create-village/charachip-section.vue'
import DummyMessageSection from '~/components/pages/create-village/dummy-message-section.vue'
import OrganizationSection from '~/components/pages/create-village/organization-section.vue'
import RuleSection from '~/components/pages/create-village/rule-section.vue'
import MessageRestrictionSection from '~/components/pages/create-village/message-restriction-section.vue'
import JoinPasswordSection from '~/components/pages/create-village/join-password-section.vue'
import RpSection from '~/components/pages/create-village/rp-section.vue'

// SEO設定
useHead({
  title: '村作成'
})

// Router
const router = useRouter()

// API呼び出し用のステート
const isLoading = ref(false)
const errors = ref<string | null>(null)

// vee-validate設定
const { validationSchema, loadSkills } = useVillageFormValidation()

// vee-validateフォーム初期化
const {
  values: formData,
  errors: fieldErrors,
  meta,
  handleSubmit: veeHandleSubmit,
  setFieldValue,
  validateField
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
    ageLimit: 'ALL' as const,
    actionCountLimit: '40',
    actionCharacterLimit: '200'
  }
})

// API送信用のデータ形式に変換
const createRequestBody = (): VillageRegisterBody => {
  // startDatetimeをISO形式に変換
  const formattedStartDatetime = formData.startDatetime.toISOString()

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

  return {
    village_name: formData.villageName,
    setting: {
      time: {
        start_datetime: formattedStartDatetime,
        silent_hours: formData.silentHours
      } as VillageTimeCreateBody,
      organization: {
        organization: formData.organization
        // TODO: 編成の詳細設定を追加
      } as VillageOrganizationCreateBody,
      charachip: {
        charachip_ids: formData.charachipIds,
        dummy_chara_id: formData.dummyCharaId,
        dummy_chara_name: formData.dummyCharaName,
        dummy_chara_short_name: formData.dummyCharaShortName,
        dummy_chara_day0_message: formData.day0Message,
        dummy_chara_day1_message: formData.day1Message
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
    const response = await apiCall<{ village_id: number }>(
      '/village/register',
      {
        method: 'POST',
        body: requestBody
      }
    )

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

// キャンセル処理
const handleCancel = () => {
  if (confirm('入力内容を破棄してトップページに戻りますか？')) {
    router.push('/')
  }
}

// 初期化時に役職情報を取得
onMounted(() => {
  loadSkills()
})
</script>
