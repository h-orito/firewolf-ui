/**
 * 発言一覧コンポーネント
 */

import React from 'react'
import type { components } from '@/types/generated/api'
import { MessageItem } from './MessageItem'

type VillageView = components['schemas']['VillageView']
type MessageView = components['schemas']['MessageView']

interface MessageListProps {
  /** 村情報 */
  village: VillageView
  /** メッセージ一覧 */
  messages?: MessageView[]
  /** ローディング状態 */
  isLoading?: boolean
  /** アンカークリック時のハンドラー */
  onAnchorClick?: (anchorType: string, anchorValue: string) => void
  /** 個人抽出クリック時のハンドラー */
  onPersonalExtractionClick?: (participantId: number) => void
}

/**
 * 発言一覧
 *
 * 発言の表示、無限スクロール、仮想化を提供
 * 暫定実装
 */
export const MessageList: React.FC<MessageListProps> = ({
  village,
  messages = [],
  isLoading = false,
  onAnchorClick,
  onPersonalExtractionClick,
}) => {
  // メッセージ数の表示
  const messageCount = messages.length

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">発言一覧</h2>
          <div className="text-sm text-gray-500">{messageCount} 件の発言</div>
        </div>

        {/* メッセージリスト */}
        <div className="space-y-1">
          {messages.map((message) => (
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

        {/* 空状態 */}
        {!isLoading && messageCount === 0 && (
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

        {/* 無限スクロール用のセンチネル */}
        <div id="message-list-sentinel" className="h-1"></div>
      </div>
    </div>
  )
}
