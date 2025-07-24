'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { VillageCard } from '@/components/village/village-card'
import { useAuth } from '@/hooks/useAuth'
import { useVillageListQuery } from '@/hooks/useVillageListQuery'

export default function ParticipatingVillagesSection() {
  const { user } = useAuth()

  // 開催中の村一覧を取得
  const { data: villagesResponse, isLoading } = useVillageListQuery({
    village_status: ['PROLOGUE', 'PROGRESS', 'EPILOGUE'],
  })

  // ユーザーが参加している村をフィルタリング
  const participatingVillages = useMemo(() => {
    if (!user || !villagesResponse?.list) return []

    return villagesResponse.list.filter((village) => {
      // 参加者リストからユーザーを探す
      return village.participant.member_list.some(
        (participant) => participant.player_id?.toString() === user.uid
      )
    })
  }, [user, villagesResponse])

  // ログインしていない場合は表示しない
  if (!user) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">参加している村</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            あなたが現在参加している村の一覧です
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-600">村を読み込み中...</div>
          </div>
        ) : participatingVillages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-6">現在参加している村はありません</p>
            <Button asChild variant="primary">
              <a href="/village-list">村を探す</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participatingVillages.map((village) => (
              <VillageCard key={village.id} village={village} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
