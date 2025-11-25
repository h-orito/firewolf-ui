<template>
  <component :is="iconComponent" v-if="iconComponent" :class="iconClass" />
  <span v-else :class="iconClass" />
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

// 24px outline icons
import {
  ArrowPathIcon as ArrowPathIconOutline,
  ExclamationCircleIcon as ExclamationCircleIconOutline,
  QuestionMarkCircleIcon as QuestionMarkCircleIconOutline,
  InformationCircleIcon as InformationCircleIconOutline,
  DocumentTextIcon as DocumentTextIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  HomeIcon as HomeIconOutline,
  UsersIcon as UsersIconOutline,
  ChartBarIcon as ChartBarIconOutline
} from '@heroicons/vue/24/outline'

// 20px solid icons
import {
  ChevronLeftIcon as ChevronLeftIcon20Solid,
  ChevronRightIcon as ChevronRightIcon20Solid,
  ArrowUpIcon as ArrowUpIcon20Solid,
  ArrowDownIcon as ArrowDownIcon20Solid,
  ArrowPathIcon as ArrowPathIcon20Solid,
  Bars3Icon as Bars3Icon20Solid,
  MagnifyingGlassIcon as MagnifyingGlassIcon20Solid,
  XMarkIcon as XMarkIcon20Solid
} from '@heroicons/vue/20/solid'

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  name: string
  size?: IconSize
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  class: undefined
})

// アイコン名からコンポーネントへのマッピング (i-heroicons-xxx形式)
// heroicons以外のアイコン（twitter, google等）が必要な場合はここに追加
const iconMap: Record<string, Component> = {
  // 24px outline (default)
  'i-heroicons-arrow-path': ArrowPathIconOutline,
  'i-heroicons-exclamation-circle': ExclamationCircleIconOutline,
  'i-heroicons-question-mark-circle': QuestionMarkCircleIconOutline,
  'i-heroicons-information-circle': InformationCircleIconOutline,
  'i-heroicons-document-text': DocumentTextIconOutline,
  'i-heroicons-cog-6-tooth': Cog6ToothIconOutline,
  'i-heroicons-home': HomeIconOutline,
  'i-heroicons-users': UsersIconOutline,
  'i-heroicons-chart-bar': ChartBarIconOutline,

  // 20px solid
  'i-heroicons-chevron-left-20-solid': ChevronLeftIcon20Solid,
  'i-heroicons-chevron-right-20-solid': ChevronRightIcon20Solid,
  'i-heroicons-arrow-up-20-solid': ArrowUpIcon20Solid,
  'i-heroicons-arrow-down-20-solid': ArrowDownIcon20Solid,
  'i-heroicons-arrow-path-20-solid': ArrowPathIcon20Solid,
  'i-heroicons-bars-3-20-solid': Bars3Icon20Solid,
  'i-heroicons-magnifying-glass-20-solid': MagnifyingGlassIcon20Solid,
  'i-heroicons-x-mark-20-solid': XMarkIcon20Solid
}

const sizeClasses: Record<IconSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8'
}

const iconComponent = computed(() => {
  const icon = iconMap[props.name]
  if (!icon) {
    console.warn(`[Icon] Unknown icon name: ${props.name}`)
  }
  return icon
})

const iconClass = computed(() => {
  const classes: string[] = []

  // Add size class if no custom class with h-/w- is provided
  const customClass = props.class
  if (!customClass || !customClass.match(/[hw]-\d/)) {
    const size: IconSize = props.size ?? 'md'
    classes.push(sizeClasses[size])
  }

  if (customClass) {
    classes.push(customClass)
  }

  return classes.join(' ')
})
</script>
