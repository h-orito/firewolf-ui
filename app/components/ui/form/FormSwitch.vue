<template>
  <div class="flex items-start">
    <USwitch v-model="model" class="mt-1" />
    <div class="ml-3 text-left">
      <label class="text-sm font-medium text-gray-700">{{ label }}</label>
      <p v-if="description" class="mt-1 text-xs text-gray-500">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  label: string
  description?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})
</script>
