/**
 * 汎用的なアコーディオン（展開/縮小）パネルコンポーネント
 */

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

interface CollapsiblePanelProps {
  /** パネルのタイトル */
  title: string
  /** 初期状態で展開するかどうか */
  defaultOpen?: boolean
  /** 子コンテンツ */
  children: React.ReactNode
  /** カスタムスタイルクラス */
  className?: string
  /** タイトル部分のカスタムスタイルクラス */
  titleClassName?: string
  /** コンテンツ部分のカスタムスタイルクラス */
  contentClassName?: string
  /** 展開状態の変更時のコールバック */
  onToggle?: (isExpanded: boolean) => void
}

/**
 * CollapsiblePanel コンポーネント
 *
 * 統一されたアコーディオンUIを提供する汎用コンポーネント。
 * 矢印表示は要望に従って以下のルールで統一:
 * - 未展開: 右向き矢印 (faChevronRight)
 * - 展開済み: 下向き矢印 (faChevronDown)
 */
export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  defaultOpen = false,
  children,
  className = '',
  titleClassName = '',
  contentClassName = '',
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)

  const toggleExpanded = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    onToggle?.(newState)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        onClick={toggleExpanded}
        className={`flex items-center justify-between w-full text-left p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:bg-gray-50 transition-colors ${titleClassName}`}
        aria-expanded={isExpanded}
        aria-controls={`collapsible-content-${title}`}
      >
        <span className="font-medium">{title}</span>
        <FontAwesomeIcon
          icon={isExpanded ? faChevronDown : faChevronRight}
          className="h-4 w-4 transition-transform"
          aria-hidden="true"
        />
      </button>

      <div
        id={`collapsible-content-${title}`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isExpanded}
      >
        <div className={`pt-1 ${contentClassName}`}>{children}</div>
      </div>
    </div>
  )
}
