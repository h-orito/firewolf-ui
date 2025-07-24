'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export default function UserInfoSection() {
  const { isAuthenticated, login, isLoading } = useAuth()

  // 認証確認中も何も表示しない
  if (isLoading) {
    return null
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
                <Button onClick={() => login('google')} variant="primary">
                  <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                  Googleでログイン
                </Button>
                <Button onClick={() => login('twitter')} className="bg-black hover:bg-gray-800">
                  <FontAwesomeIcon icon={faTwitter} className="mr-2" />X (Twitter)でログイン
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  // ログイン済みの場合は何も表示しない
  return null
}
