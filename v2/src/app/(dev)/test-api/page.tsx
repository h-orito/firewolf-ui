'use client'

import { apiClient } from '@/lib/api/client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { VillageMessage } from '@/components/ui/VillageMessage'

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
    <main className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">FIREWOLF v2 動作確認</h1>

      <Card>
        <CardHeader>
          <CardTitle>API動作確認</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testApiCall}>API呼び出しテスト</Button>
          <div className="text-center">
            <p>{status}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>村メッセージ表示テスト（等幅フォント）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0 border border-border rounded-md">
            {/* TODO: VillageMessageコンポーネントの型更新後に復旧 */}
            <p className="p-4 text-gray-500">
              VillageMessage コンポーネントは新しいAPI型に更新されました。
              デモメッセージは一時的に非表示にしています。
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
