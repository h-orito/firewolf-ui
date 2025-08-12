/**
 * 広告コンポーネント
 * Google AdSenseとの統合予定
 */

import React from 'react'

interface AdvertisementProps {
  /** 広告スロット識別子 */
  slot: string
  /** スタイル */
  style?: React.CSSProperties
  /** CSSクラス名 */
  className?: string
}

/**
 * 広告コンポーネント
 *
 * 現在は暫定実装で、プレースホルダーを表示
 * 将来的にはGoogle AdSenseとの統合を行う
 */
export const Advertisement: React.FC<AdvertisementProps> = ({ slot, style, className = '' }) => {
  return (
    <div
      className={`border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-sm ${className}`}
      style={style}
    >
      <div className="text-center">
        <div>広告エリア</div>
        <div className="text-xs mt-1">({slot})</div>
      </div>
    </div>
  )
}
