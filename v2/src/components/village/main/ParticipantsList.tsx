/**
 * 参加者一覧（PARTICIPANTS メッセージ）の特別表示コンポーネント
 */

import React from 'react'
import type { components } from '@/types/generated/api'
import { CharacterIcon } from '@/components/common/CharacterIcon'

type VillageParticipantView = components['schemas']['VillageParticipantView']

interface ParticipantsListProps {
  /** 参加者データ（JSON.parseされた配列） */
  participants: VillageParticipantView[]
}

/**
 * 参加者一覧表示コンポーネント
 *
 * PARTICIPANTS メッセージ専用の特別レイアウトを提供
 * 各参加者について以下の情報を2行構成で表示：
 * 1行目: キャラ名、プレイヤー名、生存状況、戦績ボタン
 * 2行目: 役職名、役職希望、勝敗
 */
export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  // 生存状況の表示を生成
  const getStatusDisplay = (participant: VillageParticipantView) => {
    if (!participant.dead) {
      return {
        text: '生存',
        style: 'text-green-600',
      }
    }

    const deadReason = participant.dead.reason || '不明'
    const isDanger = deadReason.includes('襲撃') || deadReason.includes('無惨')

    return {
      text: deadReason,
      style: isDanger ? 'text-red-600' : 'text-blue-600',
    }
  }

  // 勝敗の表示を生成
  const getWinLossDisplay = (participant: VillageParticipantView) => {
    if (!participant.dead && participant.win === undefined) {
      return null // エピローグ前は表示しない
    }

    const isWin = participant.win
    return {
      text: isWin ? '勝利' : '敗北',
      style: isWin ? 'text-green-600 font-medium' : 'text-red-600',
    }
  }

  // キャラ名の表示形式を生成
  const getCharacterDisplayName = (participant: VillageParticipantView) => {
    const shortName = participant.chara_name.short_name
    const fullName = participant.chara_name.name
    return `[${shortName}] ${fullName}`
  }

  // 役職希望の表示形式を生成
  const getSkillRequestDisplay = (participant: VillageParticipantView) => {
    const request = participant.skill_request
    if (!request) return null

    return `(${request.first}/${request.second}希望)`
  }

  return (
    <div className="space-y-3">
      {participants.map((participant) => {
        const statusDisplay = getStatusDisplay(participant)
        const winLossDisplay = getWinLossDisplay(participant)
        const characterName = getCharacterDisplayName(participant)
        const skillRequestDisplay = getSkillRequestDisplay(participant)
        const isDead = !!participant.dead

        return (
          <div
            key={participant.id}
            className={`flex items-start space-x-3 p-3 rounded-lg border ${
              isDead ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
            }`}
          >
            {/* キャラ画像 */}
            <div className="flex-shrink-0">
              <CharacterIcon
                participant={participant}
                characterName={participant.chara_name}
                size={0.375} // 1/2 サイズ相当
                isDead={isDead}
                clickable={false}
              />
            </div>

            {/* 参加者情報 */}
            <div className="flex-grow min-w-0">
              {/* 1行目: キャラ名、プレイヤー名、生存状況 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <span
                    className={`font-medium truncate ${
                      isDead ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}
                  >
                    {characterName}
                  </span>
                  {participant.player?.twitter_user_name && (
                    <a
                      href={`https://twitter.com/${participant.player.twitter_user_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm text-blue-600 hover:text-blue-800 truncate ${
                        isDead ? 'opacity-60' : ''
                      }`}
                    >
                      @{participant.player.twitter_user_name}
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className={`text-sm ${statusDisplay.style}`}>{statusDisplay.text}</span>
                  {participant.player?.id && (
                    <a
                      href={`/player-record?id=${participant.player.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                    >
                      戦績
                    </a>
                  )}
                </div>
              </div>

              {/* 2行目: 役職名、役職希望、勝敗 */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-2">
                  {participant.skill && (
                    <span
                      className={`text-sm font-bold ${isDead ? 'text-gray-500' : 'text-gray-900'}`}
                    >
                      {participant.skill.name}
                    </span>
                  )}
                  {skillRequestDisplay && (
                    <span className={`text-xs ${isDead ? 'text-gray-400' : 'text-gray-500'}`}>
                      {skillRequestDisplay}
                    </span>
                  )}
                </div>

                {winLossDisplay && (
                  <span className={`text-sm ${winLossDisplay.style}`}>{winLossDisplay.text}</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
