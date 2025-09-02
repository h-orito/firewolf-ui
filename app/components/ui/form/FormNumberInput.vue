<template>
  <UInput
    v-model="model"
    type="number"
    :min="min"
    :max="max"
    :step="step"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :class="inputClass"
    :size="size"
    :ui="{
      base: 'text-right'
    }"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  min?: number
  max?: number
  step?: number
  placeholder?: string
  required?: boolean
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: undefined,
  max: undefined,
  step: 1,
  placeholder: '',
  required: false,
  disabled: false,
  size: 'md',
  class: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const inputClass = computed(() => props.class)

const model = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value)
})
</script>
