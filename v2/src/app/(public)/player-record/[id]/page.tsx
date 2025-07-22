'use client'

import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { usePlayerRecordQuery } from '@/hooks/usePlayerRecordQuery'
import { PlayerInfoSection } from '@/components/player-record/player-info-section'
import { RecordChartSection } from '@/components/player-record/record-chart-section'
import { ParticipateVillageSection } from '@/components/player-record/participate-village-section'

export default function PlayerRecordPage() {
  const params = useParams()
  const playerId = parseInt(params.id as string, 10)

  const { data: playerRecord, isLoading, error } = usePlayerRecordQuery(playerId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">戦績データを読み込み中...</div>
      </div>
    )
  }

  if (error || !playerRecord) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8 text-red-600">戦績データの取得に失敗しました</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">プレイヤー戦績</h1>

      <PlayerInfoSection player={playerRecord.player} wholeRecord={playerRecord.wholeRecord} />

      <RecordChartSection
        campRecordList={playerRecord.campRecordList}
        skillRecordList={playerRecord.skillRecordList}
      />

      <ParticipateVillageSection participateVillageList={playerRecord.participateVillageList} />
    </div>
  )
}
