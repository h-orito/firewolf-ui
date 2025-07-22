'use client'

import { MessagePostForm } from '@/components/village/message-post-form'
import { VoteForm } from '@/components/village/vote-form'
import { useParticipateSituationQuery } from '@/hooks/useParticipateSituationQuery'
import type { components } from '@/types/generated/api'

type Village = components['schemas']['VillageView']

interface ActionSectionProps {
  village: Village
}

export function ActionSection({ village }: ActionSectionProps) {
  const { data: participateSituation, isLoading } = useParticipateSituationQuery(
    village.id.toString()
  )

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 参加者として村にいない場合は何も表示しない
  if (!participateSituation) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* メッセージ投稿フォーム */}
      {participateSituation.say.availableSay && (
        <MessagePostForm village={village} saySituation={participateSituation.say} />
      )}

      {/* 投票フォーム */}
      {participateSituation.vote.availableVote && (
        <VoteForm villageId={village.id} voteSituation={participateSituation.vote} />
      )}
    </div>
  )
}
