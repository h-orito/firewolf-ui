/**
 * 仮想化されたメッセージリストコンポーネント
 *
 * react-windowを使用して大量のメッセージを効率的に表示
 */

import React, { forwardRef, useRef, useEffect } from 'react'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import type { components } from '@/types/generated/api'
import { MessageItem } from './MessageItem'

type MessageView = components['schemas']['MessageView']
type VillageView = components['schemas']['VillageView']

interface VirtualizedMessageListProps {
  /** 村情報 */
  village: VillageView
  /** メッセージ一覧 */
  messages: MessageView[]
  /** ローディング状態 */
  isLoading?: boolean
  /** 無限スクロール: 次のページがあるか */
  hasNextPage?: boolean
  /** 無限スクロール: 次のページ読み込み中か */
  isNextPageLoading?: boolean
  /** 無限スクロール: 次のページ読み込み関数 */
  loadNextPage?: (startIndex: number, stopIndex: number) => Promise<void>
  /** アイテムの高さ（px） */
  itemHeight?: number
  /** リストの高さ（px） */
  height?: number
  /** アンカークリック時のハンドラー */
  onAnchorClick?: (anchorType: string, anchorValue: string) => void
  /** 個人抽出クリック時のハンドラー */
  onPersonalExtractionClick?: (participantId: number) => void
}

/**
 * メッセージアイテムコンポーネント（仮想化用）
 */
const VirtualizedMessageItem = forwardRef<
  HTMLDivElement,
  ListChildComponentProps<{
    village: VillageView
    messages: MessageView[]
    onAnchorClick?: (anchorType: string, anchorValue: string) => void
    onPersonalExtractionClick?: (participantId: number) => void
  }>
>(({ index, style, data }, ref) => {
  const { village, messages, onAnchorClick, onPersonalExtractionClick } = data
  const message = messages[index]

  if (!message) {
    // ローディング中の場合のプレースホルダー
    return (
      <div ref={ref} style={style} className="px-4 py-2">
        <div className="animate-pulse flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} style={style} className="px-1">
      <MessageItem
        message={message}
        villageId={village.id}
        onAnchorClick={onAnchorClick}
        onPersonalExtractionClick={onPersonalExtractionClick}
      />
    </div>
  )
})

VirtualizedMessageItem.displayName = 'VirtualizedMessageItem'

/**
 * 仮想化されたメッセージリスト
 *
 * 大量のメッセージを効率的に表示するため、react-windowを使用
 * 無限スクロールにも対応
 */
export const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  village,
  messages,
  isLoading = false,
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  itemHeight = 120, // メッセージアイテムの推定高さ
  height = 600, // リスト全体の高さ
  onAnchorClick,
  onPersonalExtractionClick,
}) => {
  const listRef = useRef<List>(null)

  // メッセージが更新されたときに最下部にスクロール（オプション）
  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      // 新しいメッセージが追加された場合は最下部にスクロール
      listRef.current.scrollToItem(messages.length - 1, 'end')
    }
  }, [messages.length])

  // アイテムが読み込まれているかをチェック
  const isItemLoaded = (index: number) => {
    return !!messages[index]
  }

  // 無限スクロール用のアイテム数
  // 次のページがある場合は+1（ローディングプレースホルダー用）
  const itemCount = hasNextPage ? messages.length + 1 : messages.length

  // メッセージが空の場合の表示
  if (!isLoading && messages.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-gray-500 bg-white rounded-lg"
        style={{ height }}
      >
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
    )
  }

  const itemData = {
    village,
    messages,
    onAnchorClick,
    onPersonalExtractionClick,
  }

  // 無限スクロールが有効な場合
  if (loadNextPage) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadNextPage}
        >
          {({ onItemsRendered, ref: infiniteLoaderRef }) => (
            <List
              ref={(listInstance) => {
                listRef.current = listInstance
                if (infiniteLoaderRef) {
                  infiniteLoaderRef.current = listInstance
                }
              }}
              width="100%"
              height={height}
              itemCount={itemCount}
              itemSize={itemHeight}
              itemData={itemData}
              onItemsRendered={onItemsRendered}
              className="virtualized-message-list"
            >
              {VirtualizedMessageItem}
            </List>
          )}
        </InfiniteLoader>
      </div>
    )
  }

  // 通常の仮想化リスト（無限スクロールなし）
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <List
        ref={listRef}
        width="100%"
        height={height}
        itemCount={itemCount}
        itemSize={itemHeight}
        itemData={itemData}
        className="virtualized-message-list"
      >
        {VirtualizedMessageItem}
      </List>
    </div>
  )
}

/**
 * 仮想化されたメッセージリストのCSS設定
 * global.cssまたはstyles/virtualized-message-list.cssに追加
 */
export const virtualizedMessageListStyles = `
.virtualized-message-list::-webkit-scrollbar {
  width: 8px;
}

.virtualized-message-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.virtualized-message-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.virtualized-message-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
`
