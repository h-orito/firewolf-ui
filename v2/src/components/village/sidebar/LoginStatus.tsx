/**
 * ログイン状態表示コンポーネント
 */

import React from 'react'
import { useAuth } from '@/hooks/useAuth'

interface LoginStatusProps {
  /** ログインユーザー情報 */
  user?: any
}

/**
 * ログイン状態表示
 *
 * ログイン状態とユーザー情報を表示
 * 暫定実装
 */
export const LoginStatus: React.FC<LoginStatusProps> = ({ user }) => {
  const { isAuthenticated, getUserDisplayName, signOut } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-2">未ログイン</div>
        <button
          onClick={() => {
            // ログインモーダル表示（未実装）
            console.log('ログインモーダルを表示')
          }}
          className="text-xs py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ログイン
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="text-xs text-gray-700 mb-1">ログイン中</div>
      <div className="text-xs font-medium text-gray-900 mb-2 truncate">{getUserDisplayName()}</div>
      <div className="flex space-x-1">
        <button
          onClick={() => {
            // マイページへ遷移（未実装）
            console.log('マイページへ遷移')
          }}
          className="flex-1 text-xs py-1 px-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          マイページ
        </button>
        <button
          onClick={signOut}
          className="flex-1 text-xs py-1 px-2 text-red-600 border border-red-300 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}
