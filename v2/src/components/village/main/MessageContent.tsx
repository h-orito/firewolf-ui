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
  villageId: _villageId,
  onAnchorClick,
}) => {
  // 改良版HTMLエスケープ（SSR対応）
  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\//g, '&#x2F;')
  }

  // デコレーション変換（FIREWOLF仕様）
  const processDecorations = (content: string): string => {
    let processed = content

    // FIREWOLF仕様のデコレーション（7種類）
    const decorations = [
      // 1. 太字: [[b]]text[[/b]]
      {
        pattern: /\[\[b\]\](.*?)\[\[\/b\]\]/g,
        replacement: '<strong>$1</strong>',
      },
      // 2. 大きい文字: [[large]]text[[/large]]
      {
        pattern: /\[\[large\]\](.*?)\[\[\/large\]\]/g,
        replacement: '<span class="text-lg">$1</span>',
      },
      // 3. 小さい文字: [[small]]text[[/small]]
      {
        pattern: /\[\[small\]\](.*?)\[\[\/small\]\]/g,
        replacement: '<span class="text-sm">$1</span>',
      },
      // 4. 打ち消し線: [[s]]text[[/s]]
      {
        pattern: /\[\[s\]\](.*?)\[\[\/s\]\]/g,
        replacement: '<del>$1</del>',
      },
      // 5. ルビ: [[ruby]]text[[rt]]ruby[[/rt]][[/ruby]]
      {
        pattern: /\[\[ruby\]\](.*?)\[\[rt\]\](.*?)\[\[\/rt\]\]\[\[\/ruby\]\]/g,
        replacement: '<ruby>$1<rt>$2</rt></ruby>',
      },
      // 6. 隠し文字（スポイラー）: [[cw]]text[[/cw]]
      {
        pattern: /\[\[cw\]\](.*?)\[\[\/cw\]\]/g,
        replacement: '<span class="spoiler" data-spoiler="hidden">$1</span>',
      },
      // 7. 色指定: [[#ff0000]]text[[/#]]
      {
        pattern: /\[\[#([0-9a-fA-F]{6})\]\](.*?)\[\[\/\#\]\]/g,
        replacement: '<span style="color:#$1">$2</span>',
      },
    ]

    decorations.forEach((decoration) => {
      processed = processed.replace(decoration.pattern, decoration.replacement)
    })

    return processed
  }

  // アンカーリンク処理（FIREWOLF仕様 7種類対応）
  const processAnchors = (content: string): string => {
    let processed = content

    const anchors = [
      // 1. 通常発言アンカー (>>1234)
      {
        pattern: /&gt;&gt;(\d+)/g,
        replacement:
          '<a href="#" onclick="return false;" data-anchor-type="normal" data-anchor-value="$1" class="text-blue-600 hover:text-blue-800 underline font-medium">&gt;&gt;$1</a>',
      },
      // 2. 人狼の囁きアンカー (>>*1234)
      {
        pattern: /&gt;&gt;\*(\d+)/g,
        replacement:
          '<a href="#" onclick="return false;" data-anchor-type="werewolf" data-anchor-value="$1" class="text-red-600 hover:text-red-800 underline font-medium">&gt;&gt;*$1</a>',
      },
      // 3. 共鳴発言アンカー (>>=1234)
      {
        pattern: /&gt;&gt;=(\d+)/g,
        replacement:
          '<a href="#" onclick="return false;" data-anchor-type="mason" data-anchor-value="$1" class="text-green-600 hover:text-green-800 underline font-medium">&gt;&gt;=$1</a>',
      },
      // 4. 恋人発言アンカー (>>?1234)
      {
        pattern: /&gt;&gt;\?(\d+)/g,
        replacement:
          '<a href="#" onclick="return false;" data-anchor-type="lover" data-anchor-value="$1" class="text-pink-600 hover:text-pink-800 underline font-medium">&gt;&gt;?$1</a>',
      },
      // 5. 見学発言アンカー (>>@1234)
      {
        pattern: /&gt;&gt;@(\d+)/g,
        replacement:
          '<a href="#" onclick="return false;" data-anchor-type="spectator" data-anchor-value="$1" class="text-indigo-600 hover:text-indigo-800 underline font-medium">&gt;&gt;@$1</a>',
      },
      // 6. 独り言アンカー (>>-1234)
      {
        pattern: /&gt;&gt;-(\d+)/g,
        replacement:
          '<a href="#" onclick="return false;" data-anchor-type="monologue" data-anchor-value="$1" class="text-gray-600 hover:text-gray-800 underline font-medium">&gt;&gt;-$1</a>',
      },
      // 7. 死者の呻きアンカー (>>+1234)
      {
        pattern: /&gt;&gt;\+(\d+)/g,
        replacement:
          '<a href="#" onclick="return false;" data-anchor-type="grave" data-anchor-value="$1" class="text-cyan-600 hover:text-cyan-800 underline font-medium">&gt;&gt;+$1</a>',
      },
    ]

    anchors.forEach((anchor) => {
      processed = processed.replace(anchor.pattern, anchor.replacement)
    })

    return processed
  }

  // 改行処理
  const processLineBreaks = (content: string): string => {
    return content.replace(/\n/g, '<br>')
  }

  // XSS対策：危険なタグと属性を除去
  const sanitizeContent = (content: string): string => {
    // 許可されたタグのみを残し、危険なスクリプトやイベントハンドラーを削除
    return content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed[^>]*>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '') // onclickなどのイベントハンドラー削除（data-属性は除く）
      .replace(/javascript:/gi, '')
  }

  // コンテンツ処理の統合
  const processContent = (rawText: string): string => {
    // 1. HTMLエスケープ
    let processed = escapeHtml(rawText)

    // 2. 改行処理
    processed = processLineBreaks(processed)

    // 3. デコレーション変換
    processed = processDecorations(processed)

    // 4. アンカーリンク処理
    processed = processAnchors(processed)

    // 5. XSS対策
    processed = sanitizeContent(processed)

    return processed
  }

  const processedContent = processContent(text)

  // アンカークリックハンドラー（設定依存の分岐処理）
  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement

    // スポイラータグのクリック処理
    if (target.tagName === 'SPAN' && target.hasAttribute('data-spoiler')) {
      event.preventDefault()
      const currentState = target.getAttribute('data-spoiler')
      if (currentState === 'hidden') {
        target.setAttribute('data-spoiler', 'revealed')
      } else {
        target.setAttribute('data-spoiler', 'hidden')
      }
      return
    }

    // アンカータグのクリック処理
    if (target.tagName === 'A' && target.hasAttribute('data-anchor-type')) {
      event.preventDefault()
      const anchorType = target.getAttribute('data-anchor-type')
      const anchorValue = target.getAttribute('data-anchor-value')

      if (anchorType && anchorValue) {
        // デフォルトのハンドラーが提供されている場合は呼び出し
        if (onAnchorClick) {
          onAnchorClick(anchorType, anchorValue)
        } else {
          // デフォルト動作：クリップボードにコピー
          handleDefaultAnchorClick(anchorType, anchorValue, target)
        }
      }
    }
  }

  // デフォルトアンカークリック処理（クリップボードコピー）
  const handleDefaultAnchorClick = async (
    anchorType: string,
    anchorValue: string,
    targetElement: HTMLElement
  ) => {
    try {
      let textToCopy = ''

      switch (anchorType) {
        case 'normal':
          textToCopy = `>>${anchorValue}`
          break
        case 'werewolf':
          textToCopy = `>>*${anchorValue}`
          break
        case 'mason':
          textToCopy = `>>=${anchorValue}`
          break
        case 'lover':
          textToCopy = `>>?${anchorValue}`
          break
        case 'spectator':
          textToCopy = `>>@${anchorValue}`
          break
        case 'monologue':
          textToCopy = `>>-${anchorValue}`
          break
        case 'grave':
          textToCopy = `>>+${anchorValue}`
          break
        default:
          textToCopy = anchorValue
      }

      // クリップボードにコピー
      // モダンブラウザのClipboard APIを使用
      await navigator.clipboard.writeText(textToCopy)

      // 成功の視覚的フィードバック（簡易実装）
      const originalColor = targetElement.style.color
      targetElement.style.color = '#10b981'
      setTimeout(() => {
        targetElement.style.color = originalColor
      }, 200)
    } catch (error) {
      console.warn('アンカーテキストのコピーに失敗しました:', error)
    }
  }

  return (
    <div
      className="whitespace-pre-wrap break-words leading-relaxed"
      dangerouslySetInnerHTML={{ __html: processedContent }}
      onClick={handleContentClick}
    />
  )
}
