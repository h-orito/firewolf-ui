/**
 * アクションパネルコンポーネント
 */

import React, { useState } from 'react'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface ActionPanelProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
}

/**
 * アクションパネル
 *
 * 発言、投票、能力行使などのアクション機能を提供
 * 権限ベースで表示制御を行う
 * 暫定実装
 */
export const ActionPanel: React.FC<ActionPanelProps> = ({ village, user }) => {
  const [activeTab, setActiveTab] = useState<'say' | 'vote' | 'ability'>('say')
  const [messageContent, setMessageContent] = useState('')
  const [messageType, setMessageType] = useState('NORMAL_SAY')

  const isParticipant =
    user && village.participant?.member_list?.some((p) => p.player?.id === user.uid)
  const isSpectator = user && village.spectator?.member_list?.some((s) => s.player?.id === user.uid)

  const handleSubmitMessage = () => {
    if (!messageContent.trim()) return

    // 発言投稿（未実装）
    console.log('発言投稿:', { type: messageType, content: messageContent })
    setMessageContent('')
  }

  const handleJoinVillage = () => {
    // 入村処理（未実装）
    console.log('入村処理')
  }

  const handleSpectate = () => {
    // 見学処理（未実装）
    console.log('見学処理')
  }

  // 未ログイン時
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-gray-900">ログインが必要です</h3>
          <p className="text-sm text-gray-600">村に参加するには、まずログインしてください。</p>
          <button
            onClick={() => {
              // ログインモーダル表示（未実装）
              console.log('ログインモーダルを表示')
            }}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ログイン
          </button>
        </div>
      </div>
    )
  }

  // 参加者の場合
  if (isParticipant) {
    return (
      <div className="bg-white rounded-lg shadow">
        {/* タブナビゲーション */}
        <div className="border-b">
          <nav className="flex space-x-4 px-4">
            {['say', 'vote', 'ability'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'say' && '発言'}
                {tab === 'vote' && '投票'}
                {tab === 'ability' && '能力'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4">
          {/* 発言タブ */}
          {activeTab === 'say' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">発言種別</label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NORMAL_SAY">通常発言</option>
                  <option value="MONOLOGUE_SAY">独り言</option>
                  {/* 権限に応じて他の種別も表示 */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">発言内容</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="発言を入力してください..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">{messageContent.length}/400文字</div>
                </div>
              </div>

              {/* デコレーションツールバー（暫定実装） */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500">装飾:</span>
                <button className="px-2 py-1 border rounded hover:bg-gray-50">太字</button>
                <button className="px-2 py-1 border rounded hover:bg-gray-50">斜体</button>
                <button className="px-2 py-1 border rounded hover:bg-gray-50">色</button>
              </div>

              <button
                onClick={handleSubmitMessage}
                disabled={!messageContent.trim()}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                発言する
              </button>
            </div>
          )}

          {/* 投票タブ */}
          {activeTab === 'vote' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">投票</h3>
              <p className="text-sm text-gray-600">投票機能は実装予定です。</p>
            </div>
          )}

          {/* 能力タブ */}
          {activeTab === 'ability' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">能力行使</h3>
              <p className="text-sm text-gray-600">能力行使機能は実装予定です。</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 見学者の場合
  if (isSpectator) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-gray-900">見学中</h3>
          <p className="text-sm text-gray-600">あなたは現在この村を見学しています。</p>
          {/* 見学者用の発言機能（暫定実装） */}
          <div className="space-y-2">
            <textarea
              placeholder="見学発言を入力..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              見学発言
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 未参加の場合
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium text-gray-900">村に参加</h3>
        <p className="text-sm text-gray-600">この村に参加または見学することができます。</p>

        <div className="space-y-2">
          <button
            onClick={handleJoinVillage}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            村に参加する
          </button>

          <button
            onClick={handleSpectate}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            見学する
          </button>
        </div>

        <div className="text-xs text-gray-500">
          参加者: {village.participant?.count || 0} / {village.setting?.capacity?.max || 0}
        </div>
      </div>
    </div>
  )
}
