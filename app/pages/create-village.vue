<template>
  <section class="py-8">
    <div class="container mx-auto max-w-4xl px-4">
      <h1 class="mb-8 text-2xl font-bold">村を作成</h1>

      <!-- エラー表示 -->
      <div
        v-if="errors"
        class="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4"
      >
        <div class="text-sm text-red-700">
          <ul class="list-inside list-disc">
            <li v-for="err in errors.split('\n')" :key="err">
              {{ err }}
            </li>
          </ul>
        </div>
      </div>

      <!-- フォームセクション -->
      <form class="space-y-8" @submit.prevent="handleSubmit">
        <!-- 基本情報セクション -->
        <BasicInfoSection v-model:form-data="formData" />

        <!-- キャラチップセクション -->
        <CharachipSection v-model:form-data="formData" />

        <!-- ダミーキャラ発言設定 -->
        <DummyMessageSection v-model:form-data="formData" />

        <!-- 編成設定セクション -->
        <OrganizationSection v-model:form-data="formData" />

        <!-- 詳細ルール設定 -->
        <RuleSection v-model:form-data="formData" />

        <!-- 発言制限設定 -->
        <MessageRestrictionSection v-model:form-data="formData" />

        <!-- 参加パスワード設定 -->
        <JoinPasswordSection v-model:form-data="formData" />

        <!-- RP設定 -->
        <RpSection v-model:form-data="formData" />

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
            :disabled="isLoading || !isValid"
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
import { MESSAGE_TYPE } from '~/lib/api/message-constants'
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

// フォームデータ（ローカル管理）
const formData = ref({
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
  ageLimit: 'ALL',
  actionCountLimit: '40',
  actionCharacterLimit: '200'
})

// バリデーション
const isValid = computed(() => {
  return (
    // 基本情報
    formData.value.villageName.trim().length > 0 &&
    formData.value.startDatetime > new Date() &&
    // キャラチップ
    formData.value.charachipIds.length > 0 &&
    formData.value.dummyCharaId != null &&
    formData.value.dummyCharaName.trim().length > 0 &&
    formData.value.dummyCharaShortName.trim().length === 1 &&
    // ダミーキャラ発言
    formData.value.day0Message.trim().length > 0 &&
    // 編成
    formData.value.organization.trim().length > 0 &&
    // 発言制限（基本的な範囲チェック）
    formData.value.normalCount >= 1 &&
    formData.value.normalCount <= 1000 &&
    formData.value.normalLength >= 1 &&
    formData.value.normalLength <= 1000
  )
})

// API送信用のデータ形式に変換
const createRequestBody = (): VillageRegisterBody => {
  // startDatetimeをISO形式に変換
  const formattedStartDatetime = formData.value.startDatetime.toISOString()

  // 発言制限配列を作成
  const restrictList: VillageMessageRestrictCreateBody[] = [
    {
      type: MESSAGE_TYPE.NORMAL_SAY,
      count: formData.value.normalCount,
      length: formData.value.normalLength
    },
    {
      type: MESSAGE_TYPE.WEREWOLF_SAY,
      count: formData.value.whisperCount,
      length: formData.value.whisperLength
    },
    {
      type: MESSAGE_TYPE.SYMPATHIZE_SAY,
      count: formData.value.sympathizeCount,
      length: formData.value.sympathizeLength
    },
    {
      type: MESSAGE_TYPE.LOVERS_SAY,
      count: formData.value.loversCount,
      length: formData.value.loversLength
    },
    {
      type: MESSAGE_TYPE.GRAVE_SAY,
      count: formData.value.graveCount,
      length: formData.value.graveLength
    },
    {
      type: MESSAGE_TYPE.MONOLOGUE_SAY,
      count: formData.value.monologueCount,
      length: formData.value.monologueLength
    },
    {
      type: MESSAGE_TYPE.SPECTATE_SAY,
      count: formData.value.spectateCount,
      length: formData.value.spectateLength
    },
    {
      type: MESSAGE_TYPE.ACTION,
      count: formData.value.actionCount,
      length: formData.value.actionLength
    }
  ]

  return {
    village_name: formData.value.villageName,
    setting: {
      time: {
        start_datetime: formattedStartDatetime,
        silent_hours: formData.value.silentHours
      } as VillageTimeCreateBody,
      organization: {
        organization: formData.value.organization
        // TODO: 編成の詳細設定を追加
      } as VillageOrganizationCreateBody,
      charachip: {
        charachip_ids: formData.value.charachipIds,
        dummy_chara_id: formData.value.dummyCharaId,
        dummy_chara_name: formData.value.dummyCharaName,
        dummy_chara_short_name: formData.value.dummyCharaShortName,
        dummy_chara_day0_message: formData.value.day0Message,
        dummy_chara_day1_message: formData.value.day1Message
      } as VillageCharachipCreateBody,
      rule: {
        open_vote: formData.value.openVote,
        available_skill_request: formData.value.availableSkillRequest,
        available_spectate: formData.value.availableSpectate,
        open_skill_in_grave: formData.value.openSkillInGrave,
        visible_grave_message: formData.value.visibleGraveMessage,
        available_suddenly_death: formData.value.availableSuddenlyDeath,
        available_commit: formData.value.availableCommit,
        available_dummy_skill: formData.value.availableDummySkill,
        available_action: formData.value.availableAction,
        available_secret_say: formData.value.availableSecretSay,
        available_guard_same_target: formData.value.availableGuardSameTarget,
        restrict_list: restrictList,
        join_password: formData.value.joinPassword || undefined
      } as VillageRuleCreateBody,
      tags: {
        list: formData.value.ageLimit !== 'ALL' ? [formData.value.ageLimit] : []
      } as VillageTagCreateBody
    } as VillageSettingRegisterBody
  }
}

// フォーム送信処理
const handleSubmit = async () => {
  if (!isValid.value) {
    errors.value = '必須項目を入力してください'
    return
  }

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
}

// キャンセル処理
const handleCancel = () => {
  if (confirm('入力内容を破棄してトップページに戻りますか？')) {
    router.push('/')
  }
}
</script>
