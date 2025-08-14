/**
 * 参加者一覧コンポーネント
 */

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface ParticipantListProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
}

/**
 * 参加者一覧セクション
 *
 * 生存・死亡・見学グループに分けて表示
 * 個人抽出機能も含む
 * 暫定実装
 */
export const ParticipantList: React.FC<ParticipantListProps> = ({ village, user }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const participants = village.participant.member_list
  const spectators = village.spectator.member_list

  const aliveParticipants = participants.filter((p) => !p.spectator && !p.dead)
  const deadParticipants = participants.filter((p) => !p.spectator && !!p.dead)

  const handlePersonalExtraction = (participantId: number) => {
    // 個人抽出機能（未実装）
    console.log('個人抽出:', participantId)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={toggleExpanded}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded p-1"
      >
        <span>
          参加者一覧 ({aliveParticipants.length + deadParticipants.length + spectators.length})
        </span>
        <FontAwesomeIcon
          icon={isExpanded ? faChevronDown : faChevronRight}
          className="h-4 w-4 transition-transform"
        />
      </button>

      {/* 展開可能なコンテンツエリア */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-4">
          {/* 生存者 */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              生存者 ({aliveParticipants.length})
            </h4>
            <div className="space-y-1">
              {aliveParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer group"
                  onClick={() => handlePersonalExtraction(participant.id)}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0">
                      {/* キャラアイコンプレースホルダー */}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {participant.chara_name.name}
                      </div>
                      {participant.skill && (
                        <div className="text-xs text-gray-500">{participant.skill.short_name}</div>
                      )}
                    </div>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePersonalExtraction(participant.id)
                    }}
                  >
                    抽出
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 死亡者 */}
          {deadParticipants.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">
                死亡者 ({deadParticipants.length})
              </h4>
              <div className="space-y-1">
                {deadParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer group opacity-60"
                    onClick={() => handlePersonalExtraction(participant.id)}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0">
                        {/* キャラアイコンプレースホルダー */}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate line-through">
                          {participant.chara_name.name}
                        </div>
                        {participant.skill && (
                          <div className="text-xs text-gray-500">
                            {participant.skill.short_name}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePersonalExtraction(participant.id)
                      }}
                    >
                      抽出
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 見学者 */}
          {spectators.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">
                見学者 ({spectators.length})
              </h4>
              <div className="space-y-1">
                {spectators.map((spectator) => (
                  <div
                    key={spectator.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer group"
                    onClick={() => handlePersonalExtraction(spectator.id)}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0">
                        {/* キャラアイコンプレースホルダー */}
                      </div>
                      <div className="text-xs font-medium text-gray-600 truncate">
                        {spectator.chara_name.name}
                      </div>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePersonalExtraction(spectator.id)
                      }}
                    >
                      抽出
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
