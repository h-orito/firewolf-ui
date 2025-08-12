'use client'

import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { H1 } from '@/components/ui/Heading'
import { usePlayerRecordQuery } from '@/hooks/use-player-record-query'
import { PlayerInfoSection } from '@/components/pages/player-record/PlayerInfoSection'
import { RecordChartSection } from '@/components/pages/player-record/RecordChartSection'
import { ParticipateVillageSection } from '@/components/pages/player-record/ParticipateVillageSection'

export default function PlayerRecordPage() {
  const params = useParams()
  const playerId = parseInt(params.id as string, 10)

  const { data: playerRecord, isLoading, error } = usePlayerRecordQuery(playerId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 md:px-6 py-6">
        <div className="text-center py-8">戦績データを読み込み中...</div>
      </div>
    )
  }

  if (error || !playerRecord) {
    return (
      <div className="container mx-auto px-3 md:px-6 py-6">
        <div className="text-center py-8 text-red-600">戦績データの取得に失敗しました</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 md:px-6 py-6 space-y-6">
      <H1>プレイヤー戦績</H1>

      <PlayerInfoSection player={playerRecord.player} wholeRecord={playerRecord.whole_record} />

      <RecordChartSection
        campRecordList={playerRecord.camp_record_list}
        skillRecordList={playerRecord.skill_record_list}
      />

      <ParticipateVillageSection participateVillageList={playerRecord.participate_village_list} />
    </div>
  )
}
