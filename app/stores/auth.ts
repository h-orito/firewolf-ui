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
    waitForAuth
  }
})
