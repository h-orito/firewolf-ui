/**
 * 個別発言コンポーネント
 */

import React from 'react'
import type { components } from '@/types/generated/api'
import { CharacterIcon } from '@/components/common/CharacterIcon'
import { MessageContent } from './MessageContent'

type MessageView = components['schemas']['MessageView']

interface MessageItemProps {
  /** 発言データ */
  message: MessageView
  /** 村ID */
  villageId: number
  /** 現在のユーザー情報 */
  user?: any
  /** 個人抽出モード */
  isPersonalExtraction?: boolean
  /** アンカークリック時のハンドラー */
  onAnchorClick?: (anchorType: string, anchorValue: string) => void
  /** 個人抽出クリック時のハンドラー */
  onPersonalExtractionClick?: (participantId: number) => void
}

/**
 * 発言アイテムコンポーネント
 *
 * 個別の発言を表示する
 * キャラアイコン、発言内容、発言種別、時間などを含む
 */
export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  villageId,
  user,
  isPersonalExtraction = false,
  onAnchorClick,
  onPersonalExtractionClick,
}) => {
  const messageType = message.content.type
  const fromParticipant = message.from
  const fromCharacterName = message.from_character_name
  const toParticipant = message.to
  const toCharacterName = message.to_character_name
  const time = message.time
  const content = message.content

  // 発言種別に応じたスタイリング
  const getMessageTypeStyle = (typeCode: string) => {
    switch (typeCode) {
      case 'NORMAL_SAY':
        return {
          borderColor: 'border-l-blue-500',
          bgColor: 'bg-white',
          typeLabel: '通常',
          typeLabelStyle: 'bg-blue-100 text-blue-800',
        }
      case 'WEREWOLF_SAY':
        return {
          borderColor: 'border-l-red-500',
          bgColor: 'bg-red-50',
          typeLabel: '囁き',
          typeLabelStyle: 'bg-red-100 text-red-800',
        }
      case 'MASON_SAY':
        return {
          borderColor: 'border-l-green-500',
          bgColor: 'bg-green-50',
          typeLabel: '共鳴',
          typeLabelStyle: 'bg-green-100 text-green-800',
        }
      case 'GRAVE_SAY':
        return {
          borderColor: 'border-l-purple-500',
          bgColor: 'bg-purple-50',
          typeLabel: '独り言',
          typeLabelStyle: 'bg-purple-100 text-purple-800',
        }
      case 'MONOLOGUE_SAY':
        return {
          borderColor: 'border-l-yellow-500',
          bgColor: 'bg-yellow-50',
          typeLabel: 'モノローグ',
          typeLabelStyle: 'bg-yellow-100 text-yellow-800',
        }
      case 'SPECTATE_SAY':
        return {
          borderColor: 'border-l-indigo-500',
          bgColor: 'bg-indigo-50',
          typeLabel: '見学',
          typeLabelStyle: 'bg-indigo-100 text-indigo-800',
        }
      case 'SYSTEM_MESSAGE':
        return {
          borderColor: 'border-l-gray-500',
          bgColor: 'bg-gray-50',
          typeLabel: 'システム',
          typeLabelStyle: 'bg-gray-100 text-gray-800',
        }
      default:
        return {
          borderColor: 'border-l-gray-300',
          bgColor: 'bg-white',
          typeLabel: messageType.name || typeCode,
          typeLabelStyle: 'bg-gray-100 text-gray-700',
        }
    }
  }

  const messageStyle = getMessageTypeStyle(messageType.code)

  // 時間の表示フォーマット
  const formatTime = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // キャラクター名の表示
  const getCharacterDisplayName = (participant: any, characterName: any) => {
    if (!participant && !characterName) return 'システム'
    return characterName?.name || participant?.chara_name?.name || 'Unknown'
  }

  // 死亡判定
  const isFromDead = !!fromParticipant?.dead
  const isToDead = !!toParticipant?.dead

  // 個人抽出クリックハンドラー
  const handlePersonalExtraction = () => {
    if (fromParticipant && onPersonalExtractionClick) {
      onPersonalExtractionClick(fromParticipant.id)
    }
  }

  return (
    <div
      className={`border-l-4 ${messageStyle.borderColor} ${messageStyle.bgColor} rounded-r-lg p-4 mb-3`}
    >
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {/* キャラアイコン */}
          <CharacterIcon
            participant={fromParticipant}
            characterName={fromCharacterName}
            size="md"
            isSystem={!fromParticipant && !fromCharacterName}
            isDead={isFromDead}
            clickable={!!fromParticipant}
            onClick={handlePersonalExtraction}
          />

          {/* 発言者名と宛先 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium truncate ${
                  isFromDead ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}
              >
                {getCharacterDisplayName(fromParticipant, fromCharacterName)}
              </span>
              {toParticipant && (
                <>
                  <span className="text-xs text-gray-500">→</span>
                  <span
                    className={`text-sm truncate ${
                      isToDead ? 'text-gray-500 line-through' : 'text-gray-700'
                    }`}
                  >
                    {getCharacterDisplayName(toParticipant, toCharacterName)}
                  </span>
                </>
              )}
            </div>
            {/* 役職表示（生存者のみ、システムメッセージ以外） */}
            {fromParticipant && fromParticipant.skill && messageType.code !== 'SYSTEM_MESSAGE' && (
              <div className="text-xs text-gray-500 mt-1">{fromParticipant.skill.short_name}</div>
            )}
          </div>

          {/* 発言種別ラベル */}
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${messageStyle.typeLabelStyle}`}
          >
            {messageStyle.typeLabel}
          </span>
        </div>

        {/* 時刻とアクション */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>{formatTime(time.datetime)}</span>
          {content.num && (
            <span className="bg-gray-100 text-gray-700 px-1 rounded">#{content.num}</span>
          )}
          {/* アクションボタン（個人抽出など） */}
          {fromParticipant && (
            <button
              className="opacity-0 group-hover:opacity-100 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-opacity"
              onClick={handlePersonalExtraction}
            >
              抽出
            </button>
          )}
        </div>
      </div>

      {/* 発言内容 */}
      <div className="text-sm text-gray-800 leading-relaxed pl-11">
        <MessageContent text={content.text} villageId={villageId} onAnchorClick={onAnchorClick} />
        {/* 表情アイコン */}
        {content.face_code && (
          <div className="mt-2 text-right">
            <span className="text-lg">{content.face_code}</span>
          </div>
        )}
      </div>

      {/* カウント表示（投票結果など） */}
      {content.count !== undefined && content.count > 0 && (
        <div className="mt-2 pl-11">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            カウント: {content.count}
          </span>
        </div>
      )}
    </div>
  )
}
