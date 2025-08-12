/**
 * メッセージコンテンツ変換・表示コンポーネント
 */

import React from 'react'

interface MessageContentProps {
  /** メッセージテキスト */
  text: string
  /** 村ID */
  villageId: number
  /** アンカークリック時の動作 */
  onAnchorClick?: (anchorType: string, anchorValue: string) => void
}

/**
 * メッセージコンテンツ
 *
 * HTMLエスケープ、デコレーション変換、アンカーリンク生成を行う
 * 現在は暫定実装
 */
export const MessageContent: React.FC<MessageContentProps> = ({
  text,
  villageId,
  onAnchorClick,
}) => {
  // HTMLエスケープ
  const escapeHtml = (str: string): string => {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  // デコレーション変換（暫定実装）
  const processDecorations = (content: string): string => {
    let processed = content

    // 基本的なデコレーション（11種類の装飾に対応予定）
    const decorations = [
      // 太字
      { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
      // 斜体
      { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
      // 下線
      { pattern: /__(.*?)__/g, replacement: '<u>$1</u>' },
      // 打ち消し線
      { pattern: /~~(.*?)~~/g, replacement: '<s>$1</s>' },
      // 赤文字
      { pattern: /\[red\](.*?)\[\/red\]/g, replacement: '<span style="color: #dc2626;">$1</span>' },
      // 青文字
      {
        pattern: /\[blue\](.*?)\[\/blue\]/g,
        replacement: '<span style="color: #2563eb;">$1</span>',
      },
      // 緑文字
      {
        pattern: /\[green\](.*?)\[\/green\]/g,
        replacement: '<span style="color: #16a34a;">$1</span>',
      },
      // 大文字
      {
        pattern: /\[big\](.*?)\[\/big\]/g,
        replacement: '<span style="font-size: 1.25em;">$1</span>',
      },
      // 小文字
      {
        pattern: /\[small\](.*?)\[\/small\]/g,
        replacement: '<span style="font-size: 0.875em;">$1</span>',
      },
    ]

    decorations.forEach((decoration) => {
      processed = processed.replace(decoration.pattern, decoration.replacement)
    })

    return processed
  }

  // アンカーリンク処理（暫定実装）
  const processAnchors = (content: string): string => {
    let processed = content

    // 7種類のアンカー形式に対応予定
    const anchors = [
      // 発言アンカー (>>123)
      {
        pattern: /&gt;&gt;(\d+)/g,
        replacement: (match: string, num: string) => {
          const handleClick = () => onAnchorClick?.('message', num)
          return `<a href="#" onclick="return false;" data-anchor-type="message" data-anchor-value="${num}" class="text-blue-600 hover:text-blue-800 underline">&gt;&gt;${num}</a>`
        },
      },
      // 参加者アンカー (@name)
      {
        pattern: /@([^\s@]+)/g,
        replacement: (match: string, name: string) => {
          const handleClick = () => onAnchorClick?.('participant', name)
          return `<a href="#" onclick="return false;" data-anchor-type="participant" data-anchor-value="${name}" class="text-green-600 hover:text-green-800 underline">@${name}</a>`
        },
      },
      // URLリンク
      {
        pattern: /(https?:\/\/[^\s]+)/g,
        replacement: (match: string, url: string) => {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${url}</a>`
        },
      },
    ]

    anchors.forEach((anchor) => {
      if (typeof anchor.replacement === 'function') {
        processed = processed.replace(anchor.pattern, anchor.replacement)
      } else {
        processed = processed.replace(anchor.pattern, anchor.replacement)
      }
    })

    return processed
  }

  // コンテンツ処理の統合
  const processContent = (rawText: string): string => {
    // 1. HTMLエスケープ
    let processed = escapeHtml(rawText)

    // 2. デコレーション変換
    processed = processDecorations(processed)

    // 3. アンカーリンク処理
    processed = processAnchors(processed)

    return processed
  }

  const processedContent = processContent(text)

  // アンカークリックハンドラー
  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.tagName === 'A' && target.hasAttribute('data-anchor-type')) {
      event.preventDefault()
      const anchorType = target.getAttribute('data-anchor-type')
      const anchorValue = target.getAttribute('data-anchor-value')
      if (anchorType && anchorValue && onAnchorClick) {
        onAnchorClick(anchorType, anchorValue)
      }
    }
  }

  return (
    <div
      className="whitespace-pre-wrap break-words"
      dangerouslySetInnerHTML={{ __html: processedContent }}
      onClick={handleContentClick}
    />
  )
}
