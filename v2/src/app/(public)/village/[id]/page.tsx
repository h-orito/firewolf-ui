'use client'

import { useParams } from 'next/navigation'
import { useVillageQuery } from '@/hooks/useVillageQuery'
import { VillageInfo } from '@/components/village/village-info'
import { ParticipantList } from '@/components/village/participant-list'
import { MessageSection } from '@/components/village/message-section'
import { ActionSection } from '@/components/village/action-section'

export default function VillagePage() {
  const params = useParams()
  const villageId = params.id as string

  const { data: village, isLoading, error } = useVillageQuery(villageId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">村情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !village) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-2">村情報の取得に失敗しました</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* メイン領域 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 村情報 */}
          <VillageInfo village={village} />

          {/* メッセージセクション */}
          <MessageSection village={village} />
        </div>

        {/* サイドバー */}
        <div className="lg:col-span-1 space-y-6">
          <ParticipantList village={village} />

          {/* アクションセクション */}
          <ActionSection village={village} />
        </div>
      </div>
    </div>
  )
}
