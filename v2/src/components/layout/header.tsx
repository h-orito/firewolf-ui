'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signInWithGoogle, signInWithTwitter, signOut } = useAuth()
  const isStaging = process.env.NODE_ENV !== 'production'

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>

            {/* ロゴ */}
            <div className="flex-1 flex justify-center md:justify-start">
              <Link
                href="/"
                className="text-white font-bold text-lg hover:text-gray-300 transition-colors"
              >
                FIREWOLF
              </Link>
            </div>

            {/* デスクトップメニュー */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-gray-300 transition-colors">
                トップ
              </Link>
              <Link
                href="/village-list"
                className="text-white hover:text-gray-300 transition-colors"
              >
                村一覧
              </Link>
              <Link href="/rule" className="text-white hover:text-gray-300 transition-colors">
                ルール
              </Link>
              {user ? (
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="text-white border-gray-600 hover:bg-gray-800"
                  >
                    ログアウト
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signInWithGoogle}
                    className="text-white border-gray-600 hover:bg-gray-800"
                  >
                    Googleログイン
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signInWithTwitter}
                    className="text-white border-gray-600 hover:bg-gray-800"
                  >
                    Twitterログイン
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95">
              <Link
                href="/"
                className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors"
                onClick={closeMenu}
              >
                トップ
              </Link>
              <Link
                href="/village-list"
                className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors"
                onClick={closeMenu}
              >
                村一覧
              </Link>
              <Link
                href="/rule"
                className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors"
                onClick={closeMenu}
              >
                ルール
              </Link>
              {user ? (
                <>
                  <Link
                    href="/village/create"
                    className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    村作成
                  </Link>
                  <Link
                    href="/setting"
                    className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    設定
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut()
                      closeMenu()
                    }}
                    className="mx-3 my-2 text-white border-gray-600 hover:bg-gray-800"
                  >
                    ログアウト
                  </Button>
                </>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signInWithGoogle()
                      closeMenu()
                    }}
                    className="w-full text-white border-gray-600 hover:bg-gray-800"
                  >
                    Googleログイン
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signInWithTwitter()
                      closeMenu()
                    }}
                    className="w-full text-white border-gray-600 hover:bg-gray-800"
                  >
                    Twitterログイン
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
