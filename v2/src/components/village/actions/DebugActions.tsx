/**
 * デバッグ専用アクションコンポーネント
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface DebugActionsProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
}

/**
 * デバッグ専用アクション
 *
 * 開発用のデバッグ機能を提供（本番環境では無効化される）
 */
export const DebugActions: React.FC<DebugActionsProps> = ({ village, user }) => {
  const [debugCommand, setDebugCommand] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [debugResult, setDebugResult] = useState('')
  const [showResultDialog, setShowResultDialog] = useState(false)

  // デバッグモードチェック（開発環境でのみ表示）
  const isDebugMode = process.env.NODE_ENV === 'development'
  const isAdmin = user && (user.role === 'admin' || user.isAdmin)

  const debugActions = [
    { value: 'village_info', label: '村情報をJSON出力' },
    { value: 'participant_info', label: '参加者情報をJSON出力' },
    { value: 'message_info', label: 'メッセージ情報をJSON出力' },
    { value: 'api_test', label: 'API接続テスト' },
    { value: 'state_dump', label: '状態管理の内容出力' },
    { value: 'error_simulation', label: 'エラーシミュレーション' },
    { value: 'performance_test', label: 'パフォーマンステスト' },
    { value: 'clear_cache', label: 'キャッシュクリア' },
  ]

  const executeDebugAction = async () => {
    try {
      let result = ''

      switch (selectedAction) {
        case 'village_info':
          result = JSON.stringify(village, null, 2)
          break

        case 'participant_info':
          result = JSON.stringify(village.participant, null, 2)
          break

        case 'message_info':
          // メッセージ情報の取得（実際の実装では適切なAPIを呼び出し）
          result = 'メッセージ情報の取得機能は未実装'
          break

        case 'api_test':
          // API接続テスト
          try {
            const response = await fetch('/api/health')
            const data = await response.json()
            result = JSON.stringify(data, null, 2)
          } catch (error) {
            result = `API接続エラー: ${error}`
          }
          break

        case 'state_dump':
          // 状態管理の内容出力
          result = `
ローカルストレージ:
${JSON.stringify(localStorage, null, 2)}

セッションストレージ:
${JSON.stringify(sessionStorage, null, 2)}
          `.trim()
          break

        case 'error_simulation':
          throw new Error('デバッグ用エラーシミュレーション')

        case 'performance_test':
          const start = performance.now()
          // 簡単なパフォーマンステスト
          for (let i = 0; i < 100000; i++) {
            Math.random()
          }
          const end = performance.now()
          result = `パフォーマンステスト完了: ${end - start}ms`
          break

        case 'clear_cache':
          localStorage.clear()
          sessionStorage.clear()
          result = 'キャッシュをクリアしました'
          break

        default:
          if (debugCommand.trim()) {
            result = `カスタムコマンド実行: ${debugCommand}`
          } else {
            result = 'アクションが選択されていません'
          }
      }

      setDebugResult(result)
      setShowResultDialog(true)
    } catch (error) {
      setDebugResult(`エラー: ${error}`)
      setShowResultDialog(true)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('クリップボードにコピーしました')
    } catch (error) {
      console.error('クリップボードコピーエラー:', error)
    }
  }

  if (!isDebugMode || !isAdmin) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">
          {!isDebugMode ? 'デバッグモードは開発環境でのみ利用可能です' : 'デバッグ権限が必要です'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 警告メッセージ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-center">
          <span className="text-yellow-600 mr-2">⚠️</span>
          <span className="text-sm text-yellow-800 font-medium">
            デバッグモード（開発環境専用）
          </span>
        </div>
      </div>

      {/* 定型デバッグアクション */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">定型デバッグアクション</h4>
        <div className="space-y-2">
          <Select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
            <option value="">デバッグアクションを選択...</option>
            {debugActions.map((action) => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </Select>
          <Button onClick={executeDebugAction} disabled={!selectedAction} className="w-full">
            実行
          </Button>
        </div>
      </div>

      {/* カスタムデバッグコマンド */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">カスタムデバッグコマンド</h4>
        <div className="space-y-2">
          <Textarea
            value={debugCommand}
            onChange={(e) => setDebugCommand(e.target.value)}
            placeholder="デバッグコマンドを入力..."
            rows={3}
            className="font-mono text-sm"
          />
          <Button
            onClick={executeDebugAction}
            disabled={!debugCommand.trim()}
            variant="outline"
            className="w-full"
          >
            カスタムコマンド実行
          </Button>
        </div>
      </div>

      {/* システム情報 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">システム情報</h4>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-gray-600">環境:</span>
            <span>{process.env.NODE_ENV}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ユーザーエージェント:</span>
            <span className="truncate ml-2" title={navigator.userAgent}>
              {navigator.userAgent}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">画面サイズ:</span>
            <span>
              {window.screen.width}x{window.screen.height}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ビューポート:</span>
            <span>
              {window.innerWidth}x{window.innerHeight}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">言語:</span>
            <span>{navigator.language}</span>
          </div>
        </div>
      </div>

      {/* ローカルストレージ管理 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">ストレージ管理</h4>
        <div className="space-y-2">
          <Button
            onClick={() => {
              setDebugResult(JSON.stringify(localStorage, null, 2))
              setShowResultDialog(true)
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            ローカルストレージ表示
          </Button>
          <Button
            onClick={() => {
              localStorage.clear()
              alert('ローカルストレージをクリアしました')
            }}
            variant="outline"
            size="sm"
            className="w-full text-red-600"
          >
            ローカルストレージクリア
          </Button>
        </div>
      </div>

      {/* 結果表示ダイアログ */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>デバッグ実行結果</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded p-3">
              <pre className="text-xs font-mono whitespace-pre-wrap max-h-96 overflow-auto">
                {debugResult}
              </pre>
            </div>
            <div className="flex space-x-2 justify-end">
              <Button onClick={() => copyToClipboard(debugResult)} variant="outline" size="sm">
                コピー
              </Button>
              <Button onClick={() => setShowResultDialog(false)} variant="outline">
                閉じる
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
