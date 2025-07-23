'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthTestPage() {
  const { user, isLoading, signInWithGoogle, signInWithTwitter, signOut } = useAuth()

  if (isLoading) {
    return (
      <main className="container mx-auto p-8">
        <div className="text-center">認証状態を確認中...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">認証テスト</h1>

      <Card>
        <CardHeader>
          <CardTitle>認証状態</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <p className="text-green-600">ログイン済み</p>
              <div className="space-y-2">
                <p>
                  <strong>ユーザー名:</strong> {user.displayName || 'なし'}
                </p>
                <p>
                  <strong>メールアドレス:</strong> {user.email || 'なし'}
                </p>
                <p>
                  <strong>UID:</strong> {user.uid}
                </p>
              </div>
              <Button onClick={signOut} variant="danger">
                ログアウト
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">未ログイン</p>
              <div className="space-x-4">
                <Button onClick={signInWithGoogle} variant="primary">
                  Google でログイン
                </Button>
                <Button onClick={signInWithTwitter} variant="outline">
                  Twitter でログイン
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
