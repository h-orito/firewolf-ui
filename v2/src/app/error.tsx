'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo, faHome } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // エラーをログに記録
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-300 mb-4">エラー</h1>
          <h2 className="text-xl font-bold text-gray-700 mb-2">何かがうまくいきませんでした</h2>
          <p className="text-gray-600">
            予期しないエラーが発生しました。しばらく経ってから再度お試しください。
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-4">
            <div className="text-sm text-gray-600 text-left">
              <p className="mb-2">エラーが続く場合は以下をお試しください：</p>
              <ul className="space-y-1">
                <li>• ページを再読み込みしてください</li>
                <li>• ブラウザのキャッシュをクリアしてください</li>
                <li>• しばらく時間をおいてからアクセスしてください</li>
                <li>• 問題が継続する場合は管理者にお問い合わせください</li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={reset} variant="default">
                <FontAwesomeIcon icon={faRedo} className="mr-2" />
                再試行
              </Button>
              <Button onClick={() => (window.location.href = '/')} variant="outline">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                トップページに戻る
              </Button>
            </div>
          </div>
        </Card>

        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-8 p-4 bg-red-50 border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">開発者向け情報</h3>
            <div className="text-left">
              <p className="text-sm text-red-700 mb-2">
                <strong>エラーメッセージ:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-sm text-red-700 mb-2">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
              <details className="text-sm">
                <summary className="cursor-pointer text-red-700 font-medium">
                  スタックトレース
                </summary>
                <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                  {error.stack}
                </pre>
              </details>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
