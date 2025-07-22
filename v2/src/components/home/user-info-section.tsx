'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export default function UserInfoSection() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <section className="py-12 bg-slate-100">
        <div className="container mx-auto px-6">
          <Card className="p-6">
            <div className="text-center">
              <div className="animate-pulse text-gray-600">認証状態を確認中...</div>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  if (!isAuthenticated) {
    return (
      <section className="py-12 bg-slate-100">
        <div className="container mx-auto px-6">
          <Card className="p-8">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">ログインして人狼ゲームを楽しもう</h2>
              <p className="text-gray-600">
                Googleアカウントまたは X (Twitter) アカウントでログインできます
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => login('google')} className="bg-blue-600 hover:bg-blue-700">
                  Googleでログイン
                </Button>
                <Button onClick={() => login('twitter')} className="bg-black hover:bg-gray-800">
                  X (Twitter)でログイン
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-slate-100">
      <div className="container mx-auto px-6">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.displayName || 'プレイヤー'}
                </h3>
                <p className="text-sm text-gray-600">ログイン中</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline">
              ログアウト
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
