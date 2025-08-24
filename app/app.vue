<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
// Auth store初期化
const { initializeAuth } = useAuthStore()
onMounted(() => {
  initializeAuth()
})
</script>
