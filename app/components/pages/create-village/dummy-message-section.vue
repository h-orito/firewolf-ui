<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">ダミーキャラ発言</h2>

    <Alert
      type="default"
      icon="mdi:information"
      description="1日目発言のみ、村作成後にも変更できます。"
      class="mb-4"
    />

    <!-- プロローグ発言 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        プロローグでの発言内容 <span class="text-red-500">*</span>
      </label>

      <!-- キャラクタープレビュー -->
      <div
        v-if="selectedChara"
        class="mb-3 flex items-start rounded-lg bg-gray-50 p-3"
      >
        <img
          v-if="selectedChara.face_list?.[0]?.image_url"
          :src="selectedChara.face_list[0].image_url"
          :alt="selectedChara.chara_name.name"
          class="mr-3 h-16 w-16 object-contain"
        />
        <div class="flex-1">
          <p class="text-sm font-medium">
            {{ formData.dummyCharaName || selectedChara.chara_name.name }}
          </p>
          <p class="text-xs text-gray-500">プロローグでの発言プレビュー</p>
        </div>
      </div>

      <UTextarea
        :model-value="formData.day0Message"
        placeholder="プロローグでダミーキャラが発言する内容を入力してください"
        :rows="4"
        :maxlength="1000"
        required
        class="w-full"
        :color="errors?.day0Message ? 'error' : undefined"
        @update:model-value="updateField('day0Message', $event)"
        @blur="validateField('day0Message')"
      />
      <p v-if="errors?.day0Message" class="mt-1 text-xs text-red-600">
        {{ errors.day0Message }}
      </p>
      <p v-else class="mt-1 text-xs text-gray-500">
        最大1000文字まで入力できます（{{
          (formData.day0Message || '').length
        }}/1000）
      </p>
    </div>

    <!-- 1日目発言 -->
    <div>
      <label class="mb-2 block text-sm font-medium text-gray-700">
        1日目の発言内容
      </label>

      <!-- キャラクタープレビュー -->
      <div
        v-if="selectedChara"
        class="mb-3 flex items-start rounded-lg bg-gray-50 p-3"
      >
        <img
          v-if="selectedChara.face_list?.[0]?.image_url"
          :src="selectedChara.face_list[0].image_url"
          :alt="selectedChara.chara_name.name"
          class="mr-3 h-16 w-16 object-contain"
        />
        <div class="flex-1">
          <p class="text-sm font-medium">
            {{ formData.dummyCharaName || selectedChara.chara_name.name }}
          </p>
          <p class="text-xs text-gray-500">1日目の発言プレビュー</p>
        </div>
      </div>

      <UTextarea
        :model-value="formData.day1Message"
        placeholder="1日目にダミーキャラが発言する内容を入力してください（任意）"
        :rows="4"
        :maxlength="1000"
        class="w-full"
        :color="errors?.day1Message ? 'error' : undefined"
        @update:model-value="updateField('day1Message', $event)"
        @blur="validateField('day1Message')"
      />
      <p v-if="errors?.day1Message" class="mt-1 text-xs text-red-600">
        {{ errors.day1Message }}
      </p>
      <div v-else>
        <p class="mt-1 text-xs text-gray-500">
          最大1000文字まで入力できます（{{
            (formData.day1Message || '').length
          }}/1000）
        </p>
        <p class="mt-1 text-xs text-yellow-600">
          <Icon name="mdi:alert-circle" class="mr-1" />
          この内容は村作成後も変更可能です
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Alert from '~/components/ui/feedback/Alert.vue'
import type { CharaView } from '~/lib/api/types'
import type { CreateVillageFormData } from './types'

interface Props {
  formData: CreateVillageFormData
  errors?: Partial<Record<string, string | undefined>>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:field': [
    field: keyof CreateVillageFormData,
    value: CreateVillageFormData[keyof CreateVillageFormData]
  ]
  'validate:field': [field: keyof CreateVillageFormData]
}>()

// フィールド更新
const updateField = <K extends keyof CreateVillageFormData>(
  field: K,
  value: CreateVillageFormData[K]
) => {
  emit('update:field', field, value)
}

// フィールドバリデーション
const validateField = (field: keyof CreateVillageFormData) => {
  emit('validate:field', field)
}

// 選択されたダミーキャラ情報（実際にはpropsまたはAPIから取得）
const selectedChara = ref<CharaView | null>(null)

// ダミーキャラIDが変更されたら情報を取得
watch(
  () => props.formData.dummyCharaId,
  async (newId) => {
    if (newId) {
      // 実際にはAPIから取得するか、親コンポーネントから受け取る
      // ここではモックデータを設定
      selectedChara.value = null
    }
  }
)
</script>
