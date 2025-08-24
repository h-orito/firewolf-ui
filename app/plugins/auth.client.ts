export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // クライアントサイドでのみ認証状態を初期化
  authStore.initializeAuth()
})
