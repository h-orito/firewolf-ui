<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">ダミーキャラ発言</h2>

    <Alert
      type="default"
      icon="information"
      description="1日目発言のみ、村作成後にも変更できます。"
      class="mb-4"
    />

    <!-- プロローグ発言 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        プロローグでの発言内容 <span class="text-red-500">*</span>
      </label>

      <!-- キャラクター名と入力エリア -->
      <div v-if="selectedChara" class="mb-3">
        <!-- キャラクター名 -->
        <div class="mb-1 text-left text-xs font-bold">
          [{{
            formData.dummyCharaShortName || selectedChara.chara_name.short_name
          }}]
          {{ formData.dummyCharaName || selectedChara.chara_name.name }}
        </div>
        <!-- 画像とテキストエリア -->
        <div class="flex gap-2">
          <div class="shrink-0">
            <CharaImage :chara="selectedChara" face-type="NORMAL" />
          </div>
          <div class="flex-1">
            <FormTextarea
              :model-value="formData.day0Message"
              placeholder="プロローグでダミーキャラが発言する内容を入力してください"
              :rows="4"
              :maxlength="1000"
              required
              class="w-full"
              :error="!!errors?.day0Message"
              @update:model-value="updateField('day0Message', $event)"
              @blur="validateField('day0Message')"
            />
          </div>
        </div>
      </div>
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

      <!-- キャラクター名と入力エリア -->
      <div v-if="selectedChara" class="mb-3">
        <!-- キャラクター名 -->
        <div class="mb-1 text-left text-xs font-bold">
          [{{
            formData.dummyCharaShortName || selectedChara.chara_name.short_name
          }}]
          {{ formData.dummyCharaName || selectedChara.chara_name.name }}
        </div>
        <!-- 画像とテキストエリア -->
        <div class="flex gap-2">
          <div class="shrink-0">
            <CharaImage :chara="selectedChara" face-type="NORMAL" />
          </div>
          <div class="flex-1">
            <FormTextarea
              :model-value="formData.day1Message"
              placeholder="1日目にダミーキャラが発言する内容を入力してください（任意）"
              :rows="4"
              :maxlength="1000"
              class="w-full"
              :error="!!errors?.day1Message"
              @update:model-value="updateField('day1Message', $event)"
              @blur="validateField('day1Message')"
            />
          </div>
        </div>
      </div>
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
          <Icon name="alert-circle" class="mr-1" />
          この内容は村作成後も変更可能です
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'
import Alert from '~/components/ui/feedback/Alert.vue'
import CharaImage from '~/components/pages/village/CharaImage.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import type { Chara } from '~/lib/api/types'
import type { CreateVillageFormData } from './types'

interface Props {
  formData: CreateVillageFormData
  selectedChara?: Chara | null
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

// 選択されたダミーキャラ（propsから取得）
const selectedChara = computed(() => props.selectedChara)
</script>
