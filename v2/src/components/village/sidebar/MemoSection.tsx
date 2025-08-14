/**
 * メモ機能セクション
 */

import React, { useState } from 'react'
import { useMemoStore } from '@/stores/village'
import { VillageMemoModal } from '@/components/village/VillageMemoModal'

/**
 * メモセクション
 *
 * メモ機能モーダルを開くボタンとメモ数表示を提供
 */
export const MemoSection: React.FC = () => {
  const { memos } = useMemoStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">メモ</h3>
        <span className="text-xs text-gray-500">{memos.length}/3</span>
      </div>

      {/* メモ機能モーダルを開くボタン */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full text-xs py-2 px-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        メモ機能を開く
      </button>

      {/* 既存メモの簡易表示 */}
      {memos.length > 0 && (
        <div className="space-y-1">
          {memos.slice(0, 2).map((memo, index) => (
            <div key={memo.id} className="bg-yellow-50 border border-yellow-200 rounded p-2">
              <h4 className="text-xs font-medium text-gray-900 truncate">{memo.title}</h4>
              {memo.content && (
                <p className="text-xs text-gray-600 truncate mt-1">{memo.content.split('\n')[0]}</p>
              )}
            </div>
          ))}
          {memos.length > 2 && (
            <div className="text-xs text-gray-500 text-center">他 {memos.length - 2} 個のメモ</div>
          )}
        </div>
      )}

      {/* メモ機能モーダル */}
      <VillageMemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
