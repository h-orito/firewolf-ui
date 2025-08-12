/**
 * 村画面のメインコンテンツ
 *
 * 固定メニュー、村ヘッダー、発言一覧、アクションパネルを含む
 */

import React from 'react'
import { TopFixedMenu } from './main/TopFixedMenu'
import { BottomFixedMenu } from './main/BottomFixedMenu'
import { VillageHeader } from './main/VillageHeader'
import { MessageList } from './main/MessageList'
import { ActionPanel } from './main/ActionPanel'
import { Advertisement } from './sidebar/Advertisement'
import { useVillageStore } from '@/stores/village'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface MainContentProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
  /** 初期表示日 */
  initialDay?: number
}

/**
 * 村画面のメインコンテンツ
 *
 * 責任:
 * - 上部・下部固定メニューの表示
 * - 村ヘッダー（村名・日付ナビゲーション）
 * - 発言一覧の表示
 * - アクションパネルの表示
 * - レスポンシブ広告の表示
 */
export const MainContent: React.FC<MainContentProps> = ({ village, user, initialDay }) => {
  const { currentDay } = useVillageStore()

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 上部固定メニュー */}
      <TopFixedMenu village={village} />

      {/* メインコンテンツエリア */}
      <div className="pt-16 pb-16">
        {' '}
        {/* 上下固定メニュー分のパディング */}
        {/* 村ヘッダー */}
        <VillageHeader village={village} />
        {/* コンテンツとサイドバー */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* メインコンテンツ（発言一覧） */}
            <div className="xl:col-span-3 space-y-6">
              {/* レスポンシブ広告（メインコンテンツ上部） */}
              <Advertisement slot="main-top" className="w-full" style={{ minHeight: '90px' }} />

              {/* 発言一覧 */}
              <MessageList village={village} />

              {/* レスポンシブ広告（メインコンテンツ下部） */}
              <Advertisement slot="main-bottom" className="w-full" style={{ minHeight: '90px' }} />
            </div>

            {/* アクションパネル */}
            <div className="xl:col-span-1">
              <div className="sticky top-20">
                {' '}
                {/* 上部固定メニューの高さを考慮 */}
                <ActionPanel village={village} user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 下部固定メニュー */}
      <BottomFixedMenu village={village} />
    </div>
  )
}

// メインコンテンツのローディング状態
export const MainContentSkeleton: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 上部固定メニューのスケルトン */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b shadow-sm">
        <div className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* メインコンテンツのスケルトン */}
      <div className="pt-16 pb-16">
        {/* 村ヘッダーのスケルトン */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="flex space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* 発言一覧のスケルトン */}
            <div className="xl:col-span-3 space-y-6">
              {/* 広告のスケルトン */}
              <div className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>

              {/* 発言アイテムのスケルトン */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-full h-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 広告のスケルトン */}
              <div className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* アクションパネルのスケルトン */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow p-4 space-y-4">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 下部固定メニューのスケルトン */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-sm">
        <div className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

// メインコンテンツのエラー状態
export const MainContentError: React.FC<{
  error: Error
  onRetry?: () => void
}> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">村画面の読み込みに失敗しました</h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            再試行
          </button>
        )}
      </div>
    </div>
  )
}
