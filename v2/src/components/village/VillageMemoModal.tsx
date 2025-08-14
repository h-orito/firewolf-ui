/**
 * 村メモ機能モーダル
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useMemoStore } from '@/stores/village'

interface VillageMemoModalProps {
  /** モーダルの開閉状態 */
  isOpen: boolean
  /** モーダルを閉じるコールバック */
  onClose: () => void
}

/**
 * 村メモ機能モーダル
 *
 * 最大3個のメモを作成・編集・削除できるタブ形式のモーダル。
 * リアルタイム文字数・行数カウンター付き。
 * Cookie による30日間の永続化。
 */
export const VillageMemoModal: React.FC<VillageMemoModalProps> = ({ isOpen, onClose }) => {
  const { memos, createMemo, updateMemo, deleteMemo } = useMemoStore()

  // アクティブなタブ（0-2の範囲）
  const [activeTab, setActiveTab] = useState(0)

  // 編集中の状態
  const [editingTitles, setEditingTitles] = useState<Record<number, string>>({})
  const [editingContents, setEditingContents] = useState<Record<number, string>>({})

  // 現在のタブのメモ情報を取得
  const currentMemo = useMemo(() => {
    return memos.find((_, index) => index === activeTab) || null
  }, [memos, activeTab])

  // 編集中のタイトルと内容を取得
  const getCurrentTitle = () => {
    if (activeTab in editingTitles) {
      return editingTitles[activeTab]
    }
    return currentMemo?.title || ''
  }

  const getCurrentContent = () => {
    if (activeTab in editingContents) {
      return editingContents[activeTab]
    }
    return currentMemo?.content || ''
  }

  // 文字数・行数カウンター
  const getContentStats = () => {
    const content = getCurrentContent()
    const lines = content.split('\n').length
    const chars = content.length
    return { lines, chars }
  }

  // タイトルの更新
  const handleTitleChange = (value: string) => {
    setEditingTitles((prev) => ({ ...prev, [activeTab]: value }))
  }

  // 内容の更新
  const handleContentChange = (value: string) => {
    setEditingContents((prev) => ({ ...prev, [activeTab]: value }))
  }

  // メモの保存
  const handleSaveMemo = () => {
    const title = getCurrentTitle().trim()
    const content = getCurrentContent().trim()

    if (!title && !content) {
      alert('タイトルまたは内容を入力してください。')
      return
    }

    if (currentMemo) {
      // 既存メモの更新
      updateMemo(currentMemo.id, { title: title || '無題のメモ', content })
    } else {
      // 新規メモの作成
      if (memos.length >= 3) {
        alert('メモは最大3個まで作成できます。')
        return
      }
      createMemo(title || '無題のメモ', content)
    }

    // 編集状態をクリア
    setEditingTitles((prev) => {
      const newState = { ...prev }
      delete newState[activeTab]
      return newState
    })
    setEditingContents((prev) => {
      const newState = { ...prev }
      delete newState[activeTab]
      return newState
    })
  }

  // メモの削除
  const handleDeleteMemo = () => {
    if (!currentMemo) return

    if (confirm('このメモを削除しますか？')) {
      deleteMemo(currentMemo.id)

      // 編集状態をクリア
      setEditingTitles((prev) => {
        const newState = { ...prev }
        delete newState[activeTab]
        return newState
      })
      setEditingContents((prev) => {
        const newState = { ...prev }
        delete newState[activeTab]
        return newState
      })
    }
  }

  // 変更があるかチェック
  const getHasChanges = () => {
    const currentTitle = getCurrentTitle()
    const currentContent = getCurrentContent()

    if (!currentMemo) {
      return currentTitle.trim() !== '' || currentContent.trim() !== ''
    }

    return currentMemo.title !== currentTitle || currentMemo.content !== currentContent
  }

  // タブが切り替えられた時の処理
  const handleTabChange = (tabIndex: number) => {
    if (getHasChanges()) {
      if (confirm('変更を保存せずにタブを切り替えますか？')) {
        // 編集中の内容を破棄
        setEditingTitles((prev) => {
          const newState = { ...prev }
          delete newState[activeTab]
          return newState
        })
        setEditingContents((prev) => {
          const newState = { ...prev }
          delete newState[activeTab]
          return newState
        })
        setActiveTab(tabIndex)
      }
    } else {
      setActiveTab(tabIndex)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="メモ機能" className="!max-w-4xl !max-h-[80vh]">
      <div className="p-6">
        {/* タブヘッダー */}
        <div className="flex border-b border-gray-200 mb-6">
          {[0, 1, 2].map((tabIndex) => {
            const hasMemo = memos.length > tabIndex
            const isActive = activeTab === tabIndex

            return (
              <button
                key={tabIndex}
                onClick={() => handleTabChange(tabIndex)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                メモ{tabIndex + 1}
                {hasMemo && <span className="ml-1 text-xs text-green-600">●</span>}
              </button>
            )
          })}
        </div>

        {/* メモ編集エリア */}
        <div className="space-y-4">
          {/* タイトル入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
            <input
              type="text"
              value={getCurrentTitle()}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="メモタイトル"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={100}
            />
          </div>

          {/* 内容入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
            <textarea
              value={getCurrentContent()}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="メモ内容"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={8}
              maxLength={5000}
            />
          </div>

          {/* 文字数・行数カウンター */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>行数: {getContentStats().lines}</span>
            <span>文字数: {getContentStats().chars}/5000</span>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
          <div>
            {currentMemo && (
              <Button variant="danger" size="sm" onClick={handleDeleteMemo}>
                削除
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            <Button variant="secondary" onClick={onClose}>
              閉じる
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveMemo}
              disabled={!getCurrentTitle().trim() && !getCurrentContent().trim()}
            >
              保存
            </Button>
          </div>
        </div>

        {/* メモ使用状況 */}
        <div className="mt-4 text-center text-xs text-gray-500">
          {memos.length}/3個のメモを使用中 • Cookie保存（30日間）
        </div>
      </div>
    </Modal>
  )
}
