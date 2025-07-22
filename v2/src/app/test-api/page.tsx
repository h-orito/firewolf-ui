'use client'

import { apiClient } from '@/lib/api/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VillageMessage } from '@/components/ui/village-message'

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
            <VillageMessage speaker="村人A" time="23:30" messageType="normal">
              おはようございます。今日は良い天気ですね。 複数行のメッセージも
              きちんと表示されるはずです。
            </VillageMessage>
            <VillageMessage speaker="人狼B" time="23:31" messageType="werewolf">
              今夜は誰を襲撃しましょうか？
            </VillageMessage>
            <VillageMessage speaker="共有者C" time="23:32" messageType="mason">
              相方、作戦を相談しましょう。
            </VillageMessage>
            <VillageMessage speaker="霊能者D" time="23:33" messageType="grave">
              私は既に死んでいますが、まだ見守っています...
            </VillageMessage>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
