/**
 * 発言一覧コンポーネント
 */

import React from 'react'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface MessageListProps {
  /** 村情報 */
  village: VillageView
}

/**
 * 発言一覧
 *
 * 発言の表示、無限スクロール、仮想化を提供
 * 暫定実装
 */
export const MessageList: React.FC<MessageListProps> = ({ village }) => {
  // 暫定のサンプルメッセージ
  const sampleMessages = [
    {
      id: 1,
      participantName: 'アリス',
      content: 'よろしくお願いします！',
      timestamp: '2024-01-01 10:00:00',
      type: 'NORMAL_SAY',
    },
    {
      id: 2,
      participantName: 'ボブ',
      content: 'こちらこそよろしくお願いします。',
      timestamp: '2024-01-01 10:01:00',
      type: 'NORMAL_SAY',
    },
    {
      id: 3,
      participantName: 'システム',
      content: '1日目が開始されました。',
      timestamp: '2024-01-01 21:00:00',
      type: 'SYSTEM_MESSAGE',
    },
  ]

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'NORMAL_SAY':
        return 'border-l-blue-500'
      case 'WEREWOLF_SAY':
        return 'border-l-red-500'
      case 'SYSTEM_MESSAGE':
        return 'border-l-gray-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case 'NORMAL_SAY':
        return '通常'
      case 'WEREWOLF_SAY':
        return '囁き'
      case 'SYSTEM_MESSAGE':
        return 'システム'
      default:
        return type
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">発言一覧</h2>
          <div className="text-sm text-gray-500">{sampleMessages.length} 件の発言</div>
        </div>

        {/* メッセージリスト */}
        <div className="space-y-4">
          {sampleMessages.map((message) => (
            <div
              key={message.id}
              className={`border-l-4 ${getMessageTypeColor(message.type)} pl-4 py-2`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {message.participantName[0]}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {message.participantName}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {getMessageTypeLabel(message.type)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{message.timestamp}</div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">{message.content}</div>
            </div>
          ))}
        </div>

        {/* ローディング状態 */}
        <div className="flex justify-center py-8">
          <div className="text-sm text-gray-500">発言を読み込み中...</div>
        </div>

        {/* 無限スクロール用のセンチネル */}
        <div id="message-list-sentinel" className="h-1"></div>
      </div>
    </div>
  )
}
