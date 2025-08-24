export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // 初期化されていない場合は初期化
  if (!authStore.isLoading) {
    authStore.initializeAuth()
  }

  // 認証が必要なルートのパスを定義
  const authRequiredPaths = ['/create-village', '/setting']

  // 現在のパスが認証必要なパスかチェック
  const requiresAuth = authRequiredPaths.some((path) =>
    to.path.startsWith(path)
  )

  if (requiresAuth && !authStore.isAuthenticated && !authStore.isLoading) {
    // 認証が必要だが未認証の場合はトップページへリダイレクト
    return navigateTo('/')
  }
})
