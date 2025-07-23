'use client'

import { MessagePostForm } from '@/components/village/message-post-form'
import { VoteForm } from '@/components/village/vote-form'
import { AbilityForm } from '@/components/village/ability-form'
import { CommitForm } from '@/components/village/commit-form'
import { ParticipationForm } from '@/components/village/participation-form'
import { LeaveForm } from '@/components/village/leave-form'
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

  // 参加状況データがない場合は読み込み中表示
  if (!participateSituation) {
    return (
      <div className="text-center p-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 参加者でない場合は参加フォームを表示
  if (!participateSituation.participate.participating) {
    // 参加可能な場合のみ参加フォームを表示
    if (participateSituation.participate.available_participate) {
      return (
        <div className="space-y-6">
          <ParticipationForm
            village={village}
            participateSituation={participateSituation.participate}
            skillRequestSituation={participateSituation.skill_request}
          />
        </div>
      )
    }
    // 参加できない場合は何も表示しない
    return null
  }

  // 参加者の場合は既存のアクションフォームを表示
  return (
    <div className="space-y-6">
      {/* メッセージ投稿フォーム */}
      {participateSituation.say.available_say && (
        <MessagePostForm village={village} saySituation={participateSituation.say} />
      )}

      {/* 投票フォーム */}
      {participateSituation.vote.available_vote && (
        <VoteForm villageId={village.id} voteSituation={participateSituation.vote} />
      )}

      {/* 能力実行フォーム */}
      {participateSituation.ability && participateSituation.ability.list.length > 0 && (
        <AbilityForm villageId={village.id} abilitySituations={participateSituation.ability} />
      )}

      {/* コミットフォーム */}
      {participateSituation.commit.available_commit && (
        <CommitForm villageId={village.id} commitSituation={participateSituation.commit} />
      )}

      {/* 退村フォーム */}
      <LeaveForm village={village} participateSituation={participateSituation.participate} />
    </div>
  )
}
