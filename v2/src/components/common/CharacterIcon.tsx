/**
 * キャラクターアイコン共通コンポーネント
 */

import React from 'react'
import Image from 'next/image'
import type { components } from '@/types/generated/api'

type VillageParticipantView = components['schemas']['VillageParticipantView']
type VillageParticipantName = components['schemas']['VillageParticipantName']

interface CharacterIconProps {
  /** 参加者情報 */
  participant?: VillageParticipantView
  /** キャラクター名情報 */
  characterName?: VillageParticipantName
  /** アイコンサイズ */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
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
  size = 'md',
  isSystem = false,
  isDead = false,
  clickable = false,
  onClick,
  className = '',
}) => {
  // サイズ設定
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'xs':
        return 'w-4 h-4 text-xs'
      case 'sm':
        return 'w-6 h-6 text-xs'
      case 'md':
        return 'w-8 h-8 text-xs'
      case 'lg':
        return 'w-10 h-10 text-sm'
      case 'xl':
        return 'w-12 h-12 text-sm'
      default:
        return 'w-8 h-8 text-xs'
    }
  }

  // キャラクター名の取得
  const getCharacterName = (): string => {
    if (isSystem) return 'システム'
    return characterName?.name || participant?.chara_name?.name || 'Unknown'
  }

  // キャラクター画像URLの取得（暫定：プレースホルダー）
  const getCharacterImageUrl = (): string | null => {
    // TODO: 実際のキャラクター画像URL取得ロジック
    // participant?.chara_image?.url などから取得予定
    return null
  }

  const characterName_value = getCharacterName()
  const imageUrl = getCharacterImageUrl()
  const sizeClasses = getSizeClasses(size)
  const isClickable = clickable && onClick

  // システムメッセージ用のアイコン
  if (isSystem) {
    return (
      <div
        className={`${sizeClasses} bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ${className} ${
          isClickable ? 'cursor-pointer hover:bg-blue-200' : ''
        }`}
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
  if (imageUrl) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={imageUrl}
          alt={characterName_value}
          width={32}
          height={32}
          className={`rounded-full object-cover flex-shrink-0 ${sizeClasses} ${
            isDead ? 'opacity-60 grayscale' : ''
          } ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={isClickable ? onClick : undefined}
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
  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-medium flex-shrink-0 ${className} ${
        isDead ? 'bg-gray-200 text-gray-500 opacity-60' : 'bg-gray-200 text-gray-600'
      } ${isClickable ? 'cursor-pointer hover:bg-gray-300' : ''}`}
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
