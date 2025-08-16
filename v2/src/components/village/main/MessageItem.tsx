/**
 * 個別発言コンポーネント
 */

import { CharacterIcon } from '@/components/common/CharacterIcon'
import { useUserSettingsStore } from '@/stores/village/user-settings-store'
import type { components } from '@/types/generated/api'
import React from 'react'
import { MessageContent } from './MessageContent'
import { ParticipantsList } from './ParticipantsList'

type MessageView = components['schemas']['MessageView']

interface MessageItemProps {
  /** 発言データ */
  message: MessageView
  /** 村ID */
  villageId: number
  /** 村情報（発言回数制限取得用） */
  village?: components['schemas']['VillageView']
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
  village,
  user: _user,
  isPersonalExtraction: _isPersonalExtraction = false,
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

  // 発言種別に応じたスタイリング（7種類の発言系メッセージ + システムメッセージ）
  const getMessageTypeStyle = (typeCode: string) => {
    switch (typeCode) {
      // === 発言系メッセージ（7種類） ===
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
          typeLabel: '墓下',
          typeLabelStyle: 'bg-purple-100 text-purple-800',
        }
      case 'MONOLOGUE_SAY':
        return {
          borderColor: 'border-l-yellow-500',
          bgColor: 'bg-yellow-50',
          typeLabel: '独り言',
          typeLabelStyle: 'bg-yellow-100 text-yellow-800',
        }
      case 'SPECTATE_SAY':
        return {
          borderColor: 'border-l-indigo-500',
          bgColor: 'bg-indigo-50',
          typeLabel: '見学',
          typeLabelStyle: 'bg-indigo-100 text-indigo-800',
        }
      case 'ACTION_SAY':
        return {
          borderColor: 'border-l-orange-500',
          bgColor: 'bg-orange-50',
          typeLabel: 'アクション',
          typeLabelStyle: 'bg-orange-100 text-orange-800',
        }

      // === システムメッセージ（10種類の役職別窓発言） ===
      case 'PSYCHIC_MESSAGE':
        return {
          borderColor: 'border-l-cyan-500',
          bgColor: 'bg-cyan-50',
          typeLabel: '占い結果',
          typeLabelStyle: 'bg-cyan-100 text-cyan-800',
        }
      case 'WISE_WOLF_MESSAGE':
        return {
          borderColor: 'border-l-pink-500',
          bgColor: 'bg-pink-50',
          typeLabel: '賢狼占い',
          typeLabelStyle: 'bg-pink-100 text-pink-800',
        }
      case 'NECROMANCER_MESSAGE':
        return {
          borderColor: 'border-l-violet-500',
          bgColor: 'bg-violet-50',
          typeLabel: '降霊結果',
          typeLabelStyle: 'bg-violet-100 text-violet-800',
        }
      case 'HUNTER_MESSAGE':
        return {
          borderColor: 'border-l-emerald-500',
          bgColor: 'bg-emerald-50',
          typeLabel: '狩人護衛',
          typeLabelStyle: 'bg-emerald-100 text-emerald-800',
        }
      case 'DETECTIVE_MESSAGE':
        return {
          borderColor: 'border-l-teal-500',
          bgColor: 'bg-teal-50',
          typeLabel: '探偵調査',
          typeLabelStyle: 'bg-teal-100 text-teal-800',
        }
      case 'LOVER_MESSAGE':
        return {
          borderColor: 'border-l-rose-500',
          bgColor: 'bg-rose-50',
          typeLabel: '恋人',
          typeLabelStyle: 'bg-rose-100 text-rose-800',
        }
      case 'FOX_MESSAGE':
        return {
          borderColor: 'border-l-amber-500',
          bgColor: 'bg-amber-50',
          typeLabel: '妖狐',
          typeLabelStyle: 'bg-amber-100 text-amber-800',
        }
      case 'MASON_MESSAGE':
        return {
          borderColor: 'border-l-lime-500',
          bgColor: 'bg-lime-50',
          typeLabel: '共有',
          typeLabelStyle: 'bg-lime-100 text-lime-800',
        }
      case 'WEREWOLF_MESSAGE':
        return {
          borderColor: 'border-l-red-600',
          bgColor: 'bg-red-50',
          typeLabel: '人狼',
          typeLabelStyle: 'bg-red-100 text-red-800',
        }
      case 'CORONER_MESSAGE':
        return {
          borderColor: 'border-l-slate-500',
          bgColor: 'bg-slate-50',
          typeLabel: '検死',
          typeLabelStyle: 'bg-slate-100 text-slate-800',
        }

      // === 一般システムメッセージ ===
      case 'SYSTEM_MESSAGE':
        return {
          borderColor: 'border-l-gray-500',
          bgColor: 'bg-gray-50',
          typeLabel: 'システム',
          typeLabelStyle: 'bg-gray-100 text-gray-800',
        }
      case 'PARTICIPANTS_MESSAGE':
        return {
          borderColor: 'border-l-blue-400',
          bgColor: 'bg-blue-25',
          typeLabel: '参加者',
          typeLabelStyle: 'bg-blue-100 text-blue-900',
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

  // ユーザー設定を取得
  const { display } = useUserSettingsStore()
  const { showDateDisplay, showLargeCharacterImage } = display

  // キャラクター画像の高さを計算（発言内容のmin-heightに使用）
  const getCharacterImageHeight = () => {
    // キャラクター画像の実際の高さを取得
    if (fromParticipant?.chara) {
      const finalScale = 1 * (showLargeCharacterImage ? 1.5 : 1)
      return Math.round(fromParticipant.chara.display.height * finalScale)
    }

    // システムメッセージまたはキャラクター情報がない場合のデフォルト
    const defaultIconSize = 32 // システムアイコンまたはフォールバックアイコンのサイズ
    const finalScale = 1 * (showLargeCharacterImage ? 1.5 : 1)
    return Math.round(defaultIconSize * finalScale)
  }

  // 時間の表示フォーマット（ユーザー設定に応じて切り替え）
  const formatTime = (datetime: string) => {
    const date = new Date(datetime)

    if (showDateDisplay) {
      // 日付表示ON: 月/日 時:分:秒
      return date.toLocaleString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } else {
      // 日付表示OFF: 時:分:秒のみ
      return date.toLocaleString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }
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

  // 発言種別に応じた最大発言回数を取得
  const getMaxSayCount = (messageTypeCode: string) => {
    if (!village?.setting.rules.message_restrict.restrict_list) return 0

    const restrictions = village.setting.rules.message_restrict.restrict_list
    const restriction = restrictions.find((r: any) => r.type.code === messageTypeCode)
    return restriction?.count || 0
  }

  // 参加者の現在の発言回数を取得（発言番号から推測）
  const getCurrentSayCount = () => {
    if (!content.num || !fromParticipant) return 0
    // TODO: より正確な現在回数の取得方法があれば使用
    return content.num
  }

  return (
    <div className={`${messageStyle.bgColor} rounded-lg p-2 mb-3`}>
      {/* ヘッダー部分: [発言アンカー] [発言者名] [プレイヤー名] (発言回数) 日時（システムメッセージ以外のみ表示） */}
      {fromParticipant && (
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {/* 発言アンカー */}
            {content.num && (
              <button
                className="text-sm text-blue-600 hover:text-blue-800 font-mono"
                onClick={() => {
                  const anchor = `>>${content.num}`
                  // TODO: ユーザー設定に応じてクリップボードコピーまたは発言欄に貼り付け
                  navigator.clipboard.writeText(anchor)
                }}
                title="アンカーをコピー"
              >
                &gt;&gt;{content.num}
              </button>
            )}

            {/* 発言者名 */}
            <span
              className={`text-sm font-bold truncate ${
                isFromDead ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}
            >
              [{fromCharacterName?.short_name || fromParticipant.chara_name.short_name || '?'}]{' '}
              {getCharacterDisplayName(fromParticipant, fromCharacterName)}
            </span>

            {/* プレイヤー名 */}
            {fromParticipant.player?.nickname && (
              <span className="text-sm text-gray-600 truncate">
                {fromParticipant.player.nickname}
              </span>
            )}

            {/* 宛先表示 */}
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

          {/* 右側: (発言回数) 日時 */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 flex-shrink-0">
            {/* 発言回数: (現在回数/最大回数) 形式 */}
            <span className="text-xs">
              ({getCurrentSayCount()}/{getMaxSayCount(messageType.code)})
            </span>

            {/* 日時 */}
            <span>{formatTime(time.datetime)}</span>
          </div>
        </div>
      )}

      {/* 中部（本文）: 左側キャラ画像、右側発言内容 */}
      <div className="flex gap-3">
        {/* 左側: キャラ画像（システムメッセージ以外のみ表示） */}
        {fromParticipant && (
          <div className="flex-shrink-0">
            <CharacterIcon
              participant={fromParticipant}
              characterName={fromCharacterName}
              isDead={isFromDead}
              clickable={!!fromParticipant}
              onClick={handlePersonalExtraction}
            />
          </div>
        )}

        {/* 右側: 発言内容 */}
        <div className="flex-1 min-w-0">
          <div
            className="text-sm text-gray-800 leading-relaxed p-3 border border-gray-300 rounded break-words whitespace-pre-wrap"
            style={fromParticipant ? { minHeight: `${getCharacterImageHeight()}px` } : {}}
          >
            {messageType.code === 'PARTICIPANTS_MESSAGE' ? (
              // PARTICIPANTS メッセージは特別レイアウトを使用
              (() => {
                try {
                  const participantsData = JSON.parse(content.text)
                  return <ParticipantsList participants={participantsData} />
                } catch (error) {
                  // JSON パースエラーの場合は通常の表示
                  console.warn('PARTICIPANTS メッセージのJSONパースに失敗:', error)
                  return (
                    <MessageContent
                      text={content.text}
                      villageId={villageId}
                      onAnchorClick={onAnchorClick}
                    />
                  )
                }
              })()
            ) : (
              // 通常のメッセージ表示
              <MessageContent
                text={content.text}
                villageId={villageId}
                onAnchorClick={onAnchorClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* 下部（アクション）: >>返信 >>秘話 ボタン */}
      {fromParticipant && (
        <div className="flex justify-end gap-2">
          <button
            className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            onClick={() => {
              const anchor = `>>${content.num}`
              // TODO: 発言欄に貼り付け、発言欄へスクロール
              navigator.clipboard.writeText(anchor)
            }}
            title="返信"
          >
            &gt;&gt;返信
          </button>

          <button
            className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 pl-2 py-1 rounded transition-colors"
            onClick={() => {
              // TODO: 秘話モードに切り替え、発言者を秘話相手に設定
              console.log('秘話モード切り替え:', fromParticipant)
            }}
            title="秘話"
          >
            &gt;&gt;秘話
          </button>
        </div>
      )}
    </div>
  )
}
