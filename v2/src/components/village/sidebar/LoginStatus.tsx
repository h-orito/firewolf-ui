/**
 * ログイン状態表示コンポーネント
 */

import { LoginModal } from '@/components/auth/LoginModal'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface LoginStatusProps {
  /** ログインユーザー情報 */
  user?: any
}

/**
 * ログイン状態表示
 *
 * ログイン状態とユーザー情報を表示
 * 暫定実装
 */
export const LoginStatus: React.FC<LoginStatusProps> = ({ user }) => {
  const router = useRouter()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const {
    isAuthenticated,
    getUserDisplayName,
    signOut,
    signInWithGoogle,
    signInWithTwitter,
    isLoading,
  } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <>
        <div className="text-center">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="text-xs py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ログイン
          </button>
        </div>

        {/* ログインモーダル */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onGoogleLogin={async () => {
            try {
              await signInWithGoogle()
              setIsLoginModalOpen(false)
            } catch (error) {
              console.error('Login error:', error)
            }
          }}
          onTwitterLogin={async () => {
            try {
              await signInWithTwitter()
              setIsLoginModalOpen(false)
            } catch (error) {
              console.error('Login error:', error)
            }
          }}
          isLoading={isLoading}
        />
      </>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-sm truncate flex-1 pr-2 text-gray-900">
        {getUserDisplayName()}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => router.push('/mypage')}
          className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          マイページ
        </button>
        <button
          onClick={signOut}
          className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}
