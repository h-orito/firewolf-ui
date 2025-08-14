import { useEffect } from 'react'
import {
  signInWithPopup,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signOut,
  onAuthStateChanged,
  linkWithPopup,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/stores/auth'

export const useAuth = () => {
  const { user, isLoading, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return unsubscribe
  }, [setUser])

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithTwitter = async () => {
    try {
      setLoading(true)
      const provider = new TwitterAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      console.error('Twitter sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut(auth)
      logout()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const isAuthenticated = !!user

  const login = async (provider: 'google' | 'twitter') => {
    if (provider === 'google') {
      return signInWithGoogle()
    } else {
      return signInWithTwitter()
    }
  }

  const linkWithGoogle = async () => {
    if (!user) throw new Error('User not authenticated')
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await linkWithPopup(user, provider)
      return result.user
    } catch (error) {
      console.error('Google account linking error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const linkWithTwitter = async () => {
    if (!user) throw new Error('User not authenticated')
    try {
      setLoading(true)
      const provider = new TwitterAuthProvider()
      const result = await linkWithPopup(user, provider)
      return result.user
    } catch (error) {
      console.error('Twitter account linking error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getLinkedProviders = () => {
    if (!user) return []
    return user.providerData.map((provider) => provider.providerId)
  }

  const isProviderLinked = (providerId: string) => {
    if (!user) return false
    return user.providerData.some((provider) => provider.providerId === providerId)
  }

  const getUserDisplayName = () => {
    return user?.displayName || user?.email || 'ユーザー'
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout: handleSignOut,
    signInWithGoogle,
    signInWithTwitter,
    signOut: handleSignOut,
    linkWithGoogle,
    linkWithTwitter,
    getLinkedProviders,
    isProviderLinked,
    getUserDisplayName,
  }
}
