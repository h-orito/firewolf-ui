/**
 * 下部固定メニュー
 */

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { components } from '@/types/generated/api'

// 動的インポートでコード分割
const MessageFilterModal = dynamic(
  () => import('../MessageFilterModal').then((mod) => ({ default: mod.MessageFilterModal })),
  {
    ssr: false,
    loading: () => <div className="animate-pulse">読み込み中...</div>,
  }
)
type VillageView = components['schemas']['VillageView']

interface BottomFixedMenuProps {
  /** 村情報 */
  village: VillageView
}

/**
 * 下部固定メニュー
 *
 * 更新・抽出・最下部へ・残り時間ボタンを提供
 * 暫定実装
 */
export const BottomFixedMenu: React.FC<BottomFixedMenuProps> = ({ village }) => {
  const [remainingTime, setRemainingTime] = useState<string>('--:--')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // 残り時間の更新（暫定実装）
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: 実際の村の状態から残り時間を計算
      setRemainingTime('15:30')
    }, 1000)

    return () => clearInterval(interval)
  }, [village])

  const handleRefresh = () => {
    // ページリロード（未実装：実際にはデータの再取得）
    console.log('データを更新')
  }

  const handleMessageFilter = () => {
    setIsFilterModalOpen(true)
  }

  const handleScrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  // 参加者データ（プレースホルダー）
  const participants = [
    {
      id: 1,
      name: '村人A',
      shortName: '村A',
      characterIcon: '/images/characters/1.png',
      messageCount: 12,
    },
    // TODO: 実際の参加者データを取得
  ]

  return (
    <>
      <div className="fixed bottom-0 left-[280px] right-0 z-30 bg-white border-t shadow-sm dark-fixed-menu lg:left-[280px] left-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* 更新ボタン */}
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>更新</span>
            </button>

            {/* 抽出ボタン */}
            <button
              onClick={handleMessageFilter}
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

            {/* 最下部へボタン */}
            <button
              onClick={handleScrollToBottom}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span>最下部</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* 残り時間表示 */}
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-mono text-gray-700">{remainingTime}</span>
            </div>

            {/* 自動更新表示 */}
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">自動更新</span>
            </div>
          </div>
        </div>
      </div>

      {/* MessageFilterModal */}
      <MessageFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        participants={participants}
      />
    </>
  )
}
