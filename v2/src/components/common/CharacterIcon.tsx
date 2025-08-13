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
  const getSizeConfig = (size: string) => {
    switch (size) {
      case 'xs':
        return { classes: 'w-4 h-4 text-xs', pixels: 16 }
      case 'sm':
        return { classes: 'w-6 h-6 text-xs', pixels: 24 }
      case 'md':
        return { classes: 'w-8 h-8 text-xs', pixels: 32 }
      case 'lg':
        return { classes: 'w-10 h-10 text-sm', pixels: 40 }
      case 'xl':
        return { classes: 'w-12 h-12 text-sm', pixels: 48 }
      default:
        return { classes: 'w-8 h-8 text-xs', pixels: 32 }
    }
  }

  // キャラクター名の取得
  const getCharacterName = (): string => {
    if (isSystem) return 'システム'
    return characterName?.name || participant?.chara_name?.name || 'Unknown'
  }

  // キャラクター画像URLの取得
  const getCharacterImageUrl = (): string | null => {
    if (isSystem) return null

    // キャラクター情報から画像URL構築
    const charaId = participant?.chara?.id
    const charachipId = participant?.chara?.charachip_id
    if (charaId && charachipId) {
      // 標準的なキャラクター画像URLパターン（実際のAPIに合わせて調整必要）
      return `/api/charachip/${charachipId}/chara/${charaId}/image`
    }

    return null
  }

  const characterName_value = getCharacterName()
  const imageUrl = getCharacterImageUrl()
  const sizeConfig = getSizeConfig(size)
  const isClickable = clickable && onClick

  // システムメッセージ用のアイコン
  if (isSystem) {
    return (
      <div
        className={`${sizeConfig.classes} bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ${className} ${
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
          width={sizeConfig.pixels}
          height={sizeConfig.pixels}
          className={`rounded-full object-cover flex-shrink-0 ${sizeConfig.classes} ${
            isDead ? 'opacity-60 grayscale' : ''
          } ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={isClickable ? onClick : undefined}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          priority={size === 'xl' || size === 'lg'} // 大きいアイコンは優先読み込み
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
      className={`${sizeConfig.classes} rounded-full flex items-center justify-center font-medium flex-shrink-0 ${className} ${
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
