/**
 * ユーザー設定セクション
 */

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useUserSettingsStore } from '@/stores/village'

// 動的インポートでコード分割
const UserSettingsModal = dynamic(
  () => import('../UserSettingsModal').then((mod) => ({ default: mod.UserSettingsModal })),
  {
    ssr: false,
    loading: () => <div className="animate-pulse">読み込み中...</div>,
  }
)

/**
 * ユーザー設定セクション
 *
 * ユーザー設定モーダルを開くボタンを提供
 */
export const UserSettings: React.FC = () => {
  const { display, operation } = useUserSettingsStore()
  const [showDetailModal, setShowDetailModal] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">ユーザー設定</h3>
      </div>

      {/* ユーザー設定モーダルを開くボタン */}
      <button
        onClick={() => setShowDetailModal(true)}
        className="w-full text-xs py-2 px-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        設定を開く
      </button>

      {/* 現在の設定の簡易表示 */}
      <div className="bg-gray-50 rounded-lg p-2 space-y-1">
        <div className="text-xs text-gray-600">
          <span className={display.showCharacterIcon ? 'text-green-600' : 'text-gray-400'}>
            アイコン{display.showCharacterIcon ? 'ON' : 'OFF'}
          </span>
          {' • '}
          <span className={display.showDateDisplay ? 'text-green-600' : 'text-gray-400'}>
            日付{display.showDateDisplay ? 'ON' : 'OFF'}
          </span>
        </div>
        <div className="text-xs text-gray-600">
          <span className={operation.showConfirmDialog ? 'text-green-600' : 'text-gray-400'}>
            確認{operation.showConfirmDialog ? 'ON' : 'OFF'}
          </span>
          {' • '}
          <span>更新{operation.autoUpdateInterval}秒</span>
        </div>
      </div>

      {/* ユーザー設定詳細モーダル */}
      <UserSettingsModal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />
    </div>
  )
}
