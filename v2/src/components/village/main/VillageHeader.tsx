/**
 * 村ヘッダーコンポーネント
 */

import React from 'react'
import { useVillageStore } from '@/stores/village'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface VillageHeaderProps {
  /** 村情報 */
  village: VillageView
}

/**
 * 村ヘッダー
 *
 * 村名・日付ナビゲーション（パンくずリスト風）を表示
 * 暫定実装
 */
export const VillageHeader: React.FC<VillageHeaderProps> = ({ village }) => {
  const { currentDay } = useVillageStore()

  const handleDayClick = (dayNumber: number) => {
    // 日付切り替え（未実装）
    console.log(`${dayNumber}日目に切り替え`)
  }

  // 村の日付一覧を取得（暫定実装）
  const days = village.day?.day_list || []

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* 村名 */}
        <div className="mb-3">
          <h1 className="text-xl font-bold text-gray-900 truncate">{village.name}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-600">村ID: {village.id}</span>
            <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {village.status.name}
            </span>
          </div>
        </div>

        {/* 日付ナビゲーション */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          <span className="text-sm text-gray-500 whitespace-nowrap mr-2">日付:</span>
          {days.map((day, index) => (
            <React.Fragment key={day.day}>
              {index > 0 && (
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              <button
                onClick={() => handleDayClick(day.day)}
                className={`text-sm px-2 py-1 rounded whitespace-nowrap transition-colors ${
                  currentDay === day.day
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {day.day === 0 ? 'プロローグ' : `${day.day}日目`}
              </button>
            </React.Fragment>
          ))}

          {/* エピローグがある場合 */}
          {village.status.is_finished && (
            <>
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <button
                onClick={() => handleDayClick(-1)} // エピローグを-1で表現
                className={`text-sm px-2 py-1 rounded whitespace-nowrap transition-colors ${
                  currentDay === -1
                    ? 'bg-green-100 text-green-800 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                エピローグ
              </button>
            </>
          )}
        </div>

        {/* 現在日の詳細情報 */}
        <div className="mt-3 text-sm text-gray-600">
          {currentDay === 0 && <span>参加者募集中です</span>}
          {currentDay > 0 && !village.status.is_finished && (
            <div className="flex items-center space-x-4">
              <span>進行中</span>
              <span>参加者: {village.participant?.count || 0}人</span>
              {/* TODO: 残り時間表示 */}
            </div>
          )}
          {village.status.is_finished && (
            <div className="flex items-center space-x-2">
              <span>ゲーム終了</span>
              {village.win_camp && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                  {village.win_camp.name}陣営勝利
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
