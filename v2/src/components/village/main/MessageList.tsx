/**
 * 発言一覧コンポーネント
 */

import React, { useMemo } from 'react'
import type { components } from '@/types/generated/api'
import { MessageItem } from './MessageItem'
import { VirtualizedMessageList } from './VirtualizedMessageList'
import { Pagination } from '@/components/ui/pagination'
import { useMessageFilterStore } from '@/stores/village/messageFilterStore'
import { filterMessages, getFilterSummary, hasActiveFilter } from '@/utils/message-filter'
import { useAuth } from '@/hooks/useAuth'

type VillageView = components['schemas']['VillageView']
type MessageView = components['schemas']['MessageView']

interface MessageListProps {
  /** 村情報 */
  village: VillageView
  /** メッセージ一覧 */
  messages?: MessageView[]
  /** ローディング状態 */
  isLoading?: boolean
  /** 表示モード：無限スクロール、ページネーション、仮想化 */
  displayMode?: 'infinite' | 'pagination' | 'virtualized'
  /** 現在のページ番号（ページネーションモード時） */
  currentPage?: number
  /** 総ページ数（ページネーションモード時） */
  totalPages?: number
  /** ページ変更時のハンドラー */
  onPageChange?: (page: number) => void
  /** 仮想化: 次のページがあるか */
  hasNextPage?: boolean
  /** 仮想化: 次のページ読み込み中か */
  isNextPageLoading?: boolean
  /** 仮想化: 次のページ読み込み関数 */
  loadNextPage?: (startIndex: number, stopIndex: number) => Promise<void>
  /** アンカークリック時のハンドラー */
  onAnchorClick?: (anchorType: string, anchorValue: string) => void
  /** 個人抽出クリック時のハンドラー */
  onPersonalExtractionClick?: (participantId: number) => void
}

/**
 * 発言一覧
 *
 * 発言の表示、無限スクロール、仮想化を提供
 * フィルタリング機能を統合
 */
export const MessageList: React.FC<MessageListProps> = ({
  village,
  messages = [],
  isLoading = false,
  displayMode = 'infinite',
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  onAnchorClick,
  onPersonalExtractionClick,
}) => {
  // 認証情報を取得（私宛のみフィルタで使用）
  const { user } = useAuth()

  // フィルタ状態を取得
  const filterState = useMessageFilterStore()

  // フィルタリングされたメッセージ
  const filteredMessages = useMemo(() => {
    // ユーザーIDを取得（私宛のみフィルタで使用）
    // TODO: 実際のユーザーIDと参加者IDのマッピングが必要
    const currentUserId = user?.uid ? parseInt(user.uid, 10) : undefined

    return filterMessages(messages, filterState, currentUserId)
  }, [messages, filterState, user?.uid])

  // フィルタが適用されているかチェック
  const isFiltered = hasActiveFilter(filterState)

  // フィルタの要約を取得
  const filterSummary = getFilterSummary(filterState)

  // 表示するメッセージ数
  const totalCount = messages.length
  const filteredCount = filteredMessages.length

  // 仮想化モード時は専用コンポーネントを使用
  if (displayMode === 'virtualized') {
    return (
      <div className="space-y-4">
        {/* ヘッダー情報 */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">発言一覧（仮想化）</h2>
            <div className="flex items-center gap-4">
              {/* フィルタ状態の表示 */}
              {isFiltered && (
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  フィルタ適用中: {filterSummary}
                </div>
              )}
              {/* メッセージ数の表示 */}
              <div className="text-sm text-gray-500">
                {isFiltered ? (
                  <span>
                    {filteredCount} / {totalCount} 件表示
                  </span>
                ) : (
                  <span>{totalCount} 件の発言</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 仮想化されたメッセージリスト */}
        <VirtualizedMessageList
          village={village}
          messages={filteredMessages}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={loadNextPage}
          onAnchorClick={onAnchorClick}
          onPersonalExtractionClick={onPersonalExtractionClick}
          height={600} // 固定高さ（必要に応じて調整）
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">発言一覧</h2>
          <div className="flex items-center gap-4">
            {/* フィルタ状態の表示 */}
            {isFiltered && (
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                フィルタ適用中: {filterSummary}
              </div>
            )}
            {/* メッセージ数の表示 */}
            <div className="text-sm text-gray-500">
              {isFiltered ? (
                <span>
                  {filteredCount} / {totalCount} 件表示
                </span>
              ) : (
                <span>{totalCount} 件の発言</span>
              )}
            </div>
          </div>
        </div>

        {/* 通常のメッセージリスト */}
        <div className="space-y-1">
          {filteredMessages.map((message) => (
            <MessageItem
              key={`${message.time.village_day_id}-${message.content.num}`}
              message={message}
              villageId={village.id}
              onAnchorClick={onAnchorClick}
              onPersonalExtractionClick={onPersonalExtractionClick}
            />
          ))}
        </div>

        {/* ローディング状態 */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="text-sm text-gray-500">発言を読み込み中...</div>
          </div>
        )}

        {/* 空状態（フィルタリング前） */}
        {!isLoading && totalCount === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm">まだ発言がありません</p>
          </div>
        )}

        {/* フィルタ結果が空の場合 */}
        {!isLoading && totalCount > 0 && filteredCount === 0 && isFiltered && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <p className="text-sm mb-2">フィルタ条件に一致する発言がありません</p>
            <p className="text-xs text-gray-400">フィルタ条件を変更してください</p>
          </div>
        )}

        {/* ページネーション（ページネーションモード時） */}
        {displayMode === 'pagination' && totalPages > 1 && onPageChange && (
          <div className="flex justify-center pt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
