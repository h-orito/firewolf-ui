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
 * - 共通ヘッダーの非表示機能
 * - レイアウトの動的切り替え
 */
export const VillageLayout: React.FC<VillageLayoutProps> = ({ village, user, initialDay }) => {
  const { isSidebarOpen, setSidebarOpen } = useVillageStore()
  const [isMobile, setIsMobile] = useState(false)
  const [hideCommonHeader, setHideCommonHeader] = useState(false)

  // レスポンシブ対応: 画面サイズの監視
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // モバイル時のサイドバー初期状態設定
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false) // モバイルでは初期状態で閉じる
    }
  }, [isMobile, setSidebarOpen])

  // サイドバーの開閉ハンドラー
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  // オーバーレイクリック時のサイドバー閉じる（モバイルのみ）
  const handleOverlayClick = () => {
    if (isMobile && isSidebarOpen) {
      setSidebarOpen(false)
    }
  }

  // 共通ヘッダー表示切り替え
  const toggleCommonHeader = () => {
    setHideCommonHeader(!hideCommonHeader)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 共通ヘッダー（切り替え可能） */}
      {!hideCommonHeader && (
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
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

              {/* 村名表示 */}
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
                  {village.name}
                </h1>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {village.status.name}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* ヘッダー表示切り替えボタン */}
              <button
                onClick={toggleCommonHeader}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="ヘッダーを隠す"
                title="ヘッダーを隠す"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>

              {/* デスクトップ用サイドバー切り替え */}
              {!isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={isSidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isSidebarOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* ヘッダーが隠れている場合の復活ボタン */}
      {hideCommonHeader && (
        <button
          onClick={toggleCommonHeader}
          className="fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="ヘッダーを表示"
          title="ヘッダーを表示"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* メインレイアウト */}
      <div className="flex">
        {/* デスクトップ用サイドバー */}
        {!isMobile && (
          <aside
            className={`transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'w-80' : 'w-0'
            } overflow-hidden bg-white border-r shadow-sm`}
          >
            {isSidebarOpen && (
              <div className="w-80 h-full">
                <Sidebar village={village} user={user} />
              </div>
            )}
          </aside>
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 min-h-screen">
          <MainContent village={village} user={user} initialDay={initialDay} />
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
              <h2 className="text-lg font-semibold text-gray-900 truncate">{village.name}</h2>
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
