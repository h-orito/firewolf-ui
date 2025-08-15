/**
 * キャラクターアイコン共通コンポーネント
 */

import { CharacterImage } from '@/components/ui/CharacterImage'
import { useUserSettingsStore } from '@/stores/village/user-settings-store'
import type { components } from '@/types/generated/api'
import React from 'react'

type VillageParticipantView = components['schemas']['VillageParticipantView']
type VillageParticipantName = components['schemas']['VillageParticipantName']

interface CharacterIconProps {
  /** 参加者情報 */
  participant?: VillageParticipantView
  /** キャラクター名情報 */
  characterName?: VillageParticipantName
  /** アイコンサイズ（元サイズに対する比率） */
  size?: number
  /** システムメッセージ用フラグ */
  isSystem?: boolean
  /** 死亡者フラグ */
  isDead?: boolean
  /** クリック可能フラグ */
  clickable?: boolean
  /** クリック時のハンドラー */
  onClick?: () => void
  /** 追加のCSSクラス */
  className?: string
}

/**
 * キャラクターアイコン
 *
 * 参加者のキャラクターアイコンを表示する共通コンポーネント
 * システムメッセージ用の特別なアイコンも提供
 */
export const CharacterIcon: React.FC<CharacterIconProps> = ({
  participant,
  characterName,
  size = 1,
  isSystem = false,
  isDead = false,
  clickable = false,
  onClick,
  className = '',
}) => {
  // ユーザー設定からキャラ画像を大きく表示する設定を取得
  const showLargeCharacterImage = useUserSettingsStore(
    (state) => state.display.showLargeCharacterImage
  )

  // キャラクター名の取得
  const getCharacterName = (): string => {
    if (isSystem) return 'システム'
    return characterName?.name || participant?.chara_name.name || 'Unknown'
  }

  // キャラクター情報の取得
  const getCharacterData = () => {
    if (isSystem) return null
    return participant?.chara
  }

  const characterName_value = getCharacterName()
  const charaData = getCharacterData()
  const isClickable = clickable && onClick

  // 最終的なスケールを計算（基本サイズ * ユーザー設定による拡大）
  const finalScale = size * (showLargeCharacterImage ? 1.5 : 1)

  // システムメッセージ用のアイコン
  if (isSystem) {
    const systemIconSize = Math.round(32 * finalScale) // 基準32pxに対してスケール適用
    return (
      <div
        className={`bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ${className} ${
          isClickable ? 'cursor-pointer hover:bg-blue-200' : ''
        }`}
        style={{
          width: systemIconSize,
          height: systemIconSize,
        }}
        onClick={isClickable ? onClick : undefined}
      >
        <svg className="w-1/2 h-1/2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )
  }

  // キャラクター画像がある場合
  if (charaData) {
    return (
      <div
        className={`relative ${className} ${isClickable ? 'cursor-pointer' : ''}`}
        onClick={isClickable ? onClick : undefined}
      >
        <CharacterImage
          chara={charaData}
          faceType="NORMAL"
          scale={finalScale}
          alt={characterName_value}
          className={`object-cover flex-shrink-0 ${
            isDead ? 'opacity-60 grayscale' : ''
          } ${isClickable ? 'hover:opacity-80' : ''}`}
        />
        {isDead && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
          </div>
        )}
      </div>
    )
  }

  // デフォルト：文字アイコン
  const fallbackIconSize = Math.round(32 * finalScale) // 基準32pxに対してスケール適用
  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium flex-shrink-0 relative ${className} ${
        isDead ? 'bg-gray-200 text-gray-500 opacity-60' : 'bg-gray-200 text-gray-600'
      } ${isClickable ? 'cursor-pointer hover:bg-gray-300' : ''}`}
      style={{
        width: fallbackIconSize,
        height: fallbackIconSize,
        fontSize: Math.round(fallbackIconSize * 0.4), // アイコンサイズの40%の文字サイズ
      }}
      onClick={isClickable ? onClick : undefined}
      title={characterName_value}
    >
      <span className={isDead ? 'line-through' : ''}>{characterName_value[0]}</span>
      {isDead && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
        </div>
      )}
    </div>
  )
}
