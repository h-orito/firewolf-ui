import { defineStore } from 'pinia'
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  linkWithPopup,
  signOut,
  GoogleAuthProvider,
  TwitterAuthProvider,
  type User,
  type UserCredential
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(true)

  const auth = getAuth()

  const initializeAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      isLoading.value = false
    })
  }

  const signInWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result
  }

  const signInWithTwitter = async (): Promise<UserCredential> => {
    const provider = new TwitterAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result
  }

  const linkWithGoogle = async (): Promise<UserCredential> => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in')
    }
    const provider = new GoogleAuthProvider()
    const result = await linkWithPopup(auth.currentUser, provider)
    return result
  }

  const linkWithTwitter = async (): Promise<UserCredential> => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in')
    }
    const provider = new TwitterAuthProvider()
    const result = await linkWithPopup(auth.currentUser, provider)
    return result
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
  }

  const waitForAuth = (): Promise<User | null> => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        resolve(user)
      })
    })
  }

  // 認証トークンの取得
  const getAuthToken = async (): Promise<string | null> => {
    const tokenCookie = useCookie<string | null>('id-token', {
      default: () => null,
      maxAge: 60 * 60 * 24 * 30, // 30日
      sameSite: 'strict',
      secure: import.meta.env.PROD
    })
    const checkDateCookie = useCookie<string | null>('id-token-check-date', {
      default: () => null,
      maxAge: 60 * 60 * 24 * 30, // 30日
      sameSite: 'strict',
      secure: import.meta.env.PROD
    })

    let token = tokenCookie.value
    const currentUser = user.value

    if (!token || !currentUser) {
      return null
    }

    // 有効期限チェック
    const expired = checkDateCookie.value
      ? new Date(checkDateCookie.value)
      : new Date(0)
    if (new Date().getTime() >= expired.getTime()) {
      // 期限切れの場合は更新
      try {
        token = await currentUser.getIdToken(true)

        // Cookieに保存
        tokenCookie.value = token

        // 50分後に期限切れとして設定
        const now = new Date()
        const newExpired = new Date(
          now.getTime() + 50 * 60 * 1000
        ).toISOString()
        checkDateCookie.value = newExpired
      } catch (error) {
        console.error('Failed to refresh token:', error)
        return null
      }
    }

    return token
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    initializeAuth,
    signInWithGoogle,
    signInWithTwitter,
    linkWithGoogle,
    linkWithTwitter,
    logout,
    waitForAuth,
    getAuthToken
  }
})
