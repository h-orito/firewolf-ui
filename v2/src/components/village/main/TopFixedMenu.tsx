/**
 * 上部固定メニュー
 */

import React from 'react'
import { useVillageStore } from '@/stores/village'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface TopFixedMenuProps {
  /** 村情報 */
  village: VillageView
}

/**
 * 上部固定メニュー
 *
 * 前日・翌日・最上部へボタンを提供
 * 暫定実装
 */
export const TopFixedMenu: React.FC<TopFixedMenuProps> = ({ village }) => {
  const { setSidebarOpen } = useVillageStore()
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(true)
    }
  }
  const handlePreviousDay = () => {
    // 前日へ移動（未実装）
    console.log('前日へ移動')
  }

  const handleNextDay = () => {
    // 翌日へ移動（未実装）
    console.log('翌日へ移動')
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed top-0 left-80 right-0 z-30 bg-white border-b shadow-sm dark-fixed-menu lg:left-80 left-0">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* モバイル用ハンバーガーメニュー */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="サイドバーを開く"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* 日付ナビゲーション */}
          <button
            onClick={handlePreviousDay}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>前日</span>
          </button>

          <button
            onClick={handleNextDay}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>翌日</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* 最上部へボタン */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span>最上部</span>
          </button>

          {/* フィルタボタン */}
          <button
            onClick={() => {
              // メッセージフィルタモーダル表示（未実装）
              console.log('メッセージフィルタモーダルを表示')
            }}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
            <span>抽出</span>
          </button>
        </div>
      </div>
    </div>
  )
}
