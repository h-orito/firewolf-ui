/**
 * 村情報表示コンポーネント
 */

import React from 'react'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface VillageInfoProps {
  /** 村情報 */
  village: VillageView
}

/**
 * 村情報セクション
 *
 * 村名、ステータス、設定表示ボタンなどを含む
 * 暫定実装
 */
export const VillageInfo: React.FC<VillageInfoProps> = ({ village }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">村情報</h3>

      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div>
          <div className="text-sm font-medium text-gray-700 truncate">{village.name}</div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">ステータス</span>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {village.status.name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">村建て</span>
          <span className="text-xs text-gray-700 truncate max-w-24">
            {village.creator_player.nickname}
          </span>
        </div>

        <button
          className="w-full text-xs py-2 px-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            // 村設定モーダル表示（未実装）
            console.log('村設定モーダルを表示')
          }}
        >
          村設定を見る
        </button>
      </div>
    </div>
  )
}
