'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import type { VillageError, VillageErrorType } from '@/types/village'

interface Props {
  children: ReactNode
  fallback?: (error: VillageError, retry: () => void) => ReactNode
  onError?: (error: VillageError) => void
}

interface State {
  hasError: boolean
  error: VillageError | null
}

/**
 * 村画面専用のError Boundary
 * 村画面で発生するエラーを適切にハンドリングし、ユーザーフレンドリーなエラー表示を提供
 */
export class VillageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // エラー種別を推定
    const errorType = VillageErrorBoundary.getErrorType(error)

    const villageError: VillageError = {
      type: errorType,
      message: error.message,
      detail: error.stack,
      timestamp: new Date(),
    }

    return {
      hasError: true,
      error: villageError,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError } = this.props
    const { error: villageError } = this.state

    // エラーログ出力
    console.error('Village Error Boundary caught an error:', error, errorInfo)

    // エラーハンドラーがある場合は呼び出し
    if (onError && villageError) {
      onError(villageError)
    }
  }

  /**
   * エラー内容からエラー種別を推定
   */
  private static getErrorType(error: Error): VillageErrorType {
    const message = error.message.toLowerCase()

    if (message.includes('village not found') || message.includes('404')) {
      return 'VILLAGE_NOT_FOUND'
    }
    if (message.includes('participant not found')) {
      return 'PARTICIPANT_NOT_FOUND'
    }
    if (message.includes('permission denied') || message.includes('403')) {
      return 'PERMISSION_DENIED'
    }
    if (message.includes('message post') || message.includes('post failed')) {
      return 'MESSAGE_POST_FAILED'
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'NETWORK_ERROR'
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return 'VALIDATION_ERROR'
    }
    if (message.includes('server error') || message.includes('500')) {
      return 'SERVER_ERROR'
    }

    return 'SERVER_ERROR' // デフォルト
  }

  /**
   * エラー種別に応じたユーザーフレンドリーなメッセージを取得
   */
  private getErrorMessage(errorType: VillageErrorType): string {
    switch (errorType) {
      case 'VILLAGE_NOT_FOUND':
        return '指定された村が見つかりません。URLを確認するか、村一覧から選択してください。'
      case 'PARTICIPANT_NOT_FOUND':
        return '参加者情報が見つかりません。再ログインをお試しください。'
      case 'PERMISSION_DENIED':
        return 'この操作を実行する権限がありません。'
      case 'MESSAGE_POST_FAILED':
        return '発言の投稿に失敗しました。時間をおいて再試行してください。'
      case 'NETWORK_ERROR':
        return 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
      case 'VALIDATION_ERROR':
        return '入力内容に問題があります。入力内容を確認してください。'
      case 'SERVER_ERROR':
      default:
        return 'サーバーエラーが発生しました。しばらく時間をおいて再試行してください。'
    }
  }

  /**
   * エラー状態をリセットして再試行
   */
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  /**
   * ページをリロード
   */
  private handleReload = () => {
    window.location.reload()
  }

  /**
   * 村一覧ページに戻る
   */
  private handleGoToVillageList = () => {
    window.location.href = '/village-list'
  }

  render() {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (!hasError || !error) {
      return children
    }

    // カスタムfallbackが指定されている場合は使用
    if (fallback) {
      return fallback(error, this.handleRetry)
    }

    // デフォルトのエラー表示
    const userMessage = this.getErrorMessage(error.type)
    const isVillageNotFound = error.type === 'VILLAGE_NOT_FOUND'

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">エラーが発生しました</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="error">{userMessage}</Alert>

            {/* 開発環境でのみエラー詳細を表示 */}
            {process.env.NODE_ENV === 'development' && (
              <details className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                <summary className="cursor-pointer font-medium">技術的な詳細（開発用）</summary>
                <div className="mt-2 space-y-1">
                  <div>
                    <strong>エラー種別:</strong> {error.type}
                  </div>
                  <div>
                    <strong>メッセージ:</strong> {error.message}
                  </div>
                  <div>
                    <strong>発生時刻:</strong> {error.timestamp.toLocaleString()}
                  </div>
                </div>
              </details>
            )}

            <div className="flex flex-col gap-2">
              {/* 村が見つからない場合は村一覧へのリンクを優先表示 */}
              {isVillageNotFound ? (
                <>
                  <Button onClick={this.handleGoToVillageList}>村一覧に戻る</Button>
                  <Button variant="outline" onClick={this.handleReload}>
                    ページをリロード
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={this.handleRetry}>再試行</Button>
                  <Button variant="outline" onClick={this.handleReload}>
                    ページをリロード
                  </Button>
                  <Button variant="ghost" onClick={this.handleGoToVillageList}>
                    村一覧に戻る
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}
