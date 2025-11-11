<template>
  <UBadge :color="color" :variant="variant" :size="size" :class="badgeClass">
    <slot />
  </UBadge>
</template>

<script setup lang="ts">
interface Props {
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
  variant?: 'solid' | 'outline' | 'soft' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'solid',
  size: 'sm',
  class: undefined
})

const badgeClass = computed(() => {
  return props.class || ''
})
</script>
