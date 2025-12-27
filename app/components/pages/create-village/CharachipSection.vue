<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">キャラチップ</h2>

    <Alert
      type="warning"
      icon="alert"
      description="村作成後は変更できません。"
      class="mb-4"
    />

    <!-- キャラチップ選択 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        使用するキャラチップ <span class="text-red-500">*</span>
      </label>
      <FormMultiSelect
        v-model="selectedCharachipIds"
        :options="charachips"
        value-attribute="id"
        label-attribute="name"
        class="w-full"
        :error="!!errors?.charachipIds"
        @change="onCharachipChange"
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
      <FormSelect
        v-model="selectedDummyCharaId"
        :options="charasSelectable"
        placeholder="ダミーキャラクターを選択"
        :disabled="charas.length === 0"
        class="w-full"
        :error="!!errors?.dummyCharaId"
        @change="onDummyCharaChange"
      />
      <div class="mt-2 flex justify-end">
        <UiButton
          size="sm"
          color="primary"
          :disabled="charas.length === 0"
          @click="openCharaSelectModal"
        >
          画像から選ぶ
        </UiButton>
      </div>
      <p v-if="errors?.dummyCharaId" class="mt-1 text-xs text-red-600">
        {{ errors.dummyCharaId }}
      </p>
      <p v-else-if="charas.length === 0" class="mt-1 text-xs text-red-500">
        先にキャラチップを選択してください
      </p>
    </div>

    <!-- ダミーキャラ名前設定 -->
    <div v-if="selectedDummyCharaId" class="space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">
          ダミーキャラ名 <span class="text-red-500">*</span>
        </label>
        <FormInput
          v-model="dummyCharaName"
          placeholder="ダミーキャラクターの名前"
          size="md"
          :maxlength="40"
          required
          :error="!!errors?.dummyCharaName"
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
        <FormInput
          v-model="dummyCharaShortName"
          placeholder="略"
          size="md"
          :maxlength="1"
          class="w-20"
          required
          :error="!!errors?.dummyCharaShortName"
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

    <!-- キャラ選択モーダル -->
    <CharaSelectModal
      :is-open="isCharaSelectModalOpen"
      :charas="charas"
      @select="handleCharaSelect"
      @close="isCharaSelectModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import Alert from '~/components/ui/feedback/Alert.vue'
import UiButton from '~/components/ui/button/index.vue'
import CharaSelectModal from '~/components/ui/chara-select/CharaSelectModal.vue'
import FormMultiSelect from '~/components/ui/form/FormMultiSelect.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import type { DeepReadonly } from 'vue'
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

// 選択されたキャラチップID
const selectedCharachipIds = computed({
  get: () => props.formData.charachipIds,
  set: (ids: (string | number)[]) => {
    const numericIds = ids.map((id) => Number(id))
    emit('update:field', 'charachipIds', numericIds)
  }
})

// キャラチップ変更時の処理
const onCharachipChange = () => {
  validateField('charachipIds')
  loadCharasByCharachipIds(props.formData.charachipIds)
}

// ダミーキャラ候補
const charasSelectable = computed(() =>
  charas.value.map((c) => ({
    value: c.id,
    label: c.chara_name.name
  }))
)

// ダミーキャラ選択値（IDのみ）
const selectedDummyCharaId = computed({
  get: () => props.formData.dummyCharaId,
  set: (id: string | number | null | undefined) => {
    const numId = Number(id)
    emit('update:field', 'dummyCharaId', numId)
    // キャラが選択されたら名前を自動設定
    const chara = charas.value.find((c) => c.id === numId)
    if (chara) {
      emit('update:field', 'dummyCharaName', chara.chara_name.name)
      emit('update:field', 'dummyCharaShortName', chara.chara_name.short_name)
    }
  }
})

// ダミーキャラ変更時のバリデーション
const onDummyCharaChange = () => {
  validateField('dummyCharaId')
}

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

// キャラ選択モーダル
const isCharaSelectModalOpen = ref(false)

const openCharaSelectModal = () => {
  isCharaSelectModalOpen.value = true
}

const handleCharaSelect = (chara: DeepReadonly<Chara> | Chara) => {
  selectedDummyCharaId.value = chara.id
  isCharaSelectModalOpen.value = false
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
      const dummyCharaId = selectedDummyCharaId.value
      if (!charas.value.some((c) => c.id === dummyCharaId)) {
        selectedDummyCharaId.value = charas.value[0]?.id || 0
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
