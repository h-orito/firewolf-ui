<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">編成</h2>

    <!-- 編成設定の注意事項 -->
    <Alert type="default" icon="mdi:information" class="mb-4">
      <ul class="ml-4 list-disc space-y-1 text-sm">
        <li>
          役職1文字略称は<NuxtLink
            to="/rule#skill"
            target="_blank"
            class="text-blue-600 hover:underline"
            >ルール</NuxtLink
          >を参照してください。
        </li>
        <li>ダミー役欠けなしの場合、村人を1名以上含めてください。</li>
        <li>
          ダミー役欠けありの場合、噛まれて死亡する役職を1名以上含めてください。
        </li>
        <li>狼系役職を1名以上含めてください。</li>
        <li>狼系役職が過半数を超えないようにしてください。</li>
        <li>最小で5人、最大で999人設定することができます。</li>
      </ul>
    </Alert>

    <!-- 最小人数と定員 -->
    <div class="mb-4 flex gap-6">
      <!-- 最小人数 -->
      <div class="flex-1">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          最小人数 <span class="text-red-500">*</span>
        </label>
        <FormNumberInput
          v-model="capacityMin"
          :min="5"
          :max="999"
          :step="1"
          placeholder="最小人数"
          required
          class="w-32"
          :color="errors?.capacityMin ? 'error' : undefined"
          @blur="validateField('capacityMin')"
        />
        <p
          v-if="errors?.capacityMin"
          class="mt-1 text-xs text-red-600"
        >
          {{ errors.capacityMin }}
        </p>
        <p v-else class="mt-1 text-xs text-gray-500">
          開始時点でこの人数が集まると進行中に遷移します
        </p>
      </div>

      <!-- 定員 -->
      <div class="flex-1">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          定員 <span class="text-red-500">*</span>
        </label>
        <FormNumberInput
          v-model="capacityMax"
          :min="5"
          :max="999"
          :step="1"
          placeholder="定員"
          required
          class="w-32"
          :color="errors?.capacityMax ? 'error' : undefined"
          @blur="validateField('capacityMax')"
        />
        <p
          v-if="errors?.capacityMax"
          class="mt-1 text-xs text-red-600"
        >
          {{ errors.capacityMax }}
        </p>
        <p v-else class="mt-1 text-xs text-gray-500">
          この人数まで参加することができます
        </p>
      </div>
    </div>

    <!-- 編成生成ボタン -->
    <div class="mb-4">
      <UButton
        size="sm"
        color="primary"
        :disabled="!capacityMin || !capacityMax"
        @click="generateOrganization"
      >
        人数ごとの編成を生成
      </UButton>
    </div>

    <!-- 編成テキスト入力 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        編成 <span class="text-red-500">*</span>
      </label>
      <UTextarea
        :model-value="formData.organization"
        placeholder="例: 11人：村村村村村占霊狩狼狼狂"
        :rows="6"
        :maxlength="1004"
        class="w-full"
        required
        :color="errors?.organization ? 'error' : undefined"
        @update:model-value="updateField('organization', $event)"
        @blur="validateField('organization')"
      />
      <p v-if="errors?.organization" class="mt-1 text-xs text-red-600">
        {{ errors.organization }}
      </p>
      <p v-else class="mt-2 text-xs text-gray-500">
        「人数：役職構成」の形式で、改行で複数の人数パターンを入力できます
      </p>
    </div>

    <!-- 役欠け設定 -->
    <div class="mb-6">
      <FormSwitch
        :model-value="formData.availableDummySkill"
        label="役欠けあり"
        description="ダミー役欠けあり（ダミーキャラが村人以外の役職を持つ可能性があります）"
        @update:model-value="updateField('availableDummySkill', $event)"
      />
      <p v-if="errors?.availableDummySkill" class="mt-1 text-xs text-red-600">
        {{ errors.availableDummySkill }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from './types'
import Alert from '~/components/ui/feedback/Alert.vue'
import FormSwitch from '~/components/ui/form/FormSwitch.vue'
import FormNumberInput from '~/components/ui/form/FormNumberInput.vue'

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

// 最小人数
const capacityMin = computed({
  get: () => props.formData.capacityMin,
  set: (value: number) => updateField('capacityMin', value)
})

// 定員
const capacityMax = computed({
  get: () => props.formData.capacityMax,
  set: (value: number) => updateField('capacityMax', value)
})

// 人数ごとの編成を生成
const generateOrganization = () => {
  const min = capacityMin.value
  const max = capacityMax.value

  if (min > max) {
    return
  }

  const personNumArr: number[] = []
  for (let i = min; i <= max; i++) {
    personNumArr.push(i)
  }

  const org = personNumArr
    .map((personNum) => {
      let str = '狼'
      if (personNum >= 9) str += '狼'
      if (personNum >= 13) str += '狼'
      str += '占'
      if (personNum >= 9) str += '霊狩狂'

      return `${personNum}人：${str.padEnd(personNum, '村')}`
    })
    .join('\n')

  updateField('organization', org)
}

// 初期表示時に編成を生成
onMounted(() => {
  if (!props.formData.organization) {
    generateOrganization()
  }
})
</script>
