/**
 * 村画面のレスポンシブレイアウト
 *
 * デスクトップ: 左右分割レイアウト（サイドバー + メインコンテンツ）
 * モバイル: ハンバーガーメニュー + オーバーレイサイドバー
 */

import React, { useState, useEffect } from 'react'
import { useVillageStore } from '@/stores/village'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'
import { Footer } from '@/components/layout/Footer'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface VillageLayoutProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
  /** 初期表示日 */
  initialDay?: number
}

/**
 * 村画面のレスポンシブレイアウト
 *
 * 責任:
 * - デスクトップ/モバイルの画面サイズ対応
 * - サイドバーの開閉状態管理

 * - レイアウトの動的切り替え
 */
export const VillageLayout: React.FC<VillageLayoutProps> = ({ village, user, initialDay }) => {
  const { isSidebarOpen, setSidebarOpen } = useVillageStore()
  const [isMobile, setIsMobile] = useState(false)

  // レスポンシブ対応: 画面サイズの監視
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // 画面サイズに応じたサイドバー初期状態設定
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false) // モバイルでは初期状態で閉じる
    } else {
      setSidebarOpen(true) // PC・タブレットでは常に開く
    }
  }, [isMobile, setSidebarOpen])

  // サイドバーの開閉ハンドラー（モバイル時のみ使用）
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!isSidebarOpen)
    }
  }

  // オーバーレイクリック時のサイドバー閉じる（モバイルのみ）
  const handleOverlayClick = () => {
    if (isMobile && isSidebarOpen) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* メインレイアウト */}
      <div className="flex">
        {/* デスクトップ用サイドバー */}
        {!isMobile && (
          <aside
            className={`sticky top-0 h-screen transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'w-80' : 'w-0'
            } overflow-hidden bg-white border-r shadow-sm flex-shrink-0`}
          >
            {isSidebarOpen && (
              <div className="w-80 h-full overflow-y-auto">
                <Sidebar village={village} user={user} />
              </div>
            )}
          </aside>
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 min-h-screen flex flex-col">
          <div className="flex-1">
            <MainContent village={village} user={user} initialDay={initialDay} />
          </div>
          <div className="mb-16">
            <Footer />
          </div>
        </main>
      </div>

      {/* モバイル用オーバーレイサイドバー */}
      {isMobile && (
        <>
          {/* オーバーレイ背景 */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
              onClick={handleOverlayClick}
              aria-hidden="true"
            />
          )}

          {/* スライダーサイドバー */}
          <aside
            className={`fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* モバイル用ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{village.name}</h2>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {village.status.name}
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="サイドバーを閉じる"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* サイドバーコンテンツ */}
            <div className="h-full overflow-y-auto">
              <Sidebar village={village} user={user} />
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
