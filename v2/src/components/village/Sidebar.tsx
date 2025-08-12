/**
 * 村画面のサイドバー
 *
 * 村情報、参加者一覧、メモ、ユーザー設定、ナビゲーションリンクを含む
 */

import React from 'react'
import { VillageInfo } from './sidebar/VillageInfo'
import { ParticipantList } from './sidebar/ParticipantList'
import { MemoSection } from './sidebar/MemoSection'
import { UserSettings } from './sidebar/UserSettings'
import { NavigationLinks } from './sidebar/NavigationLinks'
import { LoginStatus } from './sidebar/LoginStatus'
import { Advertisement } from './sidebar/Advertisement'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface SidebarProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
}

/**
 * 村画面のサイドバー
 *
 * 責任:
 * - 村情報の表示
 * - 参加者一覧の表示
 * - 個人抽出機能
 * - メモ機能
 * - ユーザー設定パネル
 * - ナビゲーションリンク
 * - ログイン状態表示
 * - 広告表示
 */
export const Sidebar: React.FC<SidebarProps> = ({ village, user }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* スクロール可能なメインコンテンツ */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* 村情報セクション */}
          <VillageInfo village={village} />

          {/* 参加者一覧セクション */}
          <ParticipantList village={village} user={user} />

          {/* メモセクション */}
          <MemoSection />

          {/* ユーザー設定セクション */}
          <UserSettings />

          {/* サイドバー広告（260x90px） */}
          <Advertisement
            slot="sidebar"
            style={{ width: '260px', height: '90px' }}
            className="mx-auto"
          />

          {/* ナビゲーションリンクセクション */}
          <NavigationLinks village={village} />
        </div>
      </div>

      {/* 固定フッター: ログイン状態 */}
      <div className="border-t bg-gray-50 p-4">
        <LoginStatus user={user} />
      </div>
    </div>
  )
}

// サイドバーのローディング状態
export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* 村情報のスケルトン */}
          <div className="space-y-3">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* 参加者一覧のスケルトン */}
          <div className="space-y-3">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* メモセクションのスケルトン */}
          <div className="space-y-3">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* ユーザー設定のスケルトン */}
          <div className="space-y-3">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* 広告のスケルトン */}
          <div className="w-full h-20 bg-gray-200 rounded animate-pulse mx-auto"></div>

          {/* ナビゲーションリンクのスケルトン */}
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* フッターのスケルトン */}
      <div className="border-t bg-gray-50 p-4">
        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

// サイドバーのエラー状態
export const SidebarError: React.FC<{ error: Error; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-white">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
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
          <h3 className="text-sm font-medium text-gray-900">サイドバーの読み込みに失敗しました</h3>
          <p className="mt-1 text-sm text-gray-500">{error.message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            再試行
          </button>
        )}
      </div>
    </div>
  )
}
