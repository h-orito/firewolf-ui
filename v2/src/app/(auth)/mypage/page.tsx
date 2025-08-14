'use client'

import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MyPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // 認証確認が完了してから処理
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace('/')
      return
    }

    // 自分のプレイヤー情報を取得してリダイレクト
    const fetchMyPlayer = async () => {
      try {
        const { data: myPlayer, error } = await apiClient.GET('/my-player')
        if (!myPlayer) {
          console.error('My player data is null')
          router.replace('/')
          return
        }

        router.replace(`/player-record/${myPlayer.id}`)
      } catch (error) {
        console.error('Error fetching my player info:', error)
        router.replace('/')
      }
    }

    fetchMyPlayer()
  }, [isAuthenticated, isLoading, router])

  // ローディング表示
  return (
    <div className="flex itemsUcenter justify-center minUh-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">マイページに移動中...</p>
      </div>
    </div>
  )
}
