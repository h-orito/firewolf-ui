<template>
  <div v-bind="$attrs">
    <select
      :id="id"
      :name="name"
      :disabled="disabled"
      :class="selectClasses"
      multiple
      :size="visibleOptions"
      @change="handleChange"
    >
      <option
        v-for="option in normalizedOptions"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
        :selected="isSelected(option.value)"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type SelectOption =
  | {
      label?: string
      value?: string | number
      disabled?: boolean
      [key: string]: unknown
    }
  | string
  | number

interface Props {
  modelValue: (string | number)[]
  options: SelectOption[]
  disabled?: boolean
  size?: SelectSize
  error?: boolean
  id?: string
  name?: string
  /** 表示するオプション数（selectのsize属性） */
  visibleOptions?: number
  /** オプションのラベルを取得するためのキー（オブジェクト配列の場合） */
  labelAttribute?: string
  /** オプションの値を取得するためのキー（オブジェクト配列の場合） */
  valueAttribute?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
  error: false,
  id: undefined,
  name: undefined,
  visibleOptions: 4,
  labelAttribute: 'label',
  valueAttribute: 'value'
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
  change: []
}>()

defineOptions({
  inheritAttrs: false
})

// オプションを正規化
const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return { label: String(option), value: option, disabled: false }
    }
    const optionObj = option as Record<string, unknown>
    return {
      label: String(optionObj[props.labelAttribute] ?? optionObj.label ?? ''),
      value: (optionObj[props.valueAttribute] ?? optionObj.value) as
        | string
        | number,
      disabled: !!optionObj.disabled
    }
  })
})

// 選択状態の確認
const isSelected = (value: string | number) => {
  return props.modelValue.includes(value)
}

// サイズに応じたクラス
const sizeClasses = computed(() => {
  const sizes: Record<SelectSize, string> = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
    xl: 'px-5 py-3 text-lg'
  }
  return sizes[props.size]
})

// 基本クラス
const baseClasses =
  'block w-full rounded-md bg-white text-gray-900 focus:outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-white'

// ボーダーとフォーカス時のクラス
const borderClasses = computed(() => {
  if (props.error) {
    return 'border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500'
  }
  return 'border border-gray-300 focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-primary)]/20 dark:border-gray-600'
})

// disabled時のクラス
const disabledClasses = computed(() => {
  if (props.disabled) {
    return 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
  }
  return ''
})

// 結合クラス
const selectClasses = computed(() => {
  return [
    baseClasses,
    borderClasses.value,
    sizeClasses.value,
    disabledClasses.value
  ]
    .filter(Boolean)
    .join(' ')
})

// changeハンドラ
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const selectedValues: (string | number)[] = []

  for (const option of target.selectedOptions) {
    const value = option.value
    // 数値の可能性がある場合は変換を試みる
    const numValue = Number(value)
    selectedValues.push(isNaN(numValue) ? value : numValue)
  }

  emit('update:modelValue', selectedValues)
  emit('change')
}
</script>

<style scoped>
select option {
  padding: 0.25rem 0.5rem;
  line-height: 1.5;
}

select option:checked {
  background: linear-gradient(0deg, rgb(191 219 254) 0%, rgb(191 219 254) 100%);
  color: rgb(30 64 175);
}

@media (prefers-color-scheme: dark) {
  select option:checked {
    background: linear-gradient(0deg, rgb(30 58 138) 0%, rgb(30 58 138) 100%);
    color: rgb(191 219 254);
  }
}
</style>
