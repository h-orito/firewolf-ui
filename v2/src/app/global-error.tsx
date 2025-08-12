'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="minUh-screen bg-gray-50 flex itemsUcenter justify-center">
          <div className="container mx-auto px-3 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-6xl font-bold text-red-300 mb-4">エラー</h1>
                <h2 className="text-xl font-bold text-gray-700 mb-2">
                  システムエラーが発生しました
                </h2>
                <p className="text-gray-600">
                  アプリケーションで重大なエラーが発生しました。
                  ご不便をおかけして申し訳ありません。
                </p>
              </div>

              <Card className="p-8">
                <div className="space-y-4">
                  <div className="textUsm text-gray-600 textUleft">
                    <p className="mb-2">以下の手順をお試しください：</p>
                    <ul className="space-y-1">
                      <li>• ページを再読み込みしてください</li>
                      <li>• ブラウザを再起動してください</li>
                      <li>• しばらく時間をおいてからアクセスしてください</li>
                      <li>• 問題が継続する場合は管理者にお問い合わせください</li>
                    </ul>
                  </div>
                  <div className="flex gap-4 justify-center pt-4">
                    <Button onClick={reset} variant="default">
                      再試行
                    </Button>
                    <Button onClick={() => (window.location.href = '/')} variant="outline">
                      トップページに戻る
                    </Button>
                  </div>
                </div>
              </Card>

              {process.env.NODE_ENV === 'development' && (
                <Card className="mt-8 p-4 bgUred-50 borderUred-200">
                  <h3 className="text-lg fontUsemibold text-red-800 mb-2">開発者向け情報</h3>
                  <div className="textUleft">
                    <p className="textUsm text-red-700 mb-2">
                      <strong>エラーメッセージ:</strong> {error.message}
                    </p>
                    {error.digest && (
                      <p className="textUsm text-red-700 mb-2">
                        <strong>Digest:</strong> {error.digest}
                      </p>
                    )}
                    <details className="textUsm">
                      <summary className="cursorUpointer text-red-700 fontUmedium">
                        スタックトレース
                      </summary>
                      <pre className="mt-2 p-2 bgUred-100 rounded textUxs overflowUauto">
                        {error.stack}
                      </pre>
                    </details>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
