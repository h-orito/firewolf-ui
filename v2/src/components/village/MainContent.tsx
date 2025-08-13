/**
 * 村画面のメインコンテンツ
 *
 * 固定メニュー、村ヘッダー、発言一覧、アクションパネルを含む
 */

import React, { useEffect, useRef, useCallback, useState } from 'react'
import { TopFixedMenu } from './main/TopFixedMenu'
import { BottomFixedMenu } from './main/BottomFixedMenu'
import { VillageHeader } from './main/VillageHeader'
import { MessageList } from './main/MessageList'
import { ActionPanel } from './main/ActionPanel'
import { Advertisement } from './sidebar/Advertisement'
import { useVillageStore } from '@/stores/village'
import { useVillageMessagesFlat } from '@/hooks/village/use-village-messages-infinite-query'
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
 * - 発言一覧の表示（無限スクロール対応）
 * - アクションパネルの表示
 * - レスポンシブ広告の表示
 */
export const MainContent: React.FC<MainContentProps> = ({ village, user, initialDay }) => {
  const { currentDay } = useVillageStore()

  // 現在の日付情報を取得（APIから村の日数情報を取得し、現在の日を決定）
  const currentVillageDay = currentDay || village.day.day_list.length || 1

  // TODO: 現在時刻（昼/夜）の決定ロジックを実装
  // 仮で昼（day）を設定、実際は村の状態から判断する必要がある
  const currentNoonnight = 'day'

  // 表示モードの状態管理
  const [displayMode, setDisplayMode] = useState<'infinite' | 'pagination' | 'virtualized'>(
    'infinite'
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50) // 1ページあたりの表示件数

  // メッセージデータの取得（無限スクロール対応）
  const { allMessages, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useVillageMessagesFlat({
      villageId: village.id.toString(),
      day: currentVillageDay,
      noonnight: currentNoonnight,
      villageStatus: village.status,
      enabled: true,
    })

  // 無限スクロール用のセンチネル要素の参照
  const sentinelRef = useRef<HTMLDivElement>(null)

  // 無限スクロールの実装
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]
  )

  // Intersection Observerの設定
  useEffect(() => {
    const element = sentinelRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px', // 100px手前で次のページを読み込む
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
      observer.disconnect()
    }
  }, [handleObserver])

  // アンカークリック処理
  const handleAnchorClick = useCallback((anchorType: string, anchorValue: string) => {
    // TODO: アンカークリック処理の実装
    // 設定に応じて貼り付けまたはコピー処理を実行
    console.log('アンカークリック:', anchorType, anchorValue)
  }, [])

  // 個人抽出クリック処理
  const handlePersonalExtractionClick = useCallback((participantId: number) => {
    // TODO: 個人抽出処理の実装
    // URLパラメータを更新して個人抽出表示に切り替え
    console.log('個人抽出クリック:', participantId)
  }, [])

  // ページネーション用のメッセージ処理
  const paginatedMessages = React.useMemo(() => {
    if (displayMode === 'infinite') {
      return allMessages
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allMessages.slice(startIndex, endIndex)
  }, [allMessages, displayMode, currentPage, itemsPerPage])

  // 総ページ数の計算
  const totalPages = Math.ceil(allMessages.length / itemsPerPage)

  // ページ変更ハンドラー
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    // ページ変更時に最上部にスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // 表示モード変更ハンドラー
  const handleDisplayModeChange = useCallback((mode: 'infinite' | 'pagination' | 'virtualized') => {
    setDisplayMode(mode)
    if (mode === 'pagination') {
      setCurrentPage(1) // ページネーションモードに切り替え時は1ページ目に戻る
    }
  }, [])

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
              <Advertisement slot="main-top" responsive={true} className="w-full" />

              {/* 表示モード切り替え */}
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">表示モード</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDisplayModeChange('infinite')}
                      className={`px-3 py-1 rounded text-sm ${
                        displayMode === 'infinite'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      無限スクロール
                    </button>
                    <button
                      onClick={() => handleDisplayModeChange('pagination')}
                      className={`px-3 py-1 rounded text-sm ${
                        displayMode === 'pagination'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ページネーション
                    </button>
                    <button
                      onClick={() => handleDisplayModeChange('virtualized')}
                      className={`px-3 py-1 rounded text-sm ${
                        displayMode === 'virtualized'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      仮想化
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {displayMode === 'pagination' && (
                    <span>
                      {itemsPerPage} 件ずつ表示 | 全 {allMessages.length} 件
                    </span>
                  )}
                  {displayMode === 'virtualized' && (
                    <span>大量データ最適表示 | 全 {allMessages.length} 件</span>
                  )}
                  {displayMode === 'infinite' && (
                    <span>自動読み込み | 全 {allMessages.length} 件</span>
                  )}
                </div>
              </div>

              {/* 発言一覧 */}
              <MessageList
                village={village}
                messages={paginatedMessages}
                isLoading={isLoading}
                displayMode={displayMode}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                hasNextPage={hasNextPage}
                isNextPageLoading={isFetchingNextPage}
                loadNextPage={async (startIndex, stopIndex) => {
                  // 仮想化モードでの無限スクロール対応
                  if (displayMode === 'virtualized' && hasNextPage && !isFetchingNextPage) {
                    await fetchNextPage()
                  }
                }}
                onAnchorClick={handleAnchorClick}
                onPersonalExtractionClick={handlePersonalExtractionClick}
              />

              {/* 次ページ読み込み中の表示（無限スクロールモード時のみ） */}
              {displayMode === 'infinite' && isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    さらに読み込み中...
                  </div>
                </div>
              )}

              {/* 無限スクロール用のセンチネル（無限スクロールモード時のみ） */}
              {displayMode === 'infinite' && <div ref={sentinelRef} className="h-1"></div>}

              {/* レスポンシブ広告（メインコンテンツ下部） */}
              <Advertisement slot="main-bottom" responsive={true} className="w-full" />
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
