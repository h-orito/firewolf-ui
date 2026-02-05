<template>
  <div
    class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="text-sm text-gray-500 dark:text-gray-400">
      {{ title }}（未実装）
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>
