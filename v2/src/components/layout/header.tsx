'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { LoginModal } from '@/components/auth/login-modal'
import { AccountLinkModal } from '@/components/auth/account-link-modal'
import { UserMenu } from '@/components/auth/user-menu'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAccountLinkModalOpen, setIsAccountLinkModalOpen] = useState(false)
  const {
    user,
    signInWithGoogle,
    signInWithTwitter,
    signOut,
    linkWithGoogle,
    linkWithTwitter,
    getLinkedProviders,
    getUserDisplayName,
    isLoading,
  } = useAuth()
  const isStaging = process.env.NODE_ENV !== 'production'

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogin = async (provider: 'google' | 'twitter') => {
    try {
      if (provider === 'google') {
        await signInWithGoogle()
      } else {
        await signInWithTwitter()
      }
      setIsLoginModalOpen(false)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleAccountLink = async (provider: 'google' | 'twitter') => {
    try {
      if (provider === 'google') {
        await linkWithGoogle()
      } else {
        await linkWithTwitter()
      }
    } catch (error) {
      console.error('Account linking error:', error)
    }
  }

  return (
    <>
      {/* 固定ナビバーのためのスペース */}
      <div className="h-14 bg-black" />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* ハンバーガーメニュー（モバイル） */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="text-white hover:bg-gray-800"
              >
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="w-6 h-6" />
              </Button>
            </div>

            {/* ロゴ */}
            <div className="flex-1 md:flex-none">
              <Link
                href="/"
                className="text-white font-bold text-lg hover:text-gray-300 transition-colors block text-center md:text-left"
              >
                FIREWOLF
              </Link>
            </div>

            {/* モバイル用ログイン状態表示 */}
            <div className="md:hidden">
              {isLoading ? (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-white text-xs">確認中...</span>
                </div>
              ) : user ? (
                <UserMenu
                  username={
                    getUserDisplayName().length > 10
                      ? `${getUserDisplayName().slice(0, 10)}...`
                      : getUserDisplayName()
                  }
                  onLogout={signOut}
                  onOpenAccountLink={() => setIsAccountLinkModalOpen(true)}
                />
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-xs px-2 py-1"
                >
                  ログイン
                </Button>
              )}
            </div>

            {/* デスクトップメニュー */}
            <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
              <Link
                href="/village-list"
                className="text-white hover:text-gray-300 transition-colors"
              >
                村一覧
              </Link>
              <Link href="/rule" className="text-white hover:text-gray-300 transition-colors">
                ルール
              </Link>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-white text-sm">認証確認中...</span>
                </div>
              ) : user ? (
                <>
                  <Link
                    href="/village/create"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    村作成
                  </Link>
                  <Link
                    href="/setting"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    設定
                  </Link>
                  <UserMenu
                    username={getUserDisplayName()}
                    onLogout={signOut}
                    onOpenAccountLink={() => setIsAccountLinkModalOpen(true)}
                  />
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                  ログイン
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 bg-black/95">
              {/* ゲーム */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-300">ゲーム</h4>
                <div className="space-y-2">
                  <Link
                    href="/village-list"
                    className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors text-sm"
                    onClick={closeMenu}
                  >
                    村一覧
                  </Link>
                  <Link
                    href="/charachip-list"
                    className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors text-sm"
                    onClick={closeMenu}
                  >
                    キャラチップ一覧
                  </Link>
                  <Link
                    href="/rule"
                    className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors text-sm"
                    onClick={closeMenu}
                  >
                    ルール説明
                  </Link>
                  <Link
                    href="/faq"
                    className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors text-sm"
                    onClick={closeMenu}
                  >
                    よくある質問
                  </Link>
                </div>
              </div>

              {user && (
                <>
                  {/* ユーザー */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-gray-300">ユーザー</h4>
                    <div className="space-y-2">
                      <Link
                        href="/village/create"
                        className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors text-sm"
                        onClick={closeMenu}
                      >
                        村作成
                      </Link>
                      <Link
                        href="/mypage"
                        className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors text-sm"
                        onClick={closeMenu}
                      >
                        マイページ
                      </Link>
                      <Link
                        href="/setting"
                        className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors text-sm"
                        onClick={closeMenu}
                      >
                        設定
                      </Link>
                    </div>
                  </div>

                  {/* アカウント */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-gray-300">アカウント</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setIsAccountLinkModalOpen(true)
                          closeMenu()
                        }}
                        className="block w-full text-left px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors text-sm"
                      >
                        アカウント連携
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          signOut()
                          closeMenu()
                        }}
                        className="mx-3 text-white border border-gray-600 hover:bg-gray-800 hover:text-white text-sm"
                      >
                        ログアウト
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {!user && (
                <div className="mt-4">
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsLoginModalOpen(true)
                      closeMenu()
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
                  >
                    ログイン
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* モーダル */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onGoogleLogin={() => handleLogin('google')}
        onTwitterLogin={() => handleLogin('twitter')}
        isLoading={isLoading}
      />

      <AccountLinkModal
        isOpen={isAccountLinkModalOpen}
        onClose={() => setIsAccountLinkModalOpen(false)}
        onLinkGoogle={() => handleAccountLink('google')}
        onLinkTwitter={() => handleAccountLink('twitter')}
        linkedProviders={getLinkedProviders()}
        isLoading={isLoading}
      />
    </>
  )
}
