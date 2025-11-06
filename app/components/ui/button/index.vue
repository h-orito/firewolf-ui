<template>
  <UButton
    :color="color"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :block="block"
    :icon="icon"
    :trailing-icon="trailingIcon"
    :type="type"
    :class="buttonClass"
    @click="$emit('click', $event)"
  >
    <slot />
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'neutral'
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
  trailingIcon?: string
  type?: 'button' | 'submit' | 'reset'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'solid',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  icon: undefined,
  trailingIcon: undefined,
  type: 'button',
  class: undefined
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => {
  return props.class || ''
})
</script>
