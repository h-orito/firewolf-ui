/**
 * ナビゲーションリンクセクション
 */

import type { components } from '@/types/generated/api'
import Link from 'next/link'
import React from 'react'

type VillageView = components['schemas']['VillageView']

interface NavigationLinksProps {
  /** 村情報 */
  village: VillageView
}

/**
 * ナビゲーションリンクセクション
 *
 * 切り抜き、トップ、Xポストなどのリンクを提供
 * 暫定実装
 */
export const NavigationLinks: React.FC<NavigationLinksProps> = ({ village }) => {
  const handleXPost = () => {
    const url = `${window.location.origin}/village/${village.id}`
    const text = `${village.name} - 人狼ゲーム`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}/village/${village.id}`
    try {
      await navigator.clipboard.writeText(url)
      // 成功通知（未実装）
      console.log('URLをコピーしました')
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {/* 切り抜き機能 */}
        <button
          onClick={() => {
            // 切り抜きモーダル表示（未実装）
            console.log('切り抜きモーダルを表示')
          }}
          className="w-full text-xs py-2 px-3 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center space-x-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>切り抜き</span>
        </button>

        {/* トップページへ */}
        <Link
          href="/"
          className="block w-full text-xs py-2 px-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        >
          トップページ
        </Link>

        {/* URL関連 */}
        <div className="flex space-x-1">
          <button
            onClick={handleCopyUrl}
            className="flex-1 text-xs py-2 px-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center space-x-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>URL</span>
          </button>

          <button
            onClick={handleXPost}
            className="flex-1 text-xs py-2 px-3 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center space-x-1"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>X</span>
          </button>
        </div>
      </div>
    </div>
  )
}
