/**
 * ユーザー設定セクション
 */

import React, { useState } from 'react'
import { useUserSettingsStore } from '@/stores/village'
import { UserSettingsModal } from '../UserSettingsModal'

/**
 * ユーザー設定セクション
 *
 * 表示設定、操作設定、Webhook設定のパネル
 * 暫定実装
 */
export const UserSettings: React.FC = () => {
  const { display, operation, updateDisplaySettings, updateOperationSettings } =
    useUserSettingsStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-900 hover:text-gray-700"
      >
        <span>ユーザー設定</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-3">
          {/* 表示設定 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">表示設定</h4>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={display.showCharacterIcon}
                  onChange={(e) => updateDisplaySettings({ showCharacterIcon: e.target.checked })}
                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">キャラアイコン表示</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={display.showTimestamp}
                  onChange={(e) => updateDisplaySettings({ showTimestamp: e.target.checked })}
                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">発言時刻表示</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={display.showSystemMessage}
                  onChange={(e) => updateDisplaySettings({ showSystemMessage: e.target.checked })}
                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">システムメッセージ表示</span>
              </label>

              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-700">1ページ発言数:</label>
                <select
                  value={display.messagesPerPage}
                  onChange={(e) =>
                    updateDisplaySettings({ messagesPerPage: parseInt(e.target.value) })
                  }
                  className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>
          </div>

          {/* 操作設定 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">操作設定</h4>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={operation.showConfirmDialog}
                  onChange={(e) => updateOperationSettings({ showConfirmDialog: e.target.checked })}
                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">発言確認ダイアログ</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={operation.fixedActionPanel}
                  onChange={(e) => updateOperationSettings({ fixedActionPanel: e.target.checked })}
                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">アクションパネル固定</span>
              </label>

              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-700">自動更新間隔:</label>
                <select
                  value={operation.autoUpdateInterval}
                  onChange={(e) =>
                    updateOperationSettings({ autoUpdateInterval: parseInt(e.target.value) })
                  }
                  className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30秒</option>
                  <option value={60}>60秒</option>
                  <option value={120}>2分</option>
                  <option value={300}>5分</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-700">アンカークリック:</label>
                <select
                  value={operation.anchorClickAction}
                  onChange={(e) =>
                    updateOperationSettings({
                      anchorClickAction: e.target.value as 'paste' | 'copy',
                    })
                  }
                  className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="paste">貼り付け</option>
                  <option value="copy">コピー</option>
                </select>
              </div>
            </div>
          </div>

          <button
            className="w-full text-xs py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowDetailModal(true)}
          >
            詳細設定
          </button>
        </div>
      )}

      {/* ユーザー設定詳細モーダル */}
      <UserSettingsModal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />
    </div>
  )
}
