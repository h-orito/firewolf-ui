<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">キャラチップ</h2>

    <Alert
      type="warning"
      icon="mdi:alert"
      description="村作成後は変更できません。"
      class="mb-4"
    />

    <!-- キャラチップ選択 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        使用するキャラチップ <span class="text-red-500">*</span>
      </label>
      <USelectMenu
        v-model="selectedCharachipItems"
        :items="charachips"
        placeholder="キャラチップを選択"
        multiple
        value-attribute="id"
        label-key="name"
        class="w-full"
        :color="errors?.charachipIds ? 'error' : undefined"
        @change="validateField('charachipIds')"
      />
      <p v-if="errors?.charachipIds" class="mt-1 text-xs text-red-600">
        {{ errors.charachipIds }}
      </p>
      <p v-else class="mt-2 text-xs text-gray-500">
        複数のキャラチップを選択できます
      </p>
    </div>

    <!-- ダミーキャラ選択 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        ダミーキャラクター <span class="text-red-500">*</span>
      </label>
      <USelectMenu
        v-model="selectedDummyChara"
        :items="charasSelectable"
        placeholder="ダミーキャラクターを選択"
        :disabled="charas.length === 0"
        class="w-full"
        :color="errors?.dummyCharaId ? 'error' : undefined"
        @change="validateField('dummyCharaId')"
      >
      </USelectMenu>
      <p v-if="errors?.dummyCharaId" class="mt-1 text-xs text-red-600">
        {{ errors.dummyCharaId }}
      </p>
      <p v-else-if="charas.length === 0" class="mt-1 text-xs text-red-500">
        先にキャラチップを選択してください
      </p>
    </div>

    <!-- ダミーキャラ名前設定 -->
    <div v-if="selectedDummyChara" class="space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">
          ダミーキャラ名 <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model="dummyCharaName"
          placeholder="ダミーキャラクターの名前"
          size="md"
          :maxlength="40"
          required
          :color="errors?.dummyCharaName ? 'error' : undefined"
          @blur="validateField('dummyCharaName')"
        />
        <p v-if="errors?.dummyCharaName" class="mt-1 text-xs text-red-600">
          {{ errors.dummyCharaName }}
        </p>
        <p v-else class="mt-1 text-xs text-gray-500">
          最大40文字まで入力できます
        </p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">
          1文字略称 <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model="dummyCharaShortName"
          placeholder="略"
          size="md"
          :maxlength="1"
          class="w-20"
          required
          :color="errors?.dummyCharaShortName ? 'error' : undefined"
          @blur="validateField('dummyCharaShortName')"
        />
        <p v-if="errors?.dummyCharaShortName" class="mt-1 text-xs text-red-600">
          {{ errors.dummyCharaShortName }}
        </p>
        <p v-else class="mt-1 text-xs text-gray-500">
          発言時に表示される1文字の略称です
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Alert from '~/components/ui/feedback/Alert.vue'
import type {
  CharachipView,
  CharachipsView,
  Charas,
  Chara
} from '~/lib/api/types'
import type { CreateVillageFormData } from './types'

// Props & Emits
const props = defineProps<{
  formData: CreateVillageFormData
  errors?: Partial<Record<string, string | undefined>>
}>()

const emit = defineEmits<{
  'update:field': [
    field: keyof CreateVillageFormData,
    value: CreateVillageFormData[keyof CreateVillageFormData]
  ]
  'validate:field': [field: keyof CreateVillageFormData]
}>()

// キャラチップ一覧
const charachips = ref<CharachipView[]>([])
const charas = ref<Chara[]>([])

// 選択されたキャラチップアイテム
const selectedCharachipItems: WritableComputedRef<CharachipView[]> = computed({
  get: (): CharachipView[] => {
    return props.formData.charachipIds.map(
      (id) => charachips.value.find((c) => c.id === id)!
    )
  },
  set: (selected: CharachipView[]) => {
    const ids = selected.map((c) => c.id)
    emit('update:field', 'charachipIds', ids)
    // キャラチップが変更されたらキャラ一覧を更新
    loadCharasByCharachipIds(ids)
  }
})

// ダミーキャラ候補
type Option = { value: number; label: string }
const charasSelectable = computed(() =>
  charas.value.map((c) => ({
    value: c.id,
    label: c.chara_name.name
  }))
)
// ダミーキャラ選択値
const selectedDummyChara: WritableComputedRef<Option> = computed({
  get: () => {
    const id = props.formData.dummyCharaId
    const chara = charas.value.find((chara) => chara.id === id)
    return {
      value: chara?.id ?? 0,
      label: chara?.chara_name.name || '未選択'
    }
  },
  set: (option: Option) => {
    emit('update:field', 'dummyCharaId', option.value)
    // キャラが選択されたら名前を自動設定
    const chara = charas.value.find((c) => c.id === option.value)
    if (chara) {
      emit('update:field', 'dummyCharaName', chara.chara_name.name)
      emit('update:field', 'dummyCharaShortName', chara.chara_name.short_name)
    }
  }
})

// ダミーキャラ名
const dummyCharaName = computed({
  get: () => props.formData.dummyCharaName,
  set: (value: string) => {
    emit('update:field', 'dummyCharaName', value)
  }
})

// ダミーキャラ略称
const dummyCharaShortName = computed({
  get: () => props.formData.dummyCharaShortName,
  set: (value: string) => {
    emit('update:field', 'dummyCharaShortName', value)
  }
})

// フィールドバリデーション
const validateField = (field: keyof CreateVillageFormData) => {
  emit('validate:field', field)
}

const loadCharachips = async () => {
  try {
    const { apiCall } = useApi()
    const response = await apiCall<CharachipsView>('/charachip/list')
    if (response) {
      charachips.value = response.list || []
    }
  } catch (error) {
    console.error('Failed to load charachips:', error)
  }
}

// 選択されたキャラチップのキャラクター一覧を取得
const loadCharasByCharachipIds = async (charachipIds: number[]) => {
  if (charachipIds.length === 0) {
    charas.value = []
    return
  }

  try {
    const { apiCall } = useApi()
    const response = await apiCall<Charas>('/charas', {
      params: {
        charachip_ids: charachipIds
      }
    })

    if (response) {
      charas.value = response.list || []

      // 現在選択中のダミーキャラが存在しない場合は最初のキャラを選択
      const dummyCharaId = selectedDummyChara.value.value
      if (!charas.value.some((c) => c.id === dummyCharaId)) {
        selectedDummyChara.value = {
          value: charas.value[0]?.id || 0,
          label: charas.value[0]?.chara_name.name || '未選択'
        }
      }
    }
  } catch (error) {
    console.error('Failed to load charas:', error)
  }
}

// 初期化
onMounted(async () => {
  await loadCharachips()
  await loadCharasByCharachipIds(props.formData.charachipIds)
})
</script>
