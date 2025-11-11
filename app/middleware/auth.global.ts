export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  // 初期化されていない場合は初期化
  if (!auth.isLoading) {
    auth.initializeAuth()
  }

  // 認証が必要なルートのパスを定義
  const authRequiredPaths = ['/create-village', '/setting']

  // 現在のパスが認証必要なパスかチェック
  const requiresAuth = authRequiredPaths.some((path) =>
    to.path.startsWith(path)
  )

  if (requiresAuth && !auth.isAuthenticated && !auth.isLoading) {
    // 認証が必要だが未認証の場合はトップページへリダイレクト
    return navigateTo('/')
  }
})
