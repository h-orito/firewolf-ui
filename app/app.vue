<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
</template>

<script setup lang="ts">
import Toast from '~/components/ui/feedback/Toast.vue'

// TODO: Auth store初期化は後で有効化
// const { initializeAuth } = useAuthStore()
// onMounted(() => {
//   initializeAuth()
// })
</script>
