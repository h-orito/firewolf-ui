/**
 * メモ機能セクション
 */

import React, { useState } from 'react'
import { useMemoStore } from '@/stores/village'

/**
 * メモセクション
 *
 * メモの作成、編集、削除機能を提供
 * 最大3個まで保存可能
 */
export const MemoSection: React.FC = () => {
  const { memos, createMemo, updateMemo, deleteMemo } = useMemoStore()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newMemoTitle, setNewMemoTitle] = useState('')
  const [newMemoContent, setNewMemoContent] = useState('')

  const handleCreateMemo = () => {
    if (!newMemoTitle.trim()) return

    createMemo(newMemoTitle, newMemoContent)
    setNewMemoTitle('')
    setNewMemoContent('')
    setIsCreating(false)
  }

  const handleUpdateMemo = (id: string, title: string, content: string) => {
    updateMemo(id, { title, content })
    setEditingId(null)
  }

  const handleDeleteMemo = (id: string) => {
    if (confirm('このメモを削除しますか？')) {
      deleteMemo(id)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">メモ</h3>
        <span className="text-xs text-gray-500">{memos.length}/3</span>
      </div>

      {/* 既存メモ一覧 */}
      <div className="space-y-2">
        {memos.map((memo) => (
          <div key={memo.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            {editingId === memo.id ? (
              // 編集モード
              <div className="space-y-2">
                <input
                  type="text"
                  defaultValue={memo.title}
                  className="w-full text-xs font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onBlur={(e) => handleUpdateMemo(memo.id, e.target.value, memo.content)}
                />
                <textarea
                  defaultValue={memo.content}
                  className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  onBlur={(e) => handleUpdateMemo(memo.id, memo.title, e.target.value)}
                />
                <div className="flex justify-end space-x-1">
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    完了
                  </button>
                </div>
              </div>
            ) : (
              // 表示モード
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium text-gray-900 truncate">{memo.title}</h4>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingId(memo.id)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteMemo(memo.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      削除
                    </button>
                  </div>
                </div>
                {memo.content && (
                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{memo.content}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 新規メモ作成 */}
      {memos.length < 3 && (
        <div>
          {isCreating ? (
            <div className="bg-white border border-gray-300 rounded-lg p-3 space-y-2">
              <input
                type="text"
                placeholder="メモタイトル"
                value={newMemoTitle}
                onChange={(e) => setNewMemoTitle(e.target.value)}
                className="w-full text-xs font-medium border-0 border-b border-gray-300 px-0 py-1 focus:outline-none focus:border-blue-500 placeholder-gray-500"
              />
              <textarea
                placeholder="メモ内容（任意）"
                value={newMemoContent}
                onChange={(e) => setNewMemoContent(e.target.value)}
                className="w-full text-xs border-0 px-0 py-1 resize-none focus:outline-none placeholder-gray-500"
                rows={3}
              />
              <div className="flex justify-end space-x-1">
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setNewMemoTitle('')
                    setNewMemoContent('')
                  }}
                  className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCreateMemo}
                  disabled={!newMemoTitle.trim()}
                  className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                  保存
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full text-xs py-2 px-3 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + メモを追加
            </button>
          )}
        </div>
      )}
    </div>
  )
}
