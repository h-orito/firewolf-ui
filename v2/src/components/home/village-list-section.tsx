'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

interface Village {
  id: number
  name: string
  status: string
  participantCount: number
  maxParticipantCount: number
  dayCount: number
}

export default function VillageListSection() {
  const { isAuthenticated } = useAuth()
  const [villages, setVillages] = useState<Village[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: 実際のAPIクライアントで置き換える
    const fetchVillages = async () => {
      try {
        setIsLoading(true)
        // モックデータで一時的に実装
        const mockVillages: Village[] = [
          {
            id: 1,
            name: 'テスト村',
            status: '進行中',
            participantCount: 12,
            maxParticipantCount: 16,
            dayCount: 3,
          },
          {
            id: 2,
            name: '初心者歓迎村',
            status: 'プロローグ',
            participantCount: 8,
            maxParticipantCount: 12,
            dayCount: 0,
          },
        ]

        // 2秒後にデータを設定（API呼び出しをシミュレート）
        setTimeout(() => {
          setVillages(mockVillages)
          setIsLoading(false)
        }, 500)
      } catch (err) {
        setError('村一覧の取得に失敗しました')
        setIsLoading(false)
      }
    }

    fetchVillages()
  }, [])

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">開催中の村</h2>
          <div className="text-center">
            <div className="animate-pulse text-gray-600">村情報を読み込み中...</div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">開催中の村</h2>
          <Card className="p-6">
            <div className="text-center text-red-600">{error}</div>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">開催中の村</h2>

        {villages.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-6">現在開催中の村はありません</p>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {villages.map((village) => (
              <Card key={village.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900">{village.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        village.status === '進行中'
                          ? 'bg-green-100 text-green-800'
                          : village.status === 'プロローグ'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {village.status}
                    </span>
                  </div>

                  <div className="text-gray-600 space-y-2">
                    <p>
                      参加者: {village.participantCount}/{village.maxParticipantCount}人
                    </p>
                    <p>日数: {village.dayCount}日目</p>
                  </div>

                  <Link href={`/village/${village.id}`} className="block">
                    <Button className="w-full">村を見る</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated && (
            <Link href="/village/create">
              <Button className="bg-green-600 hover:bg-green-700">村を作成</Button>
            </Link>
          )}
          <Link href="/village-list">
            <Button variant="outline">終了した村</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
