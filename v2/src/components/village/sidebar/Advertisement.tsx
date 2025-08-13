/**
 * 広告コンポーネント
 * Google AdSenseとの統合実装
 */

'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AdvertisementProps {
  /** 広告スロット識別子 */
  slot: string
  /** 広告サイズ（width x height） */
  size?: { width: number; height: number }
  /** レスポンシブ広告の場合はtrue */
  responsive?: boolean
  /** スタイル */
  style?: React.CSSProperties
  /** CSSクラス名 */
  className?: string
  /** テスト環境かどうか */
  isTest?: boolean
}

// 広告ブロッカー検出用の関数
const detectAdBlocker = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const testElement = document.createElement('div')
    testElement.innerHTML = '&nbsp;'
    testElement.className = 'adsbox'
    testElement.style.position = 'absolute'
    testElement.style.left = '-10000px'
    testElement.style.width = '1px'
    testElement.style.height = '1px'

    document.body.appendChild(testElement)

    // 100ms後にチェック
    setTimeout(() => {
      const isBlocked = testElement.offsetHeight === 0
      document.body.removeChild(testElement)
      resolve(isBlocked)
    }, 100)
  })
}

/**
 * 広告コンポーネント
 *
 * Google AdSenseとの統合機能を提供
 * - 動的スクリプトロード
 * - 広告ブロッカー検出
 * - フォールバック表示
 * - レスポンシブ対応
 */
export const Advertisement: React.FC<AdvertisementProps> = ({
  slot,
  size = { width: 300, height: 250 },
  responsive = false,
  style,
  className = '',
  isTest = process.env.NODE_ENV !== 'production',
}) => {
  const adRef = useRef<HTMLDivElement>(null)
  const [isAdBlocked, setIsAdBlocked] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [hasAdSenseError, setHasAdSenseError] = useState(false)

  // AdSenseスクリプトの動的ロード
  useEffect(() => {
    const loadAdSenseScript = () => {
      // 既にスクリプトが読み込まれている場合はスキップ
      if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
        setIsScriptLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.async = true
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      script.crossOrigin = 'anonymous'

      script.onload = () => {
        setIsScriptLoaded(true)
      }

      script.onerror = () => {
        setHasAdSenseError(true)
      }

      document.head.appendChild(script)
    }

    // テスト環境では実際の広告は読み込まない
    if (!isTest) {
      loadAdSenseScript()
    }
  }, [isTest])

  // 広告ブロッカー検出
  useEffect(() => {
    if (!isTest) {
      detectAdBlocker().then(setIsAdBlocked)
    }
  }, [isTest])

  // AdSense広告の初期化
  useEffect(() => {
    if (!isTest && isScriptLoaded && !isAdBlocked && adRef.current) {
      try {
        // AdSenseの広告を表示
        ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
        ;(window as any).adsbygoogle.push({})
      } catch (error) {
        console.error('AdSense initialization error:', error)
        setHasAdSenseError(true)
      }
    }
  }, [isScriptLoaded, isAdBlocked, isTest])

  // スタイルの計算
  const containerStyle: React.CSSProperties = {
    ...style,
    width: responsive ? '100%' : size.width,
    height: responsive ? 'auto' : size.height,
    minHeight: responsive ? 90 : size.height,
  }

  // フォールバック表示の条件
  const showFallback = isTest || isAdBlocked || hasAdSenseError

  if (showFallback) {
    return (
      <div
        className={`border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={containerStyle}
      >
        <div className="text-center p-2">
          {isTest && (
            <>
              <div className="font-medium">テスト環境</div>
              <div className="text-xs mt-1">広告エリア ({slot})</div>
            </>
          )}
          {isAdBlocked && (
            <>
              <div className="font-medium">広告ブロッカーが検出されました</div>
              <div className="text-xs mt-1">広告を表示するには無効にしてください</div>
            </>
          )}
          {hasAdSenseError && (
            <>
              <div className="font-medium">広告の読み込みに失敗しました</div>
              <div className="text-xs mt-1">しばらく時間をおいて再読み込みしてください</div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={adRef} className={className} style={containerStyle}>
      <ins
        className="adsbygoogle"
        style={{
          display: responsive ? 'block' : 'inline-block',
          width: responsive ? '100%' : size.width,
          height: responsive ? 'auto' : size.height,
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxx'}
        data-ad-slot={slot}
        data-ad-format={responsive ? 'auto' : undefined}
        data-full-width-responsive={responsive ? 'true' : undefined}
      />
    </div>
  )
}
