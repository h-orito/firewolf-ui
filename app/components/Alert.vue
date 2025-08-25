<template>
  <div :class="alertClasses">
    <div v-if="icon || title" class="flex items-start">
      <Icon v-if="icon" :name="icon" class="w-5 h-5 flex-shrink-0 mr-3" />
      <div class="flex-1">
        <h3 v-if="title" class="font-medium text-sm mb-1">{{ title }}</h3>
        <div v-if="description" class="text-sm">{{ description }}</div>
        <div v-if="$slots.default" class="text-sm">
          <slot />
        </div>
      </div>
    </div>
    <div v-else class="text-sm">
      <div v-if="description">{{ description }}</div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'default' | 'info' | 'success' | 'warning' | 'error'
  title?: string
  description?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  title: undefined,
  description: undefined,
  icon: undefined
})

const alertClasses = computed(() => {
  const baseClasses = 'p-6 rounded text-left'

  const typeClasses = {
    default: 'bg-[#eee] dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    info: 'bg-[#ceedf2] dark:bg-cyan-900/20 text-gray-800 dark:text-cyan-100',
    success:
      'bg-[#cef2ce] dark:bg-green-900/20 text-gray-800 dark:text-green-100',
    warning:
      'bg-[#f2f2ce] dark:bg-yellow-900/20 text-gray-800 dark:text-yellow-100',
    error: 'bg-[#f2cece] dark:bg-red-900/20 text-gray-800 dark:text-red-100'
  }

  return `${baseClasses} ${typeClasses[props.type]}`
})
</script>
