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
            {{ dummyCharaName || selectedChara.chara_name.name }}
          </p>
          <p class="text-xs text-gray-500">プロローグでの発言プレビュー</p>
        </div>
      </div>

      <UTextarea
        v-model="day0Message"
        placeholder="プロローグでダミーキャラが発言する内容を入力してください"
        :rows="4"
        :maxlength="1000"
        required
        class="w-full"
      />
      <p class="mt-1 text-xs text-gray-500">
        最大1000文字まで入力できます（{{ day0Message.length }}/1000）
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
            {{ dummyCharaName || selectedChara.chara_name.name }}
          </p>
          <p class="text-xs text-gray-500">1日目の発言プレビュー</p>
        </div>
      </div>

      <UTextarea
        v-model="day1Message"
        placeholder="1日目にダミーキャラが発言する内容を入力してください（任意）"
        :rows="4"
        :maxlength="1000"
        class="w-full"
      />
      <p class="mt-1 text-xs text-gray-500">
        最大1000文字まで入力できます（{{ day1Message.length }}/1000）
      </p>
      <p class="mt-1 text-xs text-yellow-600">
        <Icon name="mdi:alert-circle" class="mr-1" />
        この内容は村作成後も変更可能です
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CharaView } from '~/lib/api/types'
import type { CreateVillageFormData } from './types'

// Props & Emits
const props = defineProps<{
  formData: CreateVillageFormData
}>()

const emit = defineEmits<{
  'update:formData': [value: CreateVillageFormData]
}>()

// 選択されたダミーキャラ情報（実際にはpropsまたはAPIから取得）
const selectedChara = ref<CharaView | null>(null)

// ダミーキャラ名（propsから取得）
const dummyCharaName = computed(() => props.formData.dummyCharaName)

// プロローグ発言
const day0Message = computed({
  get: () => props.formData.day0Message,
  set: (value: string) => {
    emit('update:formData', { ...props.formData, day0Message: value })
  }
})

// 1日目発言
const day1Message = computed({
  get: () => props.formData.day1Message,
  set: (value: string) => {
    emit('update:formData', { ...props.formData, day1Message: value })
  }
})

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
