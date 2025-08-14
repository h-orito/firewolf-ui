'use client'

import { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/Button'
import { H2 } from '@/components/ui/Heading'
import { VillageCard } from '@/components/village/VillageCard'
import { useAuth } from '@/hooks/useAuth'
import { useVillageListQuery } from '@/hooks/use-village-list-query'
import { VILLAGE_STATUS_GROUPS } from '@/types/village-status'

export default function ParticipatingVillagesSection() {
  const { user } = useAuth()

  // 開催中の村一覧を取得
  const { data: villagesResponse, isLoading } = useVillageListQuery({
    village_status: [...VILLAGE_STATUS_GROUPS.ACTIVE],
  })

  // ユーザーが参加している村をフィルタリング
  const participatingVillages = useMemo(() => {
    if (!user || !villagesResponse) return []

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

  // ローディング中でない場合で、参加している村がない場合は表示しない
  if (!isLoading && participatingVillages.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-3 md:px-6">
        <div className="text-center mb-12">
          <H2 center>参加している村</H2>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-600">村を読み込み中...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participatingVillages.map((village: any) => (
              <VillageCard key={village.id} village={village} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
