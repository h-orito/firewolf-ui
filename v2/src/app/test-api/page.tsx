'use client'

import { apiClient } from '@/lib/api/client'
import { useState } from 'react'

export default function TestApiPage() {
  const [status, setStatus] = useState('')

  const testApiCall = async () => {
    try {
      setStatus('API呼び出し中...')

      // バージョン情報取得テスト（パラメータ不要）
      const response = await apiClient.GET('/version')

      if (response.data) {
        setStatus('成功: APIから正常にレスポンスを取得しました')
        console.log('API Response:', response.data)
      } else {
        setStatus('エラー: レスポンスが空でした')
      }
    } catch (error) {
      setStatus(`エラー: ${error}`)
      console.error('API Error:', error)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4">API動作確認</h1>
      <button
        onClick={testApiCall}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        API呼び出しテスト
      </button>
      <div className="text-center">
        <p>{status}</p>
      </div>
    </main>
  )
}
